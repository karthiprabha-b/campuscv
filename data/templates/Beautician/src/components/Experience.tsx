"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { Briefcase, Calendar, MapPin, CheckCircle, Sparkles, Building2, Star } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-champagne-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-blush-50 px-4 py-1.5 rounded-full border border-blush-200 inline-block">
            Professional Trajectory
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            A Decade of Haute Artistry & Leadership
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            From editorial runway backstages in Paris to luxury Beverly Hills bridal suites.
          </p>
        </div>

        {/* Interactive Experience Timeline */}
        <div className="relative border-l-2 border-blush-200 ml-4 md:ml-32 lg:ml-40 space-y-12 pl-6 md:pl-10">
          {portfolioData.experience.map((exp, index) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Pin/Dot */}
              <div
                className={`absolute -left-[33px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full border-4 border-white transition-transform duration-300 group-hover:scale-125 shadow-md flex items-center justify-center ${
                  exp.isCurrent
                    ? "bg-blush-500 ring-4 ring-blush-200"
                    : "bg-charcoal-800 ring-2 ring-blush-100"
                }`}
              >
                {exp.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>}
              </div>

              {/* Date Indicator on Desktop Left Column */}
              <div className="hidden md:block absolute -left-48 lg:-left-52 top-1 w-36 text-right">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full inline-block border ${
                    exp.isCurrent
                      ? "bg-blush-500 text-white border-blush-400"
                      : "bg-pearl-100 text-charcoal-800 border-pearl-300"
                  }`}
                >
                  {exp.period}
                </span>
                <p className="text-[11px] text-charcoal-800/60 mt-1 font-medium">{exp.location}</p>
              </div>

              {/* Experience Card */}
              <div className="bg-[#FAF7F5] rounded-3xl p-6 sm:p-8 border border-blush-200 shadow-sm hover:shadow-luxury hover:bg-white transition-all duration-300">
                {/* Mobile Date indicator */}
                <div className="md:hidden flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
                      exp.isCurrent
                        ? "bg-blush-500 text-white"
                        : "bg-pearl-200 text-charcoal-800"
                    }`}
                  >
                    {exp.period}
                  </span>
                  <span className="text-xs text-charcoal-800/70 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blush-500" />
                    {exp.location}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 group-hover:text-blush-600 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-blush-700 mt-0.5">
                      <Building2 className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  {exp.isCurrent && (
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      ● Active Practice
                    </span>
                  )}
                </div>

                <p className="text-sm text-charcoal-800/80 leading-relaxed font-normal mb-5">
                  {exp.description}
                </p>

                {/* Key Accomplishment Highlights */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                    Key Milestones & Impact:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {exp.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal-800/80">
                        <div className="w-4 h-4 rounded-full bg-blush-100 flex-shrink-0 flex items-center justify-center text-blush-600 mt-0.5">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High Profile Collaborations / Clients */}
                {exp.clientsWorkedWith && (
                  <div className="pt-4 border-t border-blush-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blush-700 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-blush-600" /> Notable Credits:
                    </span>
                    {exp.clientsWorkedWith.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-white border border-blush-200 text-[11px] font-medium text-charcoal-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
