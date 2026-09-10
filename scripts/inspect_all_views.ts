import { chromium } from 'playwright';

async function inspectAll() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Inspect Standalone Golden (4000)
  const gPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await gPage.goto('http://localhost:4000', { waitUntil: 'domcontentloaded' });
  await gPage.waitForTimeout(1000);
  
  const goldenMetrics = await gPage.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('header, section, footer')).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fontFamily: style.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
      };
    });
    return {
      docWidth: document.documentElement.clientWidth,
      sections
    };
  });

  // 2. Inspect CampusCV Admin Preview (3000)
  const cPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cPage.goto('http://localhost:3000/admin/templates/designer-portfolio/preview', { waitUntil: 'domcontentloaded' });
  await cPage.waitForTimeout(1500);
  const iframeEl = await cPage.waitForSelector('iframe', { timeout: 10000 });
  const frame = await iframeEl.contentFrame();
  await frame!.waitForSelector('#hero', { timeout: 15000 });
  await cPage.waitForTimeout(1000);

  const campusMetrics = await frame!.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('header, section, footer')).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fontFamily: style.fontFamily.split(',')[0].replace(/['"]/g, '').trim()
      };
    });
    return {
      docWidth: document.documentElement.clientWidth,
      sections
    };
  });

  console.log('=== GOLDEN STANDALONE SECTIONS ===\n', JSON.stringify(goldenMetrics, null, 2));
  console.log('=== CAMPUSCV RUNTIME SECTIONS ===\n', JSON.stringify(campusMetrics, null, 2));

  await browser.close();
}

inspectAll().catch(console.error);
