'use client';

import React, { useState } from 'react';
import { certificatesData, CertificateItem } from '@/data/portfolioData';
import { 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="section-padding" style={{ background: '#f0f7f3' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <Award size={16} />
            <span>ACCREDITATIONS & LICENSES</span>
          </div>
          <h2 className="section-title">
            Certifications & Verified Credentials
          </h2>
          <p className="section-description">
            Industry-recognized credentials in commercial drone operations, precision agriculture standards, and sustainable soil stewardship.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid-3">
          {certificatesData.map((cert) => (
            <div
              key={cert.id}
              className="card-white"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                border: '1px solid #d4e8dc',
                padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                position: 'relative',
              }}
            >
              {/* Badge Icon & Issuer */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: '#ecfdf5',
                    border: `1px solid ${cert.badgeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cert.badgeColor,
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <span
                  style={{
                    padding: '0.2rem 0.55rem',
                    background: '#e2f4ea',
                    color: '#15803d',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  VERIFIED
                </span>
              </div>

              {/* Title & Issuer */}
              <h3 style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.15rem)', fontWeight: 800, color: '#082015', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                {cert.title}
              </h3>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#059669', marginBottom: '0.75rem' }}>
                {cert.issuer}
              </div>

              {/* Dates & ID */}
              <div style={{ background: '#f8faf9', padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '0.76rem', color: '#527363', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <span>Issued: <strong>{cert.issueDate}</strong></span>
                  {cert.expiryDate && <span>Expires: <strong>{cert.expiryDate}</strong></span>}
                </div>
                <div style={{ fontFamily: 'monospace', color: '#164e34', fontWeight: 600, wordBreak: 'break-all' }}>
                  ID: {cert.credentialId}
                </div>
              </div>

              {/* Covered Skills */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#082015', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Competencies Tested:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {cert.skillsCovered.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#475569',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '5px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedCert(cert)}
                className="btn btn-secondary"
                style={{
                  marginTop: '1rem',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.8rem',
                  width: '100%',
                  borderRadius: '8px',
                  minHeight: '40px',
                }}
              >
                <FileCheck size={14} />
                <span>View Credential Details</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div
            className="modal-content card-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              borderRadius: '20px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <Award size={28} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              OFFICIAL ACCREDITATION
            </div>
            <h3 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', fontWeight: 800, color: '#082015', marginBottom: '0.35rem' }}>
              {selectedCert.title}
            </h3>
            <p style={{ color: '#527363', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Conferred by <strong>{selectedCert.issuer}</strong>
            </p>

            <div style={{ background: '#f0fdf4', border: '1px dashed #34d399', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', color: '#166534', marginBottom: '0.25rem', wordBreak: 'break-all' }}>
                Credential Identifier: <strong style={{ fontFamily: 'monospace' }}>{selectedCert.credentialId}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#166534', marginBottom: '0.25rem' }}>
                Issued Date: <strong>{selectedCert.issueDate}</strong>
              </div>
              {selectedCert.expiryDate && (
                <div style={{ fontSize: '0.82rem', color: '#166534' }}>
                  Valid Through: <strong>{selectedCert.expiryDate}</strong>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexDirection: 'row' }} className="cert-modal-btns">
              <button
                onClick={() => setSelectedCert(null)}
                className="btn btn-secondary"
                style={{ flex: 1, minHeight: '42px' }}
              >
                Close
              </button>
              {selectedCert.verificationUrl && (
                <a
                  href={selectedCert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, minHeight: '42px' }}
                >
                  <ExternalLink size={15} />
                  <span>Verify Issuer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
