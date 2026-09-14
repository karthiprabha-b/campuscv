"use client";

/**
 * SectionTree — Universal Visual Page Builder Layers Navigator
 *
 * 100% Template-Agnostic Tree Navigator.
 * Displays all detected sections, sub-layers (Hero: Name, Bio, Image, Button, etc.),
 * and nested collection items dynamically.
 * Provides two-way iframe synchronization:
 *   - Selecting layer in SectionTree scrolls and highlights element in template.
 *   - Selecting element in live template selects corresponding layer in SectionTree.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Eye, EyeOff,
  Plus, Layers, User, Briefcase, GraduationCap,
  Code, Award, Mail, Sparkles, FolderKanban, GripVertical, Trash2,
  FileText, Image as ImageIcon, MousePointerClick, Tag
} from 'lucide-react';
import { useEditorContext, SelectedElement } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';
import { createUniversalCollectionObject } from '../../utils/universalEditorEngine';
import { normalizePortfolio } from '../../utils/portfolioNormalizer';
import { discoverTemplateSections } from '../../utils/templateSectionRegistry';

interface SectionTreeProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  onOpenAddModal?: () => void;
}

interface LayerFieldConfig {
  id: string;
  label: string;
  fieldPath: string;
  icon: React.ReactNode;
  selector: string;
}

interface SectionConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  dataKey?: keyof PortfolioData | string;
  getItemLabel?: (item: any, idx: number) => string;
  fields?: LayerFieldConfig[];
  isCustom?: boolean;
}

function getActiveTemplateDoc(): Document | null {
  if (typeof window === 'undefined') return null;
  if ((window as any).__CAMPUSCV_IFRAME_DOC__) {
    const d = (window as any).__CAMPUSCV_IFRAME_DOC__;
    if (d?.body) return d;
  }
  const iframe = (document.querySelector('iframe[title="Template Isolated Runtime"]') as HTMLIFrameElement) ||
    (document.querySelector('iframe') as HTMLIFrameElement);
  if (iframe && (iframe.contentDocument || iframe.contentWindow?.document)) {
    return iframe.contentDocument || iframe.contentWindow!.document;
  }
  return document;
}

function highlightTemplateElement(el: HTMLElement) {
  if (!el) return;

  // 1. Native scroll attempt
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {}

  // 2. Cross-frame scrolling support for editor canvas stage
  try {
    const ownerDoc = el.ownerDocument;
    if (ownerDoc && (ownerDoc !== document || (window as any).__CAMPUSCV_IFRAME_DOC__)) {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      const iframe = iframes.find(f => {
        try {
          return f.contentDocument === ownerDoc || f.contentWindow === ownerDoc.defaultView;
        } catch (err) {
          return false;
        }
      }) || iframes[0];

      if (iframe) {
        const iframeRect = iframe.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const targetTopInParent = iframeRect.top + elRect.top;

        const parentContainers = [
          document.querySelector('[data-tour="canvas-stage"]'),
          document.getElementById('viewport-stage-scroll-container'),
          document.getElementById('admin-preview-main'),
          document.querySelector('main.overflow-y-auto'),
          document.querySelector('div.overflow-y-auto'),
          document.documentElement,
          document.body
        ].filter(Boolean) as HTMLElement[];

        for (const container of parentContainers) {
          if (container.scrollHeight > container.clientHeight) {
            const currentScroll = container.scrollTop;
            const containerRect = container.getBoundingClientRect();
            const offset = targetTopInParent - containerRect.top + currentScroll - 80;
            container.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
            break;
          }
        }
      }
    }
  } catch (e) {}

  const prevOutline = el.style.outline;
  const prevOffset = el.style.outlineOffset;
  const prevTransition = el.style.transition;
  el.style.transition = 'outline 0.2s ease, outline-offset 0.2s ease';
  el.style.outline = '2px solid #7C3AED';
  el.style.outlineOffset = '3px';
  setTimeout(() => {
    if (el) {
      el.style.outline = prevOutline;
      el.style.outlineOffset = prevOffset;
      el.style.transition = prevTransition;
    }
  }, 2200);
}

export function getSectionItems(portfolio: PortfolioData, dataKey?: string): any[] {
  if (!portfolio || !dataKey) return [];
  if (dataKey === 'experience' || dataKey === 'timeline') {
    const list = Array.isArray(portfolio.experience) && portfolio.experience.length > 0
      ? portfolio.experience
      : (Array.isArray(portfolio.timeline) ? portfolio.timeline : (portfolio.experience || []));
    return Array.isArray(list) ? list : [];
  }
  if (dataKey === 'education') {
    const list = Array.isArray(portfolio.education) ? portfolio.education : [];
    return Array.isArray(list) ? list : [];
  }
  const list = (portfolio as any)[dataKey];
  return Array.isArray(list) ? list : [];
}

function getLiveTemplateSections(doc: Document | null): string[] {
  if (!doc) return [];
  const root = doc.getElementById('template-root') || doc.querySelector('[data-template-root]') || doc.body;
  if (!root) return [];

  const found: string[] = [];
  const seen = new Set<string>();

  const candidates = Array.from(root.querySelectorAll('section, [data-cv-section], [data-section], header, main > div[id], [id]'));

  const knownKeys = [
    'hero', 'home', 'intro', 'header',
    'about', 'bio',
    'education', 'academics',
    'experience', 'timeline', 'work',
    'projects', 'portfolio',
    'skills', 'tech', 'stack',
    'certifications', 'certificates', 'awards', 'achievements',
    'specialties', 'services',
    'process', 'workflow',
    'testimonials', 'testimonial', 'reviews',
    'publications', 'gallery', 'stats',
    'contact', 'footer'
  ];

  candidates.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const cvSec = (htmlEl.getAttribute('data-cv-section') || htmlEl.getAttribute('data-section') || '').toLowerCase().trim();
    const id = (htmlEl.id || '').toLowerCase().trim();

    let secId = '';
    if (cvSec) {
      secId = cvSec;
    } else if (id && knownKeys.some(k => id === k || id.startsWith(`${k}-`) || id.endsWith(`-${k}`))) {
      secId = id.replace(/-(section|container|wrapper|root)$/, '');
    } else if (htmlEl.tagName === 'SECTION' && id) {
      secId = id;
    }

    if (secId) {
      let normalized = secId;
      if (normalized === 'home' || normalized === 'intro' || normalized === 'header') normalized = 'hero';
      if (normalized === 'bio') normalized = 'about';
      if (normalized === 'certificates' || normalized === 'awards' || normalized === 'achievements') normalized = 'certifications';
      if (normalized === 'timeline' || normalized === 'work') normalized = 'experience';
      if (normalized === 'academics') normalized = 'education';
      if (normalized === 'portfolio') normalized = 'projects';
      if (normalized === 'tech' || normalized === 'stack') normalized = 'skills';
      if (normalized === 'workflow') normalized = 'process';
      if (normalized === 'testimonial' || normalized === 'reviews') normalized = 'testimonials';

      if (!seen.has(normalized)) {
        seen.add(normalized);
        found.push(normalized);
      }
    }
  });

  return found;
}

const TEMPLATE_SECTION_DEFAULTS: Record<string, string[]> = {
  'static-panel': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'static_panel': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'static panel': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'designer-portfolio': ['hero', 'projects', 'about', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonials', 'contact'],
  'designer portfolio': ['hero', 'projects', 'about', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonials', 'contact'],
  'designer': ['hero', 'projects', 'about', 'process', 'experience', 'skills', 'education', 'certifications', 'testimonials', 'contact'],
  'doctor': ['hero', 'about', 'specialties', 'services', 'experience', 'education', 'certifications', 'contact'],
  'doctor-portfolio': ['hero', 'about', 'specialties', 'services', 'experience', 'education', 'certifications', 'contact'],
  'cs-portfolio': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'slash-model': ['hero', 'about', 'projects', 'experience', 'skills', 'education', 'certifications', 'contact'],
  'slash model': ['hero', 'about', 'projects', 'experience', 'skills', 'education', 'certifications', 'contact'],
  'card': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'Card': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'centerd': ['hero', 'about', 'services', 'experience', 'projects', 'skills', 'education', 'contact'],
  'Centered': ['hero', 'about', 'services', 'experience', 'projects', 'skills', 'education', 'contact'],
  'stu-creative-bold': ['hero', 'about', 'services', 'approach', 'education', 'skills', 'tools', 'certifications', 'projects', 'experience', 'testimonials', 'achievements', 'contact'],
  'stu_creative_bold': ['hero', 'about', 'services', 'approach', 'education', 'skills', 'tools', 'certifications', 'projects', 'experience', 'testimonials', 'achievements', 'contact'],
  'stu_lawyer': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'stu-lawyer': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'stu lawyer': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'lawyer': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'executive-lawyer-portfolio': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'executive lawyer': ['hero', 'achievements', 'about', 'skills', 'projects', 'services', 'experience', 'education', 'testimonials', 'contact'],
  'engineering': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
  'Engineering': ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact'],
};

export default function SectionTree({ portfolio, onPortfolioChange, onOpenAddModal }: SectionTreeProps) {
  const { selectedElement, setSelectedElement, setInspectorMode, onFieldChange, detectedSections } = useEditorContext();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [liveDomSections, setLiveDomSections] = useState<string[]>([]);

  // Scan live template iframe DOM for exact visual sections on mount / render
  useEffect(() => {
    const update = () => {
      const doc = getActiveTemplateDoc();
      if (doc) {
        const live = getLiveTemplateSections(doc);
        if (live.length > 0) {
          setLiveDomSections(prev => {
            if (prev.join(',') !== live.join(',')) return live;
            return prev;
          });
        }
      }
    };
    update();
    const handleRendered = () => {
      update();
    };
    window.addEventListener('campuscv:template-rendered', handleRendered);
    return () => {
      window.removeEventListener('campuscv:template-rendered', handleRendered);
    };
  }, [portfolio.templateId]);

  // Auto-expand section if an element inside it is selected from the template
  useEffect(() => {
    if (selectedElement?.sectionId) {
      setExpandedSections(prev => {
        if (!prev.has(selectedElement.sectionId!)) {
          const next = new Set(prev);
          next.add(selectedElement.sectionId!);
          return next;
        }
        return prev;
      });
    }
  }, [selectedElement?.sectionId]);

  const activeTemplateSectionRecords = useMemo(() => {
    return discoverTemplateSections(null, { ...portfolio, mode: 'editor' });
  }, [portfolio]);

  const isVisible = (sectionId: string) => {
    const deletedNodes = (portfolio as any).deletedNodes || {};
    if (deletedNodes[`section:${sectionId}:root:section:0`] === true || deletedNodes[sectionId] === true) {
      return false;
    }
    const hiddenNodes = (portfolio as any).hiddenNodes || {};
    if (hiddenNodes[`section:${sectionId}:root:section:0`] === true || hiddenNodes[sectionId] === true) {
      return false;
    }
    const styleOverrides = (portfolio as any).styleOverrides || {};
    if (styleOverrides[sectionId]?.display === 'none' || styleOverrides[`section:${sectionId}:root:section:0`]?.display === 'none') {
      return false;
    }
    const hiddenFields = portfolio.hiddenFields || [];
    return !hiddenFields.includes(`sections.${sectionId}`) && !hiddenFields.includes(sectionId);
  };

  const dynamicSections = useMemo(() => {
    const configMap: Record<string, SectionConfig> = {
      hero: {
        id: 'hero',
        label: 'Hero & Intro',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
        fields: [
          { id: 'availability', label: 'Availability Badge', fieldPath: 'hero.availability', icon: <Tag className="w-3 h-3 text-amber-500" />, selector: '[data-cv="hero.availability"], [data-node-id*="hero:root:badge:"], .badge, .sp-tag' },
          { id: 'name', label: 'Name', fieldPath: 'profile.name', icon: <User className="w-3 h-3 text-violet-500" />, selector: '[data-cv="hero.name"], [data-node-id*="hero:root:name:"], [data-node-id*="hero:root:h1:"], h1, [data-field="name"]' },
          { id: 'headline', label: 'Role & Headline', fieldPath: 'profile.headline', icon: <FileText className="w-3 h-3 text-indigo-500" />, selector: '[data-cv="hero.role"], [data-cv="hero.headline"], [data-node-id*="hero:root:role:"], [data-node-id*="hero:root:h2:"]' },
          { id: 'description', label: 'Bio / Description', fieldPath: 'hero.description', icon: <FileText className="w-3 h-3 text-blue-500" />, selector: '[data-cv="hero.description"], [data-node-id*="hero:root:p:"]' },
          { id: 'cta', label: 'Primary Button', fieldPath: 'hero.ctaText', icon: <MousePointerClick className="w-3 h-3 text-emerald-500" />, selector: '[data-cv="hero.primaryButton"], [data-node-id*="hero:root:btn:"], a.btn, a[href*="#projects"], button' },
          { id: 'photo', label: 'Profile Photo', fieldPath: 'profile.photo', icon: <ImageIcon className="w-3 h-3 text-rose-500" />, selector: '[data-cv="hero.profileImage"], [data-node-id*="hero:root:img:"], img' },
        ]
      },
      about: {
        id: 'about',
        label: 'About Me',
        icon: <User className="w-3.5 h-3.5 text-blue-500" />,
        fields: [
          { id: 'about-headline', label: 'Headline', fieldPath: 'about.headline', icon: <FileText className="w-3 h-3 text-blue-500" />, selector: '[data-cv="about.headline"], [data-cv="about.title"], [data-node-id*="about:root:h2:"], #about h2' },
          { id: 'about-bio', label: 'Bio / Summary', fieldPath: 'about.description', icon: <FileText className="w-3 h-3 text-zinc-500" />, selector: '[data-cv="about.description"], [data-cv="about.bio"], [data-node-id*="about:root:p:"]' },
          { id: 'about-photo', label: 'About Photo', fieldPath: 'about.avatarUrl', icon: <ImageIcon className="w-3 h-3 text-purple-500" />, selector: '[data-cv="about.image"], [data-cv="about.avatarUrl"], [data-node-id*="about:root:img:"], #about img' },
          { id: 'about-stats', label: 'Metrics & Stats', fieldPath: 'stats', icon: <Tag className="w-3 h-3 text-amber-500" />, selector: '[data-cv-collection="stats.items"], [data-node-id*="about:card:"]' },
        ]
      },
      education: {
        id: 'education',
        label: 'Education',
        icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />,
        dataKey: 'education',
        getItemLabel: (item, idx) => {
          const d = item.degree || item.title || item.qualification || `Education #${idx + 1}`;
          const inst = item.institution || item.school || item.company || '';
          return inst ? `${d} @ ${inst}` : d;
        }
      },
      experience: {
        id: 'experience',
        label: 'Experience',
        icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />,
        dataKey: 'experience',
        getItemLabel: (item, idx) => {
          const t = item.role || item.title || item.position || `Experience #${idx + 1}`;
          const c = item.company || item.organization || item.subtitle || '';
          return c ? `${t} @ ${c}` : t;
        }
      },
      projects: {
        id: 'projects',
        label: 'Projects',
        icon: <FolderKanban className="w-3.5 h-3.5 text-emerald-500" />,
        dataKey: 'projects',
        getItemLabel: (item, idx) => item.title || item.name || `Project #${idx + 1}`
      },
      skills: {
        id: 'skills',
        label: 'Skills & Tech',
        icon: <Code className="w-3.5 h-3.5 text-amber-500" />,
        dataKey: 'skills',
        getItemLabel: (item, idx) => typeof item === 'string' ? item : (item.name || item.title || item.skill || `Skill #${idx + 1}`)
      },
      certifications: {
        id: 'certifications',
        label: 'Certifications & Awards',
        icon: <Award className="w-3.5 h-3.5 text-rose-500" />,
        dataKey: 'certifications',
        getItemLabel: (item, idx) => item.name || item.title || `Certificate #${idx + 1}`
      },
      specialties: {
        id: 'specialties',
        label: 'Specialties',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
        dataKey: 'specialties',
        getItemLabel: (item, idx) => item.title || item.name || `Specialty #${idx + 1}`
      },
      services: {
        id: 'services',
        label: 'Services',
        icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />,
        dataKey: 'services',
        getItemLabel: (item, idx) => item.title || item.name || `Service #${idx + 1}`
      },
      process: {
        id: 'process',
        label: 'Process & Workflow',
        icon: <Layers className="w-3.5 h-3.5 text-violet-500" />,
        dataKey: 'process',
        getItemLabel: (item, idx) => item.title || item.name || `Step #${idx + 1}`
      },
      testimonials: {
        id: 'testimonials',
        label: 'Testimonials',
        icon: <User className="w-3.5 h-3.5 text-pink-500" />,
        dataKey: 'testimonials',
        getItemLabel: (item, idx) => item.author || item.name || `Review #${idx + 1}`
      },
      contact: {
        id: 'contact',
        label: 'Contact & Social',
        icon: <Mail className="w-3.5 h-3.5 text-purple-500" />,
        fields: [
          { id: 'contact-email', label: 'Email', fieldPath: 'contact.email', icon: <Mail className="w-3 h-3 text-purple-500" />, selector: '#contact a[href^="mailto:"], [data-field="email"]' },
          { id: 'contact-socials', label: 'Social Links', fieldPath: 'socialLinks', icon: <Tag className="w-3 h-3 text-blue-500" />, selector: '#contact .socials, #contact a[href*="github"], #contact a[href*="linkedin"]' },
        ]
      },
    };

    const templateKey = (portfolio.templateId || (portfolio as any).layoutStyle || '').toLowerCase().trim();
    const templateBuiltin = TEMPLATE_SECTION_DEFAULTS[templateKey] ||
      (templateKey.includes('static') ? TEMPLATE_SECTION_DEFAULTS['static-panel'] :
       templateKey.includes('lawyer') || templateKey.includes('executive') ? TEMPLATE_SECTION_DEFAULTS['stu_lawyer'] :
       templateKey.includes('designer') ? TEMPLATE_SECTION_DEFAULTS['designer-portfolio'] :
       templateKey.includes('doctor') ? TEMPLATE_SECTION_DEFAULTS['doctor'] :
       templateKey.includes('cs') ? TEMPLATE_SECTION_DEFAULTS['cs-portfolio'] :
       templateKey.includes('slash') ? TEMPLATE_SECTION_DEFAULTS['slash-model'] : null);

    const manifestSections = Array.isArray(portfolio.sections)
      ? portfolio.sections.map((s: any) => typeof s === 'string' ? s : s.id).filter(Boolean)
      : (Array.isArray((portfolio as any).templateSections) ? (portfolio as any).templateSections : []);

    const normalizedManifest = manifestSections.map((s: string) => {
      const k = String(s).toLowerCase().trim();
      if (k === 'certificates' || k === 'awards') return 'certifications';
      if (k === 'timeline') return 'experience';
      if (k === 'home' || k === 'intro') return 'hero';
      return k;
    });

    const activeTemplateSectionList = liveDomSections.length > 0
      ? liveDomSections
      : (normalizedManifest.length > 0
        ? normalizedManifest
        : (templateBuiltin || ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact']));

    // If user has customized sectionOrder, order available template sections accordingly
    const userOrder = (Array.isArray(portfolio.sectionOrder) && portfolio.sectionOrder.length > 0)
      ? portfolio.sectionOrder.map((s: string) => s.toLowerCase().trim())
      : [];

    const orderedSectionIds: string[] = [];
    const addedIds = new Set<string>();

    if (userOrder.length > 0) {
      userOrder.forEach((id: string) => {
        let cleanId = id;
        if (cleanId === 'certificates' || cleanId === 'awards') cleanId = 'certifications';
        if (cleanId === 'timeline') cleanId = 'experience';
        if (cleanId === 'home' || cleanId === 'intro') cleanId = 'hero';

        if (activeTemplateSectionList.includes(cleanId) && !addedIds.has(cleanId)) {
          orderedSectionIds.push(cleanId);
          addedIds.add(cleanId);
        }
      });
    }

    activeTemplateSectionList.forEach((id: string) => {
      let cleanId = id.toLowerCase().trim();
      if (cleanId === 'certificates' || cleanId === 'awards') cleanId = 'certifications';
      if (cleanId === 'timeline') cleanId = 'experience';
      if (cleanId === 'home' || cleanId === 'intro') cleanId = 'hero';

      if (!addedIds.has(cleanId)) {
        orderedSectionIds.push(cleanId);
        addedIds.add(cleanId);
      }
    });

    const ordered: SectionConfig[] = [];
    orderedSectionIds.forEach((id) => {
      if (configMap[id]) {
        ordered.push(configMap[id]);
      } else {
        // Fallback for custom uploaded template sections
        ordered.push({
          id,
          label: id.charAt(0).toUpperCase() + id.slice(1).replace(/[-_]/g, ' '),
          icon: <Layers className="w-3.5 h-3.5 text-zinc-500" />,
          isCustom: true
        });
      }
    });

    return ordered.length > 0 ? ordered : Object.values(configMap);
  }, [portfolio.sectionOrder, portfolio.sections, portfolio.templateId, (portfolio as any).layoutStyle, liveDomSections, detectedSections]);

  const toggleVisibility = (id: string) => {
    const isCurrentlyHidden = !isVisible(id);
    const hiddenFields = portfolio.hiddenFields || [];
    const updatedHiddenFields = isCurrentlyHidden
      ? hiddenFields.filter(f => f !== id && f !== `sections.${id}`)
      : [...hiddenFields, id];

    const updatedHiddenNodes = {
      ...((portfolio as any).hiddenNodes || {}),
      [id]: !isCurrentlyHidden,
      [`section:${id}:root:section:0`]: !isCurrentlyHidden
    };

    const updatedStyleOverrides = {
      ...((portfolio as any).styleOverrides || {}),
      [id]: {
        ...(((portfolio as any).styleOverrides || {})[id] || {}),
        display: isCurrentlyHidden ? '' : 'none'
      }
    };

    const updated: PortfolioData = {
      ...portfolio,
      hiddenFields: updatedHiddenFields,
      hiddenNodes: updatedHiddenNodes,
      styleOverrides: updatedStyleOverrides
    } as any;

    if (onPortfolioChange) {
      onPortfolioChange(updated);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updated);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSectionClick = (sectionId: string, label: string) => {
    const doc = getActiveTemplateDoc() || document;
    const targetEl = doc.getElementById(sectionId) ||
      doc.querySelector(`[data-section="${sectionId}"]`) ||
      doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
      doc.querySelector(`section#${sectionId}`) ||
      doc.querySelector(`section[id*="${sectionId}"]`) ||
      doc.querySelector(`[id*="${sectionId}"]`);

    if (targetEl) {
      highlightTemplateElement(targetEl as HTMLElement);
    }

    const sel: SelectedElement = {
      id: `section-${sectionId}`,
      fieldPath: `sections.${sectionId}`,
      elementType: 'section',
      sectionId: sectionId,
      label: label,
      el: (targetEl as HTMLElement) || undefined,
    };
    setSelectedElement(sel);
    setInspectorMode('section');
  };

  const handleFieldLayerClick = (sectionId: string, field: LayerFieldConfig) => {
    const doc = getActiveTemplateDoc() || document;
    const sectionEl = doc.getElementById(sectionId) ||
      doc.querySelector(`[data-section="${sectionId}"]`) ||
      doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
      doc.querySelector(`section#${sectionId}`) ||
      doc.querySelector(`section[id*="${sectionId}"]`) ||
      doc;

    let targetEl: HTMLElement | null = null;
    if (sectionEl) {
      targetEl = sectionEl.querySelector(field.selector) as HTMLElement | null;
    }
    if (!targetEl && doc) {
      targetEl = doc.querySelector(field.selector) as HTMLElement | null;
    }

    if (targetEl) {
      highlightTemplateElement(targetEl);
    }

    const sel: SelectedElement = {
      id: `field-${field.id}`,
      fieldPath: field.fieldPath,
      elementType: field.id.includes('photo') || field.id.includes('image') ? 'image' : (field.id.includes('btn') || field.id.includes('cta') ? 'button' : 'text'),
      sectionId: sectionId,
      label: field.label,
      el: targetEl || undefined,
    };
    setSelectedElement(sel);
    setInspectorMode(field.id.includes('photo') || field.id.includes('image') ? 'image' : 'element');
  };

  const handleItemClick = (sectionId: string, item: any, idx: number, dataKey: string, label: string) => {
    const doc = getActiveTemplateDoc() || document;
    const sectionEl = doc.getElementById(sectionId) ||
      doc.querySelector(`[data-section="${sectionId}"]`) ||
      doc.querySelector(`[data-cv-section="${sectionId}"]`) ||
      doc.querySelector(`section#${sectionId}`) ||
      doc.querySelector(`section[id*="${sectionId}"]`) ||
      doc.querySelector(`[id*="${sectionId}"]`);

    let itemEl: HTMLElement | null = null;
    if (sectionEl) {
      // 1. Direct query for exact item index
      const exactItemEl = sectionEl.querySelector(
        `[data-cv="${dataKey}.items[${idx}]"], [data-cv="${dataKey}[${idx}]"], [data-cv-index="${idx}"], [data-node-id*=":${dataKey}:items:${idx}:"], [data-node-id*=":${dataKey}:${idx}:"]`
      ) as HTMLElement | null;

      if (exactItemEl) {
        itemEl = exactItemEl;
      } else {
        const itemCards = Array.from(sectionEl.querySelectorAll('[data-cv-item], article, [class*="card"], [class*="project"], [class*="timeline"], [class*="experience"], [class*="education"], [class*="item"], li'));
        const leafCards = itemCards.filter(c => !c.classList.contains('card-snap-slide') && !c.classList.contains('card-snap-container') && !c.hasAttribute('data-section'));
        if (leafCards[idx]) itemEl = leafCards[idx] as HTMLElement;
        else if (itemCards[idx]) itemEl = itemCards[idx] as HTMLElement;
        else itemEl = sectionEl as HTMLElement;
      }
    }

    if (itemEl) {
      highlightTemplateElement(itemEl);
    }

    const itemId = typeof item === 'object' && item?.id ? item.id : `item-${dataKey}-${idx}`;

    const sel: SelectedElement = {
      id: itemId,
      fieldPath: `${dataKey}[${idx}]`,
      elementType: dataKey === 'skills' ? 'list' : 'card',
      sectionId: sectionId,
      index: idx,
      label: label,
      el: itemEl || undefined,
    };
    setSelectedElement(sel);
    setInspectorMode(dataKey === 'skills' ? 'list' : 'card');
  };

  const handleAddItem = (dataKey: keyof PortfolioData | string, sectionId: string) => {
    const rawKey = String(dataKey || sectionId).toLowerCase().trim();
    let canonicalKey = rawKey;
    if (rawKey === 'timeline' || rawKey === 'work' || rawKey === 'workexperience') canonicalKey = 'experience';
    if (rawKey === 'certificates' || rawKey === 'awards' || rawKey === 'achievements') canonicalKey = 'certifications';
    if (rawKey === 'academics') canonicalKey = 'education';
    if (rawKey === 'portfolio') canonicalKey = 'projects';

    const currentList = getSectionItems(portfolio, canonicalKey);
    const newItem = createUniversalCollectionObject(canonicalKey, currentList);
    const updatedList = [...currentList, newItem];

    const deletedNodes = { ...((portfolio as any)?.deletedNodes || {}) };
    delete deletedNodes[`section:${sectionId}:root:section:0`];
    delete deletedNodes[sectionId];
    delete deletedNodes[canonicalKey];
    delete deletedNodes[rawKey];
    Object.keys(deletedNodes).forEach(k => {
      if (k.toLowerCase().includes(sectionId.toLowerCase()) || k.toLowerCase().includes(canonicalKey.toLowerCase())) {
        delete deletedNodes[k];
      }
    });

    const hiddenNodes = { ...((portfolio as any)?.hiddenNodes || {}) };
    delete hiddenNodes[sectionId];
    delete hiddenNodes[`section:${sectionId}:root:section:0`];

    const hiddenFields = (portfolio.hiddenFields || []).filter(
      (f: string) => f !== sectionId && f !== `sections.${sectionId}` && f !== canonicalKey
    );

    const activatedSections = Array.isArray((portfolio as any)?.activatedSections)
      ? [...((portfolio as any)?.activatedSections || [])]
      : [];
    if (!activatedSections.includes(sectionId)) {
      activatedSections.push(sectionId);
    }
    if (!activatedSections.includes(canonicalKey)) {
      activatedSections.push(canonicalKey);
    }

    const sections = Array.isArray(portfolio.sections) ? [...portfolio.sections] : ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    if (!sections.includes(sectionId)) {
      sections.push(sectionId);
    }

    const updatedPortfolio: any = {
      ...portfolio,
      [canonicalKey]: updatedList,
      sections,
      activatedSections,
      deletedNodes,
      hiddenNodes,
      hiddenFields,
    };

    // Synchronize twin keys
    if (canonicalKey === 'experience') {
      updatedPortfolio.timeline = updatedList;
      updatedPortfolio.work = updatedList;
      updatedPortfolio.workExperience = updatedList;
    } else if (canonicalKey === 'certifications') {
      updatedPortfolio.certificates = updatedList;
      updatedPortfolio.awards = updatedList;
    }

    if (updatedPortfolio.canonicalProfile && typeof updatedPortfolio.canonicalProfile === 'object') {
      updatedPortfolio.canonicalProfile[canonicalKey] = updatedList;
      if (canonicalKey === 'experience') {
        updatedPortfolio.canonicalProfile.experience = updatedList;
      }
    }

    if (onPortfolioChange) {
      onPortfolioChange(updatedPortfolio);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updatedPortfolio);
    }

    setExpandedSections(prev => new Set(prev).add(sectionId));

    const newIdx = updatedList.length - 1;
    const isList = canonicalKey === 'skills' || typeof newItem === 'string';
    const itemId = typeof newItem === 'object' && newItem?.id ? newItem.id : `item-${canonicalKey}-${newIdx}`;

    setTimeout(() => {
      setSelectedElement({
        id: itemId,
        fieldPath: `${canonicalKey}[${newIdx}]`,
        elementType: isList ? 'list' : 'card',
        sectionId: sectionId,
        index: newIdx,
        label: typeof newItem === 'string' ? newItem : (newItem.title || newItem.name || newItem.role || 'New Item')
      });
      setInspectorMode(isList ? 'list' : 'card');
    }, 50);
  };

  const handleDeleteItem = (dataKey: string, itemIdx: number, itemId?: string) => {
    const rawKey = String(dataKey).toLowerCase().trim();
    let canonicalKey = rawKey;
    if (rawKey === 'timeline' || rawKey === 'work' || rawKey === 'workexperience') canonicalKey = 'experience';
    if (rawKey === 'certificates' || rawKey === 'awards' || rawKey === 'achievements') canonicalKey = 'certifications';
    if (rawKey === 'academics') canonicalKey = 'education';
    if (rawKey === 'portfolio') canonicalKey = 'projects';

    const currentList = getSectionItems(portfolio, canonicalKey);
    const updatedList = currentList.filter((item: any, i: number) => {
      if (itemId && typeof item === 'object' && item?.id) {
        return item.id !== itemId;
      }
      return i !== itemIdx;
    });

    const updatedPortfolio: any = {
      ...portfolio,
      [canonicalKey]: updatedList,
    };

    if (canonicalKey === 'experience') {
      updatedPortfolio.timeline = updatedList;
      updatedPortfolio.work = updatedList;
      updatedPortfolio.workExperience = updatedList;
    } else if (canonicalKey === 'certifications') {
      updatedPortfolio.certificates = updatedList;
      updatedPortfolio.awards = updatedList;
    }

    if (updatedPortfolio.canonicalProfile && typeof updatedPortfolio.canonicalProfile === 'object') {
      updatedPortfolio.canonicalProfile[canonicalKey] = updatedList;
    }

    if (onPortfolioChange) {
      onPortfolioChange(updatedPortfolio);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updatedPortfolio);
    }
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      handleDragEnd();
      return;
    }

    const reordered = [...dynamicSections];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIdx, 0, moved);

    const nextOrder = reordered.map(s => s.id);
    const updated: PortfolioData = {
      ...portfolio,
      sectionOrder: nextOrder
    };
    if (onPortfolioChange) {
      onPortfolioChange(updated);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updated);
    }

    handleDragEnd();
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between px-3 py-2 mb-1">
        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-violet-500" />
          Layers & Content
        </span>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="px-2 py-0.5 rounded-md bg-violet-50 hover:bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-violet-200"
            title="Add Portfolio Content (Projects, Skills, etc.)"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {dynamicSections.map((sec, idx) => {
        const visible = isVisible(sec.id);
        const expanded = expandedSections.has(sec.id);
        const isSelected = selectedElement?.sectionId === sec.id && !selectedElement?.fieldPath?.includes('[');
        const items = sec.dataKey ? getSectionItems(portfolio, sec.dataKey) : [];
        const hasSubLayers = Boolean(sec.dataKey || (sec.fields && sec.fields.length > 0));
        const isDragging = draggedIdx === idx;
        const isDragOver = dragOverIdx === idx;

        return (
          <div
            key={sec.id}
            className={`flex flex-col transition-all ${
              isDragOver ? 'border-t-2 border-violet-500 pt-1' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
          >
            {/* Section Header Row */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                isDragging
                  ? 'opacity-40 bg-violet-100 border border-dashed border-violet-400 scale-[0.98]'
                  : isSelected
                  ? 'bg-violet-50 text-violet-700 font-bold border border-violet-200 shadow-2xs'
                  : visible
                  ? 'hover:bg-zinc-50 text-zinc-700 font-medium'
                  : 'opacity-40 hover:opacity-60 text-zinc-400'
              }`}
              onClick={() => handleSectionClick(sec.id, sec.label)}
            >
              <GripVertical className="w-3.5 h-3.5 text-zinc-400 group-hover:text-violet-600 cursor-grab active:cursor-grabbing transition-colors shrink-0" />

              {hasSubLayers ? (
                <button
                  type="button"
                  className="w-4 h-4 flex items-center justify-center text-zinc-400 hover:text-zinc-700 shrink-0 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); toggleExpand(sec.id); }}
                >
                  {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <div className="w-4 h-4 shrink-0" />
              )}

              <span className="shrink-0">{sec.icon}</span>
              <span className="flex-1 text-xs truncate">{sec.label}</span>

              {sec.dataKey && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  items.length > 0
                    ? 'bg-violet-100 text-violet-700 font-bold'
                    : 'bg-zinc-100 text-zinc-400 font-normal'
                }`}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              )}

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="p-1 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(sec.id); }}
                  title={visible ? 'Hide section' : 'Show section'}
                >
                  {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              </div>
            </div>

            {/* Expanded Child Layers */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-1 pl-8 pr-2 py-1">
                    {/* 1. Leaf Field Layers (Hero: Name, Bio, Image, etc.) */}
                    {sec.fields && sec.fields.map(field => {
                      const isFieldActive = selectedElement?.fieldPath === field.fieldPath ||
                        (field.id === 'about-bio' && (selectedElement?.fieldPath === 'about.description' || selectedElement?.fieldPath === 'profile.about' || selectedElement?.fieldPath === 'about.bio') && !selectedElement?.fieldPath?.startsWith('stats') && !selectedElement?.nodeId?.includes('card:')) ||
                        (field.id === 'about-headline' && (selectedElement?.fieldPath === 'about.headline' || selectedElement?.fieldPath === 'about.title')) ||
                        (field.id === 'about-stats' && (selectedElement?.fieldPath?.startsWith('stats') || selectedElement?.nodeId?.includes('about:card:') || selectedElement?.nodeId?.includes(':stat:'))) ||
                        (field.id === 'description' && (selectedElement?.fieldPath === 'hero.description' || selectedElement?.fieldPath === 'profile.about') && selectedElement?.sectionId === 'hero');
                      return (
                        <div
                          key={field.id}
                          onClick={() => handleFieldLayerClick(sec.id, field)}
                          className={`group/field flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                            isFieldActive
                              ? 'bg-violet-100 text-violet-900 font-bold border border-violet-300'
                              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                          }`}
                        >
                          <span className="shrink-0">{field.icon}</span>
                          <span className="truncate flex-1 text-[11px]">{field.label}</span>
                        </div>
                      );
                    })}

                    {/* 2. Collection Items (Projects, Experience, Education, etc.) */}
                    {sec.dataKey && items.map((item, itemIdx) => {
                      const itemLabel = sec.getItemLabel ? sec.getItemLabel(item, itemIdx) : `Item #${itemIdx + 1}`;
                      const itemId = typeof item === 'object' && item?.id ? item.id : undefined;
                      const isItemActive = selectedElement?.fieldPath === `${sec.dataKey}[${itemIdx}]` ||
                        (selectedElement?.sectionId === sec.id && selectedElement?.index === itemIdx) ||
                        (itemId && selectedElement?.id === itemId) ||
                        (selectedElement?.id === `item-${sec.dataKey}-${itemIdx}`);
                      const deletedNodes = (portfolio as any)?.deletedNodes || {};
                      const itemKey = `card:${sec.id}:${itemIdx}`;
                      const isItemHidden = deletedNodes[itemKey] === true || deletedNodes[`${sec.dataKey}[${itemIdx}]`] === true;

                      return (
                        <div
                          key={itemId || itemIdx}
                          className={`group/item flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                            isItemHidden
                              ? 'opacity-50 bg-zinc-100/60 italic text-zinc-500'
                              : isItemActive
                              ? 'bg-violet-100 text-violet-900 font-bold border border-violet-300'
                              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                          }`}
                          onClick={() => handleItemClick(sec.id, item, itemIdx, sec.dataKey!, itemLabel)}
                        >
                          <GripVertical className="w-3 h-3 text-zinc-300 opacity-0 group-hover/item:opacity-100 cursor-grab shrink-0" />
                          <div className={`w-1.5 h-1.5 rounded-full ${isItemHidden ? 'bg-amber-400' : 'bg-violet-400'} shrink-0`} />
                          <span className="truncate flex-1 text-[11px]">{itemLabel} {isItemHidden ? '(Hidden)' : ''}</span>
                          <button
                            type="button"
                            className="p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isItemHidden) {
                                const nextDeleted = { ...deletedNodes };
                                delete nextDeleted[itemKey];
                                delete nextDeleted[`${sec.dataKey}[${itemIdx}]`];
                                if (onFieldChange) onFieldChange('deletedNodes', nextDeleted);
                              } else {
                                handleDeleteItem(sec.dataKey!, itemIdx, itemId);
                              }
                            }}
                            title={isItemHidden ? 'Restore Item' : `Delete ${itemLabel}`}
                          >
                            {isItemHidden ? <EyeOff className="w-3 h-3 text-amber-500" /> : <Trash2 className="w-3 h-3" />}
                          </button>
                        </div>
                      );
                    })}

                    {sec.dataKey && (
                      <button
                        type="button"
                        onClick={() => handleAddItem(sec.dataKey!, sec.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 mt-0.5 rounded-lg text-[11px] font-bold text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add {sec.label.replace(/s$/, '').replace(/ & Tech| & Awards/, '')}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
