/**
 * extractDocx.ts — Independent Server-Side DOCX Extractor
 *
 * Implements structured DOCX extraction via Mammoth:
 * - Preserves document headings (H1-H6)
 * - Preserves bullet lists and ordered items (<li> -> •)
 * - Preserves table layout (<tr> / <td> delimited by | to avoid text squashing)
 * - Preserves embedded hyperlinks (<a href="...">text</a> -> text (url))
 * - Cleans HTML entities and generates standardized StructuralBlock objects
 */

import mammoth from 'mammoth';
import { ExtractionResult, ExtractOptions, StructuralBlock, ExtractionMetrics } from '../types/extraction';

function convertHtmlToStructuredText(html: string): string {
  if (!html) return '';

  return html
    // 1. Headings (H1 - H6) -> Standalone capitalized lines with double newlines
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n$1\n\n')

    // 2. Table rows and cells -> Preserves columns separated by ' | '
    .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowContent) => {
      const cells: string[] = [];
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let match: RegExpExecArray | null;
      while ((match = cellRegex.exec(rowContent)) !== null) {
        const cellText = match[1].replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').trim();
        if (cellText) cells.push(cellText);
      }
      return cells.length > 0 ? `\n${cells.join(' | ')}\n` : '\n';
    })

    // 3. Unordered and ordered list items -> Bullet points
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n• $1\n')

    // 4. Hyperlinks -> Preserve both text and destination URL
    .replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, linkText) => {
      const cleanText = linkText.replace(/<[^>]+>/g, '').trim();
      if (!cleanText || cleanText === href || href.includes(cleanText)) {
        return href;
      }
      if (/github|linkedin|behance|dribbble|twitter|x\.com|portfolio|http/i.test(cleanText)) {
        return cleanText.includes('http') ? cleanText : `${cleanText}: ${href}`;
      }
      return `${cleanText} (${href})`;
    })

    // 5. Paragraphs and line breaks
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*\/?>/gi, '\n')

    // 6. Strip all remaining HTML tags
    .replace(/<[^>]+>/g, ' ')

    // 7. Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&bull;/g, '•')
    .replace(/&middot;/g, '•')

    // 8. Normalize spacing and line breaks
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function extractDocxText(
  input: Buffer | ArrayBuffer,
  options: ExtractOptions = {}
): Promise<ExtractionResult> {
  const fileName = options.fileName || 'resume.docx';
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

  let rawText = '';
  let cleanText = '';
  let warnings: string[] = [];
  let method = 'mammoth-html-structured';

  try {
    // 1. Primary extraction: Mammoth HTML with preserved semantic structure
    const htmlResult = await mammoth.convertToHtml({ buffer });
    if (htmlResult.value && htmlResult.value.trim().length > 0) {
      cleanText = convertHtmlToStructuredText(htmlResult.value);
      rawText = cleanText;
    }
    if (htmlResult.messages && htmlResult.messages.length > 0) {
      htmlResult.messages.forEach(m => warnings.push(m.message));
    }
  } catch (err: any) {
    warnings.push(`Mammoth HTML conversion error: ${err.message}`);
  }

  // 2. Fallback extraction: Mammoth raw text if HTML extraction produced empty text
  if (!cleanText || cleanText.length < 20) {
    try {
      const rawResult = await mammoth.extractRawText({ buffer });
      rawText = rawResult.value || '';
      cleanText = rawText
        .replace(/\u0000/g, '')
        .replace(/\r/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      method = 'mammoth-extract-raw-text';
      if (rawResult.messages && rawResult.messages.length > 0) {
        rawResult.messages.forEach(m => warnings.push(m.message));
      }
    } catch (rawErr: any) {
      warnings.push(`Mammoth raw text fallback error: ${rawErr.message}`);
    }
  }

  const cleanCharacters = cleanText.length;
  const extractionSucceeded = cleanCharacters >= 20;

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
    pages: 1,
    perPageChars: [cleanCharacters],
    perPageOcrDetails: [],
    textItems: cleanText.split(/\s+/).filter(Boolean).length,
    rawCharacters: rawText.length,
    cleanCharacters,
    extractionMethod: method,
    hasPdfMagicBytes: false,
    pdfSignatureValid: false,
    fileSize: buffer.length,
    bufferSize: buffer.length,
    uint8ArraySize: buffer.length,
    ocrRequired: false,
    ocrTriggered: false,
    ocrStatus: 'NOT_REQUIRED',
    ocrConfidence: 0,
    extractionSucceeded,
    code: extractionSucceeded ? 'SUCCESS' : 'NO_RESUME_CONTENT',
    reason: extractionSucceeded ? undefined : "Could not read usable text from this DOCX file."
  };

  return {
    success: extractionSucceeded,
    rawText,
    cleanText,
    sourceType: 'docx',
    extractionMethod: method,
    pageCount: 1,
    perPageChars: [cleanCharacters],
    perPageOcrDetails: [],
    fileSize: buffer.length,
    bufferSize: buffer.length,
    uint8ArraySize: buffer.length,
    pdfSignatureValid: false,
    ocrRequired: false,
    ocrTriggered: false,
    ocrStatus: 'NOT_REQUIRED',
    ocrConfidence: 0,
    warnings,
    blocks,
    metrics
  };
}

/**
 * Backward compatibility wrapper for extractDocxFromBuffer
 */
export async function extractDocxFromBuffer(buffer: Buffer, fileExt = '.docx'): Promise<{ rawText: string; method: string }> {
  const result = await extractDocxText(buffer, { fileName: `resume${fileExt}` });
  return {
    rawText: result.rawText,
    method: result.extractionMethod
  };
}
