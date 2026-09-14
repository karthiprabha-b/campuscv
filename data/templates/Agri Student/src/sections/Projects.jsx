import React, { useState } from 'react';
import { FolderKanban, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/agriDefaults.js';
const _agriProjects = (typeof projectsData !== 'undefined' && projectsData) || [];
import ProjectModal from '../components/ProjectModal';

export default function Projects({ data = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const rawProjects = Array.isArray(data?.projects) && data.projects.length > 0 
    ? data.projects 
    : _agriProjects;

  const projectImages = [
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  ];

  const projectList = rawProjects.map((p, idx) => ({
    id: p.id || `proj-${idx}`,
    title: p.title || 'AgriTech Innovation Project',
    category: p.category || (idx % 2 === 0 ? 'AgriTech & IoT' : 'Crop & Soil Science'),
    tagline: p.tagline || p.subtitle || 'Precision farming & field trial methodology',
    summary: p.summary || p.description || 'Application of modern sensors and agronomic principles to maximize crop sustainability.',
    image: p.image || p.coverImage || projectImages[idx % projectImages.length],
    metrics: Array.isArray(p.metrics) && p.metrics.length > 0 
      ? p.metrics 
      : [{ label: 'Efficiency', value: '+28%' }, { label: 'Trial Scope', value: 'Validated' }],
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['Precision Ag', 'Field Trial', 'Agronomy'],
    features: Array.isArray(p.features) ? p.features : [p.tagline || 'Data-driven crop telemetry and field analysis'],
    results: p.results || p.impact || 'Demonstrated positive yield response and reduced resource waste.',
    technologies: Array.isArray(p.technologies) ? p.technologies : ['QGIS', 'Drone GIS', 'Soil IoT'],
    githubUrl: p.githubUrl || p.github,
    paperUrl: p.paperUrl || p.paper || p.publicationUrl,
    liveUrl: p.liveUrl || p.link || p.url
  }));

  const allCategories = ['All', ...Array.from(new Set(projectList.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = selectedCategory === 'All'
    ? projectList
    : projectList.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="agri-section-padding" style={{ background: '#f8faf9', position: 'relative' }}>
      <div className="agri-container">
        {/* Section Header */}
        <div className="agri-section-header">
          <div className="agri-badge-pill">
            <FolderKanban size={16} />
            <span>RESEARCH & INNOVATION PORTFOLIO</span>
          </div>
          <h2 className="agri-section-title">
            AgriTech Projects & Field Innovations
          </h2>
          <p className="agri-section-description">
            From autonomous multispectral drone pipelines to solar-powered soil LoRa meshes and AI-based foliar pathogen vision.
          </p>

          {/* Filter Categories */}
          <div className="agri-filter-bar" style={{ marginTop: '1.75rem' }}>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedCategory === cat ? '1px solid #059669' : '1px solid #d4e8dc',
                  background: selectedCategory === cat ? '#082015' : '#ffffff',
                  color: selectedCategory === cat ? '#a3e635' : '#334e40',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(8, 32, 21, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="agri-grid-3">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              className="agri-card-white"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid #e1ede6',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setActiveModalProject(project)}
            >
              {/* Card Image Banner */}
              <div
                style={{
                  position: 'relative',
                  height: '190px',
                  width: '100%',
                  background: '#0a2318',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  data-node-id={`image:projects:card:${idx}:img:0`}
                  data-edit-key={`projects.${idx}.image`}
                  data-cv={`projects.items[${idx}].image`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Category Badge overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    background: 'rgba(8, 32, 21, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    color: '#a3e635',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {project.category}
                </div>

                {/* Hover Details Prompt */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--campuscv-accent, #10b981)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  <ArrowUpRight size={17} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: 'clamp(1.2rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  style={{
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.22rem)',
                    fontWeight: 800,
                    color: '#082015',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3,
                  }}
                >
                  {project.title.split(':')[0]}
                </h3>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#059669',
                    fontWeight: 600,
                    marginBottom: '0.6rem',
                  }}
                >
                  {project.tagline}
                </p>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#527363',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.summary}
                </p>

                {/* Key Metric Highlight Box */}
                {project.metrics.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(project.metrics.length, 2)}, 1fr)`,
                      gap: '0.4rem',
                      background: '#f0fdf4',
                      border: '1px solid #d1fae5',
                      borderRadius: '10px',
                      padding: '0.65rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {project.metrics.slice(0, 2).map((m, idx) => (
                      <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857' }}>
                          {m.value}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}
                    >
                      #{typeof tag === 'string' ? tag : (tag.name || String(tag))}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', alignSelf: 'center' }}>
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-dive Project Details Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
}
