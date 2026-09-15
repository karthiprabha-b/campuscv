import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Header(props = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const data = props?.data || props?.portfolio || props || {};
  const personal = data.personal || {};
  const profile = data.profile || {};
  const hero = data.hero || {};

  const name = profile.name || profile.fullName || data.name || data.fullName || personal.name || personal.fullName || hero.name || (typeof props.name === 'string' && props.name ? props.name : "Maya Kapoor");
  const role = profile.headline || data.role || data.headline || data.tagline || personal.role || personal.headline || hero.role || (typeof props.role === 'string' && props.role ? props.role : "Senior Product Designer");
  const initial = name ? name.trim().charAt(0).toUpperCase() : "M";

  const isSectionVisible = (sectionName) => {
    const directVal = data[`${sectionName}.visible`];
    if (directVal !== undefined) return Boolean(directVal);
    if (data[sectionName] && typeof data[sectionName] === 'object' && data[sectionName].visible !== undefined) {
      return Boolean(data[sectionName].visible);
    }
    if (data[`${sectionName}Visible`] !== undefined) {
      return Boolean(data[`${sectionName}Visible`]);
    }
    return true;
  };

  const isDeleted = (...nodeIds) => {
    if (!data.deletedNodes) return false;
    return nodeIds.some(id => Boolean(data.deletedNodes[id]));
  };

  // Helper to extract list safely from multiple possible locations
  const getList = (key, fallbackKey) => {
    const list = data[key] ?? data?.data?.[key] ?? data?.content?.[key] ?? data?.resume?.[key];
    if (Array.isArray(list)) return list.filter(Boolean);
    if (Array.isArray(list?.items)) return list.items.filter(Boolean);
    if (fallbackKey) {
      const fbList = data[fallbackKey] ?? data?.data?.[fallbackKey] ?? data?.content?.[fallbackKey] ?? data?.resume?.[fallbackKey];
      if (Array.isArray(fbList)) return fbList.filter(Boolean);
      if (Array.isArray(fbList?.items)) return fbList.items.filter(Boolean);
    }
    return [];
  };

  const projectsList = getList('projects', 'portfolioProjects');
  const experienceList = getList('experience', 'timeline');
  const skillsList = getList('skills');
  const toolsList = getList('tools');
  const educationList = getList('education', 'academics');
  const certList = getList('certifications', 'awards');
  const processList = getList('process', 'services');

  const hasProjects = isSectionVisible('projects') && !isDeleted('section:projects:root:section:0', 'section:projects:root:0', 'container:projects:section:0') && projectsList.length > 0;
  const hasAbout = isSectionVisible('about') && !isDeleted('section:about:root:section:0') && Boolean(
    data.aboutMe || data.about?.bio || data.about?.description || data.about?.headline || data.about?.title || data.profile?.summary || data.summary || data.bio
  );
  const hasProcess = isSectionVisible('process') && !isDeleted('section:process:root:section:0') && (processList.length > 0 || (Array.isArray(data.activatedSections) && data.activatedSections.includes('process')));
  const hasExperience = isSectionVisible('experience') && !isDeleted('container:experience:section:0', 'section:experience:root:section:0') && experienceList.length > 0;
  const hasSkills = isSectionVisible('skills') && !isDeleted('section:skills:root:section:0') && (skillsList.length > 0 || toolsList.length > 0);
  const hasEducation = isSectionVisible('education') && !isDeleted('container:education:section:0', 'section:education:root:section:0') && educationList.length > 0;
  const hasCertifications = isSectionVisible('certifications') && !isDeleted('container:certifications:section:0', 'section:certifications:root:section:0') && certList.length > 0;
  const hasContact = isSectionVisible('contact') && !isDeleted('section:contact:root:section:0');

  const defaultOrder = ['hero', 'about', 'projects', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonial', 'contact'];
  const dynamicSections = Array.isArray(props?.visibleSections) && props.visibleSections.length > 0
    ? props.visibleSections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : defaultOrder);

  const navLinks = dynamicSections
    .filter(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const sLower = sName.toLowerCase();
      if (sLower === 'header' || sLower === 'footer' || sLower === 'navbar') return false;
      if (props?.visibleSections) return true;
      if (sLower.includes('proj') || sLower.includes('work')) return hasProjects;
      if (sLower.includes('about')) return hasAbout;
      if (sLower.includes('exp')) return hasExperience;
      if (sLower.includes('edu')) return hasEducation;
      if (sLower.includes('skill')) return hasSkills;
      if (sLower.includes('cert')) return hasCertifications;
      if (sLower.includes('process') || sLower.includes('approach')) return hasProcess;
      if (sLower.includes('contact')) return hasContact;
      return true;
    })
    .map(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const sLower = sName.toLowerCase();
      let label = sName.charAt(0).toUpperCase() + sName.slice(1);
      let href = `#${sLower.replace(/\s+/g, '-')}`;

      if (sLower.includes('hero') || sLower.includes('home')) {
        label = 'Home';
        href = '#hero';
      } else if (sLower.includes('about')) {
        label = 'About';
        href = '#about';
      } else if (sLower.includes('proj') || sLower.includes('work')) {
        label = 'Work';
        href = '#projects';
      } else if (sLower.includes('process') || sLower.includes('approach')) {
        label = 'Process';
        href = '#process';
      } else if (sLower.includes('exp')) {
        label = 'Experience';
        href = '#experience';
      } else if (sLower.includes('skill') || sLower.includes('tool')) {
        label = 'Skills';
        href = '#skills';
      } else if (sLower.includes('edu')) {
        label = 'Education';
        href = '#education';
      } else if (sLower.includes('cert')) {
        label = 'Certifications';
        href = '#certifications';
      } else if (sLower.includes('testim')) {
        label = 'Testimonials';
        href = '#testimonial';
      } else if (sLower.includes('contact')) {
        label = 'Contact';
        href = '#contact';
      }

      return { label, href };
    });

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const targetId = href.replace(/^#/, '');
    if (targetId === 'hero') {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
      return;
    }
    const el = document.getElementById(targetId) || document.querySelector(`[data-section="${targetId}"]`) || document.querySelector(`[data-cv-section="${targetId}"]`);
    if (el) {
      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
    }
  };

  return (
    <header data-node-id="section:header:root:header:0" className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo / Name */}
        <a href="#hero" onClick={() => handleNavClick('#hero')} className="group flex items-center gap-3 min-w-0 max-w-[70%] sm:max-w-none no-underline text-inherit">
          <div data-node-id="container:header:root:logo:0" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-heading font-bold text-base sm:text-lg group-hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shrink-0">
            <span data-node-id="text:header:root:logo:0">{initial}</span>
          </div>
          <div className="min-w-0">
            <span
              className="font-heading font-bold text-base sm:text-lg tracking-tight block leading-none truncate text-[#111111]"
              data-cv="hero.name"
              data-node-id="text:header:root:name:0"
            >
              {name || "Portfolio"}
            </span>
          </div>
        </a>

        {/* Desktop Nav items */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              data-node-id={`button:header:nav:${idx}`}
              className="text-xs lg:text-sm font-semibold text-[#111111]/80 hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors uppercase tracking-wider no-underline cursor-pointer"
            >
              <span data-node-id={`text:header:nav:${idx}`}>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right CTA & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* CTA */}
          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            data-cv="hero.primaryButton"
            data-node-id="button:header:root:cta:0"
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#111111] text-white hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shadow-sm shrink-0 no-underline cursor-pointer"
          >
            <span data-node-id="text:header:root:cta:0">Get In Touch</span>
          </a>

          {/* Mobile & Tablet Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-[#E5E0D8] bg-white text-[#111111] hover:bg-[#F2EEE9] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-[#FAF8F5]/98 backdrop-blur-xl px-5 py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-[#111111] hover:bg-[#F2EEE9] hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors uppercase tracking-wider no-underline cursor-pointer"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </a>
            ))}
          </nav>
          <div className="mt-5 pt-4 border-t border-[#E5E0D8]">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider bg-[#111111] text-white hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shadow-md no-underline cursor-pointer"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
