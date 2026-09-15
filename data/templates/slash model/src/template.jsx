import React, { useState } from 'react';
import './styles/globals.css';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SubHeroBanner from './components/SubHeroBanner';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import CertificatesSection from './components/CertificatesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Modal from './components/Modal';

export default function Template(props = {}) {
  // Support all CampusCV prop structures (props.data, props.portfolio, props.profile, props.basics, or root props)
  const rawData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.projects ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setSelectedCert(null);
    setIsModalOpen(true);
  };

  const handleOpenCert = (cert) => {
    setSelectedCert(cert);
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setSelectedCert(null);
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

    // If explicit collection array is empty, hide section
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      if (key === 'skills' && Array.isArray(data.tools) && data.tools.length > 0) return true;
      return false;
    }

    return true;
  };

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
    return yiq >= 150 ? '#000000' : '#FFFFFF';
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
  const accentColor = isInvalidAccent ? '#000000' : rawAccent;
  const primaryForeground = getContrastForeground(accentColor);

  const dynamicRootStyles = {
    backgroundColor: '#E5E5E5',
    color: '#000000',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    '--bg-main': '#E5E5E5',
    '--bg-card': '#FFFFFF',
    '--text-dark': '#000000',
    '--text-muted': '#555555',
    '--border-dark': '#000000',
    '--primary': accentColor,
    '--primary-foreground': primaryForeground,
    '--shadow-solid': '#000000',
    ...(data?.styleOverrides?.['template:root'] || {})
  };

  const sectionComponentMap = {
    hero: <HeroSection key="hero" data={data} />,
    subhero: <SubHeroBanner key="subhero" data={data} />,
    about: <AboutSection key="about" data={data} />,
    education: <EducationSection key="education" data={data} />,
    experience: <ExperienceSection key="experience" data={data} />,
    projects: <ProjectsSection key="projects" data={data} onSelectProject={handleOpenProject} />,
    skills: <SkillsSection key="skills" data={data} />,
    certificates: <CertificatesSection key="certificates" data={data} onSelectCert={handleOpenCert} />,
    certifications: <CertificatesSection key="certifications" data={data} onSelectCert={handleOpenCert} />,
    contact: <ContactSection key="contact" data={data} />
  };

  const defaultMainSections = [
    'hero',
    'subhero',
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    'certificates',
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
    if (s.includes('subhero') || s.includes('ticker') || s.includes('marquee')) id = 'subhero';
    else if (s.includes('hero') || s.includes('home') || s.includes('intro') || s === 'banner') id = 'hero';
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

  const visibleSectionList = mainSectionIds.filter((secId) => isSectionVisible(secId));

  return (
    <div 
      className="slash-model-template-root campuscv-template-root min-h-screen bg-[#E5E5E5] text-black transition-colors"
      style={dynamicRootStyles}
      data-template-id="slash-model"
      data-campuscv-template="slash-model"
    >
      {/* Sticky Navigation */}
      {isSectionVisible('navbar') && <Navbar data={{ ...data, visibleSections: visibleSectionList }} />}

      {/* Main Flow */}
      <main>
        {mainSectionIds.map((secId) => {
          if (!isSectionVisible(secId)) return null;
          return sectionComponentMap[secId] || null;
        })}
      </main>

      {/* Footer */}
      {isSectionVisible('footer') && <Footer data={{ ...data, visibleSections: visibleSectionList }} />}

      {/* Universal Case Study / Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        certificate={selectedCert}
      />
    </div>
  );
}
