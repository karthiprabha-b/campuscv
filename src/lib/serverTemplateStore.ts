import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

// Base directory for persistent server-side template storage
const DATA_TEMPLATES_DIR = path.join(process.cwd(), 'data', 'templates');

const TEMPLATE_BASE_DIRS_FALLBACK: Record<string, string> = {};

/**
 * Ensures the target directory exists.
 */
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves template files persistently to disk under `data/templates/[templateId]/[versionId]/`.
 */
export function saveTemplateFilesServer(templateId: string, files: Record<string, string>, versionId?: string): string {
  if (!templateId) throw new Error('saveTemplateFilesServer: templateId is required');
  if (!files || typeof files !== 'object') throw new Error('saveTemplateFilesServer: files object is required');

  const finalVersionId = versionId || `v_${Date.now()}`;
  const templateDir = path.join(DATA_TEMPLATES_DIR, templateId, finalVersionId);
  ensureDir(templateDir);

  const rootDir = path.join(DATA_TEMPLATES_DIR, templateId);
  ensureDir(rootDir);

  console.log(`[TEMPLATE VERSION CREATED] templateId="${templateId}" versionId="${finalVersionId}" path="${templateDir}" | fileCount=${Object.keys(files).length}`);

  Object.entries(files).forEach(([relPath, content]) => {
    const normalizedRel = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
    const fullPath = path.join(templateDir, normalizedRel);
    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, content, 'utf-8');

    const rootPath = path.join(rootDir, normalizedRel);
    ensureDir(path.dirname(rootPath));
    fs.writeFileSync(rootPath, content, 'utf-8');
  });

  return finalVersionId;
}

/**
 * Recursively walks a directory and returns a map of relative file paths to file content string.
 */
export function walkTemplateDir(baseDir: string): Record<string, string> {
  const files: Record<string, string> = {};

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (['node_modules', '.git', '.next', 'dist', 'build'].includes(file) || file.startsWith('tplver_') || file.startsWith('v_') || file.endsWith('.d.ts')) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx|jsx|ts|js|json|css|scss|sass|less|html|mjs|cjs|svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|ttf|otf|eot)$/i.test(file) && !file.endsWith('.d.ts')) {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        // Do not return binary image data as utf-8 string if not text
        if (/\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf|eot)$/i.test(file)) {
          const buf = fs.readFileSync(fullPath);
          let mime = 'image/png';
          if (buf[0] === 0xFF && buf[1] === 0xD8) mime = 'image/jpeg';
          else if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) mime = 'image/png';
          else if (file.endsWith('.svg') || buf.toString('utf8', 0, 10).includes('<svg')) mime = 'image/svg+xml';
          else if (file.endsWith('.webp')) mime = 'image/webp';
          else if (file.endsWith('.gif')) mime = 'image/gif';
          else if (file.endsWith('.woff2')) mime = 'font/woff2';
          else if (file.endsWith('.woff')) mime = 'font/woff';
          else if (file.endsWith('.ttf')) mime = 'font/ttf';
          files[relPath] = `data:${mime};base64,` + buf.toString('base64');
        } else {
          files[relPath] = fs.readFileSync(fullPath, 'utf-8');
        }
      }
    }
  }

  try {
    walk(baseDir);

    // Normalize nested directory prefixes and register stripped key aliases
    const keys = Object.keys(files);

    // Detect single top-level folder wrapper (e.g. "student-portfolio/...")
    const topDirs = new Set(keys.map(k => k.split('/')[0]).filter(Boolean));
    if (topDirs.size === 1 && keys.every(k => k.includes('/'))) {
      const prefix = Array.from(topDirs)[0] + '/';
      const strippedFiles: Record<string, string> = {};
      Object.entries(files).forEach(([key, content]) => {
        const cleanKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
        strippedFiles[cleanKey] = content;
        strippedFiles[key] = content;
      });
      Object.assign(files, strippedFiles);
    }

    const entries = Object.entries(files);
    entries.forEach(([key, content]) => {
      if (key.includes('/')) {
        const parts = key.split('/');

        // Strip top folder name (e.g. "student-portfolio/template.jsx" -> "template.jsx")
        const topFolderStripped = parts.slice(1).join('/');
        if (topFolderStripped && !files[topFolderStripped]) {
          files[topFolderStripped] = content;
        }

        const srcIdx = parts.indexOf('src');
        if (srcIdx !== -1) {
          const normKey = parts.slice(srcIdx).join('/');
          if (!files[normKey]) files[normKey] = content;
          const subKey = parts.slice(srcIdx + 1).join('/');
          if (subKey && !files[subKey]) files[subKey] = content;
        }

        // Register compiled CSS aliases
        if (key.endsWith('.css') && (key.includes('/dist/') || key.includes('/assets/'))) {
          const cssName = key.split('/').pop() || 'compiled.css';
          if (!files[`dist/assets/${cssName}`]) files[`dist/assets/${cssName}`] = content;
          if (!files[`assets/${cssName}`]) files[`assets/${cssName}`] = content;
          if (!files[cssName]) files[cssName] = content;
        }
      }
    });
  } catch (err) {
    console.error('[serverTemplateStore] Error reading template dir:', baseDir, err);
  }

  return files;
}

function findPreferredEntry(files: Record<string, string>): string {
  // 1. Check manifest.json or campuscv.json entry point
  for (const manifestKey of ['manifest.json', 'campuscv.json', 'src/manifest.json']) {
    if (files[manifestKey]) {
      try {
        const parsed = JSON.parse(files[manifestKey]);
        const manifestEntry = parsed.entry || parsed.main || parsed.template?.entry;
        if (manifestEntry && manifestEntry !== 'index.html') {
          const match = Object.keys(files).find(k => k === manifestEntry || k.endsWith('/' + manifestEntry));
          if (match) return match;
        }
      } catch (e) { }
    }
  }

  const keys = Object.keys(files);
  const preferred = [
    'src/index.jsx', 'src/index.tsx', 'src/index.js', 'src/index.ts',
    'src/template.jsx', 'src/template.tsx', 'src/App.jsx', 'src/App.tsx',
    'src/Portfolio.jsx', 'src/Portfolio.tsx', 'Portfolio.jsx', 'Portfolio.tsx',
    'src/app/page.tsx', 'src/app/page.jsx', 'app/page.tsx', 'app/page.jsx',
    'index.jsx', 'index.tsx', 'template.jsx', 'template.tsx', 'App.jsx', 'App.tsx'
  ];
  for (const p of preferred) {
    const match = keys.find(k => k === p || k.endsWith('/' + p));
    if (match) return match;
  }
  return keys.find(f => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.js')) || keys[0] || 'src/index.jsx';
}

/**
 * Gets template files persistently from disk for a given templateId and optional versionId.
 */
export function getTemplateFilesServer(templateId: string, versionId?: string): { templateId: string; versionId?: string; entryFile?: string; files: Record<string, string> } | null {
  if (!templateId) return null;
  const templateRootDir = path.join(DATA_TEMPLATES_DIR, templateId);

  // 1. Check registry.json first for pre-bundled sectionFiles
  const registry = loadRegistryServer();
  const regRecord = registry[templateId] || registry[templateId.toLowerCase()] || registry[templateId.replace(/[\s_-]+/g, '-')] || registry[templateId.replace(/[\s-]+/g, '_')];
  if (regRecord?.sectionFiles && Object.keys(regRecord.sectionFiles).length > 0) {
    console.log(`[SERVER TEMPLATE LOAD] Loaded directly from server registry: templateId="${templateId}" | fileCount: ${Object.keys(regRecord.sectionFiles).length}`);
    const entryFile = findPreferredEntry(regRecord.sectionFiles);
    return { templateId, versionId: regRecord.currentVersionId || 'v1', entryFile, files: regRecord.sectionFiles };
  }

  // 1.5 Direct live root check: If data/templates/[templateId]/src exists, ALWAYS load directly from live root directory
  if (fs.existsSync(templateRootDir)) {
    const rootSrc = path.join(templateRootDir, 'src');
    if (fs.existsSync(rootSrc)) {
      const files = walkTemplateDir(templateRootDir);
      if (Object.keys(files).length > 0) {
        console.log(`[SERVER TEMPLATE LOAD] Loaded directly from live root template dir: templateId="${templateId}" | fileCount: ${Object.keys(files).length}`);
        const entryFile = findPreferredEntry(files);
        return { templateId, versionId: 'root', entryFile, files };
      }
    }
  }

  const targetVersionId = versionId || regRecord?.currentVersionId;

  // 2. Check targetVersionId directory under data/templates/[templateId]/[targetVersionId]
  if (targetVersionId) {
    const versionDir = path.join(DATA_TEMPLATES_DIR, templateId, targetVersionId);
    if (fs.existsSync(versionDir)) {
      const files = walkTemplateDir(versionDir);
      if (Object.keys(files).length > 0) {
        console.log(`[SERVER TEMPLATE LOAD] Found versioned template: templateId="${templateId}" versionId="${targetVersionId}" | fileCount: ${Object.keys(files).length}`);
        const entryFile = findPreferredEntry(files);
        return { templateId, versionId: targetVersionId, entryFile, files };
      }
    }
  }

  // 2.5 Auto-discover latest tplver_* directory under data/templates/[templateId]/ if targetVersionId missed
  if (fs.existsSync(templateRootDir)) {
    try {
      const subdirs = fs.readdirSync(templateRootDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.startsWith('tplver_'))
        .map(d => d.name)
        .sort()
        .reverse();

      if (subdirs.length > 0) {
        const latestVer = subdirs[0];
        const versionDir = path.join(templateRootDir, latestVer);
        const files = walkTemplateDir(versionDir);
        if (Object.keys(files).length > 0) {
          console.log(`[SERVER TEMPLATE LOAD] Found latest versioned subdirectory: templateId="${templateId}" versionId="${latestVer}" | fileCount: ${Object.keys(files).length}`);
          const entryFile = findPreferredEntry(files);
          return { templateId, versionId: latestVer, entryFile, files };
        }
      }
    } catch (e) { }
  }

  const KNOWN_TEMPLATE_DIR_MAP: Record<string, string[]> = {
    'student-portfolio': ['stu-creative-bold'],
    'student': ['stu-creative-bold'],
    'student_portfolio': ['stu-creative-bold'],
    'stu-creative-bold': ['stu-creative-bold'],
    'creative-bold': ['stu-creative-bold'],
    'doctor-portfolio': ['Doctor', 'doctor'],
    'doctor': ['Doctor', 'doctor'],
    'designer-portfolio': ['Designer portfolio', 'designer-portfolio'],
    'designer': ['Designer portfolio', 'designer-portfolio'],
    'slash-model': ['slash model', 'slash-model'],
    'slash': ['slash model', 'slash-model'],
    'static-panel': ['Static Panel', 'static-panel'],
    'static': ['Static Panel', 'static-panel'],
    'centerd': ['centerd', 'Centered'],
    'centered': ['centerd', 'Centered'],
    'card': ['Card', 'card'],
    'card-deck': ['Card', 'card'],
    'executive-lawyer-portfolio': ['stu_lawyer', 'stu-lawyer'],
    'executive lawyer': ['stu_lawyer', 'stu-lawyer'],
    'executive lawyer portfolio': ['stu_lawyer', 'stu-lawyer'],
    'executive legal & executive': ['stu_lawyer', 'stu-lawyer'],
    'stu_lawyer': ['stu_lawyer', 'stu-lawyer'],
    'stu lawyer': ['stu_lawyer', 'stu-lawyer'],
    'stu-lawyer': ['stu_lawyer', 'stu-lawyer'],
    'lawyer': ['stu_lawyer', 'stu-lawyer'],
    'beautician-portfolio': ['Beautician', 'beautician'],
    'beautician': ['Beautician', 'beautician'],
    'beauty': ['Beautician', 'beautician'],
    'agri-student': ['Agri Student', 'agri-student', 'agri_student'],
    'agri_student': ['Agri Student', 'agri-student', 'agri_student'],
    'agri': ['Agri Student', 'agri-student'],
    'agronomy': ['Agri Student', 'agri-student'],
    'photography-portfolio': ['photography', 'Photography'],
    'photography': ['photography', 'Photography'],
    'photographer': ['photography', 'Photography'],
    'engineering-portfolio': ['Engineering', 'engineering'],
    'engineering': ['Engineering', 'engineering'],
    'engineer': ['Engineering', 'engineering'],
    'engineering-build': ['Engineering', 'engineering']
  };

  const directMapped = KNOWN_TEMPLATE_DIR_MAP[templateId.toLowerCase().trim()] || [];

  const candidates = Array.from(new Set([
    ...directMapped,
    templateId,
    templateId.toLowerCase(),
    templateId.charAt(0).toUpperCase() + templateId.slice(1),
    templateId.replace(/-portfolio$/i, ''),
    templateId.replace(/portfolio$/i, ''),
    templateId.replace(/[-_]/g, ' '),
    templateId.replace(/\s+/g, '-').toLowerCase(),
    templateId.replace(/\s+/g, '_').toLowerCase(),
    templateId.replace(/[-_]/g, '_').toLowerCase(),
    templateId.replace(/[-_]/g, '-').toLowerCase(),
    templateId.replace(/\s+/g, ''),
    templateId.replace(/-+$/, ''),
    templateId.replace(/-\d+-?$/, ''),
    templateId.replace(/-\d*$/, ''),
  ])).filter(Boolean);

  for (const candId of candidates) {
    // 1. Primary storage: `data/templates/[candId]/`
    const primaryDir = path.join(DATA_TEMPLATES_DIR, candId);
    if (fs.existsSync(primaryDir)) {
      // Check for versioned subdirectories inside primaryDir
      const subdirs = fs.readdirSync(primaryDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && (d.name.startsWith('tplver_') || d.name.startsWith('v_')))
        .map(d => d.name)
        .sort()
        .reverse();

      if (subdirs.length > 0) {
        const verDir = path.join(primaryDir, subdirs[0]);
        const verFiles = walkTemplateDir(verDir);
        if (Object.keys(verFiles).length > 0) {
          console.log(`[SERVER TEMPLATE LOAD] Found versioned disk template for: "${candId}" (requested: "${templateId}") | fileCount: ${Object.keys(verFiles).length}`);
          const entryFile = findPreferredEntry(verFiles);
          return { templateId, versionId: subdirs[0], entryFile, files: verFiles };
        }
      }

      const files = walkTemplateDir(primaryDir);
      if (Object.keys(files).length > 0) {
        console.log(`[SERVER TEMPLATE LOAD] Found primary disk template for: "${candId}" (requested: "${templateId}") | fileCount: ${Object.keys(files).length}`);
        const entryFile = findPreferredEntry(files);
        return { templateId, entryFile, files };
      }
    }

    // 2. Secondary storage: `public/templates/[candId]/`
    const publicDir = path.join(process.cwd(), 'public', 'templates', candId);
    if (fs.existsSync(publicDir)) {
      const files = walkTemplateDir(publicDir);
      if (Object.keys(files).length > 0) {
        console.log(`[SERVER TEMPLATE LOAD] Found public disk template for: "${candId}" (requested: "${templateId}") | fileCount: ${Object.keys(files).length}`);
        const entryFile = findPreferredEntry(files);
        return { templateId, entryFile, files };
      }
    }

    // 3. Tertiary storage: `src/templates/[candId]/`
    const secondaryDir = path.join(process.cwd(), 'src', 'templates', candId);
    if (fs.existsSync(secondaryDir)) {
      const files = walkTemplateDir(secondaryDir);
      if (Object.keys(files).length > 0) {
        console.log(`[SERVER TEMPLATE LOAD] Found secondary disk template for: "${candId}" (requested: "${templateId}") | fileCount: ${Object.keys(files).length}`);
        const entryFile = findPreferredEntry(files);
        return { templateId, entryFile, files };
      }
    }
  }

  // 3. Fallback scan: inspect all subdirectories of DATA_TEMPLATES_DIR to match directory names case-insensitively or manifest.json id
  if (fs.existsSync(DATA_TEMPLATES_DIR)) {
    try {
      const cleanTarget = templateId.toLowerCase().replace(/[-_\s]/g, '');
      const allDirs = fs.readdirSync(DATA_TEMPLATES_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
      for (const dirEnt of allDirs) {
        const cleanDirName = dirEnt.name.toLowerCase().replace(/[-_\s]/g, '');
        const subDirPath = path.join(DATA_TEMPLATES_DIR, dirEnt.name);

        if (cleanDirName === cleanTarget || cleanDirName === cleanTarget.replace(/portfolio$/, '') || cleanTarget === cleanDirName.replace(/portfolio$/, '')) {
          const files = walkTemplateDir(subDirPath);
          if (Object.keys(files).length > 0) {
            console.log(`[SERVER TEMPLATE LOAD] Found directory matched disk template in "${dirEnt.name}" for: "${templateId}" | fileCount: ${Object.keys(files).length}`);
            const entryFile = findPreferredEntry(files);
            return { templateId, entryFile, files };
          }
        }

        const manifestPath = path.join(subDirPath, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          try {
            const mf = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            if (
              mf.id === templateId ||
              mf.id?.toLowerCase() === templateId.toLowerCase() ||
              mf.id?.toLowerCase().replace(/[-_\s]/g, '') === cleanTarget ||
              mf.name?.toLowerCase() === templateId.toLowerCase() ||
              mf.name?.toLowerCase().replace(/[-_\s]/g, '') === cleanTarget
            ) {
              const files = walkTemplateDir(subDirPath);
              if (Object.keys(files).length > 0) {
                console.log(`[SERVER TEMPLATE LOAD] Found manifest matched disk template in "${dirEnt.name}" for: "${templateId}" | fileCount: ${Object.keys(files).length}`);
                const entryFile = findPreferredEntry(files);
                return { templateId, entryFile, files };
              }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  console.warn(`[SERVER TEMPLATE LOAD FAILED] No template files found on disk for templateId: "${templateId}"`);
  return null;
}

const REGISTRY_FILE = path.join(DATA_TEMPLATES_DIR, 'registry.json');

export interface PersistentTemplateRecord {
  id: string;
  name: string;
  category: string;
  version: string;
  currentVersionId: string;
  planTier?: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'pro' | string;
  author?: string;
  description?: string;
  thumbnail?: string;
  sections?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  versions: Array<{
    versionId: string;
    version: string;
    sourcePath: string;
    createdAt: string;
  }>;
  [key: string]: any;
}

export function loadRegistryServer(): Record<string, PersistentTemplateRecord> {
  ensureDir(DATA_TEMPLATES_DIR);
  if (!fs.existsSync(REGISTRY_FILE)) return {};
  try {
    const raw = fs.readFileSync(REGISTRY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[serverTemplateStore] Error reading registry.json:', e);
    return {};
  }
}

export function saveRegistryServer(registry: Record<string, PersistentTemplateRecord>): void {
  ensureDir(DATA_TEMPLATES_DIR);
  try {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (e) {
    console.error('[serverTemplateStore] Error writing registry.json:', e);
  }
}

export function registerTemplateVersionServer(record: Partial<PersistentTemplateRecord> & { id: string }, versionId: string): PersistentTemplateRecord {
  const registry = loadRegistryServer();
  const templateId = record.id;
  const existing = registry[templateId] || {
    id: templateId,
    name: record.name || templateId,
    category: record.category || 'Developer',
    version: record.version || '1.0.0',
    currentVersionId: versionId,
    versions: [],
    createdAt: new Date().toISOString()
  };

  const newVersionItem = {
    versionId,
    version: record.version || existing.version || '1.0.0',
    sourcePath: `data/templates/${templateId}/${versionId}`,
    createdAt: new Date().toISOString()
  };

  const existingVersions = existing.versions || [];
  const updatedVersions = [newVersionItem, ...existingVersions.filter(v => v.versionId !== versionId)];

  const updatedRecord: PersistentTemplateRecord = {
    ...existing,
    ...record,
    id: templateId,
    currentVersionId: versionId,
    version: record.version || existing.version || '1.0.0',
    updatedAt: new Date().toISOString(),
    versions: updatedVersions
  };

  registry[templateId] = updatedRecord;
  saveRegistryServer(registry);

  console.log(`[TEMPLATE UPLOAD] templateId=${templateId} newVersionId=${versionId} version=${updatedRecord.version} sourcePath=${newVersionItem.sourcePath}`);
  console.log(`[TEMPLATE VERSION PERSISTED] templateId=${templateId} versionId=${versionId} version=${updatedRecord.version}`);
  console.log(`[TEMPLATE CURRENT VERSION UPDATED] templateId=${templateId} currentVersionId=${versionId}`);

  return updatedRecord;
}

export function rollbackTemplateVersionServer(templateId: string, targetVersionId: string): PersistentTemplateRecord | null {
  const registry = loadRegistryServer();
  const existing = registry[templateId];
  if (!existing) return null;

  const foundVersion = (existing.versions || []).find(v => v.versionId === targetVersionId || v.version === targetVersionId);
  if (!foundVersion) return null;

  existing.currentVersionId = foundVersion.versionId;
  existing.version = foundVersion.version;
  existing.updatedAt = new Date().toISOString();

  registry[templateId] = existing;
  saveRegistryServer(registry);

  console.log(`[TEMPLATE ROLLBACK] templateId=${templateId} targetVersionId=${foundVersion.versionId} version=${foundVersion.version}`);
  return existing;
}

export function updateTemplateStatusServer(templateId: string, status: 'active' | 'disabled' | 'deleted'): PersistentTemplateRecord | null {
  if (!templateId) return null;
  const registry = loadRegistryServer();
  const existing = registry[templateId];
  if (!existing) return null;

  existing.status = status;
  existing.updatedAt = new Date().toISOString();
  registry[templateId] = existing;
  saveRegistryServer(registry);

  console.log(`[TEMPLATE STATUS UPDATE] templateId=${templateId} status=${status}`);
  return existing;
}

export function updateTemplateMetadataServer(templateId: string, meta: Partial<PersistentTemplateRecord>): PersistentTemplateRecord | null {
  if (!templateId) return null;
  const registry = loadRegistryServer();
  const existing = registry[templateId];
  if (!existing) return null;

  Object.assign(existing, meta);
  existing.updatedAt = new Date().toISOString();
  registry[templateId] = existing;
  saveRegistryServer(registry);

  console.log(`[TEMPLATE METADATA UPDATE] templateId=${templateId}`);
  return existing;
}

/**
 * Lists templates from server disk registry filtered by status.
 * By default, returns only ACTIVE templates.
 * Auto-discovers any new template directories on disk and keeps registry.json synced.
 */
export function listAllDiskTemplates(options: { includeDisabled?: boolean; includeDeleted?: boolean } | boolean = false): PersistentTemplateRecord[] {
  let includeDisabled = false;
  let includeDeleted = false;

  if (typeof options === 'boolean') {
    includeDeleted = options;
    includeDisabled = options;
  } else if (typeof options === 'object' && options !== null) {
    includeDisabled = !!options.includeDisabled;
    includeDeleted = !!options.includeDeleted;
  }

  const registry = loadRegistryServer();
  let registryUpdated = false;

  // Auto-scan DATA_TEMPLATES_DIR for any directories not yet recorded in registry
  if (fs.existsSync(DATA_TEMPLATES_DIR)) {
    const junkPatterns = ['heavy-designer-70mb', 'designer-portfolio-30mb', 'runtime-template-test', 'designer-portfolio-6-'];
    try {
      const dirs = fs.readdirSync(DATA_TEMPLATES_DIR);
      for (const dirName of dirs) {
        if (junkPatterns.includes(dirName) || dirName.startsWith('.')) continue;
        if (registry[dirName]) continue; // Already in registry

        const fullPath = path.join(DATA_TEMPLATES_DIR, dirName);
        if (fs.statSync(fullPath).isDirectory()) {
          const files = walkTemplateDir(fullPath);
          const fileCount = Object.keys(files).length;
          if (fileCount > 0) {
            let manifest: any = null;
            const manifestContent = files['manifest.json'] || files['src/manifest.json'];
            if (manifestContent) {
              try { manifest = JSON.parse(manifestContent); } catch (e) { }
            }
            let thumbUrl = manifest?.thumbnail || '';
            if (!thumbUrl || (!thumbUrl.startsWith('data:') && !thumbUrl.startsWith('http'))) {
              // Search in files map for any image data URL
              const imgKey = Object.keys(files).find(k => /(thumbnail|preview|cover|hero-portrait|portrait)\.(png|jpg|jpeg|webp)$/i.test(k) && files[k]?.startsWith('data:'));
              if (imgKey && files[imgKey]) {
                thumbUrl = files[imgKey];
              } else {
                const thumbCandidates = [thumbUrl, 'thumbnail.png', 'thumbnail.jpg', 'thumbnail.webp', 'preview.png'].filter(Boolean);
                for (const tf of thumbCandidates) {
                  const tp = path.join(fullPath, tf);
                  if (fs.existsSync(tp) && !fs.statSync(tp).isDirectory()) {
                    const tb = fs.readFileSync(tp);
                    const ext = tf.split('.').pop()?.toLowerCase() || 'png';
                    const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : (ext === 'webp' ? 'image/webp' : 'image/png');
                    thumbUrl = `data:${mime};base64,${tb.toString('base64')}`;
                    break;
                  }
                }
              }
            }
            if (!thumbUrl) {
              thumbUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
            }

            const defaultVersionId = 'v1';
            const newRecord: PersistentTemplateRecord = {
              id: dirName,
              name: manifest?.name || dirName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
              category: manifest?.category || 'Developer',
              version: manifest?.version || '1.0.0',
              currentVersionId: defaultVersionId,
              status: 'active',
              thumbnail: thumbUrl || 'thumbnail.png',
              preview: manifest?.preview || 'preview.png',
              description: manifest?.description || 'Portfolio template',
              sections: manifest?.sections ? manifest.sections.map((s: any) => typeof s === 'string' ? s : (s.name || s.id || String(s))) : ['Hero', 'About', 'Projects', 'Contact'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              versions: [{ versionId: defaultVersionId, version: manifest?.version || '1.0.0', sourcePath: `data/templates/${dirName}`, createdAt: new Date().toISOString() }]
            };
            registry[dirName] = newRecord;
            registryUpdated = true;
            console.log(`[TEMPLATE DISCOVERY] Auto-registered disk template "${dirName}" into registry.json`);
          }
        }
      }
    } catch (e) {
      console.error('[serverTemplateStore] Error auto-discovering disk templates:', e);
    }
  }

  if (registryUpdated) {
    saveRegistryServer(registry);
  }

  const list = Object.values(registry).filter(t => {
    const status = t.status || 'active';
    if (status === 'deleted') return includeDeleted;
    if (status === 'disabled') return includeDisabled || includeDeleted;
    return true; // active
  });

  return list;
}

/**
 * Permanently deletes a template from registry.json, versions, disk directory, and cached metadata.
 */
export function deleteTemplateServer(templateId: string, permanent: boolean = true): { success: boolean; softDeleted: boolean; message: string } {
  if (!templateId) return { success: false, softDeleted: false, message: 'templateId is required' };

  const registry = loadRegistryServer();

  if (registry[templateId]) {
    delete registry[templateId];
    saveRegistryServer(registry);
  }

  const targetDir = path.join(DATA_TEMPLATES_DIR, templateId);
  if (fs.existsSync(targetDir)) {
    try {
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`[TEMPLATE PERMANENT DELETE] Removed directory "${targetDir}"`);
    } catch (e) {
      console.error(`[TEMPLATE DELETE ERROR] Failed removing directory "${targetDir}":`, e);
    }
  }

  // Also clean up any secondary disk directory under src/templates/[templateId] if exists
  const secondaryDir = path.join(process.cwd(), 'src', 'templates', templateId);
  if (fs.existsSync(secondaryDir)) {
    try {
      fs.rmSync(secondaryDir, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log(`[TEMPLATE PERMANENT DELETE COMPLETE] Purged templateId=${templateId} from disk and registry.`);
  return { success: true, softDeleted: false, message: `Template '${templateId}' permanently deleted.` };
}

/**
 * Extracts a template ZIP Buffer directly to persistent server storage on disk,
 * discovers metadata and manifest, and registers the version in registry.json.
 * Supports large archives up to 1 GB efficiently.
 */
export async function extractAndSaveZipServer(
  zipSource: Buffer | string,
  options?: {
    templateId?: string;
    versionId?: string;
    overrideMetadata?: Partial<PersistentTemplateRecord>;
  }
): Promise<{
  templateId: string;
  versionId: string;
  record: PersistentTemplateRecord;
  fileCount: number;
}> {
  const zipBuffer = typeof zipSource === 'string' ? fs.readFileSync(zipSource) : zipSource;
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(zipBuffer);
  const fileNames = Object.keys(zipContent.files);

  // 1. Determine templateId from manifest or option
  let manifestObj: any = null;
  const manifestEntry = zipContent.file('manifest.json') || zipContent.file(/manifest\.json$/i)[0];
  if (manifestEntry) {
    try {
      const manifestText = await manifestEntry.async('text');
      manifestObj = JSON.parse(manifestText);
    } catch (e) {}
  }

  let candidateId = options?.templateId;
  if (candidateId === 'undefined' || candidateId === 'null' || !candidateId) {
    candidateId = undefined;
  }
  const manifestId = (manifestObj?.id && manifestObj.id !== 'undefined') ? manifestObj.id : undefined;
  const overrideId = (options?.overrideMetadata?.id && options.overrideMetadata.id !== 'undefined') ? options.overrideMetadata.id : undefined;
  const nameFallback = (options?.overrideMetadata?.name || manifestObj?.name) 
    ? String(options?.overrideMetadata?.name || manifestObj?.name).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-')
    : undefined;

  const rawId = candidateId || manifestId || overrideId || nameFallback || `tpl-${Date.now()}`;
  const targetId = String(rawId).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || 'custom-template';
  const versionId = options?.versionId || `tplver_${Date.now()}`;

  const versionDir = path.join(DATA_TEMPLATES_DIR, targetId, versionId);
  ensureDir(versionDir);
  const rootDir = path.join(DATA_TEMPLATES_DIR, targetId);
  ensureDir(rootDir);

  let extractedCount = 0;
  for (const relPath of fileNames) {
    const entry = zipContent.files[relPath];
    if (!entry) continue;

    const normalizedRel = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!normalizedRel || normalizedRel.includes('..') || normalizedRel.startsWith('/')) continue;
    if (normalizedRel.includes('node_modules') || normalizedRel.startsWith('__MACOSX') || normalizedRel.includes('/.DS_Store') || normalizedRel === '.DS_Store') continue;

    const versionPath = path.join(versionDir, normalizedRel);
    const rootPath = path.join(rootDir, normalizedRel);

    // If entry is a directory (flagged by JSZip or ending with slash), ensure directory exists and skip file write
    if (entry.dir || normalizedRel.endsWith('/') || normalizedRel.endsWith('\\')) {
      ensureDir(versionPath);
      ensureDir(rootPath);
      continue;
    }

    try {
      ensureDir(path.dirname(versionPath));
      ensureDir(path.dirname(rootPath));

      // Safety: if the destination path already exists as a directory, do not attempt to write as file
      if ((fs.existsSync(versionPath) && fs.statSync(versionPath).isDirectory()) || 
          (fs.existsSync(rootPath) && fs.statSync(rootPath).isDirectory())) {
        continue;
      }

      const buf = await entry.async('nodebuffer');
      fs.writeFileSync(versionPath, buf);
      fs.writeFileSync(rootPath, buf);
      extractedCount++;
    } catch (writeErr) {
      console.warn(`[ZIP EXTRACT WARN] Skipped writing "${normalizedRel}":`, writeErr);
    }
  }

  // 2. Discover metadata / thumbnail recursively across all extracted files
  let thumbnail = options?.overrideMetadata?.thumbnail || '';
  if (!thumbnail || (!thumbnail.startsWith('data:') && !thumbnail.startsWith('http'))) {
    const rawCandidate = manifestObj?.thumbnail || thumbnail;
    const thumbCandidates = [rawCandidate, 'thumbnail.png', 'thumbnail.jpg', 'thumbnail.webp', 'preview.png', 'cover.png'].filter(Boolean);
    let foundBuf: Buffer | null = null;
    let foundExt = 'png';

    // Check direct paths
    for (const thumbFile of thumbCandidates) {
      const thumbPath = path.join(versionDir, thumbFile);
      const rootThumbPath = path.join(rootDir, thumbFile);
      const resolvedPath = fs.existsSync(thumbPath) ? thumbPath : (fs.existsSync(rootThumbPath) ? rootThumbPath : null);
      if (resolvedPath && !fs.statSync(resolvedPath).isDirectory()) {
        foundBuf = fs.readFileSync(resolvedPath);
        foundExt = thumbFile.split('.').pop()?.toLowerCase() || 'png';
        break;
      }
    }

    // If not found at root, scan all extracted files recursively for any thumbnail / preview image
    if (!foundBuf) {
      function findThumbRecursive(dir: string): { buf: Buffer; ext: string } | null {
        if (!fs.existsSync(dir)) return null;
        const list = fs.readdirSync(dir);
        for (const item of list) {
          if (['node_modules', '.git', '.next'].includes(item)) continue;
          const full = path.join(dir, item);
          const st = fs.statSync(full);
          if (st.isDirectory()) {
            const nested = findThumbRecursive(full);
            if (nested) return nested;
          } else if (/(thumbnail|preview|cover|hero-portrait|portrait)\.(png|jpg|jpeg|webp)$/i.test(item)) {
            const ext = item.split('.').pop()?.toLowerCase() || 'png';
            return { buf: fs.readFileSync(full), ext };
          }
        }
        return null;
      }

      const res = findThumbRecursive(versionDir) || findThumbRecursive(rootDir);
      if (res) {
        foundBuf = res.buf;
        foundExt = res.ext;
      }
    }

    if (foundBuf) {
      const mime = (foundExt === 'jpg' || foundExt === 'jpeg') ? 'image/jpeg' : (foundExt === 'webp' ? 'image/webp' : 'image/png');
      thumbnail = `data:${mime};base64,${foundBuf.toString('base64')}`;

      // Also persist to public/templates/[targetId]/thumbnail.png for direct public URL access
      try {
        const publicTplDir = path.join(process.cwd(), 'public', 'templates', targetId);
        ensureDir(publicTplDir);
        fs.writeFileSync(path.join(publicTplDir, `thumbnail.${foundExt}`), foundBuf);
        fs.writeFileSync(path.join(publicTplDir, `thumbnail.png`), foundBuf);
      } catch (e) {}
    } else {
      thumbnail = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
    }
  }

  const templatePayload: any = {
    id: targetId,
    name: options?.overrideMetadata?.name || manifestObj?.name || targetId,
    version: options?.overrideMetadata?.version || manifestObj?.version || '1.0.0',
    category: options?.overrideMetadata?.category || manifestObj?.category || 'Developer',
    author: options?.overrideMetadata?.author || manifestObj?.author || 'Admin',
    description: options?.overrideMetadata?.description || manifestObj?.description || 'Uploaded template package',
    supportsDarkMode: options?.overrideMetadata?.supportsDarkMode ?? manifestObj?.supportsDarkMode ?? true,
    sections: options?.overrideMetadata?.sections || manifestObj?.sections || ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'],
    status: 'active',
    thumbnail: thumbnail || '/templates/default/thumbnail.png',
    ...(options?.overrideMetadata || {})
  };

  const persistentRecord = registerTemplateVersionServer(templatePayload, versionId);

  return {
    templateId: targetId,
    versionId,
    record: persistentRecord,
    fileCount: extractedCount
  };
}
