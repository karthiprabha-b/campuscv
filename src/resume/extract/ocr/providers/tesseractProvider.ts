/**
 * tesseractProvider.ts — Tesseract.js Universal Single Worker Image OCR Engine
 *
 * Enforces Image OCR: Rejects raw PDF byte buffers. Accepts PNG DataURLs, Canvas elements, images, or image buffers.
 * Uses a single Tesseract worker instance across all pages.
 */

import { ResumeOCRProvider, OCRPageResult, OCRResult } from '../ocrTypes';

export class TesseractOcrProvider implements ResumeOCRProvider {
  public name = 'Tesseract.js';

  public async extractPage(image: any, pageNumber = 1): Promise<OCRPageResult> {
    console.log(`[Tesseract OCR] OCR_PAGE_START Page ${pageNumber}...`);

    let worker: any = null;

    try {
      const preparedImage = this.prepareImageSource(image);
      if (!preparedImage) {
        throw new Error('Invalid or empty image source provided for OCR.');
      }

      const req = typeof eval !== 'undefined' ? eval('require') : null;
      const tesseract = req ? req('tesseract.js') : await import('tesseract.js').catch(() => null);

      if (tesseract && (tesseract.createWorker || tesseract.default?.createWorker)) {
        const createWorkerFn = tesseract.createWorker || tesseract.default.createWorker;
        worker = await createWorkerFn('eng');

        const res = await worker.recognize(preparedImage);

        const rawText = (res?.data?.text || '').trim();
        const confidence = typeof res?.data?.confidence === 'number' ? Math.round(res.data.confidence) : 85;

        console.log(`[Tesseract OCR] OCR_PAGE_COMPLETE Page ${pageNumber}: ${rawText.length} chars (Confidence: ${confidence}%)`);

        return {
          pageNumber,
          text: rawText,
          confidence,
          charCount: rawText.length
        };
      }
    } catch (err: any) {
      console.warn(`[Tesseract OCR] Page ${pageNumber} notice:`, err.message);
      throw err;
    } finally {
      if (worker && typeof worker.terminate === 'function') {
        await worker.terminate().catch(() => {});
      }
    }

    return {
      pageNumber,
      text: '',
      confidence: 0,
      charCount: 0
    };
  }

  public async extractDocument(pageImages: any[]): Promise<OCRResult> {
    console.log(`[Tesseract OCR] OCR_WORKER_START for ${pageImages.length} page images...`);

    const pageResults: OCRPageResult[] = [];
    const perPageChars: number[] = [];
    const textParts: string[] = [];
    let totalConfidence = 0;

    let worker: any = null;

    try {
      const req = typeof eval !== 'undefined' ? eval('require') : null;
      const tesseract = req ? req('tesseract.js') : await import('tesseract.js').catch(() => null);

      if (tesseract && (tesseract.createWorker || tesseract.default?.createWorker)) {
        const createWorkerFn = tesseract.createWorker || tesseract.default.createWorker;
        worker = await createWorkerFn('eng');
      }

      for (let i = 0; i < pageImages.length; i++) {
        const pNum = i + 1;
        console.log(`[Tesseract OCR] OCR_PAGE_START Page ${pNum}/${pageImages.length}...`);

        let pageText = '';
        let pageConf = 85;

        if (worker && typeof worker.recognize === 'function') {
          try {
            const preparedImage = this.prepareImageSource(pageImages[i]);
            if (preparedImage) {
              const ret = await worker.recognize(preparedImage);
              pageText = (ret?.data?.text || '').trim();
              if (typeof ret?.data?.confidence === 'number') {
                pageConf = Math.round(ret.data.confidence);
              }
              console.log(`[Tesseract OCR] OCR_PAGE_COMPLETE Page ${pNum}: ${pageText.length} chars (Confidence: ${pageConf}%)`);
            }
          } catch (pErr: any) {
            console.warn(`[Tesseract OCR] Worker recognize page ${pNum} notice:`, pErr.message);
          }
        }

        if (!pageText && pageImages[i]) {
          try {
            const fallbackRes = await this.extractPage(pageImages[i], pNum);
            pageText = fallbackRes.text;
            pageConf = fallbackRes.confidence;
          } catch (fErr: any) {
            console.warn(`[Tesseract OCR] Page ${pNum} fallback notice:`, fErr.message);
          }
        }

        const pResult: OCRPageResult = {
          pageNumber: pNum,
          text: pageText,
          confidence: pageConf,
          charCount: pageText.length
        };

        pageResults.push(pResult);
        perPageChars.push(pageText.length);
        if (pageText) textParts.push(pageText);
        totalConfidence += pageConf;
      }
    } finally {
      if (worker && typeof worker.terminate === 'function') {
        await worker.terminate().catch(() => {});
        console.log('[Tesseract OCR] Worker terminated cleanly.');
      }
    }

    const combinedText = textParts.join('\n\n').trim();
    const avgConfidence = pageImages.length > 0 ? Math.round(totalConfidence / pageImages.length) : 0;

    console.log(`[Tesseract OCR] OCR_COMPLETE: Combined ${combinedText.length} chars (Avg confidence: ${avgConfidence}%)`);

    return {
      text: combinedText,
      confidence: avgConfidence,
      providerName: this.name,
      pagesRecognized: pageImages.length,
      perPageChars,
      pageResults
    };
  }

  private prepareImageSource(image: any): any {
    if (!image) return null;

    // Reject raw PDF byte buffers
    if (Buffer.isBuffer(image) || image instanceof Uint8Array) {
      const buf = Buffer.isBuffer(image) ? image : Buffer.from(image);
      const isPdfHeader = buf.length >= 8 && buf.subarray(0, 10).toString('utf-8').includes('%PDF-');
      if (isPdfHeader) {
        console.warn('[Tesseract OCR] Rejecting raw PDF bytes passed to image OCR engine.');
        return null;
      }
      return buf;
    }

    // PNG DataURL string
    if (typeof image === 'string') {
      return image;
    }

    return image;
  }
}
