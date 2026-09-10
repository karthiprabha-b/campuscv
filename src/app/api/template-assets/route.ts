export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    case '.ico': return 'image/x-icon';
    case '.css': return 'text/css';
    case '.js': return 'text/javascript';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    case '.eot': return 'application/vnd.ms-fontobject';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get('templateId');
  const versionId = searchParams.get('versionId');
  const assetPath = searchParams.get('path');

  if (!templateId || !assetPath) {
    return NextResponse.json({ error: 'Missing templateId or asset path' }, { status: 400 });
  }

  const cleanAssetPath = decodeURIComponent(assetPath).replace(/^(\.\.|\.)\//, '').replace(/^\/+/, '');
  const baseDir = path.join(process.cwd(), 'data', 'templates', templateId);
  const targetVer = versionId && versionId !== 'current' ? versionId : null;

  let candidates: string[] = [];

  if (targetVer) {
    const verDir = path.join(baseDir, targetVer);
    candidates.push(
      path.join(verDir, cleanAssetPath),
      path.join(verDir, 'Designer portfolio', cleanAssetPath),
      path.join(verDir, 'public', cleanAssetPath),
      path.join(verDir, 'src', cleanAssetPath)
    );
  }

  // Fallbacks
  candidates.push(
    path.join(baseDir, cleanAssetPath),
    path.join(baseDir, 'Designer portfolio', cleanAssetPath),
    path.join(baseDir, 'public', cleanAssetPath),
    path.join(baseDir, 'src', cleanAssetPath)
  );

  let foundFile = '';
  for (const cand of candidates) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      foundFile = cand;
      break;
    }
  }

  if (!foundFile) {
    // Check inside subdirectories recursively for basename match
    const baseName = path.basename(cleanAssetPath);
    try {
      const searchSubdirs = (dir: string): string => {
        if (!fs.existsSync(dir)) return '';
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const fullP = path.join(dir, item.name);
          if (item.isDirectory()) {
            const found = searchSubdirs(fullP);
            if (found) return found;
          } else if (item.name === baseName) {
            return fullP;
          }
        }
        return '';
      };
      foundFile = searchSubdirs(baseDir);
    } catch {}
  }

  if (!foundFile) {
    console.warn(`[template-assets 404] templateId: "${templateId}" | versionId: "${versionId}" | path: "${cleanAssetPath}"`);
    return new NextResponse('Asset Not Found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(foundFile);
    const contentType = getMimeType(foundFile);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    console.error('[template-assets Error]', err);
    return new NextResponse('Error reading asset file', { status: 500 });
  }
}
