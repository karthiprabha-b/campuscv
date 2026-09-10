/**
 * ocrFallback.ts — OCR Fallback Utilities
 */

import { ocrManager, OcrManager } from './ocr/ocrManager';
import { OCRResult, OCRPageResult } from './ocr/ocrTypes';

export async function performOcrOnPageImages(pageImages: any[]): Promise<OCRResult> {
  return ocrManager.extractDocument(pageImages);
}

export async function performOcrOnSingleImage(imageBuffer: any, pageNumber = 1): Promise<OCRPageResult> {
  return ocrManager.extractPage(imageBuffer, pageNumber);
}
