/**
 * ocrTypes.ts — Pluggable Resume OCR Interface Abstraction
 *
 * Pluggable architecture supporting:
 * - Tesseract.js (Default local Node canvas/page OCR)
 * - Google Document AI OCR (Future extension)
 * - AWS Textract (Future extension)
 * - Azure Document Intelligence (Future extension)
 * - OpenAI Vision API OCR (Future extension)
 */

export interface OCRPageResult {
  pageNumber: number;
  text: string;
  confidence: number; // 0 to 100
  charCount: number;
}

export interface OCRResult {
  text: string;
  confidence: number; // 0 to 100
  providerName: string;
  pagesRecognized: number;
  perPageChars: number[];
  pageResults: OCRPageResult[];
  warning?: string;
}

export interface ResumeOCRProvider {
  name: string;
  extractPage(imageBuffer: Uint8Array | Buffer, pageNumber?: number): Promise<OCRPageResult>;
  extractDocument?(pageImages: (Uint8Array | Buffer)[]): Promise<OCRResult>;
}
