import React, { useState } from 'react';

const DEFAULT_COVER_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop", // Systems / DB
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // AI / Neural
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop", // Web / Dev
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", // Automation
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop", // Lead / Scraping
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"  // Games / Canvas
];

export default function Projects(props = {}) {
  const data = props?.data || props || {};
  const rawProjects = Array.isArray(data.projects)
    ? data.projects
    : (Array.isArray(data.projects?.items)
      ? data.projects.items
      : (Array.isArray(data.data?.projects)
        ? data.data.projects
        : (Array.isArray(data.portfolioProjects)
          ? data.portfolioProjects
          : (Array.isArray(data.works)
            ? data.works
            : (Array.isArray(props.projects) ? props.projects : [])))));

  const activeProjects = Array.isArray(rawProjects) ? rawProjects : [];
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.map(t => typeof t === 'string' ? t : (t?.name || t?.title || String(t)));
    }
    if (typeof tags === 'string') {
      return tags.split(/[,|•;]/).map(t => t.trim()).filter(Boolean);
    }
    return [];
  };

  const getCategory = (proj, idx) => {
    if (proj.category && typeof proj.category === 'string' && proj.category.trim()) {
      return proj.category.trim();
    }
    const title = (proj.title || proj.name || '').toLowerCase();
    const desc = (proj.description || proj.desc || '').toLowerCase();
    const tags = parseTags(proj.technologies || proj.tags || []).map(t => t.toLowerCase());

    if (title.includes('ai') || title.includes('llm') || title.includes('vision') || title.includes('neural') || desc.includes('ai') || desc.includes('model') || tags.some(t => t.includes('ai') || t.includes('python') || t.includes('openai') || t.includes('fastapi'))) {
      return 'AI';
    }
    if (title.includes('system') || title.includes('kv') || title.includes('database') || title.includes('server') || desc.includes('distributed') || tags.some(t => t.includes('c++') || t.includes('rust') || t.includes('grpc') || t.includes('redis') || t.includes('postgres'))) {
      return 'Systems';
    }
    if (title.includes('web') || title.includes('saas') || title.includes('ide') || title.includes('app') || title.includes('campaign') || tags.some(t => t.includes('react') || t.includes('next.js') || t.includes('node') || t.includes('typescript') || t.includes('javascript'))) {
      return 'Web';
    }
    return idx % 3 === 0 ? 'Systems' : idx % 3 === 1 ? 'AI' : 'Web';
  };

  const categoriesList = activeProjects.map((p, idx) => getCategory(p, idx));
  const uniqueCategories = Array.from(new Set(categoriesList.filter(Boolean)));

  const filterTabs = uniqueCategories.length > 1
    ? ['All Projects', ...uniqueCategories]
    : [];

  const filteredProjects = activeProjects.filter((proj, idx) => {
    if (filterCategory === 'all' || filterCategory === 'All Projects') return true;
    const cat = getCategory(proj, idx);
    return cat.toLowerCase() === filterCategory.toLowerCase();
  });

  if (activeProjects.length === 0) {
    return null;
  }

  return (
    <section 
      id="projects" 
      data-cv-section="projects" 
      className="section"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid #e2e8f0',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            data-cv="projects.eyebrow"
          >
            PORTFOLIO WORK
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
            data-cv="projects.title"
          >
            Featured Engineering Projects
          </h2>
          <p 
            style={{
              fontSize: '1rem',
              color: '#475569',
              maxWidth: '42rem',
              margin: '0 auto',
              lineHeight: 1.6
            }}
            data-cv="projects.description"
          >
            Selected open-source systems, AI applications, and full-stack software built for high performance.
          </p>
        </div>

        {/* Filter Pills */}
        {filterTabs.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {filterTabs.map(tab => {
              const isActive = (tab === 'All Projects' && (filterCategory === 'all' || filterCategory === 'All Projects')) ||
                filterCategory.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  onClick={() => setFilterCategory(tab === 'All Projects' ? 'all' : tab)}
                  style={{
                    padding: '0.45rem 1.15rem',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#2563eb' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    border: `1px solid ${isActive ? '#2563eb' : '#e2e8f0'}`,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
          data-cv-collection="projects"
        >
          {filteredProjects.map((proj, idx) => {
            const tags = parseTags(proj.technologies || proj.tags || proj.stack);
            const title = proj.title || proj.name || `Project ${idx + 1}`;
            const desc = proj.description || proj.desc || proj.summary || '';
            const githubUrl = proj.githubUrl || proj.github || proj.link || '';
            const liveUrl = proj.liveUrl || proj.demo || proj.url || '';
            const category = getCategory(proj, idx);
            const image = proj.image || proj.imageUrl || proj.thumbnail || DEFAULT_COVER_IMAGES[idx % DEFAULT_COVER_IMAGES.length];

            return (
              <div
                key={proj.id || proj.key || `proj-${idx}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                className="project-card"
                data-cv-item={`projects[${idx}]`}
              >
                {/* Top Cover Image */}
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                  <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    data-cv={`projects[${idx}].image`}
                  />
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  {/* Category meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span 
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        color: '#2563eb',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono, monospace)' }}>
                      Project
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.5rem',
                      lineHeight: 1.35
                    }}
                    data-cv={`projects[${idx}].title`}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  {desc && (
                    <p 
                      style={{
                        fontSize: '0.875rem',
                        color: '#475569',
                        lineHeight: 1.6,
                        marginBottom: '1.25rem',
                        flexGrow: 1
                      }}
                      data-cv={`projects[${idx}].description`}
                    >
                      {desc}
                    </p>
                  )}

                  {/* Tech Stack Badges */}
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          style={{
                            fontFamily: 'var(--font-mono, monospace)',
                            fontSize: '0.725rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.375rem',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Action Row */}
                  <div 
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e2e8f0'
                    }}
                  >
                    <button
                      onClick={() => setSelectedProject({ ...proj, category, image, tags })}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#334155',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                    >
                      Technical Details →
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          style={{
                            width: '2.1rem',
                            height: '2.1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#475569',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}

                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="GitHub Repository"
                          style={{
                            width: '2.1rem',
                            height: '2.1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#475569',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Deep-Dive Modal */}
      {selectedProject && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1.25rem',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span 
                  style={{
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    color: '#2563eb',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}
                >
                  {selectedProject.category}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedProject.title || selectedProject.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '0.5rem',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {selectedProject.image && (
              <div style={{ width: '100%', height: '220px', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <img src={selectedProject.image} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {selectedProject.description || selectedProject.desc}
            </p>

            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
                  Technologies & Libraries
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedProject.tags.map((t, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '0.375rem',
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 600
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              {selectedProject.githubUrl && (
                <a 
                  href={selectedProject.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem' }}
                >
                  GitHub Code →
                </a>
              )}
              {selectedProject.liveUrl && (
                <a 
                  href={selectedProject.liveUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Live Project ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
