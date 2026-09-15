'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './src/components/Sidebar';
import Hero from './src/components/Hero';
import About from './src/components/About';
import Education from './src/components/Education';
import Experience from './src/components/Experience';
import Projects from './src/components/Projects';
import Skills from './src/components/Skills';
import Certificates from './src/components/Certificates';
import Contact from './src/components/Contact';
import ScrollObserver from './src/components/ScrollObserver';
import ProjectModal from './src/components/ProjectModal';
import ServiceModal from './src/components/ServiceModal';
import './src/styles/styles.css';

export default function Template(props = {}) {
  const rawData =
    props?.data ||
    props?.portfolio ||
    props?.profile ||
    props?.cv ||
    props?.resume ||
    (props?.name || props?.hero || props?.about || props?.experience ? props : {}) ||
    {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const rawAccent =
    data?.theme?.primaryColor ||
    data?.theme?.accentColor ||
    data?.themeColor ||
    data?.accentColor ||
    data?.primaryColor ||
    data?.theme?.color ||
    data?.color ||
    '';

  const isInvalidAccent = !rawAccent || rawAccent === 'transparent' || rawAccent === 'none';
  const accentColor = isInvalidAccent ? '#ff534a' : rawAccent;

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--bs-primary': accentColor,
    '--bs-primary-dark': accentColor,
    '--campuscv-accent': accentColor,
    '--cv-accent': accentColor,
    '--swiper-theme-color': accentColor,
    ...(fontFamily
      ? {
          '--heading-font': `${fontFamily}, sans-serif`,
          '--bs-body-font-family': `${fontFamily}, sans-serif`,
        }
      : {}),
    ...(fontSize
      ? {
          '--bs-body-font-size': `${fontSize}px`,
        }
      : {}),
    ...(data?.styleOverrides?.['template:root'] || {}),
  };

  const isSectionVisible = (sectionName) => {
    const key = String(sectionName || '').toLowerCase().trim();

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

    // If section array is explicitly empty in user's data, hide the section
    if (key === 'certificates' || key === 'certifications') {
      const certs = data?.certificates || data?.certifications;
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

    return true;
  };

  const handleNavigate = (sectionId) => {
    const cleanId = String(sectionId || '').toLowerCase().trim();
    setActiveSection(cleanId === 'home' ? 'hero' : cleanId);

    const doc = document;
    const targetElement =
      doc.getElementById(cleanId) ||
      doc.getElementById(sectionId) ||
      doc.querySelector(`[data-cv-section="${cleanId}"]`) ||
      doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
      doc.getElementById('home');

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sections = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId) || (sectionId === 'hero' ? document.getElementById('home') : null);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const sectionComponentMap = {
    hero: <Hero key="hero" data={data} />,
    about: <About key="about" data={data} />,
    education: <Education key="education" data={data} />,
    experience: <Experience key="experience" data={data} />,
    projects: <Projects key="projects" data={data} onSelectProject={setSelectedProject} />,
    skills: <Skills key="skills" data={data} />,
    certificates: <Certificates key="certificates" data={data} />,
    contact: <Contact key="contact" data={data} />,
  };

  const defaultMainSections = [
    'hero',
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    'certificates',
    'contact',
  ];

  const hasCustomOrder = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0;
  const rawOrder = hasCustomOrder
    ? data.sectionOrder
    : ((Array.isArray(data?.sections) && data.sections.length > 0)
      ? data.sections
      : defaultMainSections);

  const mainSectionIds = [];
  const added = new Set();

  rawOrder.forEach((rawId) => {
    let id = String(rawId).toLowerCase().trim();
    if (id === 'home' || id === 'intro') id = 'hero';
    if (id === 'certifications') id = 'certificates';
    if (id === 'timeline' || id === 'work') id = 'experience';
    if (id === 'academics') id = 'education';
    if (id === 'portfolio') id = 'projects';
    if (id === 'tech') id = 'skills';
    if (id === 'footer' || id === 'sidebar') return;
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
      data-campuscv-template="centerd"
      className={`campuscv-template-root ${isMobileMenuOpen ? 'nav-active' : ''}`}
    >
      <ScrollObserver />

      {/* Mobile Hamburger Button */}
      <button
        className="menu-btn bg-transparent border-0"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span />
      </button>

      <div className="container-fluid p-0">
        <div className="row m-0 align-items-start position-relative">
          {/* Sticky Left Sidebar */}
          <Sidebar
            data={data}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            isSectionVisible={isSectionVisible}
            visibleSections={visibleSectionList}
          />

          {/* Right Main Content */}
          <main className="col-lg-10 p-0 main-content">
            <div className="container py-4 py-xl-5">
              <div className="justify-content-center px-1 mx-1 px-xl-5 mx-xl-5">
                {mainSectionIds.map((secId) => {
                  if (!isSectionVisible(secId)) return null;
                  return sectionComponentMap[secId] || null;
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onContact={() => handleNavigate('contact')}
      />
    </div>
  );
}

export { Template };
