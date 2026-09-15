'use client';

import React, { useState, useEffect } from 'react';

interface NavbarProps {
  data?: any;
}

export default function Navbar({ data = {} }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const rawName = data?.name || data?.fullName || data?.hero?.name || data?.personal?.fullName || 'Tomasz Gajda';
  const nameInitials = rawName
    ? rawName
        .trim()
        .split(/\s+/)
        .map((p: string) => p[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'TG';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['about', 'education', 'experience', 'portfolio', 'skills', 'certificates', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultOrder: string[] = ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];
  const dynamicSections: any[] = Array.isArray((data as any)?.visibleSections) && (data as any).visibleSections.length > 0
    ? (data as any).visibleSections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : defaultOrder);

  const hasCerts = Array.isArray(data?.certificates) ? data.certificates.length > 0 : (Array.isArray(data?.certifications) && data.certifications.length > 0);
  const hasEdu = Array.isArray(data?.education) ? data.education.length > 0 : (data.education !== undefined ? false : true);
  const hasExp = Array.isArray(data?.experience) ? data.experience.length > 0 : (data.experience !== undefined ? false : true);
  const hasProj = Array.isArray(data?.projects) ? data.projects.length > 0 : (data.projects !== undefined ? false : true);
  const hasSkills = Array.isArray(data?.skills) ? data.skills.length > 0 : (data.skills !== undefined ? false : true);

  const navLinks: Array<{ name: string; href: string; id: string }> = dynamicSections
    .filter((sec: any) => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const sLower = sName.toLowerCase().trim();
      if (!sLower || sLower === 'header' || sLower === 'footer' || sLower === 'navbar') return false;
      if ((data as any)?.visibleSections) return true;
      if (sLower === 'certificates' || sLower === 'certifications') return hasCerts;
      if (sLower === 'education') return hasEdu;
      if (sLower === 'experience') return hasExp;
      if (sLower === 'projects') return hasProj;
      if (sLower === 'skills') return hasSkills;
      return true;
    })
    .map((sec: any) => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      const id = sName.toLowerCase().replace(/\s+/g, '-');
      const href = id === 'home' || id === 'hero' ? '#hero' : `#${id}`;
      return {
        name: cleanName === 'Hero' ? 'Home' : cleanName === 'About' ? 'About me' : cleanName === 'Projects' ? 'Portfolio' : cleanName,
        href,
        id: id === 'home' ? 'hero' : id === 'projects' ? 'portfolio' : id
      };
    });

  return (
    <header 
      data-section="navbar"
      className="sticky top-0 left-0 w-full z-50 bg-[#E5E5E5] border-b-2 border-black/80 backdrop-blur-md shadow-sm transition-colors py-3.5 sm:py-4"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Brand Monogram */}
        <a href="#hero" className="flex items-center gap-3 group text-black no-underline" aria-label="Home">
          <div 
            data-node-id="text:navbar:root:div:monogram"
            data-node-type="text"
            className="w-10 h-10 border-2 border-black flex items-center justify-center font-heading font-black text-lg bg-white text-black transition-all duration-300 group-hover:rotate-90 shadow-solid-sm group-hover:shadow-[3px_3px_0px_var(--primary,#000000)] select-none"
          >
            {nameInitials}
          </div>
          <span 
            data-node-id="text:navbar:root:span:name"
            data-node-type="text"
            className="font-heading font-black text-base tracking-widest uppercase hidden sm:inline-block select-none text-black"
          >
            {rawName}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`font-heading text-xs font-bold tracking-wider uppercase transition-colors relative py-1 no-underline ${
                    activeSection === link.id
                      ? 'text-black font-extrabold'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary,#000000)]" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact Pill CTA Button */}
          <a
            href="#contact"
            data-node-id="button:navbar:root:a:contact"
            data-node-type="button"
            className="font-heading text-xs font-black tracking-widest uppercase px-6 py-2.5 rounded-full border-2 border-black bg-white text-black hover:bg-[var(--primary,#000000)] hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)] transition-all shadow-solid-sm hover:-translate-y-0.5 no-underline cursor-pointer"
          >
            CONTACT ME
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="#contact"
            className="font-heading text-[11px] font-black tracking-wider uppercase px-4 py-1.5 rounded-full border-2 border-black bg-white text-black no-underline"
          >
            CONTACT ME
          </a>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-black bg-transparent border-none cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-0.5 bg-black mb-1.5 transition-transform" />
            <div className="w-6 h-0.5 bg-black mb-1.5 transition-opacity" />
            <div className="w-6 h-0.5 bg-black transition-transform" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[#E5E5E5] border-b-4 border-black px-6 py-6 transition-all shadow-xl">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="font-heading text-sm font-bold tracking-widest uppercase block py-2 border-b border-black/10 text-black no-underline"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setIsMobileOpen(false)}
                className="btn-box w-full text-center"
              >
                | CONTACT ME |
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
