import React from 'react';
import Navbar from './sections/Navbar.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Education from './sections/Education.jsx';
import Experience from './sections/Experience.jsx';
import Projects from './sections/Projects.jsx';
import Skills from './sections/Skills.jsx';
import Certificates from './sections/Certificates.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import { beauticianProfile } from './data/beauticianDefaults.js';

export default function BeauticianTemplate({ data = {} }) {
  // Dynamic Theme Overrides
  const primaryColor = 
    data?.palette?.primary || 
    data?.userSelectedAccent || 
    data?.theme?.primaryColor || 
    data?.themeColor || 
    data?.accentColor || 
    data?.primaryColor || 
    data?.styleOverrides?.accentColor || 
    '#DF7A98';

  const customFont = data?.userSelectedFont || data?.typography?.fontFamily || data?.fontPack || 'Plus Jakarta Sans';

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
    if (data?.styleOverrides?.[key]?.display === 'none' || data?.styleOverrides?.[`section:${key}:root:section:0`]?.display === 'none') {
      return false;
    }
    if (data?.visibleSections && data.visibleSections[key] !== undefined) {
      return Boolean(data.visibleSections[key]);
    }
    if (data[`${key}.visible`] !== undefined) return Boolean(data[`${key}.visible`]);
    if (data[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    // If explicit collection array is empty, hide section
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      if (key === 'skills' && Array.isArray(data.tools) && data.tools.length > 0) return true;
      return false;
    }

    return true;
  };

  const dynamicStyles = {
    '--primary-accent': primaryColor,
    '--primary': primaryColor,
    '--cv-accent': primaryColor,
    '--campuscv-accent': primaryColor,
    '--accent': primaryColor,
    '--brand': primaryColor,
    fontFamily: customFont ? `${customFont}, 'Plus Jakarta Sans', sans-serif` : undefined,
    ...(data?.styleOverrides?.['template:root'] || {})
  };

  const sectionComponentMap = {
    hero: <Hero key="hero" data={data} />,
    about: <About key="about" data={data} />,
    education: <Education key="education" data={data} />,
    experience: <Experience key="experience" data={data} />,
    projects: <Projects key="projects" data={data} />,
    skills: <Skills key="skills" data={data} />,
    certificates: <Certificates key="certificates" data={data} />,
    certifications: <Certificates key="certifications" data={data} />,
    contact: <Contact key="contact" data={data} />
  };

  const defaultMainSections = [
    'hero',
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    'certificates',
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
    if (id === 'certifications') id = 'certificates';
    if (id === 'timeline' || id === 'work') id = 'experience';
    if (id === 'academics') id = 'education';
    if (id === 'portfolio') id = 'projects';
    if (id === 'tech') id = 'skills';
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
      className="campuscv-template-root min-h-screen bg-[#FAF7F5] text-[#1E1B1D] font-sans selection:bg-[#F8D7E3] selection:text-[#84354D] relative"
      style={dynamicStyles}
      data-campuscv-template="beautician-portfolio"
    >
      {/* Navigation */}
      {isSectionVisible('navbar') && <Navbar data={data} />}

      {/* Main Flow */}
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* Footer */}
      {isSectionVisible('footer') && <Footer data={data} />}
    </div>
  );
}

export { BeauticianTemplate as Template };
