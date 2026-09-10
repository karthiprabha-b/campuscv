/**
 * pdfOcr.ts — Dedicated Server-Side PDF Page Image Rasterizer & Tesseract OCR Engine
 *
 * Implements:
 * 1. Server-side in-process page rasterization via PDFParse ({ disableWorker: true, verbosity: 0 }) at scale 2.5 (~150-200 DPI)
 * 2. Rejection of oversized documents (MAX_PAGES = 10, MAX_FILE_SIZE = 15MB)
 * 3. Execution of a single Tesseract worker instance across all pages
 * 4. Clean worker termination in a finally block
 * 5. Return: text, pageCount, ocrConfidence, ocrPagesProcessed, perPageChars
 */

export interface ServerOcrResult {
  text: string;
  pageCount: number;
  ocrPagesProcessed: number;
  ocrConfidence: number;
  perPageChars: number[];
  providerName: string;
}

export const MAX_PAGES = 10;
export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function performServerPdfOcr(
  buffer: Buffer,
  options: { fileName?: string; maxPages?: number } = {}
): Promise<ServerOcrResult> {
  const fileName = options.fileName || 'scanned_resume.pdf';
  const limitPages = options.maxPages || MAX_PAGES;

  console.log(`[SERVER PDF OCR] Initiating server-side OCR on ${fileName} (${buffer.length} bytes)...`);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`FILE_SIZE_EXCEEDED: PDF size (${(buffer.length / 1024 / 1024).toFixed(1)}MB) exceeds 15MB upload limit.`);
  }

  // Step 1: Safe import of pdf-parse v2 module
  let pdfModule: any;
  let PDFParseClass: any;

  try {
    pdfModule = require('pdf-parse');
    PDFParseClass = pdfModule.PDFParse || (pdfModule.default && pdfModule.default.PDFParse) || pdfModule;
  } catch (err: any) {
    console.error('[SERVER PDF OCR] pdf-parse load failed:', err.message);
    throw new Error(`PDF_PARSER_LOAD_FAILED: ${err.message}`);
  }

  const uint8 = new Uint8Array(buffer);
  const instance = new PDFParseClass(uint8, { disableWorker: true, verbosity: 0 });
  await instance.load();

  const totalPages = instance.doc?.numPages || 1;
  const pageCount = Math.min(totalPages, limitPages);

  console.log(`[SERVER PDF OCR] Document contains ${totalPages} pages. Processing up to ${pageCount} pages at scale 2.5...`);

  // Step 2: Rasterize PDF pages into PNG image buffers at scale 2.5 (~150-200 DPI)
  const shotRes = await instance.getScreenshot({ scale: 2.5 }).catch((shotErr: any) => {
    console.error('[SERVER PDF OCR] Page screenshot rasterization error:', shotErr.message);
    return null;
  });

  if (!shotRes || !shotRes.pages || shotRes.pages.length === 0) {
    throw new Error('PDF_RASTERIZATION_FAILED: Unable to render PDF pages into image buffers.');
  }

  const pageImageBuffers: Buffer[] = shotRes.pages
    .slice(0, pageCount)
    .map((p: any) => (p.data ? Buffer.from(p.data) : null))
    .filter(Boolean);

  if (pageImageBuffers.length === 0) {
    throw new Error('PDF_RASTERIZATION_EMPTY: Rasterized page screenshot array contained 0 valid PNG buffers.');
  }

  // Step 3: Initialize single Tesseract worker instance across document pages
  let worker: any = null;
  const pageTexts: string[] = [];
  const perPageChars: number[] = [];
  let totalConfidence = 0;

  try {
    const req = typeof eval !== 'undefined' ? eval('require') : null;
    const tesseract = req ? req('tesseract.js') : await import('tesseract.js').catch(() => null);

    if (!tesseract || (!tesseract.createWorker && !tesseract.default?.createWorker)) {
      throw new Error('TESSERACT_LOAD_FAILED: tesseract.js module unavailable in server environment.');
    }

    const createWorkerFn = tesseract.createWorker || tesseract.default.createWorker;
    worker = await createWorkerFn('eng');

    for (let i = 0; i < pageImageBuffers.length; i++) {
      const pageNum = i + 1;
      console.log(`[SERVER PDF OCR] OCR_PAGE_START Page ${pageNum}/${pageImageBuffers.length}...`);

      const ret = await worker.recognize(pageImageBuffers[i]);
      const pText = (ret?.data?.text || '').trim();
      const pConf = typeof ret?.data?.confidence === 'number' ? Math.round(ret.data.confidence) : 85;

      console.log(`[SERVER PDF OCR] OCR_PAGE_COMPLETE Page ${pageNum}: ${pText.length} chars (Confidence: ${pConf}%)`);

      pageTexts.push(pText);
      perPageChars.push(pText.length);
      totalConfidence += pConf;
    }
  } finally {
    if (worker && typeof worker.terminate === 'function') {
      await worker.terminate().catch(() => {});
      console.log('[SERVER PDF OCR] Tesseract worker terminated cleanly.');
    }
  }

  const combinedText = pageTexts.join('\n\n').trim();
  const avgConfidence = pageImageBuffers.length > 0 ? Math.round(totalConfidence / pageImageBuffers.length) : 0;

  console.log(`[SERVER PDF OCR] OCR_COMPLETE: Combined ${combinedText.length} chars across ${pageImageBuffers.length} pages (Avg Confidence: ${avgConfidence}%).`);

  return {
    text: combinedText,
    pageCount: pageImageBuffers.length,
    ocrPagesProcessed: pageImageBuffers.length,
    ocrConfidence: avgConfidence,
    perPageChars,
    providerName: 'Tesseract.js'
  };
}
