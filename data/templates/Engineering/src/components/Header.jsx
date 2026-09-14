import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';

const SECTION_LABEL_MAP = {
  hero: 'Home',
  about: 'About',
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  certificates: 'Certificates',
  contact: 'Contact'
};

export default function Header(props = {}) {
  const data = props?.data || {};
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { profile } = norm;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const sectionList = Array.isArray(props?.visibleSections) && props.visibleSections.length > 0
    ? props.visibleSections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : (Array.isArray(data?.sections) && data.sections.length > 0
        ? data.sections
        : ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact']));

  const navLinks = sectionList
    .map(sec => {
      const rawId = typeof sec === 'string' ? sec : (sec?.id || sec?.name || '');
      let normalizedId = String(rawId).toLowerCase().trim();
      if (normalizedId === 'intro' || normalizedId === 'header') normalizedId = 'hero';
      if (normalizedId === 'timeline' || normalizedId === 'work') normalizedId = 'experience';
      if (normalizedId === 'academics') normalizedId = 'education';
      if (normalizedId === 'portfolio') normalizedId = 'projects';
      if (normalizedId === 'tech' || normalizedId === 'stack') normalizedId = 'skills';
      if (normalizedId === 'achievements' || normalizedId === 'awards' || normalizedId === 'certifications') normalizedId = 'certificates';

      const label = SECTION_LABEL_MAP[normalizedId] || (typeof sec === 'object' && sec?.label ? sec.label : (normalizedId.charAt(0).toUpperCase() + normalizedId.slice(1)));
      const href = normalizedId === 'hero' || normalizedId === 'home' ? '#home' : `#${normalizedId}`;

      return {
        id: normalizedId,
        label,
        href
      };
    })
    .filter(link => link.id !== 'navbar' && link.id !== 'footer' && link.id !== 'header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navLinks]);

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8">
      <div 
        className={`mx-auto max-w-6xl rounded-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#030712]/95 backdrop-blur-xl border border-slate-700/60 shadow-deep-float py-2.5 sm:py-3 px-4 sm:px-6' 
            : 'bg-[#030712]/80 backdrop-blur-md border border-white/20 py-3 sm:py-3.5 px-4 sm:px-8'
        }`}
        style={{ backgroundColor: isScrolled ? 'rgba(3, 7, 18, 0.95)' : 'rgba(3, 7, 18, 0.85)' }}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--campuscv-accent-light, var(--campuscv-accent)) 0%, var(--campuscv-accent) 100%)',
                color: 'var(--primary-foreground, #030712)'
              }}
            >
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--primary-foreground, #030712)' }} />
            </div>
            <div className="flex flex-col">
              <span
                data-node-id="text:header:brand:name:0"
                data-node-type="text"
                data-cv="profile.name"
                className="font-display font-bold text-white text-sm sm:text-base md:text-lg tracking-tight"
              >
                {profile.name}
              </span>
            </div>
          </a>

          {/* Desktop & Tablet Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#0f172a]/90 p-1.5 rounded-full border border-slate-700/50">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.id + link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, var(--campuscv-accent-light, var(--campuscv-accent)) 0%, var(--campuscv-accent) 100%)',
                    color: 'var(--primary-foreground, #030712)',
                    boxShadow: '0 0 15px -2px rgba(var(--campuscv-accent-rgb), 0.5)'
                  } : {}}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center transition-all hidden sm:flex shrink-0"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400 flex items-center justify-center transition-all hidden sm:flex shrink-0"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-700 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-4 pb-3 border-t border-slate-800 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id + link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-3 px-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
