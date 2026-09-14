import React from 'react';
import { X, Printer, GraduationCap } from 'lucide-react';
import { studentProfile, educationData, experienceData, certificatesData } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', aboutSummary:'Agricultural Science scholar.', socialLinks:{} };
const _agriEdu = (typeof educationData !== 'undefined' && educationData) || [];
const _agriExp = (typeof experienceData !== 'undefined' && experienceData) || [];
const _agriCerts = (typeof certificatesData !== 'undefined' && certificatesData) || [];

export default function ResumeModal({ isOpen, onClose, data = {} }) {
  if (!isOpen) return null;

  const name = data?.name || data?.fullName || _agriProfile.name;
  const title = data?.title || data?.role || data?.headline || _agriProfile.title;
  const location = data?.location || data?.contact?.location || _agriProfile.location;
  const email = data?.email || data?.contact?.email || _agriProfile.email;
  const phone = data?.phone || data?.contact?.phone || _agriProfile.phone;
  const bio = data?.bio || data?.summary || data?.about || _agriProfile.aboutSummary;
  const education = Array.isArray(data?.education) && data.education.length > 0 ? data.education : _agriEdu;
  const experience = Array.isArray(data?.experience) && data.experience.length > 0 ? data.experience : _agriExp;
  const certificates = Array.isArray(data?.certifications || data?.certificates) && (data?.certifications || data?.certificates).length > 0
    ? (data.certifications || data.certificates)
    : _agriCerts;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="agri-modal-overlay" onClick={onClose}>
      <div
        className="agri-modal-content"
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
              className="agri-btn agri-btn-primary"
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
              {name}
            </h1>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
              {title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
              {location && <span>📍 {location}</span>}
              {email && <span>✉️ {email}</span>}
              {phone && <span>📞 {phone}</span>}
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>
              Executive Summary
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>
              {bio}
            </p>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Academic Degrees & Specialization
            </h2>
            {education.map((edu, idx) => {
              const deg = edu.degree || 'Degree';
              const maj = edu.major || edu.fieldOfStudy || edu.field || '';
              const inst = edu.institution || edu.school || edu.university || '';
              const per = edu.period || edu.year || edu.duration || '';
              const grd = edu.grade || edu.gpa || '';
              const desc = edu.description || (edu.thesis ? `Thesis: ${edu.thesis.title}` : '');

              return (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    <span>{deg}{maj ? ` - ${maj}` : ''}</span>
                    <span style={{ color: '#059669' }}>{per}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' }}>
                    {inst}{grd ? ` • ${grd}` : ''}
                  </div>
                  {desc && (
                    <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                      <em>{desc}</em>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Research & Work Experience */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Research & Professional Experience
            </h2>
            {experience.map((exp, idx) => {
              const role = exp.role || exp.title || 'Position';
              const org = exp.organization || exp.company || exp.institution || '';
              const loc = exp.location || '';
              const per = exp.period || exp.duration || '';
              const desc = exp.description || '';
              const achievements = Array.isArray(exp.achievements) ? exp.achievements : (desc ? [desc] : []);

              return (
                <div key={idx} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    <span>{role}</span>
                    <span style={{ color: '#059669' }}>{per}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
                    {org}{loc ? ` • ${loc}` : ''}
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                    {achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{typeof ach === 'string' ? ach : (ach.text || String(ach))}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Key Accreditations */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#082015', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.3rem', marginBottom: '0.8rem' }}>
              Licenses & Certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {certificates.map((cert, idx) => {
                const title = cert.title || cert.name || 'Certification';
                const issuer = cert.issuer || cert.authority || '';
                const date = cert.issueDate || cert.year || '';

                return (
                  <div key={idx} style={{ fontSize: '0.82rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>{title}</strong>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{issuer}{date ? ` (${date})` : ''}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
