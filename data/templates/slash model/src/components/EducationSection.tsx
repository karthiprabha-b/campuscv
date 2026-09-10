'use client';

import React from 'react';

export interface EducationItem {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  period: string;
  description: string;
  honors?: string;
}

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science & Information Systems',
    institution: 'Warsaw University of Technology',
    period: '2016 - 2020',
    description: 'Specialized in Distributed Software Architecture, Human-Computer Interaction, and Modern Compiler Design. Graduated top 5% of class.',
    honors: 'SUMMA CUM LAUDE'
  },
  {
    degree: 'Advanced Certificate',
    fieldOfStudy: 'UX & Interface Architecture',
    institution: 'Interaction Design Foundation',
    period: '2019 - 2020',
    description: 'Comprehensive study of typography hierarchies, cognitive interaction models, spatial harmony, and accessibility standards.',
    honors: 'HONORS DISTINCTION'
  }
];

interface EducationSectionProps {
  data?: any;
}

export default function EducationSection({ data = {} }: EducationSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:education:root:div:title']?.value ||
    data?.educationTitle ||
    data?.education?.title ||
    'Education';

  const userEdu = Array.isArray(data?.education) 
    ? data.education 
    : (Array.isArray(data?.education?.items)
      ? data.education.items
      : (Array.isArray(data?.academics) 
        ? data.academics 
        : (Array.isArray(data?.academics?.items)
          ? data.academics.items
          : (Array.isArray(data?.resume?.education)
            ? data.resume.education
            : (Array.isArray(data?.profile?.education)
              ? data.profile.education
              : (Array.isArray(data?.data?.education)
                ? data.data.education
                : null))))));

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let rawList: any[] = [];
  if (Array.isArray(userEdu)) {
    rawList = userEdu;
  } else if (!hasCustomData) {
    rawList = DEFAULT_EDUCATION;
  }

  // If no education data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  const educationList: EducationItem[] = rawList.map((edu: any) => {
    const rawDegree = String(edu.degree || edu.qualification || edu.studyType || edu.program || edu.title || '').trim();
    const rawField = String(edu.fieldOfStudy || edu.field || edu.major || edu.course || edu.specialization || edu.branch || edu.department || edu.area || '').trim();
    
    let degreeTitle = rawDegree;
    let fieldOfStudy = rawField;

    // If degree contains " in " and field is not provided, split them
    if (rawDegree && !rawField && rawDegree.toLowerCase().includes(' in ')) {
      const parts = rawDegree.split(/ in /i);
      degreeTitle = parts[0].trim();
      fieldOfStudy = parts.slice(1).join(' in ').trim();
    } else if (!rawDegree && rawField) {
      degreeTitle = 'Degree / Major';
      fieldOfStudy = rawField;
    } else if (!rawDegree && !rawField) {
      degreeTitle = 'Bachelor of Technology';
      fieldOfStudy = 'Computer Science & Engineering';
    }

    const school = edu.institution || edu.school || edu.university || edu.college || edu.organization || 'University';
    const start = String(edu.startDate || edu.startYear || edu.start || edu.from || '').trim();
    const end = String(edu.endDate || edu.endYear || edu.graduationYear || edu.end || edu.to || '').trim();
    let period = String(edu.period || edu.duration || edu.dates || edu.year || '').trim();
    if (!period && start && end && start !== end) {
      period = `${start} – ${end}`;
    } else if (!period && start) {
      period = start;
    } else if (!period && end) {
      period = end;
    }

    const description = edu.description || edu.summary || edu.details || (edu.highlights ? (Array.isArray(edu.highlights) ? edu.highlights.join('. ') : edu.highlights) : '');
    
    // Honors or Grade
    const honors = edu.honors || (edu.gpa ? `GPA: ${edu.gpa}` : (edu.cgpa ? `CGPA: ${edu.cgpa}` : (edu.grade ? `Grade: ${edu.grade}` : (edu.score ? `Score: ${edu.score}` : undefined))));

    return {
      degree: degreeTitle,
      fieldOfStudy: fieldOfStudy,
      institution: school,
      period,
      description,
      honors
    };
  });

  return (
    <section 
      id="education" 
      data-section="education"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:education:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            data-node-id="text:education:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:education:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-700 mt-4 font-normal">
            Academic qualifications, theoretical fundamentals, and engineering coursework.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {(Array.isArray(educationList) ? educationList : DEFAULT_EDUCATION).map((edu, idx) => {
            const eduDegree = contentOverrides[`text:education:${idx}:degree`]?.value || edu.degree;
            const eduField = contentOverrides[`text:education:${idx}:field`]?.value || edu.fieldOfStudy;
            const eduSchool = contentOverrides[`text:education:${idx}:school`]?.value || edu.institution;
            const eduPeriod = contentOverrides[`text:education:${idx}:period`]?.value || edu.period;
            const eduDesc = contentOverrides[`text:education:${idx}:desc`]?.value || edu.description;

            return (
              <div
                key={idx}
                data-node-id={`card:education:${idx}`}
                data-node-type="card"
                className="bg-white border-3 border-black p-7 sm:p-9 shadow-solid-md flex flex-col justify-between hover:-translate-y-1.5 hover:border-[var(--primary,#000000)] transition-all text-black"
                style={styleOverrides[`card:education:${idx}`]}
              >
                <div>
                  {/* Period & Honors Bar */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div 
                      data-node-id={`text:education:${idx}:period`}
                      data-node-type="text"
                      className="font-mono text-xs font-bold text-neutral-500"
                    >
                      {eduPeriod}
                    </div>
                    {edu.honors && (
                      <span className="font-mono text-[11px] font-black px-2.5 py-0.5 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] shadow-solid-sm">
                        {edu.honors}
                      </span>
                    )}
                  </div>

                  {/* Degree Title */}
                  <h3 
                    data-node-id={`text:education:${idx}:degree`}
                    data-node-type="text"
                    className="font-heading font-black text-xl sm:text-2xl text-black mb-1 leading-snug"
                  >
                    {eduDegree}
                  </h3>

                  {/* Field of Study / Major */}
                  {eduField && (
                    <div 
                      data-node-id={`text:education:${idx}:field`}
                      data-node-type="text"
                      className="font-heading font-bold text-sm sm:text-base tracking-wide text-[var(--primary,#000000)] mb-2"
                    >
                      {eduField}
                    </div>
                  )}

                  {/* Institution / College */}
                  <div 
                    data-node-id={`text:education:${idx}:school`}
                    data-node-type="text"
                    className="font-heading font-semibold text-xs sm:text-sm text-neutral-700 mb-4"
                  >
                    {eduSchool}
                  </div>

                  {/* Description / Coursework */}
                  {eduDesc ? (
                    <p 
                      data-node-id={`text:education:${idx}:desc`}
                      data-node-type="text"
                      className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal pt-3 border-t border-neutral-200"
                    >
                      {eduDesc}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Geometric Wave Divider */}
        <div className="geometric-divider" aria-hidden="true">
          <svg viewBox="0 0 32 12"><path d="M0,6 Q4,0 8,6 T16,6 T24,6 T32,6"/></svg>
        </div>

      </div>
    </section>
  );
}
