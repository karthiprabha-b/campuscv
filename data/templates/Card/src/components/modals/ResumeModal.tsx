'use client';

import React, { useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import {
  X,
  Download,
  Printer,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle
} from 'lucide-react';

const DEFAULT_PROFILE = {
  name: "Alex Sterling",
  title: "Senior Full-Stack & Cloud Engineer",
  email: "alex.sterling.dev@example.com",
  location: "San Francisco, CA (Open to Remote)",
  bio: "Passionate engineer dedicated to crafting fluid, high-performance web and cloud architectures.",
  story: "Over the past 6+ years, I've designed and scaled systems handling millions of daily queries while obsessing over micro-interactions and pixel-perfect UIs."
};

interface ResumeModalProps {
  data?: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = React.memo(({ data, isOpen, onClose }) => {
  const profile = data?.profile || data?.hero || data || {};
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications : [];

  const { accentClass } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadText = () => {
    const content = `
${profile?.name || DEFAULT_PROFILE.name} - ${profile?.title || DEFAULT_PROFILE.title}
Email: ${profile?.email || DEFAULT_PROFILE.email} | Location: ${profile?.location || DEFAULT_PROFILE.location}

SUMMARY:
${profile?.story || profile?.bio || DEFAULT_PROFILE.story}

EXPERIENCE:
${experience.map((e: any) => `
- ${e.role || e.title} @ ${e.company} (${e.period || e.year || ''})
  ${e.description || ''}
  Key Highlights:
  ${(e.highlights || []).map((h: string) => `  * ${h}`).join('\n')}
  Stack: ${(e.technologies || e.skills || []).join(', ')}
`).join('\n')}

EDUCATION:
${education.map((ed: any) => `
- ${ed.degree} in ${ed.field || ''} - ${ed.institution} (${ed.period || ed.year || ''})
  Grade: ${ed.grade || ''}
  Honors: ${(ed.honors || []).join(', ')}
`).join('\n')}

CERTIFICATIONS:
${certifications.map((c: any) => `- ${c.title || c.name} (${c.issuer}, ${c.issueDate || c.date || ''}) - ID: ${c.credentialId || ''}`).join('\n')}
    `.trim();

    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(profile?.name || DEFAULT_PROFILE.name).replace(/\s+/g, '_')}_Resume.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-white/20 shadow-2xl p-6 sm:p-10 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky -top-6 bg-zinc-950/90 backdrop-blur-xl z-20 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-white font-mono">Curriculum Vitae</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {profile?.name || DEFAULT_PROFILE.name}
          </h1>
          <p className={`text-base font-semibold ${accentClass.text}`}>
            {profile?.title || DEFAULT_PROFILE.title}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-300 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              {profile?.email || DEFAULT_PROFILE.email}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {profile?.location || DEFAULT_PROFILE.location}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {profile?.story || profile?.bio || DEFAULT_PROFILE.story}
        </div>

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <Briefcase className="w-4 h-4" /> Professional Experience
            </h2>

            <div className="space-y-4">
              {experience.map((exp: any, i: number) => (
                <div key={exp.id || i} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between text-sm font-semibold text-white">
                    <span>{exp.role || exp.title} — <span className="text-zinc-300 font-normal">{exp.company}</span></span>
                    <span className="text-xs text-zinc-400 font-mono">{exp.period || exp.year || ''}</span>
                  </div>
                  {exp.description && <p className="text-xs text-zinc-400">{exp.description}</p>}
                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300 pl-1">
                      {exp.highlights.map((h: string, hIdx: number) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <GraduationCap className="w-4 h-4" /> Education
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {education.map((edu: any, i: number) => (
                <div key={edu.id || i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-xs font-semibold text-white">{edu.degree}</div>
                  <div className="text-xs text-zinc-400">{edu.institution} ({edu.period || edu.year || ''})</div>
                  {edu.grade && <div className="text-[11px] font-mono text-emerald-400">{edu.grade}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
              <Award className="w-4 h-4" /> Certifications & Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c: any, i: number) => (
                <div key={c.id || i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-medium text-white">{c.title}</div>
                    <div className="text-[11px] text-zinc-400">{c.issuer} · {c.issueDate || c.date || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ResumeModal.displayName = 'ResumeModal';
