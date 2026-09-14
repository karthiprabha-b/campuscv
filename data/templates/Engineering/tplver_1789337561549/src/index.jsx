import React from 'react';
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
  const normalizedData = normalizeEngineeringData(data);

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
  const accentColor = isInvalidAccent ? '#06b6d4' : rawAccent;
  const primaryForeground = getContrastForeground(accentColor);

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--campuscv-accent': accentColor,
    '--cv-accent': accentColor,
    '--primary': accentColor,
    '--primary-accent': accentColor,
    '--primary-foreground': primaryForeground,
    '--color-cyan-500': accentColor,
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
    if (data[`${key}Visible`] !== undefined) return Boolean(data[`${key}Visible`]);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    // If explicit collection array is empty, hide section
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      return false;
    }

    return true;
  };

  return (
    <div
      id="template-root"
      data-campuscv-template="Engineering"
      data-template-id="Engineering"
      className="campuscv-template-root min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden font-sans antialiased"
      style={dynamicStyles}
    >
      {/* 00. Header / Navbar */}
      {isSectionVisible('header') && <Header data={normalizedData} />}

      {/* 01. Hero Section */}
      {isSectionVisible('hero') && <Hero data={normalizedData} />}

      {/* 02. About Section */}
      {isSectionVisible('about') && <About data={normalizedData} />}

      {/* 03. Education Section */}
      {isSectionVisible('education') && <Education data={normalizedData} />}

      {/* 04. Experience Section */}
      {isSectionVisible('experience') && <Experience data={normalizedData} />}

      {/* 05. Projects Section */}
      {isSectionVisible('projects') && <Projects data={normalizedData} />}

      {/* 06. Skills Section */}
      {isSectionVisible('skills') && <Skills data={normalizedData} />}

      {/* 07. Certificates Section */}
      {isSectionVisible('certificates') && <Certificates data={normalizedData} />}

      {/* 08. Contact Section */}
      {isSectionVisible('contact') && <Contact data={normalizedData} />}

      {/* 09. Footer Section */}
      {isSectionVisible('footer') && <Footer data={normalizedData} />}
    </div>
  );
}
