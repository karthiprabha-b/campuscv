const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const DATA_TEMPLATES_DIR = path.join(__dirname, '..', 'data', 'templates');
const PUBLIC_TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');
const REGISTRY_PATH = path.join(DATA_TEMPLATES_DIR, 'registry.json');

async function extractZipIfDirMissing(zipPath, targetDir) {
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    return;
  }
  if (!fs.existsSync(zipPath)) {
    return;
  }
  console.log(`Extracting ${path.basename(zipPath)} to ${targetDir}...`);
  fs.mkdirSync(targetDir, { recursive: true });
  const data = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(data);
  for (const [filename, file] of Object.entries(zip.files)) {
    if (file.dir) continue;
    const destPath = path.join(targetDir, filename);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const content = await file.async('nodebuffer');
    fs.writeFileSync(destPath, content);
  }
}

function walkTemplateDir(baseDir) {
  const files = {};

  function walk(dir) {
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
    const keys = Object.keys(files);
    const topDirs = new Set(keys.map(k => k.split('/')[0]).filter(Boolean));
    if (topDirs.size === 1 && keys.every(k => k.includes('/'))) {
      const prefix = Array.from(topDirs)[0] + '/';
      const strippedFiles = {};
      Object.entries(files).forEach(([key, content]) => {
        const cleanKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
        strippedFiles[cleanKey] = content;
        strippedFiles[key] = content;
      });
      Object.assign(files, strippedFiles);
    }
  } catch (err) {
    console.error('Error reading dir:', baseDir, err);
  }

  return files;
}

// 13 Unique Canonical Templates (One real entry each)
const canonicalTemplates = [
  {
    id: 'cs-portfolio',
    dir: 'cs-portfolio',
    name: 'Computer Science & Developer',
    category: 'Developer',
    planTier: 'monthly',
    thumbnail: '/templates/cs/thumbnail.png'
  },
  {
    id: 'designer-portfolio',
    dir: 'Designer portfolio',
    name: 'Product Designer & UI',
    category: 'Designer',
    planTier: 'monthly',
    thumbnail: '/templates/designer/thumbnail.png'
  },
  {
    id: 'stu-creative-bold',
    dir: 'stu-creative-bold',
    zipPath: path.join(PUBLIC_TEMPLATES_DIR, 'stu-creative-bold.zip'),
    name: 'Creative Bold Student',
    category: 'Student',
    planTier: 'monthly',
    thumbnail: '/templates/student/thumbnail.png'
  },
  {
    id: 'doctor-portfolio',
    dir: 'Doctor',
    name: 'Consultant Physician & Medical',
    category: 'Medical',
    planTier: 'monthly',
    thumbnail: '/templates/doctor/thumbnail.png'
  },
  {
    id: 'slash-model',
    dir: 'slash model',
    name: 'Slash Model Portfolio',
    category: 'Developer',
    planTier: 'monthly',
    thumbnail: '/templates/slash/thumbnail.png'
  },
  {
    id: 'static-panel',
    dir: 'Static Panel',
    name: 'Static Panel Portfolio',
    category: 'Student',
    planTier: 'quarterly',
    thumbnail: '/templates/static-panel/thumbnail.png'
  },
  {
    id: 'centerd',
    dir: 'centerd',
    name: 'Centered Minimal Portfolio',
    category: 'Minimalist',
    planTier: 'monthly',
    thumbnail: '/templates/centerd/thumbnail.png'
  },
  {
    id: 'card',
    dir: 'Card',
    name: 'Card Deck Portfolio',
    category: 'Developer',
    planTier: 'monthly',
    thumbnail: '/templates/card/thumbnail.png'
  },
  {
    id: 'stu_lawyer',
    dir: 'stu_lawyer',
    name: 'Executive Legal & Corporate',
    category: 'Legal & Executive',
    planTier: 'yearly',
    thumbnail: '/templates/lawyer/thumbnail.png'
  },
  {
    id: 'photography-portfolio',
    dir: 'photography',
    name: 'Editorial & Visual Photography',
    category: 'Photography',
    planTier: 'yearly',
    thumbnail: '/templates/photography/thumbnail.png'
  },
  {
    id: 'agri-student',
    dir: 'Agri Student',
    name: 'Agronomy & Precision Agriculture',
    category: 'Agriculture',
    planTier: 'yearly',
    thumbnail: '/templates/agri/thumbnail.png'
  },
  {
    id: 'beautician-portfolio',
    dir: 'Beautician',
    name: 'Beautician & Aesthetician',
    category: 'Beauty & Wellness',
    planTier: 'yearly',
    thumbnail: '/templates/beautician/thumbnail.png'
  },
  {
    id: 'engineering-portfolio',
    dir: 'Engineering',
    name: 'Engineering & Systems Architect',
    category: 'Developer & Engineering',
    planTier: 'yearly',
    thumbnail: '/templates/engineering/thumbnail.png'
  }
];

async function main() {
  const newRegistry = {};

  for (const tmpl of canonicalTemplates) {
    const dirPath = path.join(DATA_TEMPLATES_DIR, tmpl.dir);
    if (!fs.existsSync(dirPath) && tmpl.zipPath) {
      await extractZipIfDirMissing(tmpl.zipPath, dirPath);
    }

    if (fs.existsSync(dirPath)) {
      const files = walkTemplateDir(dirPath);
      console.log(`Registering canonical template "${tmpl.id}" from "${tmpl.dir}" with ${Object.keys(files).length} files...`);

      let manifest = {};
      try {
        const mf = files['manifest.json'] || files['src/manifest.json'];
        if (mf) manifest = JSON.parse(mf);
      } catch (e) {}

      function getBestTemplateCode(files) {
        const candidates = [
          'src/template.jsx', 'src/template.tsx',
          'src/index.jsx', 'src/index.tsx',
          'src/App.tsx', 'src/App.jsx',
          'src/app/page.tsx', 'src/app/page.jsx',
          'template.jsx', 'template.tsx',
          'index.jsx', 'index.tsx',
          'App.jsx', 'App.tsx'
        ];
        for (const cand of candidates) {
          const code = files[cand];
          if (code && typeof code === 'string' && code.length > 200 && !code.trim().startsWith('export { default }') && !code.trim().startsWith('import Template from')) {
            return code;
          }
        }
        for (const cand of candidates) {
          if (files[cand] && typeof files[cand] === 'string' && files[cand].length > 50) {
            return files[cand];
          }
        }
        return '';
      }

      newRegistry[tmpl.id] = {
        id: tmpl.id,
        name: tmpl.name || manifest.name || tmpl.id,
        category: tmpl.category || manifest.category || 'Developer',
        planTier: tmpl.planTier || 'monthly',
        version: manifest.version || '1.0.0',
        currentVersionId: 'v1',
        status: 'active',
        thumbnail: manifest.thumbnail || tmpl.thumbnail || 'thumbnail.png',
        preview: manifest.preview || 'preview.png',
        description: manifest.description || tmpl.name,
        sections: manifest.sections || ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [{ versionId: 'v1', version: manifest.version || '1.0.0', sourcePath: `data/templates/${tmpl.dir}`, createdAt: new Date().toISOString() }],
        sectionFiles: files,
        templateCode: getBestTemplateCode(files),
        customCSS: files['src/styles/styles.css'] || files['src/styles/globals.css'] || files['src/index.css'] || files['src/globals.css'] || ''
      };
    }
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(newRegistry, null, 2), 'utf-8');
  console.log(`\nSUCCESS: Template registry cleanly rebuilt with ${Object.keys(newRegistry).length} unique canonical templates!`);
}

main().catch(console.error);
