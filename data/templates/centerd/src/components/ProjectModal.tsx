'use client';

import React, { useEffect } from 'react';

export interface Project {
  id?: string;
  title: string;
  category?: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  image: string;
  tags?: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '0px',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#f1f1f0',
            border: 'none',
            borderRadius: '0',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#212529',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Category & Title */}
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="badge bg-dark text-white text-uppercase"
              style={{ borderRadius: '0', fontSize: '0.75rem', letterSpacing: '0.08em', padding: '5px 10px' }}
            >
              {project.category}
            </span>
            {project.featured && (
              <span
                className="badge bg-primary text-white text-uppercase"
                style={{ borderRadius: '0', fontSize: '0.75rem', letterSpacing: '0.08em', padding: '5px 10px' }}
              >
                ★ Featured Case Study
              </span>
            )}
          </div>
          <h2 className="fs-2 fw-bold text-dark mb-1">{project.title}</h2>
          <p className="text-muted m-0" style={{ fontSize: '1rem' }}>
            {project.tagline}
          </p>
        </div>

        {/* Project Image */}
        <div
          className="mb-4 overflow-hidden border"
          style={{
            position: 'relative',
            width: '100%',
            height: '340px',
            backgroundColor: '#f8f9fa',
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Project Details & Case Study */}
        <div className="mb-4">
          <h3
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: '0.8rem', letterSpacing: '0.12em' }}
          >
            Project Overview & Impact
          </h3>
          <p className="text-dark" style={{ fontSize: '1.02rem', lineHeight: 1.75 }}>
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Key Metrics */}
        {project.metrics && (
          <div
            className="p-3 bg-light border mb-4 d-flex align-items-center gap-2"
            style={{ borderLeft: '4px solid #ff534a !important' }}
          >
            <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
              🚀 Key Outcome: {project.metrics}
            </span>
          </div>
        )}

        {/* Tech Stack Tags */}
        <div className="mb-4">
          <h3
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: '0.8rem', letterSpacing: '0.12em' }}
          >
            Tech Stack & Tools
          </h3>
          <div className="d-flex flex-wrap gap-2">
            {project.tags?.map((tag, i) => (
              <span
                key={i}
                className="badge bg-light text-dark border"
                style={{ borderRadius: '0', fontSize: '0.8rem', padding: '6px 12px', fontWeight: 500 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3 flex-wrap pt-2 border-top">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark text-uppercase fw-bold px-4 py-3"
              style={{ borderRadius: '0', fontSize: '0.85rem', letterSpacing: '0.05em' }}
            >
              Launch Live App ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark text-uppercase fw-bold px-4 py-3"
              style={{ borderRadius: '0', fontSize: '0.85rem', letterSpacing: '0.05em' }}
            >
              View Repository ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
