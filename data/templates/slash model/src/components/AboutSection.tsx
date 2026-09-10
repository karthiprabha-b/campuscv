'use client';

import React from 'react';

interface AboutSectionProps {
  data?: any;
}

const defaultPillars = [
  {
    title: 'DESIGN',
    description: 'I craft intuitive user interfaces with strong focus on visual hierarchy, typography, design systems, and responsive wireframes that captivate users.',
    icon: 'design'
  },
  {
    title: 'DEVELOPMENT',
    description: 'I write clean, modular, and maintainable code using TypeScript, React, Next.js, and modern CSS to build blazing-fast and scalable web apps.',
    icon: 'code'
  },
  {
    title: 'MAINTENANCE',
    description: 'I ensure ongoing performance audits, SEO optimization, continuous integration, cross-browser compatibility, and accessibility standards.',
    icon: 'wrench'
  }
];

export default function AboutSection({ data = {} }: AboutSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:about:root:div:title']?.value ||
    data?.about?.title ||
    'About Me';

  const leadText = contentOverrides['text:about:root:p:lead']?.value ||
    data?.about?.leadText ||
    data?.about?.bio ||
    data?.about?.description ||
    data?.about?.summary ||
    data?.bio ||
    data?.summary ||
    'I am a passionate Front-end Developer and UI Designer dedicated to building seamless, responsive, and aesthetically stunning web applications. With a strong eye for typography, spatial harmony, and performance optimization, I bridge the gap between creative design and robust engineering.';

  const rawPillars = data?.about?.pillars || data?.pillars;
  let pillars = defaultPillars;

  if (Array.isArray(rawPillars) && rawPillars.length >= 3) {
    // Check if the titles are identical (e.g. user headline repeated)
    const titles = rawPillars.map((p: any) => (p?.title || p?.name || '').trim().toLowerCase());
    const isDuplicated = titles[0] && titles.every((t: string) => t === titles[0]);
    if (!isDuplicated) {
      pillars = rawPillars.map((p: any, idx: number) => ({
        title: p.title || p.name || defaultPillars[idx % defaultPillars.length].title,
        description: p.description || p.desc || p.summary || defaultPillars[idx % defaultPillars.length].description,
        icon: p.icon || defaultPillars[idx % defaultPillars.length].icon
      }));
    }
  }

  return (
    <section 
      id="about" 
      data-section="about"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:about:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Boxed Header */}
        <div className="text-center mb-10">
          <div 
            data-node-id="text:about:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:about:root:div:title']}
          >
            {title}
          </div>
          
          <p 
            data-node-id="text:about:root:p:lead"
            data-node-type="text"
            className="max-w-3xl mx-auto text-base sm:text-lg text-black leading-relaxed mt-6 font-normal"
            style={styleOverrides['text:about:root:p:lead']}
          >
            {leadText}
          </p>

          <div className="mt-6">
            <a 
              href="#portfolio" 
              data-node-id="text:about:root:a:explore"
              data-node-type="text"
              className="bracket-link text-sm font-black"
            >
              | EXPLORE |
            </a>
          </div>
        </div>

        {/* Geometric Wave Divider */}
        <div className="geometric-divider" aria-hidden="true">
          <svg viewBox="0 0 32 12"><path d="M0,6 Q4,0 8,6 T16,6 T24,6 T32,6"/></svg>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {pillars.slice(0, 3).map((pillar: any, idx: number) => {
            const pillarTitle = contentOverrides[`text:about:pillar:${idx}:title`]?.value || pillar.title;
            const pillarDesc = contentOverrides[`text:about:pillar:${idx}:desc`]?.value || pillar.description;

            return (
              <div 
                key={idx}
                data-node-id={`card:about:pillar:${idx}`}
                data-node-type="card"
                className="relative p-8 sm:p-10 text-center bg-white border-3 border-black shadow-solid-md hover:-translate-y-2 hover:border-[var(--primary,#000000)] transition-all duration-300 flex flex-col justify-between text-black"
                style={styleOverrides[`card:about:pillar:${idx}`]}
              >
                <div>
                  {/* Pillar Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 relative flex items-center justify-center">
                    {(pillar.icon === 'design' || idx === 0) && (
                      <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                        <path d="M2 2l7.586 7.586"/>
                        <circle cx="11" cy="11" r="2"/>
                      </svg>
                    )}
                    {(pillar.icon === 'code' || idx === 1) && pillar.icon !== 'design' && (
                      <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                      </svg>
                    )}
                    {(pillar.icon === 'wrench' || idx === 2) && pillar.icon !== 'design' && pillar.icon !== 'code' && (
                      <svg className="w-9 h-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                      </svg>
                    )}
                  </div>

                  <h3 
                    data-node-id={`text:about:pillar:${idx}:title`}
                    data-node-type="text"
                    className="font-heading font-black text-xl tracking-[0.25em] uppercase text-black mb-4"
                  >
                    {pillarTitle}
                  </h3>

                  <p 
                    data-node-id={`text:about:pillar:${idx}:desc`}
                    data-node-type="text"
                    className="text-sm text-neutral-700 leading-relaxed font-normal"
                  >
                    {pillarDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Geometric Wave Divider */}
        <div className="geometric-divider" aria-hidden="true">
          <svg viewBox="0 0 32 12"><path d="M0,6 Q4,0 8,6 T16,6 T24,6 T32,6"/></svg>
        </div>

      </div>
    </section>
  );
}
