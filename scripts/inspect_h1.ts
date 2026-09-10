import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Test Golden Standalone
  const gPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await gPage.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  const gH1 = await gPage.evaluate(() => {
    const h1 = document.querySelector('#hero h1');
    return {
      text: h1?.textContent,
      outer: h1?.outerHTML,
      rect: h1 ? { width: h1.getBoundingClientRect().width, height: h1.getBoundingClientRect().height } : null
    };
  });

  // 2. Test CampusCV Runtime
  const cPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cPage.goto('http://localhost:3000/admin/templates/designer-portfolio/preview', { waitUntil: 'networkidle' });
  const iframeEl = await cPage.waitForSelector('iframe', { timeout: 10000 });
  const frame = await iframeEl.contentFrame();
  if (frame) {
    await frame.waitForSelector('#hero', { timeout: 10000 });
    const cH1 = await frame.evaluate(() => {
      const h1 = document.querySelector('#hero h1');
      const hero = document.querySelector('#hero');
      return {
        text: h1?.textContent,
        outer: h1?.outerHTML,
        rect: h1 ? { width: h1.getBoundingClientRect().width, height: h1.getBoundingClientRect().height } : null,
        heroHtml: hero ? hero.outerHTML.slice(0, 400) : null
      };
    });
    console.log('=== GOLDEN H1 ===\n', JSON.stringify(gH1, null, 2));
    console.log('=== CAMPUS H1 ===\n', JSON.stringify(cH1, null, 2));
  }

  await browser.close();
}

test().catch(console.error);
