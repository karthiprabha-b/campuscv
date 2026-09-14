'use client';

import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import SectionHeader from './SectionHeader';

export default function Experience() {
  const { experience } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="CAREER TIMELINE"
          title="Engineering Chronicles"
          subtitle="Shipping high-velocity architectures, distributed pipelines & cloud infrastructure"
        />

        {/* Stadium Timeline Feed */}
        <div className="space-y-6 sm:space-y-8">
          {experience.map((item, idx) => {
            const isLatest = idx === 0;

            return (
              <div
                key={item.id}
                className="bg-slate-50 hover:bg-cyber-50/40 rounded-[36px] sm:rounded-[48px] lg:rounded-[56px] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-soft-elevation transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Number & Period Pill */}
                  <div className="lg:col-span-4 space-y-2.5 sm:space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-cyan-pill text-cyber-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-cyan-glow shrink-0 font-mono">
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-2xl font-black font-display text-slate-900">
                          {item.company}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-cyber-600" />
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-cyber-600" />
                      <span>{item.period}</span>
                      {isLatest && (
                        <span className="w-2 h-2 rounded-full bg-cyber-brightCyan animate-pulse"></span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Role & Accomplishments */}
                  <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                    <div>
                      <span className="px-3 py-0.5 rounded-full bg-cyber-100 text-cyber-800 text-[11px] font-mono font-bold uppercase">
                        {item.type}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-2">
                        {item.role}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                    </div>

                    {/* Accomplishment Bullets */}
                    <div className="space-y-2 pt-1">
                      {item.achievements.map((ach, achIdx) => (
                        <div key={achIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-cyber-600 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] sm:text-xs font-mono text-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
