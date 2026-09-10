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
      JSZip = require('../Portfolio site/node_modules/jszip');
    } catch (e3) {
      console.error('JSZip not found.');
      process.exit(1);
    }
  }
}

async function buildTemplateZip() {
  const rootDir = __dirname;
  const zip = new JSZip();
  const outputPath = path.join(rootDir, 'static-panel-template.zip');
  const outputPathAlt = path.join(rootDir, 'static-panel.zip');

  function addFolder(dirPath, zipFolder) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      if (['node_modules', '.next', '.git', 'out', 'dist', '.vscode'].includes(file)) {
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

  // 2. Add root files
  const rootFiles = [
    'index.html',
    'index.jsx',
    'template.jsx',
    'manifest.json',
    'campuscv.json',
    'schema.json',
    'bindings.json',
    'package.json',
    'tailwind.config.ts',
    'postcss.config.mjs',
    'preview.png',
    'thumbnail.png',
    'tsconfig.json'
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

  const workspaceRoot = path.resolve(rootDir, '../../..');
  const rootZip = path.join(workspaceRoot, 'static-panel.zip');
  const rootZipTemplate = path.join(workspaceRoot, 'static-panel-template.zip');

  fs.writeFileSync(outputPath, buf);
  fs.writeFileSync(outputPathAlt, buf);
  if (fs.existsSync(workspaceRoot)) {
    fs.writeFileSync(rootZip, buf);
    fs.writeFileSync(rootZipTemplate, buf);
  }
  console.log(`\x1b[32m✔ Successfully created static-panel-template.zip and static-panel.zip (${(buf.length / 1024).toFixed(1)} KB) in local & root\x1b[0m`);
}

buildTemplateZip().catch(err => {
  console.error('Error generating zip:', err);
  process.exit(1);
});
