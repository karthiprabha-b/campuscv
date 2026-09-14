import React, { useState, useEffect } from 'react';
import { Scale, Briefcase, Menu, X } from 'lucide-react';

const SECTION_LABEL_MAP = {
  hero: 'Home',
  achievements: 'Achievements',
  certifications: 'Achievements',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  services: 'Services',
  experience: 'Experience',
  education: 'Education',
  testimonials: 'Reviews',
  contact: 'Contact'
};

export default function Navbar(props = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const incoming = props?.data || props?.portfolio || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || data?.personalInfo?.name || "Alexander Vance";
  const rawTitle = hero?.title || data?.title || data?.personalInfo?.title || "Executive Legal Counsel";
  const title = String(rawTitle || "Executive Legal Counsel");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionList = Array.isArray(props?.visibleSections) && props.visibleSections.length > 0
    ? props.visibleSections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : (Array.isArray(data?.sections) && data.sections.length > 0
        ? data.sections
        : ['hero', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'contact']));

  const navLinks = sectionList
    .map(sec => {
      const rawId = typeof sec === 'string' ? sec : (sec?.id || sec?.name || '');
      const cleanId = String(rawId).toLowerCase().trim();
      let normalizedId = cleanId;
      if (normalizedId === 'intro' || normalizedId === 'header') normalizedId = 'hero';
      if (normalizedId === 'timeline' || normalizedId === 'work') normalizedId = 'experience';
      if (normalizedId === 'academics') normalizedId = 'education';
      if (normalizedId === 'portfolio') normalizedId = 'projects';
      if (normalizedId === 'tech' || normalizedId === 'stack') normalizedId = 'skills';
      if (normalizedId === 'awards' || normalizedId === 'certificates' || normalizedId === 'certifications') normalizedId = 'achievements';
      if (normalizedId === 'reviews') normalizedId = 'testimonials';

      const label = SECTION_LABEL_MAP[normalizedId] || (typeof sec === 'object' && sec?.label ? sec.label : (cleanId.charAt(0).toUpperCase() + cleanId.slice(1)));
      const href = normalizedId === 'hero' || normalizedId === 'home' ? '#hero' : `#${normalizedId}`;

      return {
        id: normalizedId,
        name: label,
        href
      };
    })
    .filter(link => link.id !== 'navbar' && link.id !== 'footer' && link.id !== 'header');

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-luxury py-3 border-b border-stone-200'
          : 'bg-[#FAF8F5]/90 backdrop-blur-md py-4 border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Branding & Logo */}
        <a href="#hero" className="flex items-center gap-3 group text-decoration-none">
          <div 
            className="w-10 h-10 rounded-none flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0"
            style={{
              backgroundColor: 'var(--campuscv-accent, #C89B3C)',
              color: 'var(--primary-foreground, #FFFFFF)'
            }}
          >
            <Scale className="w-5 h-5" style={{ color: 'var(--primary-foreground, #FFFFFF)' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A] group-hover:text-[var(--campuscv-accent,#C89B3C)] transition-colors">
              {name}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#6B7280] uppercase line-clamp-1 max-w-[280px]">
              {title}
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id + link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest font-semibold text-stone-700 hover:text-[var(--campuscv-accent,#C89B3C)] transition-colors duration-200 relative py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm hover:brightness-105 transition-all border"
            style={{
              backgroundColor: 'var(--campuscv-accent, #C89B3C)',
              color: 'var(--primary-foreground, #FFFFFF)',
              borderColor: 'var(--campuscv-accent, #C89B3C)'
            }}
          >
            <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--primary-foreground, #FFFFFF)' }} />
            <span style={{ color: 'var(--primary-foreground, #FFFFFF)' }}>Hire Me</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-stone-300 text-[#1A1A1A]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id + link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-stone-700 hover:text-[var(--campuscv-accent,#C89B3C)] py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-stone-200">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: 'var(--campuscv-accent, #C89B3C)',
                  color: 'var(--primary-foreground, #FFFFFF)',
                  borderColor: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <Briefcase className="w-4 h-4" style={{ color: 'var(--primary-foreground, #FFFFFF)' }} />
                <span style={{ color: 'var(--primary-foreground, #FFFFFF)' }}>Hire Me</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
