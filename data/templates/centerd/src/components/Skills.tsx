'use client';

import React from 'react';
import TextFx from './TextFx';

interface SkillsProps {
  data?: any;
}

export default function Skills({ data = {} }: SkillsProps) {
  const skillsSection = data?.skills || {};
  const eyebrow = skillsSection?.eyebrow || 'EXPERTISE & CAPABILITIES';
  const title = skillsSection?.title || 'Skills & Tools';
  const description = skillsSection?.description || 'A structured breakdown of core product design capabilities, modern frontend architecture, and developer workflows.';

  const defaultDomains = [
    {
      num: '01',
      title: 'UI/UX & Product Design',
      category: 'Design Systems & Prototyping',
      description: 'Creating human-centered user flows, scalable design token systems in Figma, and interactive micro-interactions.',
      skills: [
        'Figma Design Systems',
        'UI/UX Architecture',
        'Interactive Prototyping',
        'User Research & Testing',
        'Information Architecture',
        'Motion & Micro-interactions',
        'Design Tokens',
        'WCAG Accessibility Audits',
      ],
    },
    {
      num: '02',
      title: 'Frontend Architecture',
      category: 'Modern Web Engineering',
      description: 'Building performant, accessible web applications with Next.js App Router, TypeScript, and modern CSS layout engines.',
      skills: [
        'Next.js 16 (App Router)',
        'React 19 & TypeScript',
        'Modern Vanilla CSS',
        'Web Performance & Core Vitals',
        'State Architecture & Hooks',
        'Responsive Layout Engines',
        'Edge Rendering & SSR',
        'Semantic HTML5 & a11y',
      ],
    },
    {
      num: '03',
      title: 'Cloud & Developer Tooling',
      category: 'Infrastructure & APIs',
      description: 'Streamlining CI/CD workflows, edge deployment architectures, REST/GraphQL endpoints, and test coverage.',
      skills: [
        'Git & GitHub CI/CD',
        'REST & GraphQL APIs',
        'Storybook Component Docs',
        'Vercel & Cloudflare Edge',
        'Node.js & Serverless',
        'Jest & UI Unit Testing',
        'Design-to-Code Workflows',
        'npm / Turbo Monorepos',
      ],
    },
  ];

  let rawDomains: any[] = [];
  if (Array.isArray(data?.skillCategories) && data.skillCategories.length > 0) {
    rawDomains = data.skillCategories.map((c: any, idx: number) => {
      if (typeof c === 'string') return { num: `0${idx + 1}`, title: c, category: 'Competency', description: '', skills: [c] };
      return {
        num: `0${idx + 1}`,
        title: c?.category || c?.title || c?.name || `Domain 0${idx + 1}`,
        category: c?.category || 'Competency',
        description: c?.description || 'Specialized skills and competencies.',
        skills: Array.isArray(c?.skills) ? c.skills.map((s: any) => (typeof s === 'string' ? s : (s?.name || String(s)))) : []
      };
    });
  } else if (Array.isArray(skillsSection?.categories) && skillsSection.categories.length > 0) {
    rawDomains = skillsSection.categories.map((c: any, idx: number) => {
      if (typeof c === 'string') return { num: `0${idx + 1}`, title: c, category: 'Competency', description: '', skills: [c] };
      return {
        num: `0${idx + 1}`,
        title: c?.title || c?.category || c?.name || `Domain 0${idx + 1}`,
        category: c?.category || 'Competency',
        description: c?.description || '',
        skills: Array.isArray(c?.skills) ? c.skills.map((s: any) => (typeof s === 'string' ? s : (s?.name || String(s)))) : []
      };
    });
  } else if (Array.isArray(data?.skills) && data.skills.length > 0) {
    // If flat array of skills
    const skillsList = data.skills.map((s: any) => (typeof s === 'string' ? s : (s?.name || s?.title || String(s))));
    rawDomains = [
      {
        num: '01',
        title: 'Core Technical Proficiencies',
        category: 'Core Competencies',
        description: 'Key technical competencies and engineering practices.',
        skills: skillsList
      }
    ];
  } else {
    rawDomains = defaultDomains;
  }

  const defaultTools = [
    'Figma', 'Next.js', 'React', 'TypeScript', 'CSS3', 'HTML5', 'GraphQL', 'Storybook', 'Node.js', 'Vercel', 'Git', 'Jest'
  ];

  let coreTools: string[] = [];
  if (Array.isArray(data?.tools) && data.tools.length > 0) {
    coreTools = data.tools.map((t: any) => (typeof t === 'string' ? t : (t?.name || String(t))));
  } else if (Array.isArray(skillsSection?.tools) && skillsSection.tools.length > 0) {
    coreTools = skillsSection.tools.map((t: any) => (typeof t === 'string' ? t : (t?.name || String(t))));
  } else {
    coreTools = defaultTools;
  }

  return (
    <section
      id="skills"
      data-cv-section="skills"
      data-node-id="section:skills:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="06"
    >
      {/* Centered Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 reveal-on-scroll">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="skills.eyebrow"
            data-edit-key="skills.eyebrow"
            data-node-id="text:skills:eyebrow:0"
            data-node-type="text"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="skills.title"
            data-edit-key="skills.title"
            data-node-id="text:skills:title:0"
            data-node-type="text"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="skills.description"
            data-edit-key="skills.description"
            data-node-id="text:skills:description:0"
            data-node-type="text"
            style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Floating Domain Rows */}
      <div className="skills-floating-list" data-cv-collection="skills">
        {rawDomains.map((domain: any, idx: number) => (
          <div
            key={domain.num || idx}
            className={`py-4 ${idx !== rawDomains.length - 1 ? 'border-bottom' : ''} reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
            data-cv={`skills[${idx}]`}
            data-cv-item={`skills[${idx}]`}
            data-node-id={`container:skills:domain:${idx}`}
            data-node-type="container"
          >
            <div className="row align-items-start gy-3">
              {/* Left Column */}
              <div className="col-lg-4">
                <span
                  className="text-muted d-block mb-1"
                  style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {domain.num} • {domain.category}
                </span>
                <h3
                  className="fs-4 fw-bold text-dark m-0"
                  data-cv={`skills[${idx}].title`}
                  data-edit-key={`skills.${idx}.title`}
                  data-node-id={`text:skills:domain:${idx}:title:0`}
                  data-node-type="text"
                >
                  {domain.title}
                </h3>
              </div>

              {/* Right Column */}
              <div className="col-lg-8">
                {domain.description && (
                  <p
                    className="text-muted mb-3"
                    data-cv={`skills[${idx}].description`}
                    data-edit-key={`skills.${idx}.description`}
                    data-node-id={`text:skills:domain:${idx}:desc:0`}
                    data-node-type="text"
                    style={{ fontSize: '0.98rem', lineHeight: 1.7 }}
                  >
                    {domain.description}
                  </p>
                )}

                {/* Skill Pills */}
                <div className="d-flex flex-wrap gap-2">
                  {domain.skills.map((skill: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="text-dark fw-medium"
                      style={{
                        fontSize: '0.82rem',
                        backgroundColor: '#f1f1f0',
                        padding: '5px 12px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Everyday Toolchain Banner */}
      {coreTools.length > 0 && (
        <div className="pt-5 mt-3 border-top reveal-on-scroll reveal-delay-2">
          <div className="row align-items-center gy-3">
            <div className="col-lg-3">
              <span
                className="text-muted text-uppercase fw-bold d-block"
                style={{ fontSize: '0.78rem', letterSpacing: '0.12em' }}
              >
                Daily Toolchain
              </span>
              <span className="text-dark fw-bold fs-5">
                Everyday Stack
              </span>
            </div>
            <div className="col-lg-9">
              <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-lg-end">
                {coreTools.map((tool: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="text-dark fw-bold"
                    style={{
                      fontSize: '0.82rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #212529',
                      padding: '6px 14px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
