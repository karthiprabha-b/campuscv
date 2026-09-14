const fs = require('fs');
const path = require('path');

const DATA_TEMPLATES_DIR = path.join(__dirname, '..', 'data', 'templates');
const REGISTRY_PATH = path.join(DATA_TEMPLATES_DIR, 'registry.json');

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

let registry = {};
if (fs.existsSync(REGISTRY_PATH)) {
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
  } catch (e) {
    registry = {};
  }
}

const templateMapping = {
  'cs-portfolio': 'cs-portfolio',
  'designer-portfolio': 'Designer portfolio',
  'Designer portfolio': 'Designer portfolio',
  'stu-creative-bold': 'stu-creative-bold',
  'stu_creative_bold': 'stu-creative-bold',
  'Stu_creative_bold': 'stu-creative-bold',
  'student-portfolio': 'stu-creative-bold',
  'doctor-portfolio': 'Doctor',
  'Doctor': 'Doctor',
  'slash-model': 'slash model',
  'slash model': 'slash model',
  'static-panel': 'Static Panel',
  'Static Panel': 'Static Panel',
  'centerd': 'centerd',
  'Centered': 'centerd',
  'card': 'Card',
  'Card': 'Card',
  'stu_lawyer': 'stu_lawyer',
  'stu-lawyer': 'stu_lawyer',
  'stu lawyer': 'stu_lawyer',
  'executive-lawyer-portfolio': 'stu_lawyer',
  'executive lawyer': 'stu_lawyer',
  'executive lawyer portfolio': 'stu_lawyer',
  'lawyer': 'stu_lawyer',
  'photography-portfolio': 'photography',
  'photography': 'photography',
  'agri-student': 'Agri Student',
  'agri_student': 'Agri Student',
  'agri student': 'Agri Student',
  'Agri Student': 'Agri Student',
  'beautician-portfolio': 'Beautician',
  'beautician': 'Beautician',
  'Beautician': 'Beautician',
  'engineering': 'Engineering',
  'Engineering': 'Engineering',
  'engineering-portfolio': 'Engineering',
  'Engineering Portfolio': 'Engineering'
};

for (const [regKey, dirName] of Object.entries(templateMapping)) {
  const dirPath = path.join(DATA_TEMPLATES_DIR, dirName);
  if (fs.existsSync(dirPath)) {
    const files = walkTemplateDir(dirPath);
    console.log(`Updating ${regKey} from ${dirName} with ${Object.keys(files).length} files...`);
    if (!registry[regKey]) {
      let manifest = {};
      try {
        const mf = files['manifest.json'] || files['src/manifest.json'];
        if (mf) manifest = JSON.parse(mf);
      } catch (e) {}
      registry[regKey] = {
        id: regKey,
        name: manifest.name || dirName,
        category: manifest.category || 'Professional',
        version: manifest.version || '1.0.0',
        currentVersionId: 'v1',
        status: 'active',
        thumbnail: manifest.thumbnail || 'thumbnail.png',
        preview: manifest.preview || 'preview.png',
        description: manifest.description || 'Portfolio template',
        sections: ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [{ versionId: 'v1', version: manifest.version || '1.0.0', sourcePath: `data/templates/${dirName}`, createdAt: new Date().toISOString() }],
        sectionFiles: files,
        templateCode: files['src/template.jsx'] || files['template.jsx'] || files['src/index.jsx'] || files['src/App.tsx'] || files['src/app/page.tsx'] || '',
        customCSS: files['src/styles/styles.css'] || files['src/styles/globals.css'] || files['src/index.css'] || files['src/globals.css'] || ''
      };
    } else {
      registry[regKey].sectionFiles = files;
      registry[regKey].templateCode = files['src/template.jsx'] || files['template.jsx'] || files['src/index.jsx'] || files['src/App.tsx'] || files['src/app/page.tsx'] || '';
      registry[regKey].customCSS = files['src/styles/styles.css'] || files['src/styles/globals.css'] || files['src/index.css'] || files['src/globals.css'] || '';
      registry[regKey].updatedAt = new Date().toISOString();
    }
  }
}

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
console.log('Template registry updated successfully in registry.json!');
