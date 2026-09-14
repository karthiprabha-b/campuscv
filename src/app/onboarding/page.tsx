"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  ArrowLeft,
  Upload, 
  Plus, 
  Trash2, 
  Check,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code2,
  Share2,
  UserCheck,
  Palette,
  Globe,
  Github,
  Linkedin,
  X,
  Sparkles,
  Lock,
  Loader2
} from 'lucide-react';

import CampusCvLogo from '../../components/common/CampusCvLogo';
import LoadingScreen from '../../components/onboarding/LoadingScreen';
import ResumeExtractionLoadingScreen from '../../components/onboarding/ResumeExtractionLoadingScreen';
import ResumeAuditDebug from '../../components/resume/ResumeAuditDebug';

import { CampusProfile, createEmptyCanonicalProfile } from '../../types/canonicalProfile';
import { saveCanonicalProfile, savePortfolio, getPortfolios } from '../../lib/portfolioStore';
import { mockAuth, getUserPlanTier, checkTemplateAccess, getPlanTemplateLimit } from '../../utils/mockDb';
import { supabase } from '../../lib/supabase/client';
import { adminTemplateDb } from '../../utils/adminTemplateDb';

const MANUAL_STEP_LABELS = ['Field', 'Résumé', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Links', 'Portfolio'];

const RESUME_STEP_LABELS = ['Upload', 'Choose Portfolio'];

const STEP_EYEBROWS: Record<number, string> = {
  1: "LET'S START",
  2: "IMPORT DETAILS",
  3: "PERSONAL INFO",
  4: "ACADEMICS",
  5: "WORK HISTORY",
  6: "FEATURED WORK",
  7: "CORE STRENGTHS",
  8: "CONNECTIVITY",
  9: "CHOOSE YOUR PORTFOLIO",
};

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [onboardingMode, setOnboardingMode] = useState<'initial' | 'resume' | 'manual'>('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [showExtractionChecklist, setShowExtractionChecklist] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  const [profile, setProfile] = useState<CampusProfile>(() => createEmptyCanonicalProfile());
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const generateWithAI = async (
    type: 'bio' | 'experience_bullet' | 'project_description',
    context: Record<string, string>,
    key: string,
    onSuccess: (text: string) => void
  ) => {
    setAiLoading(l => ({ ...l, [key]: true }));
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context })
      });
      const data = await res.json();
      if (data.success && data.text) {
        onSuccess(data.text);
      } else if (data.error) {
        console.error('AI Generation error:', data.error);
      }
    } catch (err) {
      console.error('Failed to generate with AI:', err);
    } finally {
      setAiLoading(l => ({ ...l, [key]: false }));
    }
  };

  useEffect(() => {
    // 1. Sync and load canonical active templates
    adminTemplateDb.syncWithServerRegistryAsync(false).then(activeList => {
      const list = activeList.filter(t => (t.status || 'active') === 'active');
      setAvailableTemplates(list);
      if (list.length > 0) {
        const localUser = mockAuth.getCurrentUser();
        const accessible = list.filter(t => checkTemplateAccess(localUser, t, 0).isAccessible);
        const defaultChoice = accessible.length > 0 ? accessible[0].id : list[0].id;
        setSelectedTemplateId(prev => {
          const exists = list.some(t => t.id === prev);
          return exists ? prev : defaultChoice;
        });
      }
    });

    const checkAuth = async () => {
      let activeUid = '';
      let activeEmail = '';
      let activeName = '';

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          activeUid = user.id;
          activeEmail = user.email || '';
          activeName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        }
      } catch {}

      if (!activeUid) {
        const local = mockAuth.getCurrentUser();
        if (local) {
          activeUid = (local as any)?.id || local.email || '';
          activeEmail = local.email || '';
          activeName = local.name || '';
        }
      }

      if (!activeUid && !activeEmail) {
        router.replace('/auth/signup');
        return;
      }

      // Check active subscription requirement
      const localUser = mockAuth.getCurrentUser();
      setCurrentUser(localUser);
      const isUnpaidOrExpired = !localUser || !localUser.isPro || localUser.planType === 'expired' || (localUser.subscriptionExpires && new Date(localUser.subscriptionExpires).getTime() < Date.now());
      if (isUnpaidOrExpired) {
        alert("Subscription Required: Please choose and purchase a plan to create your portfolio.");
        router.replace('/dashboard');
        return;
      }

      // If user already owns a portfolio, route directly to dashboard
      try {
        const existing = await getPortfolios(activeUid);
        if (existing && existing.length > 0) {
          router.replace('/dashboard');
          return;
        }
      } catch {}

      setProfile(p => ({
        ...p,
        personal: {
          ...p.personal,
          fullName: p.personal?.fullName || activeName || '',
          email: p.personal?.email || activeEmail || '',
        }
      }));
    };
    checkAuth();
  }, [router]);

  const [detectedSectionsCount, setDetectedSectionsCount] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    fileName?: string; fileMime?: string; sourceType?: string; pages?: number;
    perPageChars?: number[]; perPageOcrDetails?: any[]; fileSize?: number;
    bufferSize?: number; uint8ArraySize?: number; pdfSignatureValid?: boolean;
    ocrRequired?: boolean; ocrTriggered?: boolean; ocrStatus?: string;
    ocrConfidence?: number; ocrProviderName?: string; ocrError?: string;
    ocrStack?: string; ocrSelfTestPassed?: boolean; ocrSelfTestChars?: number;
    ocrSelfTestError?: string; rawTextLength: number; cleanTextLength: number;
    extractionMethod?: string; detectedSectionNames?: string[];
    unclassifiedContent?: string[]; parserStatus: string; name?: string;
    email?: string; educationCount: number; experienceCount: number;
    projectsCount: number; skillsCount: number; profileSaved: boolean;
  } | null>(null);

  // ── Resume Upload Handler (FLOW A) ──
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setIsParsingResume(true);
    setResumeError(null);
    setDetectedSectionsCount(null);
    setShowExtractionChecklist(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/resume/parse', { method: 'POST', body: formData });
      const resText = await res.text();
      let data: any = {};
      try { data = JSON.parse(resText); } catch (e) {
        throw new Error('Resume parser service unavailable. You can continue manually below.');
      }
      const diag = data.diagnostics || {};
      const cleanChars = diag.cleanCharacters || data.textLength || 0;
      const rawChars = diag.rawCharacters || data.rawTextLength || 0;

      if (!res.ok || !data.success || data.code === 'SCANNED_PDF_REQUIRES_OCR' || !data.profile || cleanChars < 50) {
        const errorMsg = data.error || data.reason || (data.code === 'SCANNED_PDF_REQUIRES_OCR'
          ? "This PDF is a scanned document or image. OCR is required for scanned resumes."
          : "We could read the file, but couldn't extract usable text from this PDF.");
        setResumeError(errorMsg);
        setShowExtractionChecklist(false);
        setIsParsingResume(false);
        setDebugInfo({
          fileName: file.name, fileMime: file.type || 'application/pdf',
          sourceType: file.name.endsWith('.docx') ? 'docx' : 'pdf', pages: diag.pageCount || 1,
          perPageChars: [cleanChars], perPageOcrDetails: [], fileSize: file.size,
          bufferSize: diag.bufferSize || file.size, uint8ArraySize: file.size, pdfSignatureValid: true,
          ocrRequired: data.code === 'SCANNED_PDF_REQUIRES_OCR', ocrTriggered: false,
          ocrStatus: data.code === 'SCANNED_PDF_REQUIRES_OCR' ? 'SCANNED_PDF_REQUIRES_OCR' : 'FAILED',
          ocrConfidence: 0, ocrProviderName: 'Tesseract.js', ocrError: errorMsg,
          rawTextLength: rawChars, cleanTextLength: cleanChars,
          extractionMethod: diag.extractionMethod || 'FAILED', detectedSectionNames: diag.detectedSectionNames || [],
          unclassifiedContent: data.unclassifiedContent || [], parserStatus: `FAILURE (${data.code || 'NO_TEXT_EXTRACTED'})`,
          name: '', email: '', educationCount: 0, experienceCount: 0, projectsCount: 0, skillsCount: 0, profileSaved: false
        });
        return;
      }

      if (typeof data.detectedSectionsCount === 'number') setDetectedSectionsCount(data.detectedSectionsCount);

      const ext: any = data.profile || {};
      const extPers = ext.personal || {};
      const fullName = extPers.fullName || extPers.name || ext.fullName || ext.name || '';
      const headline = extPers.headline || extPers.professionalTitle || extPers.title || ext.headline || ext.title || '';
      const email = extPers.email || ext.email || '';
      const phone = extPers.phone || ext.phone || '';
      const city = extPers.city || ext.location || ext.city || '';
      const summary = extPers.summary || extPers.about || extPers.profile || ext.summary || ext.about || '';

      const updatedProfile: CampusProfile = {
        ...profile,
        personal: {
          ...profile.personal,
          fullName: fullName || profile.personal.fullName,
          headline: headline || profile.personal.headline,
          email: email || profile.personal.email,
          phone: phone || profile.personal.phone,
          city: city || profile.personal.city,
          state: extPers.state || profile.personal.state,
          country: extPers.country || profile.personal.country,
          profilePhoto: profile.personal.profilePhoto,
          summary: summary || profile.personal.summary
        },
        education: ext.education?.length ? ext.education : profile.education,
        experience: ext.experience?.length ? ext.experience : profile.experience,
        projects: ext.projects?.length ? ext.projects : profile.projects,
        skills: ext.skills?.length ? ext.skills : profile.skills,
        certifications: ext.certifications?.length ? ext.certifications : profile.certifications,
        social: { ...profile.social, ...(ext.social || {}) },
        resume: { fileName: file.name, extractedText: data.rawTextLength ? `${data.rawTextLength} chars extracted` : '', parsedAt: Date.now() }
      };

      setProfile(updatedProfile);
      await saveCanonicalProfile(updatedProfile).catch(() => {});

      setDebugInfo({
        fileName: file.name, fileMime: file.type || 'application/pdf',
        sourceType: data.sourceType || (file.name.endsWith('.docx') ? 'docx' : 'pdf'),
        pages: data.pageCount || data.pages || 1, perPageChars: data.perPageChars || [data.textLength || 0],
        perPageOcrDetails: data.perPageOcrDetails || [], fileSize: file.size,
        bufferSize: data.bufferSize || file.size, uint8ArraySize: data.uint8ArraySize || file.size,
        pdfSignatureValid: data.pdfSignatureValid ?? true, ocrRequired: data.ocrRequired ?? false,
        ocrTriggered: data.ocrTriggered ?? false, ocrStatus: data.ocrStatus || 'COMPLETE',
        ocrConfidence: data.ocrConfidence ?? 0, ocrProviderName: data.ocrProviderName,
        ocrError: data.ocrError, ocrStack: data.ocrStack, ocrSelfTestPassed: data.ocrSelfTestPassed,
        ocrSelfTestChars: data.ocrSelfTestChars, ocrSelfTestError: data.ocrSelfTestError,
        rawTextLength: data.rawTextLength || 0, cleanTextLength: data.textLength || 0,
        extractionMethod: data.extractionMethod || 'default', detectedSectionNames: data.detectedSectionNames || [],
        unclassifiedContent: data.unclassifiedContent || [], parserStatus: 'SUCCESS',
        name: updatedProfile.personal.fullName, email: updatedProfile.personal.email,
        educationCount: updatedProfile.education.length, experienceCount: updatedProfile.experience.length,
        projectsCount: updatedProfile.projects.length, skillsCount: updatedProfile.skills.length, profileSaved: true
      });
    } catch (err: any) {
      console.error('[ONBOARDING] Resume parse error:', err);
      setResumeError(err.message || 'Error extracting resume. You can continue manually.');
      setShowExtractionChecklist(false);
      setIsParsingResume(false);
    }
  };

  // Called when ResumeExtractionLoadingScreen finishes all checklist items
  const handleExtractionComplete = () => {
    setShowExtractionChecklist(false);
    setIsParsingResume(false);
    setOnboardingMode('resume');
    // DIRECTLY GO TO FINAL STEP: "Choose your portfolio" (Step 9)
    setDirection(1);
    setStep(9);
  };

  // ── Manual Flow Handler (FLOW B) ──
  const startManualOnboarding = () => {
    setOnboardingMode('manual');
    setDirection(1);
    setStep(3); // Go to Step 3: Personal Details / About
  };

  // ── Navigation ──
  const nextStep = () => {
    saveCanonicalProfile(profile).catch(() => {});
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      startManualOnboarding();
    } else if (step < 9) {
      setStep(s => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (step === 9 && onboardingMode === 'resume') {
      // In resume mode, going back returns to the Resume Upload screen
      setStep(2);
    } else if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const goNext = () => { setDirection(1); nextStep(); };
  const goPrev = () => { setDirection(-1); prevStep(); };

  // ── Final Submission & Launch Portfolio ──
  const finishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const existing = await getPortfolios();
      if (existing && existing.length >= 1) {
        router.push(`/editor/${existing[0].id}`);
        return;
      }

      let currentUserId = '';
      let currentUserEmail = '';
      try {
        const { data: { user: suUser } } = await supabase.auth.getUser();
        if (suUser) {
          currentUserId = suUser.id;
          currentUserEmail = suUser.email || '';
        }
      } catch {}
      if (!currentUserId) {
        const localUser = mockAuth.getCurrentUser();
        if (localUser) {
          currentUserId = (localUser as any)?.id || localUser.email || '';
          currentUserEmail = localUser.email || '';
        }
      }

      const now = Date.now();
      const portfolioId = `port-${now}`;
      const username = profile.personal.fullName
        ? profile.personal.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 900 + 100)
        : `user-${now}`;
      await saveCanonicalProfile({ ...profile, id: portfolioId, userId: username });
      const portfolioData = {
        id: portfolioId,
        userId: currentUserId,
        user_id: currentUserId,
        userEmail: currentUserEmail,
        username,
        templateId: selectedTemplateId,
        layoutStyle: selectedTemplateId,
        templateType: 'uploaded',
        canonicalProfile: profile,
        name: profile.personal?.fullName || '',
        tagline: profile.personal?.headline || '',
        aboutMe: profile.personal?.summary || '',
        profileImage: profile.personal?.profilePhoto || '',
        experience: Array.isArray(profile.experience) ? profile.experience : [],
        education: Array.isArray(profile.education) ? profile.education : [],
        projects: Array.isArray(profile.projects) ? profile.projects : [],
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
        socialLinks: profile.social || {},
        meta: { portfolioTitle: profile.personal?.fullName ? `${profile.personal.fullName} - Portfolio` : 'CampusCV Portfolio' },
        createdAt: now,
        updatedAt: now
      };
      await savePortfolio(portfolioData);
      router.push(`/editor/${portfolioId}`);
    } catch (err) {
      console.error('Error launching portfolio:', err);
      setIsSubmitting(false);
    }
  };

  if (showExtractionChecklist) {
    return <ResumeExtractionLoadingScreen onComplete={handleExtractionComplete} fileName={resumeFileName} />;
  }

  if (isSubmitting) return <LoadingScreen onComplete={() => {}} />;

  const isResumeMode = onboardingMode === 'resume' && step === 9;
  const progressPercent = isResumeMode ? 100 : Math.round(((step - 1) / 8) * 100);

  // ── Slide animation variants ──
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 20 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -20 }),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-700 flex flex-col antialiased">
      
      {/* ═══════════════════════════════════════
          HEADER: CLEAN PREMIUM LIGHT BAR
      ═══════════════════════════════════════ */}
      <header className="h-16 sm:h-[72px] bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] sticky top-0 z-50 flex items-center px-4 sm:px-8 transition-all relative">
        <div className="w-full max-w-[1240px] mx-auto flex items-center justify-between gap-3 sm:gap-4">

          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <CampusCvLogo className="h-7 sm:h-9 w-auto" />
          </div>

          {/* Center: Progress Indicator (Hidden on small mobile to prevent overflow, visible on md+) */}
          <div className="hidden md:flex flex-1 flex-col items-center gap-1.5 max-w-[560px]">
            {isResumeMode ? (
              // Streamlined 2-Step Progress for Resume Flow
              <>
                <div className="flex items-center w-full max-w-[280px]" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={2}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-purple-600 flex items-center justify-center text-[8px] text-white">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </div>
                  </div>
                  <div className="flex-1 h-[2px] mx-1.5 bg-purple-600 transition-all duration-500" />
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-600 ring-4 ring-purple-100 shadow-sm shadow-purple-500/30 scale-110" />
                  </div>
                </div>
                <div className="flex w-full max-w-[280px] justify-between px-0">
                  <span className="text-[10px] font-semibold text-slate-700">1. Resume Extracted</span>
                  <span className="text-[10px] font-bold text-purple-600">2. Choose Portfolio</span>
                </div>
              </>
            ) : (
              // 9-Step Progress for Manual Flow
              <>
                <div className="flex items-center w-full" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={9}>
                  {MANUAL_STEP_LABELS.map((label, i) => {
                    const s = i + 1;
                    const done = step > s;
                    const current = step === s;
                    return (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              done
                                ? 'bg-purple-600'
                                : current
                                ? 'bg-purple-600 ring-4 ring-purple-100 shadow-sm shadow-purple-500/30 scale-110'
                                : 'bg-slate-200'
                            }`}
                          />
                        </div>
                        {i < 8 && (
                          <div
                            className="flex-1 h-[2px] mx-1 transition-all duration-500"
                            style={{ background: done ? '#7C3AED' : '#E5E7EB' }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="flex w-full justify-between px-0">
                  {MANUAL_STEP_LABELS.map((label, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-semibold tracking-wide transition-colors ${
                        step === i + 1
                          ? 'text-purple-600 font-bold'
                          : step > i + 1
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Step Counter / Mobile Pill */}
          <div className="shrink-0 flex items-center gap-2">
            <div className="md:hidden flex items-center gap-1.5 bg-purple-50 border border-purple-100/80 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-xs font-bold text-purple-700 font-bricolage">
                {isResumeMode ? 'Final Step' : `Step ${step}/9`}
              </span>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-800 font-bricolage">
                {isResumeMode ? 'Final Step' : `Step ${step} of 9`}
              </span>
              <span className="text-[11px] font-medium text-slate-500">{progressPercent}% complete</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar along Header Bottom for seamless mobile/desktop feedback */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>
      </header>

      {/* ═══════════════════════════════════════
          MAIN CONTENT: SPACIOUS 2-COLUMN LAYOUT
      ═══════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-[60px] items-start">

          {/* ─── LEFT COLUMN: Editorial Visual + Mini Portfolio Preview (Desktop only to prevent mobile scroll bloat) ─── */}
          <aside className="hidden lg:flex lg:col-span-5 flex-col gap-6 lg:sticky lg:top-[96px]">
            
            {/* Editorial Heading & Subtext */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.15] font-bricolage">
                Build a portfolio<br />that feels like you.
              </h1>
              <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed max-w-md">
                {isResumeMode 
                  ? "We've extracted your experience, education, projects, and skills. Choose your layout theme to launch your portfolio."
                  : "Your portfolio starts with a few simple details. We'll help you shape everything into a professional online presence."}
              </p>
            </div>

            {/* Premium Live Portfolio Miniature Preview Card */}
            <div className="relative rounded-[24px] bg-white border border-[#E7E7EC] shadow-xl shadow-purple-900/[0.04] p-5 sm:p-6 overflow-hidden">
              
              {/* Subtle background ambient glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl -z-10 pointer-events-none" />

              {/* Header Floating Labels */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Your portfolio
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-purple-500" />
                  Live &amp; shareable
                </span>
              </div>

              {/* Mini Portfolio Preview Sandbox */}
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-purple-600/20 shrink-0">
                    {profile.personal.fullName?.trim()?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-extrabold text-slate-900 truncate font-bricolage tracking-tight">
                      {profile.personal.fullName?.trim() || 'Your Name'}
                    </h4>
                    <p className="text-xs truncate">
                      {profile.personal.headline?.trim() ? (
                        <span className="font-semibold text-purple-600">{profile.personal.headline}</span>
                      ) : profile.career?.specialization ? (
                        <span className="font-semibold text-purple-600">{profile.career.specialization}</span>
                      ) : (
                        <span className="font-medium text-slate-400 italic">Select your field below</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Short Bio Summary */}
                <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                  {profile.personal.summary?.trim() || 'Add a short bio to introduce your journey, strengths, and top work.'}
                </p>

                {/* Section Navigation Tabs Skeleton */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-purple-700 px-2 py-1 rounded-md bg-purple-50 border border-purple-100">About</span>
                  <span className="text-[10px] font-semibold text-slate-400 px-2 py-1">Work</span>
                  <span className="text-[10px] font-semibold text-slate-400 px-2 py-1">Skills</span>
                </div>

                {/* Live Data Preview Pills */}
                {profile.education.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Education</span>
                    <p className="text-xs text-slate-700 font-medium truncate">{profile.education[0]?.institution || '—'}</p>
                  </div>
                )}

                {profile.experience.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Experience</span>
                    <p className="text-xs text-slate-700 font-medium truncate">
                      {profile.experience[0]?.role} • {profile.experience[0]?.company}
                    </p>
                  </div>
                )}

                {profile.projects.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Featured Projects</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.projects.slice(0, 3).map((p, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md">
                          {p.name || 'Project'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Top Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.slice(0, 5).map((s, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Subtle Micro-Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-500" /> CampusCV Preview</span>
                <span>Ready to share</span>
              </div>
            </div>
          </aside>

          {/* ─── RIGHT COLUMN: Onboarding Step Card ─── */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white border border-[#E8E8ED] rounded-[20px] sm:rounded-[24px] shadow-xl shadow-slate-200/50 p-4 sm:p-8 lg:p-10 flex flex-col justify-between min-h-0 sm:min-h-[520px]">
              
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex flex-col gap-6"
                >

                  {/* ══════════════════════════════
                      STEP 1: CAREER CATEGORIES (2x2 Grid)
                  ══════════════════════════════ */}
                  {step === 1 && (
                    <div className="space-y-5 sm:space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[1]}
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage leading-tight">
                          What are you building<br className="hidden sm:inline" /> your portfolio for?
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6B7280]">
                          Choose the field closest to your work. You can change this later.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {[
                          { id: 'Software & Data Science', icon: Code2, title: 'Software & Data', desc: 'Development, data engineering & more' },
                          { id: 'Product & UI/UX Design', icon: Palette, title: 'Design & Creative', desc: 'Product design, UX research & visual art' },
                          { id: 'Business & Management', icon: Briefcase, title: 'Business & Management', desc: 'Product, consulting & marketing' },
                          { id: 'General / Other', icon: UserCheck, title: 'General / Other', desc: 'Students, researchers & multidisciplinary' },
                        ].map((c) => {
                          const selected = profile.career?.specialization === c.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                const defaultHeadline = 
                                  c.id === 'Software & Data Science' ? 'Software & Data Engineer' :
                                  c.id === 'Product & UI/UX Design' ? 'UI/UX & Product Designer' :
                                  c.id === 'Business & Management' ? 'Business & Product Strategist' :
                                  'Student & Professional';
                                setProfile(p => ({
                                  ...p,
                                  career: { ...p.career, specialization: c.id },
                                  personal: {
                                    ...p.personal,
                                    headline: p.personal.headline?.trim() ? p.personal.headline : defaultHeadline
                                  }
                                }));
                                setTimeout(() => { setDirection(1); nextStep(); }, 150);
                              }}
                              className={`p-4 sm:p-5 lg:p-6 rounded-[18px] sm:rounded-[20px] text-left border transition-all duration-200 hover:-translate-y-[2px] relative flex flex-col justify-between min-h-[136px] sm:min-h-[150px] gap-3.5 sm:gap-4 group cursor-pointer ${
                                selected
                                  ? 'border-2 border-[#7C3AED] bg-[#FAF7FF] shadow-md shadow-purple-900/5 ring-1 ring-[#7C3AED]/20'
                                  : 'border-[#E5E7EB] bg-white hover:border-purple-300 hover:bg-[#FAF7FF] shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className={`p-2.5 sm:p-3 rounded-xl transition-colors ${selected ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'}`}>
                                  <c.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                  {selected ? (
                                    <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-xs">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  ) : (
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
                                  )}
                                </div>
                              </div>

                              <div className="w-full">
                                <div className={`font-bold text-[15px] sm:text-[17px] font-bricolage leading-snug mb-1 ${selected ? 'text-purple-900' : 'text-[#111111]'}`}>
                                  {c.title}
                                </div>
                                <div className="text-xs sm:text-[13.5px] text-[#6B7280] leading-relaxed">
                                  {c.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 2: RESUME IMPORT / CHOICE
                  ══════════════════════════════ */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[2]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Import your résumé
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Upload your résumé to automatically organize your work into a professional portfolio, or start fresh manually.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="block border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl cursor-pointer bg-purple-50/40 hover:bg-purple-50/80 p-8 sm:p-10 transition-all text-center group">
                          <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} className="hidden" />
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-base font-bold text-slate-900 font-bricolage">Drop your résumé file here</p>
                              <p className="text-xs text-slate-500 mt-0.5">PDF or DOCX • Max 10 MB</p>
                            </div>
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs group-hover:border-purple-300 transition-all">
                              Select File
                            </span>
                          </div>
                        </label>

                        {debugInfo && (
                          <ResumeAuditDebug
                            fileName={debugInfo.fileName} fileMime={debugInfo.fileMime} sourceType={debugInfo.sourceType}
                            pages={debugInfo.pages} perPageChars={debugInfo.perPageChars} perPageOcrDetails={debugInfo.perPageOcrDetails}
                            fileSize={debugInfo.fileSize} bufferSize={debugInfo.bufferSize} uint8ArraySize={debugInfo.uint8ArraySize}
                            pdfSignatureValid={debugInfo.pdfSignatureValid} rawCharCount={debugInfo.rawTextLength} cleanCharCount={debugInfo.cleanTextLength}
                            rawText={profile?.resume?.extractedText || ''} extractionMethod={debugInfo.extractionMethod}
                            ocrRequired={debugInfo.ocrRequired} ocrTriggered={debugInfo.ocrTriggered} ocrStatus={debugInfo.ocrStatus}
                            ocrConfidence={debugInfo.ocrConfidence} ocrProviderName={debugInfo.ocrProviderName} ocrError={debugInfo.ocrError}
                            ocrStack={debugInfo.ocrStack} ocrSelfTestPassed={debugInfo.ocrSelfTestPassed} ocrSelfTestChars={debugInfo.ocrSelfTestChars}
                            ocrSelfTestError={debugInfo.ocrSelfTestError} detectedSectionNames={debugInfo.detectedSectionNames}
                            unclassifiedContent={debugInfo.unclassifiedContent} profile={profile}
                          />
                        )}

                        {resumeError && (
                          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-800 leading-relaxed">{resumeError}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 py-2">
                          <div className="flex-1 border-t border-slate-200" />
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">OR</span>
                          <div className="flex-1 border-t border-slate-200" />
                        </div>

                        <button
                          type="button"
                          onClick={startManualOnboarding}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
                        >
                          <span>Start without a résumé</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 3: PERSONAL DETAILS (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[3]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Start with the basics
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Confirm or update your personal details for your portfolio header.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-bricolage">Full Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Karthikeyan Prabakaran"
                              value={profile.personal.fullName}
                              onChange={e => setProfile(p => ({ ...p, personal: { ...p.personal, fullName: e.target.value } }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-bricolage">Professional Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Product Designer & Engineer"
                              value={profile.personal.headline}
                              onChange={e => setProfile(p => ({ ...p, personal: { ...p.personal, headline: e.target.value } }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-bricolage">Email Address</label>
                            <input
                              type="email"
                              placeholder="e.g. karthik@example.com"
                              value={profile.personal.email}
                              onChange={e => setProfile(p => ({ ...p, personal: { ...p.personal, email: e.target.value } }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-bricolage">City / Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Thanjavur, India"
                              value={profile.personal.city}
                              onChange={e => setProfile(p => ({ ...p, personal: { ...p.personal, city: e.target.value } }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider font-bricolage">Short Bio / About Me</label>
                            <button
                              type="button"
                              onClick={() => generateWithAI(
                                'bio',
                                {
                                  name: profile.personal.fullName || '',
                                  title: profile.personal.headline || profile.career?.specialization || '',
                                  field: profile.career?.specialization || '',
                                  existing: profile.personal.summary || ''
                                },
                                'bio',
                                text => setProfile(p => ({ ...p, personal: { ...p.personal, summary: text } }))
                              )}
                              disabled={aiLoading['bio']}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              {aiLoading['bio'] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                              <span>{aiLoading['bio'] ? 'Generating...' : 'Generate with AI'}</span>
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            placeholder="A concise summary highlighting your passion, experience, and what drives your work..."
                            value={profile.personal.summary}
                            onChange={e => setProfile(p => ({ ...p, personal: { ...p.personal, summary: e.target.value } }))}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 4: EDUCATION (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[4]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Academic background
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Add your university degrees, colleges, or high school qualifications.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {profile.education?.map((edu, idx) => (
                          <div key={edu.id || idx} className="rounded-2xl p-5 border border-slate-200 bg-slate-50/60 space-y-4 relative">
                            <button
                              type="button"
                              onClick={() => setProfile(p => ({ ...p, education: p.education?.filter((_, i) => i !== idx) }))}
                              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-8">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Institution / University</label>
                                <input
                                  type="text"
                                  placeholder="e.g. PRIST University"
                                  value={edu.institution}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, education: p.education?.map((item, i) => i === idx ? { ...item, institution: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Degree</label>
                                <input
                                  type="text"
                                  placeholder="e.g. B.Tech"
                                  value={edu.degree}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, education: p.education?.map((item, i) => i === idx ? { ...item, degree: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Field of Study</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Artificial Intelligence & Data Science"
                                  value={edu.specialization || edu.department || ''}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, education: p.education?.map((item, i) => i === idx ? { ...item, specialization: v, department: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Start Year</label>
                                  <input
                                    type="text"
                                    placeholder="2022"
                                    value={edu.startYear}
                                    onChange={e => {
                                      const v = e.target.value;
                                      setProfile(p => ({ ...p, education: p.education?.map((item, i) => i === idx ? { ...item, startYear: v } : item) }));
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">End Year</label>
                                  <input
                                    type="text"
                                    placeholder="2026"
                                    value={edu.endYear}
                                    onChange={e => {
                                      const v = e.target.value;
                                      setProfile(p => ({ ...p, education: p.education?.map((item, i) => i === idx ? { ...item, endYear: v } : item) }));
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => setProfile(p => ({ ...p, education: [...(p.education || []), { id: `edu-${Date.now()}`, institution: '', degree: '', department: '', specialization: '', startYear: '', endYear: '', description: '' }] }))}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 font-bold text-xs hover:border-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Education
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 5: EXPERIENCE (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[5]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Work history &amp; internships
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Share your professional roles, internships, or freelance work.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {profile.experience?.map((exp, idx) => (
                          <div key={exp.id || idx} className="rounded-2xl p-5 border border-slate-200 bg-slate-50/60 space-y-4 relative">
                            <button
                              type="button"
                              onClick={() => setProfile(p => ({ ...p, experience: p.experience?.filter((_, i) => i !== idx) }))}
                              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-8">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Role / Job Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. AI Web Developer"
                                  value={exp.role}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, experience: p.experience?.map((item, i) => i === idx ? { ...item, role: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Company / Organization</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Infowaves"
                                  value={exp.company}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, experience: p.experience?.map((item, i) => i === idx ? { ...item, company: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Duration (Dates)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Aug 2025 - Dec 2025"
                                  value={exp.startDate ? `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}` : ''}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, experience: p.experience?.map((item, i) => i === idx ? { ...item, startDate: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Location</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Thanjavur / Remote"
                                  value={exp.location || ''}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, experience: p.experience?.map((item, i) => i === idx ? { ...item, location: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Description / Key Achievements</label>
                                <button
                                  type="button"
                                  onClick={() => generateWithAI(
                                    'experience_bullet',
                                    {
                                      role: exp.role || '',
                                      company: exp.company || '',
                                      field: profile.career?.specialization || '',
                                      existing: exp.description || ''
                                    },
                                    `exp-${idx}`,
                                    text => setProfile(p => ({
                                      ...p,
                                      experience: p.experience?.map((item, i) => i === idx ? { ...item, description: text } : item)
                                    }))
                                  )}
                                  disabled={aiLoading[`exp-${idx}`]}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                  {aiLoading[`exp-${idx}`] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                  <span>{aiLoading[`exp-${idx}`] ? 'Generating...' : 'Enhance with AI'}</span>
                                </button>
                              </div>
                              <textarea
                                rows={3}
                                placeholder="Built web applications, integrated APIs, optimized database queries..."
                                value={exp.description || exp.achievements?.join('\n') || ''}
                                onChange={e => {
                                  const v = e.target.value;
                                  setProfile(p => ({ ...p, experience: p.experience?.map((item, i) => i === idx ? { ...item, description: v } : item) }));
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => setProfile(p => ({ ...p, experience: [...(p.experience || []), { id: `exp-${Date.now()}`, company: '', role: '', employmentType: 'Full-time', startDate: '', endDate: '', current: false, location: '', description: '', achievements: [] }] }))}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 font-bold text-xs hover:border-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Experience
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 6: PROJECTS (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[6]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Featured projects
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Showcase technical applications, prototypes, or design systems you built.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {profile.projects?.map((proj, idx) => (
                          <div key={proj.id || idx} className="rounded-2xl p-5 border border-slate-200 bg-slate-50/60 space-y-4 relative">
                            <button
                              type="button"
                              onClick={() => setProfile(p => ({ ...p, projects: p.projects?.filter((_, i) => i !== idx) }))}
                              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-8">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Project Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Leads Automated Lead Management"
                                  value={proj.name}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, projects: p.projects?.map((item, i) => i === idx ? { ...item, name: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">GitHub or Live URL</label>
                                <input
                                  type="url"
                                  placeholder="https://github.com/username/project"
                                  value={proj.githubUrl || proj.liveUrl || ''}
                                  onChange={e => {
                                    const v = e.target.value;
                                    setProfile(p => ({ ...p, projects: p.projects?.map((item, i) => i === idx ? { ...item, githubUrl: v, liveUrl: v } : item) }));
                                  }}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Technologies Used</label>
                              <input
                                type="text"
                                placeholder="e.g. Python, React, Next.js, PostgreSQL"
                                value={proj.technologies?.join(', ') || ''}
                                onChange={e => {
                                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  setProfile(p => ({ ...p, projects: p.projects?.map((item, i) => i === idx ? { ...item, technologies: arr } : item) }));
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider font-bricolage">Description</label>
                                <button
                                  type="button"
                                  onClick={() => generateWithAI(
                                    'project_description',
                                    {
                                      title: proj.name || '',
                                      technologies: proj.technologies?.join(', ') || '',
                                      field: profile.career?.specialization || '',
                                      existing: proj.description || ''
                                    },
                                    `proj-${idx}`,
                                    text => setProfile(p => ({
                                      ...p,
                                      projects: p.projects?.map((item, i) => i === idx ? { ...item, description: text } : item)
                                    }))
                                  )}
                                  disabled={aiLoading[`proj-${idx}`]}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                  {aiLoading[`proj-${idx}`] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                  <span>{aiLoading[`proj-${idx}`] ? 'Generating...' : 'Enhance with AI'}</span>
                                </button>
                              </div>
                              <textarea
                                rows={3}
                                placeholder="Describe what you engineered, the problem it solves, and its impact..."
                                value={proj.description}
                                onChange={e => {
                                  const v = e.target.value;
                                  setProfile(p => ({ ...p, projects: p.projects?.map((item, i) => i === idx ? { ...item, description: v } : item) }));
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => setProfile(p => ({ ...p, projects: [...(p.projects || []), { id: `proj-${Date.now()}`, name: '', description: '', technologies: [], githubUrl: '', liveUrl: '', projectUrl: '', image: '', achievements: [], metrics: [] }] }))}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 font-bold text-xs hover:border-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Project
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 7: SKILLS (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 7 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[7]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Key skills &amp; tools
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Add technical languages, frameworks, or tools you use regularly.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a skill and press Enter (e.g. React, Python, Figma)"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && skillInput.trim()) {
                                e.preventDefault();
                                const trimmed = skillInput.trim();
                                if (!profile.skills?.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
                                  setProfile(p => ({
                                    ...p,
                                    skills: [...(p.skills || []), { id: `skill-${Date.now()}`, name: trimmed, category: 'Technical' }]
                                  }));
                                }
                                setSkillInput('');
                              }
                            }}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (skillInput.trim()) {
                                const trimmed = skillInput.trim();
                                if (!profile.skills?.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
                                  setProfile(p => ({
                                    ...p,
                                    skills: [...(p.skills || []), { id: `skill-${Date.now()}`, name: trimmed, category: 'Technical' }]
                                  }));
                                }
                                setSkillInput('');
                              }
                            }}
                            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shrink-0 cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        {profile.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {profile.skills.map((s, idx) => (
                              <span
                                key={s.id || idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-800"
                              >
                                {s.name}
                                <button
                                  type="button"
                                  onClick={() => setProfile(p => ({ ...p, skills: p.skills?.filter((_, i) => i !== idx) }))}
                                  className="text-purple-400 hover:text-purple-700 ml-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 8: LINKS & CERTIFICATIONS (MANUAL ONLY)
                  ══════════════════════════════ */}
                  {step === 8 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          {STEP_EYEBROWS[8]}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Links &amp; credentials
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Connect your online profiles and professional credentials.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-bricolage">Social Profiles</h3>
                          <div className="space-y-2.5">
                            {[
                              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', ph: 'https://linkedin.com/in/username' },
                              { key: 'github', icon: Github, label: 'GitHub', ph: 'https://github.com/username' },
                              { key: 'twitter', icon: Share2, label: 'Twitter / X', ph: 'https://twitter.com/username' },
                            ].map(({ key, icon: Icon, ph }) => (
                              <div key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                  type="url"
                                  placeholder={ph}
                                  value={(profile.social as any)?.[key] || ''}
                                  onChange={e => setProfile(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))}
                                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-bricolage">Certifications</h3>
                          {profile.certifications?.map((cert, idx) => (
                            <div key={cert.id || idx} className="rounded-2xl p-4 sm:p-5 border border-slate-200 bg-slate-50/60 space-y-3 relative">
                              <button
                                type="button"
                                onClick={() => setProfile(p => ({ ...p, certifications: p.certifications?.filter((_, i) => i !== idx) }))}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                                {[
                                  { ph: 'Certificate Name', key: 'name', val: cert.name },
                                  { ph: 'Issuing Organization', key: 'organization', val: cert.organization },
                                  { ph: 'Issue Date (e.g. Jan 2024)', key: 'issueDate', val: cert.issueDate },
                                  { ph: 'Credential URL (optional)', key: 'credentialUrl', val: cert.credentialUrl },
                                ].map(({ ph, key, val }) => (
                                  <input
                                    key={key}
                                    type="text"
                                    placeholder={ph}
                                    value={val || ''}
                                    onChange={e => {
                                      const v = e.target.value;
                                      setProfile(p => ({ ...p, certifications: p.certifications?.map((item, i) => i === idx ? { ...item, [key]: v } : item) }));
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-slate-400"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setProfile(p => ({ ...p, certifications: [...(p.certifications || []), { id: `cert-${Date.now()}`, name: '', organization: '', issueDate: '', credentialId: '', credentialUrl: '' }] }))}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 font-bold text-xs hover:border-purple-400 hover:text-purple-700 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add Certification
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════
                      STEP 9: CHOOSE YOUR PORTFOLIO (FINAL STEP FOR BOTH FLOWS)
                  ══════════════════════════════ */}
                  {step === 9 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 font-bricolage block">
                          CHOOSE YOUR PORTFOLIO
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-bricolage">
                          Select your template layout
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                          Select your initial template style. You can customize colors, layout, and content anytime in the live editor.
                        </p>
                      </div>

                      {/* Plan status banner & template grid */}
                      {(() => {
                        const localUser = currentUser || mockAuth.getCurrentUser();
                        const userTier = getUserPlanTier(localUser);
                        const quota = getPlanTemplateLimit(localUser);
                        const accessibleTemplates = availableTemplates.filter(tmpl => checkTemplateAccess(localUser, tmpl, 0).isAccessible);
                        const lockedTemplates = availableTemplates.filter(tmpl => !checkTemplateAccess(localUser, tmpl, 0).isAccessible);
                        const sortedTemplates = [...accessibleTemplates, ...lockedTemplates];

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-50/70 border border-purple-100/80">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-purple-900 capitalize font-bricolage">
                                  {userTier} Plan Active
                                </span>
                                <span className="text-xs text-purple-700">
                                  • {accessibleTemplates.length} accessible {accessibleTemplates.length === 1 ? 'template' : 'templates'}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-purple-600 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-xs">
                                Allowed Quota: {quota}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[440px] overflow-y-auto pr-1">
                              {sortedTemplates.map(tmpl => {
                                const access = checkTemplateAccess(localUser, tmpl, 0);
                                const isLocked = !access.isAccessible;
                                const isSelected = selectedTemplateId === tmpl.id;

                                return (
                                  <button
                                    key={tmpl.id}
                                    type="button"
                                    onClick={() => {
                                      if (!isLocked) {
                                        setSelectedTemplateId(tmpl.id);
                                      }
                                    }}
                                    className={`rounded-2xl text-left overflow-hidden border transition-all duration-200 flex flex-col relative group ${
                                      isSelected
                                        ? 'border-2 border-purple-600 ring-4 ring-purple-100 bg-purple-50/20 cursor-pointer shadow-md'
                                        : isLocked
                                        ? 'border-slate-200 bg-slate-50/80 opacity-70 cursor-not-allowed'
                                        : 'border-slate-200 bg-white hover:border-purple-300 hover:-translate-y-0.5 shadow-sm cursor-pointer'
                                    }`}
                                  >
                                    <div className="aspect-[16/10] w-full relative flex items-center justify-center bg-slate-100 overflow-hidden">
                                      {tmpl.thumbnail ? (
                                        <img
                                          src={tmpl.thumbnail}
                                          alt={tmpl.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-3">
                                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
                                            <FolderGit2 className="w-5 h-5" />
                                          </div>
                                          <span className="text-[11px] font-semibold text-slate-500 text-center line-clamp-1">{tmpl.name}</span>
                                        </div>
                                      )}

                                      {/* Selected check badge */}
                                      {isSelected && (
                                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-md shadow-purple-600/30 z-10">
                                          <Check className="w-3.5 h-3.5 text-white" />
                                        </div>
                                      )}

                                      {/* Locked overlay & badge */}
                                      {isLocked && (
                                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5 p-2 z-10">
                                          <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                                            <Lock className="w-3.5 h-3.5" />
                                          </div>
                                          <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-md">
                                            {access.requiredTier} Plan
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="p-3 bg-white space-y-0.5 flex-1 flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider truncate">
                                            {tmpl.category || 'Portfolio'}
                                          </span>
                                          {isLocked && (
                                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded uppercase shrink-0">
                                              Locked
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                                          {tmpl.name}
                                        </p>
                                      </div>
                                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-1">
                                        {tmpl.description || 'Clean and responsive layout.'}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* ─── BOTTOM NAVIGATION BAR ─── */}
              <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
                {step > 1 ? (
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                <div className={`flex items-center gap-2.5 ${step === 1 ? 'w-full sm:w-auto sm:ml-auto' : 'flex-1 sm:flex-initial justify-end'}`}>
                  {onboardingMode === 'manual' && [5, 6, 8].includes(step) && (
                    <button
                      onClick={goNext}
                      className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer px-2 py-1 shrink-0"
                    >
                      Skip for now
                    </button>
                  )}

                  <button
                    onClick={goNext}
                    disabled={step === 1 && !profile.career?.specialization}
                    className={`w-full sm:w-[180px] h-12 sm:h-[50px] rounded-[14px] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      step === 1 && !profile.career?.specialization
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-[#7C3AED] text-white hover:bg-purple-700 hover:-translate-y-[1px] shadow-md shadow-purple-600/20 active:scale-[0.98]'
                    }`}
                  >
                    <span>{step === 9 ? 'Launch Portfolio →' : 'Continue'}</span>
                    {step !== 9 && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
