import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/admin/templates/designer-portfolio/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const iframeEl = await page.waitForSelector('iframe');
  const frame = await iframeEl.contentFrame();
  if (!frame) return;

  const result = await frame.evaluate(() => {
    const projectsEl = document.querySelector('#projects');
    if (!projectsEl) return { found: false };

    // Find all matching CSS rules across all stylesheets
    const matchingRules: any[] = [];
    Array.from(document.styleSheets).forEach((sheet, sheetIdx) => {
      try {
        if (!sheet.cssRules) return;
        Array.from(sheet.cssRules).forEach((rule: any) => {
          if (rule.selectorText && projectsEl.matches(rule.selectorText)) {
            matchingRules.push({
              sheetIdx,
              ownerTag: (sheet.ownerNode as HTMLElement)?.tagName,
              ownerId: (sheet.ownerNode as HTMLElement)?.id,
              selectorText: rule.selectorText,
              cssText: rule.cssText
            });
          }
          // Also check inside media rules
          if (rule.cssRules) {
            Array.from(rule.cssRules).forEach((subRule: any) => {
              if (subRule.selectorText && projectsEl.matches(subRule.selectorText)) {
                matchingRules.push({
                  sheetIdx,
                  media: rule.media?.mediaText,
                  selectorText: subRule.selectorText,
                  cssText: subRule.cssText
                });
              }
            });
          }
        });
      } catch (e) {}
    });

    return {
      inlineStyle: projectsEl.getAttribute('style'),
      className: projectsEl.className,
      matchingRules
    };
  });

  console.log('--- #PROJECTS MATCHING RULES ---');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
}

main().catch(console.error);
