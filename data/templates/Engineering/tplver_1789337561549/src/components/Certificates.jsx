import React from 'react';
import { Award, ShieldCheck, CheckCircle, ExternalLink, Calendar, KeyRound } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Certificates({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { certificates } = norm;

  return (
    <section
      id="certificates"
      data-node-id="section:certificates:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-indigo-card text-white wave-top-curve wave-bottom-curve relative overflow-hidden shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-cyber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header inside indigo container */}
        <SectionHeader
          eyebrow="VERIFIED ACCREDITATIONS"
          title="Industry Certifications"
          subtitle="Validated domain mastery across distributed computing, Kubernetes & major cloud platforms"
          dark={true}
        />

        {/* Stadium Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id || idx}
              data-node-id={`container:certificates:card:${idx}`}
              data-node-type="container"
              data-cv={`certifications.items[${idx}]`}
              className="bg-white text-slate-900 rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 shadow-deep-float flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-glow"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                  <span
                    data-node-id={`text:certificates:issuer:${idx}:0`}
                    data-node-type="text"
                    data-cv={`certifications.items[${idx}].issuer`}
                    className="text-xs font-bold font-mono text-cyber-600 uppercase tracking-wider"
                  >
                    {cert.issuer}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-cyber-950 bg-cyber-brightCyan/30 px-3 py-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-cyber-700" /> Verified
                  </span>
                </div>

                {/* Name */}
                <h3
                  data-node-id={`text:certificates:name:${idx}:0`}
                  data-node-type="text"
                  data-cv={`certifications.items[${idx}].title`}
                  className="font-display font-black text-base sm:text-xl text-slate-950 leading-snug mb-3"
                >
                  {cert.title || cert.name}
                </h3>

                {/* Badge Level */}
                {(cert.badge || cert.level) && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full mb-4">
                    <Award className="w-3.5 h-3.5 text-cyber-600 shrink-0" />
                    <span className="truncate">{cert.badge || cert.level}</span>
                  </div>
                )}
              </div>

              {/* Bottom Verification Link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {cert.date || cert.issueDate || cert.year}
                </span>

                <a
                  href={cert.verifyUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyber-50 hover:bg-cyber-100 text-xs font-bold text-cyber-800 transition-colors uppercase tracking-wider font-mono"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
