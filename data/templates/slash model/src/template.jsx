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

  return (
    <div 
      className="slash-model-template-root min-h-screen bg-[#E5E5E5] text-black transition-colors"
      style={dynamicRootStyles}
      data-template-id="slash-model"
    >
      {/* Sticky Navigation */}
      <Navbar data={data} />

      {/* Hero Section with Diagonal Slash */}
      {isSectionVisible('hero') && <HeroSection data={data} />}

      {/* Sub-Hero IT Berries Banner */}
      {isSectionVisible('subhero') && <SubHeroBanner data={data} />}

      {/* About Me Section */}
      {isSectionVisible('about') && <AboutSection data={data} />}

      {/* Education Section */}
      {isSectionVisible('education') && <EducationSection data={data} />}

      {/* Experience Section Timeline */}
      {isSectionVisible('experience') && <ExperienceSection data={data} />}

      {/* Projects Section with Filters */}
      {isSectionVisible('projects') && <ProjectsSection data={data} onSelectProject={handleOpenProject} />}

      {/* Skills Section */}
      {isSectionVisible('skills') && <SkillsSection data={data} />}

      {/* Certificates Section */}
      {isSectionVisible('certificates') && <CertificatesSection data={data} onSelectCert={handleOpenCert} />}

      {/* Contact Section */}
      {isSectionVisible('contact') && <ContactSection data={data} />}

      {/* Footer */}
      <Footer data={data} />

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
