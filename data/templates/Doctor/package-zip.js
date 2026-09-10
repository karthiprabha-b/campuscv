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
      console.error('JSZip not found. Please run: npm install -D jszip');
      process.exit(1);
    }
  }
}

async function buildTemplateZip() {
  const rootDir = __dirname;
  const zip = new JSZip();
  const outputPath = path.join(rootDir, 'doctor-template.zip');

  function addFolder(dirPath, zipFolder) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      // Exclude legacy Next.js app router & internal directories
      if (
        relPath.startsWith('src/app') ||
        relPath.startsWith('src/context') ||
        relPath.startsWith('src/components/layout') ||
        relPath.startsWith('src/components/sections') ||
        relPath.startsWith('src/components/ui') ||
        relPath.startsWith('src/types') ||
        file === 'doctorData.ts' ||
        ['node_modules', '.next', '.git', 'out', 'dist', '.vscode'].includes(file)
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

  // 2. Add js folder
  const jsPath = path.join(rootDir, 'js');
  if (fs.existsSync(jsPath)) {
    addFolder(jsPath, zip.folder('js'));
  }

  // 3. Add public folder
  const publicPath = path.join(rootDir, 'public');
  if (fs.existsSync(publicPath)) {
    addFolder(publicPath, zip.folder('public'));
  }

  // 4. Add root files
  const rootFiles = [
    'index.html',
    'index.jsx',
    'template.jsx',
    'manifest.json',
    'campuscv.json',
    'schema.json',
    'schema.ts',
    'bindings.json',
    'package.json',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
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
  console.log(`\x1b[32m✔ Successfully created doctor-template.zip (${(buf.length / 1024 / 1024).toFixed(2)} MB)\x1b[0m`);
  console.log(`Path: ${outputPath}`);
}

buildTemplateZip().catch(err => {
  console.error('Error generating zip:', err);
  process.exit(1);
});
