export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/export/html?username=xxx
// Renders the portfolio page and returns a self-contained HTML file
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      || `http://localhost:${process.env.PORT || 3000}`;
    const portfolioUrl = `${baseUrl}/p/${username}`;

    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(portfolioUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Get the full HTML with all computed styles inlined
    const html = await page.content();
    await browser.close();

    // Inject a banner comment
    const exportedHtml = `<!DOCTYPE html>
<!-- Exported from CampusCV · campuscv.app · ${new Date().toISOString()} -->
${html}`;

    const safeName = username.replace(/[^a-z0-9-]/gi, '_');
    return new NextResponse(exportedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}-portfolio.html"`,
      },
    });
  } catch (e: any) {
    console.error('[HTML Export]', e);
    return NextResponse.json({ error: e.message || 'HTML export failed' }, { status: 500 });
  }
}
