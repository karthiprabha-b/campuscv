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

    if (data[`${key}.visible`] !== undefined) return Boolean(data[`${key}.visible`]);
    if (data[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    return true;
  };

  return (
    <div
      style={dynamicStyles}
      data-campuscv-template="doctor-portfolio"
      className="campuscv-template-root min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-600 selection:text-white"
    >
      {/* 1. Header Navigation */}
      <Header data={data} />

      {/* Main Streamlined Sections Flow */}
      <main className="flex-grow">
        {/* 1. Hero & Intro */}
        {isSectionVisible('hero') && <Hero data={data} />}
        
        {/* 2. About Me */}
        {isSectionVisible('about') && <About data={data} />}
        
        {/* 3. Education */}
        {isSectionVisible('education') && <Education data={data} />}
        
        {/* 4. Experience */}
        {isSectionVisible('experience') && <Experience data={data} />}
        
        {/* 5. Projects */}
        {isSectionVisible('projects') && <Projects data={data} />}
        
        {/* 6. Skills & Tech */}
        {isSectionVisible('skills') && <Skills data={data} />}
        
        {/* 7. Certifications & Licensure */}
        {isSectionVisible('certifications') && <Certifications data={data} />}
        
        {/* 8. Contact */}
        {isSectionVisible('contact') && <Contact data={data} />}
      </main>

      {/* 10. Footer */}
      <Footer data={data} />
    </div>
  );
}

export { Template };
