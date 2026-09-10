import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '1440px', width: 1440, height: 900 },
  { name: '1280px', width: 1280, height: 900 },
  { name: '1024px', width: 1024, height: 900 },
  { name: '768px', width: 768, height: 900 },
  { name: '390px', width: 390, height: 844 }
];

const SELECTORS = [
  { name: 'body', selector: 'body' },
  { name: 'hero_section', selector: '#hero' },
  { name: 'hero_container', selector: '#hero .container, #hero > div' },
  { name: 'hero_grid', selector: '#hero .grid' },
  { name: 'hero_heading', selector: '#hero h1' },
  { name: 'hero_image_box', selector: '#hero .aspect-\\[4\\/5\\], #hero img' },
  { name: 'projects_section', selector: '#projects' },
  { name: 'projects_container', selector: '#projects .container, #projects > div' },
  { name: 'project_article', selector: '#projects article' },
  { name: 'about_section', selector: '#about' },
  { name: 'experience_section', selector: '#experience' },
  { name: 'skills_section', selector: '#skills' },
  { name: 'contact_section', selector: '#contact' },
  { name: 'footer', selector: 'footer' }
];

const CSS_PROPERTIES = [
  'width',
  'height',
  'maxWidth',
  'minWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'display',
  'position',
  'gridTemplateColumns',
  'flexDirection',
  'gap',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'backgroundColor',
  'color',
  'boxSizing',
  'borderRadius',
  'transform'
];

async function extractStyles(pageOrFrame: any, selectors: typeof SELECTORS) {
  return await pageOrFrame.evaluate(({ selList, propList }: { selList: any[]; propList: string[] }) => {
    const results: Record<string, any> = {};

    const winMetrics = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      docClientWidth: document.documentElement.clientWidth,
      bodyClientWidth: document.body.clientWidth,
      devicePixelRatio: window.devicePixelRatio,
      zoom: (document.body.style as any).zoom || 'normal'
    };

    results['__metrics__'] = winMetrics;

    for (const item of selList) {
      const el = document.querySelector(item.selector);
      if (!el) {
        results[item.name] = { found: false, selector: item.selector };
        continue;
      }
      const cs = window.getComputedStyle(el);
      const props: Record<string, any> = { found: true, tagName: el.tagName, className: el.className };
      for (const p of propList) {
        props[p] = (cs as any)[p] || '';
      }
      results[item.name] = props;
    }
    return results;
  }, { selList: selectors, propList: CSS_PROPERTIES });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const outDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('==================================================');
  console.log('PLAYWRIGHT BROWSER COMPUTED-STYLE PARITY DIAGNOSTIC');
  console.log('==================================================');

  for (const vp of VIEWPORTS) {
    console.log(`\n==================================================`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`==================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });

    // 1. Golden Standalone Page (http://localhost:4000)
    const goldenPage = await context.newPage();
    await goldenPage.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
    await goldenPage.waitForTimeout(1000);

    const goldenScreenshot = path.join(outDir, `golden_${vp.name}.png`);
    await goldenPage.screenshot({ path: goldenScreenshot, fullPage: false });
    const goldenStyles = await extractStyles(goldenPage, SELECTORS);

    // 2. CampusCV Page (http://localhost:3000/admin/templates/designer-portfolio/preview)
    const campusPage = await context.newPage();
    await campusPage.goto('http://localhost:3000/admin/templates/designer-portfolio/preview', { waitUntil: 'domcontentloaded' });
    await campusPage.waitForTimeout(1500);

    // Find iframe if rendered in iframe or directly
    const iframeElement = await campusPage.waitForSelector('iframe', { timeout: 10000 });
    const frame = await iframeElement.contentFrame();
    const campusTarget = frame || campusPage;

    // Wait for the actual template to finish compiling and mount
    await campusTarget.waitForSelector('#hero, #template-root, #template-inner-wrapper', { timeout: 15000 });
    await campusPage.waitForTimeout(1000);

    const campusScreenshot = path.join(outDir, `campuscv_${vp.name}.png`);
    await campusPage.screenshot({ path: campusScreenshot, fullPage: false });
    const campusStyles = await extractStyles(campusTarget, SELECTORS);

    console.log(`[METRICS] Golden: InnerWidth=${goldenStyles.__metrics__.innerWidth} DocWidth=${goldenStyles.__metrics__.docClientWidth}`);
    console.log(`[METRICS] Campus: InnerWidth=${campusStyles.__metrics__.innerWidth} DocWidth=${campusStyles.__metrics__.docClientWidth}`);

    let mismatchCount = 0;

    for (const item of SELECTORS) {
      const g = goldenStyles[item.name];
      const c = campusStyles[item.name];

      if (!g?.found && !c?.found) continue;
      if (g?.found !== c?.found) {
        console.log(`[ELEMENT MISMATCH] ${item.name} (${item.selector}): Golden found=${g?.found}, CampusCV found=${c?.found}`);
        mismatchCount++;
        continue;
      }

      const diffs: string[] = [];
      for (const prop of CSS_PROPERTIES) {
        const gVal = g[prop];
        const cVal = c[prop];
        if (gVal !== cVal) {
          if (prop === 'fontFamily') {
            const gHasSyne = gVal.includes('Syne');
            const cHasSyne = cVal.includes('Syne');
            const gHasJakarta = gVal.includes('Plus Jakarta Sans');
            const cHasJakarta = cVal.includes('Plus Jakarta Sans');
            if ((gHasSyne && cHasSyne) || (gHasJakarta && cHasJakarta)) {
              continue; // Matching primary font token
            }
          }
          diffs.push(`  ${prop}: Golden="${gVal}" vs CampusCV="${cVal}"`);
        }
      }

      if (diffs.length > 0) {
        console.log(`\n[STYLE DIFF] Element: ${item.name} (${item.selector})`);
        diffs.forEach(d => console.log(d));
        mismatchCount++;
      } else {
        console.log(`✓ ${item.name}: 100% Match`);
      }
    }

    if (mismatchCount === 0) {
      console.log(`\n>>> VIEWPORT ${vp.name}: ALL COMPUTED STYLES MATCH 100% <<<`);
    } else {
      console.log(`\n>>> VIEWPORT ${vp.name}: ${mismatchCount} MISMATCHES DETECTED <<<`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\nDiagnostic complete. Screenshots saved to:', outDir);
}

main().catch(console.error);
