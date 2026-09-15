import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ProfileHeader from "./components/ProfileHeader";
import AboutSection from "./components/AboutSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import CertificatesSection from "./components/CertificatesSection";
import ContactSection from "./components/ContactSection";
import ProjectModal from "./components/ProjectModal";
import CertModal from "./components/CertModal";
import { Check, Menu, X } from "lucide-react";
import "./app/globals.css";

export default function Template(props = {}) {
  const rawData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.projects ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const name = data?.name || data?.fullName || data?.hero?.name || data?.profile?.name || data?.basics?.name || data?.personal?.name || "Portfolio";
  const rawInitials = name ? name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() : "CV";

  // Dynamic Theme Styling
  const rawAccent = data?.theme?.primaryColor || 
    data?.theme?.accentColor || 
    data?.themeColor || 
    data?.accentColor || 
    data?.primaryColor || 
    data?.color || 
    '';

  const accentColor = (!rawAccent || rawAccent === 'transparent' || rawAccent === 'none') ? '#7F56D9' : rawAccent;
  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicStyles = {
    '--brand-600': accentColor,
    '--brand-500': accentColor,
    '--brand-700': accentColor,
    '--primary': accentColor,
    '--campuscv-accent': accentColor,
    '--cv-accent': accentColor,
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
    const rawKey = String(sectionName).toLowerCase().trim();
    let key = rawKey;
    if (rawKey === 'certifications' || rawKey === 'awards') key = 'certificates';
    if (rawKey === 'timeline' || rawKey === 'work') key = 'experience';
    if (rawKey === 'academics') key = 'education';
    if (rawKey === 'portfolio') key = 'projects';
    if (rawKey === 'tech') key = 'skills';
    
    if (data?.deletedNodes?.[`section:${key}:root:section:0`] === true || data?.deletedNodes?.[key] === true || data?.deletedNodes?.[rawKey] === true) {
      return false;
    }
    if (data?.hiddenNodes?.[`section:${key}:root:section:0`] === true || data?.hiddenNodes?.[key] === true || data?.hiddenNodes?.[rawKey] === true) {
      return false;
    }
    if (Array.isArray(data?.hiddenFields) && (data.hiddenFields.includes(`sections.${key}`) || data.hiddenFields.includes(key) || data.hiddenFields.includes(rawKey))) {
      return false;
    }
    if (Array.isArray(data?.hiddenSections) && (data.hiddenSections.includes(key) || data.hiddenSections.includes(rawKey))) {
      return false;
    }

    if (data[`${key}.visible`] !== undefined) return Boolean(data[`${key}.visible`]);
    if (data[`${rawKey}.visible`] !== undefined) return Boolean(data[`${rawKey}.visible`]);
    if (data[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    // If certificates/certifications is checked:
    if (key === 'certificates') {
      const cList = data.certificates || data.certifications || data.awards || data?.data?.certificates || data?.data?.certifications;
      if (Array.isArray(cList) && cList.length === 0) return false;
      return true;
    }

    // If section array is explicitly empty in user's data, hide the section
    const collection = data[key] || data?.[rawKey] || data?.[sectionName] || data?.data?.[key];
    if (Array.isArray(collection) && collection.length === 0) {
      if (key === 'skills' && Array.isArray(data.tools) && data.tools.length > 0) return true;
      return false;
    }

    return true;
  };

  // ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "education", "experience", "projects", "skills", "certificates", "contact"];
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        if (sectionId === "hero" && window.scrollY < 200) {
          setActiveSection("hero");
          break;
        }
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (sectionId) => {
    let cleanId = String(sectionId).toLowerCase().trim();
    if (cleanId === 'home' || cleanId === 'intro') cleanId = 'hero';
    if (cleanId === 'certifications') cleanId = 'certificates';
    if (cleanId === 'timeline' || cleanId === 'work') cleanId = 'experience';
    if (cleanId === 'academics') cleanId = 'education';
    if (cleanId === 'portfolio') cleanId = 'projects';
    if (cleanId === 'tech') cleanId = 'skills';

    setActiveSection(cleanId);
    setMobileMenuOpen(false);

    if (cleanId === 'hero') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
      try {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
      try {
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
      return;
    }

    const doc = document;
    const targetElement = doc.getElementById(cleanId) ||
      doc.getElementById(sectionId) ||
      doc.querySelector(`[data-section="${cleanId}"]`) ||
      doc.querySelector(`[data-section="${sectionId}"]`) ||
      doc.querySelector(`[data-cv-section="${cleanId}"]`) ||
      doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
      doc.querySelector(`section#${cleanId}`) ||
      doc.querySelector(`section#${sectionId}`) ||
      doc.querySelector(`[id*="${cleanId}"]`);

    if (targetElement) {
      try {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {}
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const sectionComponentMap = {
    about: <AboutSection key="about" data={data} />,
    education: <EducationSection key="education" data={data} />,
    experience: <ExperienceSection key="experience" data={data} />,
    projects: (
      <ProjectsSection
        key="projects"
        data={data}
        onSelectProject={(project) => setSelectedProject(project)}
      />
    ),
    skills: <SkillsSection key="skills" data={data} />,
    certificates: (
      <CertificatesSection
        key="certificates"
        data={data}
        onSelectCert={(cert) => setSelectedCert(cert)}
      />
    ),
    certifications: (
      <CertificatesSection
        key="certifications"
        data={data}
        onSelectCert={(cert) => setSelectedCert(cert)}
      />
    ),
    contact: <ContactSection key="contact" data={data} onShowToast={showToast} />,
  };

  const defaultMainSections = [
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
    if (!s || s === 'hero' || s === 'sidebar' || s === 'footer' || s === 'navbar' || s === 'header') return;
    
    let id = s;
    if (s.includes('about') || s.includes('bio') || s.includes('summary')) id = 'about';
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
      data-campuscv-template="static-panel"
      className="campuscv-template-root min-h-screen bg-white flex flex-col md:flex-row relative text-gray-900 selection:bg-brand-600 selection:text-white"
    >
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
        <a 
          href="#hero" 
          className="flex items-center gap-2.5 cursor-pointer no-underline" 
          onClick={() => handleSectionClick("hero")}
        >
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {rawInitials}
          </div>
          <span className="font-bold text-gray-900 text-base font-heading">
            {name}
          </span>
        </a>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Static Left Sidebar Panel */}
      <div
        className={`fixed md:sticky top-0 z-50 h-screen transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          data={data}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          isSectionVisible={isSectionVisible}
        />
      </div>

      {/* Right Scrollable Main Content Body */}
      <main className="flex-1 min-w-0 bg-white">
        {/* 1. Hero / Profile Header with Large Avatar & Cover */}
        {isSectionVisible('hero') && <ProfileHeader data={data} />}

        {/* Spacious Main Container */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-14 py-6">
          {mainSectionIds.map((secId) => {
            if (!isSectionVisible(secId)) return null;
            return sectionComponentMap[secId] || null;
          })}

          {/* Footer */}
          {isSectionVisible('footer') && (
            <footer className="py-12 mt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>© {new Date().getFullYear()} {name}.</span>
                <span>All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="#hero"
                  onClick={() => handleSectionClick("hero")}
                  className="hover:text-gray-900 font-bold text-brand-600 transition-colors cursor-pointer no-underline"
                >
                  Back to top ↑
                </a>
              </div>
            </footer>
          )}
        </div>
      </main>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Certificate Viewer Modal */}
      <CertModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs sm:text-sm font-medium px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-gray-800">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export { Template };
