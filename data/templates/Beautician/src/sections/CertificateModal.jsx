import React from 'react';
import { X, Award, CheckCircle2, Shield, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function CertificateModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1E1B1D]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Frame Header */}
        <div className="bg-gradient-to-r from-[#DF7A98] via-[#C95679] to-[#C59B6D] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-amber-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-100">
              Verified Master Credential
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {item.degree}
          </h3>
          <p className="text-sm text-pink-100 mt-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-200" />
            <span>{item.institution}</span>
          </p>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#DF7A98]" />
                <span>Certification Period</span>
              </div>
              <p className="font-semibold text-sm text-zinc-900">{item.period || item.year}</p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#DF7A98]" />
                <span>Location</span>
              </div>
              <p className="font-semibold text-sm text-zinc-900">{item.location || 'Beverly Hills, CA'}</p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Credential ID</span>
              </div>
              <p className="font-mono text-xs font-bold text-emerald-700">{item.credentialId || 'BOARD-VERIFIED'}</p>
            </div>
          </div>

          {/* Honors & Description */}
          {item.honors && (
            <div className="bg-[#FCEEF3] p-4 rounded-2xl border border-pink-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#DF7A98] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase font-bold text-[#A83E5D]">Honors Distinction</p>
                <p className="text-sm font-semibold text-zinc-900">{item.honors}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-serif font-bold text-base text-zinc-900 mb-2">Curriculum & Accreditation Scope</h4>
            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Mastered Competencies */}
          {Array.isArray(item.skillsLearned) && item.skillsLearned.length > 0 && (
            <div>
              <h4 className="font-serif font-bold text-base text-zinc-900 mb-3">Validated Clinical Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {item.skillsLearned.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {typeof skill === 'string' ? skill : skill?.name || ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Verified by Global Aesthetics Board
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-[#DF7A98] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Credential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
