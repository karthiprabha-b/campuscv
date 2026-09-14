import React from 'react';
import { Wrench, Wheat, Cpu, Binary, FlaskConical, Sparkles, CheckCircle2, Leaf, Zap, ShieldCheck } from 'lucide-react';
import { skillCategories } from '../data/agriDefaults.js';
const _agriSkills = (typeof skillCategories !== 'undefined' && skillCategories) || [];

export default function Skills({ data = {} }) {
  // Normalize incoming skills from CampusCV
  let categories = [];

  const rawSkills = data?.skills;

  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    // Check if format is already categorized objects with skills arrays: [{ category: "...", skills: [...] }]
    const hasCategoryArrays = rawSkills.some(s => s && typeof s === 'object' && Array.isArray(s.skills));

    if (hasCategoryArrays) {
      categories = rawSkills.map((cat, idx) => ({
        category: cat.category || `Competency Group ${idx + 1}`,
        description: cat.description || `Specialized skillsets and methodologies in ${String(cat.category || '').toLowerCase()}.`,
        icon: cat.icon || (idx === 0 ? 'Wheat' : (idx === 1 ? 'Cpu' : (idx === 2 ? 'Binary' : 'FlaskConical'))),
        skills: (cat.skills || []).map(sk => typeof sk === 'string' ? { name: sk } : { name: sk.name || sk.title || sk.skill || 'Skill', highlight: sk.highlight, level: sk.level })
      }));
    } else {
      // Check if items have distinct meaningful categories (more than 1 item per category)
      const catMap = {};
      const flatList = [];

      rawSkills.forEach((s) => {
        if (!s) return;
        if (typeof s === 'string') {
          flatList.push({ name: s });
        } else if (typeof s === 'object') {
          const name = s.name || s.title || s.skill || s.label;
          const category = s.category || s.group || s.domain;
          if (category && category !== name) {
            if (!catMap[category]) catMap[category] = [];
            catMap[category].push({ name: name || 'Skill', highlight: s.highlight, level: s.level });
          } else if (name) {
            flatList.push({ name, highlight: s.highlight, level: s.level });
          }
        }
      });

      const catEntries = Object.entries(catMap);
      if (catEntries.length >= 2) {
        categories = catEntries.map(([category, skills], idx) => ({
          category,
          description: `Core domain expertise in ${category.toLowerCase()}.`,
          icon: idx === 0 ? 'Wheat' : (idx === 1 ? 'Cpu' : (idx === 2 ? 'Binary' : 'FlaskConical')),
          skills
        }));
      } else {
        // Flat list: bundle all skills into 3 balanced, beautifully themed volumetric cards
        const allItems = [...flatList, ...catEntries.flatMap(([_, list]) => list)];
        if (allItems.length > 0) {
          const chunkSize = Math.max(3, Math.ceil(allItems.length / 3));
          const chunk1 = allItems.slice(0, chunkSize);
          const chunk2 = allItems.slice(chunkSize, chunkSize * 2);
          const chunk3 = allItems.slice(chunkSize * 2);

          categories = [
            {
              category: 'Core Agronomy & Engineering',
              description: 'Primary computational tools, domain fundamentals, and precision frameworks.',
              icon: 'Wheat',
              skills: chunk1
            },
            ...(chunk2.length > 0 ? [{
              category: 'AgriTech & Smart Toolchains',
              description: 'Telemetry protocols, specialized software, and embedded hardware.',
              icon: 'Cpu',
              skills: chunk2
            }] : []),
            ...(chunk3.length > 0 ? [{
              category: 'Field Research & Analytics',
              description: 'Data analytics, diagnostics, and scientific testing methodologies.',
              icon: 'Binary',
              skills: chunk3
            }] : [])
          ];
        }
      }
    }
  }

  // Fallback to rich defaults
  if (!categories || categories.length === 0) {
    categories = _agriSkills;
  }

  const getCategoryIcon = (iconName, idx) => {
    const iconStyle = { color: '#ffffff', flexShrink: 0 };
    switch (iconName) {
      case 'Wheat':
        return <Wheat size={22} style={iconStyle} />;
      case 'Cpu':
        return <Cpu size={22} style={iconStyle} />;
      case 'Binary':
        return <Binary size={22} style={iconStyle} />;
      case 'FlaskConical':
        return <FlaskConical size={22} style={iconStyle} />;
      default:
        return idx % 2 === 0 ? <Leaf size={22} style={iconStyle} /> : <Zap size={22} style={iconStyle} />;
    }
  };

  return (
    <section 
      id="skills" 
      data-cv-section="skills" 
      data-node-id="section:skills:root:section:0"
      className="agri-section-padding" 
      style={{ background: '#f8faf9', position: 'relative' }}
    >
      <div className="agri-container">
        {/* Section Header */}
        <div className="agri-section-header">
          <div className="agri-badge-pill">
            <Wrench size={16} />
            <span>TECHNICAL & FIELD TOOLCHAIN</span>
          </div>
          <h2 className="agri-section-title" data-cv="skills.title">
            Skills & Domain Competencies
          </h2>
          <p className="agri-section-description" data-cv="skills.description">
            A comprehensive, volumetric toolkit bridging biological crop science, agricultural telemetry hardware, and spatial geospatial analytics.
          </p>
        </div>

        {/* Volumetric Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
          className="skills-volumetric-grid"
        >
          {categories.map((cat, catIdx) => (
            <div
              key={cat.category || catIdx}
              data-node-id={`container:skills:card:${catIdx}`}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #d8ebd0',
                padding: 'clamp(1.4rem, 3vw, 2rem)',
                boxShadow: '0 10px 30px rgba(8, 32, 21, 0.05), 0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              className="agri-volumetric-card"
            >
              {/* Subtle Decorative Gradient Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '180px',
                  height: '180px',
                  background: 'radial-gradient(circle, rgba(163, 230, 53, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div>
                {/* Card Top Banner: 3D Icon + Header Info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'var(--primary, #10b981)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-foreground, #ffffff)',
                        boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',
                        flexShrink: 0,
                      }}
                    >
                      {getCategoryIcon(cat.icon, catIdx)}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#082015',
                          lineHeight: 1.25,
                          marginBottom: '0.2rem',
                          fontFamily: 'var(--font-primary)',
                        }}
                      >
                        {cat.category}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--primary, #059669)',
                          background: 'rgba(16, 185, 129, 0.12)',
                          padding: '0.15rem 0.6rem',
                          borderRadius: '9999px',
                          display: 'inline-block',
                        }}
                      >
                        {cat.skills?.length || 0} Proficiencies
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Description */}
                {cat.description && (
                  <p style={{ color: '#527363', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {cat.description}
                  </p>
                )}

                {/* Volumetric Skills Badges / Chips Flow */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                  }}
                  className="skills-chip-cluster"
                >
                  {(cat.skills || []).map((skill, sIdx) => {
                    const name = typeof skill === 'string' ? skill : (skill.name || skill.title || skill.skill || 'Skill');
                    const highlight = typeof skill === 'object' ? skill.highlight : null;

                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 0.9rem',
                          background: 'linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%)',
                          border: '1px solid #d4ebdc',
                          borderRadius: '12px',
                          boxShadow: '0 2px 6px rgba(8, 32, 21, 0.04)',
                          transition: 'all 0.2s ease',
                          cursor: 'default',
                        }}
                        className="agri-skill-chip"
                      >
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'var(--primary, #10b981)',
                            boxShadow: '0 0 8px var(--primary, #a3e635)',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#082015',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {name}
                        </span>

                        {highlight && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#047857',
                              background: '#e0f2ea',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '6px',
                              marginLeft: '0.2rem',
                            }}
                          >
                            {highlight}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
