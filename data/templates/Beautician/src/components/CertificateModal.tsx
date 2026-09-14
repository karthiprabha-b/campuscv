"use client";

import React from "react";
import { EducationItem } from "@/data/portfolioData";
import { X, Award, CheckCircle2, Shield, Calendar, MapPin, Sparkles } from "lucide-react";

interface CertificateModalProps {
  item: EducationItem | null;
  onClose: () => void;
}

export default function CertificateModal({ item, onClose }: CertificateModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-blush-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Frame Header */}
        <div className="bg-gradient-to-r from-blush-500 via-blush-600 to-champagne-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-amber-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-blush-100">
              Verified Master Credential
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {item.degree}
          </h3>
          <p className="text-sm text-blush-100 mt-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-200" />
            <span>{item.institution}</span>
          </p>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-200">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-800/70 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blush-600" />
                <span>Certification Year</span>
              </div>
              <p className="font-semibold text-sm text-charcoal-900">{item.year}</p>
            </div>

            <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-200">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-800/70 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blush-600" />
                <span>Location</span>
              </div>
              <p className="font-semibold text-sm text-charcoal-900">{item.location}</p>
            </div>

            <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-200 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-800/70 mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Credential ID</span>
              </div>
              <p className="font-mono text-xs font-bold text-emerald-700">{item.credentialId}</p>
            </div>
          </div>

          {/* Honors & Description */}
          {item.honors && (
            <div className="bg-blush-50 p-4 rounded-2xl border border-blush-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blush-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase font-bold text-blush-800">Honors Distinction</p>
                <p className="text-sm font-semibold text-charcoal-900">{item.honors}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-serif font-bold text-base text-charcoal-900 mb-2">Curriculum & Accreditation Scope</h4>
            <p className="text-sm text-charcoal-800/80 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Mastered Competencies */}
          <div>
            <h4 className="font-serif font-bold text-base text-charcoal-900 mb-3">Validated Clinical Competencies</h4>
            <div className="flex flex-wrap gap-2">
              {item.skillsLearned.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-pearl-200 flex items-center justify-between">
            <span className="text-xs text-charcoal-800/60">
              Verified by Global Aesthetics Board
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-charcoal-900 hover:bg-blush-600 text-white text-xs font-semibold transition-colors"
            >
              Close Credential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
