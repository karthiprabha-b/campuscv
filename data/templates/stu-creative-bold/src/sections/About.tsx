"use client";

import React from "react";
import { BookOpen, Briefcase, Award, Heart } from "lucide-react";
import { AboutData } from "@/data/portfolio";
import AnimatedCounter from "@/components/AnimatedCounter";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen className="w-6 h-6 text-[#FFC107] stroke-[2]" />;
    case "Briefcase":
      return <Briefcase className="w-6 h-6 text-[#FFC107] stroke-[2]" />;
    case "Award":
      return <Award className="w-6 h-6 text-[#FFC107] stroke-[2]" />;
    case "Heart":
      return <Heart className="w-6 h-6 text-[#FFC107] stroke-[2]" />;
    default:
      return <BookOpen className="w-6 h-6 text-[#FFC107] stroke-[2]" />;
  }
};

interface AboutProps {
  data?: any;
  about?: Partial<AboutData>;
}

export default function About(props: AboutProps = {}) {
  const incoming = props.about || props.data?.about || props.data || {};
  
  const about: AboutData = {
    title: incoming.title || props.data?.aboutHeading || "ABOUT ME",
    subtitle: incoming.subtitle || props.data?.aboutSubtitle || props.data?.headline || "A Glimpse Into My Journey",
    description: incoming.description || incoming.bio || incoming.story || props.data?.bio || props.data?.aboutMe || props.data?.summary || props.data?.profile?.summary || props.data?.profile?.about || "Passionate professional focused on designing and engineering impactful digital solutions.",
    objective: incoming.objective || incoming.mission || props.data?.objective || "",
    stats: Array.isArray(incoming.stats) ? incoming.stats : (Array.isArray(props.data?.stats) ? props.data.stats : [])
  };

  const hasStats = about.stats && about.stats.length > 0;

  return (
    <section
      id="about"
      data-section="about"
      data-cv-section="about"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 ${hasStats ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'} gap-12 lg:gap-16 items-start`}>
          {/* Left Side: Summary & Career Objective */}
          <div className={`${hasStats ? 'lg:col-span-6' : 'w-full'} space-y-6`}>
            <span
              data-field="about.title"
              data-cv="about.title"
              className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
            >
              {about.title}
            </span>
            <h2
              data-field="about.subtitle"
              data-cv="about.headline"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]"
              style={{ lineHeight: 1.15, letterSpacing: '0.01em', wordSpacing: '0.05em' }}
            >
              {about.subtitle}
            </h2>
            <div className="w-16 h-1 bg-[#FFC107]" style={{ backgroundColor: "#FFC107" }} />
            <p
              data-field="about.description"
              data-cv="about.description"
              className="text-sm sm:text-base leading-relaxed text-[#666666]"
            >
              {about.description}
            </p>

            {/* Objective block */}
            {about.objective && (
              <div className="p-6 bg-[#111111]/5 border-l-4 border-[#FFC107] rounded-r-md">
                <h4 className="text-xs font-black tracking-wider uppercase text-[#111111] mb-2">
                  Career Objective
                </h4>
                <p
                  data-field="about.objective"
                  data-cv="about.objective"
                  className="text-xs sm:text-sm text-[#666666] italic leading-relaxed"
                >
                  &ldquo;{about.objective}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Right Side: Animated Counters Stats Cards */}
          {hasStats && (
            <div
              data-field="about.stats"
              data-cv-collection="stats.items"
              className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {about.stats.map((stat: any, i: number) => (
                <div
                  key={stat.label || i}
                  data-cv={`stats[${i}]`}
                  data-cv-item
                  data-cv-index={i}
                  className="p-6 bg-white border-2 border-[#111111]/10 rounded-md flex flex-col justify-between shadow-sm transition-all duration-300 group hover:border-[#FFC107] hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#111111]/5 rounded-full group-hover:bg-[#FFC107]/20 transition-colors">
                      {getIcon(stat.icon)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black tracking-tight text-[#111111] mb-1 flex items-baseline">
                      <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : parseInt(String(stat.value)) || 0} />
                      <span className="text-[#FFC107] text-3xl font-black ml-0.5">
                        {stat.suffix}
                      </span>
                    </h3>
                    <span className="text-xs sm:text-sm font-bold text-[#666666]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
