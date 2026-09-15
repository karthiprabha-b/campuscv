"use client";

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
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

  const isDesigner = categoryLower.includes('design') || idLower.includes('design') || nameLower.includes('design') || categoryLower.includes('creative') || idLower.includes('creative');
  const isPhotography = categoryLower.includes('photo') || idLower.includes('photo') || nameLower.includes('photo');
  const isDoctor = categoryLower.includes('doctor') || idLower.includes('doctor') || idLower.includes('medic') || nameLower.includes('doctor') || idLower.includes('health');
  const isAgri = categoryLower.includes('agri') || idLower.includes('agri') || nameLower.includes('agri');
  const isBeautician = categoryLower.includes('beauty') || idLower.includes('beautician') || nameLower.includes('beauty') || nameLower.includes('beautician');
  const isLawyer = categoryLower.includes('law') || idLower.includes('lawyer') || nameLower.includes('lawyer') || idLower.includes('legal');

  const canonicalSectionsList = ['hero', 'about', 'projects', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonial', 'contact'];

  const realTemplateSampleData: PortfolioData = embeddedData ? {
    ...embeddedData,
    id: `preview-${template.id}`,
    username: 'demo-preview',
    templateId: template.id,
    layoutStyle: template.id,
    isDarkMode: themeMode === 'dark',
    sections: canonicalSectionsList,
    sectionOrder: canonicalSectionsList,
    published: true,
  } : isDesigner ? {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: 'Design',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Official Design Showcase`,
    name: 'Sara Chen',
    fullName: 'Sara Chen',
    tagline: 'Lead Product & UI/UX Designer',
    headline: 'Designing intuitive digital products & scalable design systems',
    role: 'Lead Product Designer',
    location: 'Bengaluru, India',
    email: 'sara.chen@designstudio.io',
    phone: '+91 98765 43210',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Years Experience', value: '6+' },
      { label: 'Products Shipped', value: '24+' },
      { label: 'Design Awards', value: '4' }
    ],
    hero: {
      name: 'Sara Chen',
      role: 'Lead Product Designer',
      title: 'Designing intuitive digital products & scalable design systems',
      subtitle: 'Product designer focused on turning complex enterprise problems into simple, thoughtful digital experiences with meticulous craft.',
      headline: 'Designing intuitive digital products & scalable design systems',
      description: 'Product designer focused on turning complex enterprise problems into simple, thoughtful digital experiences with meticulous craft.',
      location: 'Bengaluru, India',
      availability: 'Available for select projects & full-time roles',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      ctaText: 'View Selected Work',
      primaryButton: { label: 'View Selected Work', url: '#projects' },
      secondaryButton: { label: 'About Me', url: '#about' }
    },
    about: {
      title: 'I design at the intersection of people, products and technology.',
      headline: 'I design at the intersection of people, products and technology.',
      description: "Over the last 6+ years, I've collaborated with fast-growing tech startups and global engineering teams to transform ambiguous product requirements into clean, delightful digital experiences.\n\nMy design approach is anchored in deep user inquiry, robust information architecture, and obsessive visual precision.",
      bio: "Over the last 6+ years, I've collaborated with fast-growing tech startups and global engineering teams to transform ambiguous product requirements into clean, delightful digital experiences.\n\nMy design approach is anchored in deep user inquiry, robust information architecture, and obsessive visual precision.",
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      stats: [
        { label: 'Years Experience', value: '6+' },
        { label: 'Products Shipped', value: '24+' },
        { label: 'Product Users', value: '12M+' }
      ]
    },
    skills: ['Product Design', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Framer', 'Interaction Design', 'Wireframing'],
    tools: ['Figma', 'FigJam', 'Framer', 'Adobe Illustrator', 'Photoshop', 'Principle'],
    certifications: [
      { name: 'NN/g UX Master Certified (UXMC)', issuer: 'Nielsen Norman Group', year: '2024', issueDate: '2024', link: '#' },
      { name: 'Enterprise Design Thinking Leader', issuer: 'IBM Design', year: '2023', issueDate: '2023', link: '#' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Lead Product Designer",
        title: "Lead Product Designer",
        company: "Stripe & Co (Fintech)",
        period: "2022 — Present",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description: "Directing the global design system team and leading UX strategy for self-serve merchant portals serving 400k+ global businesses."
      },
      {
        id: "exp-2",
        role: "Senior UI/UX Designer",
        title: "Senior UI/UX Designer",
        company: "Studio Craft Labs",
        period: "2020 — 2022",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Partnered with Series A-C founders to ship 0-to-1 enterprise SaaS products and scalable multi-brand component libraries."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "Master of Design (M.Des) in Interaction Design",
        title: "Master of Design (M.Des) in Interaction Design",
        institution: "National Institute of Design (NID)",
        school: "National Institute of Design (NID)",
        period: "2016 — 2018",
        startYear: "2016",
        endYear: "2018",
        description: "Specialized in human-computer interaction, cognitive design systems, and qualitative usability testing."
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Fintech Mobile Banking Experience",
        name: "Fintech Mobile Banking Experience",
        description: "End-to-end design for a next-gen investment app focusing on zero-friction onboarding, live portfolio telemetry, and micro-interactions.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["Figma", "UI/UX", "Design Systems"],
        technologies: ["Figma", "Design Systems", "Prototyping"],
        category: "Fintech & Mobile UX",
        year: "2024",
        link: "https://dribbble.com"
      },
      {
        id: "proj-2",
        title: "Aura Design System (200+ Components)",
        name: "Aura Design System (200+ Components)",
        description: "A comprehensive multi-brand accessible component library with dark mode tokens, Figma auto-layout 5.0, and Storybook documentation.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        tags: ["Design System", "WCAG 2.1", "Tokens"],
        technologies: ["Figma", "Tokens", "Storybook"],
        category: "Enterprise System",
        year: "2023",
        link: "https://behance.net"
      }
    ],
    process: [
      { step: "01", number: "01", title: "Discovery & User Inquiries", description: "Deep qualitative interviews and competitive landscape mapping to isolate real user pain points." },
      { step: "02", number: "02", title: "Information Architecture", description: "Mapping core mental models, user journeys, and wireframe prototypes for frictionless flow." },
      { step: "03", number: "03", title: "High-Fidelity UI & Systems", description: "Crafting scalable component tokens, accessibility guidelines, and pixel-precise interfaces." },
      { step: "04", number: "04", title: "Validation & Engineering Handoff", description: "Usability testing rounds and pixel-perfect developer handoff with interactive specs." }
    ],
    approachSteps: [
      { step: "01", number: "01", title: "Discovery & User Inquiries", description: "Deep qualitative interviews and competitive landscape mapping to isolate real user pain points." },
      { step: "02", number: "02", title: "Information Architecture", description: "Mapping core mental models, user journeys, and wireframe prototypes for frictionless flow." },
      { step: "03", number: "03", title: "High-Fidelity UI & Systems", description: "Crafting scalable component tokens, accessibility guidelines, and pixel-precise interfaces." },
      { step: "04", number: "04", title: "Validation & Engineering Handoff", description: "Usability testing rounds and pixel-perfect developer handoff with interactive specs." }
    ],
    testimonials: [
      {
        quote: "Sara is one of the rare designers who seamlessly balances deep product strategy with exquisite visual craft. She leveled up our entire design culture.",
        author: "Marcus Vance",
        name: "Marcus Vance",
        role: "VP of Product, Stripe & Co",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      }
    ],
    contact: {
      title: "Have an interesting product problem? Let's design something worth using.",
      description: "Currently open for select freelance visual projects, product design consulting, and full-time product design leadership roles.",
      email: 'sara.chen@designstudio.io',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      socials: {
        linkedin: 'https://linkedin.com',
        dribbble: 'https://dribbble.com',
        behance: 'https://behance.net',
        twitter: 'https://twitter.com'
      }
    },
    social: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com',
      behance: 'https://behance.net',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Lead Product Designer passionate about crafting user-centric interfaces, robust design systems, and delightful digital experiences that solve real-world problems.',
    sections: canonicalSectionsList,
    sectionOrder: canonicalSectionsList,
    seo: { title: 'Sara Chen | Product & UI/UX Designer', description: 'Product Designer portfolio preview', keywords: 'design, ui, ux, portfolio' }
  } : isPhotography ? {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: 'Photography',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Visual Storytelling`,
    name: 'Elena Rostova',
    fullName: 'Elena Rostova',
    tagline: 'Visual Storyteller & Editorial Photographer',
    headline: 'Capturing raw emotions, cinematic landscapes, and timeless human stories',
    role: 'Editorial & Commercial Photographer',
    location: 'Berlin, Germany',
    email: 'elena@rostovaphoto.com',
    phone: '+49 170 1234567',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    fontPack: 'serif',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Exhibitions', value: '12' },
      { label: 'Magazine Covers', value: '28' },
      { label: 'Countries Captured', value: '34' }
    ],
    hero: {
      name: 'Elena Rostova',
      role: 'Editorial Photographer',
      title: 'Capturing raw emotions, cinematic landscapes, and timeless human stories',
      subtitle: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands.',
      headline: 'Capturing raw emotions, cinematic landscapes, and timeless human stories',
      description: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands.',
      location: 'Berlin, Germany',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    about: {
      title: 'Visual stories that transcend language and borders.',
      description: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands across Europe and Asia.',
      bio: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands across Europe and Asia.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    skills: ['Editorial Photography', 'Portraiture', 'Color Grading', 'Lighting Architecture', 'Photojournalism', 'Adobe Lightroom', 'Capture One'],
    projects: [
      {
        id: "proj-1",
        title: "Echoes of the Arctic (Editorial Collection)",
        name: "Echoes of the Arctic (Editorial Collection)",
        description: "A 3-month photographic expedition documenting indigenous communities and disappearing glacial landscapes.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        tags: ["Editorial", "Landscape", "National Geographic"],
        category: "Expedition & Nature",
        link: "https://unsplash.com"
      },
      {
        id: "proj-2",
        title: "Urban Monochromes — Tokyo & Berlin",
        name: "Urban Monochromes — Tokyo & Berlin",
        description: "High-contrast architectural and street portraiture celebrating modern minimalism.",
        image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        tags: ["Street", "Black & White", "Exhibition"],
        category: "Street & Architecture",
        link: "https://unsplash.com"
      }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Senior Editorial Photographer",
        title: "Senior Editorial Photographer",
        company: "Vanguard Magazine & Media",
        period: "2021 — Present",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: "Directing high-profile cover shoots, fashion week editorials, and international feature assignments."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.A. in Fine Art Photography",
        title: "B.A. in Fine Art Photography",
        institution: "Berlin University of the Arts",
        period: "2014 — 2018",
        description: "Specialized in analog film processing, lighting techniques, and documentary storytelling."
      }
    ],
    certifications: [
      { name: 'Sony Alpha Imaging Master', issuer: 'Sony Professional', year: '2023', link: '#' }
    ],
    contact: {
      title: "Let's capture something extraordinary together.",
      description: "Available for worldwide editorial assignments, brand campaigns, and gallery exhibitions.",
      email: 'elena@rostovaphoto.com',
      phone: '+49 170 1234567',
      location: 'Berlin, Germany'
    },
    social: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Editorial and commercial photographer with over 8 years of experience working with global publications, architectural firms, and fashion brands.',
    sections: canonicalSectionsList,
    sectionOrder: canonicalSectionsList,
    seo: { title: 'Elena Rostova | Photography Portfolio', description: 'Photography Portfolio Showcase', keywords: 'photo, editorial, portraits' }
  } : {
    id: `preview-${template.id}`,
    username: 'demo-preview',
    category: template.category || 'Engineering',
    templateId: template.id,
    layoutStyle: template.id,
    title: `${template.name} • Official Template Showcase`,
    name: 'Alex Rivera',
    fullName: 'Alex Rivera',
    tagline: 'Full-Stack Software Engineer & Solutions Architect',
    headline: 'Engineering Scalable Cloud Architectures & Intelligent Web Platforms',
    role: 'Senior Full-Stack Engineer & Architect',
    location: 'San Francisco, CA',
    email: 'alex.rivera@devcloud.io',
    phone: '+1 (555) 234-5678',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    projectThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    fontPack: 'sans',
    isDarkMode: themeMode === 'dark',
    published: true,
    stats: [
      { label: 'Repositories', value: '45+' },
      { label: 'Production Apps', value: '18+' },
      { label: 'Years Active', value: '6+' }
    ],
    hero: {
      name: 'Alex Rivera',
      role: 'Full-Stack Software Engineer & Solutions Architect',
      title: 'Engineering Scalable Cloud Architectures & Intelligent Web Platforms',
      subtitle: 'Specializing in high-throughput distributed backends, TypeScript microservices, and high-performance React frontends.',
      headline: 'Engineering Scalable Cloud Architectures & Intelligent Web Platforms',
      description: 'Specializing in high-throughput distributed backends, TypeScript microservices, and high-performance React frontends.',
      location: 'San Francisco, CA',
      availability: 'Available for high-impact engineering roles & advisory',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      primaryButton: { label: 'Explore Projects', url: '#projects' },
      secondaryButton: { label: 'Get in Touch', url: '#contact' }
    },
    about: {
      title: 'Building resilient systems that power modern software experiences.',
      headline: 'Building resilient systems that power modern software experiences.',
      description: 'Senior Software Engineer with 6+ years of expertise spanning distributed cloud microservices, real-time streaming architectures, and modern responsive web applications.',
      bio: 'Senior Software Engineer with 6+ years of expertise spanning distributed cloud microservices, real-time streaming architectures, and modern responsive web applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      stats: [
        { label: 'Repositories', value: '45+' },
        { label: 'Production Apps', value: '18+' },
        { label: 'Uptime SLA', value: '99.99%' }
      ]
    },
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'TailwindCSS'],
    tools: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'Kafka', 'Git', 'Terraform'],
    certifications: [
      { name: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', year: '2024', issueDate: '2024', link: '#' },
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', year: '2023', issueDate: '2023', link: '#' }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Senior Full-Stack Engineer",
        title: "Senior Full-Stack Engineer",
        company: "Vanguard Cloud Systems",
        period: "2023 — Present",
        startDate: "2023",
        endDate: "Present",
        current: true,
        description: "Spearheading backend microservices architecture and real-time distributed telemetry dashboards serving 200k+ daily active users."
      },
      {
        id: "exp-2",
        role: "Software Engineer",
        title: "Software Engineer",
        company: "Nexus Labs",
        period: "2021 — 2023",
        startDate: "2021",
        endDate: "2023",
        current: false,
        description: "Built modular React component architectures and high-throughput PostgreSQL query pipelines with 99.99% system reliability."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science & Engineering",
        title: "B.S. in Computer Science & Engineering",
        institution: "California Institute of Technology",
        school: "California Institute of Technology",
        period: "2017 — 2021",
        startYear: "2017",
        endYear: "2021",
        description: "Graduated with Honors. Focus on Distributed Systems, Cloud Infrastructure, and Algorithms."
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "OmniFlow Distributed Streaming Engine",
        name: "OmniFlow Distributed Streaming Engine",
        description: "High-throughput event aggregation platform processing over 50,000 events/second with sub-10ms Redis latency.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        tags: ["Node.js", "Redis", "Docker", "Kafka"],
        technologies: ["Node.js", "Redis", "Docker", "Kafka"],
        category: "Cloud Infrastructure",
        year: "2024",
        link: "https://github.com"
      },
      {
        id: "proj-2",
        title: "CloudPulse Serverless Analytics",
        name: "CloudPulse Serverless Analytics",
        description: "Real-time edge performance monitoring SDK with automated anomaly detection alerts and WebSocket live charts.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tags: ["Next.js", "TypeScript", "TailwindCSS"],
        technologies: ["Next.js", "TypeScript", "TailwindCSS"],
        category: "Developer Tools",
        year: "2023",
        link: "https://github.com"
      }
    ],
    process: [
      { step: "01", number: "01", title: "System Architecture Design", description: "Evaluating scale, database schemas, and microservice boundaries before code is written." },
      { step: "02", number: "02", title: "Test-Driven Development", description: "Writing end-to-end integration tests and clean, typed modular components." },
      { step: "03", number: "03", title: "Automated CI/CD & Deploy", description: "Zero-downtime containerized deployment pipelines with canary releases." }
    ],
    approachSteps: [
      { step: "01", number: "01", title: "System Architecture Design", description: "Evaluating scale, database schemas, and microservice boundaries before code is written." },
      { step: "02", number: "02", title: "Test-Driven Development", description: "Writing end-to-end integration tests and clean, typed modular components." },
      { step: "03", number: "03", title: "Automated CI/CD & Deploy", description: "Zero-downtime containerized deployment pipelines with canary releases." }
    ],
    testimonials: [
      {
        quote: "Alex is an engineering powerhouse. He built our streaming pipeline from scratch and scaled it to handle millions of requests without a hitch.",
        author: "Sarah Lin",
        name: "Sarah Lin",
        role: "CTO, Vanguard Systems",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      }
    ],
    contact: {
      title: "Have a project or technical opportunity in mind?",
      description: "Feel free to reach out for high-impact software engineering roles, technical advisory, or cloud architecture consulting.",
      email: 'alex.rivera@devcloud.io',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    aboutMe: 'Passionate software engineer focused on building robust, scalable web products, resilient backend architectures, and elegant user experiences.',
    sections: canonicalSectionsList,
    sectionOrder: canonicalSectionsList,
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
      <header className="px-3 sm:px-6 py-2 sm:py-0 min-h-[3.75rem] sm:h-16 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 shrink-0 z-20">
        
        {/* Top Row: Template Name & Mobile Action Buttons */}
        <div className="flex items-center justify-between gap-2 min-w-0 w-full sm:w-auto">
          {/* Left: Template Name, Category & Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-white font-bricolage truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
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
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono truncate hidden xs:block">
                Original Template Design Showcase {useUserData ? '• (Showing My Data)' : '• (Real Template Demo)'}
              </p>
            </div>
          </div>

          {/* Right Action on Mobile Only */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {isLocked ? (
              <button
                type="button"
                onClick={onUpgrade}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold shadow-sm cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Unlock</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onApplyTemplate?.(template.id)}
                disabled={isCurrentlyUsed}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                  isCurrentlyUsed
                    ? 'bg-zinc-800 text-zinc-400 cursor-default'
                    : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer'
                }`}
              >
                {isCurrentlyUsed ? 'Active' : 'Use Template'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700/60"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Device, Theme & Data Switcher Controls */}
        <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
          
          {/* Data Source Switcher: Real Template Design vs My Portfolio Data */}
          {userPortfolio && (
            <div className="flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60 shadow-inner shrink-0">
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

          {/* Device & Theme controls group */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Responsive Device Switcher */}
            <div className="hidden sm:flex items-center gap-0.5 bg-zinc-800/90 p-0.5 sm:p-1 rounded-xl border border-zinc-700/60">
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
        </div>

        {/* Right on Desktop: Primary Action & Close */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
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
        device === 'desktop' ? 'p-0' : 'p-2 sm:p-6 md:p-8'
      }`}>
        <div
          style={{
            width: device === 'mobile' ? 'min(100%, 390px)' : (device === 'tablet' ? 'min(100%, 768px)' : '100%'),
            maxWidth: device === 'mobile' ? 'min(100%, 390px)' : (device === 'tablet' ? 'min(100%, 768px)' : 'none'),
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : 'none',
            transformOrigin: 'top center',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`relative mx-auto bg-white transition-shadow ${
            device === 'mobile'
              ? 'rounded-[32px] sm:rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[6px] sm:border-[10px] border-zinc-800 overflow-hidden my-2 sm:my-4 ring-1 ring-zinc-700/50'
              : device === 'tablet'
                ? 'rounded-[24px] sm:rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[6px] sm:border-[8px] border-zinc-800 overflow-hidden my-2 sm:my-4 ring-1 ring-zinc-700/50'
                : 'w-full min-h-full'
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
