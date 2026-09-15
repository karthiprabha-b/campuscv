"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LayoutTemplate, Check, Palette, Type, Pipette,
  SlidersHorizontal, Search, Lock, Sparkles
} from 'lucide-react';
import { PortfolioData, mockAuth, checkTemplateAccess } from '../../utils/mockDb';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';
import { getCanonicalTemplateId } from '../../utils/templateResolver';
import { THEME_COLOR_PRESETS, GOOGLE_FONT_PRESETS, FontPreset } from '../../utils/themeTypographyPresets';
import UpgradePlanModal from '../common/UpgradePlanModal';

interface MobileTemplatesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  initialTab?: 'templates' | 'theme' | 'fonts';
}

function deduplicateTemplateList(list: any[]): any[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const unique: any[] = [];
  for (const t of list) {
    if ((t.status || 'active') !== 'active') continue;
    const canonicalId = getCanonicalTemplateId(t.id);
    const normName = (t.name || '').toLowerCase().trim();
    if (seenIds.has(canonicalId) || (normName && seenNames.has(normName))) continue;
    seenIds.add(canonicalId);
    if (normName) seenNames.add(normName);
    unique.push({ ...t, id: canonicalId });
  }
  return unique;
}

export default function MobileTemplatesSheet({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
  initialTab = 'theme',
}: MobileTemplatesSheetProps) {
  const [activeSubTab, setActiveSubTab] = useState<'theme' | 'fonts' | 'templates'>(initialTab);
  const [templates, setTemplates] = useState<any[]>(() => deduplicateTemplateList(adminTemplateDb.getActiveTemplates()));
  const [currentUser, setCurrentUser] = useState<any>(() => mockAuth.getCurrentUser());
  const [upgradeModal, setUpgradeModal] = useState<any | null>(null);

  const pAny = portfolio as any;
  const currentPrimaryColor = pAny?.userSelectedAccent || pAny?.theme?.primaryColor || portfolio?.themeColor || pAny?.accentColor || '#8b5cf6';
  const currentFontFamily = pAny?.userSelectedFont || pAny?.typography?.fontFamily || portfolio?.fontPack || 'Inter, sans-serif';
  const currentFontSize = Number(pAny?.userSelectedFontSize || pAny?.typography?.fontSize || portfolio?.baseFontSize || 16);

  const [customHex, setCustomHex] = useState(currentPrimaryColor);
  const [fontSearch, setFontSearch] = useState('');
  const [selectedFontCategory, setSelectedFontCategory] = useState<string>('all');

  useEffect(() => {
    if (currentPrimaryColor) {
      setCustomHex(currentPrimaryColor);
    }
  }, [currentPrimaryColor]);

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(mockAuth.getCurrentUser());
      adminTemplateDb.syncWithServerRegistryAsync(false).then(list => {
        setTemplates(deduplicateTemplateList(list));
      });

      // Lazy load google fonts
      const linkId = 'campuscv-mobile-google-fonts-all';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        const queries = GOOGLE_FONT_PRESETS.map(f => f.googleQuery).join('&family=');
        link.href = `https://fonts.googleapis.com/css2?family=${queries}&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTemplateId = portfolio?.templateId || portfolio?.layoutStyle || 'default';

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
    onPortfolioChange(updated);
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
    onPortfolioChange(updated);
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
    onPortfolioChange(updated);
  };

  const handleSelectTemplate = async (id: string) => {
    const targetTemplate = templates.find(t => t.id === id);
    const access = checkTemplateAccess(currentUser, targetTemplate);
    if (!access.isAccessible) {
      setUpgradeModal({
        isOpen: true,
        templateName: targetTemplate?.name || id,
        requiredTier: access.requiredTier,
        reason: access.reason,
        planLimit: access.planLimit,
      });
      return;
    }

    const resolvedTmpl = await resolveInstalledTemplateAsync(id, portfolio);
    const sectionFiles = (resolvedTmpl.sectionFiles && Object.keys(resolvedTmpl.sectionFiles).length > 0) ? resolvedTmpl.sectionFiles : portfolio.sectionFiles;
    onPortfolioChange({
      ...portfolio,
      templateId: id,
      layoutStyle: id,
      templateType: 'uploaded',
      sectionFiles,
      templateCode: resolvedTmpl.templateCode || portfolio.templateCode,
      _sectionFilesTemplateId: id,
      _lastUpdated: Date.now()
    });
    console.log('[TEMPLATE SELECTED]', id);
  };

  const filteredFonts = GOOGLE_FONT_PRESETS.filter(f => {
    const matchCat = selectedFontCategory === 'all' || f.category.toLowerCase().includes(selectedFontCategory.toLowerCase());
    const matchSearch = fontSearch === '' ||
      f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(fontSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const fontCategories = [
    { id: 'all', label: 'All (25+)' },
    { id: 'Modern Sans', label: 'Sans' },
    { id: 'Tech & Grotesk', label: 'Tech' },
    { id: 'Editorial Serif', label: 'Serif' },
    { id: 'Code Monospace', label: 'Code' },
    { id: 'Display & Creative', label: 'Display' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed inset-x-0 bottom-0 top-14 z-[500] bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col select-none md:hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-zinc-900 font-bricolage">Design & Styling</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented SubTabs */}
          <div className="flex items-center px-4 py-2 border-b border-zinc-100 bg-white shrink-0 gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSubTab('theme')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === 'theme'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Colors</span>
            </button>

            <button
              onClick={() => setActiveSubTab('fonts')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === 'fonts'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Fonts & Scale</span>
            </button>

            <button
              onClick={() => setActiveSubTab('templates')}
              className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSubTab === 'templates'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-5">
            {/* ── TAB 1: THEME COLORS ── */}
            {activeSubTab === 'theme' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">Accent Color</h4>
                    <p className="text-[11px] text-zinc-500">Pick a preset or enter a custom hex color</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-zinc-800">
                    <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: currentPrimaryColor }} />
                    <span>{currentPrimaryColor.toUpperCase()}</span>
                  </div>
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-6 xs:grid-cols-8 gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  {THEME_COLOR_PRESETS.map(c => {
                    const isSelected = currentPrimaryColor.toLowerCase() === c.value.toLowerCase();
                    return (
                      <button
                        key={c.value}
                        onClick={() => handleColorApply(c.value)}
                        className={`w-9 h-9 rounded-xl transition-all cursor-pointer flex items-center justify-center relative ${
                          isSelected ? 'scale-110 ring-2 ring-offset-2 ring-violet-600 shadow-md' : 'hover:scale-105 border border-black/10 shadow-xs'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="color"
                      value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#8b5cf6'}
                      onChange={(e) => handleColorApply(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      title="Open Color Palette"
                    />
                    <div
                      className="w-10 h-10 rounded-xl border border-black/15 shadow-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: customHex }}
                    >
                      <Pipette className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Custom Palette Hex</label>
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
                      className="w-full text-sm font-mono font-bold bg-transparent text-zinc-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleColorApply(customHex.startsWith('#') ? customHex : `#${customHex}`)}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: FONTS & SCALE ── */}
            {activeSubTab === 'fonts' && (
              <div className="space-y-5">
                {/* Font Size Scale */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
                      <span>Base Font Size Scale</span>
                    </p>
                    <span className="px-2.5 py-0.5 rounded-lg bg-violet-100 text-violet-800 text-xs font-mono font-bold">
                      {currentFontSize}px
                    </span>
                  </div>

                  <input
                    type="range"
                    min={12}
                    max={24}
                    step={1}
                    value={currentFontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
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
                          className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${isSelected
                              ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                            }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography Search & Filters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900">Typography Font Family</h4>
                    <span className="text-[11px] text-zinc-500 font-medium">25+ Styles</span>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      placeholder="Search fonts (e.g. Inter, Playfair, Outfit)..."
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {fontCategories.map(cat => {
                      const isSelected = selectedFontCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedFontCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isSelected
                              ? 'bg-zinc-900 text-white shadow-xs'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fonts List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {filteredFonts.map(font => {
                      const isSelected = currentFontFamily.toLowerCase().includes(font.name.toLowerCase()) ||
                        currentFontFamily.toLowerCase().includes(font.id.toLowerCase());

                      return (
                        <div
                          key={font.id}
                          onClick={() => handleFontSelect(font)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                              ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600 shadow-xs'
                              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/75 bg-white'
                            }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className="text-sm font-bold text-zinc-900 truncate"
                                style={{ fontFamily: font.fontFamily }}
                              >
                                {font.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium">
                                {font.category}
                              </span>
                            </div>
                            <p
                              className="text-xs text-zinc-500 line-clamp-1"
                              style={{ fontFamily: font.fontFamily }}
                            >
                              Design &amp; Build Beautiful Portfolios
                            </p>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: TEMPLATES ── */}
            {activeSubTab === 'templates' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates.filter((tpl: any) => {
                    if (tpl.id === currentTemplateId) return true;
                    const access = checkTemplateAccess(currentUser, tpl);
                    return access.isAccessible;
                  }).map((tpl: any) => {
                    const isActive = tpl.id === currentTemplateId;
                    const access = checkTemplateAccess(currentUser, tpl);
                    const isLocked = !isActive && !access.isAccessible;

                    const rawTier = (tpl.planTier || (tpl.isPremium ? 'yearly' : 'monthly')).toLowerCase();
                    const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isActive
                            ? 'border-violet-600 bg-violet-50/40 shadow-md'
                            : isLocked
                              ? 'border-zinc-200 bg-zinc-50/50 hover:border-amber-300'
                              : 'border-zinc-200 hover:border-violet-300 bg-white'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-zinc-900">{tpl.name}</h4>
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
                            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{tpl.description}</p>
                          </div>

                          {isActive ? (
                            <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : isLocked ? (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold shrink-0">
                              <Lock className="w-3 h-3" />
                              <span>Lock</span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 uppercase font-mono">
                          <span>{tpl.category}</span>
                          <span className={isLocked ? 'text-amber-600 font-bold' : 'text-violet-600 font-bold'}>
                            {isActive ? 'Active' : isLocked ? 'Upgrade Plan' : 'Apply'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
