import React from 'react';

export default function Certifications(props = {}) {
  const data = props?.data || props || {};
  const certList = (Array.isArray(props.certifications) && props.certifications.length > 0)
    ? props.certifications
    : (Array.isArray(data.certifications) && data.certifications.length > 0
        ? data.certifications
        : (Array.isArray(data.certificates) && data.certificates.length > 0
            ? data.certificates
            : (Array.isArray(data.awards) && data.awards.length > 0
                ? data.awards
                : (Array.isArray(data.credentials) && data.credentials.length > 0
                    ? data.credentials
                    : []))));

  if (certList.length === 0) {
    return null;
  }

  const sectionTag = data.certificationsTag || data.certificationsEyebrow || "CREDENTIALS & VERIFICATIONS";
  const sectionTitle = data.certificationsTitle || data.certificationsHeading || "Licenses & Certifications";
  const sectionDescription = data.certificationsDescription || data.certificationsSubtitle || "Professional certificates, verified exams, and specialized coursework.";

  return (
    <section 
      id="certifications" 
      data-cv-section="certifications" 
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
            data-cv="certifications.eyebrow"
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
            data-cv="certifications.title"
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
              data-cv="certifications.description"
            >
              {sectionDescription}
            </p>
          )}
        </div>

        {/* Certifications Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1080px',
            margin: '0 auto'
          }}
          data-cv-collection="certifications"
        >
          {certList.map((cert, idx) => {
            const title = cert.title || cert.name || cert.certificateName || "Certified Professional";
            const issuer = cert.issuer || cert.organization || cert.authority || cert.institution || cert.provider || "";
            const issueDate = cert.issueDate || cert.date || cert.year || cert.period || "";
            const credentialId = cert.credentialId || cert.id || cert.licenseNumber || "";
            const link = cert.link || cert.url || cert.verifyUrl || cert.credentialUrl || "";

            return (
              <div 
                key={cert.id || `cert-${idx}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      📜
                    </div>
                    {issueDate && (
                      <span 
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontWeight: 600
                        }}
                        data-cv={`certifications[${idx}].issueDate`}
                      >
                        {issueDate}
                      </span>
                    )}
                  </div>

                  <h3 
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '0.35rem',
                      lineHeight: 1.3
                    }}
                    data-cv={`certifications[${idx}].title`}
                  >
                    {title}
                  </h3>

                  {issuer && (
                    <p 
                      style={{
                        fontSize: '0.875rem',
                        color: '#2563eb',
                        fontWeight: 600,
                        marginBottom: '0.5rem'
                      }}
                      data-cv={`certifications[${idx}].issuer`}
                    >
                      {issuer}
                    </p>
                  )}

                  {credentialId && (
                    <p 
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono, monospace)',
                        color: '#94a3b8',
                        marginTop: '0.25rem'
                      }}
                    >
                      ID: <span data-cv={`certifications[${idx}].credentialId`}>{credentialId}</span>
                    </p>
                  )}

                  {(cert.description || cert.desc) && (
                    <p 
                      style={{
                        fontSize: '0.85rem',
                        color: '#475569',
                        lineHeight: 1.55,
                        marginTop: '0.65rem'
                      }}
                      data-cv={`certifications[${idx}].description`}
                    >
                      {cert.description || cert.desc}
                    </p>
                  )}
                </div>

                {link && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#2563eb',
                        textDecoration: 'none'
                      }}
                    >
                      Verify Credential ↗
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
