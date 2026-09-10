import React from 'react';
import { ShieldCheck, Award, CheckCircle, Calendar } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Certifications({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};

  const rawCerts = data?.certifications || doctor?.certifications || data?.achievements || doctor?.achievements || data?.awards || data?.certificates;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about || doctor?.certifications
  );

  let certsSource = [];
  if (Array.isArray(rawCerts)) {
    certsSource = rawCerts;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.certifications)) {
    certsSource = doctorProfile.certifications;
  }

  // If no certifications data exists, cleanly remove section without showing fake demo data
  if (!certsSource || certsSource.length === 0) {
    return null;
  }

  const certsList = certsSource.map((cert, idx) => {
    if (typeof cert === 'string') {
      return {
        id: `cert-${idx}`,
        name: cert,
        authority: 'Accredited Authority',
        year: '',
        credentialId: '',
        status: 'Active',
        description: ''
      };
    }
    return {
      id: cert.id || `cert-${idx}`,
      name: cert.name || cert.title || cert.certificationName || cert.award || 'Professional Certification',
      authority: cert.authority || cert.issuer || cert.organization || cert.board || 'Verified Organization',
      year: cert.year || cert.issueDate || cert.date || '',
      credentialId: cert.credentialId || cert.idNumber || cert.licenseNumber || '',
      status: cert.status || 'Active & Verified',
      description: cert.description || cert.details || ''
    };
  });

  const eyebrow = data?.certificationsEyebrow || data?.certifications?.eyebrow || 'Licensure & Credentials';
  const sectionTitle = data?.certificationsTitle || data?.certifications?.title || 'Certifications, Licensures & Honors';
  const sectionDesc = data?.certificationsDescription || data?.certifications?.description || 'Verified board credentials, accredited licensures, and professional honors.';

  return (
    <section
      id="certifications"
      data-cv-section="certifications"
      className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200"
            data-cv="certifications.eyebrow"
          >
            {eyebrow}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
            data-cv="certifications.title"
          >
            {sectionTitle}
          </h2>
          <p
            className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed"
            data-cv="certifications.description"
          >
            {sectionDesc}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {certsList.map((cert, idx) => (
            <div
              key={cert.id || idx}
              data-cv={`certifications.${idx}`}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3
                    className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                    data-cv={`certifications.${idx}.name`}
                  >
                    {cert.name}
                  </h3>
                  <div
                    className="text-xs font-semibold text-slate-600"
                    data-cv={`certifications.${idx}.authority`}
                  >
                    {cert.authority}
                  </div>
                  {cert.credentialId && (
                    <div
                      className="text-[11px] text-slate-400 font-mono"
                      data-cv={`certifications.${idx}.credentialId`}
                    >
                      Credential ID: #{cert.credentialId}
                    </div>
                  )}
                  {cert.description && (
                    <p
                      className="text-xs text-slate-500 pt-1 leading-relaxed"
                      data-cv={`certifications.${idx}.description`}
                    >
                      {cert.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                  data-cv={`certifications.${idx}.status`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cert.status}</span>
                </span>
                {cert.year && (
                  <div
                    className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-end gap-1"
                    data-cv={`certifications.${idx}.year`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{cert.year}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
