'use client';

import React from 'react';
import TextFx from './TextFx';

interface ExperienceProps {
  data?: any;
}

export default function Experience({ data = {} }: ExperienceProps) {
  const expSection = data?.experience || {};
  const eyebrow = expSection?.eyebrow || 'CAREER & HISTORY';
  const title = expSection?.title || 'Work Experience';
  const description = expSection?.description || 'A track record of leading product design, architecting robust frontend applications, and delivering high-impact digital experiences.';

  const defaultExperiences = [
    {
      id: "exp-1",
      role: "Lead Product Designer & Frontend Architect",
      company: "Aura Creative Labs",
      period: "2023 — Present",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-Time",
      description: "Leading the core product design and frontend team building next-generation AI analytics dashboards.",
      achievements: [
        "Redesigned enterprise analytics portal, reducing workflow time by 42% for 120k+ daily active users.",
        "Built a cross-platform design token system with Next.js, React, and CSS variables adopted across 6 internal products.",
        "Mentored a team of 8 designers and frontend engineers, establishing high accessibility (WCAG AAA) standards."
      ],
      skills: ["Design Systems", "Next.js", "TypeScript", "Figma", "Design Tokens", "Accessibility"]
    },
    {
      id: "exp-2",
      role: "Senior UI/UX & Web Developer",
      company: "Hyperion Digital Agency",
      period: "2021 — 2023",
      location: "New York, NY (Remote)",
      type: "Full-Time",
      description: "Delivered high-impact web apps and e-commerce platforms for global clients across fintech and luxury retail.",
      achievements: [
        "Engineered 18+ client web apps with 99.9% uptime, achieving average Lighthouse performance scores of 98/100.",
        "Spearheaded motion design and fluid interaction libraries that drove a 35% boost in landing page conversion rates.",
        "Authored reusable animation primitives and responsive layout engines."
      ],
      skills: ["React", "UI/UX Architecture", "Vanilla CSS", "GraphQL", "Client Leadership"]
    },
    {
      id: "exp-3",
      role: "Product & Interaction Designer",
      company: "Studio Vertex",
      period: "2019 — 2021",
      location: "Seattle, WA",
      type: "Full-Time",
      description: "Created human-centered digital experiences, brand identities, and mobile app wireframes from concept to launch.",
      achievements: [
        "Designed and validated MVP for a fintech mobile app acquired by a leading financial institution for $14M.",
        "Conducted 50+ qualitative user testing sessions to iterate on frictionless onboarding flows."
      ],
      skills: ["User Testing", "Figma", "Prototyping", "Design Strategy", "Mobile UI"]
    }
  ];

  const rawExperiences = (Array.isArray(data?.experiences) && data.experiences.length > 0)
    ? data.experiences
    : (Array.isArray(data?.experience) && data.experience.length > 0)
      ? data.experience
      : (Array.isArray(expSection?.items) && expSection.items.length > 0)
        ? expSection.items
        : (Array.isArray(data?.work) && data.work.length > 0)
          ? data.work
          : defaultExperiences;

  const workExperiences = (Array.isArray(rawExperiences) && rawExperiences.length > 0 ? rawExperiences : defaultExperiences).map((exp: any, idx: number) => {
    if (typeof exp === 'string') {
      return {
        id: `exp-${idx}`,
        role: exp,
        company: 'Company',
        period: '2021 — Present',
        location: '',
        type: 'Full-Time',
        description: '',
        achievements: [],
        skills: []
      };
    }
    const rawPeriod = exp?.period || exp?.years || exp?.duration || (exp?.startDate ? `${exp.startDate} — ${exp.endDate || 'Present'}` : '2021 — Present');
    let achievements: string[] = [];
    if (Array.isArray(exp?.achievements)) achievements = exp.achievements.map((a: any) => typeof a === 'string' ? a : String(a));
    else if (Array.isArray(exp?.highlights)) achievements = exp.highlights.map((a: any) => typeof a === 'string' ? a : String(a));
    else if (Array.isArray(exp?.responsibilities)) achievements = exp.responsibilities.map((a: any) => typeof a === 'string' ? a : String(a));
    else if (Array.isArray(exp?.details)) achievements = exp.details.map((a: any) => typeof a === 'string' ? a : String(a));

    let skills: string[] = [];
    if (Array.isArray(exp?.skills)) skills = exp.skills.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));
    else if (Array.isArray(exp?.technologies)) skills = exp.technologies.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));
    else if (Array.isArray(exp?.tags)) skills = exp.tags.map((s: any) => typeof s === 'string' ? s : (s?.name || String(s)));

    return {
      id: exp?.id || `exp-${idx}`,
      role: exp?.role || exp?.position || exp?.title || 'Role Title',
      company: exp?.company || exp?.organization || exp?.client || 'Company Name',
      period: rawPeriod,
      location: exp?.location || '',
      type: exp?.type || exp?.employmentType || 'Full-Time',
      description: exp?.description || exp?.summary || '',
      achievements,
      skills
    };
  });

  return (
    <section
      id="experience"
      data-cv-section="experience"
      data-node-id="section:experience:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="04"
    >
      {/* Intro Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 reveal-on-scroll">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="experience.eyebrow"
            data-edit-key="experience.eyebrow"
            data-node-id="text:experience:eyebrow:0"
            data-node-type="text"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="experience.title"
            data-edit-key="experience.title"
            data-node-id="text:experience:title:0"
            data-node-type="text"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="experience.description"
            data-edit-key="experience.description"
            data-node-id="text:experience:description:0"
            data-node-type="text"
            style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Floating Experience List */}
      <div className="experience-list" data-cv-collection="experience">
        {workExperiences.map((exp: any, idx: number) => (
          <div
            key={exp.id || idx}
            className={`py-4 ${idx !== workExperiences.length - 1 ? 'border-bottom' : ''} reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
            data-cv={`experience[${idx}]`}
            data-cv-item={`experience[${idx}]`}
            data-node-id={`container:experience:card:${idx}`}
            data-node-type="container"
          >
            <div className="row align-items-start gy-3">
              {/* Left Column: Period & Company */}
              <div className="col-lg-4">
                <span
                  className="text-muted d-block mb-1"
                  data-cv={`experience[${idx}].period`}
                  data-edit-key={`experience.${idx}.period`}
                  data-node-id={`text:experience:card:${idx}:period:0`}
                  data-node-type="text"
                  style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {exp.period}
                </span>
                <h4
                  className="fs-5 fw-bold text-dark m-0"
                  data-cv={`experience[${idx}].company`}
                  data-edit-key={`experience.${idx}.company`}
                  data-node-id={`text:experience:card:${idx}:comp:0`}
                  data-node-type="text"
                >
                  {exp.company}
                </h4>
                <span
                  className="text-muted d-block mt-1"
                  data-cv={`experience[${idx}].location`}
                  data-edit-key={`experience.${idx}.location`}
                  data-node-id={`text:experience:card:${idx}:loc:0`}
                  data-node-type="text"
                  style={{ fontSize: '0.85rem' }}
                >
                  {exp.location} {exp.location && exp.type ? '•' : ''} {exp.type}
                </span>
              </div>

              {/* Right Column: Role, Description, Achievements & Skills */}
              <div className="col-lg-8">
                <h3
                  className="fs-3 fw-bold text-dark mb-2"
                  data-cv={`experience[${idx}].role`}
                  data-edit-key={`experience.${idx}.role`}
                  data-node-id={`text:experience:card:${idx}:role:0`}
                  data-node-type="text"
                >
                  {exp.role}
                </h3>
                {exp.description && (
                  <p
                    className="text-muted mb-3"
                    data-cv={`experience[${idx}].description`}
                    data-edit-key={`experience.${idx}.description`}
                    data-node-id={`text:experience:card:${idx}:desc:0`}
                    data-node-type="text"
                    style={{ fontSize: '1rem', lineHeight: 1.75 }}
                  >
                    {exp.description}
                  </p>
                )}

                {/* Achievements */}
                {exp.achievements.length > 0 && (
                  <ul className="list-unstyled mb-3 ps-0">
                    {exp.achievements.map((ach: string, aIdx: number) => (
                      <li
                        key={aIdx}
                        className="d-flex align-items-start gap-2 mb-2 text-muted"
                        style={{ fontSize: '0.92rem', lineHeight: 1.65 }}
                      >
                        <span style={{ color: 'var(--bs-primary)', fontWeight: 'bold' }}>•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Skill tags */}
                {exp.skills.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {exp.skills.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-dark fw-medium"
                        style={{
                          fontSize: '0.8rem',
                          backgroundColor: '#f1f1f0',
                          padding: '4px 10px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
