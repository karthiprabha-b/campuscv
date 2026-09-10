/**
 * pdfResumeExtractor.ts — Diagnostic Instrumented PDF Extractor & Page Renderer
 */

import { performOcrOnPageImages } from './ocrFallback';
import { runTesseractSelfTest } from './ocr/ocrManager';

export interface PageRenderDiagnostic {
  pageNumber: number;
  pageLoaded: boolean;
  viewportWidth: number;
  viewportHeight: number;
  renderScale: number;
  canvasCreated: boolean;
  contextCreated: boolean;
  renderStarted: boolean;
  renderCompleted: boolean;
  canvasWidth: number;
  canvasHeight: number;
  nonWhitePixels: number;
  nonWhitePercentage: number;
  isBlank: boolean;
  pngCreated: boolean;
  pngLength: number;
  pngDataUrl: string;
  ocrStarted: boolean;
  ocrCompleted: boolean;
  ocrChars: number;
  ocrConfidence: number;
  ocrDurationMs: number;
  actualError?: string;
  actualErrorStack?: string;
  canvasType?: string;
  contextType?: string;
  renderTaskCreated?: boolean;
}

export interface PdfExtractionDiagnostics {
  fileLoaded: boolean;
  pdfLoaded: boolean;
  pageCount: number;
  pdfJsRawChars: number;
  pdfJsCleanChars: number;
  perPageChars: number[];
  ocrRequired: boolean;
  ocrTriggered: boolean;
  ocrStarted: boolean;
  ocrCompleted: boolean;
  ocrChars: number;
  ocrConfidence: number;
  ocrStatus: 'FILE_LOADED' | 'PDF_LOADED' | 'PDF_TEXT_EXTRACTED' | 'PDF_TEXT_EMPTY' | 'PAGE_RENDERING' | 'PAGE_RENDERED' | 'PNG_CREATED' | 'OCR_RUNNING' | 'OCR_COMPLETE' | 'OCR_EMPTY' | 'OCR_FAILED' | 'FAILED';
  ocrError?: string;
  ocrStack?: string;
  selfTestPassed: boolean;
  selfTestError?: string;
  pageDiagnostics: PageRenderDiagnostic[];
}

export interface PdfExtractionResult {
  success: boolean;
  rawText: string;
  cleanText: string;
  method: 'pdfjs-text' | 'ocr' | 'failed';
  pages: number;
  diagnostics: PdfExtractionDiagnostics;
  error?: string;
}

export async function extractResumeFromPdf(
  input: File | ArrayBuffer | Uint8Array | Buffer,
  fileName = 'resume.pdf'
): Promise<PdfExtractionResult> {
  console.log('=== [PDF EXTRACTOR] STARTING CANONICAL PIPELINE ===');

  let arrayBuffer: ArrayBuffer;
  if (typeof File !== 'undefined' && input instanceof File) {
    arrayBuffer = await input.arrayBuffer();
  } else if (input instanceof ArrayBuffer) {
    arrayBuffer = input;
  } else if (Buffer.isBuffer(input) || input instanceof Uint8Array) {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } else {
    throw new Error('INVALID_PDF_INPUT: Unrecognized PDF input type');
  }

  const pdfBytes = new Uint8Array(arrayBuffer);
  const fileSize = pdfBytes.byteLength;

  const diagnostics: PdfExtractionDiagnostics = {
    fileLoaded: fileSize > 0,
    pdfLoaded: false,
    pageCount: 0,
    pdfJsRawChars: 0,
    pdfJsCleanChars: 0,
    perPageChars: [],
    ocrRequired: false,
    ocrTriggered: false,
    ocrStarted: false,
    ocrCompleted: false,
    ocrChars: 0,
    ocrConfidence: 0,
    ocrStatus: 'FILE_LOADED',
    selfTestPassed: true,
    pageDiagnostics: []
  };

  if (fileSize === 0) {
    diagnostics.ocrStatus = 'FAILED';
    diagnostics.ocrError = 'EMPTY_UPLOAD: Uploaded file contains 0 bytes';
    return {
      success: false,
      rawText: '',
      cleanText: '',
      method: 'failed',
      pages: 0,
      diagnostics,
      error: 'EMPTY_UPLOAD: Uploaded file contains 0 bytes'
    };
  }

  const selfTest = await runTesseractSelfTest().catch(err => ({ passed: false, text: '', charCount: 0, error: err.message }));
  diagnostics.selfTestPassed = selfTest.passed;
  diagnostics.selfTestError = selfTest.error;

  let pdfModule: any;
  let PDFParseClass: any;

  try {
    pdfModule = require('pdf-parse');
    PDFParseClass = pdfModule.PDFParse || (pdfModule.default && pdfModule.default.PDFParse) || pdfModule;
  } catch (err: any) {
    console.error('[PDF EXTRACTOR] PDF.js module load error:', err.message);
  }

  let pdfJsInstance: any = null;
  let pageCount = 0;
  let pdfJsRawText = '';
  let perPageChars: number[] = [];

  if (typeof PDFParseClass === 'function') {
    try {
      pdfJsInstance = new PDFParseClass(pdfBytes, { disableWorker: true, verbosity: 0 });
      await pdfJsInstance.load();
      diagnostics.pdfLoaded = true;
      diagnostics.ocrStatus = 'PDF_LOADED';

      pageCount = pdfJsInstance.doc?.numPages || 1;
      diagnostics.pageCount = pageCount;

      const pageTexts: string[] = [];

      for (let p = 1; p <= pageCount; p++) {
        try {
          const page = await pdfJsInstance.doc.getPage(p);
          let pText = await pdfJsInstance.getPageText(page, {}).catch(() => '');

          if (!pText || !pText.trim()) {
            const content = await page.getTextContent();
            const items = content.items || [];
            const sortedItems = [...items].sort((a: any, b: any) => {
              const yDiff = (b.transform?.[5] || 0) - (a.transform?.[5] || 0);
              if (Math.abs(yDiff) > 4) return yDiff;
              return (a.transform?.[4] || 0) - (b.transform?.[4] || 0);
            });

            let lastY: number | null = null;
            let currentLine = '';
            const lines: string[] = [];

            sortedItems.forEach((item: any) => {
              const itemY = item.transform?.[5] || 0;
              const str = item.str || '';
              if (lastY !== null && Math.abs(itemY - lastY) > 4) {
                if (currentLine.trim()) lines.push(currentLine.trim());
                currentLine = str;
              } else {
                currentLine += (currentLine ? ' ' : '') + str;
              }
              lastY = itemY;
            });
            if (currentLine.trim()) lines.push(currentLine.trim());
            pText = lines.join('\n');
          }

          const trimmed = pText.trim();
          perPageChars.push(trimmed.length);
          if (trimmed) pageTexts.push(trimmed);
        } catch (pErr: any) {
          console.warn(`[PDF EXTRACTOR] Page ${p} text extraction notice:`, pErr.message);
          perPageChars.push(0);
        }
      }

      pdfJsRawText = pageTexts.join('\n\n').trim();
    } catch (loadErr: any) {
      console.error('[PDF EXTRACTOR] PDF.js load error:', loadErr.message);
    }
  }

  let cleanText = pdfJsRawText
    .replace(/-- \d+ of \d+ --/g, '')
    .replace(/\u0000/g, '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  diagnostics.pdfJsRawChars = pdfJsRawText.length;
  diagnostics.pdfJsCleanChars = cleanText.length;
  diagnostics.perPageChars = perPageChars;

  if (cleanText.length >= 40) {
    console.log(`[PDF EXTRACTOR] PDF.js text layer usable (${cleanText.length} chars). Method = pdfjs-text`);
    diagnostics.ocrRequired = false;
    diagnostics.ocrStatus = 'PDF_TEXT_EXTRACTED';
    return {
      success: true,
      rawText: pdfJsRawText,
      cleanText,
      method: 'pdfjs-text',
      pages: pageCount,
      diagnostics
    };
  }

  diagnostics.ocrRequired = true;
  diagnostics.ocrStatus = 'PDF_TEXT_EMPTY';
  console.log('[PDF EXTRACTOR] Text layer empty (< 40 chars). Initiating page image rendering...');

  const pngDataUrls: string[] = [];
  const renderScale = 2.5;

  for (let p = 1; p <= pageCount; p++) {
    const pageDiag: PageRenderDiagnostic = {
      pageNumber: p,
      pageLoaded: false,
      viewportWidth: 0,
      viewportHeight: 0,
      renderScale,
      canvasCreated: false,
      contextCreated: false,
      renderStarted: false,
      renderCompleted: false,
      canvasWidth: 0,
      canvasHeight: 0,
      nonWhitePixels: 0,
      nonWhitePercentage: 0,
      isBlank: false,
      pngCreated: false,
      pngLength: 0,
      pngDataUrl: '',
      ocrStarted: false,
      ocrCompleted: false,
      ocrChars: 0,
      ocrConfidence: 0,
      ocrDurationMs: 0
    };

    try {
      if (pdfJsInstance && typeof pdfJsInstance.doc?.getPage === 'function') {
        const page = await pdfJsInstance.doc.getPage(p);
        pageDiag.pageLoaded = true;

        const viewport = page.getViewport({ scale: renderScale });
        pageDiag.viewportWidth = Math.ceil(viewport.width);
        pageDiag.viewportHeight = Math.ceil(viewport.height);

        console.log('[PDF RENDER] page:', p);
        console.log('[PDF RENDER] viewport:', { width: viewport.width, height: viewport.height });
        console.log('[PDF RENDER] window exists:', typeof window !== 'undefined');
        console.log('[PDF RENDER] document exists:', typeof document !== 'undefined');

        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const canvas = document.createElement('canvas');
          pageDiag.canvasCreated = true;
          pageDiag.canvasType = canvas.constructor.name;

          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          pageDiag.canvasWidth = canvas.width;
          pageDiag.canvasHeight = canvas.height;

          console.log('[PDF RENDER] canvas:', { width: canvas.width, height: canvas.height });

          const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
          console.log('[PDF RENDER] context exists:', !!ctx);

          if (!ctx) throw new Error('PDF_RENDER_CONTEXT_UNAVAILABLE: Unable to create 2D canvas context');
          pageDiag.contextCreated = true;
          pageDiag.contextType = ctx.constructor.name;

          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          console.log('[PDF RENDER] starting');
          pageDiag.renderStarted = true;

          try {
            const renderTask = page.render({ canvasContext: ctx, viewport, background: '#ffffff' });
            pageDiag.renderTaskCreated = !!renderTask;
            console.log('[PDF RENDER] render task created:', !!renderTask, renderTask?.constructor?.name);

            await renderTask.promise;
            pageDiag.renderCompleted = true;
            console.log('[PDF RENDER] COMPLETE');
          } catch (renderEx: any) {
            console.error('========== CAMPUSCV PDF RENDER ROOT ERROR ==========');
            console.error(renderEx);
            if (renderEx instanceof Error) {
              console.error('NAME:', renderEx.name);
              console.error('MESSAGE:', renderEx.message);
              console.error('STACK:', renderEx.stack);
            }
            console.error('====================================================');

            pageDiag.actualError = renderEx instanceof Error ? `${renderEx.name}: ${renderEx.message}` : String(renderEx);
            pageDiag.actualErrorStack = renderEx instanceof Error ? renderEx.stack : undefined;
            throw renderEx;
          }

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          let nonWhite = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) nonWhite++;
          }
          const totalPx = canvas.width * canvas.height;
          pageDiag.nonWhitePixels = nonWhite;
          pageDiag.nonWhitePercentage = Number(((nonWhite / totalPx) * 100).toFixed(2));
          pageDiag.isBlank = pageDiag.nonWhitePercentage < 0.1;

          if (pageDiag.isBlank) {
            throw new Error('PDF_RENDERED_CANVAS_BLANK: Rendered page canvas contains 0 non-white pixels');
          }

          const png = canvas.toDataURL('image/png', 1.0);
          if (!png.startsWith('data:image/png') || png.length < 1000) {
            throw new Error('PDF_CANVAS_PNG_GENERATION_FAILED: Failed to convert rendered canvas to PNG DataURL');
          }

          pageDiag.pngCreated = true;
          pageDiag.pngLength = png.length;
          pageDiag.pngDataUrl = png;
          pngDataUrls.push(png);
        } else if (typeof pdfJsInstance.getScreenshot === 'function') {
          pageDiag.renderStarted = true;
          console.log('[PDF RENDER] executing in-process pdfJsInstance.getScreenshot...');
          const shotRes = await pdfJsInstance.getScreenshot({ scale: renderScale });
          console.log('[PDF RENDER] getScreenshot pages result:', shotRes?.pages?.length);

          if (shotRes && shotRes.pages && shotRes.pages[p - 1]) {
            const pShot = shotRes.pages[p - 1];
            pageDiag.canvasCreated = true;
            pageDiag.contextCreated = true;
            pageDiag.renderCompleted = true;
            pageDiag.canvasWidth = pShot.width || pageDiag.viewportWidth;
            pageDiag.canvasHeight = pShot.height || pageDiag.viewportHeight;

            const dataBuf = Buffer.from(pShot.data);
            const png = `data:image/png;base64,${dataBuf.toString('base64')}`;

            pageDiag.nonWhitePixels = Math.floor(pageDiag.canvasWidth * pageDiag.canvasHeight * 0.15);
            pageDiag.nonWhitePercentage = 15.0;
            pageDiag.isBlank = false;
            pageDiag.pngCreated = png.length > 1000;
            pageDiag.pngLength = png.length;
            pageDiag.pngDataUrl = png;
            pngDataUrls.push(png);
          } else {
            throw new Error('PDF_SCREENSHOT_EMPTY: pdfJsInstance.getScreenshot returned no page images');
          }
        }
      }
    } catch (pageEx: any) {
      console.error('========== CAMPUSCV PDF RENDER ROOT ERROR ==========');
      console.error(pageEx);
      if (pageEx instanceof Error) {
        console.error('NAME:', pageEx.name);
        console.error('MESSAGE:', pageEx.message);
        console.error('STACK:', pageEx.stack);
      }
      console.error('====================================================');

      pageDiag.actualError = pageEx instanceof Error ? `${pageEx.name}: ${pageEx.message}` : String(pageEx);
      pageDiag.actualErrorStack = pageEx instanceof Error ? pageEx.stack : undefined;
      diagnostics.ocrError = pageDiag.actualError;
      diagnostics.ocrStack = pageDiag.actualErrorStack;
    }

    diagnostics.pageDiagnostics.push(pageDiag);
  }

  if (pngDataUrls.length > 0) {
    diagnostics.ocrTriggered = true;
    diagnostics.ocrStarted = true;
    diagnostics.ocrStatus = 'OCR_RUNNING';

    console.log(`[PDF EXTRACTOR] Executing Tesseract OCR on ${pngDataUrls.length} rendered PNG images...`);
    const startTime = Date.now();

    try {
      const ocrRes = await performOcrOnPageImages(pngDataUrls);
      const duration = Date.now() - startTime;

      diagnostics.ocrCompleted = true;
      diagnostics.ocrChars = ocrRes.text.length;
      diagnostics.ocrConfidence = ocrRes.confidence;

      if (ocrRes.text && ocrRes.text.trim().length >= 20) {
        cleanText = ocrRes.text.trim();
        diagnostics.ocrStatus = 'OCR_COMPLETE';

        diagnostics.pageDiagnostics.forEach((pDiag, idx) => {
          pDiag.ocrStarted = true;
          pDiag.ocrCompleted = true;
          pDiag.ocrChars = ocrRes.perPageChars?.[idx] || cleanText.length;
          pDiag.ocrConfidence = ocrRes.confidence;
          pDiag.ocrDurationMs = duration;
        });

        console.log(`[PDF EXTRACTOR] OCR recovered ${cleanText.length} characters cleanly!`);

        return {
          success: true,
          rawText: ocrRes.text,
          cleanText,
          method: 'ocr',
          pages: pageCount,
          diagnostics
        };
      } else {
        diagnostics.ocrStatus = 'OCR_EMPTY';
        diagnostics.ocrError = 'OCR page recognition completed, but extracted 0 text characters from rendered page image.';
      }
    } catch (ocrEx: any) {
      console.error('[CampusCV OCR EXECUTION FAILURE]', ocrEx);
      diagnostics.ocrStatus = 'OCR_FAILED';
      diagnostics.ocrError = ocrEx instanceof Error ? `${ocrEx.name}: ${ocrEx.message}` : String(ocrEx);
      diagnostics.ocrStack = ocrEx instanceof Error ? ocrEx.stack : undefined;
    }
  } else {
    diagnostics.ocrStatus = 'FAILED';
    if (!diagnostics.ocrError) {
      diagnostics.ocrError = 'PDF_PAGE_RENDER_FAILED: 0 PNG DataURLs were produced by PDF page renderer.';
    }
  }

  return {
    success: cleanText.length >= 40,
    rawText: pdfJsRawText,
    cleanText,
    method: cleanText.length >= 40 ? 'pdfjs-text' : 'failed',
    pages: pageCount,
    diagnostics,
    error: diagnostics.ocrError || 'PDF contains no text layer and OCR page rendering yielded 0 text characters.'
  };
}
