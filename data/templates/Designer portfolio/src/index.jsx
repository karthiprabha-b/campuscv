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
    const directVal = data[`${sectionName}.visible`];
    if (directVal !== undefined) return Boolean(directVal);
    if (data[sectionName] && typeof data[sectionName] === 'object' && data[sectionName].visible !== undefined) {
      return Boolean(data[sectionName].visible);
    }
    if (data[`${sectionName}Visible`] !== undefined) {
      return Boolean(data[`${sectionName}Visible`]);
    }
    // If user explicitly has an empty array for a collection section (0 items), hide the section
    const collectionData = data[sectionName] || data?.data?.[sectionName] || data?.content?.[sectionName] || data?.resume?.[sectionName];
    if (Array.isArray(collectionData) && collectionData.length === 0) {
      if (sectionName === 'skills' && Array.isArray(data.tools) && data.tools.length > 0) {
        return true;
      }
      return false;
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

  const rawOrder = (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0)
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

  defaultMainSections.forEach((id) => {
    if (!added.has(id)) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  return (
    <div
      style={dynamicStyles}
      data-campuscv-template="designer-portfolio"
      className="campuscv-template-root min-h-screen bg-[var(--campuscv-background,#FAF8F5)] text-[var(--campuscv-foreground,#111111)] font-sans overflow-x-hidden"
    >
      <Header data={data} />
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>
      {isSectionVisible('footer') && <Footer data={data} />}
    </div>
  );
}

export { Template };
