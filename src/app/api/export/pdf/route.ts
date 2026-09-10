export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/export/pdf?portfolioId=xxx&username=yyy
// Uses Playwright (already installed) to screenshot the public portfolio as PDF
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get('portfolioId');
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'username is required' }, { status: 400 });
    }

    // Build the public portfolio URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      || `http://localhost:${process.env.PORT || 3000}`;
    const portfolioUrl = `${baseUrl}/p/${username}`;

    const { chromium } = await import('playwright');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport to standard A4-ish width for good layout
    await page.setViewportSize({ width: 1200, height: 900 });

    // Navigate to portfolio — wait until network is idle
    await page.goto(portfolioUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for fonts and animations to settle
    await page.waitForTimeout(2000);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });

    await browser.close();

    const safeName = username.replace(/[^a-z0-9-]/gi, '_');
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}-portfolio.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (e: any) {
    console.error('[PDF Export]', e);
    return NextResponse.json({ error: e.message || 'PDF generation failed' }, { status: 500 });
  }
}
