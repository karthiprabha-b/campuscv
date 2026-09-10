import React from 'react';
import { Award, Building, Calendar } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Education({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawEducation = Array.isArray(data?.education)
    ? data.education
    : (Array.isArray(data?.education?.items)
      ? data.education.items
      : (Array.isArray(data?.data?.education)
        ? data.data.education
        : (Array.isArray(data?.content?.education)
          ? data.content.education
          : (Array.isArray(data?.doctor?.education)
            ? data.doctor.education
            : (Array.isArray(data?.academics)
              ? data.academics
              : (Array.isArray(doctor?.education)
                ? doctor.education
                : (Array.isArray(doctorProfile?.education)
                  ? doctorProfile.education
                  : [])))))));

  const education = Array.isArray(rawEducation) ? rawEducation : [];

  // If no education data exists, cleanly remove section without showing fake demo data
  if (!education || education.length === 0) {
    return null;
  }

  const eyebrow = data?.education?.eyebrow || data?.educationEyebrow || 'Academic Background';
  const title = data?.education?.title || data?.educationTitle || 'Education & Academic Qualifications';
  const description = data?.education?.description || data?.educationDescription || 'Formal university degrees, specialized medical training, and academic achievements.';

  return (
    <section
      id="education"
      data-cv-section="education"
      data-node-id="container:education:section:0"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200"
            data-node-id="text:education:eyebrow:0"
            data-cv="education.eyebrow"
          >
            {eyebrow}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
            data-node-id="text:education:title:0"
            data-cv="education.title"
          >
            {title}
          </h2>
          <p
            className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed"
            data-node-id="text:education:description:0"
            data-cv="education.description"
          >
            {description}
          </p>
        </div>

        {/* Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cv-collection="education.items">
          {education.map((edu, idx) => {
            const degreeTitle = edu.degree || edu.qualification || edu.degreeTitle || edu.title || edu.name || 'Academic Degree';
            const field = edu.fieldOfStudy || edu.field || edu.major || edu.course || edu.specialization || edu.department || edu.area || '';
            const institution = edu.institution || edu.school || edu.university || edu.college || edu.academy || edu.hospital || 'Institution';
            const rawStart = String(
              edu.startDate || edu.start_date || edu.startYear || edu.start_year ||
              edu.start || edu.from || (typeof edu.period === 'string' ? edu.period.split(/[-–—]/)[0]?.trim() : '') || ''
            ).trim();

            const rawEnd = String(
              edu.endDate || edu.end_date || edu.endYear || edu.end_year ||
              edu.graduationYear || edu.graduation_year || edu.passingYear || edu.passing_year ||
              edu.end || edu.to || (typeof edu.period === 'string' ? edu.period.split(/[-–—]/)[1]?.trim() : '') || ''
            ).trim();

            const rawYear = String(
              edu.year || edu.years || edu.period || edu.duration || edu.dates || edu.date || ''
            ).trim();

            let period = '';
            if (rawStart && rawEnd && rawStart !== rawEnd) {
              period = `${rawStart} – ${rawEnd}`;
            } else if (rawStart && rawEnd && rawStart === rawEnd) {
              period = rawStart;
            } else if (rawYear && !rawYear.includes('undefined')) {
              period = rawYear;
            } else if (rawStart) {
              period = rawStart;
            } else if (rawEnd) {
              period = rawEnd;
            }

            if (period) {
              period = period
                .replace(/\\+/g, ' – ')
                .replace(/\/+/g, ' – ')
                .replace(/,+/g, ' – ')
                .replace(/\s*–\s*/g, ' – ')
                .replace(/\s*-\s*/g, ' – ')
                .trim();
            }

            const displayPeriod = period || (rawStart && rawEnd ? `${rawStart} – ${rawEnd}` : (rawStart || rawEnd || 'Graduation Year'));
            const desc = edu.description || edu.details || edu.summary || '';
            const honors = edu.honors || edu.grade || edu.gpa || '';

            return (
              <div
                key={edu.id || idx}
                data-cv={`education.items[${idx}]`}
                data-cv-item="education"
                data-node-id={`container:education:card:${idx}`}
                className="bg-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2" data-node-id={`container:education:card:${idx}:date:0`}>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100/90 px-3 py-1 rounded-full border border-sky-300 shadow-2xs"
                      data-node-id={`text:education:card:${idx}:span:0`}
                      data-cv={`education.items[${idx}].period`}
                      data-cv-field="period"
                    >
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span data-cv={`education.items[${idx}].year`}>{displayPeriod}</span>
                    </span>
                    {honors && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200"
                        data-cv={`education.items[${idx}].honors`}
                        data-node-id={`text:education:card:${idx}:honors:0`}
                      >
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>{honors}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                      data-node-id={`text:education:card:${idx}:h3:0`}
                      data-cv={`education.items[${idx}].degree`}
                    >
                      {degreeTitle}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span data-node-id={`text:education:card:${idx}:p:0`} data-cv={`education.items[${idx}].institution`}>{institution}</span>
                    </div>
                    {edu.location && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {edu.location}
                      </div>
                    )}
                  </div>

                  {desc && (
                    <p
                      className="text-xs text-slate-600 leading-relaxed pt-1"
                      data-node-id={`text:education:card:${idx}:p:1`}
                      data-cv={`education.items[${idx}].description`}
                    >
                      {desc}
                    </p>
                  )}
                </div>

                {field && (
                  <div
                    className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium"
                    data-node-id={`text:education:card:${idx}:field:0`}
                    data-cv={`education.items[${idx}].field`}
                  >
                    Field of Study: <strong className="text-slate-800">{field}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
