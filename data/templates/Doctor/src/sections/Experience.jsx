import React from 'react';
import { Building2, MapPin, CheckCircle2, Calendar, Award } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Experience({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawExp = Array.isArray(data?.experience) 
    ? data.experience 
    : (Array.isArray(data?.timeline)
      ? data.timeline
      : (Array.isArray(data?.work)
        ? data.work
        : (Array.isArray(doctor?.experience)
          ? doctor.experience
          : (Array.isArray(data?.career)
            ? data.career
            : null))));

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about || doctor?.experience
  );

  let rawList = [];
  if (Array.isArray(rawExp)) {
    rawList = rawExp;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.experience)) {
    rawList = doctorProfile.experience;
  }

  // If no experience data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  const experience = rawList.map((item, idx) => {
    const start = String(item.startDate || item.startYear || item.start || item.from || '').trim();
    const end = String(item.endDate || item.endYear || item.end || item.to || (item.current ? 'Present' : '')).trim();
    let period = String(item.period || item.duration || item.dates || item.year || item.years || '').trim();
    if (!period && start && end && start !== end) {
      period = `${start} – ${end}`;
    } else if (!period && start) {
      period = item.current ? `${start} – Present` : start;
    } else if (!period && end) {
      period = end;
    }

    return {
      id: item.id || `exp-${idx}`,
      role: item.role || item.position || item.title || item.designation || 'Position / Role',
      institution: item.institution || item.organization || item.hospital || item.company || item.workplace || item.employer || 'Organization',
      period: period,
      location: item.location || item.city || '',
      department: item.department || item.specialty || item.division || '',
      description: item.description || item.summary || item.details || '',
      highlights: Array.isArray(item.highlights) ? item.highlights : (Array.isArray(item.bullets) ? item.bullets : (Array.isArray(item.responsibilities) ? item.responsibilities : []))
    };
  });

  const eyebrow = data?.experience?.eyebrow || 'Career Timeline';
  const title = data?.experience?.title || 'Appointments & Experience';
  const description = data?.experience?.description || 'Key positions, institutional appointments, and career history.';

  return (
    <section
      id="experience"
      data-cv-section="experience"
      className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200" data-cv="experience.eyebrow">
            {eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight" data-cv="experience.title">
            {title}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed" data-cv="experience.description">
            {description}
          </p>
        </div>

        {/* Single-Column Streamlined Vertical Timeline */}
        <div 
          className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:inset-0 before:left-2.5 sm:before:left-3 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-slate-200 before:to-slate-100"
          data-cv-collection="experience"
        >
          {experience.map((item, idx) => (
            <div
              key={item.id || idx}
              className="relative group"
              data-cv-item={`experience[${idx}]`}
            >
              {/* Timeline Left Node Bullet */}
              <div className="absolute -left-6 sm:-left-8 top-6 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-sky-600 flex items-center justify-center shadow-xs z-10 group-hover:scale-110 group-hover:bg-sky-50 transition-all -translate-x-1/2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-600" />
              </div>

              {/* Full-Width Timeline Card */}
              <div className="bg-slate-50/90 hover:bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs hover:border-sky-300 hover:shadow-md transition-all duration-300 space-y-3">
                {/* Period Badge & Department */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100/90 text-sky-800 border border-sky-200/80" data-cv={`experience.${idx}.period`}>
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{item.period || item.duration || item.year}</span>
                  </span>
                  {item.department && (
                    <span className="text-xs font-semibold text-slate-500" data-cv={`experience.${idx}.department`}>
                      {item.department}
                    </span>
                  )}
                </div>

                {/* Role Title & Institution */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug" data-cv={`experience.${idx}.role`}>
                    {item.role || item.title || item.position}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <span data-cv={`experience.${idx}.institution`}>{item.institution || item.company}</span>
                    </div>
                    {item.location && (
                      <>
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span data-cv={`experience.${idx}.location`}>{item.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Description Narrative */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1" data-cv={`experience.${idx}.description`}>
                    {item.description}
                  </p>
                )}

                {/* Highlights / Responsibilities */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200/60 space-y-1.5">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-sky-600" />
                      <span>Key Highlights & Responsibilities</span>
                    </div>
                    {item.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
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
