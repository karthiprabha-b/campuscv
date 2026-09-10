'use client';

import React from 'react';
import { useTheme } from '../ThemeContext';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_CERTIFICATIONS = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect — Professional",
    issuer: "Amazon Web Services",
    issueDate: "2023",
    expiryDate: "2026",
    credentialId: "AWS-PSA-882194",
    credentialUrl: "https://aws.amazon.com/verification",
    skills: ["Cloud Architecture", "Multi-Region VPC", "High Availability", "Disaster Recovery"],
    featured: true
  },
  {
    id: "cert-2",
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Linux Foundation / CNCF",
    issueDate: "2022",
    expiryDate: "2025",
    credentialId: "CKA-773019",
    credentialUrl: "https://www.cncf.io/certification/cka/",
    skills: ["Cluster Architecture", "Kube-proxy", "Storage Provisioning", "Security Policies"],
    featured: true
  },
  {
    id: "cert-3",
    name: "Meta Certified Front-End Developer Specialization",
    issuer: "Meta (Coursera)",
    issueDate: "2021",
    credentialId: "META-FED-9921",
    credentialUrl: "https://coursera.org",
    skills: ["Advanced React", "UX Principles", "Web Performance"],
    featured: false
  }
];

interface CertificationsCardProps {
  data?: any;
}

export const CertificationsCard: React.FC<CertificationsCardProps> = React.memo(({ data }) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const rawCerts = data?.certifications || data?.certificates;
  const certificationsList = Array.isArray(rawCerts) && rawCerts.length > 0 ? rawCerts : DEFAULT_CERTIFICATIONS;
  const { accentClass } = useTheme();

  const title =
    contentOverrides['text:certificates:root:div:title']?.value ||
    contentOverrides['text:certifications:root:div:title']?.value ||
    data?.certificationsTitle ||
    'Certifications & Badges';

  return (
    <div 
      data-section="certifications" 
      data-cv-section="certifications" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:certifications:root:section:0']}
    >
      {/* Background Glow */}
      <div 
        className={`absolute top-0 right-10 w-72 h-72 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 07 / 08</div>
            <h2 
              data-node-id="text:certificates:root:div:title"
              data-node-type="text"
              data-cv="certifications.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Verified Credentials
        </div>
      </div>      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto max-h-[60vh] overflow-y-auto no-scrollbar pr-1" data-cv-section="certifications" data-cv-collection="certifications.items">
        {certificationsList.map((cert: any, idx: number) => {
          const skills = Array.isArray(cert.skills) ? cert.skills : [];
          const certUrl = cert.credentialUrl || (cert as any).url || (cert as any).link || '#';
          const issueDate = cert.issueDate || (cert as any).date || (cert as any).year || '2023';
          const issuer = cert.issuer || (cert as any).organization || 'Accredited Issuer';
          const certTitle = cert.title || cert.name || 'Certification';
          const credentialId = cert.credentialId || (cert as any).id || `CERT-${idx + 1000}`;

          return (
            <div
              key={cert.id || idx}
              data-cv={`certifications.items[${idx}]`}
              data-cv-item="certification"
              data-cv-index={idx}
              className="group relative p-4 sm:p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1.5 rounded-xl bg-white/5 border border-white/10 ${accentClass.text}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span 
                      data-node-id={`text:certificates:items:${idx}:issuer`}
                      data-node-type="text"
                      data-cv={`certifications.items[${idx}].issuer`}
                      className="text-xs font-semibold text-zinc-300"
                    >
                      {issuer}
                    </span>
                  </div>

                  <div 
                    data-node-id={`text:certificates:items:${idx}:date`}
                    data-node-type="text"
                    data-cv={`certifications.items[${idx}].issueDate`}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{issueDate}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  data-node-id={`text:certificates:items:${idx}:title`}
                  data-node-type="text"
                  data-cv={`certifications.items[${idx}].title`}
                  className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors mb-1"
                >
                  {certTitle}
                </h3>

                {/* Credential ID */}
                {credentialId && (
                  <div className="text-[10px] font-mono text-zinc-400 mb-2.5">
                    Credential ID:{' '}
                    <span 
                      data-node-id={`text:certificates:items:${idx}:id`}
                      data-node-type="text"
                      data-cv={`certifications.items[${idx}].credentialId`}
                      className="text-zinc-200"
                    >
                      {credentialId}
                    </span>
                  </div>
                )}

                {/* Skills covered */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {skills.map((s: any, sIdx: number) => (
                      <span
                        key={sIdx}
                        data-node-id={`text:certificates:items:${idx}:skill:${sIdx}`}
                        data-node-type="text"
                        data-cv={`certifications.items[${idx}].skills[${sIdx}]`}
                        className="px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] text-zinc-300"
                      >
                        {typeof s === 'string' ? s : (s?.name || String(s))}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Verification Link */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>

                {certUrl !== '#' ? (
                  <a
                    href={certUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-zinc-500 font-mono">Verified Active</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

CertificationsCard.displayName = 'CertificationsCard';
