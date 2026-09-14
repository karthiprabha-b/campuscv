const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function packDirectory(srcDir, zipPath) {
  const zip = new JSZip();

  function addFiles(dir, rootPrefix = '') {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (['node_modules', '.git', '.next', 'dist', 'build'].includes(item) || item.startsWith('tplver_') || item.startsWith('v_') || item.endsWith('.d.ts')) continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addFiles(fullPath, path.join(rootPrefix, item));
      } else {
        const fileData = fs.readFileSync(fullPath);
        const relPath = path.join(rootPrefix, item).replace(/\\/g, '/');
        zip.file(relPath, fileData);
      }
    }
  }

  addFiles(srcDir);
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(zipPath, content);
  console.log(`[PACKED] ${zipPath} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  const root = path.join(__dirname, '..');
  const templatesDir = path.join(root, 'data', 'templates');
  const publicTemplatesDir = path.join(root, 'public', 'templates');

  if (!fs.existsSync(publicTemplatesDir)) {
    fs.mkdirSync(publicTemplatesDir, { recursive: true });
  }

  const dirs = fs.readdirSync(templatesDir).filter(f => {
    const full = path.join(templatesDir, f);
    return fs.statSync(full).isDirectory() && !f.startsWith('.') && !f.startsWith('v_');
  });

  for (const dirName of dirs) {
    const src = path.join(templatesDir, dirName);
    const slug = dirName.toLowerCase().replace(/\s+/g, '-');
    const underSlug = dirName.toLowerCase().replace(/\s+/g, '_');

    // Pack to data/templates
    await packDirectory(src, path.join(templatesDir, `${dirName}.zip`));
    if (slug !== dirName) {
      await packDirectory(src, path.join(templatesDir, `${slug}.zip`));
    }
    if (underSlug !== slug && underSlug !== dirName) {
      await packDirectory(src, path.join(templatesDir, `${underSlug}.zip`));
    }

    // Pack to public/templates
    await packDirectory(src, path.join(publicTemplatesDir, `${dirName}.zip`));
    await packDirectory(src, path.join(publicTemplatesDir, `${slug}.zip`));
    await packDirectory(src, path.join(publicTemplatesDir, `${slug}-template.zip`));
    if (underSlug !== slug) {
      await packDirectory(src, path.join(publicTemplatesDir, `${underSlug}.zip`));
    }
  }

  // Specific aliases
  const lawyerSrc = path.join(templatesDir, 'stu_lawyer');
  if (fs.existsSync(lawyerSrc)) {
    await packDirectory(lawyerSrc, path.join(templatesDir, 'executive-lawyer-portfolio.zip'));
    await packDirectory(lawyerSrc, path.join(publicTemplatesDir, 'executive-lawyer-portfolio.zip'));
  }

  const engSrc = path.join(templatesDir, 'Engineering');
  if (fs.existsSync(engSrc)) {
    await packDirectory(engSrc, path.join(templatesDir, 'engineering-build.zip'));
  }

  const photoSrc = path.join(templatesDir, 'photography');
  if (fs.existsSync(photoSrc)) {
    await packDirectory(photoSrc, path.join(templatesDir, 'photography-portfolio.zip'));
    await packDirectory(photoSrc, path.join(publicTemplatesDir, 'photography-portfolio.zip'));
  }

  console.log('All template zip archives successfully refreshed!');
}

main().catch(console.error);
