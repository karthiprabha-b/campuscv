"use client";
// Force rebuild editor page

import React, { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, Plus, Lock, Sparkles } from 'lucide-react';
import { initializeMockDb, mockDb, mockAuth, PortfolioData, UserProfile } from '../../../utils/mockDb';
import { templateStorage } from '../../../utils/templateStorage';
import { supabase } from '../../../lib/supabase/client';
import { EditorProvider, useEditorContext } from '../../../context/EditorContext';
import { loadPortfolio, savePortfolio, publishPortfolio } from '../../../lib/portfolioStore';
import { getPublicPortfolioUrl, getPortfolioUrl } from '../../../utils/urlHelper';
import CampusCvQrCode from '../../../components/common/CampusCvQrCode';
import LeftSidebar from '../../../components/editor/LeftSidebar';
import ContextInspector from '../../../components/editor/ContextInspector';
import CanvasOverlayEngine from '../../../components/editor/CanvasOverlayEngine';
import EditorOverlay from '../../../components/editor/EditorOverlay';
import EditorDebugOverlay from '../../../components/editor/EditorDebugOverlay';
import ContextMenu from '../../../components/editor/ContextMenu';
import TopToolbar from '../../../components/editor/TopToolbar';
import PortfolioRenderer from '../../../components/templates/PortfolioRenderer';
import ViewportStage from '../../../components/editor/ViewportStage';
import ViewportIframeContainer from '../../../components/editor/ViewportIframeContainer';
import UniversalAddModal from '../../../components/editor/UniversalAddModal';
import MobileBottomNav from '../../../components/editor/MobileBottomNav';
import MobileInspectorSheet from '../../../components/editor/MobileInspectorSheet';
import MobileLayersSheet from '../../../components/editor/MobileLayersSheet';
import MobileTemplatesSheet from '../../../components/editor/MobileTemplatesSheet';
import MobileUrlSheet from '../../../components/editor/MobileUrlSheet';
import { sanitizePreviewDevice } from '../../../utils/responsiveRules';
import { EditorSchema } from '../../../types/schema';
import TemplateRuntime from '../../../templates/TemplateRuntime';
import GuidedTour from '../../../components/editor/GuidedTour';
import ResumeSyncModal from '../../../components/editor/ResumeSyncModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// setByPath — writes a value to a nested path in an object.
// e.g. setByPath(obj, 'theme.primaryColor', '#f00') → obj.theme.primaryColor = '#f00'
// e.g. setByPath(obj, 'projects[1].title', 'X')    → obj.projects[1].title = 'X'
// ─────────────────────────────────────────────────────────────────────────────

function setByPath(obj: any, path: string, value: any): void {
  if (!obj || !path) return;

  // Special-case root map prefixes (contentOverrides, styleOverrides, imageOverrides, deletedNodes)
  // so their sub-key is preserved as an exact dictionary key even if it contains dots or colons
  if (path.startsWith('contentOverrides.') || path.startsWith('styleOverrides.') || path.startsWith('imageOverrides.') || path.startsWith('deletedNodes.')) {
    const firstDotIdx = path.indexOf('.');
    const rootKey = path.slice(0, firstDotIdx);
    const subKey = path.slice(firstDotIdx + 1);
    if (!obj[rootKey] || typeof obj[rootKey] !== 'object') {
      obj[rootKey] = {};
    }
    obj[rootKey][subKey] = value;
    return;
  }

  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
  const parts = normalizedPath.split('.').filter(Boolean);
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isNextNumber = !isNaN(Number(nextKey));
    if (curr[key] === undefined || curr[key] === null || typeof curr[key] !== 'object') {
      curr[key] = isNextNumber ? [] : {};
    }
    curr = curr[key];
  }
  curr[parts[parts.length - 1]] = value;
}

// ─────────────────────────────────────────────────────────────────────────────
// EditorInner — the main editor, wrapped by EditorProvider
// ─────────────────────────────────────────────────────────────────────────────

function EditorInner({ id }: { id: string }) {
  const router = useRouter();

  // ── ONE Portfolio object — single source of truth ──────────────────────────
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [templateSchema, setTemplateSchema] = useState<EditorSchema | undefined>(undefined);
  const [activePage, setActivePage] = useState('Home');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResumeSyncOpen, setIsResumeSyncOpen] = useState(false);
  const [activeMobileSheet, setActiveMobileSheet] = useState<'none' | 'layers' | 'templates' | 'add' | 'inspector' | 'url'>('none');
  const [appScreenWidth, setAppScreenWidth] = useState<number>(1440);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setAppScreenWidth(w);
      setViewport(prev => sanitizePreviewDevice(prev, w));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Undo / Redo Single Document History Engine
  const historyPast = useRef<PortfolioData[]>([]);
  const historyFuture = useRef<PortfolioData[]>([]);
  // Stable ref to latest portfolio — used by undo/redo to avoid stale functional updater closures
  const portfolioRef = useRef<PortfolioData | null>(null);
  const lastSavedPortfolioRef = useRef<PortfolioData | null>(null);
  const historyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingHistoryBaseRef = useRef<PortfolioData | null>(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Save status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty' | 'error'>('saved');

  // Publish
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingInProgress, setPublishingInProgress] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guided Tour (Phase 25) — Only open when explicitly requested or triggered, not on auto-timer
  const [isTourOpen, setIsTourOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // EditorContext wiring
  const {
    setOnFieldChange,
    setPortfolioData,
    setIsEditMode: setCtxEditMode,
    selectedElement,
    setSelectedElement,
    selectedNode,
    setSelectedNode
  } = useEditorContext();

  // ── LOAD — read raw JSON from SQLite, populate editor with retry ────────────────────
  useEffect(() => {
    mockAuth.checkSubscriptionExpiry();
    let initialUser = mockAuth.getCurrentUser();
    setUser(initialUser);

    let mounted = true;

    // Sync live profile from Supabase
    const syncUserFromSupabase = async () => {
      try {
        const { data: { user: suUser } } = await supabase.auth.getUser();
        if (suUser) {
          const { data: profile } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', suUser.id)
            .maybeSingle();

          if (profile) {
            const isProFromDb = profile.is_pro ?? false;
            const updatedUser: UserProfile = {
              id: suUser.id,
              email: profile.email || suUser.email || initialUser?.email || '',
              name: profile.full_name || suUser.user_metadata?.full_name || initialUser?.name || 'User',
              isPro: isProFromDb,
              planType: profile.plan_type || (isProFromDb ? '30-days' : 'free'),
              subscriptionExpires: profile.subscription_expires_at || undefined,
              storageLimitMB: profile.storage_limit_mb || 500,
            };
            localStorage.setItem('portly_current_user', JSON.stringify(updatedUser));
            if (mounted) {
              setUser(updatedUser);
            }
          }
        }
      } catch (err) {
        console.warn('[Editor syncUserFromSupabase error]', err);
      }
    };
    syncUserFromSupabase();

    const fetchPortfolio = async () => {
      try {
        const saved = await loadPortfolio(id);

        if (!mounted) return;

        if (!saved) {
          console.error('[Editor] Portfolio not found:', id);
          return;
        }
      console.log('[Editor] PORTFOLIO ID:', saved.id);
      console.log('[Editor] LOADED PORTFOLIO:', saved);
      console.log('[Editor] EXPERIENCE:', saved.experience);
      console.log('[Editor] EDUCATION:', saved.education);
      console.log('[Editor] PROJECTS:', saved.projects);
      console.log('[Editor] SKILLS:', saved.skills);

      console.log('[CV DEBUG][STAGE C: EDITOR PAGE LOAD]', {
        stage: 'EDITOR PAGE LOAD',
        editorId: id,
        portfolioId: saved.id,
        templateId: saved.templateId || saved.layoutStyle,
        mode: 'editor',
        name: saved.name || saved.personal?.fullName,
        profileImage: saved.profileImage,
        email: saved.email || saved.personal?.email,
        linkedin: saved.socials?.linkedin || saved.socialLinks?.linkedin,
        experienceCount: Array.isArray(saved.experience) ? saved.experience.length : undefined,
        educationCount: Array.isArray(saved.education) ? saved.education.length : undefined,
        projectsCount: Array.isArray(saved.projects) ? saved.projects.length : (saved.projects === undefined ? 'undefined' : 0),
        timestamp: new Date().toISOString()
      });

      // Clean expired blob URLs before loading
      const fallback = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      if (saved.about?.avatarUrl?.startsWith('blob:')) saved.about.avatarUrl = fallback;
      if (typeof saved.profileImage === 'string' && saved.profileImage.startsWith('blob:')) saved.profileImage = fallback;

      // Load portfolio as-is — exactly what was saved in SQLite
      setPortfolio(saved);
      (window as any).__editorState = { portfolio: saved };
      lastSavedPortfolioRef.current = JSON.parse(JSON.stringify(saved));
      historyPast.current = [];
      historyFuture.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setSaveStatus('saved');

      [50, 150, 400, 800].forEach((delay) => {
        setTimeout(() => {
          if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
          if (canvasRef.current) canvasRef.current.scrollTop = 0;
        }, delay);
      });
      } catch (err) {
        console.error('[Editor] Error loading portfolio:', err);
      }
    };

    fetchPortfolio();
    return () => { mounted = false; };
  }, [id]);

  const getPortfolioSignature = (p: any): string => {
    if (!p) return '';
    const copy = { ...p };
    delete copy.lastSaved;
    delete copy._lastUpdated;
    delete copy.updatedAt;
    delete copy.sectionFiles;
    return JSON.stringify(copy);
  };

  // Sync EditorContext with portfolio & check unsaved status
  useEffect(() => {
    if (portfolio) {
      portfolioRef.current = portfolio; // keep stable ref always current
      setPortfolioData(portfolio);
      if (lastSavedPortfolioRef.current) {
        const isDirty = getPortfolioSignature(portfolio) !== getPortfolioSignature(lastSavedPortfolioRef.current);
        setSaveStatus(isDirty ? 'dirty' : 'saved');
      }
    }
  }, [portfolio, setPortfolioData]);

  const sanitizePortfolioForSave = (p: any): any => {
    if (!p) return p;
    const copy = { ...p };
    if (copy.templateId && copy.templateId !== 'custom') {
      delete copy.sectionFiles;
    }
    return copy;
  };

  // ── DEBOUNCED AUTO-SAVE ENGINE (Phase 23) ──────────────────────────────────
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (saveStatus !== 'dirty' || !portfolio) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      const current = portfolioRef.current;
      if (!current) return;
      setSaveStatus('saving');
      try {
        const toSave = sanitizePortfolioForSave(current);
        await savePortfolio(toSave);
        lastSavedPortfolioRef.current = JSON.parse(JSON.stringify(current));
        setSaveStatus('saved');
      } catch (err) {
        console.error('[Editor Auto-Save error]', err);
        setSaveStatus('error');
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [saveStatus, portfolio]);

  // Sync EditorContext edit mode
  useEffect(() => {
    setCtxEditMode(isEditMode);
  }, [isEditMode, setCtxEditMode]);

  // Ensure active page stays valid
  useEffect(() => {
    if (!portfolio) return;
    const enabled = portfolio.enabledPages || ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'];
    if (!enabled.includes(activePage)) {
      setActivePage(enabled.includes('Home') ? 'Home' : enabled[0] || 'Home');
    }
  }, [portfolio, activePage]);

  // Global blob URL recovery
  useEffect(() => {
    const handleImgError = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target?.tagName === 'IMG' && target.src?.startsWith('blob:')) {
        const fallback = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        target.src = fallback;
        setPortfolio((prev) => {
          if (!prev) return prev;
          const updated = JSON.parse(JSON.stringify(prev)) as any;
          if (updated.about) updated.about.avatarUrl = fallback;
          updated.profileImage = fallback;
          return updated;
        });
      }
    };
    window.addEventListener('error', handleImgError, true);
    return () => window.removeEventListener('error', handleImgError, true);
  }, []);

  // ── HISTORY COMMIT HELPER ────────────────────────────────────────────────
  const commitToHistory = useCallback((baseState: PortfolioData) => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }
    const cloned = JSON.parse(JSON.stringify(baseState));
    const lastEntry = historyPast.current[historyPast.current.length - 1];
    if (!lastEntry || JSON.stringify(lastEntry) !== JSON.stringify(cloned)) {
      historyPast.current = [...historyPast.current.slice(-49), cloned];
      historyFuture.current = [];
      setCanUndo(true);
      setCanRedo(false);
    }
    pendingHistoryBaseRef.current = null;
  }, []);

  // ── PORTFOLIO CHANGE — single transaction pipeline ───────────────────────
  const handlePortfolioChange = useCallback((updated: PortfolioData, options: { immediate?: boolean } = {}) => {
    if (mockAuth.getCurrentUser()?.planType === 'expired') {
      alert('Editing disabled — subscription expired. Renew in Dashboard.');
      return;
    }
    setSaveStatus('dirty');
    setPortfolio(prev => {
      if (prev) {
        // If template ID changed explicitly via template switcher, reset history stack
        const prevTpl = (prev.templateId || prev.layoutStyle || '').toLowerCase().trim();
        const nextTpl = (updated.templateId || updated.layoutStyle || '').toLowerCase().trim();
        if (options.immediate && prevTpl && nextTpl && prevTpl !== nextTpl) {
          if (historyTimerRef.current) {
            clearTimeout(historyTimerRef.current);
            historyTimerRef.current = null;
          }
          pendingHistoryBaseRef.current = null;
          historyPast.current = [];
          historyFuture.current = [];
          setCanUndo(false);
          setCanRedo(false);
        } else if (options.immediate) {
          commitToHistory(pendingHistoryBaseRef.current || prev);
        } else {
          if (!pendingHistoryBaseRef.current) {
            pendingHistoryBaseRef.current = JSON.parse(JSON.stringify(prev));
          }
          if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
          historyTimerRef.current = setTimeout(() => {
            if (pendingHistoryBaseRef.current) {
              commitToHistory(pendingHistoryBaseRef.current);
            }
          }, 400);
        }
      }
      return updated;
    });
  }, [commitToHistory]);

  // ── FIELD CHANGE — the SINGLE write path for all edits ──────────────────
  const handleFieldChange = useCallback((fieldPath: string, value: any) => {
    if (!portfolioRef.current) return;
    if (mockAuth.getCurrentUser()?.planType === 'expired') {
      alert('Editing disabled — subscription expired. Renew in Dashboard.');
      return;
    }

    if (fieldPath === '_FULL_PORTFOLIO_UPDATE_') {
      handlePortfolioChange(value, { immediate: true });
      return;
    }

    setSaveStatus('dirty');

    setPortfolio((prev) => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev)) as any;
      updated._lastUpdated = Date.now();

      // Write value to the exact path given
      setByPath(updated, fieldPath, value);

      // Auto-sync canonicalProfile and root fields for collection edits
      const collectionKeys = ['education', 'experience', 'timeline', 'work', 'workExperience', 'projects', 'skills', 'certifications', 'certificates', 'awards', 'services', 'testimonials'];
      collectionKeys.forEach(col => {
        if (fieldPath === col || fieldPath.startsWith(`${col}.`) || fieldPath.startsWith(`${col}[`)) {
          // If experience or timeline is edited, mirror to both
          if (col === 'experience' || col === 'timeline' || col === 'work' || col === 'workExperience') {
            const expList = updated[col] || updated.experience || updated.timeline || [];
            updated.experience = expList;
            updated.timeline = expList;
            updated.work = expList;
            updated.workExperience = expList;
            if (updated.canonicalProfile && typeof updated.canonicalProfile === 'object') {
              updated.canonicalProfile.experience = expList;
            }
            if (updated.data && typeof updated.data === 'object') {
              updated.data.experience = expList;
              updated.data.timeline = expList;
            }
          } else if (col === 'certifications' || col === 'certificates' || col === 'awards') {
            const certList = updated[col] || updated.certifications || updated.certificates || updated.awards || [];
            updated.certifications = certList;
            updated.certificates = certList;
            updated.awards = certList;
            if (updated.canonicalProfile && typeof updated.canonicalProfile === 'object') {
              updated.canonicalProfile.certifications = certList;
            }
            if (updated.data && typeof updated.data === 'object') {
              updated.data.certifications = certList;
            }
          } else {
            if (updated.canonicalProfile && typeof updated.canonicalProfile === 'object') {
              updated.canonicalProfile[col] = updated[col];
            }
            if (updated.data && typeof updated.data === 'object') {
              updated.data[col] = updated[col];
            }
          }
        }
      });

      // Auto-sync profileImage field when any hero/about/profile image node is edited or uploaded
      const imgSrc = typeof value === 'object' && value !== null ? (value.src || value.url || value.value) : (typeof value === 'string' ? value : null);
      const isProfileImageKey =
        fieldPath.includes('image:hero') ||
        fieldPath.includes('image:about') ||
        fieldPath.includes('profile') ||
        fieldPath.includes('avatar') ||
        fieldPath.includes('portrait') ||
        fieldPath === 'profileImage' ||
        fieldPath === 'avatarUrl' ||
        fieldPath === 'about.avatarUrl' ||
        fieldPath === 'about.image' ||
        fieldPath === 'hero.avatarUrl' ||
        fieldPath === 'hero.profileImage';

      if (imgSrc && isProfileImageKey) {
        updated.profileImage = imgSrc;
        updated.avatarUrl = imgSrc;
        if (!updated.about || typeof updated.about !== 'object') updated.about = {};
        updated.about.avatarUrl = imgSrc;
        updated.about.image = imgSrc;
        if (!updated.hero || typeof updated.hero !== 'object') updated.hero = {};
        updated.hero.avatarUrl = imgSrc;
        updated.hero.profileImage = imgSrc;
        if (updated.profile) {
          updated.profile.photo = imgSrc;
          updated.profile.avatarUrl = imgSrc;
        }
        if (updated.personal) {
          updated.personal.profilePhoto = imgSrc;
          updated.personal.avatarUrl = imgSrc;
        }
      }

      const isImmediate = fieldPath.startsWith('deletedNodes') || fieldPath.includes('delete') || fieldPath.includes('src') || fieldPath.includes('url') || fieldPath === 'sectionOrder' || fieldPath === 'templateId';
      if (isImmediate) {
        commitToHistory(pendingHistoryBaseRef.current || prev);
      } else {
        if (!pendingHistoryBaseRef.current) {
          pendingHistoryBaseRef.current = JSON.parse(JSON.stringify(prev));
        }
        if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
        historyTimerRef.current = setTimeout(() => {
          if (pendingHistoryBaseRef.current) {
            commitToHistory(pendingHistoryBaseRef.current);
          }
        }, 400);
      }

      portfolioRef.current = updated;
      return updated;
    });
  }, [commitToHistory, handlePortfolioChange]);

  // Register field change handler in EditorContext & window
  useEffect(() => {
    setOnFieldChange(handleFieldChange);
    (window as any).__editorState = {
      portfolio,
      onFieldChange: handleFieldChange,
      handleUndo,
      handleRedo,
      getHistoryDebug: () => ({
        pastLen: historyPast.current.length,
        futureLen: historyFuture.current.length,
        pastItem0Override: historyPast.current[0]?.contentOverrides?.['text:hero:card:1:h1:0'],
        futureItem0Override: historyFuture.current[0]?.contentOverrides?.['text:hero:card:1:h1:0'],
      }),
    };
  }, [handleFieldChange, setOnFieldChange, portfolio]);


  // ── UNDO / REDO ──────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }
    if (pendingHistoryBaseRef.current) {
      const base = pendingHistoryBaseRef.current;
      pendingHistoryBaseRef.current = null;
      const lastEntry = historyPast.current[historyPast.current.length - 1];
      if (!lastEntry || JSON.stringify(lastEntry) !== JSON.stringify(base)) {
        historyPast.current = [...historyPast.current.slice(-49), base];
      }
    }

    if (!historyPast.current.length) return;
    setSaveStatus('dirty');
    // Read current portfolio via stable ref (avoids functional-updater same-reference bail-out)
    const current = portfolioRef.current;
    if (!current) return;
    const past = [...historyPast.current];
    if (past.length === 0) return;
    const previous = past.pop()!;
    historyPast.current = past;
    // Deep-clone current before storing in future so future ref holds an independent snapshot
    historyFuture.current = [JSON.parse(JSON.stringify(current)), ...historyFuture.current.slice(0, 49)];
    setCanUndo(past.length > 0);
    setCanRedo(true);

    // CRITICAL: Always preserve active template identity and sectionFiles so undo never breaks or switches templates
    const activeTemplateId = current.templateId || current.layoutStyle;
    const targetState: PortfolioData = {
      ...(JSON.parse(JSON.stringify(previous)) as PortfolioData),
      templateId: activeTemplateId || previous.templateId,
      templateVersionId: current.templateVersionId || previous.templateVersionId,
      layoutStyle: current.layoutStyle || previous.layoutStyle,
      templateType: current.templateType || previous.templateType,
      sectionFiles: current.sectionFiles || previous.sectionFiles,
      templateCode: current.templateCode || previous.templateCode,
      _sectionFilesTemplateId: current._sectionFilesTemplateId || previous._sectionFilesTemplateId,
      bindings: current.bindings || previous.bindings,
      schema: current.schema || previous.schema,
      assetMap: current.assetMap || previous.assetMap,
      customCSS: current.customCSS || previous.customCSS,
    };

    portfolioRef.current = targetState;
    pendingHistoryBaseRef.current = null;
    // Deep-clone the target state to guarantee a new reference React will always re-render
    setPortfolio(JSON.parse(JSON.stringify(targetState)) as PortfolioData);
  }, []);

  const handleRedo = useCallback(() => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }
    if (pendingHistoryBaseRef.current) {
      const base = pendingHistoryBaseRef.current;
      pendingHistoryBaseRef.current = null;
      const lastEntry = historyPast.current[historyPast.current.length - 1];
      if (!lastEntry || JSON.stringify(lastEntry) !== JSON.stringify(base)) {
        historyPast.current = [...historyPast.current.slice(-49), base];
      }
    }
    if (!historyFuture.current.length) return;
    setSaveStatus('dirty');
    // Read current portfolio via stable ref (avoids functional-updater same-reference bail-out)
    const current = portfolioRef.current;
    if (!current) return;
    const future = [...historyFuture.current];
    if (future.length === 0) return;
    const next = future.shift()!;
    historyFuture.current = future;
    // Deep-clone current before storing in past so past ref holds an independent snapshot
    historyPast.current = [...historyPast.current.slice(-49), JSON.parse(JSON.stringify(current))];
    setCanUndo(true);
    setCanRedo(future.length > 0);

    // CRITICAL: Always preserve active template identity and sectionFiles so redo never breaks or switches templates
    const activeTemplateId = current.templateId || current.layoutStyle;
    const targetState: PortfolioData = {
      ...(JSON.parse(JSON.stringify(next)) as PortfolioData),
      templateId: activeTemplateId || next.templateId,
      templateVersionId: current.templateVersionId || next.templateVersionId,
      layoutStyle: current.layoutStyle || next.layoutStyle,
      templateType: current.templateType || next.templateType,
      sectionFiles: current.sectionFiles || next.sectionFiles,
      templateCode: current.templateCode || next.templateCode,
      _sectionFilesTemplateId: current._sectionFilesTemplateId || next._sectionFilesTemplateId,
      bindings: current.bindings || next.bindings,
      schema: current.schema || next.schema,
      assetMap: current.assetMap || next.assetMap,
      customCSS: current.customCSS || next.customCSS,
    };

    portfolioRef.current = targetState;
    pendingHistoryBaseRef.current = null;
    // Deep-clone the target state to guarantee a new reference React will always re-render
    setPortfolio(JSON.parse(JSON.stringify(targetState)) as PortfolioData);
  }, []);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable);
      if (isInput) return;

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') || (cmdOrCtrl && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // ── DUPLICATE / DELETE SELECTED ELEMENT ────────────────────────────────
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedElement || !portfolio) return;
    const parts = selectedElement.fieldPath.match(/^(\w+)\[(\d+)\]/);
    if (!parts) return;
    const [, arrayKey, idxStr] = parts;
    const idx = parseInt(idxStr);
    const arr = (portfolio as any)[arrayKey];
    if (!Array.isArray(arr)) return;
    const next = [...arr];
    const cloned = typeof next[idx] === 'object' ? { ...next[idx], id: `item-${Date.now()}` } : `${next[idx]} (Copy)`;
    next.splice(idx + 1, 0, cloned);
    handleFieldChange(arrayKey, next);
  }, [selectedElement, portfolio, handleFieldChange]);

  const handleDeleteSelected = useCallback(() => {
    if (!portfolio) return;

    let targetNodeId: string | null = null;
    if (selectedNode?.nodeId) {
      targetNodeId = selectedNode.nodeId;
    } else if (selectedElement?.nodeId) {
      targetNodeId = selectedElement.nodeId;
    } else if (selectedElement?.el) {
      targetNodeId = selectedElement.el.getAttribute('data-node-id');
    }

    const updated = JSON.parse(JSON.stringify(portfolio)) as any;
    updated.deletedNodes = updated.deletedNodes || {};

    if (targetNodeId) {
      updated.deletedNodes[targetNodeId] = true;
    }

    // Only delete from collection array if the selected item itself is an entire card, NOT an inner text element or tag!
    const isWholeCard = selectedElement?.elementType === 'card' &&
      !targetNodeId?.includes(':text:') &&
      !targetNodeId?.includes(':span:') &&
      !targetNodeId?.includes(':h') &&
      !targetNodeId?.includes(':p:') &&
      !targetNodeId?.includes(':tag:');

    if (isWholeCard && selectedElement) {
      const parts = selectedElement.fieldPath?.match(/^(\w+)\[(\d+)\]$/);
      if (parts) {
        const [, arrayKey, idxStr] = parts;
        const idx = parseInt(idxStr);
        const arr = updated[arrayKey];
        if (Array.isArray(arr)) {
          updated[arrayKey] = arr.filter((_: any, i: number) => i !== idx);
        }
      }
    }

    setSelectedElement(null);
    setSelectedNode(null);
    setSelectedElementId(null);

    handlePortfolioChange(updated, { immediate: true });
  }, [selectedNode, selectedElement, portfolio, handlePortfolioChange, setSelectedElement, setSelectedNode]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = !!(activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable ||
        activeEl.getAttribute('contenteditable') === 'true'
      ));

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (!isTyping && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if (!isTyping && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedNode || selectedElement) {
          e.preventDefault();
          handleDeleteSelected();
        }
      } else if (e.key === 'Escape') {
        setSelectedElementId(null);
        setSelectedElement(null);
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleUndo, handleRedo, handleDuplicateSelected, handleDeleteSelected, selectedNode, selectedElement, setSelectedElement, setSelectedNode]);

  // ── SAVE — serialize ONE Portfolio JSON → write to SQLite ───────────────
  const handleSave = useCallback(async () => {
    if (!portfolio) return;
    if (pendingHistoryBaseRef.current) {
      commitToHistory(pendingHistoryBaseRef.current);
    }
    setSaveStatus('saving');
    try {
      const toSave = sanitizePortfolioForSave(portfolio);
      await savePortfolio(toSave);
      lastSavedPortfolioRef.current = JSON.parse(JSON.stringify(portfolio));
      setSaveStatus('saved');
      setToastMessage('Saved successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('[Editor] Save failed:', err);
      setSaveStatus('dirty');
      setToastMessage('Save failed');
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, [portfolio, commitToHistory]);

  // ── PUBLISH — save first, load from SQLite, publish from SQLite ──────────
  const handlePublish = async () => {
    if (!portfolio) return;
    if (pendingHistoryBaseRef.current) {
      commitToHistory(pendingHistoryBaseRef.current);
    }
    setPublishingInProgress(true);
    try {
      // 1. FIRST save current editor state to SQLite
      const toSave = sanitizePortfolioForSave(portfolio);
      const saved = await savePortfolio(toSave);
      lastSavedPortfolioRef.current = JSON.parse(JSON.stringify(portfolio));

      // 2. Load latest persisted record from SQLite
      const latest = await loadPortfolio(portfolio.id);

      // 3. Publish reads latest persisted draft
      const publishedPort = await publishPortfolio(saved || latest || portfolio);

      if (publishedPort) {
        setPortfolio(prev => prev ? { ...prev, lastPublished: publishedPort.lastPublished } : prev);
      }

      setSaveStatus('saved');
      setTimeout(() => {
        setPublishingInProgress(false);
        setShowPublishModal(true);
      }, 1200);
    } catch (e) {
      console.error('[Editor] Publish failed:', e);
      setPublishingInProgress(false);
      setToastMessage('Publish failed');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile': return 'w-[390px]';
      case 'tablet': return 'w-[768px]';
      default: return 'w-[1440px]';
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(Math.round((z + 0.1) * 10) / 10, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(Math.round((z - 0.1) * 10) / 10, 0.5));
  const handleZoomReset = () => setZoom(1);
  const handleZoomSet = (val: number) => setZoom(val);
  const handleFitToScreen = () => {
    const layoutW = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : 1440;
    const availableW = appScreenWidth - 40;
    const ratio = availableW / layoutW;
    const fitZoom = Math.min(Math.max(Math.round(ratio * 20) / 20, 0.5), 1.5);
    setZoom(fitZoom);
  };

  const editorIsMobile = appScreenWidth < 768;
  const editorIsTablet = appScreenWidth >= 768 && appScreenWidth < 1024;
  const editorIsDesktop = appScreenWidth >= 1024;

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f7f8fc] flex flex-col overflow-hidden font-sans select-none">

      {/* Subscription banner */}
      {user && !user.isPro && (
        <div className={`text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 shrink-0 z-50 ${
          user.subscriptionExpires ? 'bg-red-600/90 animate-pulse' : 'bg-violet-700'
        }`}>
          <span>{user.subscriptionExpires ? 'Editing & Publishing Disabled — Subscription expired.' : 'Plan Required — Choose a plan to unlock live portfolio publishing.'}</span>
          <a href="/dashboard" className="underline hover:opacity-80 font-extrabold">{user.subscriptionExpires ? 'Renew Now' : 'Buy a Plan'}</a>
        </div>
      )}

      {/* TOP — TopToolbar (Editor chrome header) */}
      <TopToolbar
        portfolioName={portfolio.meta?.portfolioTitle || (portfolio as any).title || 'Portfolio Project'}
        portfolioCategory={(portfolio as any).category}
        saveStatus={saveStatus}
        viewport={viewport}
        setViewport={setViewport}
        isEditMode={isEditMode}
        toggleEditMode={() => setIsEditMode(v => !v)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onZoomSet={handleZoomSet}
        onFitToScreen={handleFitToScreen}
        onPublish={handlePublish}
        publishingInProgress={publishingInProgress}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenUrlSheet={() => setActiveMobileSheet(s => s === 'url' ? 'none' : 'url')}
        onOpenResumeSync={() => setIsResumeSyncOpen(true)}
        onSave={handleSave}
        onStartTour={() => setIsTourOpen(true)}
        editorWidth={appScreenWidth}
      />

      {/* MIDDLE — Sidebar + Canvas + Inspector */}
      <div className="flex-grow flex overflow-hidden relative">

        {/* Left sidebar — rendered for Desktop & Tablet editor viewports */}
        {!editorIsMobile && (
          <LeftSidebar
            portfolio={portfolio}
            activePage={activePage}
            setActivePage={setActivePage}
            onPortfolioChange={handlePortfolioChange}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            schema={templateSchema}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenResumeSync={() => setIsResumeSyncOpen(true)}
          />
        )}

        {/* Canvas column */}
        <div ref={scrollContainerRef} data-tour="canvas-stage" className="flex-grow flex flex-col relative overflow-y-auto overflow-x-hidden p-0 sm:p-4 lg:p-8 items-center bg-[#0f0f11]">
          <ViewportStage viewport={viewport} zoom={zoom} editorWidth={appScreenWidth}>
            {({ layoutWidth }) => {
              const activeTmplId = portfolio?.templateId || portfolio?.layoutStyle || 'default';
              const activeVerId = (portfolio as any)?.templateVersionId;
              return (
                <div
                  ref={canvasRef}
                  data-canvas="true"
                  className="w-full transition-all duration-300 relative bg-transparent"
                  onClick={(e) => { if (e.target === e.currentTarget) { setSelectedElementId(null); setSelectedElement(null); } }}
                >
                  <CanvasOverlayEngine canvasRef={canvasRef}>
                    <TemplateRuntime
                      key={`${activeTmplId}-${activeVerId || 'latest'}`}
                      templateId={activeTmplId}
                      versionId={activeVerId}
                      data={portfolio}
                      mode={isEditMode ? 'editor' : 'preview'}
                      activePage={activePage}
                      onFieldChange={handleFieldChange}
                      selectedElementId={selectedElementId}
                      setSelectedElementId={setSelectedElementId}
                      viewport={viewport}
                      onSchemaLoaded={setTemplateSchema}
                    />
                    {isEditMode && <EditorOverlay canvasRef={canvasRef} />}
                  </CanvasOverlayEngine>
                </div>
              );
            }}
          </ViewportStage>

          {/* Floating Bottom "+ Add Element / Collection" Button for Desktop & Tablet */}
          {!editorIsMobile && isEditMode && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
              <button
                type="button"
                id="floating-add-content-button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6332ee] hover:bg-[#5225d3] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-purple-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-400/40 select-none backdrop-blur-md"
              >
                <Plus className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Add Element / Collection</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Inspector Panel — rendered for Desktop & Tablet editor viewports */}
        {!editorIsMobile && (
          <ContextInspector
            portfolio={portfolio}
            onPortfolioChange={handlePortfolioChange}
          />
        )}
      </div>

      {/* Mobile Editor UI Components — rendered ONLY when the actual browser is mobile (< 768px) */}
      {editorIsMobile && (
        <>
          <MobileBottomNav
            onOpenLayers={() => setActiveMobileSheet(s => s === 'layers' ? 'none' : 'layers')}
            onOpenTemplates={() => setActiveMobileSheet(s => s === 'templates' ? 'none' : 'templates')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onPublish={handlePublish}
            isEditMode={isEditMode}
            toggleEditMode={() => setIsEditMode(v => !v)}
            activeSheet={activeMobileSheet}
          />
          <MobileLayersSheet
            isOpen={activeMobileSheet === 'layers'}
            onClose={() => setActiveMobileSheet('none')}
            portfolio={portfolio}
            onPortfolioChange={handlePortfolioChange}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            schema={templateSchema}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
          <MobileTemplatesSheet
            isOpen={activeMobileSheet === 'templates'}
            onClose={() => setActiveMobileSheet('none')}
            portfolio={portfolio}
            onPortfolioChange={handlePortfolioChange}
          />
          <MobileUrlSheet
            isOpen={activeMobileSheet === 'url'}
            onClose={() => setActiveMobileSheet('none')}
            portfolio={portfolio}
            onPortfolioChange={handlePortfolioChange}
          />
          <MobileInspectorSheet
            portfolio={portfolio}
            onPortfolioChange={handlePortfolioChange}
          />
        </>
      )}

      {/* Overlays */}
      <EditorDebugOverlay canvasRef={canvasRef} />

      {/* Context Menu */}
      <ContextMenu portfolio={portfolio} onPortfolioChange={handlePortfolioChange} />

      {/* Universal Add Modal */}
      <UniversalAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        portfolio={portfolio}
        onPortfolioChange={handlePortfolioChange}
        onOpenResumeSync={() => setIsResumeSyncOpen(true)}
      />

      {/* Resume Sync & Update Modal */}
      {portfolio && (
        <ResumeSyncModal
          isOpen={isResumeSyncOpen}
          onClose={() => setIsResumeSyncOpen(false)}
          portfolio={portfolio}
          onPortfolioChange={handlePortfolioChange}
        />
      )}

      {/* Publish success modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-6 text-center text-white">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">Successfully Published!</h3>
                <p className="text-xs text-violet-100 mt-1">Your website is live and fully responsive.</p>
              </div>
              <div className="p-6 space-y-4">
                <CampusCvQrCode
                  username={portfolio.username}
                  customDomain={portfolio.customDomain}
                  size={140}
                  showActions={true}
                  showUrlText={true}
                />
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 py-3 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription / Plan Lock Modal — only block when explicitly expired, never block free editing */}
      {(() => {
        if (!user) return null;
        const hasEverPurchased = Boolean(user?.subscriptionExpires);
        const isUserExpired = user?.planType === 'expired' || (hasEverPurchased && new Date(user.subscriptionExpires!).getTime() < Date.now());
        if (!isUserExpired) return null;

        return (
          <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`w-full max-w-md bg-[#18181b] border ${isUserExpired ? 'border-red-500/30' : 'border-violet-500/30'} rounded-3xl p-7 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 text-white`}>
              <div className={`w-16 h-16 rounded-2xl ${isUserExpired ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-violet-500/10 border-violet-500/20 text-violet-400'} border flex items-center justify-center mx-auto shadow-lg`}>
                {isUserExpired ? <Lock className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-bricolage text-white">
                  {isUserExpired ? 'Subscription Expired' : 'Choose a Plan to Edit & Publish'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  {isUserExpired
                    ? 'Your active CampusCV subscription has expired. Portfolio editing and live publishing are paused until your subscription is renewed.'
                    : 'An active CampusCV plan is required to customize themes, connect custom domains, and publish your live portfolio.'}
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isUserExpired ? 'Renew Subscription & Unlock' : 'Buy a Plan to Get Started'}</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-10 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Guided Tour (Phase 25) */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 1 }}
            className="fixed bottom-6 right-6 z-[9999] bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

class EditorErrorBoundary extends React.Component<
  { children: React.ReactNode; id?: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    const errObj = error instanceof Error ? error : new Error(String(error || 'Editor client exception'));
    return { hasError: true, error: errObj };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('[EDITOR_ROOT_EXCEPTION]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Editor Temporary Interruption</h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                An unexpected state occurred while rendering this portfolio. Click below to reload and continue editing safely.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-violet-600/25 cursor-pointer"
              >
                Reload Editor
              </button>
              <a
                href="/dashboard"
                className="w-full h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function EditorPage(props: any) {
  const routerParams = useParams();
  let id = (routerParams?.id as string) || '';

  if (!id && props?.params) {
    try {
      if (typeof props.params.then === 'function') {
        const resolved = use(props.params as Promise<any>);
        id = resolved?.id || '';
      } else {
        id = (props.params as any)?.id || '';
      }
    } catch {
      id = '';
    }
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <EditorErrorBoundary id={id}>
      <EditorProvider>
        <EditorInner id={id} />
      </EditorProvider>
    </EditorErrorBoundary>
  );
}
