/**
 * parseResume.ts — Master Resume Pipeline Orchestrator with Groq AI
 *
 * Architecture:
 * 1. Document Text Extraction (PDF / DOCX with OCR fallback)
 * 2. Text Normalization
 * 3. Primary AI Extraction via Groq (using high-speed LLMs like openai/gpt-oss-120b)
 * 4. Automatic Section-Bounded Deterministic Fallback if offline
 * 5. Quality & Anti-Duplication Sanitization
 * 6. Clean Canonical Profile JSON output
 */

import { CampusProfile, createEmptyCanonicalProfile } from '../types/canonicalProfile';
import { extractPdfText } from './extract/extractPdf';
import { extractDocxText } from './extract/extractDocx';
import { performServerPdfOcr } from './extract/pdfOcr';
import { PageOcrDetail } from './types/extraction';
import { normalizeResumeText } from './normalize/normalizeResumeText';
import { segmentSections, DetectedSections } from './sections/sectionDetector';
import { parsePersonalSection } from './parsers/parsePersonal';
import { parseEducationSection } from './parsers/parseEducation';
import { parseExperienceSection } from './parsers/parseExperience';
import { parseProjectsSection } from './parsers/parseProjects';
import { parseStructuredSkills } from './parsers/parseSkills';
import { parseCertificationsSection } from './parsers/parseCertifications';
import { parseSocialsSection } from './parsers/parseSocials';
import { validateExtractionQuality, sanitizeAndValidateProfile, hasUsefulResumeData, ExtractionQuality } from './validate/validateExtraction';
import { evaluateProfileCompleteness, ProfileCompletenessResult } from './completeness/profileCompleteness';
import { extractResumeWithGroq } from './ai/groqExtractor';

export interface UnclassifiedItem {
  text: string;
  probableSection?: string;
  confidence?: number;
}

export interface ResumePipelineResult {
  profile: CampusProfile;
  rawText: string;
  cleanText: string;
  quality: ExtractionQuality;
  detectedSections: DetectedSections;
  confidenceScores: Record<string, number>;
  extractionMethod: 'DOCX' | 'PDF_TEXT' | 'PDF_OCR' | 'GROQ_AI' | 'FAILED' | string;
  sourceType: 'pdf' | 'docx';
  pageCount: number;
  perPageChars: number[];
  perPageOcrDetails: PageOcrDetail[];
  fileSize: number;
  bufferSize: number;
  uint8ArraySize: number;
  pdfSignatureValid: boolean;
  ocrRequired: boolean;
  ocrTriggered: boolean;
  ocrStatus: string;
  ocrConfidence: number;
  ocrProviderName?: string;
  ocrError?: string;
  detectedSectionsCount: number;
  hasUsefulData: boolean;
  completeness: ProfileCompletenessResult;
  code?: string;
  reason?: string;
  unclassifiedContent: UnclassifiedItem[];
}

export async function runResumePipeline(
  buffer: Buffer,
  fileName: string
): Promise<ResumePipelineResult> {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

  let rawText = '';
  let cleanText = '';
  let extractionMethod = ext === '.docx' ? 'DOCX' : 'PDF_TEXT';
  let sourceType: 'pdf' | 'docx' = ext === '.docx' ? 'docx' : 'pdf';
  let pageCount = 1;
  let perPageChars: number[] = [];
  let pdfSignatureValid = true;
  let ocrRequired = false;
  let ocrTriggered = false;
  let ocrStatus = 'NOT_REQUIRED';
  let ocrConfidence = 0;
  let ocrProviderName: string | undefined;
  let ocrError: string | undefined;

  // 1. PRIMARY DOCUMENT EXTRACTION
  if (ext === '.docx') {
    const docxRes = await extractDocxText(buffer, { fileName });
    rawText = docxRes.rawText;
    cleanText = docxRes.cleanText;
    pageCount = docxRes.pageCount || 1;
    perPageChars = docxRes.perPageChars || [cleanText.length];
  } else {
    const pdfRes = await extractPdfText(buffer, { fileName });
    rawText = pdfRes.rawText;
    cleanText = pdfRes.cleanText;
    pageCount = pdfRes.pageCount || 1;
    perPageChars = pdfRes.perPageChars || [cleanText.length];
    pdfSignatureValid = pdfRes.pdfSignatureValid ?? true;
    ocrRequired = cleanText.length < 50;

    // 2. OCR FALLBACK FOR SCANNED PDFs
    if (cleanText.length < 50) {
      console.log(`[Resume Pipeline] PDF text layer returns ${cleanText.length} chars (< 50). TRIGGERING SERVER-SIDE OCR FALLBACK...`);
      ocrRequired = true;
      ocrTriggered = true;
      ocrStatus = 'OCR_RUNNING';

      try {
        const ocrRes = await performServerPdfOcr(buffer, { fileName });
        if (ocrRes.text && ocrRes.text.trim().length >= 50) {
          rawText = ocrRes.text;
          cleanText = ocrRes.text.trim();
          extractionMethod = 'PDF_OCR';
          ocrStatus = 'SUCCESS';
          ocrConfidence = ocrRes.ocrConfidence;
          ocrProviderName = ocrRes.providerName;
          perPageChars = ocrRes.perPageChars;
          pageCount = ocrRes.pageCount;
        } else {
          ocrStatus = 'OCR_NO_USABLE_TEXT';
          ocrError = "We couldn't detect enough readable text in this scanned resume.";
        }
      } catch (ocrErr: any) {
        console.error('[Resume Pipeline] Server OCR Exception:', ocrErr.message);
        ocrStatus = 'OCR_FAILED';
        ocrError = ocrErr.message || String(ocrErr);
      }
    }
  }

  let profile = createEmptyCanonicalProfile();
  profile.resume = {
    fileName,
    extractedText: cleanText,
    parsedAt: Date.now()
  };

  const fileSize = buffer.length;

  if (cleanText.length < 50) {
    const code = ocrTriggered ? (ocrStatus === 'OCR_FAILED' ? 'OCR_FAILED' : 'OCR_NO_USABLE_TEXT') : 'PDF_TEXT_LAYER_EMPTY';
    const reason = ocrError || "We couldn't detect enough readable text in this resume.";

    return {
      profile,
      rawText,
      cleanText,
      quality: {
        usable: false,
        score: 0,
        metrics: { characters: cleanText.length, words: 0, lines: 0, singleCharacterRatio: 0, alphabeticRatio: 0, resumeSignalsCount: 0 },
        reasons: [reason],
        warning: reason
      },
      detectedSections: { HEADER_CONTACT: { name: 'HEADER_CONTACT', canonicalName: 'HEADER_CONTACT', startLine: 0, endLine: 0, lines: [], content: '' }, allSections: {}, sectionRanges: {}, detectedSectionNames: [] },
      confidenceScores: {},
      extractionMethod: 'FAILED',
      sourceType,
      pageCount,
      perPageChars,
      perPageOcrDetails: [],
      fileSize,
      bufferSize: fileSize,
      uint8ArraySize: fileSize,
      pdfSignatureValid,
      ocrRequired,
      ocrTriggered,
      ocrStatus,
      ocrConfidence,
      ocrProviderName,
      ocrError,
      detectedSectionsCount: 0,
      hasUsefulData: false,
      completeness: evaluateProfileCompleteness(profile),
      code,
      reason,
      unclassifiedContent: []
    };
  }

  // 3. TEXT NORMALIZATION
  const normalizedText = normalizeResumeText(cleanText);

  // 4. PRIMARY EXTRACTION: GROQ AI
  let groqSuccess = false;
  try {
    console.log('[Resume Pipeline] Attempting primary AI extraction via Groq...');
    const groqResult = await extractResumeWithGroq(normalizedText, fileName);
    if (groqResult.success && groqResult.profile) {
      profile = groqResult.profile;
      groqSuccess = true;
      extractionMethod = `GROQ_AI (${groqResult.modelUsed || 'default'})`;
      console.log(`[Resume Pipeline] Groq AI extraction succeeded in ${groqResult.latencyMs}ms`);
    } else {
      console.warn(`[Resume Pipeline] Groq AI extraction returned non-success: ${groqResult.error}. Falling back to rule-based parser.`);
    }
  } catch (groqErr: any) {
    console.error('[Resume Pipeline] Groq AI extraction error:', groqErr.message);
  }

  // 5. DETERMINISTIC SECTION BOUNDARY DETECTION & FALLBACK
  const detectedSections = segmentSections(normalizedText);
  const detectedSectionNames = detectedSections.detectedSectionNames;

  if (!groqSuccess) {
    console.log(`[Resume Pipeline] Using deterministic section-bounded extraction (${detectedSectionNames.length} sections)...`);

    // Personal & Contact
    const { personal, confidenceScores } = parsePersonalSection(detectedSections);
    profile.personal = { ...profile.personal, ...personal };

    // Education
    profile.education = parseEducationSection(detectedSections.EDUCATION?.content || '');

    // Experience
    profile.experience = parseExperienceSection(detectedSections.EXPERIENCE?.content || '');

    // Projects
    profile.projects = parseProjectsSection(detectedSections.PROJECTS?.content || '');

    // Skills
    const structuredSkills = parseStructuredSkills(detectedSections.SKILLS?.content || '');
    profile.skills = structuredSkills.entries;

    // Certifications
    profile.certifications = parseCertificationsSection(detectedSections.CERTIFICATIONS?.content || '');

    // Social Links
    const linksText = [detectedSections.HEADER_CONTACT?.content || '', detectedSections.LINKS?.content || ''].join('\n');
    const social = parseSocialsSection(linksText || normalizedText);
    profile.social = { ...profile.social, ...social };
  }

  // 6. SANITIZATION & ANTI-DUPLICATION PASS
  profile = sanitizeAndValidateProfile(profile, normalizedText);

  const hasUsefulData = hasUsefulResumeData(profile);
  const completeness = evaluateProfileCompleteness(profile);
  const quality = validateExtractionQuality(normalizedText);

  return {
    profile,
    rawText,
    cleanText: normalizedText,
    quality,
    detectedSections,
    confidenceScores: {},
    extractionMethod,
    sourceType,
    pageCount,
    perPageChars,
    perPageOcrDetails: [],
    fileSize,
    bufferSize: fileSize,
    uint8ArraySize: fileSize,
    pdfSignatureValid,
    ocrRequired,
    ocrTriggered,
    ocrStatus,
    ocrConfidence,
    ocrProviderName,
    detectedSectionsCount: detectedSectionNames.length,
    hasUsefulData,
    completeness,
    code: 'SUCCESS',
    unclassifiedContent: []
  };
}
