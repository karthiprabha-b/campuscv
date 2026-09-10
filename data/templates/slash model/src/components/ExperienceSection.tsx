'use client';

import React from 'react';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  technologies: string[];
}

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Senior Frontend Architect',
    company: 'Vanguard Digital Solutions',
    period: '2022 - PRESENT',
    location: 'Warsaw / Remote',
    description: 'Spearheading core frontend architecture, establishing micro-frontend governance, and mentoring a cross-functional squad of 8 engineers.',
    bullets: [
      'Architected a unified React / Next.js component system reducing development cycle times by 38%',
      'Eliminated rendering bottlenecks across real-time telemetry dashboards, improving INP scores from 220ms to 42ms',
      'Instituted automated accessibility (a11y) linters and strict WCAG AA testing protocols in CI/CD pipelines'
    ],
    technologies: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest']
  },
  {
    role: 'Lead UI / UX Engineer',
    company: 'Hyperion Tech Labs',
    period: '2020 - 2022',
    location: 'Krakow, Poland',
    description: 'Designed and built interactive data visualization platforms, custom WebGL widgets, and high-conversion client onboarding flows.',
    bullets: [
      'Designed 40+ atomic Figma UI kits and engineered pixel-perfect drop-in React implementations',
      'Collaborated closely with backend teams to develop type-safe OpenAPI endpoints and WebSocket clients',
      'Reduced initial page payload sizes by 52% using dynamic route chunking and lazy asset loading'
    ],
    technologies: ['React', 'TypeScript', 'Storybook', 'Figma', 'Node.js', 'PostgreSQL']
  }
];

interface ExperienceSectionProps {
  data?: any;
}

export default function ExperienceSection({ data = {} }: ExperienceSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:experience:root:div:title']?.value ||
    data?.experienceTitle ||
    'Experience';

  const userExp = Array.isArray(data?.experience) ? data.experience : (Array.isArray(data?.timeline) ? data.timeline : (Array.isArray(data?.work) ? data.work : null));

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let rawList: any[] = [];
  if (Array.isArray(userExp)) {
    rawList = userExp;
  } else if (!hasCustomData) {
    rawList = DEFAULT_EXPERIENCE;
  }

  // If no experience data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  const experiences: ExperienceItem[] = rawList.map((exp: any, idx: number) => {
    const rawBullets = Array.isArray(exp.bullets) ? exp.bullets : (Array.isArray(exp.responsibilities) ? exp.responsibilities : (Array.isArray(exp.highlights) ? exp.highlights : []));
    const rawTech = Array.isArray(exp.technologies) ? exp.technologies : (Array.isArray(exp.tags) ? exp.tags : (Array.isArray(exp.techStack) ? exp.techStack : ['React', 'TypeScript', 'Tailwind CSS']));

    const start = String(exp.startDate || exp.startYear || exp.start || exp.from || '').trim();
    const end = String(exp.endDate || exp.endYear || exp.end || exp.to || (exp.current ? 'Present' : '')).trim();
    let period = String(exp.period || exp.duration || exp.dates || exp.year || '').trim();
    if (!period && start && end && start !== end) {
      period = `${start} – ${end}`;
    } else if (!period && start) {
      period = exp.current ? `${start} – Present` : start;
    } else if (!period && end) {
      period = end;
    }

    return {
      role: exp.role || exp.position || exp.title || 'Software Engineer',
      company: exp.company || exp.organization || 'Organization',
      period: period,
      location: exp.location || 'Remote',
      description: exp.description || exp.summary || 'Contributed to core feature development, improved application responsiveness, and built production-ready tools.',
      bullets: rawBullets.length > 0 ? rawBullets : [
        'Architected highly responsive modular UI components',
        'Collaborated with cross-functional teams to deliver resilient customer-facing tools',
        'Implemented automated testing across key workflows'
      ],
      technologies: rawTech
    };
  });

  return (
    <section 
      id="experience" 
      data-section="experience"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:experience:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            data-node-id="text:experience:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:experience:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-700 mt-4 font-normal">
            A track record of engineering leadership, scalable frontend design, and product delivery.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 border-l-4 border-black space-y-10">
          {(Array.isArray(experiences) ? experiences : DEFAULT_EXPERIENCE).map((exp, idx) => {
            const expRole = contentOverrides[`text:experience:${idx}:role`]?.value || exp.role;
            const expCompany = contentOverrides[`text:experience:${idx}:company`]?.value || exp.company;
            const expPeriod = contentOverrides[`text:experience:${idx}:period`]?.value || exp.period;
            const expDesc = contentOverrides[`text:experience:${idx}:desc`]?.value || exp.description;

            return (
              <div key={idx} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-5 h-5 rounded-full border-4 border-black bg-[#E5E5E5] group-hover:bg-[var(--primary,#000000)] group-hover:border-[var(--primary,#000000)] transition-all group-hover:scale-125" />

                {/* Experience Card */}
                <div 
                  data-node-id={`card:experience:${idx}`}
                  data-node-type="card"
                  className="bg-white border-3 border-black p-6 sm:p-8 shadow-solid-md transition-all hover:translate-x-1 hover:border-[var(--primary,#000000)] text-black"
                  style={styleOverrides[`card:experience:${idx}`]}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 
                        data-node-id={`text:experience:${idx}:role`}
                        data-node-type="text"
                        className="font-heading font-black text-xl text-black"
                      >
                        {expRole}
                      </h3>
                      <div className="font-heading font-bold text-sm text-neutral-700">
                        <span 
                          data-node-id={`text:experience:${idx}:company`}
                          data-node-type="text"
                        >
                          {expCompany}
                        </span>
                        {' '}• <span className="font-normal text-xs text-neutral-500">{exp.location}</span>
                      </div>
                    </div>
                    <span 
                      data-node-id={`text:experience:${idx}:period`}
                      data-node-type="text"
                      className="font-mono text-xs font-black px-3 py-1 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] shadow-solid-sm"
                    >
                      {expPeriod}
                    </span>
                  </div>

                  <p 
                    data-node-id={`text:experience:${idx}:desc`}
                    data-node-type="text"
                    className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-4 font-normal"
                  >
                    {expDesc}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {exp.bullets && exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs sm:text-sm text-neutral-900 flex items-start gap-2">
                        <span className="font-bold text-black">▪</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies && exp.technologies.map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-black border border-neutral-300 font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
