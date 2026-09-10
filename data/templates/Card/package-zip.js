import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let JSZip;
try {
  JSZip = require('jszip');
} catch (e) {
  try {
    JSZip = require('a:/Office/Portfolio site/node_modules/jszip');
  } catch (e2) {
    try {
      JSZip = require('../../node_modules/jszip');
    } catch (e3) {
      console.error('JSZip not found. Please run: npm install -D jszip');
      process.exit(1);
    }
  }
}

async function buildTemplateZip() {
  const rootDir = __dirname;
  const zip = new JSZip();
  const outputPath = path.join(rootDir, 'card-template.zip');

  function addFolder(dirPath, zipFolder) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      // Exclude unnecessary artifacts
      if (
        ['node_modules', '.next', '.git', 'out', 'dist', '.vscode'].includes(file) ||
        file.endsWith('.zip')
      ) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addFolder(fullPath, zipFolder.folder(file));
      } else {
        zipFolder.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  // 1. Add src folder
  const srcPath = path.join(rootDir, 'src');
  if (fs.existsSync(srcPath)) {
    addFolder(srcPath, zip.folder('src'));
  }

  // 2. Add public folder
  const publicPath = path.join(rootDir, 'public');
  if (fs.existsSync(publicPath)) {
    addFolder(publicPath, zip.folder('public'));
  }

  // 3. Add root files
  const rootFiles = [
    'index.html',
    'index.jsx',
    'template.jsx',
    'styles.css',
    'style.css',
    'manifest.json',
    'campuscv.json',
    'schema.json',
    'bindings.json',
    'package.json',
    'preview.png',
    'thumbnail.png',
    'README.md'
  ];

  for (const rf of rootFiles) {
    const full = path.join(rootDir, rf);
    if (fs.existsSync(full)) {
      zip.file(rf, fs.readFileSync(full));
    }
  }

  const buf = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync(outputPath, buf);
  const rootZip1 = path.join(rootDir, '..', '..', 'card.zip');
  const rootZip2 = path.join(rootDir, '..', '..', 'card-template.zip');
  fs.writeFileSync(rootZip1, buf);
  fs.writeFileSync(rootZip2, buf);

  console.log(`\x1b[32m✔ Successfully created card-template.zip (${(buf.length / 1024).toFixed(1)} KB)\x1b[0m`);
}

buildTemplateZip().catch(err => {
  console.error('Error generating zip:', err);
  process.exit(1);
});
