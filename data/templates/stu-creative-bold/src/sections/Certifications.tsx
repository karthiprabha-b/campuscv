"use client";

import React from "react";
import { Award, ArrowUpRight } from "lucide-react";
import { CertificationItem } from "@/data/portfolio";

interface CertificationsProps {
  data?: any;
  certifications?: CertificationItem[];
}

export default function Certifications(props: CertificationsProps = {}) {
  const rawCerts = (Array.isArray(props.certifications) && props.certifications.length > 0)
    ? props.certifications
    : (Array.isArray(props.data?.certifications) && props.data.certifications.length > 0)
      ? props.data.certifications
      : (Array.isArray(props.data?.canonicalProfile?.certifications) && props.data.canonicalProfile.certifications.length > 0)
        ? props.data.canonicalProfile.certifications
        : (Array.isArray(props.data?.certificates) && props.data.certificates.length > 0)
          ? props.data.certificates
          : (Array.isArray(props.data?.awards) && props.data.awards.length > 0)
            ? props.data.awards
            : (Array.isArray(props.data?.credentials) && props.data.credentials.length > 0)
              ? props.data.credentials
              : [];

  if (!rawCerts || !Array.isArray(rawCerts) || rawCerts.length === 0) {
    return null;
  }

  // Filter out demo certs if user has real certs
  const isExactDemoCertTitle = (title: string) => {
    const t = (title || '').toLowerCase().trim();
    return (
      t.includes('google ux design') ||
      t.includes('typescript enterprise') ||
      t.includes('full-stack web engineering boot camp') ||
      t.includes('advanced react & next.js')
    );
  };

  const hasReal = rawCerts.some((c: any) => !isExactDemoCertTitle(c.title || c.name || ''));
  const candidateList = hasReal ? rawCerts.filter((c: any) => !isExactDemoCertTitle(c.title || c.name || '')) : rawCerts;

  const certList: CertificationItem[] = candidateList.map((cert: any) => ({
    title: cert.title || cert.name || cert.certificateName || cert.certificationName || "Professional Certificate",
    organization: cert.organization || cert.issuer || cert.provider || cert.authority || cert.issuedBy || "Verified Authority",
    date: cert.date || cert.issueDate || cert.year || cert.issueYear || "",
    credentialUrl: cert.credentialUrl || cert.url || cert.link || "#"
  }));

  if (certList.length === 0) {
    return null;
  }

  return (
    <section
      id="certifications"
      data-section="certifications"
      data-cv-section="certifications"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 space-y-3">
          <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
            Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
            CERTIFICATIONS
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certList.map((cert: CertificationItem, idx: number) => (
            <div
              key={cert.title || idx}
              data-cv={`certifications[${idx}]`}
              data-cv-item
              data-cv-index={idx}
              className="p-6 bg-white border-2 border-[#111111]/10 rounded-md flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#FFC107] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-full group-hover:bg-[#FFC107] transition-colors duration-300"
                    style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
                  >
                    <Award className="w-5 h-5 text-[#111111] stroke-[2]" />
                  </div>
                  {cert.credentialUrl && cert.credentialUrl !== "#" && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#666666] hover:text-[#111111] transition-colors p-1"
                      aria-label="View Credential"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] font-black text-[#FFC107] tracking-wider uppercase">
                  {cert.organization || (cert as any).issuer || (cert as any).provider || "Verified Authority"}
                </span>

                <h3 className="text-base font-black tracking-tight text-[#111111] mt-1 group-hover:text-[#111111] transition-colors">
                  {cert.title}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-[#111111]/10 flex items-center justify-between text-xs text-[#666666]">
                <span>Issued: {cert.date || (cert as any).issueDate || (cert as any).year || "Verified"}</span>
                {(cert as any).credentialId && (
                  <span className="text-[10px] bg-[#111111]/5 px-2 py-0.5 rounded-sm font-mono text-[#666666]">
                    ID: {String((cert as any).credentialId).substring(0, 8)}...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
