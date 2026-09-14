'use client';

import React from 'react';
import { educationData } from '@/data/portfolioData';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  FileCode2, 
  Building2, 
  MapPin 
} from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="section-padding" style={{ background: '#f0f7f3' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <GraduationCap size={16} />
            <span>ACADEMIC FOUNDATIONS</span>
          </div>
          <h2 className="section-title">
            Education & Research Specialization
          </h2>
          <p className="section-description">
            Rigorous scientific training encompassing soil physics, molecular plant pathology, precision geospatial mapping, and automated agro-meteorology.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="card-white"
              style={{
                border: '1px solid #d4e8dc',
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 3vw, 2.25rem)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Stripe */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: index === 0
                    ? 'linear-gradient(90deg, #10b981 0%, #a3e635 100%)'
                    : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                }}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.8fr',
                  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
                className="edu-grid"
              >
                {/* Left Column: Degree & Thesis */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        padding: '0.3rem 0.75rem',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {edu.period}
                    </div>
                    <div
                      style={{
                        padding: '0.3rem 0.75rem',
                        background: '#dcfce7',
                        color: '#15803d',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                      }}
                    >
                      {edu.grade}
                    </div>
                  </div>

                  <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#082015', marginBottom: '0.3rem' }}>
                    {edu.degree}
                  </h3>
                  <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 600, color: '#059669', marginBottom: '0.75rem' }}>
                    {edu.major}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', color: '#527363', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={15} color="#10b981" />
                      <span>{edu.institution}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} color="#10b981" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  {/* Honors & Distinctions List */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                      Honors & Distinctions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {edu.honors.map((honor, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.86rem', color: '#164e34' }}>
                          <Award size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{honor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thesis Box */}
                  <div
                    style={{
                      background: '#f8faf9',
                      border: '1px solid #d8e8de',
                      borderRadius: '14px',
                      padding: '1.1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                      <BookOpen size={15} />
                      <span>SENIOR RESEARCH THESIS</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#082015', marginBottom: '0.35rem' }}>
                      {edu.thesis.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#527363', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                      {edu.thesis.description}
                    </p>
                    <div style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 600 }}>
                      Advisor: {edu.thesis.advisor}
                    </div>
                  </div>
                </div>

                {/* Right Column: Key Coursework Matrix */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e1ede6',
                    borderRadius: '16px',
                    padding: 'clamp(1rem, 2vw, 1.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                    <FileCode2 size={18} color="#10b981" />
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#082015' }}>
                      Key Academic Modules
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#527363', marginBottom: '0.85rem' }}>
                    Curated modules covering wet-lab assays, GIS mapping, and field agronomy:
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {edu.keyCoursework.map((course, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#166534',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <CheckCircle2 size={12} color="#10b981" style={{ flexShrink: 0 }} />
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .edu-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
