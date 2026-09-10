'use client';

import React from 'react';

interface SubHeroBannerProps {
  data?: any;
}

export default function SubHeroBanner({ data = {} }: SubHeroBannerProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const watermark = contentOverrides['text:subhero:root:div:watermark']?.value ||
    data?.subHero?.watermark ||
    'IT';

  const title = contentOverrides['text:subhero:root:h2:title']?.value ||
    data?.subHero?.title ||
    'IT BERRIES & DIGITAL ENGINEERING';

  const text = contentOverrides['text:subhero:root:p:text']?.value ||
    data?.subHero?.text ||
    data?.bio ||
    data?.summary ||
    'Building high-performance, accessible, and pixel-precise digital web experiences. Combining clean architectural principles with modern UI micro-interactions to create products that engage users and elevate brands.';

  const linkText = contentOverrides['text:subhero:root:a:link']?.value ||
    data?.subHero?.linkText ||
    '| READ MORE |';

  const linkHref = data?.subHero?.linkHref || '#about';

  return (
    <section 
      id="subhero"
      data-section="subhero"
      className="bg-[#161616] text-white py-16 md:py-20 relative overflow-hidden border-t-4 border-black border-b-4 border-black"
      style={styleOverrides['section:subhero:root:section:0']}
    >
      {/* Huge Subtle Watermark Background */}
      <div 
        data-node-id="text:subhero:root:div:watermark"
        data-node-type="text"
        className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 font-heading font-black text-[22vw] text-white/[0.04] select-none pointer-events-none leading-none"
      >
        {watermark}
      </div>

      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10 max-w-4xl">
        <h2 
          data-node-id="text:subhero:root:h2:title"
          data-node-type="text"
          className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl tracking-[0.25em] uppercase text-white mb-4"
          style={styleOverrides['text:subhero:root:h2:title']}
        >
          {title}
        </h2>
        
        <p 
          data-node-id="text:subhero:root:p:text"
          data-node-type="text"
          className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 font-normal"
          style={styleOverrides['text:subhero:root:p:text']}
        >
          {text}
        </p>

        <a 
          href={linkHref}
          data-node-id="text:subhero:root:a:link"
          data-node-type="text"
          className="font-heading text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white hover:text-neutral-300 inline-flex items-center gap-2 transition-all hover:tracking-[0.32em] no-underline"
        >
          {linkText}
        </a>
      </div>
    </section>
  );
}
