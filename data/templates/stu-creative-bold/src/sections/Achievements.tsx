"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { achievements as fallbackAchievements, AchievementItem } from "@/data/portfolio";

interface AchievementsProps {
  data?: any;
  achievements?: AchievementItem[];
}

export default function Achievements(props: AchievementsProps = {}) {
  const achievementsList: AchievementItem[] = Array.isArray(props.achievements) && props.achievements.length > 0
    ? props.achievements
    : (Array.isArray(props.data?.achievements) && props.data.achievements.length > 0
      ? props.data.achievements
      : (Array.isArray(props.data?.awards) && props.data.awards.length > 0
        ? props.data.awards
        : fallbackAchievements));

  return (
    <section
      id="achievements"
      data-section="achievements"
      data-node-id="section:achievements:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col mb-16 space-y-3">
          <span
            data-field="achievements.subtitle"
            className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
          >
            Milestones
          </span>
          <h2
            data-field="achievements.title"
            data-node-id="text:achievements:root:h2:0"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
          >
            HONORS & ACHIEVEMENTS
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievementsList.map((ach: AchievementItem, idx: number) => (
            <div
              key={ach.title || idx}
              data-node-id={`container:achievements:card:${idx}`}
              className="p-6 bg-white border-2 border-[#111111]/10 rounded-md flex flex-col justify-between shadow-xs hover:border-[#FFC107] transition-colors duration-150 group"
            >
              <div>
                {/* Milestone Icon */}
                <div
                  className="p-3 rounded-full w-fit mb-4 group-hover:bg-[#FFC107] transition-colors duration-150"
                  style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
                >
                  <Trophy className="w-5 h-5 text-[#111111] stroke-[2]" />
                </div>

                {/* Big Year/Score Value */}
                <div className="text-2xl font-black text-[#111111] tracking-tight mb-2 flex items-baseline">
                  <span
                    data-field={`achievements[${idx}].value`}
                    data-node-id={`text:achievements:card:${idx}:value`}
                    className="text-[#FFC107]"
                  >
                    {ach.value}
                  </span>
                </div>

                <span
                  data-field={`achievements[${idx}].organization`}
                  data-node-id={`text:achievements:card:${idx}:org`}
                  className="text-[10px] font-black text-[#666666] tracking-wider uppercase"
                >
                  {ach.organization}
                </span>

                <h3
                  data-field={`achievements[${idx}].title`}
                  data-node-id={`text:achievements:card:${idx}:title`}
                  className="text-sm sm:text-base font-black tracking-tight text-[#111111] mt-1 leading-tight group-hover:text-[#111111] transition-colors duration-150"
                >
                  {ach.title}
                </h3>
              </div>

              {ach.description && (
                <p
                  data-field={`achievements[${idx}].description`}
                  data-node-id={`text:achievements:card:${idx}:description`}
                  className="text-xs text-[#666666] leading-relaxed mt-4 pt-4 border-t border-[#111111]/10"
                >
                  {ach.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

