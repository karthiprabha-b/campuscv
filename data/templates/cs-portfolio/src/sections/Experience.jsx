import React from 'react';

export default function Experience(props = {}) {
  const data = props?.data || props || {};
  const activeExperience = (Array.isArray(props.experience) && props.experience.length > 0)
    ? props.experience
    : (Array.isArray(data.experience) && data.experience.length > 0
        ? data.experience
        : (Array.isArray(data.workExperience) && data.workExperience.length > 0
            ? data.workExperience
            : (Array.isArray(data.work) && data.work.length > 0
                ? data.work
                : (Array.isArray(data.timeline) && data.timeline.length > 0
                    ? data.timeline
                    : []))));

  if (activeExperience.length === 0) {
    return null;
  }

  const sectionTag = data.experienceTag || data.experienceEyebrow || "CAREER & EXPERIENCE";
  const sectionTitle = data.experienceTitle || data.experienceHeading || "Work History & Roles";
  const sectionDescription = data.experienceDescription || data.experienceSubtitle || "Professional experience, engineering internships, and leadership roles.";

  return (
    <section 
      id="experience" 
      data-cv-section="experience" 
      className="section"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
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
            data-cv="experience.eyebrow"
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
            data-cv="experience.title"
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
              data-cv="experience.description"
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Full Details Experience List */}
        <div 
          className="experience-list" 
          data-cv-collection="experience"
          style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {activeExperience.map((exp, idx) => {
            const role = exp.role || exp.title || exp.position || exp.designation || "Software Developer";
            const company = exp.company || exp.employer || exp.organization || exp.institution || "";
            const location = exp.location || exp.city || "";
            
            const start = String(exp.startDate || exp.startYear || exp.start || exp.from || '').trim();
            const end = String(exp.endDate || exp.endYear || exp.end || exp.to || (exp.current ? 'Present' : '')).trim();
            let duration = String(exp.duration || exp.period || exp.year || '').trim();
            if (!duration && start && end && start !== end) {
              duration = `${start} – ${end}`;
            } else if (!duration && start) {
              duration = exp.current ? `${start} – Present` : start;
            } else if (!duration && end) {
              duration = end;
            }

            const description = exp.description || exp.desc || exp.summary || exp.details || "";
            const bullets = Array.isArray(exp.bullets) && exp.bullets.length > 0 
              ? exp.bullets 
              : (Array.isArray(exp.achievements) && exp.achievements.length > 0
                  ? exp.achievements
                  : (Array.isArray(exp.highlights) && exp.highlights.length > 0 
                      ? exp.highlights 
                      : (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? exp.responsibilities : [])));

            return (
              <div 
                key={exp.id || exp.key || `exp-${idx}`}
                data-cv-item={`experience[${idx}]`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header Row: Role & Duration */}
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
                      <span data-cv={`experience[${idx}].role`}>{role}</span>
                      {company && (
                        <span style={{ color: '#2563eb', fontWeight: 700 }}>
                          {' '}@ <span data-cv={`experience[${idx}].company`}>{company}</span>
                        </span>
                      )}
                    </h3>

                    {location && (
                      <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.25rem', marginBottom: 0 }}>
                        📍 <span data-cv={`experience[${idx}].location`}>{location}</span>
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
                      data-cv={`experience[${idx}].duration`}
                    >
                      {duration}
                    </span>
                  )}
                </div>

                {/* Description Narrative */}
                {description && (
                  <p 
                    style={{
                      fontSize: '0.9rem',
                      color: '#334155',
                      lineHeight: 1.65,
                      marginTop: '0.75rem',
                      marginBottom: bullets.length > 0 ? '0.75rem' : 0
                    }}
                    data-cv={`experience[${idx}].description`}
                  >
                    {description}
                  </p>
                )}

                {/* Highlights / Responsibilities Bullets */}
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
