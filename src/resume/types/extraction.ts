/**
 * extraction.ts — Standardized Extraction Interfaces & Debug Metrics Model
 */

export type StructuralBlockType = 'heading' | 'subheading' | 'text' | 'list-item' | 'contact-item';

export interface StructuralBlock {
  type: StructuralBlockType;
  text: string;
  page?: number;
  lineIndex?: number;
  confidence?: number;
}

export type ExtractionErrorCode =
  | 'SUCCESS'
  | 'INVALID_FILE'
  | 'EMPTY_FILE'
  | 'INVALID_PDF_HEADER'
  | 'PDF_PARSER_LOAD_FAILED'
  | 'PDF_PARSE_FAILED'
  | 'PDF_TEXT_LAYER_EMPTY'
  | 'OCR_REQUIRED'
  | 'OCR_EMPTY'
  | 'OCR_FAILED'
  | 'NO_RESUME_CONTENT'
  | 'PROFILE_MAPPING_FAILED';

export interface PageOcrDetail {
  pageNumber: number;
  pdfJsChars: number;
  canvasCreated: boolean;
  canvasWidth: number;
  canvasHeight: number;
  canvasPixels: number;
  nonWhitePixels: number;
  nonWhitePercentage: number;
  isBlank: boolean;
  renderCompleted: boolean;
  pngGenerated: boolean;
  pngLength: number;
  pngPrefix: string;
  imageDataUrl?: string; // Rendered PNG data URL for preview modal
  ocrStarted: boolean;
  ocrCompleted: boolean;
  ocrChars: number;
  ocrConfidence: number;
  ocrDurationMs: number;
  ocrError?: string;
  ocrTextPreview?: string;
  renderScale: number;
}

export interface ExtractionMetrics {
  pages: number;
  perPageChars: number[];
  perPageOcrDetails: PageOcrDetail[];
  textItems: number;
  rawCharacters: number;
  cleanCharacters: number;
  extractionMethod: string;
  hasPdfMagicBytes: boolean;
  pdfSignatureValid: boolean;
  fileSize: number;
  bufferSize: number;
  uint8ArraySize: number;
  ocrRequired: boolean;
  ocrTriggered: boolean;
  ocrStatus: 'NOT_REQUIRED' | 'STARTING' | 'RENDERING' | 'RECOGNIZING' | 'OCR_COMPLETE' | 'OCR_EMPTY' | 'OCR_FAILED';
  ocrConfidence: number;
  ocrProviderName?: string;
  ocrError?: string;
  ocrStack?: string;
  ocrSelfTestPassed?: boolean;
  ocrSelfTestChars?: number;
  ocrSelfTestError?: string;
  extractionSucceeded: boolean;
  code: ExtractionErrorCode;
  reason?: string;
}

export interface ExtractionResult {
  success: boolean;
  rawText: string;
  cleanText: string;
  sourceType: 'pdf' | 'docx';
  extractionMethod: string;
  pageCount: number;
  perPageChars: number[];
  perPageOcrDetails: PageOcrDetail[];
  fileSize: number;
  bufferSize: number;
  uint8ArraySize: number;
  pdfSignatureValid: boolean;
  ocrRequired: boolean;
  ocrTriggered: boolean;
  ocrStatus: 'NOT_REQUIRED' | 'STARTING' | 'RENDERING' | 'RECOGNIZING' | 'OCR_COMPLETE' | 'OCR_EMPTY' | 'OCR_FAILED';
  ocrConfidence: number;
  ocrProviderName?: string;
  ocrError?: string;
  ocrStack?: string;
  ocrSelfTestPassed?: boolean;
  ocrSelfTestChars?: number;
  ocrSelfTestError?: string;
  warnings: string[];
  blocks: StructuralBlock[];
  metrics: ExtractionMetrics;
  error?: string;
}

export interface ExtractOptions {
  fileName?: string;
  enableOcrFallback?: boolean;
}
