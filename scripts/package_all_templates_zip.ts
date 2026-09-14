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
    const underscoresName = d.name.toLowerCase().replace(/\s+/g, '_');

    // 1. Save in data/templates/
    await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `${d.name}.zip`));
    await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `${lowerName}.zip`));

    // 2. Save in public/templates/
    await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `${lowerName}.zip`));
    await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `${lowerName}-template.zip`));
    await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `${underscoresName}.zip`));

    if (d.name === 'Card') {
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `card.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `card-template.zip`));
    }
    if (d.name === 'stu_lawyer') {
      await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `executive-lawyer-portfolio.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `executive-lawyer-portfolio.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `stu_lawyer.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `stu-lawyer.zip`));
    }
    if (d.name === 'Agri Student') {
      await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `agri-student.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `agri-student.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `agri-student-template.zip`));
    }
    if (d.name === 'Beautician') {
      await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `beautician-portfolio.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `beautician.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `beautician-portfolio.zip`));
    }
    if (d.name === 'photography') {
      await zipDirectory(dirPath, path.join(DATA_TEMPLATES_DIR, `photography-portfolio.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `photography-portfolio.zip`));
    }
    if (d.name === 'Designer portfolio') {
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `designer-portfolio.zip`));
      await zipDirectory(dirPath, path.join(PUBLIC_TEMPLATES_DIR, `product-designer.zip`));
    }
  }

  console.log('All template zip packages generated successfully!');
}

packageAll().catch(console.error);
