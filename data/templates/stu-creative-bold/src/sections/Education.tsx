"use client";

import React from "react";
import { GraduationCap, Calendar, Star } from "lucide-react";
import { educationHistory as fallbackEducation, EducationItem } from "@/data/portfolio";

interface EducationProps {
  data?: any;
  education?: EducationItem[];
}

export default function Education(props: EducationProps = {}) {
  const educationList: EducationItem[] = Array.isArray(props.education) && props.education.length > 0
    ? props.education
    : (Array.isArray(props.data?.education) && props.data.education.length > 0
      ? props.data.education
      : (Array.isArray(props.data?.academics) && props.data.academics.length > 0
        ? props.data.academics
        : fallbackEducation));

  return (
    <section
      id="education"
      data-section="education"
      data-node-id="section:education:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 items-center text-center space-y-3">
          <span
            data-field="education.subtitle"
            className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
          >
            Academics
          </span>
          <h2
            data-field="education.title"
            data-node-id="text:education:root:h2:0"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
          >
            EDUCATION HISTORY
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#111111]/10 pl-6 sm:pl-8 space-y-12">
          {educationList.map((edu: EducationItem, idx: number) => (
            <div
              key={edu.degree || idx}
              data-node-id={`container:education:card:${idx}`}
              className="relative group"
            >
              {/* Timeline Bullet Node */}
              <div
                className="absolute left-[-33px] sm:left-[-41px] top-1 z-10 p-1.5 sm:p-2 rounded-full bg-[#111111] text-[#FAF9F6] border-4 border-[#FAF9F6] group-hover:bg-[#FFC107] group-hover:text-[#111111] transition-colors duration-150 shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2]" />
              </div>

              {/* Card Container */}
              <div className="p-6 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107]/60 transition-colors duration-150 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span
                      data-field={`education[${idx}].institution`}
                      data-node-id={`text:education:card:${idx}:institution`}
                      className="text-[10px] font-black text-[#FFC107] tracking-wider uppercase"
                    >
                      {edu.institution}
                    </span>
                    <h3
                      data-field={`education[${idx}].degree`}
                      data-node-id={`text:education:card:${idx}:degree`}
                      className="text-base sm:text-lg font-black tracking-tight text-[#111111] mt-0.5"
                    >
                      {edu.degree}
                    </h3>
                  </div>

                  {/* Year Tag & GPA */}
                  <div className="flex flex-wrap items-center gap-2">
                    {edu.duration && (
                      <div
                        data-field={`education[${idx}].duration`}
                        data-node-id={`text:education:card:${idx}:duration`}
                        className="inline-flex items-center text-[10px] sm:text-xs font-bold bg-[#111111]/5 px-2.5 py-1 text-[#666666] rounded-full"
                      >
                        <Calendar className="w-3 h-3 mr-1 opacity-70" />
                        {edu.duration}
                      </div>
                    )}

                    {edu.grade && (
                      <div
                        data-field={`education[${idx}].grade`}
                        data-node-id={`text:education:card:${idx}:grade`}
                        className="inline-flex items-center text-[10px] sm:text-xs font-black text-[#111111] px-2.5 py-1 border border-[#FFC107]/40 rounded-full"
                        style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
                      >
                        <Star className="w-3 h-3 mr-1 text-[#FFC107] fill-current" />
                        {edu.grade}
                      </div>
                    )}
                  </div>
                </div>

                {/* Major / Field of Study */}
                {edu.field && (
                  <p
                    data-field={`education[${idx}].field`}
                    data-node-id={`text:education:card:${idx}:field`}
                    className="text-xs sm:text-sm font-semibold text-[#111111] mb-2"
                  >
                    Major: {edu.field}
                  </p>
                )}

                {/* Description */}
                {edu.description && (
                  <p
                    data-field={`education[${idx}].description`}
                    data-node-id={`text:education:card:${idx}:desc`}
                    className="text-xs sm:text-sm text-[#666666] leading-relaxed"
                  >
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
