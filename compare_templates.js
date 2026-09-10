const fs = require('fs');
const path = require('path');

const wsDir = 'c:\\Users\\karthikeyan\\Downloads\\cs-portfolio (2)\\cs-portfolio';
const bakDir = 'A:\\Office\\Portfolio site\\scratch\\cs-portfolio';

function compareDirs(dirA, dirB) {
  const filesA = fs.readdirSync(dirA);
  for (const f of filesA) {
    const pathA = path.join(dirA, f);
    const pathB = path.join(dirB, f);
    if (!fs.existsSync(pathB)) {
      console.log(`Only in A: ${path.relative(wsDir, pathA)}`);
      continue;
    }
    const statA = fs.statSync(pathA);
    if (statA.isDirectory()) {
      compareDirs(pathA, pathB);
    } else {
      const contentA = fs.readFileSync(pathA, 'utf-8');
      const contentB = fs.readFileSync(pathB, 'utf-8');
      if (contentA !== contentB) {
        console.log(`Different: ${path.relative(wsDir, pathA)}`);
      }
    }
  }
}

console.log('Comparing workspace template and backup template...');
compareDirs(wsDir, bakDir);
