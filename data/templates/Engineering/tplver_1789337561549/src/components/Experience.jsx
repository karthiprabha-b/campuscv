import React from 'react';
import { Briefcase, MapPin, Calendar, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Experience({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { experience } = norm;

  return (
    <section
      id="experience"
      data-node-id="section:experience:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="CAREER TIMELINE"
          title="Engineering Experience"
          subtitle="Proven track record architecting high-throughput distributed systems & high-performance platforms"
        />

        {/* Career Timeline Stack */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {(experience || []).map((item, idx) => (
            <div
              key={item.id || idx}
              data-node-id={`container:experience:card:${idx}`}
              data-node-type="container"
              data-cv={`experience.items[${idx}]`}
              className="bg-gradient-to-br from-slate-50 to-white rounded-[36px] sm:rounded-[48px] lg:rounded-[56px] p-6 sm:p-8 lg:p-10 shadow-soft-elevation border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-deep-float relative overflow-hidden"
            >
              {/* Accent Left Border Bar */}
              <div className="absolute top-0 left-0 bottom-0 w-2.5 sm:w-3 bg-gradient-to-b from-cyber-brightCyan via-cyber-500 to-cyber-neonViolet"></div>

              <div className="space-y-6 pl-2 sm:pl-4">
                {/* Role Header Bar */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-cyber-100 text-cyber-800 text-[10px] sm:text-[11px] font-mono font-bold uppercase">
                        {item.type || 'Full-Time'}
                      </span>
                      <span
                        data-node-id={`text:experience:company:${idx}:0`}
                        data-node-type="text"
                        data-cv={`experience.items[${idx}].company`}
                        className="text-xs sm:text-sm font-bold text-cyber-700 font-mono"
                      >
                        @{item.company}
                      </span>
                    </div>

                    <h3
                      data-node-id={`text:experience:role:${idx}:0`}
                      data-node-type="text"
                      data-cv={`experience.items[${idx}].role`}
                      className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-slate-950"
                    >
                      {item.role}
                    </h3>

                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyber-600" />
                      <span>{item.location}</span>
                    </p>
                  </div>

                  <div
                    data-node-id={`text:experience:duration:${idx}:0`}
                    data-node-type="text"
                    data-cv={`experience.items[${idx}].duration`}
                    className="px-4 py-1.5 rounded-full bg-cyber-950 text-cyber-brightCyan font-mono font-bold text-xs sm:text-sm shadow-sm"
                  >
                    {item.duration}
                  </div>
                </div>

                {/* Summary */}
                {item.summary && (
                  <p
                    data-node-id={`text:experience:summary:${idx}:0`}
                    data-node-type="text"
                    className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans"
                  >
                    {item.summary}
                  </p>
                )}

                {/* Key Achievements Bullet Points */}
                {Array.isArray(item.achievements) && item.achievements.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Key Deliverables &amp; System Impact:
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {item.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyber-600 shrink-0 mt-0.5" />
                          <span data-node-id={`text:experience:achieve:${idx}:${aIdx}:0`} data-node-type="text">
                            {ach}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Pills */}
                {Array.isArray(item.techStack || item.technologies) && (item.techStack || item.technologies).length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {(item.techStack || item.technologies).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-mono shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
