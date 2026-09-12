"use client";

import React from "react";
import { GraduationCap, Calendar, Star } from "lucide-react";
import { EducationItem } from "@/data/portfolio";

interface EducationProps {
  data?: any;
  education?: EducationItem[];
}

export default function Education(props: EducationProps = {}) {
  const rawEdu = (Array.isArray(props.education) && props.education.length > 0)
    ? props.education
    : (Array.isArray(props.data?.education) && props.data.education.length > 0)
      ? props.data.education
      : (Array.isArray(props.data?.canonicalProfile?.education) && props.data.canonicalProfile.education.length > 0)
        ? props.data.canonicalProfile.education
        : (Array.isArray(props.data?.academics) && props.data.academics.length > 0)
          ? props.data.academics
          : (Array.isArray(props.data?.educationHistory) && props.data.educationHistory.length > 0)
            ? props.data.educationHistory
            : (Array.isArray(props.data?.resume?.education) && props.data.resume.education.length > 0)
              ? props.data.resume.education
              : [];

  if (!rawEdu || !Array.isArray(rawEdu) || rawEdu.length === 0) {
    return null;
  }

  // Filter out demo education if real education exists
  const isDemoEdu = (e: any) => {
    const inst = (e.institution || e.school || e.university || '').toLowerCase();
    return inst.includes('stanford university') || inst.includes('berkeley');
  };

  const hasReal = rawEdu.some((e: any) => !isDemoEdu(e));
  const candidateList = hasReal ? rawEdu.filter((e: any) => !isDemoEdu(e)) : rawEdu;

  const educationList: EducationItem[] = candidateList.map((edu: any) => {
    const start = (edu.startDate || edu.startYear || edu.start || "").toString().trim();
    const end = (edu.endDate || edu.endYear || edu.end || edu.graduationYear || "").toString().trim();
    const period = (edu.period || edu.duration || edu.year || edu.years || (start && end ? `${start} — ${end}` : (start || end || ""))).toString().trim();

    return {
      degree: edu.degree || edu.title || edu.major || edu.qualification || edu.course || "Degree / Academic Program",
      institution: edu.institution || edu.school || edu.university || edu.college || "Institution",
      duration: period,
      grade: edu.grade || edu.gpa || edu.score || edu.cgpa || "",
      description: edu.description || edu.details || (Array.isArray(edu.highlights) ? edu.highlights.join(" ") : "") || ""
    };
  });

  if (educationList.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      data-section="education"
      data-cv-section="education"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 items-center text-center space-y-3">
          <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
            Academics
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
            EDUCATION HISTORY
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#111111]/10 pl-6 sm:pl-8 space-y-12">
          {educationList.map((edu: EducationItem, idx: number) => (
            <div
              key={edu.degree || idx}
              data-cv={`education[${idx}]`}
              data-cv-item
              data-cv-index={idx}
              className="relative group"
            >
              {/* Timeline Bullet Node */}
              <div
                className="absolute left-[-33px] sm:left-[-41px] top-1 z-10 p-1.5 sm:p-2 rounded-full bg-[#111111] text-[#FAF9F6] border-4 border-[#FAF9F6] group-hover:bg-[#FFC107] group-hover:text-[#111111] transition-all duration-300 shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2]" />
              </div>

              {/* Card Container */}
              <div className="p-6 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107]/60 transition-colors duration-300 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-black text-[#FFC107] tracking-wider uppercase">
                      {edu.institution}
                    </span>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-[#111111] mt-0.5">
                      {edu.degree}
                    </h3>
                  </div>

                  {/* Year Tag & GPA */}
                  <div className="flex flex-wrap items-center gap-2">
                    {edu.duration && (
                      <div className="inline-flex items-center text-[10px] sm:text-xs font-bold bg-[#111111]/5 px-2.5 py-1 text-[#666666] rounded-full">
                        <Calendar className="w-3 h-3 mr-1 opacity-70" />
                        {edu.duration}
                      </div>
                    )}

                    {edu.grade && (
                      <div
                        className="inline-flex items-center text-[10px] sm:text-xs font-black text-[#111111] px-2.5 py-1 border border-[#FFC107]/40 rounded-full"
                        style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
                      >
                        <Star className="w-3 h-3 mr-1 fill-current stroke-[2] text-[#FFC107]" />
                        {edu.grade}
                      </div>
                    )}
                  </div>
                </div>

                {edu.description && (
                  <p className="text-xs sm:text-sm leading-relaxed text-[#666666]">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
