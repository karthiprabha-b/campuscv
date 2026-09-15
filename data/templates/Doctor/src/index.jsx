import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import './styles/styles.css';

export default function Template(props = {}) {
  // Support all CampusCV prop structures (props.data, props.portfolio, props.doctor, props.profile, props.basics, or root props)
  const rawData = props?.data || props?.portfolio || props?.profile || props?.doctor || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.experience ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  const getContrastForeground = (hexColor) => {
    if (!hexColor || typeof hexColor !== 'string') return '#FFFFFF';
    const cleanHex = hexColor.trim().replace('#', '');
    if (cleanHex.toLowerCase() === 'transparent' || cleanHex.toLowerCase() === 'none') return '#FFFFFF';
    let hex = cleanHex;
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) return '#FFFFFF';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#FFFFFF';
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 150 ? '#0F172A' : '#FFFFFF';
  };

  const rawAccent = data?.theme?.primaryColor || 
    data?.theme?.accentColor || 
    data?.themeColor || 
    data?.accentColor || 
    data?.primaryColor || 
    data?.theme?.color || 
    data?.color || 
    '';

  const isInvalidAccent = !rawAccent || rawAccent === 'transparent' || rawAccent === 'none';
  const accentColor = isInvalidAccent ? '#0284c7' : rawAccent;
  const primaryForeground = getContrastForeground(accentColor);

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--campuscv-accent': accentColor,
    '--cv-accent': accentColor,
    '--primary': accentColor,
    '--primary-foreground': primaryForeground,
    '--accent': accentColor,
    '--brand': accentColor,
    ...(fontFamily ? {
      '--campuscv-font-family': `${fontFamily}, sans-serif`,
      '--font-sans': `${fontFamily}, sans-serif`
    } : {}),
    ...(fontSize ? {
      '--campuscv-base-font-size': `${fontSize}px`
    } : {}),
    ...(data?.styleOverrides?.['template:root'] || {})
  };

  const isSectionVisible = (sectionName) => {
    const key = String(sectionName).toLowerCase().trim();
    
    const aliasMap = {
      hero: ['hero', 'intro', 'home', 'header'],
      about: ['about', 'bio'],
      skills: ['skills', 'tech', 'stack', 'tools'],
      projects: ['projects', 'portfolio', 'work', 'research'],
      experience: ['experience', 'timeline', 'work', 'clinical'],
      education: ['education', 'academics', 'training'],
      certifications: ['certificates', 'certifications', 'awards', 'achievements', 'credentials'],
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
      const certs = data?.certifications || data?.certificates || data?.awards || data?.credentials;
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
      const proj = data?.projects || data?.portfolio || data?.research;
      if (Array.isArray(proj) && proj.length === 0) return false;
    }
    if (key === 'skills') {
      const sk = data?.skills || data?.tech || data?.tools;
      if (Array.isArray(sk) && sk.length === 0) return false;
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
    contact: <Contact key="contact" data={data} />
  };

  const defaultMainSections = [
    'hero',
    'about',
    'projects',
    'experience',
    'skills',
    'education',
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
    let id = s;
    if (s.includes('hero') || s.includes('intro') || s.includes('home')) id = 'hero';
    else if (s.includes('about') || s.includes('bio')) id = 'about';
    else if (s.includes('proj') || s.includes('research') || s.includes('case') || s.includes('portfolio') || s.includes('work')) id = 'projects';
    else if (s.includes('exp') || s.includes('clinical') || s.includes('career') || s.includes('timeline')) id = 'experience';
    else if (s.includes('skill') || s.includes('tech') || s.includes('tool') || s.includes('competenc')) id = 'skills';
    else if (s.includes('edu') || s.includes('academic') || s.includes('training')) id = 'education';
    else if (s.includes('cert') || s.includes('award') || s.includes('credential') || s.includes('achieve') || s.includes('recogn')) id = 'certifications';
    else if (s.includes('contact') || s.includes('touch') || s.includes('appoint') || s.includes('social')) id = 'contact';

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

  const visibleSectionList = mainSectionIds.filter((secId) => isSectionVisible(secId));

  return (
    <div
      style={dynamicStyles}
      data-campuscv-template="doctor-portfolio"
      className="campuscv-template-root min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-600 selection:text-white"
    >
      {/* 1. Header Navigation */}
      {isSectionVisible('header') && <Header data={data} visibleSections={visibleSectionList} />}

      {/* Main Streamlined Sections Flow */}
      <main className="flex-grow">
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* Footer */}
      {isSectionVisible('footer') && <Footer data={data} visibleSections={visibleSectionList} />}
    </div>
  );
}

export { Template };
