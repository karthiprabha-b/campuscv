import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const DATA_TEMPLATES_DIR = path.join(process.cwd(), 'data', 'templates');
const PUBLIC_TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function zipDirectory(sourceDir: string, outZipPath: string) {
  const zip = new JSZip();

  function addDir(currentDir: string, zipFolder: JSZip) {
    const list = fs.readdirSync(currentDir);
    for (const item of list) {
      if (['node_modules', '.git', '.next', 'dist', 'build', '.DS_Store'].includes(item)) continue;
      if (item.endsWith('.zip')) continue;

      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        if (subFolder) addDir(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    }
  }

  addDir(sourceDir, zip);

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  ensureDir(path.dirname(outZipPath));
  fs.writeFileSync(outZipPath, buffer);
  console.log(`✓ Packaged ${outZipPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function packageAll() {
  ensureDir(PUBLIC_TEMPLATES_DIR);
  const dirs = fs.readdirSync(DATA_TEMPLATES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  for (const d of dirs) {
    const dirPath = path.join(DATA_TEMPLATES_DIR, d.name);
    const lowerName = d.name.toLowerCase().replace(/\s+/g, '-');

    // 1. Save in data/templates/
    await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `${d.name}.zip`));

    // 2. Save in public/templates/
    await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `${lowerName}.zip`));
    await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `${lowerName}-template.zip`));

    if (d.name === 'Card') {
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `card.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `card-template.zip`));
    }
  }

  console.log('All templates packaged successfully!');
}

packageAll().catch(console.error);
