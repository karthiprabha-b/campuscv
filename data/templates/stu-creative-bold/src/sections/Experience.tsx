"use client";

import React from "react";
import { Briefcase, Calendar } from "lucide-react";
import { experiences as fallbackExperiences, ExperienceItem } from "@/data/portfolio";

interface ExperienceProps {
  data?: any;
  experiences?: ExperienceItem[];
}

export default function Experience(props: ExperienceProps = {}) {
  const experiencesList: ExperienceItem[] = Array.isArray(props.experiences) && props.experiences.length > 0
    ? props.experiences
    : (Array.isArray(props.data?.experiences) && props.data.experiences.length > 0
      ? props.data.experiences
      : (Array.isArray(props.data?.experience) && props.data.experience.length > 0
        ? props.data.experience
        : (Array.isArray(props.data?.work) && props.data.work.length > 0
          ? props.data.work
          : fallbackExperiences)));

  return (
    <section
      id="experience"
      data-section="experience"
      data-node-id="section:experience:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 items-center text-center space-y-3">
          <span
            data-field="experience.subtitle"
            className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
          >
            Career
          </span>
          <h2
            data-field="experience.title"
            data-node-id="text:experience:root:h2:0"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
          >
            WORK EXPERIENCE
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Timeline Cards Container */}
        <div className="relative border-l-2 border-[#111111]/10 pl-6 sm:pl-8 space-y-12">
          {experiencesList.map((exp: ExperienceItem, idx: number) => {
            const bullets: string[] = Array.isArray(exp.description)
              ? exp.description
              : (typeof exp.description === 'string' ? [exp.description] : []);

            return (
              <div
                key={exp.company || idx}
                data-node-id={`container:experience:card:${idx}`}
                className="relative group"
              >
                {/* Timeline Bullet Node */}
                <div className="absolute left-[-33px] sm:left-[-41px] top-1 z-10 p-1.5 sm:p-2 rounded-full bg-[#111111] text-[#FAF9F6] border-4 border-[#FAF9F6] group-hover:bg-[#FFC107] group-hover:text-[#111111] transition-colors duration-150 shadow-sm">
                  <Briefcase className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2]" />
                </div>

                {/* Card Container */}
                <div className="p-6 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107]/60 transition-colors duration-150 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <span
                        data-field={`experience[${idx}].company`}
                        data-node-id={`text:experience:card:${idx}:company`}
                        className="text-[10px] font-black text-[#FFC107] tracking-wider uppercase"
                      >
                        {exp.company}
                      </span>
                      <h3
                        data-field={`experience[${idx}].role`}
                        data-node-id={`text:experience:card:${idx}:role`}
                        className="text-base sm:text-lg font-black tracking-tight text-[#111111] mt-0.5"
                      >
                        {exp.role}
                      </h3>
                    </div>

                    {/* Year Tag */}
                    {exp.duration && (
                      <div
                        data-field={`experience[${idx}].duration`}
                        data-node-id={`text:experience:card:${idx}:duration`}
                        className="inline-flex items-center text-[10px] sm:text-xs font-bold bg-[#111111]/5 px-2.5 py-1 text-[#666666] rounded-full w-fit"
                      >
                        <Calendar className="w-3 h-3 mr-1 opacity-70" />
                        {exp.duration}
                      </div>
                    )}
                  </div>

                  {/* Bullets List */}
                  {bullets.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {bullets.map((bullet: string, bIdx: number) => (
                        <li
                          key={bIdx}
                          data-field={`experience[${idx}].description[${bIdx}]`}
                          data-node-id={`text:experience:card:${idx}:bullet:${bIdx}`}
                          className="text-xs sm:text-sm text-[#666666] leading-relaxed flex items-start"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] mt-2 mr-2.5 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
