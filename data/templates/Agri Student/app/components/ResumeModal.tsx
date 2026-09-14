'use client';

import React from 'react';
import { studentProfile, educationData, experienceData, skillCategories, certificatesData } from '@/data/portfolioData';
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '880px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(4, 19, 12, 0.4)',
          border: '1px solid #d4e8dc',
        }}
      >
        {/* Modal Top Action Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #e2e8f0',
            padding: '1rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 800, fontSize: '0.95rem' }}>
            <GraduationCap size={20} />
            <span>Academic Curriculum Vitae Preview</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CV Document Sheet */}
        <div style={{ padding: '2.5rem', color: '#1e293b' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid #10b981', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#082015', marginBottom: '0.3rem' }}>
              {studentProfile.name}
            </h1>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
              {studentProfile.title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>📍 {studentProfile.location}</span>
              <span>✉️ {studentProfile.email}</span>
              <span>📞 {studentProfile.phone}</span>
              <span>🌐 GPA: <strong>{studentProfile.gpa}</strong></span>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>
              Executive Summary
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>
              {studentProfile.aboutSummary}
            </p>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Academic Degrees & Honors
            </h2>
            {educationData.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  <span>{edu.degree} - {edu.major}</span>
                  <span style={{ color: '#059669' }}>{edu.period}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' }}>
                  {edu.institution}, {edu.location} • <strong>{edu.grade}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                  <em>Thesis: {edu.thesis.title}</em> (Advisor: {edu.thesis.advisor})
                </div>
              </div>
            ))}
          </div>

          {/* Research & Work Experience */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Research & Professional Experience
            </h2>
            {experienceData.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  <span>{exp.role}</span>
                  <span style={{ color: '#059669' }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
                  {exp.organization} • {exp.location}
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                  {exp.achievements.map((ach, aIdx) => (
                    <li key={aIdx}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Key Accreditations */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Licenses & Certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {certificatesData.map((cert) => (
                <div key={cert.id} style={{ fontSize: '0.82rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>{cert.title}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{cert.issuer} ({cert.issueDate})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
