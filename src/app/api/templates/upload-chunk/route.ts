export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { extractAndSaveZipServer } from '../../../../lib/serverTemplateStore';

const TEMP_DIR = path.join(process.cwd(), 'data', 'temp');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadId = searchParams.get('uploadId') || req.headers.get('x-upload-id');
    const chunkIndex = parseInt(searchParams.get('chunkIndex') || req.headers.get('x-chunk-index') || '0', 10);
    const totalChunks = parseInt(searchParams.get('totalChunks') || req.headers.get('x-total-chunks') || '1', 10);

    if (!uploadId) {
      return NextResponse.json({ error: 'uploadId is required' }, { status: 400 });
    }

    ensureDir(TEMP_DIR);
    const cleanUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, '');
    const tempFilePath = path.join(TEMP_DIR, `chunk_${cleanUploadId}.zip`);

    // If chunkIndex is 0 and old temp file exists, start clean
    if (chunkIndex === 0 && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }

    // Read the chunk array buffer directly
    const chunkArrayBuffer = await req.arrayBuffer();
    const chunkBuffer = Buffer.from(chunkArrayBuffer);

    if (chunkBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty chunk data received' }, { status: 400 });
    }

    // Append chunk to the temp zip file on disk
    fs.appendFileSync(tempFilePath, chunkBuffer);

    // If this is the last chunk, extract and save the template package
    if (chunkIndex >= totalChunks - 1) {
      const templateId = searchParams.get('templateId') || req.headers.get('x-template-id') || '';
      const name = searchParams.get('name') || (req.headers.get('x-template-name') ? decodeURIComponent(req.headers.get('x-template-name')!) : '');
      const category = searchParams.get('category') || 'Developer';
      const version = searchParams.get('version') || '1.0.0';
      const author = searchParams.get('author') || 'Admin';
      const description = searchParams.get('description') || '';
      const supportsDarkMode = searchParams.get('supportsDarkMode') !== 'false';

      let sections: string[] = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];
      const rawSections = searchParams.get('sections');
      if (rawSections) {
        try {
          const parsed = JSON.parse(rawSections);
          if (Array.isArray(parsed)) sections = parsed;
        } catch (e) {}
      }

      const result = await extractAndSaveZipServer(tempFilePath, {
        templateId: templateId || undefined,
        overrideMetadata: {
          name: name || undefined,
          category: category || undefined,
          version: version || undefined,
          author: author || undefined,
          description: description || undefined,
          supportsDarkMode: supportsDarkMode,
          sections: sections
        }
      });

      // Clean up temp zip file
      try { fs.unlinkSync(tempFilePath); } catch (e) {}

      return NextResponse.json({
        success: true,
        isComplete: true,
        templateId: result.templateId,
        versionId: result.versionId,
        currentVersionId: result.versionId,
        version: result.record.version,
        record: result.record,
        fileCount: result.fileCount,
        message: `Template '${result.templateId}' (v${result.record.version}) uploaded and persisted successfully!`
      });
    }

    return NextResponse.json({
      success: true,
      isComplete: false,
      receivedChunk: chunkIndex,
      totalChunks
    });
  } catch (error: any) {
    console.error('[API /api/templates/upload-chunk Error]', error);
    return NextResponse.json({ error: error.message || 'Chunk upload processing failed' }, { status: 500 });
  }
}
