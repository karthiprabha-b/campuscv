/**
 * extractPdf.ts — Pure Server-Side PDF Text Extractor with Multi-Column Layout Support
 *
 * Implements:
 * 1. Node-compatible PDF text extraction via PDFParse
 * 2. Multi-column layout detection and column-aware reading order preservation
 * 3. Exact diagnostics: input bytes, pages, text items, character counts
 */

import zlib from 'zlib';
import { ExtractionResult, ExtractOptions, StructuralBlock, ExtractionMetrics } from '../types/extraction';

interface TextItem {
  str: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

function processPageItemsToText(items: any[], viewportWidth = 600): string {
  if (!items || items.length === 0) return '';

  const parsedItems: TextItem[] = items
    .map(item => ({
      str: item.str || '',
      x: item.transform?.[4] || 0,
      y: item.transform?.[5] || 0,
      width: item.width,
      height: item.height
    }))
    .filter(item => item.str.trim().length > 0);

  if (parsedItems.length === 0) return '';

  // Check for 2-column layout
  // Compute X range of items
  const minX = Math.min(...parsedItems.map(i => i.x));
  const maxX = Math.max(...parsedItems.map(i => i.x));
  const midX = minX + (maxX - minX) / 2;

  // Count items on left and right sides
  const leftItems = parsedItems.filter(i => i.x < midX - 20);
  const rightItems = parsedItems.filter(i => i.x > midX + 20);
  const spanningItems = parsedItems.filter(i => i.x >= midX - 20 && i.x <= midX + 20);

  // If there are significant items on both left and right with few spanning items in the gutter,
  // and both columns span significant Y ranges, it is a multi-column document
  const isTwoColumn = leftItems.length >= 8 && rightItems.length >= 8 && spanningItems.length < (leftItems.length + rightItems.length) * 0.25;

  if (isTwoColumn) {
    const sortAndGroupColumn = (colItems: TextItem[]): string => {
      const sorted = [...colItems].sort((a, b) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 4) return yDiff;
        return a.x - b.x;
      });

      let lastY: number | null = null;
      let currentLine = '';
      const lines: string[] = [];

      sorted.forEach(item => {
        if (lastY !== null && Math.abs(item.y - lastY) > 4) {
          if (currentLine.trim()) lines.push(currentLine.trim());
          currentLine = item.str;
        } else {
          currentLine += (currentLine ? ' ' : '') + item.str;
        }
        lastY = item.y;
      });
      if (currentLine.trim()) lines.push(currentLine.trim());
      return lines.join('\n');
    };

    // Header items at the very top (e.g. Name/Contact across top before column split)
    const maxY = Math.max(...parsedItems.map(i => i.y));
    const headerThreshold = maxY - 100;
    const headerItems = parsedItems.filter(i => i.y >= headerThreshold && (i.x < midX + 50 || i.str.length > 20));
    const bodyLeft = leftItems.filter(i => i.y < headerThreshold);
    const bodyRight = rightItems.filter(i => i.y < headerThreshold);

    if (headerItems.length > 0 && bodyLeft.length > 0 && bodyRight.length > 0) {
      const headerText = sortAndGroupColumn(headerItems);
      const leftText = sortAndGroupColumn(bodyLeft);
      const rightText = sortAndGroupColumn(bodyRight);
      return `${headerText}\n\n${leftText}\n\n${rightText}`.trim();
    }

    const leftText = sortAndGroupColumn(leftItems);
    const rightText = sortAndGroupColumn(rightItems);
    return `${leftText}\n\n${rightText}`.trim();
  }

  // Standard 1-column reading order: top-to-bottom, left-to-right
  const sorted = [...parsedItems].sort((a, b) => {
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > 4) return yDiff;
    return a.x - b.x;
  });

  let lastY: number | null = null;
  let currentLine = '';
  const lines: string[] = [];

  sorted.forEach(item => {
    if (lastY !== null && Math.abs(item.y - lastY) > 4) {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = item.str;
    } else {
      currentLine += (currentLine ? ' ' : '') + item.str;
    }
    lastY = item.y;
  });
  if (currentLine.trim()) lines.push(currentLine.trim());

  return lines.join('\n');
}

export async function extractPdfText(
  input: Buffer | ArrayBuffer | Uint8Array | File,
  options: ExtractOptions = {}
): Promise<ExtractionResult> {
  const fileName = options.fileName || 'resume.pdf';

  let buffer: Buffer;
  if (typeof File !== 'undefined' && input instanceof File) {
    const ab = await input.arrayBuffer();
    buffer = Buffer.from(ab);
  } else if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (input instanceof Uint8Array) {
    buffer = Buffer.from(input);
  } else if (input instanceof ArrayBuffer) {
    buffer = Buffer.from(input);
  } else {
    buffer = Buffer.alloc(0);
  }

  const fileSize = buffer.length;

  if (fileSize === 0) {
    const metrics: ExtractionMetrics = {
      pages: 0,
      perPageChars: [],
      perPageOcrDetails: [],
      textItems: 0,
      rawCharacters: 0,
      cleanCharacters: 0,
      extractionMethod: 'FAILED',
      hasPdfMagicBytes: false,
      pdfSignatureValid: false,
      fileSize: 0,
      bufferSize: 0,
      uint8ArraySize: 0,
      ocrRequired: false,
      ocrTriggered: false,
      ocrStatus: 'NOT_REQUIRED',
      ocrConfidence: 0,
      extractionSucceeded: false,
      code: 'EMPTY_FILE',
      reason: 'EMPTY_UPLOAD: Uploaded file is empty (0 bytes).'
    };
    return {
      success: false,
      rawText: '',
      cleanText: '',
      sourceType: 'pdf',
      extractionMethod: 'FAILED',
      pageCount: 0,
      perPageChars: [],
      perPageOcrDetails: [],
      fileSize: 0,
      bufferSize: 0,
      uint8ArraySize: 0,
      pdfSignatureValid: false,
      ocrRequired: false,
      ocrTriggered: false,
      ocrStatus: 'NOT_REQUIRED',
      ocrConfidence: 0,
      warnings: ['EMPTY_UPLOAD: Uploaded file is empty (0 bytes)'],
      blocks: [],
      metrics,
      error: 'EMPTY_UPLOAD: Uploaded file is empty (0 bytes)'
    };
  }

  const pdfSignatureValid = buffer.length >= 8 && buffer.subarray(0, 10).toString('utf-8').includes('%PDF-');

  if (!pdfSignatureValid) {
    const metrics: ExtractionMetrics = {
      pages: 0,
      perPageChars: [],
      perPageOcrDetails: [],
      textItems: 0,
      rawCharacters: 0,
      cleanCharacters: 0,
      extractionMethod: 'FAILED',
      hasPdfMagicBytes: false,
      pdfSignatureValid: false,
      fileSize,
      bufferSize: fileSize,
      uint8ArraySize: fileSize,
      ocrRequired: false,
      ocrTriggered: false,
      ocrStatus: 'NOT_REQUIRED',
      ocrConfidence: 0,
      extractionSucceeded: false,
      code: 'INVALID_PDF_HEADER',
      reason: 'INVALID_PDF_HEADER: File does not contain a valid %PDF- magic signature.'
    };
    return {
      success: false,
      rawText: '',
      cleanText: '',
      sourceType: 'pdf',
      extractionMethod: 'FAILED',
      pageCount: 0,
      perPageChars: [],
      perPageOcrDetails: [],
      fileSize,
      bufferSize: fileSize,
      uint8ArraySize: fileSize,
      pdfSignatureValid: false,
      ocrRequired: false,
      ocrTriggered: false,
      ocrStatus: 'NOT_REQUIRED',
      ocrConfidence: 0,
      warnings: ['INVALID_PDF_HEADER: Invalid PDF header signature'],
      blocks: [],
      metrics,
      error: 'INVALID_PDF_HEADER: Invalid PDF header signature'
    };
  }

  let rawText = '';
  let pageCount = 0;
  let textItemsCount = 0;
  let perPageChars: number[] = [];
  let warnings: string[] = [];

  let pdfModule: any;
  let PDFParseClass: any;

  try {
    pdfModule = require('pdf-parse');
    PDFParseClass = pdfModule.PDFParse || (pdfModule.default && pdfModule.default.PDFParse) || pdfModule;
  } catch (err: any) {
    warnings.push(`PDF parser load error: ${err.message}`);
  }

  if (typeof PDFParseClass === 'function') {
    try {
      const uint8 = new Uint8Array(buffer);
      const instance = new PDFParseClass(uint8, { disableWorker: true, verbosity: 0 });
      await instance.load();

      pageCount = instance.doc?.numPages || 1;
      const pageTexts: string[] = [];

      for (let p = 1; p <= pageCount; p++) {
        try {
          const page = await instance.doc.getPage(p);
          const content = await page.getTextContent();
          const items = content.items || [];
          if (p === 1) textItemsCount = items.length;

          let pText = processPageItemsToText(items);

          if (!pText || !pText.trim()) {
            pText = await instance.getPageText(page, {}).catch(() => '');
          }

          const trimmed = pText.trim();
          perPageChars.push(trimmed.length);
          if (trimmed) pageTexts.push(trimmed);
        } catch (pErr: any) {
          perPageChars.push(0);
        }
      }

      rawText = pageTexts.join('\n\n').trim();
    } catch (parseErr: any) {
      warnings.push(`PDFParse text error: ${parseErr.message}`);
    }
  }

  // Stream Decompression Fallback if standard extraction is empty
  if (!rawText || rawText.trim().length < 50) {
    const streamText = decompressPdfStreamsAndExtractText(buffer);
    if (streamText && streamText.trim().length >= 50) {
      rawText = streamText.trim();
      perPageChars = [rawText.length];
    }
  }

  const cleanText = rawText
    .replace(/-- \d+ of \d+ --/g, '')
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const cleanCharacters = cleanText.length;
  const isUsable = cleanCharacters >= 50;

  const extractionMethod = isUsable ? 'PDF_TEXT' : 'FAILED';
  const ocrRequired = !isUsable;

  const blocks: StructuralBlock[] = [];
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  lines.forEach((line, idx) => {
    const isHeadingCandidate = /^(SUMMARY|ABOUT|OBJECTIVE|PROFILE|EDUCATION|ACADEMIC BACKGROUND|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|INTERNSHIPS|PROJECTS|SKILLS|TECHNICAL SKILLS|CERTIFICATIONS|CERTIFICATES|ACHIEVEMENTS|LINKS|LANGUAGES)$/i.test(line);
    const isListItem = /^[•●▪◦·*–—\-]\s*/.test(line);
    blocks.push({
      type: isHeadingCandidate ? 'heading' : isListItem ? 'list-item' : 'text',
      text: line,
      lineIndex: idx + 1
    });
  });

  const metrics: ExtractionMetrics = {
    pages: pageCount || 1,
    perPageChars: perPageChars.length > 0 ? perPageChars : [cleanCharacters],
    perPageOcrDetails: [],
    textItems: textItemsCount || cleanText.split(/\s+/).filter(Boolean).length,
    rawCharacters: rawText.length,
    cleanCharacters,
    extractionMethod,
    hasPdfMagicBytes: pdfSignatureValid,
    pdfSignatureValid,
    fileSize,
    bufferSize: fileSize,
    uint8ArraySize: fileSize,
    ocrRequired,
    ocrTriggered: false,
    ocrStatus: 'NOT_REQUIRED',
    ocrConfidence: 0,
    extractionSucceeded: isUsable,
    code: isUsable ? 'SUCCESS' : 'PDF_TEXT_LAYER_EMPTY',
    reason: isUsable ? undefined : 'PDF text layer contains fewer than 50 readable text characters.'
  };

  return {
    success: isUsable,
    rawText,
    cleanText,
    sourceType: 'pdf',
    extractionMethod,
    pageCount: pageCount || 1,
    perPageChars,
    perPageOcrDetails: [],
    fileSize,
    bufferSize: fileSize,
    uint8ArraySize: fileSize,
    pdfSignatureValid,
    ocrRequired,
    ocrTriggered: false,
    ocrStatus: 'NOT_REQUIRED',
    ocrConfidence: 0,
    warnings,
    blocks,
    metrics,
    error: isUsable ? undefined : 'PDF text layer contains fewer than 50 readable text characters.'
  };
}

export function decompressPdfStreamsAndExtractText(buffer: Buffer): string {
  if (!buffer || buffer.length < 10) return '';
  const extractedLines: string[] = [];
  const bufferStr = buffer.toString('binary');
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;

  let match: RegExpExecArray | null;
  while ((match = streamRegex.exec(bufferStr)) !== null) {
    const rawStreamStr = match[1];
    const streamBuffer = Buffer.from(rawStreamStr, 'binary');
    let textContent = '';

    try {
      textContent = zlib.inflateSync(streamBuffer).toString('utf-8');
    } catch (e1) {
      try {
        textContent = zlib.inflateRawSync(streamBuffer).toString('utf-8');
      } catch (e2) {
        textContent = rawStreamStr;
      }
    }

    if (textContent) {
      const tjRegex = /\(([^()]*)\)\s*Tj/g;
      let tjMatch: RegExpExecArray | null;
      while ((tjMatch = tjRegex.exec(textContent)) !== null) {
        const s = tjMatch[1].trim();
        if (s && !/^\d+$/.test(s) && s.length > 1) extractedLines.push(s);
      }

      const tjArrayRegex = /\[\s*((?:\([^()]*\)\s*-?\d*\s*)+)\s*\]\s*TJ/g;
      while ((tjMatch = tjArrayRegex.exec(textContent)) !== null) {
        const arrayContent = tjMatch[1];
        const itemRegex = /\(([^()]*)\)/g;
        let itemMatch: RegExpExecArray | null;
        let combinedStr = '';
        while ((itemMatch = itemRegex.exec(arrayContent)) !== null) {
          combinedStr += itemMatch[1];
        }
        if (combinedStr.trim() && combinedStr.length > 1) extractedLines.push(combinedStr.trim());
      }
    }
  }
  return extractedLines.join('\n');
}
