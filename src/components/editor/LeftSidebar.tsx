"use client";

/**
 * LeftSidebar — Portfolio Navigation, Layers & Template Switcher
 *
 * Icon strip (68px) + collapsible drawer (300px) for:
 *   Layers tab  → SectionTree (sections & items navigation)
 *   Design tab  → Template Switcher & theme options
 *   Publish tab → SEO & username settings
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers, Palette, Globe, Check, LayoutGrid, Type, RotateCcw, Plus, X, ExternalLink, Copy, CheckCheck,
  Pipette, Sliders, Search, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp, Link as LinkIcon, ShieldCheck, AlertTriangle, FileText, Lock
} from 'lucide-react';
import { PortfolioData, mockDb, mockAuth, checkTemplateAccess } from '../../utils/mockDb';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { resolveInstalledTemplateSync, resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';
import { getCanonicalTemplateId } from '../../utils/templateResolver';
import { useEditorContext } from '../../context/EditorContext';
import { normalizeUsername } from '../../utils/urlHelper';
import SectionTree from './SectionTree';
import CampusCvLogo from '../common/CampusCvLogo';
import CampusCvQrCode from '../common/CampusCvQrCode';
import { THEME_COLOR_PRESETS, GOOGLE_FONT_PRESETS, FontPreset, getGoogleFontUrl } from '../../utils/themeTypographyPresets';
import UpgradePlanModal from '../common/UpgradePlanModal';

type TabKey = 'layers' | 'design' | 'publish';

interface LeftSidebarProps {
  portfolio: PortfolioData;
  activePage: string;
  setActivePage: (p: string) => void;
  onPortfolioChange: (p: PortfolioData) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  schema?: any;
  onOpenAddModal?: () => void;
  onOpenResumeSync?: () => void;
}

export default function LeftSidebar({
  portfolio,
  onPortfolioChange,
  setSelectedElementId,
  onOpenAddModal,
  onOpenResumeSync,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  const tabBtn = (key: TabKey, icon: React.ReactNode, label: string) => (
    <button
      key={key}
      data-tour={`${key}-tab`}
      onClick={() => setActiveTab(prev => prev === key ? null : key)}
      title={label}
      className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${activeTab === key
          ? 'bg-[#f3f1ff] text-[#7448e8] border border-[#ddd6fe] shadow-xs font-bold'
          : 'text-[#666674] hover:text-[#1f1f26] hover:bg-[#f7f8fc]'
        }`}
    >
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-wide leading-none">{label}</span>
    </button>
  );

  return (
    <div data-tour="control-center" className="flex h-full bg-white shrink-0 z-30 relative select-none border-r border-[#e7e7ef]">

      {/* ── Icon strip ─────────────────────────────────────────────────────── */}
      <div className="w-[68px] bg-white flex flex-col items-center py-4 gap-2 z-40 shrink-0 border-r border-[#e7e7ef]">
        <div className="w-9 h-9 flex items-center justify-center mb-2 shrink-0">
          <CampusCvLogo className="w-8 h-8 object-contain" variant="icon" />
        </div>

        {tabBtn('layers', <Layers className="w-4 h-4" />, 'Layers')}
        {tabBtn('design', <Palette className="w-4 h-4" />, 'Templates')}

        {onOpenResumeSync && (
          <button
            onClick={onOpenResumeSync}
            title="Upload & Sync New Resume (PDF / DOCX)"
            className="w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer text-[#666674] hover:text-[#7448e8] hover:bg-[#f3f1ff] hover:border hover:border-[#ddd6fe]"
          >
            <FileText className="w-4 h-4 text-violet-600" />
            <span className="text-[8px] font-bold uppercase tracking-wide leading-none">Resume</span>
          </button>
        )}

        {tabBtn('publish', <Globe className="w-4 h-4" />, 'URL')}
      </div>

      {/* ── Drawer ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            key={activeTab}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            onUpdate={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('campuscv:layout-shift'));
              }
            }}
            onAnimationComplete={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('campuscv:layout-shift'));
                window.dispatchEvent(new Event('resize'));
              }
            }}
            className="h-full bg-white border-r border-zinc-100 overflow-hidden shrink-0 flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/50">
              <span className="text-xs font-bold text-zinc-900 capitalize flex items-center gap-1.5">
                {activeTab === 'layers' && <Layers className="w-3.5 h-3.5 text-violet-600" />}
                {activeTab === 'design' && <Palette className="w-3.5 h-3.5 text-violet-600" />}
                {activeTab === 'publish' && <Globe className="w-3.5 h-3.5 text-violet-600" />}
                {activeTab === 'design' ? 'Templates & Theme' : activeTab === 'publish' ? 'URL & Custom Domain' : activeTab}
              </span>

              <div className="flex items-center gap-1.5">
                {activeTab === 'layers' && onOpenAddModal && (
                  <button
                    onClick={onOpenAddModal}
                    className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    title="Add New Content Section or Item"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                  title="Close Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer content */}
            <div className="flex-grow overflow-y-auto">
              {activeTab === 'layers' && (
                <SectionTree
                  portfolio={portfolio}
                  onPortfolioChange={onPortfolioChange}
                  onOpenAddModal={onOpenAddModal}
                />
              )}

              {activeTab === 'design' && (
                <DesignPanel
                  portfolio={portfolio}
                  onPortfolioChange={onPortfolioChange}
                  setSelectedElementId={setSelectedElementId}
                />
              )}

              {activeTab === 'publish' && (
                <PublishPanel portfolio={portfolio} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Design Panel — Select Uploaded Admin Templates & Theme Options
// ─────────────────────────────────────────────────────────────────────────────

function DesignPanel({
  portfolio,
  onPortfolioChange,
  setSelectedElementId
}: {
  portfolio: PortfolioData;
  onPortfolioChange?: (p: PortfolioData) => void;
  setSelectedElementId?: (id: string | null) => void;
}) {
  const { onFieldChange, setSelectedElement, setSelectedNode } = useEditorContext();
  const pAny = portfolio as any;
  const currentTemplateId = portfolio.templateId || portfolio.layoutStyle || '';
  const currentPrimaryColor = pAny.userSelectedAccent || pAny.theme?.primaryColor || portfolio.themeColor || pAny.accentColor || '#8b5cf6';
  const currentFontFamily = pAny.userSelectedFont || pAny.typography?.fontFamily || portfolio.fontPack || 'Inter, sans-serif';
  const currentFontSize = Number(pAny.userSelectedFontSize || pAny.typography?.fontSize || portfolio.baseFontSize || 16);

  const [customHex, setCustomHex] = useState(currentPrimaryColor);
  const [fontSearch, setFontSearch] = useState('');
  const [selectedFontCategory, setSelectedFontCategory] = useState<string>('all');
  const [isFontsExpanded, setIsFontsExpanded] = useState<boolean>(false);

  // Keep customHex in sync
  useEffect(() => {
    if (currentPrimaryColor) {
      setCustomHex(currentPrimaryColor);
    }
  }, [currentPrimaryColor]);

  // Lazy-load Google Fonts stylesheet in editor window head ONLY when fonts panel is expanded
  useEffect(() => {
    if (!isFontsExpanded) return;
    const linkId = 'campuscv-sidebar-google-fonts-all';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      const queries = GOOGLE_FONT_PRESETS.map(f => f.googleQuery).join('&family=');
      link.href = `https://fonts.googleapis.com/css2?family=${queries}&display=swap`;
      document.head.appendChild(link);
    }
  }, [isFontsExpanded]);

  const [syncedTemplates, setSyncedTemplates] = useState<any[]>(() => {
    return adminTemplateDb.getActiveTemplates();
  });

  useEffect(() => {
    adminTemplateDb.syncWithServerRegistryAsync(false).then(list => {
      setSyncedTemplates(list.filter(t => (t.status || 'active') === 'active'));
    });
  }, []);

  // Filter templates: only free templates and purchased templates for the current user
  const [currentUser, setCurrentUser] = useState<any>(() => mockAuth.getCurrentUser());
  const [upgradeModal, setUpgradeModal] = useState<any | null>(null);

  const availableTemplates = useMemo(() => {
    const TIER_ORDER: Record<string, number> = { 'free': 0, 'trial': 1, 'monthly': 1, 'quarterly': 2, 'yearly': 3, 'pro': 3 };
    const currentTmplId = getCanonicalTemplateId(portfolio?.templateId || portfolio?.layoutStyle || '');

    // Deduplicate syncedTemplates by canonical ID and normalized name
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const uniqueTemplates: any[] = [];

    for (const t of syncedTemplates) {
      if ((t.status || 'active') !== 'active') continue;
      const canonicalId = getCanonicalTemplateId(t.id);
      const normalizedName = (t.name || '').toLowerCase().trim();

      if (seenIds.has(canonicalId) || (normalizedName && seenNames.has(normalizedName))) continue;
      seenIds.add(canonicalId);
      if (normalizedName) seenNames.add(normalizedName);

      uniqueTemplates.push({ ...t, id: canonicalId });
    }

    return uniqueTemplates
      .filter(t => {
        // If current portfolio is actively using this template, show it
        if (currentTmplId && t.id === currentTmplId) return true;
        // Only show templates that the user's purchased plan tier has access to
        const access = checkTemplateAccess(currentUser, t);
        return access.isAccessible;
      })
      .sort((a: any, b: any) => {
        const aRank = TIER_ORDER[(a.planTier || 'free').toLowerCase()] ?? 1;
        const bRank = TIER_ORDER[(b.planTier || 'free').toLowerCase()] ?? 1;
        return aRank - bRank;
      });
  }, [syncedTemplates, currentUser, portfolio?.templateId, portfolio?.layoutStyle]);

  useEffect(() => {
    setCurrentUser(mockAuth.getCurrentUser());
  }, []);

  const handleSelectTemplate = async (selectedTemplateId: string) => {
    if (!portfolio || !selectedTemplateId) return;

    const targetTemplate = availableTemplates.find(t => t.id === selectedTemplateId);
    const access = checkTemplateAccess(currentUser, targetTemplate);
    if (!access.isAccessible) {
      setUpgradeModal({
        isOpen: true,
        templateName: targetTemplate?.name || selectedTemplateId,
        requiredTier: access.requiredTier,
        reason: access.reason,
        planLimit: access.planLimit,
      });
      return;
    }

    const prevTemplateId = portfolio.templateId || portfolio.layoutStyle || '';
    if (prevTemplateId === selectedTemplateId) return;

    const currentTemplateState = (portfolio as any).templateState || {};
    const updatedTemplateState = {
      ...currentTemplateState,
      [prevTemplateId]: {
        styleOverrides: portfolio.styleOverrides || {},
        contentOverrides: portfolio.contentOverrides || {},
        imageOverrides: portfolio.imageOverrides || {},
        deletedNodes: portfolio.deletedNodes || {},
        sectionOrder: portfolio.sectionOrder || []
      }
    };

    const targetState = updatedTemplateState[selectedTemplateId] || {
      styleOverrides: {},
      contentOverrides: {},
      imageOverrides: {},
      deletedNodes: {},
      sectionOrder: []
    };

    const targetVersionId = targetTemplate?.currentVersionId || (targetTemplate as any)?.versionId;

    // Resolve full package files asynchronously (from API / cache / disk)
    const resolvedTmpl = await resolveInstalledTemplateAsync(selectedTemplateId, portfolio);

    const currentProfileImg =
      portfolio.profileImage ||
      portfolio.avatarUrl ||
      portfolio.about?.avatarUrl ||
      portfolio.hero?.avatarUrl ||
      (portfolio as any).personal?.profilePhoto;

    const sectionFiles = (resolvedTmpl.sectionFiles && Object.keys(resolvedTmpl.sectionFiles).length > 0)
      ? resolvedTmpl.sectionFiles
      : ((targetTemplate as any)?.sectionFiles && Object.keys((targetTemplate as any).sectionFiles).length > 0)
        ? (targetTemplate as any).sectionFiles
        : {};

    const nextPortfolio: PortfolioData = {
      ...portfolio,
      templateId: selectedTemplateId,
      templateVersionId: targetVersionId,
      layoutStyle: selectedTemplateId,
      templateType: 'uploaded',
      templateState: updatedTemplateState,
      styleOverrides: targetState.styleOverrides,
      contentOverrides: targetState.contentOverrides,
      imageOverrides: targetState.imageOverrides,
      deletedNodes: targetState.deletedNodes,
      sectionOrder: targetState.sectionOrder,
      profileImage: currentProfileImg || portfolio.profileImage,
      avatarUrl: currentProfileImg || portfolio.avatarUrl,
      about: portfolio.about ? {
        ...portfolio.about,
        avatarUrl: currentProfileImg || portfolio.about.avatarUrl
      } : {
        title: portfolio.name || 'About Me',
        description: portfolio.aboutMe || '',
        avatarUrl: currentProfileImg
      },
      hero: portfolio.hero ? {
        ...portfolio.hero,
        avatarUrl: currentProfileImg || portfolio.hero.avatarUrl
      } : {
        title: (portfolio as any).headline || portfolio.name || 'Welcome',
        subtitle: portfolio.role || '',
        description: portfolio.aboutMe || '',
        avatarUrl: currentProfileImg
      },
      sectionFiles,
      templateCode: resolvedTmpl.templateCode || (targetTemplate as any)?.templateCode || '',
      _sectionFilesTemplateId: selectedTemplateId,
      bindings: (targetTemplate as any)?.bindings || portfolio.bindings,
      schema: (targetTemplate as any)?.schema || portfolio.schema,
      assetMap: (targetTemplate as any)?.assetMap || portfolio.assetMap,
      customCSS: (targetTemplate as any)?.customCSS || portfolio.customCSS
    };

    if (setSelectedElement) setSelectedElement(null);
    if (setSelectedNode) setSelectedNode(null);
    if (setSelectedElementId) setSelectedElementId(null);

    if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', nextPortfolio);
    }

    if (onPortfolioChange) {
      onPortfolioChange(nextPortfolio);
    }
  };

  const handleColorApply = (hex: string) => {
    setCustomHex(hex);
    const updated: PortfolioData = {
      ...portfolio,
      theme: {
        ...(portfolio.theme || { primaryColor: hex }),
        primaryColor: hex,
      },
      themeColor: hex,
      userSelectedAccent: hex,
    } as any;
    if (onPortfolioChange) {
      onPortfolioChange(updated);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updated);
    }
  };

  const handleFontSelect = (font: FontPreset) => {
    const updated: PortfolioData = {
      ...portfolio,
      typography: {
        ...(portfolio.typography || { fontFamily: font.fontFamily }),
        fontFamily: font.fontFamily
      },
      fontPack: font.id,
      userSelectedFont: font.fontFamily
    } as any;
    if (onPortfolioChange) {
      onPortfolioChange(updated);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updated);
    }
  };

  const handleFontSizeChange = (size: number) => {
    const updated: PortfolioData = {
      ...portfolio,
      typography: {
        fontFamily: portfolio.typography?.fontFamily || 'Inter, sans-serif',
        ...(portfolio.typography || {}),
        fontSize: size
      },
      baseFontSize: size,
      userSelectedFontSize: size
    } as any;
    if (onPortfolioChange) {
      onPortfolioChange(updated);
    } else if (onFieldChange) {
      onFieldChange('_FULL_PORTFOLIO_UPDATE_', updated);
    }
  };

  // Filter fonts based on category and search query
  const filteredFonts = useMemo(() => {
    return GOOGLE_FONT_PRESETS.filter(f => {
      const matchCat = selectedFontCategory === 'all' || f.category.toLowerCase().includes(selectedFontCategory.toLowerCase());
      const matchSearch = fontSearch === '' ||
        f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
        f.description.toLowerCase().includes(fontSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedFontCategory, fontSearch]);

  const categories = [
    { id: 'all', label: 'All (25+)' },
    { id: 'Modern Sans', label: 'Modern Sans' },
    { id: 'Tech & Grotesk', label: 'Tech' },
    { id: 'Editorial Serif', label: 'Serif' },
    { id: 'Code Monospace', label: 'Code' },
    { id: 'Display & Creative', label: 'Display' }
  ];

  const currentFontName = GOOGLE_FONT_PRESETS.find(f => currentFontFamily.toLowerCase().includes(f.name.toLowerCase()))?.name || 'Inter';

  return (
    <div className="p-4 space-y-6">

      {/* 1. Theme Accent Color Palette & Custom Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Theme Accent Color
          </p>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-mono font-bold text-zinc-700">
            <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: currentPrimaryColor }} />
            <span>{currentPrimaryColor.toUpperCase()}</span>
          </div>
        </div>

        {/* Preset Colors Grid */}
        <div className="grid grid-cols-8 gap-2">
          {THEME_COLOR_PRESETS.map(c => {
            const isSelected = currentPrimaryColor.toLowerCase() === c.value.toLowerCase();
            return (
              <button
                key={c.value}
                onClick={() => handleColorApply(c.value)}
                className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-violet-600 shadow-sm' : 'hover:scale-105 border border-black/10'
                  }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
              </button>
            );
          })}
        </div>

        {/* Custom Color Eyedropper & Hex Input */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="relative flex items-center justify-center shrink-0">
            <input
              type="color"
              value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#8b5cf6'}
              onChange={(e) => handleColorApply(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              title="Open Color Palette"
            />
            <div
              className="w-8 h-8 rounded-lg border border-black/15 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: customHex }}
            >
              <Pipette className="w-4 h-4 text-white drop-shadow-md" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Custom Palette Hex</label>
            <input
              type="text"
              value={customHex}
              onChange={(e) => {
                const val = e.target.value;
                setCustomHex(val);
                if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                  handleColorApply(val);
                }
              }}
              placeholder="#8b5cf6"
              className="w-full text-xs font-mono font-bold bg-transparent text-zinc-900 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => handleColorApply(customHex.startsWith('#') ? customHex : `#${customHex}`)}
            className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold shadow-xs cursor-pointer shrink-0"
          >
            Apply
          </button>
        </div>
      </div>

      {/* 2. Global Template Font Size Scale */}
      <div className="pt-3 border-t border-zinc-100 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
            <span>Base Font Size</span>
          </p>
          <span className="px-2 py-0.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-mono font-bold">
            {currentFontSize}px
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={currentFontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
          />

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Compact', size: 14 },
              { label: 'Normal', size: 16 },
              { label: 'Medium', size: 18 },
              { label: 'Large', size: 20 }
            ].map(preset => {
              const isSelected = currentFontSize === preset.size;
              return (
                <button
                  key={preset.size}
                  onClick={() => handleFontSizeChange(preset.size)}
                  className={`py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${isSelected
                      ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                >
                  {preset.label} ({preset.size})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Global Template Typography (Click header to open/expand fonts) */}
      <div className="pt-3 border-t border-zinc-100 space-y-3">
        <button
          type="button"
          onClick={() => setIsFontsExpanded(prev => !prev)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-violet-600" />
            <div>
              <p className="text-[11px] font-bold text-zinc-900 leading-tight">Typography Fonts</p>
              <p className="text-[9px] text-zinc-500 font-medium">Click to select from 25+ styles</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-md border border-violet-200 truncate max-w-[100px]">
              {currentFontName}
            </span>
            {isFontsExpanded ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </div>
        </button>

        {/* Expandable Fonts Section */}
        {isFontsExpanded && (
          <div className="space-y-3 pt-1">
            {/* Font Search & Categories */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  placeholder="Search 25+ font styles..."
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => {
                  const isSelected = selectedFontCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedFontCategory(cat.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${isSelected
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 25+ Fonts Visual Cards List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredFonts.map(font => {
                const isSelected = currentFontFamily.toLowerCase().includes(font.name.toLowerCase()) ||
                  currentFontFamily.toLowerCase().includes(font.id.toLowerCase());

                return (
                  <div
                    key={font.id}
                    onClick={() => handleFontSelect(font)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                        ? 'border-violet-500 bg-violet-50/50 ring-1 ring-violet-500 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/75 bg-white'
                      }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-bold text-zinc-900 truncate"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.name}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-500 font-medium">
                          {font.category}
                        </span>
                      </div>
                      <p
                        className="text-[10px] text-zinc-500 line-clamp-1"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        Design &amp; Build Beautiful Portfolios
                      </p>
                    </div>

                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-200 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Active Portfolio Templates */}
      <div className="pt-3 border-t border-zinc-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Available Templates ({availableTemplates.length})
          </p>
        </div>

        <div className="space-y-2">
          {availableTemplates.map(tmpl => {
            const isSelected = currentTemplateId === tmpl.id;
            const access = checkTemplateAccess(currentUser, tmpl);
            const isLocked = !isSelected && !access.isAccessible;

            const rawTier = (tmpl.planTier || (tmpl.isPremium ? 'yearly' : 'monthly')).toLowerCase();
            const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                    ? 'border-violet-500 bg-violet-50/50 ring-1 ring-violet-500 shadow-xs'
                    : isLocked
                      ? 'border-zinc-200 bg-zinc-50/50 hover:border-amber-300 opacity-90'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/75 bg-white'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {tmpl.thumbnail ? (
                      <img src={tmpl.thumbnail} alt={tmpl.name} className={`w-full h-full object-cover ${isLocked ? 'grayscale-[30%]' : ''}`} />
                    ) : (
                      <LayoutGrid className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-zinc-900 truncate">{tmpl.name}</p>
                      <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${planTier === 'free'
                          ? 'bg-emerald-100 text-emerald-700'
                          : planTier === 'monthly'
                            ? 'bg-sky-100 text-sky-700'
                            : planTier === 'quarterly'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-violet-100 text-violet-700'
                        }`}>
                        {planTier}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{tmpl.category || 'Portfolio'}</p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isLocked ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[9px] font-bold shrink-0">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Lock</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {upgradeModal && (
        <UpgradePlanModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal(null)}
          templateName={upgradeModal.templateName}
          requiredTier={upgradeModal.requiredTier}
          reason={upgradeModal.reason}
          planLimit={upgradeModal.planLimit}
          onUpgradeSuccess={(upgradedPlan) => {
            setCurrentUser(mockAuth.getCurrentUser());
            alert(`🎉 Successfully upgraded to ${upgradedPlan.name}! You can now switch to this template.`);
          }}
        />
      )}

    </div>
  );
}

// Publish Panel — SEO, Custom Domain & Username Settings
// ─────────────────────────────────────────────────────────────────────────────

function PublishPanel({ portfolio }: { portfolio: PortfolioData }) {
  const { onFieldChange } = useEditorContext();
  const seo = (portfolio as any).seo ?? {};
  const [usernameInput, setUsernameInput] = useState(portfolio.username || '');
  const [customDomainInput, setCustomDomainInput] = useState(portfolio.customDomain || '');
  const [customDomainRecord, setCustomDomainRecord] = useState<any | null>(null);
  const [checking, setChecking] = useState(false);
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainFeedback, setDomainFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [availResult, setAvailResult] = useState<{ available?: boolean; message?: string; reason?: string } | null>(null);

  useEffect(() => {
    setUsernameInput(portfolio.username || '');
  }, [portfolio.username]);

  // Load custom domain mapping from API
  useEffect(() => {
    let mounted = true;
    if (portfolio?.id) {
      fetch(`/api/domains?portfolioId=${encodeURIComponent(portfolio.id)}`)
        .then(res => res.json())
        .then(data => {
          if (mounted && data?.success && data.domain) {
            setCustomDomainRecord(data.domain);
            setCustomDomainInput(data.domain.domain);
          }
        })
        .catch(() => { });
    }
    return () => {
      mounted = false;
    };
  }, [portfolio?.id]);

  const activeHost = typeof window !== 'undefined' ? window.location.host : 'portfolio.campuscv.com';

  // Resolve effective public link (prefers custom domain if active/set)
  const activeCustomDomain = customDomainRecord?.normalized_domain || portfolio.customDomain || '';
  const effectivePublicUrl = activeCustomDomain
    ? `https://${activeCustomDomain}`
    : (typeof window !== 'undefined'
      ? `${window.location.origin}/${usernameInput || portfolio.username}`
      : `https://portfolio.campuscv.com/${usernameInput || portfolio.username}`);

  const checkUsername = async (val: string) => {
    const clean = normalizeUsername(val);
    if (!clean || clean.length < 3) {
      setAvailResult(null);
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(clean)}&portfolioId=${encodeURIComponent(portfolio.id)}`);
      const data = await res.json();
      setAvailResult(data);
    } catch {
      setAvailResult(null);
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsernameInput(val);
    checkUsername(val);
  };

  const handleUsernameBlur = () => {
    const clean = normalizeUsername(usernameInput);
    if (clean && onFieldChange) {
      onFieldChange('username', clean);
    }
  };

  const handleConnectCustomDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomainInput.trim() || !portfolio.id) return;

    setDomainSaving(true);
    setDomainFeedback(null);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          domain: customDomainInput.trim(),
        }),
      });
      const data = await res.json();

      if (data.success && data.domain) {
        setCustomDomainRecord(data.domain);
        if (onFieldChange) {
          onFieldChange('customDomain', data.domain.normalized_domain);
        }
        setDomainFeedback({
          type: 'success',
          message: '✓ Custom domain connected! Verify DNS in dashboard.',
        });
      } else {
        setDomainFeedback({
          type: 'error',
          message: data.error || 'Failed to connect custom domain.',
        });
      }
    } catch (err: any) {
      setDomainFeedback({ type: 'error', message: err.message || 'Error saving domain.' });
    } finally {
      setDomainSaving(false);
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(effectivePublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-3">
          SEO, Domain &amp; Canonical URL
        </p>

        {/* 1. Public Username / Handle Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
              Public Username / Handle
            </label>
            <span className="text-[9px] font-mono text-zinc-400">/[username]</span>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 transition-all">
            <div className="px-3 py-1.5 bg-zinc-100/80 border-b border-zinc-200/60 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono font-medium truncate">
                {activeHost}/
              </span>
              <Globe className="w-3 h-3 text-zinc-400 shrink-0" />
            </div>
            <div className="px-3 py-2 flex items-center">
              <input
                value={usernameInput}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                className="w-full min-w-0 bg-transparent text-xs font-mono font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-400"
                placeholder="your-username"
              />
            </div>
          </div>

          {/* Real-time availability indicator */}
          {checking && (
            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
              Checking availability...
            </p>
          )}
          {!checking && availResult && (
            <p className={`text-[10px] font-medium ${availResult.available ? 'text-emerald-600' : 'text-red-500'}`}>
              {availResult.available ? `✓ ${availResult.message || 'Username available'}` : `✕ ${availResult.reason || 'Username taken'}`}
            </p>
          )}
        </div>

        {/* 2. Custom Domain Field */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-violet-600" />
              <span>Custom Domain</span>
            </label>
            {customDomainRecord?.status === 'active' || customDomainRecord?.status === 'verified' ? (
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Connected
              </span>
            ) : customDomainRecord?.status === 'pending' ? (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ⏳ DNS Pending
              </span>
            ) : null}
          </div>

          <form onSubmit={handleConnectCustomDomain} className="flex gap-1.5">
            <input
              type="text"
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              placeholder="e.g. johnkumar.com"
              className="flex-1 min-w-0 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-violet-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={domainSaving || !customDomainInput.trim()}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              {domainSaving ? 'Saving...' : 'Set'}
            </button>
          </form>

          {domainFeedback && (
            <p className={`text-[10px] font-medium ${domainFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
              {domainFeedback.message}
            </p>
          )}
        </div>

        {/* 3. Live Public URL Card & Action Buttons */}
        <div className="mt-3.5 p-3 rounded-xl bg-violet-50/60 border border-violet-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-900 uppercase tracking-wider">Live Public Link</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="p-2 rounded-lg bg-white border border-violet-200/80 text-[11px] font-mono text-violet-700 truncate font-semibold select-all">
            {effectivePublicUrl}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPublicUrl}
              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
            <a
              href={effectivePublicUrl}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 4. High-Resolution QR Code & Sharing */}
        <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-center">
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider text-left">
            Portfolio QR Code
          </p>
          <CampusCvQrCode
            username={usernameInput || portfolio.username}
            customDomain={activeCustomDomain}
            size={130}
            showActions={true}
            showUrlText={false}
          />
        </div>
      </div>

      {/* Page Title & Meta Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Page Title</label>
        <input
          defaultValue={seo.title ?? ''}
          onBlur={(e) => onFieldChange?.('seo.title', e.target.value)}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400 text-zinc-800"
          placeholder="My Portfolio"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Meta Description</label>
        <textarea
          rows={3}
          defaultValue={seo.description ?? ''}
          onBlur={(e) => onFieldChange?.('seo.description', e.target.value)}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-zinc-800"
          placeholder="A short description of your portfolio..."
        />
      </div>
    </div>
  );
}
