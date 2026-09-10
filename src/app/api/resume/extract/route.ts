export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { extractPdfText } from '@/resume/extract/extractPdf';
import { extractDocxText } from '@/resume/extract/extractDocx';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, code: 'NO_FILE_PROVIDED', error: 'No file provided' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ success: false, code: 'EMPTY_UPLOAD', error: 'EMPTY_UPLOAD: Uploaded file is empty (0 bytes)' }, { status: 400 });
    }

    const fileName = file.name || 'resume.pdf';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ success: false, code: 'EMPTY_ARRAY_BUFFER', error: 'EMPTY_ARRAY_BUFFER: ArrayBuffer contains 0 bytes' }, { status: 400 });
    }

    console.log('[PDF] filename:', fileName);
    console.log('[PDF] mime:', file.type || 'application/octet-stream');
    console.log('[PDF] file size:', file.size);
    console.log('[PDF] buffer bytes:', buffer.length);
    console.log('[PDF] uint8array size:', buffer.length);
    console.log('[PDF] extraction started');

    let result: any;

    if (ext === '.pdf') {
      result = await extractPdfText(buffer, { fileName });
    } else if (ext === '.docx') {
      result = await extractDocxText(buffer, { fileName });
    } else {
      return NextResponse.json({ success: false, code: 'UNSUPPORTED_FORMAT', error: 'Unsupported format' }, { status: 400 });
    }

    const textLength = result.cleanText.length;
    const isSuccess = result.success && textLength >= 40;

    console.log('[PDF] page count:', result.pageCount);
    console.log('[PDF] per page chars:', JSON.stringify(result.perPageChars));
    console.log('[PDF] total extracted chars:', result.rawText.length);
    console.log('[PDF] OCR triggered:', result.ocrTriggered ? 'YES' : 'NO');
    console.log('[PDF] extraction method:', result.extractionMethod);
    console.log('[PDF] preview:', result.cleanText.slice(0, 1000) || '[NO TEXT EXTRACTED]');

    if (!isSuccess) {
      console.warn(`[PDF Extract] Character count = ${textLength} (< 40). Unusable content will NOT be sent to parser.`);
    }

    return NextResponse.json({
      success: isSuccess,
      code: isSuccess ? 'SUCCESS' : (result.metrics?.code || 'NO_TEXT_EXTRACTED'),
      filename: fileName,
      fileSize: file.size,
      bufferSize: buffer.length,
      uint8ArraySize: buffer.length,
      pdfSignatureValid: result.pdfSignatureValid ?? true,
      pageCount: result.pageCount || 1,
      perPageChars: result.perPageChars || [textLength],
      extractionMethod: result.extractionMethod,
      sourceType: result.sourceType,
      ocrRequired: textLength < 40,
      ocrTriggered: result.ocrTriggered ?? false,
      ocrConfidence: result.ocrConfidence ?? 0,
      ocrProviderName: result.ocrProviderName,
      textLength,
      rawTextLength: result.rawText.length,
      preview: result.cleanText.slice(0, 1500),
      reason: isSuccess ? undefined : (result.metrics?.reason || 'No text extracted from document')
    });
  } catch (error: any) {
    console.error('[API RESUME EXTRACT] Exception:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_EXCEPTION', error: error.message || 'Extraction failed' },
      { status: 500 }
    );
  }
}
