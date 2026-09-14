import React, { useState } from 'react';
import { Sparkles, Smile, Eye, Heart, Shield, CheckCircle2, Zap } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

const iconMap = {
  Sparkles: <Sparkles className="w-5 h-5 text-[#DF7A98]" />,
  Smile: <Smile className="w-5 h-5 text-[#DF7A98]" />,
  Eye: <Eye className="w-5 h-5 text-[#DF7A98]" />,
  Heart: <Heart className="w-5 h-5 text-[#DF7A98]" />,
};

function getNormalizedSkillCategories(data) {
  // 1. If explicit skillCategories array exists
  if (Array.isArray(data?.skillCategories) && data.skillCategories.length > 0) {
    return data.skillCategories;
  }

  // 2. Extract raw skills from any common CampusCV schema location
  const rawSkills = Array.isArray(data?.skills)
    ? data.skills
    : (Array.isArray(data?.skills?.items)
      ? data.skills.items
      : (Array.isArray(data?.skillsList)
        ? data.skillsList
        : (Array.isArray(data?.skills_list)
          ? data.skills_list
          : (Array.isArray(data?.content?.skills)
            ? data.content.skills
            : (Array.isArray(data?.resume?.skills)
              ? data.resume.skills
              : (Array.isArray(data?.data?.skills) ? data.data.skills : null))))));

  // 3. If data?.skills is an object with category keys (e.g. { "Makeup": [...], "Skincare": [...] })
  if (!rawSkills && data?.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)) {
    const keys = Object.keys(data.skills).filter(k => k !== 'eyebrow' && k !== 'title' && k !== 'description');
    if (keys.length > 0 && Array.isArray(data.skills[keys[0]])) {
      const iconNames = ['Sparkles', 'Smile', 'Eye', 'Heart'];
      return keys.map((key, idx) => ({
        category: key,
        iconName: iconNames[idx % iconNames.length],
        description: `Professional mastery and techniques in ${key.toLowerCase()}.`,
        skills: data.skills[key].map(item => {
          if (typeof item === 'string') {
            return { name: item, experience: 'Certified', tag: 'Expertise' };
          }
          return {
            name: item.name || item.title || item.skill || 'Specialized Skill',
            experience: item.experience || item.level || 'Certified',
            tag: item.tag || item.level || 'Core'
          };
        })
      }));
    }
  }

  // 4. If rawSkills is an array
  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    // Check if items have category property
    const hasCategories = rawSkills.some(s => s && typeof s === 'object' && (s.category || s.group));
    if (hasCategories) {
      const grouped = {};
      rawSkills.forEach(s => {
        if (!s) return;
        const cat = s.category || s.group || 'Core Competencies';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
          name: typeof s === 'string' ? s : (s.name || s.skill || s.title || 'Specialized Skill'),
          experience: s.experience || s.level || 'Certified',
          tag: s.tag || s.level || 'Core',
          level: typeof s.level === 'number' ? s.level : 95
        });
      });
      const iconNames = ['Sparkles', 'Smile', 'Eye', 'Heart'];
      return Object.keys(grouped).map((catName, idx) => ({
        category: catName,
        iconName: iconNames[idx % iconNames.length],
        description: `Advanced applications and specialized protocol for ${catName.toLowerCase()}.`,
        skills: grouped[catName]
      }));
    }

    // Flat array of strings or simple skill objects
    const cleaned = rawSkills.map(s => {
      if (typeof s === 'string') return { name: s, experience: 'Certified', tag: 'Core Skill' };
      return {
        name: s?.name || s?.skill || s?.title || 'Specialized Skill',
        experience: s?.experience || s?.level || 'Certified',
        tag: s?.tag || s?.badge || 'Mastery',
        level: typeof s?.level === 'number' ? s.level : 95
      };
    }).filter(s => s.name && s.name.trim() !== '');

    if (cleaned.length > 0) {
      if (cleaned.length <= 4) {
        return [{
          category: 'Core Competencies & Artistry',
          iconName: 'Sparkles',
          description: 'Specialized aesthetic protocols and technical artistry developed through professional practice.',
          skills: cleaned
        }];
      } else {
        const chunkSize = Math.ceil(cleaned.length / 2);
        const firstHalf = cleaned.slice(0, chunkSize);
        const secondHalf = cleaned.slice(chunkSize);
        return [
          {
            category: 'Primary Artistry & Core Skills',
            iconName: 'Sparkles',
            description: 'Advanced technical competencies, bespoke client methods, and artistic precision.',
            skills: firstHalf
          },
          {
            category: 'Advanced Protocols & Treatments',
            iconName: 'Smile',
            description: 'Specialized aesthetic procedures, formulations, and advanced clinical techniques.',
            skills: secondHalf
          }
        ];
      }
    }
  }

  // 5. Default fallback
  return _default.skillCategories || [];
}

export default function Skills({ data = {} }) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const rawSkillCats = getNormalizedSkillCategories(data);
  const activeIndex = Math.min(selectedCategoryIndex, Math.max(0, rawSkillCats.length - 1));

  const brandPartners = Array.isArray(data?.brandPartners) && data.brandPartners.length > 0
    ? data.brandPartners
    : (_default.brandPartners || ['Dior Backstage', 'Charlotte Tilbury', 'Biologique Recherche', 'SkinCeuticals', 'Tom Ford Beauty', 'London Lash Pro', 'Aprés Gel-X']);

  const currentCat = rawSkillCats[activeIndex] || rawSkillCats[0] || {
    category: 'Haute Makeup & Bridal Artistry',
    iconName: 'Sparkles',
    description: 'Mastery of complexion illumination and facial architecture.',
    skills: []
  };

  return (
    <section 
      id="skills" 
      data-cv-section="skills"
      data-node-id="section:skills:root:section:0"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Decorative ambient lights */}
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#FCEEF3]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-[#FCEEF3] px-4 py-1.5 rounded-full border border-pink-200 inline-block">
            Master Technical Repertoire
          </span>
          <h2 
            data-node-id="text:skills:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            Artistic & Clinical Competencies
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            Refined through 10+ years of high-volume bridal masterclasses, dermal chemistry research, and runway productions.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {rawSkillCats.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategoryIndex(idx)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'bg-[#DF7A98] text-white shadow-soft-pink scale-105 border border-pink-400'
                  : 'bg-zinc-50 text-zinc-800 hover:bg-pink-50 hover:text-[#DF7A98] border border-zinc-200'
              }`}
            >
              {iconMap[cat.iconName] || <Sparkles className="w-4 h-4" />}
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Active Category Editorial Showcase */}
        <div className="bg-[#FAF7F5] rounded-3xl p-8 sm:p-12 border border-pink-200 shadow-sm transition-all duration-300">
          
          {/* Category Intro Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-pink-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-pink-200 shadow-xs">
                {iconMap[currentCat.iconName] || <Sparkles className="w-6 h-6 text-[#DF7A98]" />}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#DF7A98] tracking-wider">
                  Area of Expertise
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                  {currentCat.category}
                </h3>
              </div>
            </div>
            <p className="text-sm text-zinc-600 max-w-md font-normal leading-relaxed">
              {currentCat.description}
            </p>
          </div>

          {/* Skills Interactive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCat.skills.map((skill, sIdx) => {
              const sName = typeof skill === 'string' ? skill : skill?.name || '';
              const sExp = skill?.experience || '10 Yrs';
              const sTag = skill?.tag || '';
              const sKey = `text:skills:cat:${activeIndex}:item:${sIdx}`;

              return (
                <div
                  key={sIdx}
                  data-node-id={sKey}
                  className="bg-white rounded-2xl p-6 border border-pink-100 shadow-xs hover:shadow-luxury hover:border-pink-300 transition-all duration-300 group flex flex-col justify-between pointer-events-auto"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-50 text-zinc-800 text-[11px] font-semibold border border-zinc-200">
                        <Zap className="w-3 h-3 text-[#DF7A98]" />
                        <span>{sExp} Mastery</span>
                      </span>

                      {sTag && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FCEEF3] text-[#84354D] text-[11px] font-bold border border-pink-200">
                          {sTag}
                        </span>
                      )}
                    </div>

                    {/* Skill Name */}
                    <h4 
                      data-node-id={`${sKey}:name`}
                      data-node-type="text"
                      className="font-serif font-bold text-base sm:text-lg text-zinc-900 group-hover:text-[#DF7A98] transition-colors mb-2 cursor-text"
                    >
                      {sName}
                    </h4>

                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Precision technique developed for long-wear performance, photographic clarity, and skin barrier health.
                    </p>
                  </div>

                  {/* Bottom Accreditation Tag */}
                  <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Protocol</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#DF7A98]">
                      Level 4 Master
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand & Product Partner Ecosystem */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-pink-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#DF7A98]" />
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-700">
              Formulations & Luxury Brand Partner Masteries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mx-auto mb-6">
            Trained and officially certified in luxury backstage product chemistry, active biocompatible actives, and sterile medical-grade adhesives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {brandPartners.map((brand, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-2xl bg-zinc-50 border border-pink-100 text-zinc-900 text-xs sm:text-sm font-serif font-bold tracking-wider hover:border-pink-300 hover:bg-[#FCEEF3] transition-colors shadow-2xs"
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
