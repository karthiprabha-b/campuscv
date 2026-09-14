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
  
  // 1. Pack Engineering
  const engSrc = path.join(root, 'data', 'templates', 'Engineering');
  if (fs.existsSync(engSrc)) {
    await packDirectory(engSrc, path.join(root, 'data', 'templates', 'Engineering.zip'));
    await packDirectory(engSrc, path.join(root, 'data', 'templates', 'engineering-build.zip'));
    await packDirectory(engSrc, path.join(root, 'public', 'templates', 'engineering.zip'));
    await packDirectory(engSrc, path.join(root, 'public', 'templates', 'engineering-template.zip'));
  }

  // 2. Pack stu_lawyer
  const lawyerSrc = path.join(root, 'data', 'templates', 'stu_lawyer');
  if (fs.existsSync(lawyerSrc)) {
    await packDirectory(lawyerSrc, path.join(root, 'data', 'templates', 'stu_lawyer.zip'));
    await packDirectory(lawyerSrc, path.join(root, 'data', 'templates', 'executive-lawyer-portfolio.zip'));
    await packDirectory(lawyerSrc, path.join(root, 'public', 'templates', 'stu_lawyer.zip'));
    await packDirectory(lawyerSrc, path.join(root, 'public', 'templates', 'stu_lawyer-template.zip'));
    await packDirectory(lawyerSrc, path.join(root, 'public', 'templates', 'executive-lawyer-portfolio.zip'));
  }

  console.log('All template zip archives successfully refreshed!');
}

main().catch(console.error);
