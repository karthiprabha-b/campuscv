'use client';

import React from 'react';

interface FooterProps {
  data?: any;
}

export default function Footer({ data = {} }: FooterProps) {
  const name = data?.profile?.name || data?.name || data?.fullName || data?.hero?.name || data?.personal?.fullName || 'Tomasz Gajda';
  const github = data?.profile?.socialLinks?.find?.((s: any) => (s.platform||'').includes('github'))?.url || data?.socialLinks?.github || data?.socials?.github || data?.github || 'https://github.com';
  const linkedin = data?.profile?.socialLinks?.find?.((s: any) => (s.platform||'').includes('linkedin'))?.url || data?.socialLinks?.linkedin || data?.socials?.linkedin || data?.linkedin || 'https://linkedin.com';
  const dribbble = data?.socialLinks?.dribbble || data?.socials?.dribbble || data?.dribbble || 'https://dribbble.com';

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      if (typeof document !== 'undefined') {
        if (document.documentElement) {
          try {
            document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          } catch (e) {
            document.documentElement.scrollTop = 0;
          }
        }
        if (document.body) {
          try {
            document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          } catch (e) {
            document.body.scrollTop = 0;
          }
        }
        const scrollable = document.querySelector('.overflow-y-auto, [data-scroll-container], main, #root, #__next');
        if (scrollable) {
          try {
            scrollable.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (e) {
            scrollable.scrollTop = 0;
          }
        }
        const topEl = document.getElementById('hero') || document.querySelector('header') || document.body;
        if (topEl && typeof topEl.scrollIntoView === 'function') {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <footer 
      data-section="footer"
      className="bg-black text-white py-12 border-t-4 border-black"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div 
            data-node-id="text:footer:root:div:name"
            data-node-type="text"
            className="font-heading font-black text-xl tracking-widest uppercase text-white"
          >
            {name}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            data-node-id="button:footer:root:top"
            data-node-type="button"
            className="font-heading font-black text-xs tracking-widest uppercase px-5 py-2.5 border-2 border-white hover:bg-[var(--primary,#FFFFFF)] hover:text-[var(--primary-foreground,#000000)] hover:border-[var(--primary,#FFFFFF)] transition-all shadow-solid-sm cursor-pointer bg-transparent text-white active:scale-95"
            aria-label="Scroll to top"
          >
            ↑ BACK TO TOP
          </button>
        </div>

        <div className="h-[1px] bg-white/15 mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <div data-node-id="text:footer:root:div:copy" data-node-type="text">
            &copy; {new Date().getFullYear()} {name}. All rights reserved. Crafted with precision & clean code.
          </div>
          <div className="flex items-center gap-6">
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors no-underline">
              GitHub
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors no-underline">
              LinkedIn
            </a>
            <a href={dribbble} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors no-underline">
              Dribbble
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
