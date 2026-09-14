import React, { useState } from 'react';
import { GraduationCap, Award, Calendar, MapPin, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';
import CertificateModal from './CertificateModal.jsx';

const _default = beauticianProfile || {};

export default function Education({ data = {} }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const rawEdu = Array.isArray(data?.education) && data.education.length > 0 ? data.education : (_default.education || []);

  const educations = rawEdu.map((item, idx) => {
    const id = item?.id || `edu-${idx + 1}`;
    const rawDegree = item?.degree || item?.title || 'Cosmetology & Aesthetic Master Certification';
    const rawField = item?.fieldOfStudy || item?.major || item?.specialization || '';

    const degKey = `text:education:card:${id}:degree`;
    const fieldKey = `text:education:card:${id}:field`;
    const instKey = `text:education:card:${id}:institution`;
    const periodKey = `text:education:card:${id}:period`;
    const descKey = `text:education:card:${id}:description`;
    const credKey = `text:education:card:${id}:credential`;

    return {
      id,
      degree: data?.contentOverrides?.[degKey]?.value || (typeof data?.contentOverrides?.[degKey] === 'string' ? data?.contentOverrides?.[degKey] : null) || rawDegree,
      fieldOfStudy: data?.contentOverrides?.[fieldKey]?.value || (typeof data?.contentOverrides?.[fieldKey] === 'string' ? data?.contentOverrides?.[fieldKey] : null) || rawField,
      institution: data?.contentOverrides?.[instKey]?.value || (typeof data?.contentOverrides?.[instKey] === 'string' ? data?.contentOverrides?.[instKey] : null) || item?.institution || item?.school || 'Aesthetic Dermal Institute',
      location: item?.location || 'London / Zurich',
      period: data?.contentOverrides?.[periodKey]?.value || (typeof data?.contentOverrides?.[periodKey] === 'string' ? data?.contentOverrides?.[periodKey] : null) || item?.period || item?.year || '2016',
      credentialId: data?.contentOverrides?.[credKey]?.value || (typeof data?.contentOverrides?.[credKey] === 'string' ? data?.contentOverrides?.[credKey] : null) || item?.credentialId || `CID-${idx + 100}`,
      honors: item?.honors || '',
      description: data?.contentOverrides?.[descKey]?.value || (typeof data?.contentOverrides?.[descKey] === 'string' ? data?.contentOverrides?.[descKey] : null) || item?.description || 'Gold standard global beauty therapy qualification.',
      badge: item?.badge || 'Master Accreditation',
      skillsLearned: Array.isArray(item?.skillsLearned) ? item.skillsLearned : (Array.isArray(item?.skills) ? item.skills : ['Clinical Skin Diagnostics', 'Dermal Chemistry', 'Facial Mapping']),
      degKey,
      fieldKey,
      instKey,
      periodKey,
      descKey,
      credKey
    };
  });

  return (
    <section 
      id="education" 
      data-cv-section="education"
      data-node-id="section:education:root:section:0"
      className="py-24 bg-[#FAF7F5] relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FCEEF3]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-white px-4 py-1.5 rounded-full border border-pink-200 inline-block shadow-xs">
            Academic & Clinical Credentials
          </span>
          <h2 
            data-node-id="text:education:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            International Education & Master Accreditations
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            Certified by premier dermatological institutes and high-fashion academies in London, Zurich, Geneva, and Paris.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educations.map((item) => (
            <div
              key={item.id}
              data-node-id={`item:education:card:${item.id}`}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-pink-200 shadow-sm hover:shadow-luxury hover:border-pink-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden pointer-events-auto"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DF7A98] via-[#C95679] to-[#C59B6D]" />

              <div>
                {/* Header Badge & Year */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCEEF3] text-[#84354D] text-xs font-bold border border-pink-200">
                    <Award className="w-3.5 h-3.5 text-[#DF7A98]" />
                    <span>{item.badge}</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-semibold bg-zinc-50 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-[#DF7A98] pointer-events-none" />
                    <span 
                      data-node-id={item.periodKey}
                      data-node-type="text"
                      className="cursor-text"
                    >
                      {item.period}
                    </span>
                  </div>
                </div>

                {/* Degree Title */}
                <h3 
                  data-node-id={item.degKey}
                  data-node-type="text"
                  className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors mb-1 cursor-text"
                >
                  {item.degree}
                </h3>

                {/* Field of Study */}
                {item.fieldOfStudy && (
                  <p 
                    data-node-id={item.fieldKey}
                    data-node-type="text"
                    className="text-xs sm:text-sm font-semibold text-[#DF7A98] mb-2 cursor-text"
                  >
                    Specialism: {item.fieldOfStudy}
                  </p>
                )}

                {/* Institution & Location */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-zinc-600 mb-4">
                  <div className="flex items-center gap-1 text-[#A83E5D] font-semibold">
                    <GraduationCap className="w-4 h-4 pointer-events-none" />
                    <span 
                      data-node-id={item.instKey}
                      data-node-type="text"
                      className="cursor-text"
                    >
                      {item.institution}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 pointer-events-none" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p 
                  data-node-id={item.descKey}
                  data-node-type="text"
                  className="text-sm text-zinc-600 leading-relaxed font-normal mb-5 cursor-text"
                >
                  {item.description}
                </p>

                {/* Learned Skills Tags */}
                {item.skillsLearned.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Core Specialisms:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skillsLearned.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#DF7A98]" />
                          <span>{typeof skill === 'string' ? skill : skill?.name || ''}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Credential ID & Inspect Button */}
              <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">License / ID</span>
                  <span 
                    data-node-id={item.credKey}
                    data-node-type="text"
                    className="font-mono text-xs font-semibold text-zinc-800 cursor-text"
                  >
                    {item.credentialId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-2 rounded-full bg-[#FCEEF3] hover:bg-[#DF7A98] text-[#A83E5D] hover:text-white border border-pink-200 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Accreditation Guarantee Bar */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FCEEF3] flex items-center justify-center text-[#DF7A98] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-zinc-900">100% Certified Continuous Mastery</p>
              <p className="text-xs text-zinc-600">Undergoing 50+ hours of annual continuing clinical dermatological training.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              ✓ Active 2026 Board Verified
            </span>
          </div>
        </div>

      </div>

      {/* Modal View */}
      <CertificateModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
