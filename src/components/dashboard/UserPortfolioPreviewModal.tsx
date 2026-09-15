"use client";

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  X, 
  ExternalLink, 
  Pencil, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  Layout,
  Database,
  UserCheck,
  Lock,
  Check
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';
import { TemplateRecord, ViewportDevice } from '../../types/adminTemplate';
import TemplateRenderer from '../common/TemplateRenderer';
import { resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { checkTemplateAccess } from '../../utils/mockDb';

interface UserPortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateRecord | null;
  currentUser?: any;
  userPortfolio?: PortfolioData | null;
  onApplyTemplate?: (templateId: string) => void;
  onUpgrade?: () => void;
}

export default function UserPortfolioPreviewModal({
  isOpen,
  onClose,
  template,
  currentUser,
  userPortfolio,
  onApplyTemplate,
  onUpgrade,
}: UserPortfolioPreviewModalProps) {
  const [device, setDevice] = useState<ViewportDevice>('desktop');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [useUserData, setUseUserData] = useState<boolean>(false); // Default to authentic real template demo data!
  const [resolvedTemplateRecord, setResolvedTemplateRecord] = useState<any>(null);

  useEffect(() => {
    if (isOpen && template?.id) {
      // Resolve installed template package to ensure all custom JSX sectionFiles & embedded data are loaded
      resolveInstalledTemplateAsync(template.id).then(res => {
        setResolvedTemplateRecord(res);
      });
      // Default to authentic real template demo design
      setUseUserData(false);
      setZoomScale(100);
    }
  }, [isOpen, template?.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const access = checkTemplateAccess(currentUser, template);
  const isCurrentlyUsed = userPortfolio?.templateId === template.id;
  const isLocked = !isCurrentlyUsed && !access.isAccessible;

  // 1. Check for embedded data.json in section files
  const combinedSectionFiles = {
    ...(template.sectionFiles || {}),
    ...(resolvedTemplateRecord?.sectionFiles || {})
  };

  let embeddedData: any = null;
  if (combinedSectionFiles && Object.keys(combinedSectionFiles).length > 0) {
    const dataKey = Object.keys(combinedSectionFiles).find(k => 
      k.toLowerCase().endsWith('data.json') || 
      k.toLowerCase().endsWith('sampledata.json') || 
      k.toLowerCase().endsWith('sample-data.json') ||
      k.toLowerCase().endsWith('defaultdata.json')
    );
    if (dataKey && combinedSectionFiles[dataKey]) {
      try {
        embeddedData = JSON.parse(combinedSectionFiles[dataKey]);
      } catch (e) {
        console.warn('[UserPortfolioPreviewModal] Failed parsing embedded data.json', e);
      }
    }
  }

  // 2. Archetype aware sample data generator for authentic template preview
  const categoryLower = (template.category || '').toLowerCase();
  const idLower = (template.id || '').toLowerCase();
  const nameLower = (template.name || '').toLowerCase();

  const isDesigner = categoryLower.includes('design') || idLower.includes('design') || nameLower.includes('design') || categoryLower.includes('creative');
  const isDataOrML = categoryLower.includes('data') || idLower.includes('data') || categoryLower.includes('ai') || idLower.includes('ml');
  const isDoctor = categoryLower.includes('doctor') || idLower.includes('doctor') || idLower.includes('medic') || nameLower.includes('doctor');
  const isAgri = categoryLower.includes('agri') || idLower.includes('agri') || nameLower.includes('agri');
  const isBeautician = categoryLower.includes('beauty') || idLower.includes('beautician') || nameLower.includes('beautician');
  const isLawyer = categoryLower.includes('law') || idLower.includes('lawyer') || nameLower.includes('lawyer');
  const isPhotography = categoryLower.includes('photo') || idLower.includes('photo') || nameLower.includes('photo');

  const realTemplateSampleData: PortfolioData = embeddedData ? {
    ...embeddedData,
    id: `preview-${template.id}`,
    username: 'demo-preview',
    templateId: template.id,
    layoutStyle: template.id,
    isDarkMode: themeMode === 'dark',
    published: true,
  } : isDesigner ? {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: 'Design',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Official Design Showcase`,
    name: 'Sara Chen',
    tagline: 'Lead Product & UI/UX Designer',
    headline: 'Designing intuitive digital products & scalable design systems',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Experience', value: '6+ Years' },
      { label: 'Products Shipped', value: '24+' },
      { label: 'Design Awards', value: '4' }
    ],
    skills: ['Product Design', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Framer', 'Interaction Design', 'Wireframing'],
    tools: ['Figma', 'FigJam', 'Framer', 'Adobe Illustrator', 'Photoshop', 'Principle'],
    certifications: [
      { name: 'NN/g UX Master Certified (UXMC)', issuer: 'Nielsen Norman Group', year: '2024', issueDate: '2024' },
      { name: 'Enterprise Design Thinking Leader', issuer: 'IBM Design', year: '2023', issueDate: '2023' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Lead Product Designer",
        company: "Stripe & Co (Fintech)",
        period: "2022 — Present",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description: "Directing the global design system team and leading UX strategy for self-serve merchant portals."
      },
      {
        id: "exp-2",
        role: "Senior UI/UX Designer",
        company: "Studio Craft Labs",
        period: "2020 — 2022",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Partnered with Series A-C founders to ship 0-to-1 enterprise SaaS products and design component libraries."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "Master of Design (M.Des) in Interaction Design",
        institution: "National Institute of Design (NID)",
        period: "2016 — 2018",
        startYear: "2016",
        endYear: "2018",
        description: "Specialized in human-computer interaction and cognitive design systems."
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Fintech Mobile Banking Experience",
        description: "End-to-end design for a next-gen investment app focusing on zero-friction onboarding and micro-interactions.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["Figma", "UI/UX", "Design Systems"],
        technologies: ["Figma", "Design Systems", "Prototyping"],
        link: "https://dribbble.com"
      },
      {
        id: "proj-2",
        title: "Aura Design System (200+ Components)",
        description: "A comprehensive multi-brand accessible component library with dark mode support and Figma auto-layout 5.0.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        tags: ["Design System", "WCAG 2.1", "Tokens"],
        technologies: ["Figma", "Tokens", "Storybook"],
        link: "https://behance.net"
      }
    ],
    social: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
      behance: 'https://behance.net',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Lead Product Designer passionate about crafting user-centric interfaces, robust design systems, and delightful digital experiences that solve real-world problems.',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'experience', 'skills', 'education', 'projects', 'contact'],
    seo: { title: 'Sara Chen | Product & UI/UX Designer', description: 'Product Designer portfolio preview', keywords: 'design, ui, ux, portfolio' }
  } : isPhotography ? {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: 'Photography',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Visual Storytelling`,
    name: 'Elena Rostova',
    tagline: 'Visual Storyteller & Editorial Photographer',
    headline: 'Capturing raw emotions, cinematic landscapes, and timeless human stories',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    fontPack: 'serif',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Exhibitions', value: '12' },
      { label: 'Magazine Covers', value: '28' },
      { label: 'Countries Captured', value: '34' }
    ],
    skills: ['Editorial Photography', 'Portraiture', 'Color Grading', 'Lighting Architecture', 'Photojournalism', 'Adobe Lightroom', 'Capture One'],
    projects: [
      {
        id: "proj-1",
        title: "Echoes of the Arctic (Editorial Collection)",
        description: "A 3-month photographic expedition documenting indigenous communities and disappearing glacial landscapes.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        tags: ["Editorial", "Landscape", "National Geographic"],
        link: "https://unsplash.com"
      },
      {
        id: "proj-2",
        title: "Urban Monochromes — Tokyo & Berlin",
        description: "High-contrast architectural and street portraiture celebrating modern minimalism.",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        tags: ["Street", "Black & White", "Exhibition"],
        link: "https://unsplash.com"
      }
    ],
    social: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands.',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'projects', 'skills', 'experience', 'contact'],
    seo: { title: 'Elena Rostova | Photography Portfolio', description: 'Photography Portfolio Showcase', keywords: 'photo, editorial, portraits' }
  } : {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: template.category || 'Engineering',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Official Template Showcase`,
    name: 'Alex Rivera',
    tagline: 'Full-Stack Software Engineer & Solutions Architect',
    headline: 'Engineering Scalable Cloud Architectures & Intelligent Web Platforms',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Repositories', value: '45+' },
      { label: 'Production Apps', value: '18+' },
      { label: 'Years Code', value: '5+' }
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'TailwindCSS'],
    certifications: [
      { name: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', year: '2024', issueDate: '2024' },
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2023', issueDate: '2023' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Senior Full-Stack Engineer",
        company: "Vanguard Cloud Systems",
        period: "2023 — Present",
        startDate: "2023",
        endDate: "Present",
        current: true,
        description: "Spearheading backend microservices architecture and real-time distributed telemetry dashboards serving 200k+ daily queries."
      },
      {
        id: "exp-2",
        role: "Software Engineer",
        company: "Nexus Labs",
        period: "2021 — 2023",
        startDate: "2021",
        endDate: "2023",
        current: false,
        description: "Built modular React component architectures and high-throughput PostgreSQL query pipelines with 99.9% uptime."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science & Engineering",
        institution: "Institute of Technology",
        period: "2017 — 2021",
        startYear: "2017",
        endYear: "2021",
        description: "Graduated with Honors. Focus on Distributed Systems, Network Security, and Algorithms."
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "OmniFlow Distributed Streaming Engine",
        description: "High-throughput event aggregation platform processing over 50,000 events/second with sub-10ms Redis latency.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        tags: ["Node.js", "Redis", "Docker", "Kafka"],
        technologies: ["Node.js", "Redis", "Docker", "Kafka"],
        link: "https://github.com"
      },
      {
        id: "proj-2",
        title: "CloudPulse Serverless Analytics",
        description: "Real-time edge performance monitoring SDK with automated anomaly detection alerts and WebSocket live charts.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["Next.js", "TypeScript", "TailwindCSS"],
        technologies: ["Next.js", "TypeScript", "TailwindCSS"],
        link: "https://github.com"
      }
    ],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Passionate software engineer focused on building robust, scalable web products, resilient backend architectures, and elegant user experiences.',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'contact'],
    seo: { title: 'Alex Rivera | Software Engineer Portfolio', description: 'Sample software engineer portfolio showcase', keywords: 'developer, software engineer, nextjs' }
  };

  // Select active preview data: Authentic Real Template data (default) OR user's own data
  const baseData = (useUserData && userPortfolio) ? userPortfolio : realTemplateSampleData;

  const currentPreviewData: PortfolioData = {
    ...baseData,
    templateId: template.id,
    templateVersionId: template.currentVersionId || template.version,
    layoutStyle: template.id,
    isDarkMode: themeMode === 'dark',
    sectionFiles: combinedSectionFiles && Object.keys(combinedSectionFiles).length > 0 
      ? combinedSectionFiles 
      : (baseData.sectionFiles || undefined),
    _sectionFilesTemplateId: template.id,
    published: true,
  };

  const rawTier = (template.planTier || (template.isPremium ? 'yearly' : 'monthly')).toLowerCase();
  const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white animate-in fade-in duration-150 select-none">
      
      {/* ── Top Header Bar ── */}
      <header className="h-16 px-3 sm:px-6 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-20">
        
        {/* Left: Template Name, Category & Badges */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-white font-bricolage truncate">
                {template.name}
              </h3>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                planTier === 'free'
                  ? 'bg-emerald-500/90 text-white'
                  : planTier === 'monthly'
                    ? 'bg-sky-500/90 text-white'
                    : planTier === 'quarterly'
                      ? 'bg-indigo-600/90 text-white'
                      : 'bg-violet-700/90 text-white'
              }`}>
                {planTier}
              </span>
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono truncate">
              Original Template Design Showcase {useUserData ? '• (Showing My Data)' : '• (Real Template Demo)'}
            </p>
          </div>
        </div>

        {/* Center: Device, Theme & Data Switcher Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Data Source Switcher: Real Template Design vs My Portfolio Data */}
          {userPortfolio && (
            <div className="flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60 shadow-inner">
              <button
                type="button"
                onClick={() => setUseUserData(false)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  !useUserData
                    ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                }`}
                title="View authentic real template design and sample content"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Real Template</span>
              </button>
              <button
                type="button"
                onClick={() => setUseUserData(true)}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  useUserData
                    ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                }`}
                title="Preview this template applied to your personal portfolio data"
              >
                <UserCheck className="w-3 h-3" />
                <span>My Content</span>
              </button>
            </div>
          )}

          {/* Responsive Device Switcher */}
          <div className="flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'desktop' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Desktop View (Full Screen)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'tablet' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'mobile' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <div className="flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'light' ? 'bg-amber-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'dark' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60 font-mono text-xs">
            <button
              type="button"
              onClick={() => setZoomScale(Math.max(zoomScale - 25, 50))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer rounded hover:bg-zinc-700/50"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-zinc-300 font-bold min-w-[32px] text-center text-[11px]">{zoomScale}%</span>
            <button
              type="button"
              onClick={() => setZoomScale(Math.min(zoomScale + 25, 125))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer rounded hover:bg-zinc-700/50"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Primary Action (Apply / Upgrade) & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {isLocked ? (
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shadow-purple-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Upgrade to Unlock</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApplyTemplate?.(template.id)}
              disabled={isCurrentlyUsed}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isCurrentlyUsed
                  ? 'bg-zinc-800 text-zinc-400 cursor-default'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer shadow-purple-500/20'
              }`}
            >
              {isCurrentlyUsed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Active Template</span>
                </>
              ) : (
                <span>Use This Template</span>
              )}
            </button>
          )}

          <div className="h-4 w-px bg-zinc-800 hidden sm:block mx-0.5" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700/60"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Viewport Canvas Stage ── */}
      <main className={`flex-1 overflow-y-auto flex flex-col items-center bg-zinc-950 w-full select-auto ${
        device === 'desktop' ? 'p-0' : 'p-4 sm:p-8'
      }`}>
        <div
          style={{
            width: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : '100%'),
            maxWidth: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : 'none'),
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : 'none',
            transformOrigin: 'top center',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`relative mx-auto bg-white transition-shadow ${
            device === 'mobile'
              ? 'rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[10px] border-zinc-800 overflow-hidden my-4 ring-1 ring-zinc-700/50'
              : device === 'tablet'
              ? 'rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.75)] border-[6px] border-zinc-800 overflow-hidden my-4 ring-1 ring-zinc-700/50'
              : 'w-full rounded-none border-0 shadow-none overflow-visible my-0'
          }`}
        >
          {/* Mobile Notch Indicator */}
          {device === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-zinc-800 rounded-b-xl z-30 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
          )}

          {/* Authentic Real Template Design & Content Renderer */}
          <TemplateRenderer
            templateId={template.id}
            versionId={template.currentVersionId || template.version}
            portfolioData={currentPreviewData}
            mode="preview"
            version={template.version}
            viewport={device}
          />
        </div>
      </main>
    </div>
  );
}
