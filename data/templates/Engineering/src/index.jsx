import React, { useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/globals.css';
import { normalizeEngineeringData } from './utils/normalizeData';

export default function Template(props = {}) {
  const rawData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.experience ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};
  const normalizedData = useMemo(() => normalizeEngineeringData(data), [data]);

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

  const isValidHex = (val) => typeof val === 'string' && val.trim().length > 0 && val !== 'transparent' && val !== 'none' && !val.includes('false') && !val.includes('true');

  const candidates = [
    typeof data?.userSelectedAccent === 'string' ? data.userSelectedAccent : null,
    typeof data?.themeColor === 'string' ? data.themeColor : null,
    typeof data?.accentColor === 'string' ? data.accentColor : null,
    typeof data?.primaryColor === 'string' ? data.primaryColor : null,
    typeof data?.theme?.primaryColor === 'string' ? data.theme.primaryColor : null,
    typeof data?.theme?.accentColor === 'string' ? data.theme.accentColor : null,
    typeof data?.theme?.color === 'string' ? data.theme.color : null,
    typeof data?.color === 'string' ? data.color : null,
    typeof rawData?.userSelectedAccent === 'string' ? rawData.userSelectedAccent : null,
    typeof rawData?.themeColor === 'string' ? rawData.themeColor : null,
    typeof rawData?.accentColor === 'string' ? rawData.accentColor : null,
    typeof rawData?.primaryColor === 'string' ? rawData.primaryColor : null,
    typeof rawData?.theme?.primaryColor === 'string' ? rawData.theme.primaryColor : null,
    typeof rawData?.theme?.accentColor === 'string' ? rawData.theme.accentColor : null,
    typeof props?.themeColor === 'string' ? props.themeColor : null,
    typeof props?.accentColor === 'string' ? props.accentColor : null,
    typeof props?.userSelectedAccent === 'string' ? props.userSelectedAccent : null,
  ];

  const matchedAccent = candidates.find(isValidHex);
  const accentColor = matchedAccent ? (matchedAccent.startsWith('#') ? matchedAccent : `#${matchedAccent}`) : '#06b6d4';
  const primaryForeground = getContrastForeground(accentColor);

  const cleanHex = String(accentColor || '#06b6d4').trim().replace('#', '');
  let hex = cleanHex;
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) || 6;
  const g = parseInt(hex.substring(2, 4), 16) || 182;
  const b = parseInt(hex.substring(4, 6), 16) || 212;

  const dr = Math.max(0, Math.floor(r * 0.8));
  const dg = Math.max(0, Math.floor(g * 0.8));
  const db = Math.max(0, Math.floor(b * 0.8));
  const darkHex = `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;

  const lr = Math.min(255, Math.floor(r + (255 - r) * 0.35));
  const lg = Math.min(255, Math.floor(g + (255 - g) * 0.35));
  const lb = Math.min(255, Math.floor(b + (255 - b) * 0.35));
  const lightHex = `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--campuscv-accent': accentColor,
    '--campuscv-accent-rgb': `${r}, ${g}, ${b}`,
    '--campuscv-accent-dark': darkHex,
    '--campuscv-accent-light': lightHex,
    '--cv-accent': accentColor,
    '--primary': accentColor,
    '--primary-accent': accentColor,
    '--primary-foreground': primaryForeground,
    '--color-cyan-500': accentColor,
    '--cyber-bright-cyan': lightHex,
    '--cyber-neon-cyan': accentColor,
    '--cyber-neon-violet': lightHex,
    '--cyber-electric-purple': darkHex,
    '--accent': accentColor,
    '--brand': accentColor,
    ...(fontFamily ? {
      '--campuscv-font-family': `${fontFamily}, sans-serif`,
      '--font-primary': `${fontFamily}, sans-serif`
    } : {}),
    ...(fontSize ? {
      '--campuscv-base-font-size': `${fontSize}px`
    } : {}),
    ...(data?.styleOverrides?.['template:root'] || {})
  };

  const isSectionVisible = (sectionName) => {
    const key = String(sectionName).toLowerCase().trim();
    
    // Check aliases
    const aliasMap = {
      hero: ['hero', 'intro', 'home', 'header'],
      about: ['about', 'bio'],
      skills: ['skills', 'tech', 'stack'],
      projects: ['projects', 'portfolio', 'work'],
      experience: ['experience', 'timeline', 'work'],
      education: ['education', 'academics'],
      certificates: ['certificates', 'certifications', 'awards', 'achievements'],
      certifications: ['certificates', 'certifications', 'awards', 'achievements'],
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
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      return false;
    }

    return true;
  };

  const sectionComponentMap = {
    hero: <Hero key="hero" data={normalizedData} />,
    about: <About key="about" data={normalizedData} />,
    education: <Education key="education" data={normalizedData} />,
    experience: <Experience key="experience" data={normalizedData} />,
    projects: <Projects key="projects" data={normalizedData} />,
    skills: <Skills key="skills" data={normalizedData} />,
    certificates: <Certificates key="certificates" data={normalizedData} />,
    contact: <Contact key="contact" data={normalizedData} />
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
    if (id === 'achievements' || id === 'awards' || id === 'certifications') id = 'certificates';
    if (id === 'timeline' || id === 'work') id = 'experience';
    if (id === 'academics') id = 'education';
    if (id === 'portfolio') id = 'projects';
    if (id === 'tech' || id === 'stack') id = 'skills';
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
      id="template-root"
      data-campuscv-template="Engineering"
      data-template-id="Engineering"
      className="campuscv-template-root min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden font-sans antialiased"
      style={dynamicStyles}
    >
      {/* 00. Header / Navbar */}
      {isSectionVisible('header') && <Header data={normalizedData} visibleSections={visibleSectionList} />}

      {/* Main Core Portfolio Sections (Dynamic Ordered & Filtered) */}
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* 09. Footer Section */}
      {isSectionVisible('footer') && <Footer data={normalizedData} visibleSections={visibleSectionList} />}
    </div>
  );
}
