import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, Sun, Moon, X, Layers, UserCheck, Database, ZoomIn, ZoomOut } from 'lucide-react';
import { TemplateRecord, ViewportDevice, ThemeMode } from '../../types/adminTemplate';
import PortfolioRenderer from '../templates/PortfolioRenderer';
import TemplateRenderer from '../common/TemplateRenderer';
import { PortfolioData } from '../../types/portfolio';
import { mockDb } from '../../utils/mockDb';
import { getPortfolios } from '../../lib/portfolioStore';

interface TemplatePreviewModalProps {
  template: TemplateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<ViewportDevice>('desktop');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [useUserData, setUseUserData] = useState<boolean>(false);
  const [activeUserPortfolio, setActiveUserPortfolio] = useState<any>(null);

  useEffect(() => {
    getPortfolios().then(list => {
      if (list && list.length > 0) {
        setActiveUserPortfolio(list[0]);
      }
    });
  }, []);

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

  // Extract template's custom embedded sample data if available in section files
  let embeddedData: any = null;
  if (template.sectionFiles) {
    const dataKey = Object.keys(template.sectionFiles).find(k => 
      k.toLowerCase().endsWith('data.json') || k.toLowerCase().endsWith('sampledata.json') || k.toLowerCase().endsWith('sample-data.json')
    );
    if (dataKey && template.sectionFiles[dataKey]) {
      try {
        embeddedData = JSON.parse(template.sectionFiles[dataKey]);
      } catch (e) {}
    }
  }

  const categoryLower = (template.category || '').toLowerCase();
  const idLower = (template.id || '').toLowerCase();
  const nameLower = (template.name || '').toLowerCase();

  const isDesigner = categoryLower.includes('design') || idLower.includes('design') || nameLower.includes('design') || categoryLower.includes('ui') || categoryLower.includes('creative');
  const isDataOrML = categoryLower.includes('data') || idLower.includes('data') || categoryLower.includes('ai') || idLower.includes('ai') || categoryLower.includes('ml');

  // Archetype-aware full sample demo data exclusively for Admin Preview
  const sampleDemoData: PortfolioData = embeddedData ? {
    ...embeddedData,
    id: 'preview-portfolio',
    username: 'preview-user',
    templateId: template.id,
    layoutStyle: template.id,
    isDarkMode: themeMode === 'dark',
    published: true,
  } : isDesigner ? {
    id: 'preview-portfolio',
    username: 'preview-user',
    category: 'Design',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} - Sample Preview`,
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
      { name: 'Enterprise Design Thinking Leader', issuer: 'IBM Design', year: '2023', issueDate: '2023' },
      { name: 'Human-Centered Systems Specialization', issuer: 'Stanford Online', year: '2022', issueDate: '2022' }
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
        description: "Directing the global design system team, leading UX strategy for self-serve merchant portals, and mentoring 8 product and visual designers across remote hubs."
      },
      {
        id: "exp-2",
        role: "Senior UI/UX Designer",
        company: "Studio Craft Labs",
        period: "2020 — 2022",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Partnered with Series A-C founders to ship 0-to-1 enterprise SaaS products, conducting 60+ user interviews and delivering end-to-end Figma UI component libraries."
      },
      {
        id: "exp-3",
        role: "Digital Product Designer",
        company: "Hyperion Digital",
        period: "2018 — 2020",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Designed responsive consumer web applications, interactive landing pages, and converted customer analytics into higher checkout conversion rates."
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
        description: "Specialized in human-computer interaction, cognitive design systems, and experimental interfaces."
      },
      {
        id: "edu-2",
        degree: "Bachelor of Fine Arts (BFA) in Visual Communication",
        institution: "College of Art & Architecture",
        period: "2012 — 2016",
        startYear: "2012",
        endYear: "2016",
        description: "Focused on Swiss typography, grid systems, brand identity, and color theory fundamentals."
      }
    ],
    timeline: [
      { title: 'Lead Product Designer', subtitle: 'Stripe & Co • 2022 - Present', desc: 'Directing global design systems & UX strategy.' },
      { title: 'Senior UI/UX Designer', subtitle: 'Studio Craft Labs • 2020 - 2022', desc: 'Shipped 0-to-1 enterprise SaaS products.' },
      { title: 'M.Des. Interaction Design', subtitle: 'National Institute of Design • 2016 - 2018', desc: 'Human-computer interaction & cognitive design.' }
    ],
    projects: [
      {
        id: "proj-1",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        title: "FinFlow — Next-Gen Neobank Mobile OS",
        subtitle: "Mobile Experience & Design System",
        description: "Architected end-to-end design systems and transaction flows for an AI-powered personal wealth manager serving over 2M+ active accounts across APAC.",
        category: "Fintech & Design System",
        year: "2024",
        technologies: ["Design System", "Figma", "iOS", "Micro-interactions"],
        link: "https://dribbble.com"
      },
      {
        id: "proj-2",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        title: "PulseAI — Enterprise Workflow Copilot",
        subtitle: "B2B SaaS Platform & Data Visualization",
        description: "Led the 0-to-1 UX strategy and information architecture for an enterprise productivity analytics platform, improving daily active workflow completion by 38%.",
        category: "B2B SaaS & AI Tooling",
        year: "2023",
        technologies: ["UX Research", "Data Viz", "Framer", "Prototyping"],
        link: "https://dribbble.com"
      },
      {
        id: "proj-3",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        title: "Lumina — Architectural Spatial Commerce",
        subtitle: "E-Commerce & Immersive Web",
        description: "Designed a minimalist luxury spatial commerce experience combining editorial typography, high-res 3D previews, and frictionless one-tap checkout.",
        category: "E-Commerce & Visual Design",
        year: "2023",
        technologies: ["Art Direction", "Web Design", "Figma", "Typography"],
        link: "https://dribbble.com"
      }
    ],
    process: [
      { number: "01", title: "Discover", description: "Uncovering root user needs through contextual inquiry, user interviews, and deep telemetry." },
      { number: "02", title: "Define", description: "Synthesizing research into crisp problem statements, user persona journeys, and core IA." },
      { number: "03", title: "Design", description: "Crafting wireframes, high-fidelity user interfaces, and comprehensive modular design systems." },
      { number: "04", title: "Validate", description: "Iterating rapidly through continuous usability testing and post-launch user analytics." }
    ],
    testimonials: [
      { quote: "Working together was a seamless experience — complex product problems were turned into intuitive, high-performing digital interfaces.", author: "Elena Rostova", role: "VP of Product, FinFlow" }
    ],
    social: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
      behance: 'https://behance.net',
      twitter: 'https://twitter.com',
      portfolio: 'https://example.com'
    },
    socialLinks: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
      behance: 'https://behance.net',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Lead Product Designer passionate about crafting user-centric interfaces, robust design systems, and delightful digital experiences that solve real-world problems.',
    university: 'National Institute of Design',
    major: 'Interaction & Product Design',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonial', 'contact'],
    seo: { title: 'Sara Chen | Product & UI/UX Designer', description: 'Product Designer portfolio preview', keywords: 'design, ui, ux, portfolio' }
  } : isDataOrML ? {
    id: 'preview-portfolio',
    username: 'preview-user',
    category: 'Data Science',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} - Sample Preview`,
    name: 'Rohan Sharma',
    tagline: 'Data Scientist & ML Engineer',
    headline: 'Transforming complex data into predictive intelligence & robust AI models',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Models Deployed', value: '14+' },
      { label: 'Kaggle Rank', value: 'Master' },
      { label: 'Datasets Published', value: '6' }
    ],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Tableau', 'Scikit-Learn', 'AWS SageMaker', 'Docker'],
    certifications: [
      { name: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services', date: '2025', year: '2025' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Machine Learning Research Intern",
        company: "OpenAI Ecosystem",
        period: "2024 — Present",
        startDate: "2024",
        endDate: "Present",
        current: true,
        description: "Fine-tuned LLM embeddings and evaluation pipelines for structured financial document comprehension."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. Data Science & Statistics",
        institution: "UC Berkeley",
        period: "2022 — 2026",
        startYear: "2022",
        endYear: "2026",
        description: "Focus on Deep Learning, Statistical Inference, and Distributed Data Engineering."
      }
    ],
    timeline: [
      { title: 'Machine Learning Research Intern', subtitle: 'OpenAI Ecosystem • 2024 - Present', desc: 'Fine-tuned LLM embeddings for structured financial document comprehension.' },
      { title: 'B.S. Data Science & Statistics', subtitle: 'UC Berkeley • 2022 - 2026', desc: 'Focus on Deep Learning, Statistical Inference, and Distributed Data Engineering.' }
    ],
    projects: [
      {
        id: "proj-1",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        title: 'Predictive Sales Intelligence Engine',
        description: 'Time-series forecasting model achieving 94.2% accuracy on retail demand with automated retraining pipelines.',
        tags: ['Python', 'PyTorch', 'FastAPI'],
        technologies: ['Python', 'PyTorch', 'FastAPI'],
        link: 'https://github.com'
      },
      {
        id: "proj-2",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        title: 'Real-Time Telemetry Anomaly Detector',
        description: 'Sub-millisecond stream clustering on sensor metrics using Kafka and DuckDB.',
        tags: ['Kafka', 'Docker', 'Python'],
        technologies: ['Kafka', 'Docker', 'Python'],
        link: 'https://github.com'
      }
    ],
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Data Scientist passionate about building scalable machine learning pipelines, deep learning architectures, and actionable business intelligence.',
    university: 'UC Berkeley',
    major: 'Data Science & Applied Statistics',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
    seo: { title: 'Rohan Sharma | Data Scientist & ML Engineer', description: 'Data Science portfolio preview', keywords: 'data science, ml, ai, portfolio' }
  } : {
    id: 'preview-portfolio',
    username: 'preview-user',
    category: template.category,
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} - Sample Preview`,
    name: 'Alex Chen',
    tagline: 'Computer Science Student & Full-Stack Engineer',
    headline: 'Engineering Scalable Systems & Intelligent Software',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Repositories', value: '30+' },
      { label: 'Projects Built', value: '10+' }
    ],
    skills: ['TypeScript', 'React', 'Next.js', 'Python', 'PostgreSQL', 'Docker', 'TailwindCSS', 'Node.js'],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025', year: '2025' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Software Engineer Intern",
        company: "Tech Solutions Inc.",
        period: "2024 — Present",
        startDate: "2024",
        endDate: "Present",
        current: true,
        description: "Built real-time telemetry analytics dashboards and optimized payment microservices in Node.js."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        institution: "University of Technology",
        period: "2022 — 2026",
        startYear: "2022",
        endYear: "2026",
        description: "Coursework in Operating Systems, Algorithms, and Distributed Computing."
      }
    ],
    timeline: [
      { title: 'Software Engineer Intern', subtitle: 'Tech Solutions • 2024 - Present', desc: 'Built real-time telemetry analytics dashboards for payment APIs.' },
      { title: 'B.S. Computer Science', subtitle: 'University • 2022 - 2026', desc: 'Coursework in Operating Systems, Algorithms, and Distributed Computing.' }
    ],
    projects: [
      {
        id: "proj-1",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        title: 'Full-Stack Analytics Platform',
        description: 'Distributed performance telemetry dashboard and real-time query interface with sub-10ms response times.',
        tags: ['React', 'TypeScript', 'PostgreSQL'],
        technologies: ['React', 'TypeScript', 'PostgreSQL'],
        link: 'https://github.com'
      },
      {
        id: "proj-2",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        title: 'Cloud Infrastructure Automation',
        description: 'Infrastructure as code workflows with automated container scaling and observability alerts.',
        tags: ['Docker', 'Next.js', 'TailwindCSS'],
        technologies: ['Docker', 'Next.js', 'TailwindCSS'],
        link: 'https://github.com'
      }
    ],
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Software developer passionate about engineering high-performance web systems, cloud infrastructure, and data-driven developer applications.',
    university: 'University of Technology',
    major: 'Computer Science',
    sections: Array.isArray(template.sections)
      ? template.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || sec?.component || 'Section'))
      : ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
    seo: { title: 'Alex Chen Portfolio', description: 'Sample portfolio preview', keywords: 'cs, portfolio, developer' }
  };

  const activeData = (useUserData && activeUserPortfolio) ? activeUserPortfolio : sampleDemoData;
  const currentPreviewData: PortfolioData = {
    ...activeData,
    templateId: template.id,
    templateVersionId: template.currentVersionId || template.version,
    layoutStyle: template.id,
    isDarkMode: themeMode === 'dark',
    sectionFiles: (activeData.templateId === template.id && activeData._sectionFilesTemplateId === template.id && activeData.sectionFiles) ? activeData.sectionFiles : (template.sectionFiles || undefined),
    _sectionFilesTemplateId: template.id
  };

  // Logical viewport widths — these must match ViewportStage virtualWidth values
  const DEVICE_LOGICAL_WIDTH = device === 'mobile' ? 390 : device === 'tablet' ? 768 : 1440;

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn">
      {/* Top Controls Bar */}
      <header className="px-3 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 border-b border-zinc-800 text-white flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs z-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-extrabold text-xs sm:text-sm text-[#7C3AED] flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[220px]">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{template.name}</span>
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[9px] sm:text-[10px] shrink-0">
            v{template.version}
          </span>
          <span className="text-zinc-500 font-mono text-[10px] hidden md:inline">ID: {template.id}</span>
        </div>

        {/* Viewport, Theme & Data Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto py-0.5">
          {/* Data Source Switcher */}
          <button
            onClick={() => setUseUserData(!useUserData)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shrink-0 cursor-pointer ${
              useUserData ? 'bg-purple-600 text-white shadow-sm' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
            title="Toggle between Sample Demo Data vs Current Active User Data"
          >
            {useUserData ? <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            <span className="hidden sm:inline">{useUserData ? 'Active User Data' : 'Sample Demo Data'}</span>
            <span className="inline sm:hidden">{useUserData ? 'User Data' : 'Sample'}</span>
          </button>

          {/* Device Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-800 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shrink-0">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors cursor-pointer ${device === 'desktop' ? 'bg-[#7C3AED] text-white' : 'text-zinc-400 hover:text-white'}`}
              title="Desktop View (1200px)"
            >
              <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors cursor-pointer ${device === 'tablet' ? 'bg-[#7C3AED] text-white' : 'text-zinc-400 hover:text-white'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors cursor-pointer ${device === 'mobile' ? 'bg-[#7C3AED] text-white' : 'text-zinc-400 hover:text-white'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Light / Dark Mode Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-800 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shrink-0">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors cursor-pointer ${themeMode === 'light' ? 'bg-amber-500 text-white' : 'text-zinc-400 hover:text-white'}`}
              title="Light Theme Preview"
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors cursor-pointer ${themeMode === 'dark' ? 'bg-[#7C3AED] text-white' : 'text-zinc-400 hover:text-white'}`}
              title="Dark Theme Preview"
            >
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Zoom Scale Controls (Hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-800 p-1 rounded-xl font-mono text-[11px] shrink-0">
            <button
              onClick={() => setZoomScale(Math.max(zoomScale - 25, 50))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-zinc-300 font-bold">{zoomScale}%</span>
            <button
              onClick={() => setZoomScale(Math.min(zoomScale + 25, 125))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Close Modal */}
        <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg sm:rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0">
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </header>

      {/* Preview Screen Body — centered device frame viewport */}
      <main
        className={`flex-grow ${device === 'desktop' ? 'p-0' : 'p-4 sm:p-8'} overflow-y-auto flex flex-col items-center bg-zinc-950 w-full`}
        id="admin-preview-main"
      >
        <div
          style={{
            width: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : '100%'),
            maxWidth: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : 'none'),
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : 'none',
            transformOrigin: 'top center',
            transition: 'all 0.2s ease-in-out',
          }}
          className={`relative mx-auto bg-white ${
            device === 'mobile'
              ? 'rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.7)] border-[8px] border-zinc-800 overflow-hidden my-2'
              : device === 'tablet'
              ? 'rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-zinc-800/80 overflow-hidden my-2'
              : 'w-full rounded-none border-0 shadow-none overflow-visible my-0'
          }`}
        >
          {(() => {
            console.log('[DIAGNOSTIC - ADMIN PREVIEW]', {
              RENDERER: 'ADMIN PREVIEW',
              portfolioId: currentPreviewData.id,
              templateId: template.id,
              logicalViewportWidth: DEVICE_LOGICAL_WIDTH,
              device,
              zoomScale,
              versionId: template.currentVersionId || template.version,
            });
            return (
              <TemplateRenderer
                templateId={template.id}
                versionId={template.currentVersionId || template.version}
                portfolioData={currentPreviewData}
                mode="admin-preview"
                version={template.version}
                viewport={device}
              />
            );
          })()}
        </div>
      </main>
    </div>
  );
}
