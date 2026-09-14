"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, UploadCloud, CheckCircle2, AlertCircle, Loader2,
  Sparkles, X, Check, ArrowRight, RefreshCw, Briefcase,
  GraduationCap, FolderKanban, Code, User, Mail, Award,
  ShieldCheck, FileCheck
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';
import { uploadImageFileServer } from '../../utils/imageUploadStorage';
import { normalizeToCanonicalProfile } from '../../types/canonicalProfile';

interface ResumeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (updatedPortfolio: PortfolioData) => void;
}

interface ExtractedData {
  profile: any;
  diagnostics?: any;
  resumeUrl?: string;
  fileName?: string;
}

function extractSkillString(s: any): string {
  if (!s) return '';
  if (typeof s === 'string') return s.trim();
  if (typeof s === 'object') {
    return (s.name || s.skill || s.title || s.label || s.value || '').trim();
  }
  return String(s || '').trim();
}

export default function ResumeSyncModal({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange
}: ResumeSyncModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [replaceMode, setReplaceMode] = useState<'merge' | 'replace'>('replace');

  // Section selection toggles
  const [selectedSections, setSelectedSections] = useState({
    personal: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
    contact: true,
    resumeLink: true
  });

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      setError('Please upload a PDF (.pdf) or Word (.docx) resume.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);
    setProcessingStep('Uploading resume to VPS storage...');

    try {
      const username = (portfolio as any)?.username || (portfolio as any)?.id || 'guest';

      // 1. Upload resume file to VPS /api/assets/upload (category: resumes)
      let serverResumeUrl = '';
      try {
        const oldResumeUrl = (portfolio as any)?.resumeUrl || (portfolio as any)?.resume || '';
        serverResumeUrl = await uploadImageFileServer(file, {
          username,
          category: 'resumes',
          oldUrl: oldResumeUrl,
          replace: true
        });
      } catch (uploadErr) {
        console.warn('[ResumeSyncModal] Asset upload fallback:', uploadErr);
      }

      // 2. Parse resume content via /api/resume/parse
      setProcessingStep('AI analyzing skills, experience, projects & education...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('username', username);

      const parseRes = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      });

      const parseData = await parseRes.json().catch(() => ({}));

      if (!parseRes.ok || !parseData.success || !parseData.profile) {
        throw new Error(parseData.error || 'Failed to extract text from this resume file.');
      }

      setExtractedData({
        profile: parseData.profile,
        diagnostics: parseData.diagnostics,
        resumeUrl: serverResumeUrl || parseData.profile?.resumeUrl,
        fileName: file.name
      });
      setIsProcessing(false);
    } catch (err: any) {
      console.error('[ResumeSyncModal Error]', err);
      setError(err.message || 'Error processing resume. Please try another file.');
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (!extractedData || !extractedData.profile) return;
    const p = extractedData.profile;
    const current = { ...(portfolio || {}) } as any;

    const pers = p.personal || p.profile || {};
    const updated: any = { ...current };

    // 1. Personal & Headline
    if (selectedSections.personal) {
      const newName = (pers.fullName || pers.name || p.fullName || p.name || '').trim();
      const newHeadline = (pers.headline || pers.role || pers.title || p.headline || p.role || '').trim();
      const newBio = (pers.summary || pers.bio || p.summary || p.bio || '').trim();

      if (newName) {
        updated.name = newName;
        updated.fullName = newName;
        updated.hero = { ...(updated.hero || {}), name: newName };
        updated.about = { ...(updated.about || {}), name: newName };
        updated.personal = { ...(updated.personal || {}), name: newName, fullName: newName };
        updated.profile = { ...(updated.profile || {}), name: newName, fullName: newName };
      }

      if (newHeadline) {
        updated.headline = newHeadline;
        updated.role = newHeadline;
        updated.tagline = newHeadline;
        updated.title = newHeadline;
        updated.hero = { ...(updated.hero || {}), title: newHeadline, headline: newHeadline, role: newHeadline, subtitle: newHeadline };
        updated.about = { ...(updated.about || {}), title: newHeadline, headline: newHeadline, role: newHeadline };
        updated.personal = { ...(updated.personal || {}), headline: newHeadline, role: newHeadline };
        updated.profile = { ...(updated.profile || {}), headline: newHeadline, role: newHeadline };
      }

      if (newBio) {
        updated.bio = newBio;
        updated.summary = newBio;
        updated.aboutMe = newBio;
        updated.hero = { ...(updated.hero || {}), introductionText: newBio, description: newBio };
        updated.about = { ...(updated.about || {}), description: newBio, summary: newBio, bio: newBio };
        updated.personal = { ...(updated.personal || {}), summary: newBio, bio: newBio };
        updated.profile = { ...(updated.profile || {}), summary: newBio, bio: newBio };
      }
    }

    // 2. Skills
    if (selectedSections.skills && p.skills) {
      const rawSkills = Array.isArray(p.skills) ? p.skills : [];
      const extractedSkills: string[] = rawSkills.map(extractSkillString).filter(Boolean);

      if (extractedSkills.length > 0) {
        let finalSkills = extractedSkills;
        if (replaceMode === 'merge' && Array.isArray(current.skills) && current.skills.length > 0) {
          const existingSkills = current.skills.map(extractSkillString).filter(Boolean);
          finalSkills = Array.from(new Set([...existingSkills, ...extractedSkills]));
        }
        updated.skills = finalSkills;
        updated.profile = { ...(updated.profile || {}), skills: finalSkills, capabilities: finalSkills };
      }
    }

    // 3. Work Experience
    if (selectedSections.experience && Array.isArray(p.experience) && p.experience.length > 0) {
      const formattedExp = p.experience.map((exp: any, idx: number) => ({
        id: exp.id || `exp-${Date.now()}-${idx}`,
        company: exp.company || exp.organization || '',
        role: exp.role || exp.title || exp.position || '',
        title: exp.role || exp.title || exp.position || '',
        period: exp.startDate ? `${exp.startDate} - ${exp.endDate || (exp.current ? 'Present' : '')}` : (exp.period || ''),
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        location: exp.location || '',
        description: exp.description || (Array.isArray(exp.highlights) ? exp.highlights.join('\n') : ''),
        highlights: Array.isArray(exp.highlights) ? exp.highlights : (exp.description ? [exp.description] : [])
      }));

      if (replaceMode === 'replace' || !Array.isArray(current.experience) || current.experience.length === 0) {
        updated.experience = formattedExp;
        updated.timeline = formattedExp;
      } else {
        updated.experience = [...formattedExp, ...(current.experience || [])];
        updated.timeline = [...formattedExp, ...(current.timeline || current.experience || [])];
      }
      updated.profile = { ...(updated.profile || {}), experience: updated.experience, timeline: updated.timeline };
    }

    // 4. Education
    if (selectedSections.education && Array.isArray(p.education) && p.education.length > 0) {
      const formattedEdu = p.education.map((edu: any, idx: number) => ({
        id: edu.id || `edu-${Date.now()}-${idx}`,
        institution: edu.institution || edu.school || edu.university || '',
        school: edu.institution || edu.school || edu.university || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || edu.major || '',
        period: edu.startDate ? `${edu.startDate} - ${edu.endDate || (edu.current ? 'Present' : '')}` : (edu.period || ''),
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || '',
        description: edu.description || ''
      }));

      if (replaceMode === 'replace' || !Array.isArray(current.education) || current.education.length === 0) {
        updated.education = formattedEdu;
        updated.academics = formattedEdu;
      } else {
        updated.education = [...formattedEdu, ...(current.education || [])];
        updated.academics = [...formattedEdu, ...(current.academics || current.education || [])];
      }
      updated.profile = { ...(updated.profile || {}), education: updated.education, academics: updated.academics };
    }

    // 5. Projects
    if (selectedSections.projects && Array.isArray(p.projects) && p.projects.length > 0) {
      const formattedProjects = p.projects.map((proj: any, idx: number) => ({
        id: proj.id || `proj-${Date.now()}-${idx}`,
        title: proj.title || proj.name || `Project ${idx + 1}`,
        name: proj.title || proj.name || `Project ${idx + 1}`,
        description: proj.description || proj.summary || '',
        tags: Array.isArray(proj.technologies) ? proj.technologies.map(extractSkillString).filter(Boolean) : (Array.isArray(proj.tags) ? proj.tags.map(extractSkillString).filter(Boolean) : []),
        technologies: Array.isArray(proj.technologies) ? proj.technologies.map(extractSkillString).filter(Boolean) : [],
        link: proj.link || proj.url || proj.liveUrl || proj.githubUrl || '',
        image: proj.image || proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'
      }));

      if (replaceMode === 'replace' || !Array.isArray(current.projects) || current.projects.length === 0) {
        updated.projects = formattedProjects;
      } else {
        updated.projects = [...formattedProjects, ...(current.projects || [])];
      }
      updated.profile = { ...(updated.profile || {}), projects: updated.projects };
    }

    // 6. Certifications
    if (selectedSections.certifications && Array.isArray(p.certifications) && p.certifications.length > 0) {
      const formattedCerts = p.certifications.map((cert: any, idx: number) => ({
        id: cert.id || `cert-${Date.now()}-${idx}`,
        name: cert.name || cert.title || '',
        title: cert.name || cert.title || '',
        issuer: cert.issuer || cert.organization || 'Issuing Organization',
        organization: cert.organization || cert.issuer || 'Issuing Organization',
        date: cert.date || cert.issueDate || '',
        issueDate: cert.issueDate || cert.date || '',
        credentialId: cert.credentialId || '',
        url: cert.url || cert.link || cert.credentialUrl || '',
        credentialUrl: cert.credentialUrl || cert.url || cert.link || ''
      }));

      if (replaceMode === 'replace' || !Array.isArray(current.certifications) || current.certifications.length === 0) {
        updated.certifications = formattedCerts;
        updated.certificates = formattedCerts;
        updated.awards = formattedCerts;
      } else {
        updated.certifications = [...formattedCerts, ...(current.certifications || [])];
        updated.certificates = [...formattedCerts, ...(current.certificates || current.certifications || [])];
        updated.awards = [...formattedCerts, ...(current.awards || current.certifications || [])];
      }
      updated.profile = { ...(updated.profile || {}), certifications: updated.certifications, certificates: updated.certificates };
    }

    // 7. Contact Info
    if (selectedSections.contact) {
      const newEmail = pers.email || p.email || '';
      const newPhone = pers.phone || p.phone || '';
      const newLoc = pers.city || pers.location || p.location || '';
      if (newEmail) {
        updated.email = newEmail;
        updated.contact = { ...(updated.contact || {}), email: newEmail };
        updated.personal = { ...(updated.personal || {}), email: newEmail };
        updated.profile = { ...(updated.profile || {}), email: newEmail };
      }
      if (newPhone) {
        updated.phone = newPhone;
        updated.contact = { ...(updated.contact || {}), phone: newPhone };
        updated.personal = { ...(updated.personal || {}), phone: newPhone };
        updated.profile = { ...(updated.profile || {}), phone: newPhone };
      }
      if (newLoc) {
        updated.location = newLoc;
        updated.contact = { ...(updated.contact || {}), location: newLoc, city: newLoc };
        updated.personal = { ...(updated.personal || {}), location: newLoc, city: newLoc };
        updated.profile = { ...(updated.profile || {}), location: newLoc, city: newLoc };
      }
    }

    // 8. Resume File Attachment
    if (selectedSections.resumeLink && extractedData.resumeUrl) {
      updated.resumeUrl = extractedData.resumeUrl;
      updated.resume = extractedData.resumeUrl;
      updated.contact = { ...(updated.contact || {}), resumeUrl: extractedData.resumeUrl };
    }

    // Update canonicalProfile sub-object so portfolioNormalizer binds the new data
    updated.canonicalProfile = normalizeToCanonicalProfile(updated, updated.id, updated.username);

    // Clear stale text contentOverrides for all updated sections
    if (updated.contentOverrides) {
      const cleanOverrides = { ...updated.contentOverrides };
      Object.keys(cleanOverrides).forEach(k => {
        const kLower = k.toLowerCase();
        if (selectedSections.personal && (kLower.includes('name') || kLower.includes('headline') || kLower.includes('role') || kLower.includes('bio') || kLower.includes('hero') || kLower.includes('about') || kLower.includes('title') || kLower.includes('tagline') || kLower.includes('desc'))) {
          delete cleanOverrides[k];
        }
        if (selectedSections.skills && kLower.includes('skill')) {
          delete cleanOverrides[k];
        }
        if (selectedSections.experience && (kLower.includes('exp') || kLower.includes('timeline') || kLower.includes('work'))) {
          delete cleanOverrides[k];
        }
        if (selectedSections.education && (kLower.includes('edu') || kLower.includes('acad') || kLower.includes('school'))) {
          delete cleanOverrides[k];
        }
        if (selectedSections.projects && kLower.includes('proj')) {
          delete cleanOverrides[k];
        }
        if (selectedSections.certifications && (kLower.includes('cert') || kLower.includes('award') || kLower.includes('credential') || kLower.includes('license'))) {
          delete cleanOverrides[k];
        }
      });
      updated.contentOverrides = cleanOverrides;
    }

    // Clear deleted nodes for active updated sections so they re-appear
    if (updated.deletedNodes) {
      const cleanDeleted = { ...updated.deletedNodes };
      Object.keys(cleanDeleted).forEach(k => {
        if (
          (selectedSections.experience && k.includes('experience')) ||
          (selectedSections.education && k.includes('education')) ||
          (selectedSections.projects && k.includes('project')) ||
          (selectedSections.skills && k.includes('skill')) ||
          (selectedSections.certifications && (k.includes('cert') || k.includes('award')))
        ) {
          delete cleanDeleted[k];
        }
      });
      updated.deletedNodes = cleanDeleted;
    }

    onPortfolioChange(updated);
    onClose();
  };

  const p = extractedData?.profile || {};
  const pers = p.personal || p.profile || {};
  const rawSkills = Array.isArray(p.skills) ? p.skills : [];
  const extractedSkillsList = rawSkills.map(extractSkillString).filter(Boolean);
  const skillsCount = extractedSkillsList.length;
  const expCount = Array.isArray(p.experience) ? p.experience.length : 0;
  const eduCount = Array.isArray(p.education) ? p.education.length : 0;
  const projCount = Array.isArray(p.projects) ? p.projects.length : 0;
  const certCount = Array.isArray(p.certifications) ? p.certifications.length : 0;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh] z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-1.5">
                Upload & Update from Resume
                <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  AI Synced
                </span>
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                Upload a new resume anytime to refresh your portfolio with fresh data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!extractedData && !isProcessing && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-violet-600 bg-violet-50/60 scale-[1.01]'
                  : 'border-zinc-200 bg-zinc-50/50 hover:bg-violet-50/30 hover:border-violet-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-violet-600 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-800">
                  Click to browse or drag & drop your updated resume
                </p>
                <p className="text-[11px] text-zinc-500">
                  Supports PDF (.pdf) and Microsoft Word (.docx) • Auto-saves to VPS
                </p>
              </div>
              <span className="mt-1 px-3 py-1 bg-white border border-zinc-200 text-violet-700 text-[11px] font-bold rounded-xl shadow-xs">
                Select Resume File
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-200 animate-pulse">
                  <Sparkles className="w-7 h-7" />
                </div>
                <Loader2 className="w-6 h-6 text-violet-600 animate-spin absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-zinc-900">
                  Processing New Resume...
                </p>
                <p className="text-[11px] text-zinc-500 font-medium">
                  {processingStep || 'Normalizing text and analyzing sections...'}
                </p>
              </div>
            </div>
          )}

          {extractedData && (
            <div className="space-y-5">
              {/* Extraction Header Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950 truncate max-w-[280px]">
                      {extractedData.fileName || 'Resume parsed successfully!'}
                    </h4>
                    <p className="text-[10px] text-emerald-700 font-medium">
                      Found {skillsCount} skills, {expCount} jobs, {projCount} projects, {eduCount} degrees{certCount > 0 ? `, ${certCount} certifications` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setExtractedData(null);
                    setSelectedFile(null);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-100/50 rounded-lg transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {/* Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Update Strategy
                </label>
                <div className="grid grid-cols-2 gap-2 bg-zinc-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setReplaceMode('replace')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                      replaceMode === 'replace'
                        ? 'bg-white text-violet-700 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Replace Selected Sections
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplaceMode('merge')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                      replaceMode === 'merge'
                        ? 'bg-white text-violet-700 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Merge & Add to Existing
                  </button>
                </div>
              </div>

              {/* Checklist of detected sections to update */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Select Sections to Update
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Personal & Headline */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.personal ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.personal}
                      onChange={(e) => setSelectedSections({ ...selectedSections, personal: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" /> Bio & Headline
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {pers.fullName || p.fullName || pers.name || p.name || 'Name & Title'}
                      </p>
                    </div>
                  </label>

                  {/* Skills */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.skills ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.skills}
                      onChange={(e) => setSelectedSections({ ...selectedSections, skills: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-500" /> Skills ({skillsCount})
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {skillsCount > 0 ? extractedSkillsList.slice(0, 3).join(', ') : 'No skills found'}
                      </p>
                    </div>
                  </label>

                  {/* Experience */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.experience ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.experience}
                      onChange={(e) => setSelectedSections({ ...selectedSections, experience: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Experience ({expCount})
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {expCount > 0 ? `${p.experience[0]?.company || 'Job history'}` : 'No experience found'}
                      </p>
                    </div>
                  </label>

                  {/* Projects */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.projects ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.projects}
                      onChange={(e) => setSelectedSections({ ...selectedSections, projects: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 text-violet-500" /> Projects ({projCount})
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {projCount > 0 ? `${p.projects[0]?.title || 'Projects'}` : 'No projects found'}
                      </p>
                    </div>
                  </label>

                  {/* Education */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.education ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.education}
                      onChange={(e) => setSelectedSections({ ...selectedSections, education: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Education ({eduCount})
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {eduCount > 0 ? `${p.education[0]?.institution || p.education[0]?.school || 'Degree'}` : 'No education found'}
                      </p>
                    </div>
                  </label>

                  {/* Certifications */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.certifications ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.certifications}
                      onChange={(e) => setSelectedSections({ ...selectedSections, certifications: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Certifications ({certCount})
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {certCount > 0 ? (p.certifications[0]?.name || p.certifications[0]?.title || 'Certificates & Awards') : 'No certifications found'}
                      </p>
                    </div>
                  </label>

                  {/* Contact & Socials */}
                  <label className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    selectedSections.contact ? 'border-violet-300 bg-violet-50/40' : 'border-zinc-200 bg-zinc-50/30 text-zinc-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.contact}
                      onChange={(e) => setSelectedSections({ ...selectedSections, contact: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-500" /> Contact Info
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-[170px]">
                        {pers.email || p.email || pers.phone || 'Email & Phone'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {extractedData && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-violet-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" /> Apply Changes to Portfolio
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
