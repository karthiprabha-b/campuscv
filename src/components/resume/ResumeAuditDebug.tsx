"use client";

import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, CheckCircle, XCircle, Cpu, Eye, EyeOff, FileText, Bug } from 'lucide-react';
import { CampusProfile } from '@/types/canonicalProfile';
import { PageOcrDetail } from '@/resume/types/extraction';

export interface ResumeAuditDebugProps {
  fileName?: string;
  fileMime?: string;
  sourceType?: 'pdf' | 'docx' | string;
  pages?: number;
  perPageChars?: number[];
  perPageOcrDetails?: PageOcrDetail[];
  fileSize?: number;
  bufferSize?: number;
  uint8ArraySize?: number;
  pdfSignatureValid?: boolean;
  rawCharCount?: number;
  cleanCharCount?: number;
  rawText?: string;
  extractionMethod?: string;
  ocrRequired?: boolean;
  ocrTriggered?: boolean;
  ocrStatus?: 'NOT_REQUIRED' | 'STARTING' | 'RENDERING' | 'RECOGNIZING' | 'OCR_COMPLETE' | 'OCR_EMPTY' | 'OCR_FAILED' | string;
  ocrConfidence?: number;
  ocrProviderName?: string;
  ocrError?: string;
  ocrStack?: string;
  ocrSelfTestPassed?: boolean;
  ocrSelfTestChars?: number;
  ocrSelfTestError?: string;
  detectedSectionNames?: string[];
  unclassifiedContent?: string[];
  profile?: CampusProfile;
}

export default function ResumeAuditDebug({
  fileName = 'resume.pdf',
  fileMime = 'application/pdf',
  sourceType = 'pdf',
  pages = 1,
  perPageChars = [],
  perPageOcrDetails = [],
  fileSize = 0,
  bufferSize = 0,
  uint8ArraySize = 0,
  pdfSignatureValid = true,
  rawCharCount = 0,
  cleanCharCount = 0,
  rawText = '',
  extractionMethod = 'PDFJS',
  ocrRequired = false,
  ocrTriggered = false,
  ocrStatus = 'NOT_REQUIRED',
  ocrConfidence = 0,
  ocrProviderName = 'Tesseract.js',
  ocrError,
  ocrStack,
  ocrSelfTestPassed = true,
  ocrSelfTestChars = 0,
  ocrSelfTestError,
  detectedSectionNames = [],
  unclassifiedContent = [],
  profile
}: ResumeAuditDebugProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showImagePreview, setShowImagePreview] = useState<Record<number, boolean>>({});
  const [showRawText, setShowRawText] = useState(false);

  const educationCount = profile?.education?.length || 0;
  const experienceCount = profile?.experience?.length || 0;
  const projectsCount = profile?.projects?.length || 0;
  const skillsCount = profile?.skills?.length || 0;
  const certsCount = profile?.certifications?.length || 0;

  const hasRawText = rawCharCount > 0 || cleanCharCount > 0;
  const hasSections = detectedSectionNames.length > 0;
  const unmappedCount = unclassifiedContent.length;

  const toggleImagePreview = (pageIndex: number) => {
    setShowImagePreview(prev => ({ ...prev, [pageIndex]: !prev[pageIndex] }));
  };

  return (
    <div className="w-full border border-violet-500/30 bg-zinc-950/95 rounded-2xl p-4 text-xs font-mono shadow-xl my-4 text-zinc-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-violet-400 font-bold hover:text-violet-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span>⚙️ RESUME IMPORT AUDIT DEBUG</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-zinc-500">{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-4">

          {/* TESSERACT SELF-TEST DIAGNOSTIC */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Bug className="w-3.5 h-3.5 text-violet-400" />
              <span>Tesseract.js Engine Self-Test:</span>
            </div>
            <div>
              {ocrSelfTestPassed ? (
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-[10px] font-bold">
                  ✓ PASS (Engine Ready)
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded-lg text-[10px] font-bold">
                  ✗ FAIL ({ocrSelfTestError || 'Engine Error'})
                </span>
              )}
            </div>
          </div>

          {/* 1. FILE SECTION */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">1. ORIGINAL FILE OBJECT</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span>Name: <strong className="text-white truncate block">{fileName}</strong></span>
              </div>
              <div>
                <span>MIME: <strong className="text-zinc-300">{fileMime}</strong></span>
              </div>
              <div>
                <span>File Size: <strong className={fileSize > 0 ? 'text-emerald-400' : 'text-red-400'}>{fileSize.toLocaleString()} bytes</strong></span>
              </div>
            </div>
          </div>

          {/* 2. BUFFER SECTION */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">2. BYTE PIPELINE BUFFER</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span>ArrayBuffer: <strong className={bufferSize > 0 ? 'text-violet-300' : 'text-red-400'}>{bufferSize.toLocaleString()} B</strong></span>
              </div>
              <div>
                <span>Uint8Array: <strong className={uint8ArraySize > 0 ? 'text-violet-300' : 'text-red-400'}>{uint8ArraySize.toLocaleString()} B</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                {pdfSignatureValid ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300">Signature: %PDF-</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="text-red-300">Invalid PDF Signature</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. PDF SERVER EXTRACTION */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">3. PDF SERVER EXTRACTION</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span>PDF.js Version: <strong className="text-violet-400">5.4.296</strong></span>
              </div>
              <div>
                <span>Worker State: <strong className="text-emerald-400 font-bold">DISABLED / NOT REQUIRED (SERVER)</strong></span>
              </div>
              <div>
                <span>Pages Detected: <strong className="text-white">{pages}</strong></span>
              </div>
              <div>
                <span>Extraction Status: <strong className={cleanCharCount >= 50 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{cleanCharCount >= 50 ? 'SUCCESS' : 'INSUFFICIENT'}</strong></span>
              </div>
              <div>
                <span>Raw Characters: <strong className={rawCharCount > 0 ? 'text-emerald-400' : 'text-red-400'}>{rawCharCount}</strong></span>
              </div>
              <div>
                <span>Clean Characters: <strong className={cleanCharCount >= 50 ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>{cleanCharCount}</strong></span>
              </div>
            </div>

            {/* Per Page Breakdown */}
            {perPageChars.length > 0 && (
              <div className="pt-2 border-t border-white/5 text-[11px]">
                <span className="text-zinc-500 block text-[10px]">CHARACTERS PER PAGE (PDF.JS)</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {perPageChars.map((chars, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-zinc-950 border border-white/10 rounded-lg text-zinc-300 text-[10px]">
                      Page {idx + 1}: <strong className={chars > 0 ? 'text-emerald-400' : 'text-red-400'}>{chars} chars</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. SCANNED IMAGE OCR FALLBACK & PER-PAGE DETAILED DIAGNOSTICS */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">4. PAGE IMAGE OCR FALLBACK</div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ocrStatus === 'OCR_COMPLETE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                ocrStatus === 'OCR_EMPTY' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                ocrStatus === 'OCR_FAILED' ? 'bg-red-950 text-red-300 border border-red-800' :
                ocrStatus === 'STARTING' || ocrStatus === 'RENDERING' || ocrStatus === 'RECOGNIZING' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                STATUS: {ocrStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span>Required: <strong className={ocrRequired ? 'text-amber-400' : 'text-zinc-400'}>{ocrRequired ? 'YES' : 'NO'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Triggered: <strong className={ocrTriggered ? 'text-amber-400 font-bold' : 'text-zinc-400'}>{ocrTriggered ? 'YES' : 'NO'}</strong></span>
              </div>
              <div>
                <span>Confidence: <strong className={ocrConfidence > 0 ? 'text-emerald-300 font-bold' : 'text-zinc-500'}>{ocrConfidence > 0 ? `${ocrConfidence}%` : 'N/A'}</strong></span>
              </div>
            </div>

            {/* REAL OCR ERROR DISPLAY */}
            {ocrError && (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl space-y-1 text-red-200 text-[11px]">
                <div className="font-bold flex items-center gap-1.5 text-red-400">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>OCR RUNTIME NOTICE / EXCEPTION:</span>
                </div>
                <div className="font-mono text-[11px] text-red-100 bg-black/40 p-2 rounded border border-red-900/50 break-words">
                  {ocrError}
                </div>
                {ocrStack && (
                  <pre className="text-[9px] text-red-300/80 max-h-32 overflow-y-auto bg-black/60 p-2 rounded font-mono">
                    {ocrStack}
                  </pre>
                )}
              </div>
            )}

            {/* PER-PAGE OCR DETAILS BREAKDOWN */}
            {perPageOcrDetails.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <span className="text-[10px] text-violet-400 font-bold block uppercase tracking-wider">PER-PAGE CANVAS RENDERING & OCR DIAGNOSTICS</span>
                {perPageOcrDetails.map((detail, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-white/10 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white">Page {detail.pageNumber}</span>
                      <div className="flex items-center gap-2">
                        {detail.imageDataUrl && (
                          <button
                            type="button"
                            onClick={() => toggleImagePreview(idx)}
                            className="px-2.5 py-1 bg-violet-950 hover:bg-violet-900 border border-violet-700/50 text-violet-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            {showImagePreview[idx] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showImagePreview[idx] ? 'Hide OCR Input' : '👁️ View OCR Input Image'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      <div>
                        <span className="text-zinc-500 block">PDF.js Chars</span>
                        <strong className="text-zinc-300">{detail.pdfJsChars}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Viewport & Scale</span>
                        <strong className="text-violet-300">{detail.canvasWidth} × {detail.canvasHeight} ({detail.renderScale}x)</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Non-white Pixels</span>
                        <strong className="text-zinc-300">{detail.nonWhitePixels.toLocaleString()} ({detail.nonWhitePercentage}%)</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Blank Canvas Check</span>
                        <strong className={!detail.isBlank ? 'text-emerald-400 font-bold' : 'text-red-400'}>{detail.isBlank ? 'YES (BLANK)' : 'NO (VALID)'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">PNG Generated</span>
                        <strong className={detail.pngGenerated ? 'text-emerald-400' : 'text-red-400'}>{detail.pngGenerated ? 'YES' : 'NO'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">PNG Length</span>
                        <strong className="text-zinc-300">{(detail.pngLength / 1024).toFixed(1)} KB</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">OCR Completed</span>
                        <strong className={detail.ocrCompleted ? 'text-emerald-400' : 'text-amber-400'}>{detail.ocrCompleted ? 'YES' : 'NO'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">OCR Chars Extracted</span>
                        <strong className={detail.ocrChars > 0 ? 'text-emerald-400 font-bold' : 'text-red-400'}>{detail.ocrChars} chars</strong>
                      </div>
                    </div>

                    {/* INTERACTIVE OCR INPUT IMAGE PREVIEW MODAL */}
                    {showImagePreview[idx] && detail.imageDataUrl && (
                      <div className="mt-2 p-2 bg-zinc-900 rounded-xl border border-violet-500/40 space-y-1">
                        <span className="text-[10px] text-violet-300 block font-bold">Rendered PDF Page {detail.pageNumber} Canvas Image (Sent to Tesseract OCR):</span>
                        <div className="max-h-64 overflow-y-auto rounded-lg border border-black p-1 bg-black flex justify-center">
                          {/* eslint-disable-next-html-extension */}
                          <img
                            src={detail.imageDataUrl}
                            alt={`Rendered Page ${detail.pageNumber}`}
                            className="max-w-full h-auto object-contain rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. FINAL EXTRACTION SUMMARY */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">5. FINAL EXTRACTION METHOD</div>
              {cleanCharCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="px-2.5 py-1 bg-violet-950 hover:bg-violet-900 border border-violet-700/50 text-violet-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>{showRawText ? 'Hide Extracted Text' : '📝 View Extracted Text'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div>
                <span>Method: <strong className="text-violet-300 font-bold uppercase">{extractionMethod}</strong></span>
              </div>
              <div>
                <span>Final Characters: <strong className={cleanCharCount >= 40 ? 'text-emerald-400 font-bold' : 'text-red-400'}>{cleanCharCount}</strong></span>
              </div>
            </div>

            {/* RAW OCR EXTRACTED TEXT MODAL */}
            {showRawText && (
              <div className="mt-2 p-2 bg-zinc-900 rounded-xl border border-violet-500/40 space-y-1">
                <span className="text-[10px] text-violet-300 block font-bold">Full Raw OCR Output Text ({cleanCharCount} characters):</span>
                <textarea
                  readOnly
                  value={rawText || profile?.resume?.extractedText || ''}
                  className="w-full h-48 bg-black p-2.5 text-[11px] text-zinc-300 font-mono rounded-lg border border-zinc-800 focus:outline-none resize-none"
                />
              </div>
            )}
          </div>

          {/* 6. PARSER SECTIONS DETECTED */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">6. RESUME SECTION PARSER</div>
            <div className="flex flex-wrap gap-1.5">
              {['PERSONAL', 'EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'CERTIFICATIONS', 'SOCIAL'].map(sec => {
                const detected = detectedSectionNames.includes(sec);
                return (
                  <span
                    key={sec}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                      detected
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                    }`}
                  >
                    {detected ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : '○'}
                    <span>{sec}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 7. PROFILE NORMALIZATION COUNTS */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">7. CampusCV PROFILE ENTRY COUNTS</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-zinc-950 p-2 rounded-xl border border-white/5">
                <span className="text-zinc-400 block text-[10px]">Education</span>
                <span className="text-sm font-bold text-white">{educationCount}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-white/5">
                <span className="text-zinc-400 block text-[10px]">Experience</span>
                <span className="text-sm font-bold text-white">{experienceCount}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-white/5">
                <span className="text-zinc-400 block text-[10px]">Projects</span>
                <span className="text-sm font-bold text-white">{projectsCount}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-white/5">
                <span className="text-zinc-400 block text-[10px]">Skills</span>
                <span className="text-sm font-bold text-white">{skillsCount}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded-xl border border-white/5">
                <span className="text-zinc-400 block text-[10px]">Certifications</span>
                <span className="text-sm font-bold text-white">{certsCount}</span>
              </div>
            </div>
          </div>

          {/* 8. EXTRACTED DATA PREVIEW & PROJECT BOUNDARIES */}
          {profile && (
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-emerald-500/20 space-y-3 text-[11px]">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">8. SEMANTIC PARSER AUDIT & PROJECT BOUNDARIES</div>
              {profile.personal && (profile.personal.fullName || profile.personal.email) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-white/5">
                  <div><span>Name: <strong className="text-white">{profile.personal.fullName || 'N/A'}</strong></span></div>
                  <div><span>Email: <strong className="text-white">{profile.personal.email || 'N/A'}</strong></span></div>
                  <div><span>Phone: <strong className="text-white">{profile.personal.phone || 'N/A'}</strong></span></div>
                  <div><span>Location: <strong className="text-white">{profile.personal.city || 'N/A'}</strong></span></div>
                </div>
              )}

              {profile.projects && profile.projects.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-violet-300 font-bold block uppercase tracking-wider">PARSED PROJECT BOUNDARIES ({profile.projects.length} PROJECTS)</span>
                  <div className="space-y-1.5">
                    {profile.projects.map((proj: any, idx: number) => (
                      <div key={idx} className="p-2 bg-zinc-950 rounded-lg border border-white/5 flex items-center justify-between text-[10px]">
                        <div>
                          <strong className="text-white block font-mono">0{idx + 1} {proj.name}</strong>
                          <span className="text-zinc-400">bullets: {proj.achievements?.length || 0} | technologies: {proj.technologies?.length || 0}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${proj.githubUrl ? 'bg-violet-950 text-violet-300 border border-violet-800' : 'bg-zinc-900 text-zinc-500'}`}>
                            github: {proj.githubUrl ? 'YES' : 'NO'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
