import React from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2, FileCode2, Building2, MapPin } from 'lucide-react';
import { educationData } from '../data/agriDefaults.js';
const _agriEdu = (typeof educationData !== 'undefined' && educationData) || [];

export default function Education({ data = {} }) {
  const education = Array.isArray(data?.education) && data.education.length > 0 
    ? data.education 
    : _agriEdu;

  const sectionTitle = data?.educationSection?.title || 'Education & Research Specialization';
  const sectionDescription = data?.educationSection?.description || 'Rigorous scientific training encompassing soil physics, molecular plant pathology, precision geospatial mapping, and automated agro-meteorology.';

  return (
    <section id="education" className="agri-section-padding" style={{ background: '#f0f7f3' }}>
      <div className="agri-container">
        {/* Section Header */}
        <div className="agri-section-header">
          <div className="agri-badge-pill">
            <GraduationCap size={16} />
            <span>ACADEMIC FOUNDATIONS</span>
          </div>
          <h2 className="agri-section-title">
            {sectionTitle}
          </h2>
          <p className="agri-section-description">
            {sectionDescription}
          </p>
        </div>

        {/* Education Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {education.map((edu, index) => {
            const degree = edu.degree || 'Degree';
            const major = edu.major || edu.fieldOfStudy || edu.field || '';
            const institution = edu.institution || edu.school || edu.university || 'University';
            const location = edu.location || 'Campus';
            const period = edu.period || edu.year || edu.duration || '';
            const grade = edu.grade || edu.gpa || 'Academic Distinction';
            const honors = Array.isArray(edu.honors) ? edu.honors : ["Dean's Distinguished Honor List", "Merit Scholar"];
            const thesis = edu.thesis || {
              title: edu.description || 'Specialized research and field methodologies',
              advisor: 'Academic Advisory Committee',
              description: edu.description || 'Comprehensive coursework and practical field trial execution.'
            };
            const coursework = Array.isArray(edu.keyCoursework) ? edu.keyCoursework : (Array.isArray(edu.courses) ? edu.courses : [
              "Precision Agriculture & GIS Mapping",
              "Crop Physiology & Nutrition",
              "Soil Physics, Chemistry & Microbiology",
              "Plant Pathology & Pest Management",
              "Agri-Robotics & Embedded Telemetry",
              "Agricultural Experimental Design"
            ]);

            return (
              <div
                key={index}
                className="agri-card-white"
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
                      ? 'linear-gradient(90deg, var(--primary, #10b981) 0%, var(--primary, #a3e635) 100%)'
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
                      {period && (
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
                          {period}
                        </div>
                      )}
                      {grade && (
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
                          {grade}
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#082015', marginBottom: '0.3rem' }}>
                      {degree}
                    </h3>
                    {major && (
                      <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 600, color: 'var(--primary, #059669)', marginBottom: '0.75rem' }}>
                        {major}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', color: '#527363', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                      {institution && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building2 size={15} style={{ color: 'var(--primary, #10b981)' }} />
                          <span>{institution}</span>
                        </div>
                      )}
                      {location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={15} style={{ color: 'var(--primary, #10b981)' }} />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>

                    {/* Honors & Distinctions List */}
                    {honors.length > 0 && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                          Honors & Distinctions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {honors.map((honor, hIdx) => (
                            <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.86rem', color: '#164e34' }}>
                              <Award size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{typeof honor === 'string' ? honor : (honor.title || String(honor))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Thesis Box */}
                    {thesis && thesis.title && (
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
                          {thesis.title}
                        </h4>
                        {thesis.description && (
                          <p style={{ fontSize: '0.84rem', color: '#527363', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                            {thesis.description}
                          </p>
                        )}
                        {thesis.advisor && (
                          <div style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 600 }}>
                            Advisor: {thesis.advisor}
                          </div>
                        )}
                      </div>
                    )}
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
                      <FileCode2 size={18} style={{ color: 'var(--primary, #10b981)' }} />
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#082015' }}>
                        Key Academic Modules
                      </h4>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#527363', marginBottom: '0.85rem' }}>
                      Curated modules covering wet-lab assays, GIS mapping, and field agronomy:
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {coursework.map((course, cIdx) => (
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
                          <CheckCircle2 size={12} style={{ flexShrink: 0, color: 'var(--primary, #10b981)' }} />
                          <span>{typeof course === 'string' ? course : (course.name || course.title || String(course))}</span>
                        </div>
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
