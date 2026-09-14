import React from 'react';
import { Award, CheckCircle2, ArrowUpRight, Calendar, ShieldCheck } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Certificates({ data = {} }) {
  const rawCerts = Array.isArray(data?.certificates) && data.certificates.length > 0 
    ? data.certificates 
    : (Array.isArray(data?.certifications) && data.certifications.length > 0 ? data.certifications : (_default.certificates || []));

  const certificates = rawCerts.map((cert, idx) => {
    const id = cert?.id || `cert-${idx + 1}`;
    const titleKey = `text:certificates:card:${id}:title`;
    const issuerKey = `text:certificates:card:${id}:issuer`;
    const dateKey = `text:certificates:card:${id}:issueDate`;
    const descKey = `text:certificates:card:${id}:description`;

    return {
      id,
      title: data?.contentOverrides?.[titleKey]?.value || (typeof data?.contentOverrides?.[titleKey] === 'string' ? data?.contentOverrides?.[titleKey] : null) || cert?.title || cert?.name || 'Aesthetic Board Certification',
      issuer: data?.contentOverrides?.[issuerKey]?.value || (typeof data?.contentOverrides?.[issuerKey] === 'string' ? data?.contentOverrides?.[issuerKey] : null) || cert?.issuer || cert?.authority || cert?.organization || 'CIDESCO Section Zurich',
      issueDate: data?.contentOverrides?.[dateKey]?.value || (typeof data?.contentOverrides?.[dateKey] === 'string' ? data?.contentOverrides?.[dateKey] : null) || cert?.issueDate || cert?.date || cert?.year || '2024',
      credentialUrl: cert?.credentialUrl || cert?.url || cert?.link || '#',
      description: data?.contentOverrides?.[descKey]?.value || (typeof data?.contentOverrides?.[descKey] === 'string' ? data?.contentOverrides?.[descKey] : null) || cert?.description || cert?.desc || 'Validated clinical proficiency in luxury skin therapies and cosmetic chemistry.',
      titleKey,
      issuerKey,
      dateKey,
      descKey
    };
  });

  return (
    <section 
      id="certificates" 
      data-cv-section="certificates"
      data-node-id="section:certificates:root:section:0"
      className="py-24 bg-[#FAF7F5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-white px-4 py-1.5 rounded-full border border-pink-200 inline-block shadow-xs">
            Honors & Accreditations
          </span>
          <h2 
            data-node-id="text:certificates:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            Certifications & Master Honors
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            Board-certified credentials and grand prix distinctions from world-leading academies.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              data-node-id={`item:certificates:card:${cert.id}`}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-pink-200 shadow-sm hover:shadow-luxury hover:border-pink-400 transition-all duration-300 flex flex-col justify-between space-y-4 group pointer-events-auto"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span 
                    data-node-id={cert.issuerKey}
                    data-node-type="text"
                    className="text-xs font-semibold text-[#84354D] bg-[#FCEEF3] px-3 py-1 rounded-full border border-pink-200 cursor-text"
                  >
                    {cert.issuer}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-50 px-2.5 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3 text-[#DF7A98] pointer-events-none" />
                    <span 
                      data-node-id={cert.dateKey}
                      data-node-type="text"
                      className="cursor-text"
                    >
                      {cert.issueDate}
                    </span>
                  </div>
                </div>

                <h3 
                  data-node-id={cert.titleKey}
                  data-node-type="text"
                  className="font-serif text-lg sm:text-xl font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors cursor-text"
                >
                  {cert.title}
                </h3>
                <p 
                  data-node-id={cert.descKey}
                  data-node-type="text"
                  className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed cursor-text"
                >
                  {cert.description}
                </p>
              </div>

              {cert.credentialUrl && cert.credentialUrl !== '#' && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DF7A98] hover:text-[#C95679] transition-colors self-start pt-2 pointer-events-auto"
                >
                  <span>Verify Board Record</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
