import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Process from './sections/Process';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Education from './sections/Education';
import Certifications from './sections/Certifications';
import Testimonial from './sections/Testimonial';
import Contact from './sections/Contact';
import './styles/styles.css';

export default function Template(props = {}) {
  const data = props?.data || props?.portfolio || props || {};

  const accentColor = data?.theme?.primaryColor || data?.themeColor || data?.accentColor || data?.primaryColor || '';
  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    ...(accentColor ? {
      '--campuscv-accent': accentColor,
      '--cv-accent': accentColor,
      '--primary': accentColor,
      '--accent': accentColor,
      '--theme-color': accentColor,
      '--brand': accentColor
    } : {}),
    ...(fontFamily ? {
      '--campuscv-font-family': `${fontFamily}, sans-serif`,
      '--font-body': `${fontFamily}, sans-serif`
    } : {}),
    ...(fontSize ? {
      '--campuscv-base-font-size': `${fontSize}px`
    } : {})
  };

  const isSectionVisible = (sectionName) => {
    const key = String(sectionName).toLowerCase().trim();
    
    const aliasMap = {
      hero: ['hero', 'intro', 'home', 'header'],
      about: ['about', 'bio'],
      skills: ['skills', 'tech', 'stack', 'tools'],
      projects: ['projects', 'portfolio', 'work'],
      experience: ['experience', 'timeline', 'work'],
      education: ['education', 'academics'],
      certifications: ['certificates', 'certifications', 'awards', 'achievements'],
      process: ['process', 'workflow', 'methodology'],
      testimonial: ['testimonial', 'testimonials', 'reviews'],
      contact: ['contact', 'socials']
    };

    const keysToCheck = aliasMap[key] || [key];

    for (const k of keysToCheck) {
      if (data?.deletedNodes?.[`section:${k}:root:section:0`] === true || data?.deletedNodes?.[k] === true) {
        return false;
      }
      if (data?.hiddenNodes?.[`section:${k}:root:section:0`] === true || data?.hiddenNodes?.[k] === true) {
        return false;
      }
      if (Array.isArray(data?.hiddenFields) && (data.hiddenFields.includes(`sections.${k}`) || data.hiddenFields.includes(k))) {
        return false;
      }
      if (Array.isArray(data?.hiddenSections) && (data.hiddenSections.includes(k) || data.hiddenSections.includes(`sections.${k}`))) {
        return false;
      }
      if (data?.styleOverrides?.[k]?.display === 'none' || data?.styleOverrides?.[`section:${k}:root:section:0`]?.display === 'none') {
        return false;
      }
      if (data[`${k}.visible`] !== undefined && !data[`${k}.visible`]) return false;
      if (data[`${k}Visible`] !== undefined && !data[`${k}Visible`]) return false;
    }

    if (data[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    // If explicit collection array is empty, hide section
    if (key === 'certifications' || key === 'certificates') {
      const certs = data?.certifications || data?.certificates || data?.awards;
      if (Array.isArray(certs) && certs.length === 0) return false;
    }
    if (key === 'education') {
      const edu = data?.education || data?.academics;
      if (Array.isArray(edu) && edu.length === 0) return false;
    }
    if (key === 'experience') {
      const exp = data?.experience || data?.timeline;
      if (Array.isArray(exp) && exp.length === 0) return false;
    }
    if (key === 'projects') {
      const proj = data?.projects || data?.portfolio;
      if (Array.isArray(proj) && proj.length === 0) return false;
    }
    if (key === 'skills') {
      const sk = data?.skills || data?.tech || data?.tools;
      if (Array.isArray(sk) && sk.length === 0) return false;
    }
    if (key === 'process') {
      const proc = data?.process || data?.workflow;
      if (Array.isArray(proc) && proc.length === 0) return false;
    }
    if (key === 'testimonial') {
      const test = data?.testimonials || data?.testimonial;
      if (Array.isArray(test) && test.length === 0) return false;
    }

    return true;
  };

  const sectionComponentMap = {
    hero: <Hero key="hero" data={data} />,
    about: <About key="about" data={data} />,
    education: <Education key="education" data={data} />,
    experience: <Experience key="experience" data={data} />,
    projects: <Projects key="projects" data={data} />,
    skills: <Skills key="skills" data={data} />,
    certifications: <Certifications key="certifications" data={data} />,
    process: <Process key="process" data={data} />,
    testimonial: <Testimonial key="testimonial" data={data} />,
    contact: <Contact key="contact" data={data} />
  };

  const defaultMainSections = [
    'hero',
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    'certifications',
    'process',
    'testimonial',
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
    let id = String(rawVal || '').toLowerCase().trim();
    if (id === 'home' || id === 'intro') id = 'hero';
    if (id === 'certificates' || id === 'awards') id = 'certifications';
    if (id === 'timeline' || id === 'work') id = 'experience';
    if (id === 'academics') id = 'education';
    if (id === 'portfolio') id = 'projects';
    if (id === 'tech') id = 'skills';
    if (id === 'workflow') id = 'process';
    if (id === 'testimonials' || id === 'reviews') id = 'testimonial';
    if (id === 'header' || id === 'footer' || id === 'navbar' || !id) return;
    if (sectionComponentMap[id] && !added.has(id)) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  if (!hasCustomOrder) {
    defaultMainSections.forEach((id) => {
      if (!added.has(id)) {
        mainSectionIds.push(id);
        added.add(id);
      }
    });
  }

  const visibleSectionList = mainSectionIds.filter((secId) => isSectionVisible(secId));

  return (
    <div
      style={dynamicStyles}
      data-campuscv-template="designer-portfolio"
      className="campuscv-template-root min-h-screen bg-[var(--campuscv-background,#FAF8F5)] text-[var(--campuscv-foreground,#111111)] font-sans overflow-x-hidden"
    >
      <Header data={data} visibleSections={visibleSectionList} />
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>
      {isSectionVisible('footer') && <Footer data={data} visibleSections={visibleSectionList} />}
    </div>
  );
}

export { Template };
