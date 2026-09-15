'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import ScrollObserver from './components/ScrollObserver';
import ProjectModal from './components/ProjectModal';
import ServiceModal from './components/ServiceModal';
import './styles/styles.css';

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
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      if (key === 'skills' && Array.isArray(data.tools) && data.tools.length > 0) return true;
      return false;
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
      try {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {}
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
    hero: (
      <Hero
        key="hero"
        data={data}
        onNavigate={handleNavigate}
        onSelectService={(service) => setSelectedService(service)}
      />
    ),
    about: <About key="about" data={data} />,
    education: <Education key="education" data={data} />,
    experience: <Experience key="experience" data={data} />,
    projects: (
      <Projects
        key="projects"
        data={data}
        onSelectProject={(project) => setSelectedProject(project)}
      />
    ),
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

  const rawOrder = (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0)
    ? data.sectionOrder
    : ((Array.isArray(data?.sections) && data.sections.length > 0)
      ? data.sections
      : defaultMainSections);

  const mainSectionIds = [];
  const added = new Set();

  rawOrder.forEach((rawId) => {
    const rawVal = typeof rawId === 'object' && rawId !== null ? (rawId.id || rawId.name || '') : rawId;
    let s = String(rawVal || '').toLowerCase().trim();
    if (!s || s === 'header' || s === 'footer' || s === 'sidebar' || s === 'navbar') return;
    
    let id = s;
    if (s.includes('hero') || s.includes('home') || s.includes('intro') || s === 'banner') id = 'hero';
    else if (s.includes('about') || s.includes('bio') || s.includes('summary')) id = 'about';
    else if (s.includes('edu') || s.includes('acad') || s.includes('school') || s.includes('degree')) id = 'education';
    else if (s.includes('exp') || s.includes('career') || s.includes('timeline') || s.includes('job') || s.includes('history')) id = 'experience';
    else if (s.includes('proj') || s.includes('work') || s.includes('portfolio') || s.includes('featured')) id = 'projects';
    else if (s.includes('skill') || s.includes('tech') || s.includes('tool') || s.includes('stack')) id = 'skills';
    else if (s.includes('cert') || s.includes('award') || s.includes('recogni') || s.includes('license')) id = 'certificates';
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
