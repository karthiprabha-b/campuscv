'use client';

import React from 'react';
import { useTheme } from '../ThemeContext';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle
} from 'lucide-react';

const DEFAULT_EDUCATION = [
  {
    id: "edu-1",
    degree: "M.S. in Computer Science & Distributed Systems",
    institution: "Stanford University",
    location: "Stanford, CA",
    period: "2018 — 2020",
    grade: "GPA 3.94 / 4.0",
    honors: [
      "Graduate Fellowship for Outstanding Research",
      "Dean's Distinguished Honor List (All Semesters)"
    ],
    courses: [
      "Distributed Systems",
      "Cloud Infrastructure",
      "Advanced Algorithms",
      "Human-Computer Interaction"
    ]
  },
  {
    id: "edu-2",
    degree: "B.S. in Software Engineering & Mathematics",
    institution: "UC Berkeley",
    location: "Berkeley, CA",
    period: "2014 — 2018",
    grade: "Summa Cum Laude (GPA 3.91)",
    honors: [
      "Departmental Honors in Computer Science",
      "1st Place — Annual CalHacks Hackathon (2017)"
    ],
    courses: [
      "Operating Systems",
      "Database Internals",
      "Compilers",
      "Computer Graphics & UI Systems"
    ]
  }
];

interface EducationCardProps {
  data?: any;
  cardNumber?: number;
  totalCards?: number;
}

export const EducationCard: React.FC<EducationCardProps> = React.memo(({
  data,
  cardNumber = 3,
  totalCards = 8
}) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const rawEdu = data?.education || data?.academics;
  const educationList = Array.isArray(rawEdu) && rawEdu.length > 0 ? rawEdu : DEFAULT_EDUCATION;
  const { accentClass } = useTheme();

  const title =
    contentOverrides['text:education:root:div:title']?.value ||
    data?.educationTitle ||
    'Academic Background';

  return (
    <div 
      data-section="education" 
      data-cv-section="education" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:education:root:section:0']}
    >
      {/* Background Accent Glow */}
      <div 
        className={`absolute top-0 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 0{cardNumber} / 0{totalCards}</div>
            <h2 
              data-node-id="text:education:root:div:title"
              data-node-type="text"
              data-cv="education.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Degrees & Honors
        </div>
      </div>

      {/* Education Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-auto" data-cv-section="education" data-cv-collection="education.items">
        {educationList.map((edu: any, idx: number) => {
          const honors = Array.isArray(edu.honors) ? edu.honors : (edu.honors ? [String(edu.honors)] : []);
          const courses = Array.isArray(edu.courses) ? edu.courses : (edu.courses ? [String(edu.courses)] : []);
          const degreeName = edu.degree || edu.title || edu.qualification || (idx === 0 ? 'Master of Science' : 'Bachelor of Science');
          const institutionName = edu.institution || edu.school || edu.university || 'University';
          const periodText = edu.period || edu.year || edu.date || '2019 - 2023';

          return (
            <div
              key={edu.id || idx}
              data-cv={`education.items[${idx}]`}
              data-cv-item="education"
              data-cv-index={idx}
              className="group relative p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Indicator */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span 
                  data-node-id={`text:education:items:${idx}:badge`}
                  data-node-type="text"
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${accentClass.badge}`}
                >
                  {degreeName}
                </span>

                <div 
                  data-node-id={`text:education:items:${idx}:period`}
                  data-node-type="text"
                  data-cv={`education.items[${idx}].period`}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{periodText}</span>
                </div>
              </div>

              {/* Institution & Degree */}
              <div className="space-y-1 mb-3">
                <h3 
                  data-node-id={`text:education:items:${idx}:institution`}
                  data-node-type="text"
                  data-cv={`education.items[${idx}].institution`}
                  className="text-lg sm:text-xl font-bold text-white group-hover:text-white transition-colors"
                >
                  {institutionName}
                </h3>
                <p 
                  data-node-id={`text:education:items:${idx}:degree`}
                  data-node-type="text"
                  data-cv={`education.items[${idx}].degree`}
                  className={`text-xs sm:text-sm font-medium ${accentClass.text}`}
                >
                  {edu.degree} {edu.field ? <>· <span className="text-zinc-300 font-normal">{edu.field}</span></> : null}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5">
                  {edu.location && (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span 
                        data-node-id={`text:education:items:${idx}:location`}
                        data-node-type="text"
                        data-cv={`education.items[${idx}].location`}
                      >
                        {edu.location}
                      </span>
                    </>
                  )}
                  {edu.grade && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span 
                        data-node-id={`text:education:items:${idx}:grade`}
                        data-node-type="text"
                        data-cv={`education.items[${idx}].grade`}
                        className="text-emerald-400 font-mono font-semibold"
                      >
                        {edu.grade}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Honors */}
              {honors.length > 0 && (
                <div className="space-y-1.5 mb-3" data-cv="education.honors">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Honors & Recognition</span>
                  </div>
                  <div className="space-y-1">
                    {honors.map((honor: any, hIdx: number) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span 
                          data-node-id={`text:education:honor:${idx}:${hIdx}`}
                          data-node-type="text"
                          data-cv="education.honor"
                        >
                          {typeof honor === 'string' ? honor : (honor?.title || honor?.name || String(honor))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Coursework */}
              {courses.length > 0 && (
                <div className="space-y-1.5 pt-2.5 border-t border-white/5" data-cv="education.courses">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Key Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {courses.map((course: any, cIdx: number) => (
                      <span
                        key={cIdx}
                        data-node-id={`text:education:course:${idx}:${cIdx}`}
                        data-node-type="text"
                        data-cv="education.course"
                        className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[10px] text-zinc-300"
                      >
                        {typeof course === 'string' ? course : (course?.name || course?.title || String(course))}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

EducationCard.displayName = 'EducationCard';
