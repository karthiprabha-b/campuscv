import React from 'react';

export default function Header(props = {}) {
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

  const navLinks = [
    { label: "About", href: "#about", show: hasAbout },
    { label: "Education", href: "#education", show: hasEducation },
    { label: "Experience", href: "#experience", show: hasExperience },
    { label: "Work", href: "#projects", show: hasProjects },
    { label: "Skills", href: "#skills", show: hasSkills },
    { label: "Certifications", href: "#certifications", show: hasCertifications },
    { label: "Process", href: "#process", show: hasProcess },
    { label: "Contact", href: "#contact", show: hasContact }
  ].filter(link => link.show);

  return (
    <header data-node-id="section:header:root:header:0" className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo / Name */}
        <a href="#hero" className="group flex items-center gap-3 min-w-0 max-w-[70%] sm:max-w-none">
          <div data-node-id="container:header:root:logo:0" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-heading font-bold text-base sm:text-lg group-hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shrink-0">
            <span data-node-id="text:header:root:logo:0">{initial}</span>
          </div>
          <div className="min-w-0">
            <span
              className="font-heading font-bold text-base sm:text-lg tracking-tight block leading-none truncate"
              data-cv="hero.name"
              data-node-id="text:header:root:name:0"
            >
              {name || "Portfolio"}
            </span>
          </div>
        </a>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              data-node-id={`button:header:nav:${idx}`}
              className="text-xs lg:text-sm font-semibold text-[#111111]/80 hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors uppercase tracking-wider"
            >
              <span data-node-id={`text:header:nav:${idx}`}>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          data-cv="hero.primaryButton"
          data-node-id="button:header:root:cta:0"
          className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#111111] text-white hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors shadow-sm shrink-0"
        >
          <span data-node-id="text:header:root:cta:0">Get In Touch</span>
        </a>
      </div>
    </header>
  );
}
