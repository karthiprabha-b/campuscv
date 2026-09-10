import React from 'react';

export default function Education(props = {}) {
  const data = props?.data || props || {};
  const educationList = (Array.isArray(props.education) && props.education.length > 0)
    ? props.education
    : (Array.isArray(data.education) && data.education.length > 0
        ? data.education
        : (Array.isArray(data.academics) && data.academics.length > 0
            ? data.academics
            : (Array.isArray(data.educationList) && data.educationList.length > 0
                ? data.educationList
                : [])));

  if (educationList.length === 0) {
    return null;
  }

  const sectionTag = data.educationTag || data.educationEyebrow || "ACADEMICS & DEGREES";
  const sectionTitle = data.educationTitle || data.educationHeading || "Education & Background";
  const sectionDescription = data.educationDescription || data.educationSubtitle || "Academic credentials, degrees, and foundational coursework.";

  return (
    <section 
      id="education" 
      data-cv-section="education" 
      className="section"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              color: '#2563eb',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}
            data-cv="education.eyebrow"
          >
            {sectionTag}
          </span>
          <h2 
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '0.75rem',
              lineHeight: 1.2
            }}
            data-cv="education.title"
          >
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p 
              style={{
                fontSize: '1rem',
                color: '#475569',
                maxWidth: '42rem',
                margin: '0 auto',
                lineHeight: 1.6
              }}
              data-cv="education.description"
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Full-Detail Education Cards List */}
        <div 
          className="education-list" 
          data-cv-collection="education"
          style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {educationList.map((edu, idx) => {
            const degree = edu.degree || edu.title || edu.qualification || "Degree Program";
            const school = edu.school || edu.institution || edu.university || edu.college || "";
            const fieldOfStudy = edu.fieldOfStudy || edu.department || edu.specialization || edu.major || "";
            
            const start = String(edu.startYear || edu.startDate || edu.from || '').trim();
            const end = String(edu.endYear || edu.endDate || edu.to || (edu.current ? 'Present' : '')).trim();
            let duration = String(edu.duration || edu.period || edu.year || '').trim();
            if (!duration && start && end && start !== end) {
              duration = `${start} – ${end}`;
            } else if (!duration && start) {
              duration = edu.current ? `${start} – Present` : start;
            } else if (!duration && end) {
              duration = end;
            }

            const gpa = edu.cgpa || edu.gpa || edu.grade || "";
            const description = edu.description || edu.desc || edu.details || edu.summary || "";
            const bullets = Array.isArray(edu.bullets) && edu.bullets.length > 0
              ? edu.bullets
              : (Array.isArray(edu.highlights) && edu.highlights.length > 0
                  ? edu.highlights
                  : (Array.isArray(edu.courses) && edu.courses.length > 0 ? edu.courses : []));

            return (
              <div 
                key={edu.id || edu.key || `edu-${idx}`}
                data-cv-item={`education[${idx}]`}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Top Row: Degree & Date */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        lineHeight: 1.3
                      }}
                    >
                      <span data-cv={`education[${idx}].degree`}>{degree}</span>
                      {school && (
                        <span style={{ color: '#2563eb', fontWeight: 700 }}>
                          {' '}@ <span data-cv={`education[${idx}].institution`}>{school}</span>
                        </span>
                      )}
                    </h3>

                    {fieldOfStudy && (
                      <p 
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#475569',
                          marginTop: '0.25rem',
                          marginBottom: 0
                        }}
                      >
                        <span data-cv={`education[${idx}].fieldOfStudy`}>{fieldOfStudy}</span>
                      </p>
                    )}
                  </div>

                  {duration && (
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}
                      data-cv={`education[${idx}].duration`}
                    >
                      {duration}
                    </span>
                  )}
                </div>

                {/* GPA & Specialization Tag */}
                {gpa && (
                  <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '0.825rem', color: '#64748b' }}>
                    <span>Academic Score: </span>
                    <strong style={{ color: '#0f172a' }} data-cv={`education[${idx}].gpa`}>{gpa}</strong>
                  </div>
                )}

                {/* Description Text */}
                {description && (
                  <p 
                    style={{
                      fontSize: '0.9rem',
                      color: '#334155',
                      lineHeight: 1.65,
                      marginTop: '0.75rem',
                      marginBottom: bullets.length > 0 ? '0.75rem' : 0
                    }}
                    data-cv={`education[${idx}].description`}
                  >
                    {description}
                  </p>
                )}

                {/* Coursework / Highlight Bullets */}
                {bullets && bullets.length > 0 && (
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                    {bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '0.35rem' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
