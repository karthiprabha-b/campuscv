"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Sparkles, Smile, Eye, Heart, Shield, CheckCircle2, Award, Zap } from "lucide-react";

export default function Skills() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5 text-blush-600" />,
    Smile: <Smile className="w-5 h-5 text-blush-600" />,
    Eye: <Eye className="w-5 h-5 text-blush-600" />,
    Heart: <Heart className="w-5 h-5 text-blush-600" />,
  };

  return (
    <section id="skills" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative subtle ambient lights */}
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blush-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-blush-50 px-4 py-1.5 rounded-full border border-blush-200 inline-block">
            Master Technical Repertoire
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            Artistic & Clinical Competencies
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            Refined through 10+ years of high-volume bridal masterclasses, dermal chemistry research, and runway productions.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {portfolioData.skillCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategoryIndex(idx)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                selectedCategoryIndex === idx
                  ? "bg-blush-500 text-white shadow-soft-pink scale-105 border border-blush-400"
                  : "bg-pearl-100 text-charcoal-800 hover:bg-blush-50 hover:text-blush-600 border border-pearl-200"
              }`}
            >
              {iconMap[cat.iconName]}
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Active Category Editorial Showcase (Card & Grid Based Design - NO Volume Bars) */}
        {(() => {
          const currentCat = portfolioData.skillCategories[selectedCategoryIndex];
          return (
            <div className="bg-[#FAF7F5] rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-sm transition-all duration-300">
              {/* Category Intro Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-blush-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-blush-200 shadow-xs">
                    {iconMap[currentCat.iconName]}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-blush-600 tracking-wider">
                      Area of Expertise
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                      {currentCat.category}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-charcoal-800/80 max-w-md font-normal leading-relaxed">
                  {currentCat.description}
                </p>
              </div>

              {/* Skills Interactive Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white rounded-2xl p-6 border border-blush-100 shadow-xs hover:shadow-luxury hover:border-blush-300 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pearl-100 text-charcoal-800 text-[11px] font-semibold border border-pearl-200">
                          <Zap className="w-3 h-3 text-blush-500" />
                          {skill.experience} Mastery
                        </span>

                        {skill.tag && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blush-100 text-blush-800 text-[11px] font-bold border border-blush-200">
                            {skill.tag}
                          </span>
                        )}
                      </div>

                      {/* Skill Name */}
                      <h4 className="font-serif font-bold text-base sm:text-lg text-charcoal-900 group-hover:text-blush-600 transition-colors mb-2">
                        {skill.name}
                      </h4>

                      <p className="text-xs text-charcoal-800/70 leading-relaxed">
                        Precision technique developed for long-wear performance, photographic clarity, and skin barrier health.
                      </p>
                    </div>

                    {/* Bottom Accreditation Tag */}
                    <div className="mt-5 pt-3 border-t border-pearl-100 flex items-center justify-between text-xs text-charcoal-800/60 font-medium">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certified Protocol</span>
                      </span>
                      <span className="text-[11px] font-semibold text-blush-700">
                        Level 4 Master
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Brand & Product Ecosystem Mastery */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-blush-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blush-600" />
            <span className="text-xs uppercase font-bold tracking-widest text-charcoal-800/80">
              Formulations & Luxury Brand Partner Masteries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-800/70 max-w-2xl mx-auto mb-6">
            Trained and officially certified in luxury backstage product chemistry, active biocompatible actives, and sterile medical-grade adhesives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {portfolioData.brandPartners.map((brand, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-2xl bg-pearl-100 border border-blush-100 text-charcoal-900 text-xs sm:text-sm font-serif font-bold tracking-wider hover:border-blush-300 hover:bg-blush-50 transition-colors shadow-2xs"
              >
                ✦ {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
