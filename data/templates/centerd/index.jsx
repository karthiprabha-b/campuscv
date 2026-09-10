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

  const [activeSection, setActiveSection] = useState('home');
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
    const s = String(sectionName || '').toLowerCase().trim();
    if (data[`${s}.visible`] === false) return false;
    if (data[`${s}Visible`] === false) return false;
    if (data[s] && typeof data[s] === 'object' && data[s].visible === false) return false;
    if (Array.isArray(data?.hiddenFields) && (data.hiddenFields.includes(`sections.${s}`) || data.hiddenFields.includes(s))) {
      return false;
    }
    return true;
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('in-view', 'aos-animate');
      element.querySelectorAll('.reveal-on-scroll, .txt-fx, .letter').forEach((child) => {
        child.classList.add('in-view', 'aos-animate');
      });
    }
  };

  useEffect(() => {
    const sections = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
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
          />

          {/* Right Main Content */}
          <main className="col-lg-10 p-0 main-content">
            <div className="container py-4 py-xl-5">
              <div className="justify-content-center px-1 mx-1 px-xl-5 mx-xl-5">
                {isSectionVisible('hero') && (
                  <Hero
                    data={data}
                    onNavigate={handleNavigate}
                    onSelectService={(service) => setSelectedService(service)}
                  />
                )}
                {isSectionVisible('about') && <About data={data} />}
                {isSectionVisible('education') && <Education data={data} />}
                {isSectionVisible('experience') && <Experience data={data} />}
                {isSectionVisible('projects') && (
                  <Projects
                    data={data}
                    onSelectProject={(project) => setSelectedProject(project)}
                  />
                )}
                {isSectionVisible('skills') && <Skills data={data} />}
                {isSectionVisible('certificates') && <Certificates data={data} />}
                {isSectionVisible('contact') && <Contact data={data} />}
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
