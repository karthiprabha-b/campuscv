'use client';

import React from 'react';

interface HeroSectionProps {
  data?: any;
}

export default function HeroSection({ data = {} }: HeroSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const greeting = contentOverrides['text:hero:root:p:greeting']?.value ||
    data?.hero?.greeting ||
    data?.greeting ||
    'Hi, I am';

  const name = contentOverrides['text:hero:root:h1:name']?.value ||
    data?.hero?.name ||
    data?.name ||
    data?.fullName ||
    data?.personal?.fullName ||
    'Tomasz Gajda';

  const role = contentOverrides['text:hero:root:p:role']?.value ||
    data?.hero?.title ||
    data?.hero?.subtitle ||
    data?.role ||
    data?.headline ||
    data?.personal?.headline ||
    'Front-end Developer / UI Designer';

  const quote = contentOverrides['text:hero:root:div:quote']?.value ||
    data?.hero?.quote ||
    data?.quote ||
    data?.hero?.introductionText ||
    data?.summary ||
    '"Crafting digital interfaces with clean code & modern aesthetics."';

  // Resolve Portrait Image across all CampusCV overrides
  const rawImageOverride = contentOverrides['image:hero:root:img:0']?.src ||
    (typeof contentOverrides['image:hero:root:img:0'] === 'string' ? contentOverrides['image:hero:root:img:0'] : null) ||
    data?.imageOverrides?.['image:hero:root:img:0'] ||
    data?.imageOverrides?.['hero.image'];

  const explicitImage = typeof rawImageOverride === 'object' && rawImageOverride !== null ? (rawImageOverride.src || rawImageOverride.value) : rawImageOverride;
  const image = explicitImage ||
    data?.hero?.image ||
    data?.hero?.avatarUrl ||
    data?.hero?.profileImage ||
    data?.profileImage ||
    data?.avatarUrl ||
    data?.photo ||
    data?.image ||
    '/assets/images/hero-portrait.jpg';

  const email = data?.email || data?.contact?.email || data?.personal?.email || 'tomasz.gajda@example.com';
  const github = data?.socialLinks?.github || data?.socials?.github || data?.github || 'https://github.com';
  const linkedin = data?.socialLinks?.linkedin || data?.socials?.linkedin || data?.linkedin || 'https://linkedin.com';

  return (
    <section 
      id="hero" 
      data-section="hero"
      className="relative py-16 sm:py-20 lg:py-28 flex items-center bg-[#D8D8D8] overflow-hidden scroll-mt-24 transition-colors"
      style={styleOverrides['section:hero:root:section:0']}
    >
      
      {/* Signature Diagonal Slash Background (Dark Right Side) */}
      <div 
        className="hidden md:block absolute top-0 right-0 bottom-0 w-[56%] lg:w-[58%] bg-[#0C0C0C] hero-slash-polygon z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] w-full mx-auto px-6 sm:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Hero Typography & Actions */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center text-left py-6">
          <p 
            data-node-id="text:hero:root:p:greeting"
            data-node-type="text"
            className="font-heading font-medium text-lg md:text-xl lg:text-2xl text-black mb-2 tracking-wide"
            style={styleOverrides['text:hero:root:p:greeting']}
          >
            {greeting}
          </p>
          
          <h1 
            data-node-id="text:hero:root:h1:name"
            data-node-type="text"
            className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-black tracking-tight leading-[1.04] mb-3"
            style={styleOverrides['text:hero:root:h1:name']}
          >
            {name}
          </h1>
          
          <p 
            data-node-id="text:hero:root:p:role"
            data-node-type="text"
            className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-neutral-700 tracking-wide mb-8"
            style={styleOverrides['text:hero:root:p:role']}
          >
            {role}
          </p>

          {/* Social Icons in High-Contrast Square Badges */}
          <div className="flex items-center gap-3.5 mb-10">
            {/* Email Icon */}
            <a
              href={`mailto:${email}`}
              data-node-id="button:hero:root:a:email"
              data-node-type="button"
              className="w-12 h-12 border-2 border-black flex items-center justify-center text-black bg-white hover:bg-[var(--primary,#000000)] hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)] transition-all shadow-solid-sm hover:-translate-y-0.5 no-underline"
              title="Email"
              aria-label="Email Me"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            {/* GitHub Icon */}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="button:hero:root:a:github"
              data-node-type="button"
              className="w-12 h-12 border-2 border-black flex items-center justify-center text-black bg-white hover:bg-[var(--primary,#000000)] hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)] transition-all shadow-solid-sm hover:-translate-y-0.5 no-underline"
              title="GitHub"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>

            {/* LinkedIn Icon */}
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="button:hero:root:a:linkedin"
              data-node-type="button"
              className="w-12 h-12 border-2 border-black flex items-center justify-center text-black bg-white hover:bg-[var(--primary,#000000)] hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)] transition-all shadow-solid-sm hover:-translate-y-0.5 no-underline"
              title="LinkedIn"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#portfolio" 
              data-node-id="button:hero:root:a:explore"
              data-node-type="button"
              className="btn-box"
            >
              | EXPLORE WORK |
            </a>
            <a 
              href="#contact" 
              data-node-id="button:hero:root:a:contact"
              data-node-type="button"
              className="btn-box-outline"
            >
              | GET IN TOUCH |
            </a>
          </div>
        </div>

        {/* Right Portrait Image Showcase */}
        <div className="md:col-span-6 lg:col-span-6 flex justify-center items-end relative pt-4 pb-2">
          <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] aspect-[3/4] border-4 border-black overflow-hidden shadow-2xl bg-neutral-900 group">
            <img
              src={image}
              alt={name}
              data-node-id="image:hero:root:img:0"
              data-node-type="image"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              style={styleOverrides['image:hero:root:img:0']}
            />
            {/* Playful Floating Quote Badge */}
            <div 
              data-node-id="text:hero:root:div:quote"
              data-node-type="text"
              className="absolute bottom-5 right-5 left-5 sm:left-auto sm:max-w-[280px] bg-black/90 backdrop-blur-md border border-white/20 border-l-4 border-l-[var(--primary,#FFFFFF)] p-3.5 rounded text-neutral-200 text-xs font-mono leading-snug shadow-xl"
            >
              {quote}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
