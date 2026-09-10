import React from 'react';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';

export default function Education({ data = {} }) {
  const educationList = Array.isArray(data.education)
    ? data.education
    : (Array.isArray(data.education?.items)
      ? data.education.items
      : (Array.isArray(data.data?.education)
        ? data.data.education
        : (Array.isArray(data.content?.education)
          ? data.content.education
          : (Array.isArray(data.resume?.education)
            ? data.resume.education
            : []))));

  if (!educationList || educationList.length === 0) {
    return null;
  }

  const eyebrow = data.educationEyebrow || data.education?.eyebrow || "06 / Foundation";
  const sectionTitle = data.educationTitle || data.education?.title || "Education";

  return (
    <section id="education" data-cv-section="education" data-node-id="container:education:section:0" className="py-20 sm:py-28 md:py-36 border-b border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span data-node-id="text:education:eyebrow:0" className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-3" data-cv="education.eyebrow">
            {eyebrow}
          </span>
          <h2 data-node-id="text:education:title:0" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] break-normal whitespace-normal hyphens-none leading-[1.15] max-w-full" data-cv="education.title">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12" data-cv-collection="education.items">
          {educationList.map((item, idx) => {
            const startYear = item.startDate || item.startYear || item.start || (typeof item.period === 'string' ? item.period.split(/[-–—]/)[0]?.trim() : "");
            const endYear = item.endDate || item.endYear || item.end || item.graduationYear || item.year || item.years || (typeof item.period === 'string' ? item.period.split(/[-–—]/)[1]?.trim() : "");
            const periodStr = (startYear && endYear && startYear !== endYear)
              ? `${startYear} – ${endYear}`
              : (item.period || (startYear && endYear ? `${startYear} – ${endYear}` : (startYear ? `${startYear} – Present` : (endYear || ""))));

            const degreeTitle = item.degree || item.program || item.title || item.credential || "";
            const fieldOfStudy = item.field || item.fieldOfStudy || item.department || item.specialization || item.major || "";
            const schoolName = item.institution || item.school || item.university || item.organization || item.college || "";
            const detailsText = item.details || item.description || item.desc || item.grade || item.gpa || item.summary || "";

            return (
              <article
                key={item.id || idx}
                data-cv={`education.items[${idx}]`}
                data-node-id={`container:education:card:${idx}`}
                className="card education-item p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm hover:border-[#111111] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Dates & Icon */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    {periodStr ? (
                      <div data-node-id={`container:education:card:${idx}:date:0`}>
                        <span
                          className="text-xs font-bold text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] uppercase tracking-wider px-3.5 py-1.5 bg-[#F2EEE9] rounded-full inline-block break-normal"
                          data-node-id={`text:education:card:${idx}:span:0`}
                          data-cv={`education.items[${idx}].period`}
                        >
                          {periodStr}
                        </span>
                      </div>
                    ) : <div />}
                    <div data-node-id={`container:education:card:${idx}:icon:0`} className="w-10 h-10 rounded-xl bg-[#F2EEE9] flex items-center justify-center text-[#555555] shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Degree / Title */}
                  {degreeTitle && (
                    <h3
                      className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] mb-2 break-normal whitespace-normal hyphens-none leading-snug"
                      data-node-id={`text:education:card:${idx}:h3:0`}
                      data-cv={`education.items[${idx}].degree`}
                    >
                      {degreeTitle}
                    </h3>
                  )}

                  {/* Field of Study / Department */}
                  {fieldOfStudy && (
                    <p
                      className="text-base sm:text-lg font-bold text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] mb-2 break-normal whitespace-normal hyphens-none"
                      data-node-id={`text:education:card:${idx}:field:0`}
                      data-cv={`education.items[${idx}].field`}
                    >
                      {fieldOfStudy}
                    </p>
                  )}

                  {/* Institution / University */}
                  {schoolName && (
                    <p
                      className="text-sm sm:text-base font-semibold text-[#666666] mb-4 break-normal"
                      data-node-id={`text:education:card:${idx}:p:0`}
                      data-cv={`education.items[${idx}].institution`}
                    >
                      {schoolName}
                    </p>
                  )}

                  {/* Description & Details */}
                  {detailsText && (
                    <p
                      className="text-sm sm:text-[15px] text-[#555555] leading-relaxed sm:leading-[1.75] break-normal whitespace-normal font-normal pt-2 border-t border-[#E5E0D8]/60"
                      data-node-id={`text:education:card:${idx}:p:1`}
                      data-cv={`education.items[${idx}].description`}
                    >
                      {detailsText}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
