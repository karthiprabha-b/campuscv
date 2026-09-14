import React from 'react';
import { Scale, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';

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

export default function Footer(props = {}) {
  const incoming = props?.data || props?.portfolio || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || data?.personalInfo?.name || "Alexander Vance";
  const rawTitle = hero?.title || data?.title || data?.personalInfo?.title || "Senior Legal Counsel & Partner";
  const title = String(rawTitle || "Senior Legal Counsel & Partner");
  const socials = hero?.socials || data?.socials || {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    dribbble: "https://dribbble.com",
  };

  const scrollToTop = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const topEl = document.getElementById('hero') || document.querySelector('header') || document.getElementById('template-root') || document.body;
        if (topEl && typeof topEl.scrollIntoView === 'function') {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      try { window.scrollTo(0, 0); } catch (_) {}
    }
  };

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
    <footer 
      id="footer" 
      data-cv-section="footer" 
      className="bg-[#0B0F19] text-white border-t pt-16 pb-12"
      style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b"
          style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
        >
          
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 flex items-center justify-center shadow-gold-glow shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C))',
                  color: 'var(--primary-foreground, #FFFFFF)'
                }}
              >
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block">
                  {name}
                </span>
                <span 
                  className="text-[10px] font-bold tracking-widest uppercase font-sans line-clamp-1"
                  style={{ color: 'var(--campuscv-accent-light, #D5B350)' }}
                >
                  {title}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-sm">
              Providing strategic counsel, corporate jurisprudence, and bespoke advisory designed to safeguard enterprise assets and drive tangible results.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Linkedin, url: socials?.linkedin, name: 'LinkedIn' },
                { icon: Github, url: socials?.github, name: 'GitHub' },
                { icon: Twitter, url: socials?.twitter, name: 'Twitter' },
                { icon: Dribbble, url: socials?.dribbble, name: 'Dribbble' },
              ].map((soc, i) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border text-gray-300 hover:text-[var(--campuscv-accent-light,#D5B350)] hover:border-[var(--campuscv-accent,#C89B3C)] transition-colors"
                    style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
                    aria-label={soc.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-4 space-y-3 font-sans">
            <h4 
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--campuscv-accent-light, #D5B350)' }}
            >
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              {navLinks.map((link) => (
                <li key={link.id + link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-[var(--campuscv-accent-light,#D5B350)] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Action / Back to Top */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 font-sans">
            <div>
              <h4 
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--campuscv-accent-light, #D5B350)' }}
              >
                Executive Portfolio
              </h4>
              <p className="text-xs text-gray-400">
                Direct inquiries and high-velocity retainer consultations.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2.5 border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer hover:bg-white/5"
                style={{
                  borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.5)',
                  color: 'var(--campuscv-accent-light, #D5B350)'
                }}
                aria-label="Scroll back to top"
              >
                <span>↑ Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-sans">
          <p>© {new Date().getFullYear()} {name}. All Rights Reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:underline cursor-pointer flex items-center gap-1"
            style={{ color: 'var(--campuscv-accent-light, #D5B350)' }}
          >
            <span>Back to top ↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
