import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getTemplateFilesServer } from '../src/lib/serverTemplateStore';
import { discoverTemplateCSS } from '../src/utils/UniversalCSSDiscovery';

async function main() {
  console.log('==================================================');
  console.log('1. STAGE A & B: FILE INTEGRITY CHECK');
  console.log('==================================================');
  const goldenDir = 'a:/Office/Template/Designer portfolio';
  const diskDir = 'a:/Office/Portfolio site/data/templates/designer-portfolio';

  function getFileMap(dir: string) {
    const map: Record<string, Buffer> = {};
    function walk(d: string) {
      fs.readdirSync(d).forEach(f => {
        if (['node_modules', '.git', '.next', 'dist'].includes(f)) return;
        const full = path.join(d, f);
        if (fs.statSync(full).isDirectory()) walk(full);
        else {
          const rel = path.relative(dir, full).replace(/\\/g, '/');
          map[rel] = fs.readFileSync(full);
        }
      });
    }
    walk(dir);
    return map;
  }

  const goldenFiles = getFileMap(goldenDir);
  const diskFiles = getFileMap(diskDir);
  console.log('Golden files count (excl dist/node_modules):', Object.keys(goldenFiles).length);
  console.log('Disk files count (excl dist/node_modules):', Object.keys(diskFiles).length);

  let mismatches = 0;
  for (const [f, buf] of Object.entries(goldenFiles)) {
    if (!diskFiles[f]) {
      console.log(`[MISMATCH] Missing on disk: ${f}`);
      mismatches++;
    } else if (!buf.equals(diskFiles[f])) {
      console.log(`[MISMATCH] Content mismatch: ${f} (Golden: ${buf.length} bytes, Disk: ${diskFiles[f].length} bytes)`);
      mismatches++;
    }
  }
  if (mismatches === 0) {
    console.log('✓ Stage A vs B: 100% IDENTICAL');
  }

  console.log('\n==================================================');
  console.log('2. STAGE C: /api/template-files / SERVER RESOLUTION');
  console.log('==================================================');
  const serverLoaded = getTemplateFilesServer('designer-portfolio');
  if (!serverLoaded) {
    console.error('ERROR: getTemplateFilesServer returned null for designer-portfolio!');
    return;
  }

  console.log('Template ID:', serverLoaded.templateId);
  console.log('Version ID:', serverLoaded.versionId);
  console.log('Entry File:', serverLoaded.entryFile);
  console.log('Files returned count:', Object.keys(serverLoaded.files).length);

  console.log('\n==================================================');
  console.log('3. STAGE E: CSS DISCOVERY & BUNDLE');
  console.log('==================================================');
  const cssResult = discoverTemplateCSS(serverLoaded.files, 'tpl', undefined, 'designer-portfolio');
  console.log('Global Styles scanned:', cssResult.manifest.globalStyles);
  console.log('Component Styles scanned:', cssResult.manifest.componentStyles);
  console.log('External Styles:', cssResult.manifest.externalStyles);
  console.log('Has Tailwind:', cssResult.manifest.tailwind);
  console.log('Combined CSS Total Length:', cssResult.combinedCSS.length);
  console.log('Combined CSS Hash:', crypto.createHash('sha256').update(cssResult.combinedCSS).digest('hex').substring(0, 12));

  console.log('\n==================================================');
  console.log('4. CSS RULES AUDIT (Checking for .container, @media, grids)');
  console.log('==================================================');
  const css = cssResult.combinedCSS;
  const hasContainer = css.includes('.container');
  const hasHeroGrid = css.includes('.hero-grid');
  const hasProjectCard = css.includes('.project-card');
  const hasVariables = css.includes('--cv-background') || css.includes('--campuscv-background');
  const hasReset = css.includes('box-sizing: border-box');
  const hasSyneFont = css.includes('Syne');

  console.log('.container present:', hasContainer);
  console.log('.hero-grid present:', hasHeroGrid);
  console.log('.project-card present:', hasProjectCard);
  console.log('Variables present:', hasVariables);
  console.log('Reset present:', hasReset);
  console.log('Syne font present:', hasSyneFont);

  // Check order of appearance
  const varPos = css.indexOf('--cv-background');
  const resetPos = css.indexOf('box-sizing: border-box');
  const typoPos = css.indexOf('.font-heading');
  const layoutPos = css.indexOf('.container {');
  const compPos = css.indexOf('.btn {');
  const respPos = css.indexOf('/* Global Style: css/responsive.css */');

  console.log('\nCSS Cascade Positions (lower is earlier):');
  console.log('variables.css pos:', varPos);
  console.log('reset.css pos:', resetPos);
  console.log('typography.css pos:', typoPos);
  console.log('layout.css pos:', layoutPos);
  console.log('components.css pos:', compPos);
  console.log('responsive.css pos:', respPos);

  if (varPos < resetPos && resetPos < layoutPos) {
    console.log('✓ CSS Cascade Order is CORRECT (Variables -> Reset -> Layout)');
  } else {
    console.warn('⚠️ CSS Cascade Order check warning!');
  }
}

main().catch(console.error);
