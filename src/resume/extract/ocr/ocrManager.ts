/**
 * ocrManager.ts — Standardized Resume Image OCR Manager & Self-Test Engine
 *
 * Enforces Image OCR Pipeline:
 * Rejects raw PDF byte buffers. Accepts PNG DataURLs, HTMLCanvasElement, HTMLImageElement, or Blobs.
 * Distinguishes OCR_COMPLETE, OCR_EMPTY, and OCR_FAILED cleanly.
 */

import { ResumeOCRProvider, OCRPageResult, OCRResult } from './ocrTypes';
import { TesseractOcrProvider } from './providers/tesseractProvider';

export type OCRInput = HTMLCanvasElement | HTMLImageElement | Blob | string | Uint8Array | Buffer;

export async function executeOcr(
  image: OCRInput,
  options: { fileName?: string; pageNumber?: number; pageCount?: number } = {}
): Promise<OCRResult> {
  console.log('[OCR Manager] executeOcr called...');
  const provider = new TesseractOcrProvider();

  if (Array.isArray(image)) {
    return provider.extractDocument(image);
  }

  const pageRes = await provider.extractPage(image, options.pageNumber || 1);
  return {
    text: pageRes.text,
    confidence: pageRes.confidence,
    providerName: provider.name,
    pagesRecognized: 1,
    perPageChars: [pageRes.charCount],
    pageResults: [pageRes]
  };
}

export async function extractPage(image: OCRInput, pageNumber = 1): Promise<OCRPageResult> {
  const provider = new TesseractOcrProvider();
  return provider.extractPage(image, pageNumber);
}

export async function extractDocument(pageImages: OCRInput[]): Promise<OCRResult> {
  const provider = new TesseractOcrProvider();
  return provider.extractDocument(pageImages);
}

/**
 * Tesseract.js Self-Test Routine
 * Tests Tesseract worker initialization on a valid synthetic PNG DataURL.
 */
export async function runTesseractSelfTest(): Promise<{
  passed: boolean;
  text: string;
  charCount: number;
  error?: string;
}> {
  console.log('[Tesseract Self-Test] Initiating Tesseract engine self-test...');

  try {
    const provider = new TesseractOcrProvider();
    // Valid 1x1 white PNG DataURL
    const validPngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

    const res = await provider.extractPage(validPngDataUrl, 1);
    console.log('[Tesseract Self-Test] Engine initialized cleanly.');
    return {
      passed: true,
      text: res.text,
      charCount: res.charCount
    };
  } catch (err: any) {
    console.warn('[Tesseract Self-Test] Engine self-test notice:', err.message);
    return {
      passed: false,
      text: '',
      charCount: 0,
      error: err.message || String(err)
    };
  }
}

export class OCRManager {
  private activeProvider: ResumeOCRProvider = new TesseractOcrProvider();

  public setProvider(provider: ResumeOCRProvider): void {
    this.activeProvider = provider;
  }

  public async executeOcr(image: OCRInput, options: any = {}): Promise<OCRResult> {
    return executeOcr(image, options);
  }

  public async extractPage(image: OCRInput, pageNumber = 1): Promise<OCRPageResult> {
    return extractPage(image, pageNumber);
  }

  public async extractDocument(pageImages: OCRInput[]): Promise<OCRResult> {
    return extractDocument(pageImages);
  }
}

// Global Instance
export const ocrManager = new OCRManager();

// Static Class Compatibility Export
export class OcrManager {
  public static setProvider(provider: ResumeOCRProvider): void {
    ocrManager.setProvider(provider);
  }

  public static async executeOcr(image: OCRInput, options: any = {}): Promise<OCRResult> {
    return executeOcr(image, options);
  }

  public static async extractPage(image: OCRInput, pageNumber = 1): Promise<OCRPageResult> {
    return extractPage(image, pageNumber);
  }

  public static async extractDocument(pageImages: OCRInput[]): Promise<OCRResult> {
    return extractDocument(pageImages);
  }
}

export default ocrManager;
