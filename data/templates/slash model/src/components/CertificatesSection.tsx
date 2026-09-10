'use client';

import React from 'react';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
  description: string;
  skills: string[];
}

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issuedDate: '2023',
    credentialId: 'AWS-PSA-8849201',
    description: 'Demonstrated deep architectural proficiency in highly available, cost-optimized, decoupled, and fault-tolerant cloud infrastructures.',
    skills: ['AWS Lambda', 'CloudFront', 'S3 Architecture', 'IAM Security', 'DynamoDB']
  },
  {
    id: 'cert-2',
    title: 'Meta Certified Frontend Developer Professional',
    issuer: 'Meta / Coursera',
    issuedDate: '2022',
    credentialId: 'META-FED-993214',
    description: 'Mastery over modern client architectures, advanced React hooks, state machines, automated testing, and web performance benchmarking.',
    skills: ['React 18', 'TypeScript', 'Jest', 'React Testing Library', 'Accessibility (a11y)']
  },
  {
    id: 'cert-3',
    title: 'Certified Kubernetes Application Developer (CKAD)',
    issuer: 'Cloud Native Computing Foundation (CNCF)',
    issuedDate: '2023',
    credentialId: 'CKAD-CNCF-330192',
    description: 'Proven capability to design, configure, monitor, and deploy containerized cloud applications on scalable Kubernetes clusters.',
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Microservices', 'Helm']
  }
];

interface CertificatesSectionProps {
  data?: any;
  onSelectCert: (cert: CertificateItem) => void;
}

export default function CertificatesSection({ data = {}, onSelectCert }: CertificatesSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:certificates:root:div:title']?.value ||
    data?.certificatesTitle ||
    'Certificates';

  const userCerts = Array.isArray(data?.certificates) ? data.certificates : (Array.isArray(data?.certifications) ? data.certifications : (Array.isArray(data?.awards) ? data.awards : null));

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let rawList: any[] = [];
  if (Array.isArray(userCerts)) {
    rawList = userCerts;
  } else if (!hasCustomData) {
    rawList = DEFAULT_CERTIFICATES;
  }

  // If no certificates data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  const certificates: CertificateItem[] = rawList.map((c: any, idx: number) => {
    const skillsArr = Array.isArray(c.skills) ? c.skills : (Array.isArray(c.tags) ? c.tags : ['Cloud Architecture', 'Frontend Engineering', 'Security']);
    return {
      id: c.id || `cert-${idx}`,
      title: c.title || c.name || `Professional Certificate ${idx + 1}`,
      issuer: c.issuer || c.organization || c.authority || 'Accreditation Body',
      issuedDate: c.issuedDate || c.date || c.period || '2023',
      credentialId: c.credentialId || c.licenseNumber || `ID-${idx + 1000}`,
      description: c.description || c.summary || 'Demonstrated rigorous competency in production architecture, scalable component design, and reliability engineering.',
      skills: skillsArr
    };
  });

  return (
    <section 
      id="certificates" 
      data-section="certificates"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:certificates:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            data-node-id="text:certificates:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:certificates:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-700 mt-4 font-normal">
            Industry-standard accreditations and professional certifications in cloud, frontend, and UX architecture.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(Array.isArray(certificates) ? certificates : DEFAULT_CERTIFICATES).map((cert, idx) => {
            const certTitle = contentOverrides[`text:certificate:${idx}:title`]?.value || cert.title;
            const certIssuer = contentOverrides[`text:certificate:${idx}:issuer`]?.value || cert.issuer;
            const certId = contentOverrides[`text:certificate:${idx}:id`]?.value || cert.credentialId;

            return (
              <div
                key={cert.id || idx}
                data-node-id={`card:certificate:${idx}`}
                data-node-type="card"
                className="bg-white border-3 border-black p-7 sm:p-8 shadow-solid-md flex flex-col justify-between hover:-translate-y-1.5 hover:border-[var(--primary,#000000)] transition-all group text-black"
                style={styleOverrides[`card:certificate:${idx}`]}
              >
                <div>
                  {/* Badge Icon */}
                  <div className="w-14 h-14 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] flex items-center justify-center mb-5 shadow-solid-sm transition-transform group-hover:scale-105">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                    </svg>
                  </div>

                  <h3 
                    data-node-id={`text:certificate:${idx}:title`}
                    data-node-type="text"
                    className="font-heading font-black text-lg text-black mb-1 leading-snug"
                  >
                    {certTitle}
                  </h3>
                  <div 
                    data-node-id={`text:certificate:${idx}:issuer`}
                    data-node-type="text"
                    className="font-heading font-bold text-xs text-neutral-700 mb-2"
                  >
                    {certIssuer}
                  </div>
                  <div 
                    data-node-id={`text:certificate:${idx}:id`}
                    data-node-type="text"
                    className="font-mono text-[11px] font-bold text-neutral-500 mb-6"
                  >
                    {certId}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => onSelectCert(cert)}
                    data-node-id={`button:certificate:${idx}:verify`}
                    data-node-type="button"
                    className="bracket-link text-xs font-black p-0 cursor-pointer"
                  >
                    | VERIFY CREDENTIAL |
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
