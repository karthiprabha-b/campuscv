'use client';

import React from 'react';
import TextFx from './TextFx';

interface CertificatesProps {
  data?: any;
}

export default function Certificates({ data = {} }: CertificatesProps) {
  const certSection = data?.certificates || data?.certifications || {};
  const eyebrow = certSection?.eyebrow || 'CREDENTIALS & HONORS';
  const title = certSection?.title || 'Certifications';
  const description = certSection?.description || 'Industry-verified credentials verifying proficiency in UX architecture, modern frontend frameworks, and cloud systems.';

  const defaultCertificates = [
    {
      id: "cert-1",
      title: "Google UX Design Professional Certificate",
      issuer: "Google",
      issueDate: "Jan 2024",
      credentialId: "G-UX-892401-ST",
      verifyUrl: "https://coursera.org/verify/google-ux",
      badge: "Google Certified",
      skillsCovered: ["User Research", "Wireframing", "Figma Systems", "Inclusive Design", "Usability Studies"]
    },
    {
      id: "cert-2",
      title: "Meta Certified Frontend Developer Professional",
      issuer: "Meta",
      issueDate: "Aug 2023",
      credentialId: "META-FE-99321-JS",
      verifyUrl: "https://coursera.org/verify/meta-frontend",
      badge: "Meta Certified",
      skillsCovered: ["React Deep-Dive", "Advanced JavaScript", "Web Optimization", "UI Testing", "State Architecture"]
    },
    {
      id: "cert-3",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "Nov 2023",
      credentialId: "AWS-CCP-440219-01",
      verifyUrl: "https://aws.amazon.com/verification",
      badge: "AWS Certified",
      skillsCovered: ["Cloud Infrastructure", "Security & IAM", "Serverless Architecture", "Edge CDN Deployments"]
    },
    {
      id: "cert-4",
      title: "Figma Advanced Design Systems Master",
      issuer: "Figma Academy",
      issueDate: "May 2024",
      credentialId: "FDM-90812-JULIA",
      verifyUrl: "https://figma.com/education",
      badge: "Design Master",
      skillsCovered: ["Design Tokens", "Multi-brand Modes", "Component Libraries", "Variable Typography", "Handoff"]
    }
  ];

  const rawCertificates = (Array.isArray(data?.certificates) && data.certificates.length > 0)
    ? data.certificates
    : (Array.isArray(data?.certifications) && data.certifications.length > 0)
      ? data.certifications
      : (Array.isArray(certSection?.items) && certSection.items.length > 0)
        ? certSection.items
        : defaultCertificates;

  const certificates = (Array.isArray(rawCertificates) && rawCertificates.length > 0 ? rawCertificates : defaultCertificates).map((cert: any, idx: number) => {
    if (typeof cert === 'string') {
      return {
        id: `cert-${idx}`,
        title: cert,
        issuer: 'Issuing Authority',
        issueDate: '2024',
        credentialId: `ID-00${idx + 1}`,
        verifyUrl: '#',
        badge: 'Verified Credential',
        skillsCovered: []
      };
    }
    let skillsCovered: string[] = [];
    if (Array.isArray(cert?.skillsCovered)) skillsCovered = cert.skillsCovered.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));
    else if (Array.isArray(cert?.skills)) skillsCovered = cert.skills.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));
    else if (Array.isArray(cert?.tags)) skillsCovered = cert.tags.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));

    return {
      id: cert?.id || `cert-${idx}`,
      title: cert?.title || cert?.name || 'Certification Name',
      issuer: cert?.issuer || cert?.organization || cert?.authority || 'Issuing Authority',
      issueDate: cert?.issueDate || cert?.date || cert?.year || '2024',
      credentialId: cert?.credentialId || cert?.id || `ID-00${idx + 1}`,
      verifyUrl: cert?.verifyUrl || cert?.url || cert?.link || '#',
      badge: cert?.badge || 'Verified Credential',
      skillsCovered
    };
  });

  return (
    <section
      id="certificates"
      data-cv-section="certificates"
      data-node-id="section:certifications:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="07"
    >
      {/* Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 reveal-on-scroll">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="certifications.eyebrow"
            data-edit-key="certifications.eyebrow"
            data-node-id="text:certifications:eyebrow:0"
            data-node-type="text"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="certifications.title"
            data-edit-key="certifications.title"
            data-node-id="text:certifications:title:0"
            data-node-type="text"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="certifications.description"
            data-edit-key="certifications.description"
            data-node-id="text:certifications:description:0"
            data-node-type="text"
            style={{ fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-4" data-cv-collection="certificates">
        {certificates.map((cert: any, idx: number) => (
          <div
            key={cert.id || idx}
            className={`col-lg-6 reveal-on-scroll reveal-delay-${(idx % 2) + 1}`}
            data-cv={`certificates[${idx}]`}
            data-cv-item={`certificates[${idx}]`}
            data-node-id={`container:certificates:card:${idx}`}
            data-node-type="container"
          >
            <div className="p-4 p-xl-5 bg-white border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge bg-dark text-white text-uppercase"
                    data-cv={`certificates[${idx}].badge`}
                    data-edit-key={`certificates.${idx}.badge`}
                    data-node-id={`text:certificates:card:${idx}:badge:0`}
                    data-node-type="text"
                    style={{ borderRadius: '0', fontSize: '0.72rem', padding: '6px 12px' }}
                  >
                    {cert.badge}
                  </span>
                  <span
                    className="text-muted"
                    data-cv={`certificates[${idx}].date`}
                    data-edit-key={`certificates.${idx}.date`}
                    data-node-id={`text:certificates:card:${idx}:date:0`}
                    data-node-type="text"
                    style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                  >
                    {cert.issueDate}
                  </span>
                </div>

                <h3
                  className="fs-4 fw-bold mb-2 text-dark"
                  data-cv={`certificates[${idx}].name`}
                  data-edit-key={`certificates.${idx}.name`}
                  data-node-id={`text:certificates:card:${idx}:title:0`}
                  data-node-type="text"
                >
                  {cert.title}
                </h3>
                <h4
                  className="fs-6 fw-bold mb-3"
                  data-cv={`certificates[${idx}].issuer`}
                  data-edit-key={`certificates.${idx}.issuer`}
                  data-node-id={`text:certificates:card:${idx}:issuer:0`}
                  data-node-type="text"
                  style={{ color: 'var(--bs-primary)' }}
                >
                  {cert.issuer}
                </h4>

                {cert.credentialId && (
                  <p
                    className="text-muted mb-3"
                    data-cv={`certificates[${idx}].credentialId`}
                    data-node-id={`text:certificates:card:${idx}:credId:0`}
                    style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                  >
                    ID: {cert.credentialId}
                  </p>
                )}

                {cert.skillsCovered.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-4">
                    {cert.skillsCovered.map((s: string, i: number) => (
                      <span
                        key={i}
                        className="badge bg-light text-dark border"
                        style={{ borderRadius: '0', fontSize: '0.75rem', fontWeight: 500 }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-top">
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark fw-bold text-decoration-underline"
                  style={{ fontSize: '0.88rem' }}
                >
                  Verify Credential →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
