'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CardNavigator } from './components/CardNavigator';
import { HeroCard } from './components/cards/HeroCard';
import { AboutCard } from './components/cards/AboutCard';
import { EducationCard } from './components/cards/EducationCard';
import { ExperienceCard } from './components/cards/ExperienceCard';
import { ProjectsCard } from './components/cards/ProjectsCard';
import { SkillsCard } from './components/cards/SkillsCard';
import { CertificationsCard } from './components/cards/CertificationsCard';
import { ContactCard } from './components/cards/ContactCard';
import { ProjectModal } from './components/modals/ProjectModal';
import { ResumeModal } from './components/modals/ResumeModal';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Mail
} from 'lucide-react';
import './styles/styles.css';

const ALL_SECTION_DEFS = [
  { id: 'card-hero', renderKey: 'hero', name: 'Hero', short: 'Intro', icon: Sparkles },
  { id: 'card-about', renderKey: 'about', name: 'About Me', short: 'About', icon: User },
  { id: 'card-education', renderKey: 'education', name: 'Education', short: 'Edu', icon: GraduationCap },
  { id: 'card-experience', renderKey: 'experience', name: 'Experience', short: 'Exp', icon: Briefcase },
  { id: 'card-projects', renderKey: 'projects', name: 'Projects', short: 'Work', icon: FolderGit2 },
  { id: 'card-skills', renderKey: 'skills', name: 'Skills & Stack', short: 'Skills', icon: Cpu },
  { id: 'card-certifications', renderKey: 'certifications', name: 'Certifications', short: 'Certs', icon: Award },
  { id: 'card-contact', renderKey: 'contact', name: 'Get in Touch', short: 'Contact', icon: Mail },
];

function CardDeckInner({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const theme = useTheme();
  const accentClass = theme?.accentClass || {
    text: 'text-violet-400',
    bg: 'bg-violet-500',
    border: 'border-violet-500/30 hover:border-violet-400/60',
    glow: 'from-violet-600/20 via-purple-600/10 to-transparent',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  };

  // Check section visibility from CampusCV data
  const isSectionVisible = useCallback((sectionName) => {
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

    if (data?.[`${key}.visible`] !== undefined) return Boolean(data[`${key}.visible`]);
    if (data?.[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data?.[`${key}Visible`] !== undefined) return Boolean(data[`${key}Visible`]);
    if (data?.[key] && typeof data[key] === 'object' && data[key].visible !== undefined) return Boolean(data[key].visible);

    // If explicit collection array is empty, optionally hide
    const collection = data?.[key] || data?.[sectionName];
    if (Array.isArray(collection) && collection.length === 0) {
      if (key === 'skills' && Array.isArray(data?.tools) && data.tools.length > 0) return true;
      return false;
    }

    return true;
  }, [data]);

  // Dynamically filter active sections
  const activeSections = useMemo(() => {
    return ALL_SECTION_DEFS.filter(sec => isSectionVisible(sec.renderKey));
  }, [isSectionVisible]);

  const totalCards = activeSections.length;

  // High-performance smooth card transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTimeRef = useRef(0);

  const goToCard = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= totalCards || targetIndex === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(targetIndex);
    const timer = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timer);
  }, [totalCards, activeIndex]);

  const nextCard = useCallback(() => {
    if (activeIndex < totalCards - 1) {
      goToCard(activeIndex + 1);
    }
  }, [activeIndex, totalCards, goToCard]);

  const prevCard = useCallback(() => {
    if (activeIndex > 0) {
      goToCard(activeIndex - 1);
    }
  }, [activeIndex, goToCard]);

  // Debounced wheel listener for smooth single-card progression
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't intercept if a modal or input is open
      if (selectedProject !== null || isResumeOpen) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 450) return; // 450ms cooldown for smooth 1-card glide

      if (e.deltaY > 25) {
        if (activeIndex < totalCards - 1) {
          lastScrollTimeRef.current = now;
          nextCard();
        }
      } else if (e.deltaY < -25) {
        if (activeIndex > 0) {
          lastScrollTimeRef.current = now;
          prevCard();
        }
      }
    };

    const container = containerRef.current || (typeof window !== 'undefined' ? window : null);
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [activeIndex, totalCards, nextCard, prevCard, selectedProject, isResumeOpen]);

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        selectedProject !== null ||
        isResumeOpen
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevCard();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToCard(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToCard(totalCards - 1);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [nextCard, prevCard, goToCard, totalCards, selectedProject, isResumeOpen]);

  // Touch Swipe Navigation
  const touchStartY = useRef(0);
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextCard();
      else prevCard();
    }
  };

  // Card Content Renderer
  const renderCardContent = (renderKey) => {
    switch (renderKey) {
      case 'hero':
        const projectsIdx = activeSections.findIndex(s => s.renderKey === 'projects');
        return (
          <HeroCard
            data={data}
            onScrollToNext={nextCard}
            onScrollToProjects={() => goToCard(projectsIdx !== -1 ? projectsIdx : 1)}
          />
        );
      case 'about':
        return <AboutCard data={data} />;
      case 'education':
        return <EducationCard data={data} />;
      case 'experience':
        return <ExperienceCard data={data} />;
      case 'projects':
        return <ProjectsCard data={data} onSelectProject={(proj) => setSelectedProject(proj)} />;
      case 'skills':
        return <SkillsCard data={data} />;
      case 'certifications':
        return <CertificationsCard data={data} />;
      case 'contact':
        return <ContactCard data={data} onScrollToTop={() => goToCard(0)} />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen w-full bg-black text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden flex flex-col justify-center items-center"
    >
      {/* Floating Side & Mobile Card Navigator */}
      <CardNavigator
        activeIndex={activeIndex}
        onNavigate={goToCard}
        sections={activeSections}
      />

      {/* Ambient Atmospheric Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ contain: 'strict' }}>
        <div 
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${accentClass.glow} rounded-full blur-[100px] opacity-35 transition-all duration-700`}
          style={{ transform: 'translate3d(-50%, -50%, 0)', contain: 'paint' }}
        />
        <div 
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px]"
          style={{ transform: 'translate3d(0, 0, 0)', contain: 'paint' }}
        />
      </div>

      {/* Main Slide Deck Stage */}
      <main className="relative z-10 w-full max-w-5xl px-3 sm:px-6 md:px-8 py-6 flex items-center justify-center">
        {activeSections.map((section, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx < activeIndex;
          const isNext = idx > activeIndex;

          // If far from active, hide to maximize rendering performance
          if (Math.abs(idx - activeIndex) > 1) return null;

          return (
            <div
              key={section.id}
              id={section.id}
              data-section={section.renderKey}
              className={`w-full transition-all duration-400 ease-out ${
                isActive
                  ? 'relative z-20 opacity-100 scale-100 translate-y-0 pointer-events-auto block'
                  : 'absolute z-10 opacity-0 pointer-events-none' + (isPrev ? ' -translate-y-8 scale-95' : ' translate-y-8 scale-95')
              }`}
              style={{
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, opacity'
              }}
            >
              {/* Curved Rectangular Card Shell */}
              <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] bg-zinc-950/95 border border-white/20 shadow-2xl shadow-black/80 ring-1 ring-white/10 overflow-hidden">
                {renderCardContent(section.renderKey)}
              </div>
            </div>
          );
        })}
      </main>

      {/* Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Resume / CV Modal */}
      <ResumeModal
        data={data}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default function Template(props = {}) {
  // Support all CampusCV prop structures (props.data, props.portfolio, props.profile, props.cv, props.resume, or root props)
  const rawData =
    props?.data ||
    props?.portfolio ||
    props?.profile ||
    props?.cv ||
    props?.resume ||
    (props?.name || props?.hero || props?.about || props?.projects || props?.experience ? props : {}) ||
    {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  // Detect theme preset or accent
  const rawAccent =
    data?.theme?.primaryColor ||
    data?.theme?.accentColor ||
    data?.themeColor ||
    data?.accentColor ||
    data?.primaryColor ||
    data?.theme?.color ||
    data?.color ||
    '';

  const defaultAccentMap = {
    '#8b5cf6': 'violet',
    '#7c3aed': 'violet',
    '#06b6d4': 'cyan',
    '#0284c7': 'cyan',
    '#10b981': 'emerald',
    '#059669': 'emerald',
    '#f59e0b': 'amber',
    '#d97706': 'amber',
    '#f43f5e': 'rose',
    '#e11d48': 'rose',
  };

  const initialAccent = (rawAccent && defaultAccentMap[rawAccent.toLowerCase()]) || 'violet';

  const fontFamily = data?.typography?.fontFamily || data?.fontPack || '';
  const fontSize = data?.typography?.fontSize || data?.baseFontSize || '';

  const dynamicRootStyles = {
    '--primary': rawAccent || '#8b5cf6',
    ...(fontFamily ? { fontFamily: `${fontFamily}, sans-serif` } : {}),
    ...(fontSize ? { fontSize: `${fontSize}px` } : {}),
    ...(data?.styleOverrides?.['template:root'] || {}),
  };

  return (
    <div 
      className="card-deck-template-root min-h-screen bg-black text-white" 
      style={dynamicRootStyles} 
      data-template-id="card"
      data-campuscv-template="card"
    >
      <ThemeProvider initialAccent={initialAccent}>
        <CardDeckInner data={data} />
      </ThemeProvider>
    </div>
  );
}
