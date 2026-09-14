import React from 'react';
import { Award, ShieldCheck, CheckCircle2, ArrowUpRight, Calendar } from 'lucide-react';

export default function Certificates(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.certifications || props?.certificates || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawCerts = Array.isArray(incoming)
    ? incoming
    : (Array.isArray(data?.certifications) && data.certifications.length > 0
      ? data.certifications
      : (Array.isArray(data?.certificates) && data.certificates.length > 0
        ? data.certificates
        : (Array.isArray(data?.awards) && data.awards.length > 0 ? data.awards : null)));

  if (!rawCerts || rawCerts.length === 0) return null;

  const certificates = rawCerts.map((cert, idx) => {
    const title = cert?.title || cert?.name || cert?.credential || `Certificate #${idx + 1}`;
    const issuer = cert?.issuer || cert?.organization || cert?.authority || cert?.issuedBy || 'Issuing Authority';
    const date = cert?.date || cert?.year || cert?.issueDate || '';
    const desc = cert?.description || cert?.desc || 'Validated professional credentials and specialized legal expertise.';
    const url = cert?.link || cert?.url || cert?.credentialUrl || '#';

    return {
      id: cert?.id || `cert-${idx + 1}`,
      title,
      issuer,
      date,
      desc,
      url
    };
  });

  return (
    <section 
      id="certificates" 
      data-cv-section="certifications"
      data-node-id="section:certifications:root:section:0"
      className="py-20 sm:py-24 bg-[#FAF8F4] relative overflow-hidden border-t"
      style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              HONORS & CREDENTIALS
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Bar Admissions & Certifications
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id || idx}
              data-cv={`certifications.items[${idx}]`}
              className="p-8 bg-white border shadow-sm hover:shadow-gold-glow transition-all duration-300 relative group flex flex-col justify-between"
              style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
            >
              {/* Top Accent Stripe */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
                }}
              />

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 bg-[#FAF8F4] border"
                      style={{
                        borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)',
                        color: 'var(--campuscv-accent, #C89B3C)'
                      }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] font-sans font-medium">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {cert.date && (
                    <span 
                      className="px-2.5 py-1 text-xs font-mono font-bold border shrink-0"
                      style={{
                        borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)',
                        backgroundColor: '#FAF8F4',
                        color: 'var(--campuscv-accent, #C89B3C)'
                      }}
                    >
                      {cert.date}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] font-sans leading-relaxed">
                  {cert.desc}
                </p>
              </div>

              {cert.url && cert.url !== '#' && (
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:underline"
                    style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                  >
                    <span>Verify Credential</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
