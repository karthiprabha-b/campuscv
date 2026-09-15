import React, { useState } from 'react';
import './src/styles/globals.css';

import Hero from './src/sections/Hero';
import About from './src/sections/About';
import Education from './src/sections/Education';
import Experience from './src/sections/Experience';
import Projects from './src/sections/Projects';
import Skills from './src/sections/Skills';
import Certifications from './src/sections/Certifications';
import Contact from './src/sections/Contact';
import Button from './src/components/Button';

export default function Template(props) {
  // Support all CampusCV prop structures (props.data, props.portfolio, props.profile, props.basics, or root props)
  const rawData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.projects ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  // Extract name & initials
  const name = data.name || data.fullName || data.basics?.name || "";
  const nameInitials = name
    ? name
        .trim()
        .split(/\s+/)
        .map(part => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : "CV";

  // Resolve Avatar Image URL across CampusCV fields & live editor overrides
  const rawOverride =
    data.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:about:root:img:0'] === 'string' ? data.contentOverrides?.['image:about:root:img:0'] : null) ||
    data.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data.imageOverrides?.['image:about:root:img:0'] ||
    data.imageOverrides?.['image:hero:root:img:0'] ||
    data.imageOverrides?.['about.avatarUrl'];
  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value) : rawOverride;
  const avatarUrl =
    explicitAvatar ||
    data.profileImage ||
    data.avatarUrl ||
    data.avatar ||
    data.photo ||
    data.image ||
    (typeof data.about === 'object' && data.about !== null && (
      data.about.avatarUrl || data.about.avatar || data.about.image || data.about.photo || data.about.picture || data.about.profileImage
    )) || data.basics?.image || data.basics?.avatar || "";

  // Resolve Bio
  const bio = (typeof data.about === 'string' ? data.about : (
    data.about?.bio || data.about?.description || data.about?.text || data.about?.summary
  )) || data.aboutMe || data.bio || data.summary || data.description || data.basics?.summary || "";

  const about = {
    bio,
    avatarUrl,
    title: (typeof data.about === 'object' && data.about !== null ? (data.about.title || data.about.heading) : null) || data.aboutHeading || data.aboutTitle || (name ? `About ${name}` : "About Me"),
    stats: (typeof data.about === 'object' && data.about !== null && Array.isArray(data.about.stats)) ? data.about.stats : (Array.isArray(data.stats) ? data.stats : null)
  };

  const hero = {
    title: data.hero?.title || (name ? `Software Developer & Engineer` : "Engineering Scalable Systems"),
    subtitle: data.hero?.subtitle || data.tagline || data.title || data.role || data.headline || data.basics?.label || "Full-Stack & AI Systems Developer",
    introductionText: data.hero?.introductionText || data.hero?.description || data.introductionText || data.aboutMe || data.bio || data.summary || "",
    name,
    avatarUrl
  };

  const skills = Array.isArray(data.skills) ? data.skills : (Array.isArray(data.skillsList) ? data.skillsList : (Array.isArray(data.techStack) ? data.techStack : (Array.isArray(data.technologies) ? data.technologies : [])));
  const projects = Array.isArray(data.projects) ? data.projects : (Array.isArray(data.portfolioProjects) ? data.portfolioProjects : (Array.isArray(data.works) ? data.works : []));
  const experience = (Array.isArray(data.experience) && data.experience.length > 0) ? data.experience : (Array.isArray(data.workExperience) && data.workExperience.length > 0 ? data.workExperience : (Array.isArray(data.work) && data.work.length > 0 ? data.work : (Array.isArray(data.timeline) ? data.timeline : [])));
  const education = (Array.isArray(data.education) && data.education.length > 0) ? data.education : (Array.isArray(data.academics) && data.academics.length > 0 ? data.academics : (Array.isArray(data.educationList) && data.educationList.length > 0 ? data.educationList : []));
  const certifications = (Array.isArray(data.certifications) && data.certifications.length > 0) ? data.certifications : (Array.isArray(data.certificates) && data.certificates.length > 0 ? data.certificates : (Array.isArray(data.awards) && data.awards.length > 0 ? data.awards : []));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accentColor = data?.theme?.primaryColor || data?.themeColor || data?.accentColor || data?.primaryColor || '';

  const dynamicStyles = {
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    ...(accentColor ? {
      '--primary': accentColor,
      '--primary-hover': accentColor,
      '--campuscv-accent': accentColor,
      '--cv-accent': accentColor
    } : {})
  };

  const isSectionVisible = (sectionName) => {
    const key = String(sectionName).toLowerCase();
    
    if (data?.deletedNodes?.[`section:${key}:root:section:0`] === true || data?.deletedNodes?.[key] === true) {
      return false;
    }
    if (data?.hiddenNodes?.[`section:${key}:root:section:0`] === true || data?.hiddenNodes?.[key] === true) {
      return false;
    }
    if (Array.isArray(data?.hiddenFields) && (data.hiddenFields.includes(`sections.${key}`) || data.hiddenFields.includes(key))) {
      return false;
    }

    const directVal = data[`${key}.visible`];
    if (directVal !== undefined) return Boolean(directVal);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) {
      return Boolean(data[key].visible);
    }
    if (data[`${key}Visible`] !== undefined) {
      return Boolean(data[`${key}Visible`]);
    }
    return true;
  };

  const hasAbout = isSectionVisible('about') && Boolean(bio || about.title);
  const hasEducation = isSectionVisible('education') && education.length > 0;
  const hasExperience = isSectionVisible('experience') && experience.length > 0;
  const hasProjects = isSectionVisible('projects') && projects.length > 0;
  const hasSkills = isSectionVisible('skills') && skills.length > 0;
  const hasCertifications = isSectionVisible('certifications') && certifications.length > 0;
  const hasContact = isSectionVisible('contact');

  const sectionComponentMap = {
    hero: isSectionVisible('hero') ? (
      <Hero 
        key="hero"
        data={data}
        hero={hero} 
        name={name}
        education={education}
        skills={skills}
      />
    ) : null,
    about: hasAbout ? <About key="about" data={data} about={about} avatarUrl={avatarUrl} name={name} /> : null,
    education: hasEducation ? <Education key="education" data={data} education={education} /> : null,
    experience: hasExperience ? <Experience key="experience" data={data} experience={experience} /> : null,
    projects: hasProjects ? <Projects key="projects" data={data} projects={projects} /> : null,
    skills: hasSkills ? <Skills key="skills" data={data} skills={skills} /> : null,
    certifications: hasCertifications ? <Certifications key="certifications" data={data} certifications={certifications} /> : null,
    contact: hasContact ? (
      <Contact 
        key="contact"
        data={data}
        name={name}
        email={data.profile?.email || data.email || data.ownerEmail || data.basics?.email || (typeof data.contact === 'object' ? data.contact?.email : null) || ''}
        location={data.profile?.location || data.location || data.basics?.location?.city || (typeof data.contact === 'object' ? data.contact?.location : null) || ''}
        socials={data.profile?.socialLinks || data.socials || data.socialLinks || data.social || data.basics?.profiles || []}
        socialLinks={data.profile?.socialLinks || data.socials || data.socialLinks || data.social || data.basics?.profiles || []}
      />
    ) : null
  };

  const defaultMainSections = [
    'hero',
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    'certifications',
    'contact'
  ];

  const hasCustomOrder = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0;
  const rawOrder = hasCustomOrder
    ? data.sectionOrder
    : ((Array.isArray(data?.sections) && data.sections.length > 0)
      ? data.sections
      : defaultMainSections);

  const mainSectionIds = [];
  const added = new Set();

  rawOrder.forEach((rawItem) => {
    const rawVal = typeof rawItem === 'object' && rawItem !== null ? (rawItem.id || rawItem.name || '') : rawItem;
    let s = String(rawVal || '').toLowerCase().trim();
    if (!s || s === 'header' || s === 'footer' || s === 'navbar') return;
    
    let id = s;
    if (s.includes('hero') || s.includes('home') || s.includes('intro') || s === 'banner') id = 'hero';
    else if (s.includes('about') || s.includes('bio') || s.includes('summary')) id = 'about';
    else if (s.includes('proj') || s.includes('work') || s.includes('portfolio') || s.includes('featured')) id = 'projects';
    else if (s.includes('exp') || s.includes('career') || s.includes('timeline') || s.includes('job') || s.includes('history')) id = 'experience';
    else if (s.includes('edu') || s.includes('acad') || s.includes('school') || s.includes('degree')) id = 'education';
    else if (s.includes('skill') || s.includes('tech') || s.includes('tool') || s.includes('stack')) id = 'skills';
    else if (s.includes('cert') || s.includes('award') || s.includes('recogni') || s.includes('license')) id = 'certifications';
    else if (s.includes('contact') || s.includes('touch') || s.includes('connect') || s.includes('message')) id = 'contact';

    if (sectionComponentMap[id] !== undefined && !added.has(id)) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  // Always append any missing standard sections in default canonical order
  defaultMainSections.forEach((id) => {
    if (!added.has(id) && sectionComponentMap[id] !== undefined) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  const visibleSectionList = mainSectionIds.filter((secId) => Boolean(sectionComponentMap[secId]));

  const navLinks = visibleSectionList
    .map(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      const id = sName.toLowerCase().replace(/\s+/g, '-');
      const href = id === 'home' || id === 'hero' ? '#hero' : `#${id}`;
      return {
        label: cleanName === 'Hero' ? 'Home' : cleanName === 'Skills' ? 'Tech Stack' : cleanName,
        href
      };
    });

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

  return (
    <div className="portfolio-root campuscv-template-root light" data-theme="light" style={dynamicStyles} data-campuscv-template="cs-portfolio">
      {/* Background Accent Grid */}
      <div className="bg-grid"></div>

      {/* Navigation Bar */}
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="#hero" className="logo">
            <div className="logo-badge">{nameInitials}</div>
            <span className="logo-text">{name || "Portfolio"}</span>
          </a>

          {navLinks.length > 0 && (
            <nav className="nav-links">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div className="nav-actions">
            {hasContact && (
              <Button href="#contact" variant="primary" className="nav-btn-desktop" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}>
                Get in Touch
              </Button>
            )}

            {navLinks.length > 0 && (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}>
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && navLinks.length > 0 && (
        <div className="mobile-drawer open">
          <div className="mobile-drawer-links">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
          {hasContact && (
            <div className="mobile-drawer-actions">
              <Button href="#contact" onClick={() => setMobileMenuOpen(false)} variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get in Touch
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Ordered Flow */}
      <main>
        {mainSectionIds.map((secId) => {
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 0', background: 'var(--card-bg, #ffffff)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} {name || 'Portfolio'}. All rights reserved.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <span>Back to top ↑</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
