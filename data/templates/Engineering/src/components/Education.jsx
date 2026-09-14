import React from 'react';
import { Award, CheckCircle2, MapPin } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Education({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { education } = norm;

  return (
    <section
      id="education"
      data-node-id="section:education:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-cyber-lightBg wave-top-curve wave-bottom-curve relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="ACADEMIC FOUNDATION"
          title="Education &amp; Research"
          subtitle="Rigorous foundations in distributed systems, computer architecture & algorithms"
        />

        {/* 2 Stadium Arch Education Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {(education || []).map((item, idx) => (
            <div
              key={item.id || idx}
              data-node-id={`container:education:card:${idx}`}
              data-node-type="container"
              data-cv={`education.items[${idx}]`}
              className="bg-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-10 shadow-soft-elevation border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-deep-float"
            >
              <div className="space-y-5 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-cyber-950 flex items-center justify-center font-bold text-lg sm:text-xl shadow-md shrink-0"
                      style={{ color: 'var(--campuscv-accent-light, var(--campuscv-accent))' }}
                    >
                      {item.institution ? item.institution.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h3
                        data-node-id={`text:education:institution:${idx}:0`}
                        data-node-type="text"
                        data-cv={`education.items[${idx}].institution`}
                        className="font-display font-black text-lg sm:text-xl text-slate-950"
                      >
                        {item.institution}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-cyber-600" />
                        <span data-node-id={`text:education:location:${idx}:0`} data-node-type="text">
                          {item.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    data-node-id={`text:education:period:${idx}:0`}
                    data-node-type="text"
                    data-cv={`education.items[${idx}].year`}
                    className="px-3.5 py-1 bg-cyber-100 text-cyber-800 rounded-full text-xs font-mono font-bold"
                  >
                    {item.period}
                  </div>
                </div>

                {/* Degree & Honors */}
                <div>
                  <span
                    data-node-id={`text:education:field:${idx}:0`}
                    data-node-type="text"
                    className="px-3 py-1 bg-cyber-50 text-cyber-700 rounded-full text-xs font-mono font-bold uppercase"
                  >
                    {item.field}
                  </span>
                  <h4
                    data-node-id={`text:education:degree:${idx}:0`}
                    data-node-type="text"
                    data-cv={`education.items[${idx}].degree`}
                    className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-2"
                  >
                    {item.degree}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {item.gpa && (
                      <span className="px-3 py-1 bg-cyber-950 text-white rounded-full text-xs font-mono font-bold">
                        GPA: {item.gpa}
                      </span>
                    )}
                    {item.honors && (
                      <span className="px-3 py-1 bg-cyber-100 text-cyber-800 rounded-full text-xs font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-cyber-600" />
                        {item.honors}
                      </span>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Research Thesis &amp; Highlights:
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {item.highlights.map((point, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyber-600 shrink-0 mt-0.5" />
                          <span data-node-id={`text:education:highlight:${idx}:${hIdx}:0`} data-node-type="text">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Coursework Tags */}
              {Array.isArray(item.keyCourses) && item.keyCourses.length > 0 && (
                <div className="pt-5 mt-5 border-t border-slate-100">
                  <h5 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Core Coursework:
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {item.keyCourses.map((course, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-mono"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
