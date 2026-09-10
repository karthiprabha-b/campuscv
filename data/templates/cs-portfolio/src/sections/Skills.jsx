import React from 'react';
import SkillBar from '../components/SkillBar';

export default function Skills({
  skills = [],
  skillsTag = "SKILLS & TECHNOLOGIES",
  skillsTitle = "Technical Stack & Toolkit",
  skillsSubheading = "Programming languages, frameworks, developer tools, and systems I work with."
}) {
  const rawSkills = Array.isArray(skills) ? skills : [];
  if (rawSkills.length === 0) {
    return null;
  }

  // Categorize skills cleanly
  const categorized = {};
  rawSkills.forEach((sk, idx) => {
    const name = typeof sk === 'string' ? sk : (sk.name || sk.title || String(sk));
    const cat = typeof sk === 'object' && sk.category ? sk.category : 'Technical Skills';
    if (!categorized[cat]) {
      categorized[cat] = [];
    }
    categorized[cat].push({
      id: typeof sk === 'object' && sk.id ? sk.id : `sk-${idx}`,
      name
    });
  });

  const categories = Object.keys(categorized);

  return (
    <section 
      id="skills" 
      data-cv-section="skills" 
      className="section"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
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
            data-cv="skills.eyebrow"
          >
            {skillsTag}
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
            data-cv="skills.title"
          >
            {skillsTitle}
          </h2>
          <p 
            style={{
              fontSize: '1rem',
              color: '#475569',
              maxWidth: '42rem',
              margin: '0 auto',
              lineHeight: 1.6
            }}
            data-cv="skills.description"
          >
            {skillsSubheading}
          </p>
        </div>

        {/* Categorized Skills Grid */}
        {categories.length > 1 ? (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
            data-cv-collection="skills"
          >
            {categories.map((catName) => (
              <div 
                key={catName}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <h3 
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
                  {catName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categorized[catName].map((sk) => (
                    <span
                      key={sk.id}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono, monospace)',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single list pills */
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              maxWidth: '900px',
              margin: '0 auto'
            }}
            data-cv-collection="skills"
          >
            {rawSkills.map((sk, idx) => {
              const name = typeof sk === 'string' ? sk : (sk.name || sk.title || String(sk));
              return (
                <span
                  key={typeof sk === 'object' && sk.id ? sk.id : `sk-${idx}`}
                  style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono, monospace)',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
