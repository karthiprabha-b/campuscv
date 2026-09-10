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

  return (
    <div
      style={dynamicStyles}
      className="min-h-screen bg-[var(--campuscv-background,#FAF8F5)] text-[var(--campuscv-foreground,#111111)] font-sans overflow-x-hidden"
    >
      <Header data={data} />
      <main>
        {isSectionVisible('hero') && <Hero data={data} />}
        {isSectionVisible('about') && <About data={data} />}
        {isSectionVisible('education') && <Education data={data} />}
        {isSectionVisible('experience') && <Experience data={data} />}
        {isSectionVisible('projects') && <Projects data={data} />}
        {isSectionVisible('skills') && <Skills data={data} />}
        {isSectionVisible('certifications') && <Certifications data={data} />}
        {isSectionVisible('process') && <Process data={data} />}
        {isSectionVisible('testimonial') && <Testimonial data={data} />}
        {isSectionVisible('contact') && <Contact data={data} />}
      </main>
      {isSectionVisible('footer') && <Footer data={data} />}
    </div>
  );
}

export { Template };

