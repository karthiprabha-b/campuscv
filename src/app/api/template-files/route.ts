import { NextResponse } from 'next/server';
import { getTemplateFilesServer, saveTemplateFilesServer } from '../../../lib/serverTemplateStore';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get('templateId');
  const versionId = searchParams.get('versionId') || searchParams.get('v') || undefined;

  if (!templateId) {
    return NextResponse.json({ error: 'templateId query param is required' }, { status: 400 });
  }

  console.log(`[API /api/template-files GET] Request templateId: "${templateId}" versionId: "${versionId || 'latest'}"`);

  const templateData = getTemplateFilesServer(templateId, versionId);

  if (!templateData || !templateData.files || Object.keys(templateData.files).length === 0) {
    console.warn(`[API /api/template-files GET 404] Template files not found for templateId: "${templateId}"`);
    return NextResponse.json(
      { error: `Uploaded template '${templateId}' could not be loaded: No template files found.` },
      { status: 404 }
    );
  }

  const requestedFile = searchParams.get('file');
  if (requestedFile) {
    const cleanReq = requestedFile.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\//, '');
    const fileKeys = [
      cleanReq,
      `public/${cleanReq}`,
      `src/${cleanReq}`,
      `assets/${cleanReq}`,
      `src/assets/${cleanReq}`,
      `public/assets/${cleanReq}`,
      `images/${cleanReq}`,
      `src/images/${cleanReq}`
    ];

    let foundKey = fileKeys.find(k => templateData.files[k]);
    if (!foundKey) {
      foundKey = Object.keys(templateData.files).find(k => k === cleanReq || k.endsWith('/' + cleanReq) || k.endsWith(cleanReq));
    }

    const fileContent = foundKey ? templateData.files[foundKey] : null;
    if (!fileContent) {
      console.warn(`[API /api/template-files 404] File "${requestedFile}" not found in templateId: "${templateId}"`);
      return new Response('Asset not found', { status: 404 });
    }

    let contentType = 'text/plain; charset=utf-8';
    if (/\.(png)$/i.test(requestedFile)) contentType = 'image/png';
    else if (/\.(jpe?g)$/i.test(requestedFile)) contentType = 'image/jpeg';
    else if (/\.(webp)$/i.test(requestedFile)) contentType = 'image/webp';
    else if (/\.(svg)$/i.test(requestedFile)) contentType = 'image/svg+xml';
    else if (/\.(gif)$/i.test(requestedFile)) contentType = 'image/gif';
    else if (/\.(woff2)$/i.test(requestedFile)) contentType = 'font/woff2';
    else if (/\.(woff)$/i.test(requestedFile)) contentType = 'font/woff';
    else if (/\.(ttf)$/i.test(requestedFile)) contentType = 'font/ttf';
    else if (/\.(css)$/i.test(requestedFile)) contentType = 'text/css; charset=utf-8';
    else if (/\.(js|jsx|ts|tsx)$/i.test(requestedFile)) contentType = 'text/javascript; charset=utf-8';

    if (fileContent.startsWith('data:')) {
      const parts = fileContent.split(',');
      const meta = parts[0] || '';
      const base64Data = parts[1] || '';
      const matchType = meta.match(/data:([^;]+)/);
      if (matchType) contentType = matchType[1];

      const buffer = Buffer.from(base64Data, 'base64');
      return new Response(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new Response(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  console.log(`[API /api/template-files GET 200] Returning ${Object.keys(templateData.files).length} files for templateId: "${templateId}"`);

  return NextResponse.json(
    {
      templateId: templateData.templateId,
      entryFile: templateData.entryFile,
      files: templateData.files,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, files } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    if (!files || typeof files !== 'object') {
      return NextResponse.json({ error: 'files object is required' }, { status: 400 });
    }

    console.log(`[API /api/template-files POST] Uploading persistent template package: "${templateId}" (${Object.keys(files).length} files)`);

    saveTemplateFilesServer(templateId, files);

    return NextResponse.json({
      success: true,
      templateId,
      fileCount: Object.keys(files).length,
    });
  } catch (err: any) {
    console.error('[API /api/template-files POST ERROR]', err);
    return NextResponse.json({ error: err.message || 'Failed to save template package' }, { status: 500 });
  }
}
