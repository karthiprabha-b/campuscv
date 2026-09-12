"use client";

import React from "react";
import { Award, ArrowUpRight } from "lucide-react";
import { certifications as fallbackCertifications, CertificationItem } from "@/data/portfolio";

interface CertificationsProps {
  data?: any;
  certifications?: CertificationItem[];
}

export default function Certifications(props: CertificationsProps = {}) {
  const rawList =
    (Array.isArray(props.certifications) && props.certifications.length > 0 ? props.certifications : null) ||
    (Array.isArray(props.data?.certifications) && props.data.certifications.length > 0 ? props.data.certifications : null) ||
    (Array.isArray(props.data?.certificates) && props.data.certificates.length > 0 ? props.data.certificates : null) ||
    (Array.isArray(props.data?.credentials) && props.data.credentials.length > 0 ? props.data.credentials : null) ||
    [];

  const isDemo = (t: string, o?: string) => {
    const s = `${t || ''} ${o || ''}`.toLowerCase();
    return (
      s.includes('meta careers') ||
      s.includes('google ux') ||
      s.includes('typescript enterprise') ||
      s.includes('boot camp') ||
      s.includes('advanced react & next.js')
    );
  };

  let certList: CertificationItem[] = rawList.map((c: any) => ({
    title: c.title || c.name || '',
    organization: c.organization || c.issuer || c.provider || c.authority || '',
    date: c.date || c.issueDate || c.year || '',
    credentialUrl: c.credentialUrl || c.url || c.link || ''
  })).filter((c: any) => c.title.length > 0);

  // If user has real items, strip any demo placeholders
  if (certList.some(c => !isDemo(c.title, c.organization))) {
    certList = certList.filter(c => !isDemo(c.title, c.organization));
  }

  // If completely empty, do not render certifications section
  if (!certList || certList.length === 0) {
    return null;
  }

  const gridColsClass =
    certList.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : certList.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
      : certList.length === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section
      id="certifications"
      data-section="certifications"
      data-node-id="section:certifications:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 space-y-3">
          <span
            data-field="certifications.subtitle"
            className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
          >
            Credentials
          </span>
          <h2
            data-field="certifications.title"
            data-node-id="text:certifications:root:h2:0"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
          >
            CERTIFICATIONS
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Certifications Grid */}
        <div className={`grid ${gridColsClass} gap-6`}>
          {certList.map((cert: CertificationItem, idx: number) => (
            <div
              key={cert.title || idx}
              data-node-id={`container:certifications:card:${idx}`}
              className="p-6 bg-white border-2 border-[#111111]/10 rounded-md flex flex-col justify-between shadow-xs hover:border-[#FFC107] transition-colors duration-150 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-full group-hover:bg-[#FFC107] transition-colors duration-150"
                    style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
                  >
                    <Award className="w-5 h-5 text-[#111111] stroke-[2]" />
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-field={`certifications[${idx}].credentialUrl`}
                      className="text-[#666666] hover:text-[#111111] transition-colors p-1"
                      aria-label="View Credential"
                    >
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </a>
                  )}
                </div>

                <span
                  data-field={`certifications[${idx}].organization`}
                  data-node-id={`text:certifications:card:${idx}:org`}
                  className="text-[10px] font-black text-[#FFC107] tracking-wider uppercase"
                >
                  {cert.organization || (cert as any).issuer}
                </span>

                <h3
                  data-field={`certifications[${idx}].title`}
                  data-node-id={`text:certifications:card:${idx}:title`}
                  className="text-base font-black tracking-tight text-[#111111] mt-1 group-hover:text-[#111111] transition-colors"
                >
                  {cert.title}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-[#111111]/10 flex items-center justify-between text-xs text-[#666666]">
                <span
                  data-field={`certifications[${idx}].date`}
                  data-node-id={`text:certifications:card:${idx}:date`}
                >
                  Issued: {cert.date || (cert as any).issueDate}
                </span>
                {(cert as any).credentialId && (
                  <span className="text-[10px] bg-[#111111]/5 px-2 py-0.5 rounded-sm font-mono text-[#666666]">
                    ID: {(cert as any).credentialId.substring(0, 8)}...
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

