import React, { useState } from 'react';
import { Sparkles, Check, Search, Code2, Layers, Cpu, Wrench } from 'lucide-react';

export default function Skills({ data = {} }) {
  const rawSkills = data?.skills || data?.specializations || data?.services || data?.competencies;

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let skillsSource = [];
  if (Array.isArray(rawSkills)) {
    skillsSource = rawSkills;
  } else if (!hasCustomData) {
    skillsSource = ['Clinical Diagnostics', 'Patient Management', 'Medical Research'];
  }

  // If no skills data exists, cleanly remove section without showing fake demo data
  if (!skillsSource || skillsSource.length === 0) {
    return null;
  }

  let skillsList = skillsSource.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `skill-${idx}`,
        title: item,
        category: 'Core Competency',
        description: `Extensive proficiency and practical application in ${item}.`,
        tags: [item]
      };
    }
    return {
      id: item.id || `skill-${idx}`,
      title: item.title || item.name || item.skill || 'Technical Skill',
      category: item.category || item.badge || 'Competency',
      description: item.description || item.shortDescription || item.summary || 'Demonstrated expertise and applied practical knowledge.',
      tags: Array.isArray(item.tags) ? item.tags : (Array.isArray(item.conditionsTreated) ? item.conditionsTreated : (item.skills ? [item.skills] : []))
    };
  });

  const [searchQuery, setSearchQuery] = useState('');

  const eyebrow = data?.skillsEyebrow || data?.skills?.eyebrow || 'Skills & Expertise';
  const sectionTitle = data?.skillsTitle || data?.skills?.title || 'Core Competencies & Technical Skills';
  const sectionDesc = data?.skillsDescription || data?.skills?.description || 'A comprehensive overview of technical tools, clinical methodologies, and domain proficiencies.';

  const filtered = skillsList.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = item.title?.toLowerCase().includes(q);
    const matchesDesc = item.description?.toLowerCase().includes(q);
    const matchesTag = item.tags?.some(t => t.toLowerCase().includes(q));
    return matchesTitle || matchesDesc || matchesTag;
  });

  return (
    <section
      id="skills"
      data-cv-section="skills"
      className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200"
              data-cv="skills.eyebrow"
            >
              {eyebrow}
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
              data-cv="skills.title"
            >
              {sectionTitle}
            </h2>
            <p
              className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed"
              data-cv="skills.description"
            >
              {sectionDesc}
            </p>
          </div>

          {/* Search Filter */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter skills & tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300/80 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((skill, idx) => (
            <div
              key={skill.id || idx}
              data-cv={`skills.${idx}`}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-50 border border-sky-200 text-sky-800"
                    data-cv={`skills.${idx}.category`}
                  >
                    {skill.category}
                  </span>
                </div>

                <h3
                  className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                  data-cv={`skills.${idx}.title`}
                >
                  {skill.title}
                </h3>

                {skill.description && (
                  <p
                    className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed"
                    data-cv={`skills.${idx}.description`}
                  >
                    {skill.description}
                  </p>
                )}

                {skill.tags && skill.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {skill.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{tag}</span>
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
