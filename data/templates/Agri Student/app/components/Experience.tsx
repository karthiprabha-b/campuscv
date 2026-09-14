'use client';

import React, { useState } from 'react';
import { experienceData } from '@/data/portfolioData';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

export default function Experience() {
  const [filter, setFilter] = useState<'All' | 'Industry Internship' | 'Research' | 'Field Work'>('All');

  const filteredExperiences = filter === 'All'
    ? experienceData
    : experienceData.filter((exp) => exp.type === filter);

  return (
    <section id="experience" className="section-padding" style={{ background: '#061a12', color: '#ffffff', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill dark">
            <Briefcase size={16} />
            <span>FIELD WORK & INDUSTRY EXPERIENCE</span>
          </div>
          <h2 className="section-title dark">
            Hands-on Agronomy & Research Practice
          </h2>
          <p className="section-description dark">
            Proven track record managing large-acreage multispectral drone missions, wet-chemistry soil labs, and high-efficiency smart greenhouse operations.
          </p>

          {/* Filter Pills with Scrollable Overflow on Small Mobile */}
          <div className="filter-bar-scrollable" style={{ marginTop: '1.75rem' }}>
            {(['All', 'Industry Internship', 'Research', 'Field Work'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === type ? '1px solid #a3e635' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: filter === type ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: filter === type ? '#ffffff' : '#a7cfba',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Timeline / Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="card-dark"
              style={{
                position: 'relative',
                padding: 'clamp(1.25rem, 3vw, 2.25rem)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                borderRadius: '20px',
              }}
            >
              {/* Header inside card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        background: 'rgba(163, 230, 53, 0.15)',
                        color: '#bef264',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        border: '1px solid rgba(163, 230, 53, 0.3)',
                      }}
                    >
                      {exp.type}
                    </span>
                    <span style={{ color: '#6ee7b7', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {exp.period}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
                    {exp.role}
                  </h3>

                  <div style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1rem)', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span>{exp.organization}</span>
                    <span>•</span>
                    <span style={{ color: '#94d3a2', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} /> {exp.location}
                    </span>
                  </div>
                </div>

                {exp.statsBadge && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(132, 204, 22, 0.2) 100%)',
                      border: '1px solid rgba(163, 230, 53, 0.4)',
                      padding: '0.5rem 0.95rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: '#bef264',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}
                  >
                    <TrendingUp size={16} />
                    <span>{exp.statsBadge}</span>
                  </div>
                )}
              </div>

              {/* Summary Description */}
              <p style={{ color: '#c7e6d4', fontSize: 'clamp(0.9rem, 1.5vw, 0.98rem)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                {exp.description}
              </p>

              {/* Key Achievements */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a3e635', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  Key Field Results & Milestones
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {exp.achievements.map((item, aIdx) => (
                    <div key={aIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#e2f4ea' }}>
                      <CheckCircle2 size={15} color="#34d399" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      color: '#a7cfba',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 500,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
