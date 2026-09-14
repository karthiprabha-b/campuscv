'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '@/data/portfolioData';
import { 
  X, 
  ExternalLink, 
  Github, 
  FileText, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(4, 19, 12, 0.4)',
          border: '1px solid #d4e8dc',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            background: 'rgba(4, 19, 12, 0.75)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Banner Header */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(180px, 30vw, 260px)',
            background: '#0a2318',
            overflow: 'hidden',
          }}
        >
          <Image
            src={
              project.id === 'proj-1'
                ? '/images/drone-farm.jpg'
                : project.id === 'proj-3'
                ? '/images/smart-robot.jpg'
                : '/images/hero-agri.jpg'
            }
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(4, 19, 12, 0.92) 0%, rgba(4, 19, 12, 0.35) 60%, transparent 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: 'clamp(1rem, 3vw, 1.75rem)',
              right: 'clamp(1rem, 3vw, 1.75rem)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.7rem',
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.35rem',
                textTransform: 'uppercase',
              }}
            >
              {project.category}
            </span>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.55rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
            className="modal-metrics-grid"
          >
            {project.metrics.map((m, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', fontWeight: 900, color: '#047857' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600, marginTop: '0.15rem' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Project Summary */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015', marginBottom: '0.4rem' }}>
              Project Overview & Problem Statement
            </h3>
            <p style={{ color: '#4b6356', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {project.summary}
            </p>
          </div>

          {/* Technical Innovations */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015', marginBottom: '0.6rem' }}>
              Key Technical Innovations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.features.map((feat, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#164e34' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Results */}
          <div
            style={{
              background: '#082015',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(163, 230, 53, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              <TrendingUp size={15} />
              <span>Agronomic Impact & Trial Outcome</span>
            </div>
            <p style={{ color: '#d1fae5', fontSize: '0.9rem', lineHeight: 1.55 }}>
              {project.results}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Applied Technologies & Toolchain
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {project.technologies.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }} className="modal-actions-wrap">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
              >
                <Github size={16} />
                <span>Source Code</span>
              </a>
            )}
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
              >
                <FileText size={16} />
                <span>Read Publication</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lime"
                style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
              >
                <ExternalLink size={16} />
                <span>Interactive Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .modal-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .modal-actions-wrap > a {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
