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

    // If section array is explicitly empty in user's data, hide the section
    const collection = data[key] || data?.[sectionName] || data?.data?.[key];
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

    const doc = document;
    const targetElement = cleanId === "hero"
      ? (doc.getElementById("hero") || doc.querySelector('[data-cv-section="hero"]') || doc.body)
      : (doc.getElementById(cleanId) ||
         doc.getElementById(sectionId) ||
         doc.querySelector(`[data-section="${cleanId}"]`) ||
         doc.querySelector(`[data-section="${sectionId}"]`) ||
         doc.querySelector(`[data-cv-section="${cleanId}"]`) ||
         doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
         doc.querySelector(`section#${cleanId}`) ||
         doc.querySelector(`section#${sectionId}`) ||
         doc.querySelector(`[id*="${cleanId}"]`));

    if (!targetElement) return;

    // 1. Calculate target element offset position
    const getTopOffset = (el) => {
      let top = 0;
      let curr = el;
      while (curr && curr !== doc.body && curr !== doc.documentElement) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }
      return top;
    };

    const targetY = cleanId === 'hero' ? 0 : Math.max(0, getTopOffset(targetElement) - 20);

    // Scroll window / html / body
    try {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } catch (e) {}
    try {
      doc.documentElement.scrollTo({ top: targetY, behavior: 'smooth' });
    } catch (e) {}
    try {
      doc.body.scrollTo({ top: targetY, behavior: 'smooth' });
    } catch (e) {}
    try {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {}

    // 2. Cross-frame scrolling support for Editor Canvas & Preview stages
    try {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        const pDoc = window.parent.document;
        const iframes = Array.from(pDoc.querySelectorAll('iframe'));
        const iframe = iframes.find(f => {
          try {
            return f.contentDocument === doc || f.contentWindow === window;
          } catch (err) {
            return false;
          }
        }) || iframes[0];

        if (iframe) {
          const iframeRect = iframe.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const targetTop = iframeRect.top + targetRect.top;

          const editorScrollContainers = [
            pDoc.querySelector('[data-tour="canvas-stage"]'),
            pDoc.getElementById('viewport-stage-scroll-container'),
            pDoc.getElementById('admin-preview-main'),
            pDoc.querySelector('main.overflow-y-auto'),
            pDoc.querySelector('div.overflow-y-auto')
          ].filter(Boolean);

          for (const container of editorScrollContainers) {
            if (container.scrollHeight > container.clientHeight) {
              const cRect = container.getBoundingClientRect();
              const offset = (cleanId === 'hero')
                ? 0
                : (targetTop - cRect.top + container.scrollTop - 40);
              container.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
              break;
            }
          }
        }
      }
    } catch (e) {}
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

  const rawOrder = (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0)
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
    if (id === 'hero' || id === 'footer') return;
    if (sectionComponentMap[id] && !added.has(id)) {
      mainSectionIds.push(id);
      added.add(id);
    }
  });

  defaultMainSections.forEach((id) => {
    if (!added.has(id)) {
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
        <div className="flex items-center gap-2.5" onClick={() => handleSectionClick("hero")}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {rawInitials}
          </div>
          <span className="font-bold text-gray-900 text-base font-heading">
            {name}
          </span>
        </div>
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
      <main className="flex-1 min-w-0 bg-white" id="hero">
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
                <button
                  onClick={() => handleSectionClick("hero")}
                  className="hover:text-gray-900 font-bold text-brand-600 transition-colors cursor-pointer"
                >
                  Back to top ↑
                </button>
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
