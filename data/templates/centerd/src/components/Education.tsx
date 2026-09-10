'use client';

import React from 'react';
import TextFx from './TextFx';

interface EducationProps {
  data?: any;
}

export default function Education({ data = {} }: EducationProps) {
  const educationSection = data?.education || {};
  const eyebrow = educationSection?.eyebrow || 'ACADEMIC BACKGROUND';
  const title = educationSection?.title || 'Education & Honors';
  const description = educationSection?.description || 'Formal foundations in Human-Computer Interaction, computer science, and typography from leading universities.';

  const defaultEducation = [
    {
      id: "edu-1",
      degree: "Master of Science in Human-Computer Interaction (HCI)",
      institution: "Stanford University",
      period: "2017 — 2019",
      location: "Stanford, CA",
      grade: "3.94 GPA — Graduated with Honors",
      details: [
        "Specialized in interactive systems, cognitive ergonomics, and AI-assisted design interfaces.",
        "Published thesis on 'Micro-Feedback Mechanisms in High-Stakes Financial Dashboards'.",
        "Recipient of the Excellence in Digital Design Fellowship."
      ],
      coursework: [
        "Interactive UI Architecture",
        "User-Centered Research",
        "Advanced Cognitive Psychology",
        "Data Visualization"
      ]
    },
    {
      id: "edu-2",
      degree: "Bachelor of Science in Computer Science & Digital Arts",
      institution: "University of California, Berkeley",
      period: "2013 — 2017",
      location: "Berkeley, CA",
      grade: "Magna Cum Laude",
      details: [
        "Dual concentration in Software Engineering and Graphic Typography & Visual Communication.",
        "President of the Berkeley Web & Mobile Design Collective.",
        "Winner of CalHacks 2016 for Best User Experience Design."
      ],
      coursework: [
        "Data Structures & Algorithms",
        "Web Engineering & Systems",
        "Typography & Color Theory",
        "Visual Interaction Systems"
      ]
    }
  ];

  const rawEducation = (Array.isArray(data?.education) && data.education.length > 0)
    ? data.education
    : (Array.isArray(educationSection?.items) && educationSection.items.length > 0)
      ? educationSection.items
      : (Array.isArray(data?.academics) && data.academics.length > 0)
        ? data.academics
        : defaultEducation;

  const educationList = (Array.isArray(rawEducation) && rawEducation.length > 0 ? rawEducation : defaultEducation).map((edu: any, idx: number) => {
    if (typeof edu === 'string') {
      return {
        id: `edu-${idx}`,
        degree: edu,
        institution: 'University',
        period: '2020 — 2024',
        location: '',
        grade: '',
        details: [],
        coursework: []
      };
    }
    const rawPeriod = edu?.period || edu?.year || edu?.dates || (edu?.startDate ? `${edu.startDate} — ${edu.endDate || 'Present'}` : '2020 — 2024');
    let details: string[] = [];
    if (Array.isArray(edu?.details)) details = edu.details.map((d: any) => typeof d === 'string' ? d : String(d));
    else if (Array.isArray(edu?.description)) details = edu.description.map((d: any) => typeof d === 'string' ? d : String(d));
    else if (typeof edu?.description === 'string' && edu.description) details = [edu.description];
    else if (typeof edu?.details === 'string' && edu.details) details = [edu.details];

    let coursework: string[] = [];
    if (Array.isArray(edu?.coursework)) coursework = edu.coursework.map((c: any) => typeof c === 'string' ? c : (c?.name || String(c)));
    else if (Array.isArray(edu?.skills)) coursework = edu.skills.map((c: any) => typeof c === 'string' ? c : (c?.name || String(c)));
    else if (Array.isArray(edu?.courses)) coursework = edu.courses.map((c: any) => typeof c === 'string' ? c : (c?.name || String(c)));

    return {
      id: edu?.id || `edu-${idx}`,
      degree: edu?.degree || edu?.qualification || edu?.title || 'Degree / Major',
      institution: edu?.institution || edu?.school || edu?.university || 'University / College',
      period: rawPeriod,
      location: edu?.location || '',
      grade: edu?.grade || edu?.honors || edu?.gpa || '',
      details,
      coursework
    };
  });

  return (
    <section
      id="education"
      data-cv-section="education"
      data-node-id="section:education:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="03"
    >
      {/* Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 reveal-on-scroll">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="education.eyebrow"
            data-node-id="text:education:eyebrow:0"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="education.title"
            data-node-id="text:education:title:0"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="education.description"
            data-node-id="text:education:description:0"
            style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* 2-Column Education Cards */}
      <div className="row g-4" data-cv-collection="education">
        {educationList.map((edu: any, idx: number) => (
          <div
            key={edu.id || idx}
            className={`col-lg-6 reveal-on-scroll reveal-delay-${(idx % 2) + 1}`}
            data-cv={`education[${idx}]`}
            data-cv-item={`education[${idx}]`}
            data-node-id={`container:education:card:${idx}`}
          >
            <div className="p-4 p-xl-5 bg-white border h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Period & Location Badge */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge bg-dark text-white text-uppercase"
                    data-cv={`education[${idx}].period`}
                    data-edit-key={`education.${idx}.period`}
                    data-node-id={`text:education:card:${idx}:period:0`}
                    data-node-type="text"
                    style={{ borderRadius: '0', fontSize: '0.75rem', letterSpacing: '0.06em', padding: '5px 10px' }}
                  >
                    {edu.period}
                  </span>
                  {edu.location && (
                    <span
                      className="text-muted"
                      data-cv={`education[${idx}].location`}
                      data-edit-key={`education.${idx}.location`}
                      data-node-id={`text:education:card:${idx}:loc:0`}
                      data-node-type="text"
                      style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                    >
                      {edu.location}
                    </span>
                  )}
                </div>

                {/* Degree & Institution */}
                <h3
                  className="fs-4 fw-bold text-dark mb-1"
                  data-cv={`education[${idx}].degree`}
                  data-edit-key={`education.${idx}.degree`}
                  data-node-id={`text:education:card:${idx}:degree:0`}
                  data-node-type="text"
                >
                  {edu.degree}
                </h3>
                <h4
                  className="fs-6 fw-bold mb-3"
                  data-cv={`education[${idx}].institution`}
                  data-edit-key={`education.${idx}.institution`}
                  data-node-id={`text:education:card:${idx}:inst:0`}
                  data-node-type="text"
                  style={{ color: 'var(--bs-primary)' }}
                >
                  {edu.institution}
                </h4>

                {/* Grade / Honor Badge */}
                {edu.grade && (
                  <div className="d-inline-block px-3 py-1 bg-light border mb-3">
                    <span
                      className="fw-bold text-dark"
                      data-cv={`education[${idx}].grade`}
                      data-edit-key={`education.${idx}.grade`}
                      data-node-id={`text:education:card:${idx}:grade:0`}
                      data-node-type="text"
                      style={{ fontSize: '0.82rem' }}
                    >
                      🎓 {edu.grade}
                    </span>
                  </div>
                )}

                {/* Details / Specializations */}
                {edu.details.length > 0 && (
                  <ul className="list-unstyled mb-4 ps-0">
                    {edu.details.map((detail: string, dIdx: number) => (
                      <li
                        key={dIdx}
                        className="d-flex align-items-start gap-2 mb-2 text-muted"
                        style={{ fontSize: '0.92rem', lineHeight: 1.6 }}
                      >
                        <span style={{ color: 'var(--bs-primary)', fontWeight: 'bold' }}>•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Coursework Tags */}
              {edu.coursework.length > 0 && (
                <div className="pt-3 border-top">
                  <span className="text-muted text-uppercase fw-bold d-block mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                    Key Coursework / Focus
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {edu.coursework.map((course: string, cIdx: number) => (
                      <span
                        key={cIdx}
                        className="badge bg-light text-dark border"
                        style={{ borderRadius: '0', fontSize: '0.75rem', padding: '5px 9px', fontWeight: 500 }}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
