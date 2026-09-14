"use client";

import React, { useState } from "react";
import { portfolioData, EducationItem } from "@/data/portfolioData";
import { GraduationCap, Award, Calendar, MapPin, ExternalLink, CheckCircle2, Sparkles } from "lucide-react";
import CertificateModal from "./CertificateModal";

export default function Education() {
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);

  return (
    <section id="education" className="py-24 bg-[#FAF7F5] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blush-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-white px-4 py-1.5 rounded-full border border-blush-200 inline-block shadow-xs">
            Academic & Clinical Credentials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            International Education & Master Accreditations
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            Certified by premier dermatological institutes and high-fashion academies in London, Zurich, Geneva, and Paris.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.education.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-blush-200 shadow-sm hover:shadow-luxury hover:border-blush-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blush-400 via-blush-500 to-champagne-500"></div>

              <div>
                {/* Header Badge & Year */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blush-100/80 text-blush-800 text-xs font-bold border border-blush-200">
                    <Award className="w-3.5 h-3.5 text-blush-600" />
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-800/70 font-semibold bg-pearl-100 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-blush-500" />
                    <span>{item.year}</span>
                  </div>
                </div>

                {/* Degree Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 group-hover:text-blush-600 transition-colors mb-2">
                  {item.degree}
                </h3>

                {/* Institution & Location */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-charcoal-800/80 mb-4">
                  <div className="flex items-center gap-1 text-blush-700 font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    <span>{item.institution}</span>
                  </div>
                  <div className="flex items-center gap-1 text-charcoal-800/60">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-charcoal-800/80 leading-relaxed font-normal mb-5">
                  {item.description}
                </p>

                {/* Learned Skills Tags */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-800/70">
                    Core Specialisms:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.skillsLearned.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pearl-100 border border-pearl-300 text-charcoal-900 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-blush-600" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Credential ID & Inspect Button */}
              <div className="pt-4 border-t border-blush-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">License / ID</span>
                  <span className="font-mono text-xs font-semibold text-charcoal-800">{item.credentialId}</span>
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-2 rounded-full bg-blush-50 hover:bg-blush-500 text-blush-700 hover:text-white border border-blush-200 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Accreditation Guarantee Bar */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-blush-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-champagne-100 flex items-center justify-center text-champagne-600 flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-charcoal-900">100% Certified Continuous Mastery</p>
              <p className="text-xs text-charcoal-800/70">Undergoing 50+ hours of annual continuing clinical dermatological training.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              ✓ Active 2026 Board Verified
            </span>
          </div>
        </div>
      </div>

      {/* Modal View */}
      <CertificateModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
