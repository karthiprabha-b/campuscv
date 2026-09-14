'use client';

import React, { useState } from 'react';
import { skillCategories } from '@/data/portfolioData';
import { 
  Wrench, 
  Wheat, 
  Cpu, 
  Binary, 
  FlaskConical, 
  Sparkles 
} from 'lucide-react';

export default function Skills() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const icons = {
    Wheat: <Wheat size={20} />,
    Cpu: <Cpu size={20} />,
    Binary: <Binary size={20} />,
    FlaskConical: <FlaskConical size={20} />,
  };

  return (
    <section id="skills" className="section-padding" style={{ background: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <Wrench size={16} />
            <span>TECHNICAL & FIELD TOOLCHAIN</span>
          </div>
          <h2 className="section-title">
            Skills & Domain Competencies
          </h2>
          <p className="section-description">
            A cross-disciplinary toolkit bridging biological crop science, agricultural telemetry hardware, and spatial geospatial analytics.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
          className="skills-tab-grid"
        >
          {skillCategories.map((cat, idx) => {
            const isSelected = activeCategoryIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: isSelected ? '1px solid #10b981' : '1px solid #e1ede6',
                  background: isSelected ? '#082015' : '#f8faf9',
                  color: isSelected ? '#ffffff' : '#082015',
                  boxShadow: isSelected ? '0 8px 20px rgba(8, 32, 21, 0.2)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    color: isSelected ? '#a3e635' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {icons[cat.icon as keyof typeof icons] || <Sparkles size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(0.82rem, 1.4vw, 0.92rem)', fontWeight: 800, lineHeight: 1.2 }}>
                    {cat.category}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isSelected ? '#6ee7b7' : '#708c7f', marginTop: '0.15rem' }}>
                    {cat.skills.length} skills
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Display Box */}
        <div
          className="card-white"
          style={{
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            borderRadius: '20px',
            border: '1px solid #d4e8dc',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.4rem)', fontWeight: 800, color: '#082015', marginBottom: '0.3rem' }}>
              {skillCategories[activeCategoryIndex].category}
            </h3>
            <p style={{ color: '#527363', fontSize: '0.9rem' }}>
              {skillCategories[activeCategoryIndex].description}
            </p>
          </div>

          {/* Skills Progress List */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem 2rem',
            }}
            className="skills-grid-inner"
          >
            {skillCategories[activeCategoryIndex].skills.map((skill, sIdx) => (
              <div key={sIdx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#082015' }}>
                    {skill.name}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: '7px',
                    width: '100%',
                    background: '#e6f4ec',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '0.3rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${skill.level}%`,
                      background: 'linear-gradient(90deg, #10b981 0%, #84cc16 100%)',
                      borderRadius: '9999px',
                    }}
                  />
                </div>

                {skill.highlight && (
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    🎯 <em>{skill.highlight}</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .skills-tab-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .skills-tab-grid {
            grid-template-columns: 1fr !important;
          }
          .skills-grid-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
