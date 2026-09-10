"use client";

import React from "react";
import { Award, ShieldCheck, ArrowUpRight } from "lucide-react";

const DEFAULT_CERTS = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "Jan 2025",
    expiryDate: "Jan 2028",
    credentialId: "AWS-SAA-8392019",
    verifyUrl: "https://aws.amazon.com/verification",
    description: "Demonstrated expertise in designing resilient, high-performing, secure, and cost-optimized distributed architectures on AWS.",
    badgeBg: "bg-amber-50",
    badgeColor: "text-amber-600"
  },
  {
    id: "cert-2",
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI / Coursera",
    issueDate: "Oct 2024",
    expiryDate: "No Expiration",
    credentialId: "COURSERA-DL-948102",
    verifyUrl: "https://coursera.org/verify",
    description: "Comprehensive mastery of neural network architectures, backpropagation mathematics, CNNs, sequence models, and attention mechanisms.",
    badgeBg: "bg-blue-50",
    badgeColor: "text-blue-600"
  }
];

interface CertificatesSectionProps {
  data?: any;
  onSelectCert: (cert: any) => void;
}

export default function CertificatesSection({ data = {}, onSelectCert }: CertificatesSectionProps) {
  // If user explicitly provided an empty array, return null
  if (Array.isArray(data?.certifications) && data.certifications.length === 0) {
    return null;
  }

  const rawCerts = (Array.isArray(data?.certifications) && data.certifications.length > 0)
    ? data.certifications
    : ((Array.isArray(data?.certificates) && data.certificates.length > 0)
        ? data.certificates
        : ((Array.isArray(data?.awards) && data.awards.length > 0)
            ? data.awards
            : ((Array.isArray(data?.credentials) && data.credentials.length > 0)
                ? data.credentials
                : DEFAULT_CERTS)));

  const badgeBgs = ["bg-amber-50", "bg-blue-50", "bg-purple-50", "bg-emerald-50", "bg-rose-50"];
  const badgeColors = ["text-amber-600", "text-blue-600", "text-purple-600", "text-emerald-600", "text-rose-600"];

  const certificates = rawCerts.map((cert: any, idx: number) => {
    const title = cert.title || cert.name || cert.certificateName || `Certificate ${idx + 1}`;
    const issuer = cert.issuer || cert.organization || cert.authority || cert.issuedBy || "Issuing Body";
    const issueDate = String(cert.issueDate || cert.date || cert.year || cert.issuedDate || "").trim();
    const expiryDate = cert.expiryDate || cert.expires || "";
    const credentialId = cert.credentialId || cert.id || cert.license || "";
    const verifyUrl = cert.verifyUrl || cert.url || cert.link || cert.credentialUrl || "";
    const description = cert.description || cert.desc || cert.summary || "";

    return {
      id: cert.id || `cert-${idx}`,
      idx,
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      verifyUrl,
      description,
      badgeBg: cert.badgeBg || badgeBgs[idx % badgeBgs.length],
      badgeColor: cert.badgeColor || badgeColors[idx % badgeColors.length],
    };
  });

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" data-cv-section="certificates" data-section="certifications" data-node-id="section:certifications:root:section:0" className="py-12 sm:py-16 border-b border-gray-200 scroll-mt-8">
      <div className="mb-8">
        <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2" data-cv="certificates.eyebrow">
          Certifications & Credentials
        </h2>
        <p className="text-base text-gray-600" data-cv="certificates.description">
          Industry accreditations, cloud credentials, and professional course completions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-cv-collection="certificates">
        {certificates.map((cert: any) => (
          <div
            key={cert.id}
            onClick={() => onSelectCert(cert)}
            data-cv-item={`certificates[${cert.idx}]`}
            className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-2xs ${cert.badgeBg} ${cert.badgeColor}`}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>

              <h3 
                className="font-extrabold text-gray-900 text-base leading-snug group-hover:text-brand-600 transition-colors mb-1.5"
                data-cv={`certificates.${cert.idx}.title`}
              >
                {cert.title}
              </h3>
              <p 
                className="text-xs sm:text-sm font-bold text-brand-600 mb-3"
                data-cv={`certificates.${cert.idx}.issuer`}
              >
                {cert.issuer}
              </p>
              {cert.description && (
                <p 
                  className="text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed mb-5"
                  data-cv={`certificates.${cert.idx}.description`}
                >
                  {cert.description}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm">
              {cert.issueDate && (
                <span className="font-mono text-gray-400 text-xs" data-cv={`certificates.${cert.idx}.date`}>
                  {cert.issueDate}
                </span>
              )}
              <span className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                <span>View Credential</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
