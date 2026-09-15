import React, { useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import Achievements from './sections/Achievements';
import Certificates from './sections/Certificates';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

import { normalizeData } from './utils/normalizeData';
import { getThemeColors } from './utils/themeColors';
import './styles/index.css';

export default function Template(props = {}) {
  // Support incoming props directly & synchronously from CampusCV editor
  const rawPropsData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.experience ? props : {}) || {};
  const rawData = typeof rawPropsData === 'object' && rawPropsData !== null ? rawPropsData : {};
  const data = useMemo(() => normalizeData(rawData), [rawData]);

  const rawAccent = data?.userSelectedAccent ||
    data?.theme?.primaryColor || 
    data?.theme?.accentColor || 
    data?.themeColor || 
    data?.accentColor || 
    data?.primaryColor || 
    rawData?.userSelectedAccent ||
    rawData?.theme?.primaryColor ||
    rawData?.themeColor ||
    rawData?.accentColor ||
    data?.theme?.color ||
    data?.color || 
    '#C89B3C';

  const themeColors = useMemo(() => getThemeColors(rawAccent), [rawAccent]);

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--campuscv-accent': themeColors.accent,
    '--campuscv-accent-rgb': themeColors.accentRgb,
    '--campuscv-accent-dark': themeColors.accentDark,
    '--campuscv-accent-light': themeColors.accentLight,
    '--cv-accent': themeColors.accent,
    '--primary': themeColors.accent,
    '--accent': themeColors.accent,
    '--brand': themeColors.accent,
    '--brand-gold': themeColors.accent,
    '--gold-500': themeColors.accent,
    '--gold-400': themeColors.accentLight,
    '--gold-600': themeColors.accentDark,
    '--border-gold': `rgba(${themeColors.accentRgb}, 0.3)`,
    '--primary-foreground': themeColors.contrastForeground,
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
    
    // Check aliases
    const aliasMap = {
      hero: ['hero', 'intro', 'home'],
      navbar: ['navbar', 'header', 'nav'],
      about: ['about', 'bio'],
      skills: ['skills', 'tech', 'stack', 'capabilities'],
      projects: ['projects', 'portfolio', 'work', 'casestudies'],
      services: ['services', 'specialties', 'offerings', 'practice'],
      experience: ['experience', 'timeline', 'work', 'history'],
      education: ['education', 'academics'],
      achievements: ['achievements', 'metrics', 'stats'],
      certificates: ['certificates', 'certifications', 'awards', 'credentials'],
      certifications: ['certifications', 'certificates', 'awards', 'credentials'],
      testimonials: ['testimonials', 'reviews', 'testimonial', 'endorsements'],
      contact: ['contact'],
      footer: ['footer']
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

    // Empty array visibility logic
    if (key === 'testimonials' || key === 'reviews') {
      const test = data?.testimonials || data?.reviews;
      if (Array.isArray(test) && test.length === 0) return false;
    }
    if (key === 'certificates' || key === 'certifications') {
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
      const sk = data?.skills || data?.tech;
      if (Array.isArray(sk) && sk.length === 0) return false;
    }
    if (key === 'services') {
      const srv = data?.services || data?.practice;
      if (Array.isArray(srv) && srv.length === 0) return false;
    }

    return true;
  };

  const sectionComponentMap = {
    hero: <Hero key="hero" data={data} />,
    achievements: <Achievements key="achievements" data={data} />,
    about: <About key="about" data={data} />,
    skills: <Skills key="skills" data={data} />,
    projects: <Projects key="projects" data={data} />,
    services: <Services key="services" data={data} />,
    experience: <Experience key="experience" data={data} />,
    education: <Education key="education" data={data} />,
    certificates: <Certificates key="certificates" data={data} />,
    certifications: <Certificates key="certifications" data={data} />,
    testimonials: <Testimonials key="testimonials" data={data} />,
    contact: <Contact key="contact" data={data} />
  };

  const defaultMainSections = [
    'hero',
    'achievements',
    'about',
    'skills',
    'projects',
    'services',
    'experience',
    'education',
    'certificates',
    'testimonials',
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
    else if (s.includes('achieve') || s.includes('metric') || s.includes('stat')) id = 'achievements';
    else if (s.includes('about') || s.includes('bio') || s.includes('summary')) id = 'about';
    else if (s.includes('skill') || s.includes('tech') || s.includes('tool') || s.includes('capability') || s.includes('stack')) id = 'skills';
    else if (s.includes('proj') || s.includes('work') || s.includes('portfolio') || s.includes('case')) id = 'projects';
    else if (s.includes('service') || s.includes('practice') || s.includes('specialt') || s.includes('offering')) id = 'services';
    else if (s.includes('exp') || s.includes('career') || s.includes('timeline') || s.includes('history')) id = 'experience';
    else if (s.includes('edu') || s.includes('acad') || s.includes('school') || s.includes('degree')) id = 'education';
    else if (s.includes('cert') || s.includes('award') || s.includes('recogni') || s.includes('license')) id = 'certificates';
    else if (s.includes('testim') || s.includes('review') || s.includes('feedback') || s.includes('endorse')) id = 'testimonials';
    else if (s.includes('contact') || s.includes('touch') || s.includes('connect') || s.includes('message')) id = 'contact';

    if (sectionComponentMap[id] && !added.has(id)) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  defaultMainSections.forEach((id) => {
    if (!added.has(id) && sectionComponentMap[id]) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  // Calculate visible sections for Navbar and Footer to dynamically reflect layer ordering & visibility
  const visibleSectionList = mainSectionIds.filter((secId) => isSectionVisible(secId));

  return (
    <div 
      id="template-root"
      className="campuscv-executive-template campuscv-template-root min-h-screen bg-[#FAF8F4] text-[#1A1A1A] font-sans antialiased"
      style={dynamicStyles}
      data-campuscv-template="executive-lawyer-portfolio"
      data-template-id="stu_lawyer"
    >
      {/* 1. Navbar */}
      {isSectionVisible('navbar') && <Navbar data={data} visibleSections={visibleSectionList} />}

      {/* 2. Core Portfolio Sections */}
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* 3. Footer */}
      {isSectionVisible('footer') && <Footer data={data} visibleSections={visibleSectionList} />}
    </div>
  );
}

export { Template, Template as Portfolio };

