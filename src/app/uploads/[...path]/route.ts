import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf'
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await context.params;
    const pathSegments = resolvedParams.path;

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    // Sanitize path to prevent directory traversal
    const safePathSegments = pathSegments.map(seg => path.basename(seg));
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...safePathSegments);

    if (!fs.existsSync(filePath)) {
      console.warn(`[UPLOADS SERVE 404] File not found: "${filePath}"`);
      return new NextResponse('File Not Found', { status: 404 });
    }

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return new NextResponse('Not a File', { status: 400 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[UPLOADS SERVE ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
