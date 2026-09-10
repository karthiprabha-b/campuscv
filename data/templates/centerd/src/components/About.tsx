'use client';

import React from 'react';
import TextFx from './TextFx';

interface AboutProps {
  data?: any;
}

export default function About({ data = {} }: AboutProps) {
  const about = data?.about || {};
  const personal = data?.personal || {};

  const eyebrow = about?.eyebrow || 'BIOGRAPHY & PHILOSOPHY';
  const title = about?.title || 'About Me';
  const subtitle = about?.subtitle || about?.tagline || 'Bridging the gap between aesthetic visual design and robust modern frontend architecture.';
  const heading = about?.heading || about?.lead || 'Transforming complex workflows into seamless, elegant digital products.';

  const defaultBio = [
    "I am a multidisciplinary Designer & Full-Stack Frontend Engineer with 6+ years of experience transforming complex systems into intuitive, elegant digital products.",
    "My work sits at the intersection of aesthetic precision, micro-interactions, and robust modern web engineering. I've partnered with venture-backed startups, Fortune 500 enterprises, and creative studios worldwide to ship products loved by millions."
  ];

  let rawBio: string[] = [];
  if (Array.isArray(about?.bio) && about.bio.length > 0) {
    rawBio = about.bio.map((b: any) => typeof b === 'string' ? b : (b?.text || b?.content || String(b)));
  } else if (typeof about?.bio === 'string' && about.bio.trim()) {
    rawBio = [about.bio];
  } else if (Array.isArray(personal?.bio) && personal.bio.length > 0) {
    rawBio = personal.bio.map((b: any) => typeof b === 'string' ? b : (b?.text || b?.content || String(b)));
  } else if (typeof personal?.bio === 'string' && personal.bio.trim()) {
    rawBio = [personal.bio];
  } else if (typeof data?.bio === 'string' && data.bio.trim()) {
    rawBio = [data.bio];
  } else if (typeof data?.summary === 'string' && data.summary.trim()) {
    rawBio = [data.summary];
  } else {
    rawBio = defaultBio;
  }

  const defaultPillars = [
    {
      title: 'Human-Centered Empathy',
      description: 'Designing intuitive interfaces rooted in qualitative user research and cognitive ergonomics.',
      icon: '✦',
    },
    {
      title: 'Pixel-Perfect Craft',
      description: 'Obsession with typography, micro-interactions, layout balance, and responsive design systems.',
      icon: '✦',
    },
    {
      title: 'Modern Architecture',
      description: 'Writing fast, maintainable TypeScript and Next.js applications adhering to high accessibility standards.',
      icon: '✦',
    },
  ];

  const rawPillars = Array.isArray(about?.pillars) ? about.pillars : defaultPillars;
  const pillars = (Array.isArray(rawPillars) && rawPillars.length > 0 ? rawPillars : defaultPillars).map((p: any, idx: number) => {
    if (typeof p === 'string') return { title: p, description: '', icon: '✦' };
    return {
      title: p?.title || p?.name || `Principle 0${idx + 1}`,
      description: p?.description || p?.details || '',
      icon: p?.icon || '✦'
    };
  });

  const defaultStats = [
    { value: "06+", label: "Years Experience" },
    { value: "85+", label: "Projects Completed" },
    { value: "99%", label: "Client Satisfaction" },
    { value: "14", label: "Design Awards" }
  ];

  const rawStats = Array.isArray(about?.stats)
    ? about.stats
    : (Array.isArray(personal?.stats)
      ? personal.stats
      : (Array.isArray(data?.stats) ? data.stats : defaultStats));

  const stats = (Array.isArray(rawStats) && rawStats.length > 0 ? rawStats : defaultStats).map((s: any) => {
    if (typeof s === 'string') return { value: s, label: 'Metric' };
    return {
      value: s?.value || s?.number || s?.count || '10+',
      label: s?.label || s?.title || s?.name || 'Metric'
    };
  });

  const userRole = personal?.role || data?.role || about?.role || 'Designer & Developer';
  const userLocation = personal?.location || data?.location || about?.location || 'San Francisco & Remote';
  const userLanguages = personal?.languages || about?.languages || 'English, Spanish';
  const userExp = personal?.experienceYears || about?.experienceYears || '06+ Years Active';
  const userStatus = personal?.availability || data?.availability || about?.status || '🟢 Open for Projects';

  return (
    <section
      id="about"
      data-cv-section="about"
      data-node-id="section:about:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="02"
    >
      {/* Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 reveal-on-scroll">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="about.eyebrow"
            data-edit-key="about.eyebrow"
            data-node-id="text:about:eyebrow:0"
            data-node-type="text"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="about.title"
            data-edit-key="about.title"
            data-node-id="text:about:title:0"
            data-node-type="text"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="about.subtitle"
            data-edit-key="about.subtitle"
            data-node-id="text:about:subtitle:0"
            data-node-type="text"
            style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="row g-5 align-items-stretch">
        {/* Left Column: Bio & Core Philosophy */}
        <div className="col-lg-7 d-flex flex-column justify-content-between reveal-on-scroll">
          <div>
            <h3
              className="fs-3 fw-bold mb-3 text-dark"
              data-cv="about.heading"
              data-edit-key="about.heading"
              data-node-id="text:about:heading:0"
              data-node-type="text"
            >
              {heading}
            </h3>

            {rawBio.map((paragraph, bIdx) => (
              <p
                key={bIdx}
                className="text-muted mb-3"
                data-cv={bIdx === 0 ? "about.bio" : `about.bio[${bIdx}]`}
                data-edit-key={bIdx === 0 ? "about.bio" : `about.bio.${bIdx}`}
                data-node-id={`text:about:bio:${bIdx}`}
                data-node-type="text"
                style={{ fontSize: '1rem', lineHeight: 1.8 }}
              >
                {paragraph}
              </p>
            ))}

            {/* Design & Engineering Pillars */}
            <h4 className="fs-5 fw-bold text-dark mt-4 mb-3">Core Principles</h4>
            <div className="d-flex flex-column gap-3 mb-4" data-cv-collection="about.pillars">
              {pillars.map((pillar: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-light border d-flex align-items-start gap-3"
                  data-cv={`about.pillars[${idx}]`}
                  data-cv-item="about.pillars"
                  data-node-id={`container:about:pillar:${idx}`}
                  data-node-type="container"
                >
                  <span className="fw-bold" style={{ color: 'var(--bs-primary)', fontSize: '1.1rem' }}>
                    {pillar.icon || '✦'}
                  </span>
                  <div>
                    <h5
                      className="fs-6 fw-bold text-dark mb-1"
                      data-cv={`about.pillars[${idx}].title`}
                      data-edit-key={`about.pillars.${idx}.title`}
                      data-node-id={`text:about:pillar:${idx}:title:0`}
                      data-node-type="text"
                    >
                      {pillar.title}
                    </h5>
                    <p
                      className="text-muted m-0"
                      data-cv={`about.pillars[${idx}].description`}
                      data-edit-key={`about.pillars.${idx}.description`}
                      data-node-id={`text:about:pillar:${idx}:desc:0`}
                      data-node-type="text"
                      style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Personal Info Card & Quick Facts */}
        <div className="col-lg-5 reveal-on-scroll reveal-delay-2">
          <div className="h-100 d-flex flex-column justify-content-between">
            {/* Personal Details Table Card */}
            <div className="p-4 p-xl-5 bg-white border mb-4">
              <span className="text-muted text-uppercase fw-bold d-block mb-3" style={{ letterSpacing: '0.12em', fontSize: '0.8rem' }}>
                Quick Facts
              </span>
              <table className="table table-borderless m-0">
                <tbody>
                  <tr className="border-bottom">
                    <th className="py-2 text-dark fw-bold" style={{ width: '35%', fontSize: '0.9rem' }}>Role</th>
                    <td className="py-2 text-muted" data-cv="personal.role" data-edit-key="personal.role" data-node-id="text:personal:role:0" data-node-type="text" style={{ fontSize: '0.9rem' }}>{userRole}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="py-2 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Location</th>
                    <td className="py-2 text-muted" data-cv="personal.location" data-edit-key="personal.location" data-node-id="text:personal:location:0" data-node-type="text" style={{ fontSize: '0.9rem' }}>{userLocation}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="py-2 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Languages</th>
                    <td className="py-2 text-muted" data-cv="personal.languages" data-edit-key="personal.languages" data-node-id="text:personal:languages:0" data-node-type="text" style={{ fontSize: '0.9rem' }}>{userLanguages}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="py-2 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Experience</th>
                    <td className="py-2 text-muted" data-cv="personal.experience" data-edit-key="personal.experience" data-node-id="text:personal:experience:0" data-node-type="text" style={{ fontSize: '0.9rem' }}>{userExp}</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Status</th>
                    <td className="py-2" style={{ fontSize: '0.9rem' }}>
                      <span className="badge bg-light text-dark border" data-cv="personal.availability" data-edit-key="personal.availability" data-node-id="text:personal:availability:0" data-node-type="text">
                        {userStatus}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Impact Highlights Grid */}
            <div className="p-4 p-xl-5 bg-light border">
              <span className="text-muted text-uppercase fw-bold d-block mb-3" style={{ letterSpacing: '0.12em', fontSize: '0.8rem' }}>
                Career Milestones
              </span>
              <div className="row g-3" data-cv-collection="about.stats">
                {stats.map((stat: any, sIdx: number) => (
                  <div
                    key={sIdx}
                    className="col-6"
                    data-cv={`about.stats[${sIdx}]`}
                    data-cv-item="about.stats"
                    data-node-id={`container:about:stat:${sIdx}`}
                    data-node-type="container"
                  >
                    <h3
                      className="fs-2 fw-bold text-dark m-0"
                      data-cv={`about.stats[${sIdx}].value`}
                      data-edit-key={`about.stats.${sIdx}.value`}
                      data-node-id={`text:about:stat:${sIdx}:value:0`}
                      data-node-type="text"
                    >
                      {stat.value}
                    </h3>
                    <span
                      className="text-muted"
                      data-cv={`about.stats[${sIdx}].label`}
                      data-edit-key={`about.stats.${sIdx}.label`}
                      data-node-id={`text:about:stat:${sIdx}:label:0`}
                      data-node-type="text"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
