import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/admin/templates/designer-portfolio/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const iframeEl = await page.waitForSelector('iframe');
  const frame = await iframeEl.contentFrame();
  if (!frame) {
    console.log('No iframe frame found!');
    return;
  }

  await frame.waitForSelector('#hero', { timeout: 10000 });

  const inspection = await frame.evaluate(() => {
    const mainEl = document.querySelector('main');
    const sections = Array.from(document.querySelectorAll('section, main > *')).map(el => {
      const cs = window.getComputedStyle(el);
      return {
        id: el.id,
        tagName: el.tagName,
        className: el.className,
        display: cs.display,
        visibility: cs.visibility,
        width: cs.width,
        height: cs.height,
        fontFamily: cs.fontFamily,
        childrenCount: el.children.length,
        innerHTMLSnippet: el.innerHTML.slice(0, 100)
      };
    });

    const bodyCS = window.getComputedStyle(document.body);
    const htmlCS = window.getComputedStyle(document.documentElement);

    return {
      main: {
        found: !!mainEl,
        className: mainEl?.className,
        display: mainEl ? window.getComputedStyle(mainEl).display : null,
        childrenCount: mainEl?.children.length
      },
      sections,
      body: {
        fontFamily: bodyCS.fontFamily,
        background: bodyCS.backgroundColor,
        color: bodyCS.color
      },
      html: {
        fontFamily: htmlCS.fontFamily
      },
      styleSheets: Array.from(document.styleSheets).map(s => {
        let rulesCount = 'cross-origin';
        try {
          if (s.cssRules) rulesCount = String(s.cssRules.length);
        } catch (e) {}
        return {
          href: s.href,
          rulesCount,
          ownerNodeTag: (s.ownerNode as HTMLElement)?.tagName,
          ownerNodeId: (s.ownerNode as HTMLElement)?.id
        };
      })
    };
  });

  console.log('--- FRAME INSPECTION ---');
  console.log(JSON.stringify(inspection, null, 2));

  await browser.close();
}

main().catch(console.error);
