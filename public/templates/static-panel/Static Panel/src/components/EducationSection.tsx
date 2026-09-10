"use client";

import React from "react";
import { GraduationCap, Award, CheckCircle2, Calendar, Sparkles, BookOpen } from "lucide-react";

const DEFAULT_EDUCATION = [
  {
    id: "edu-1",
    degree: "B.S. in Computer Science & Engineering",
    school: "University of California, Berkeley",
    fieldOfStudy: "Honors Program (EECS)",
    period: "2022 – 2026",
    gpa: "3.92 / 4.00",
    honors: [
      "Dean's Honors List (All Semesters)",
      "Recipient of Berkeley EECS Undergraduate Excellence Scholarship",
      "Undergraduate Research Assistant at Berkeley AI Research (BAIR)"
    ],
    coursework: [
      "CS 162: Operating Systems & System Programming",
      "CS 189: Introduction to Machine Learning",
      "CS 186: Introduction to Database Systems",
      "CS 170: Efficient Algorithms & Intractable Problems",
      "CS 61C: Computer Architecture & Machine Structures"
    ]
  }
];

interface EducationSectionProps {
  data?: any;
}

export default function EducationSection({ data = {} }: EducationSectionProps) {
  // If user explicitly provided an empty array, return null
  if (Array.isArray(data?.education) && data.education.length === 0) {
    return null;
  }

  const rawEdu = (Array.isArray(data?.education) && data.education.length > 0)
    ? data.education
    : ((Array.isArray(data?.academics) && data.academics.length > 0)
        ? data.academics
        : ((Array.isArray(data?.educationList) && data.educationList.length > 0)
            ? data.educationList
            : DEFAULT_EDUCATION));

  const educationList = rawEdu.map((edu: any, idx: number) => {
    const degree = edu.degree || edu.title || edu.qualification || "Degree Program";
    const school = edu.school || edu.institution || edu.university || edu.college || "University";
    const fieldOfStudy = edu.fieldOfStudy || edu.department || edu.specialization || edu.major || "";

    const start = String(edu.startYear || edu.startDate || edu.from || '').trim();
    const end = String(edu.endYear || edu.endDate || edu.to || (edu.current ? 'Present' : '')).trim();
    let period = String(edu.period || edu.duration || edu.year || '').trim();
    if (!period && start && end && start !== end) {
      period = `${start} – ${end}`;
    } else if (!period && start) {
      period = edu.current ? `${start} – Present` : start;
    } else if (!period && end) {
      period = end;
    }

    const gpa = edu.gpa || edu.cgpa || edu.grade || "";
    const description = edu.description || edu.desc || edu.details || edu.summary || "";
    const honors = Array.isArray(edu.honors) ? edu.honors : (Array.isArray(edu.bullets) ? edu.bullets : (Array.isArray(edu.highlights) ? edu.highlights : (description ? [description] : [])));
    const coursework = Array.isArray(edu.coursework) ? edu.coursework : (Array.isArray(edu.courses) ? edu.courses : (Array.isArray(edu.skills) ? edu.skills : []));

    return {
      id: edu.id || `edu-${idx}`,
      degree,
      school,
      fieldOfStudy,
      period,
      gpa,
      honors,
      coursework
    };
  });

  if (educationList.length === 0) return null;

  return (
    <section id="education" data-cv-section="education" className="py-12 sm:py-16 border-b border-gray-200/80 scroll-mt-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-200/50">
          <GraduationCap className="w-3.5 h-3.5" />
          <span data-cv="education.eyebrow">Academic Background</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
          Education & Honors
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl" data-cv="education.description">
          Academic credentials, specialized coursework, and campus leadership.
        </p>
      </div>

      <div className="flex flex-col gap-6" data-cv-collection="education">
        {educationList.map((edu: any, idx: number) => (
          <div
            key={edu.id}
            className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white hover:border-brand-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_-6px_rgba(0,0,0,0.07)] transition-all duration-300 overflow-hidden"
            data-cv-item={`education[${idx}]`}
          >
            {/* Subtle top-right decorative accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-50/70 to-transparent rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header: Icon, Degree, School & Timeline Badge */}
            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/70 border border-brand-200/60 flex items-center justify-center text-brand-600 flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl leading-snug group-hover:text-brand-700 transition-colors" data-cv={`education[${idx}].degree`}>
                    {edu.degree}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <p className="text-sm sm:text-base font-bold text-gray-800" data-cv={`education[${idx}].institution`}>
                      {edu.school}
                    </p>
                    {edu.fieldOfStudy && (
                      <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200/60">
                        {edu.fieldOfStudy}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side: Period and GPA */}
              <div className="flex items-center sm:flex-col sm:items-end gap-2 flex-wrap self-start sm:self-auto">
                {edu.period && (
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 shadow-2xs" data-cv={`education[${idx}].duration`}>
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>{edu.period}</span>
                  </div>
                )}
                {edu.gpa && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span data-cv={`education[${idx}].gpa`}>
                      {edu.gpa.startsWith("GPA") ? edu.gpa : `GPA: ${edu.gpa}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Honors / Achievements List */}
            {edu.honors && edu.honors.length > 0 && (
              <div className="relative mb-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Honors & Key Highlights</span>
                </div>
                {edu.honors.map((honor: string, hIdx: number) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>{honor}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key Coursework Chips */}
            {edu.coursework && edu.coursework.length > 0 && (
              <div className="relative pt-5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span>Key Coursework & Focus Areas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {edu.coursework.map((course: string, cIdx: number) => (
                    <span
                      key={cIdx}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-700 transition-all duration-150 shadow-2xs"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
