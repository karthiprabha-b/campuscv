"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import {
  initializeMockDb,
  mockDb,
  PortfolioData
} from '../../../utils/mockDb';
import PortfolioRenderer from '../../../components/templates/PortfolioRenderer';
import { loadPublishedPortfolio } from '../../../lib/portfolioStore';
import { supabase } from '../../../lib/supabase/client';
import { getPortfolioUrl, normalizeUsername } from '../../../utils/urlHelper';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublishedPortfolio({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawUsername = resolvedParams?.username || '';
  const username = normalizeUsername(rawUsername);

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activePage, setActivePage] = useState('Home');
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkExpirationStatus = async (port: any): Promise<boolean> => {
      let expired = false;

      // 1. Direct portfolio-level flags
      if ((port as any).isExpired === true || (port as any).isPro === false || (port as any).planType === 'expired') {
        expired = true;
      } else if (port.subscriptionExpires && new Date(port.subscriptionExpires).getTime() < Date.now()) {
        expired = true;
      }

      // 2. Query Supabase profiles table for the owner's latest live status
      const ownerId = port.userId || port.user_id;
      const ownerEmail = port.email || (port.personal && port.personal.email);
      if (ownerId || ownerEmail) {
        try {
          let query = (supabase as any).from('profiles').select('is_pro, plan_type, subscription_expires_at');
          if (ownerId) {
            query = query.eq('id', ownerId);
          } else {
            query = query.eq('email', ownerEmail);
          }
          const { data: ownerProfile } = await query.maybeSingle();
          if (ownerProfile) {
            if (ownerProfile.is_pro === false || ownerProfile.plan_type === 'expired') {
              expired = true;
            } else if (ownerProfile.subscription_expires_at && new Date(ownerProfile.subscription_expires_at).getTime() < Date.now()) {
              expired = true;
            } else if (ownerProfile.is_pro === true) {
              expired = false;
            }
          }
        } catch (e) {
          console.warn('[Published expiry check Supabase error]', e);
        }
      }

      return expired;
    };

    const fetchPublished = async () => {
      if (!username) {
        setLoading(false);
        return;
      }
      try {
        const port = await loadPublishedPortfolio(username);
        if (!mounted) return;

        if (port) {
          console.log('[/p/[username]] Loaded published portfolio:', port);
          setPortfolio(port);

          const hasExpired = await checkExpirationStatus(port);
          if (hasExpired && mounted) {
            setIsExpired(true);
          }

          if (port.seo?.title) {
            document.title = port.seo.title;
          } else if (port.name) {
            document.title = `${port.name} | Portfolio | CampusCV`;
          }

          // Record portfolio analytics view
          try {
            fetch('/api/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ portfolioId: port.id, username }),
            }).catch(() => {});
          } catch (_) {}
        }
      } catch (err) {
        console.error('[/p/[username] Load error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPublished();

    // Listen for custom event updates for instant cross-tab sync
    const handleSync = async (e?: any) => {
      if (e?.detail) {
        setPortfolio(e.detail);
        const hasExpired = (e.detail.subscriptionExpires && new Date(e.detail.subscriptionExpires).getTime() < Date.now()) ||
          e.detail.isExpired === true ||
          (e.detail.isPro === false && e.detail.subscriptionExpires);
        setIsExpired(!!hasExpired);
      } else {
        const port = await loadPublishedPortfolio(username);
        if (port && mounted) {
          setPortfolio(port);
          const hasExpired = (port.subscriptionExpires && new Date(port.subscriptionExpires).getTime() < Date.now()) ||
            (port as any).isExpired === true ||
            ((port as any).isPro === false && port.subscriptionExpires);
          setIsExpired(!!hasExpired);
        }
      }
    };

    window.addEventListener('portly_portfolio_published', handleSync);
    return () => {
      mounted = false;
      window.removeEventListener('portly_portfolio_published', handleSync);
    };
  }, [username]);

  // Redirect to first enabled page if activePage is disabled
  useEffect(() => {
    if (portfolio) {
      const enabled = portfolio.enabledPages || [
        'Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'
      ];
      if (!enabled.includes(activePage)) {
        const nextActive = enabled.includes('Home') ? 'Home' : enabled[0] || 'Home';
        setActivePage(nextActive);
      }
    }
  }, [portfolio, activePage]);

  // Log navigation clicks in analytics
  const handleNavPage = (pageName: string) => {
    setActivePage(pageName);
    if (portfolio?.layoutStyle === 'cs-student') {
      const el = document.getElementById(`${pageName.toLowerCase()}-cs`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (portfolio) {
      mockDb.logAnalyticsEvent(portfolio.id, 'view', `Visited subpage ${pageName}`);
    }
  };

  // Log link clicks or downloads
  const handleTrackCta = (type: 'click' | 'download', details: string) => {
    if (portfolio) {
      mockDb.logAnalyticsEvent(portfolio.id, type, details);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 text-center font-sans space-y-6">
        <div className="w-16 h-16 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 text-2xl shadow-lg shadow-red-500/5 animate-pulse">
          ⚠️
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-extrabold text-white leading-tight font-display">Website Temporarily Offline</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The active subscription for this portfolio website has expired.
          </p>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
            If you are the owner, please log in to your dashboard panel and upgrade/renew your package to restore live publication.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <span>Renew on CampusCV</span>
          </button>
          <a
            href="https://campuscv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 text-center font-sans space-y-4">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
          ✕
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white leading-tight">404 Website Not Found</h2>
          <p className="text-xs text-zinc-550 max-w-sm leading-relaxed">
            The subdomain matching "{username}" is either draft mode or hasn't been created yet.
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Return to CampusCV
        </button>
      </div>
    );
  }

  // Dynamic color map
  const getThemeAccentClass = () => {
    switch (portfolio.themeColor) {
      case 'emerald': return 'from-emerald-400 to-teal-500 text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'retro': return 'from-amber-400 to-orange-500 text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'indigo': return 'from-indigo-400 to-blue-500 text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'amber': return 'from-yellow-400 to-amber-500 text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'rose': return 'from-rose-400 to-pink-500 text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'dark': return 'from-zinc-400 to-zinc-600 text-zinc-400 bg-zinc-500/10 border-zinc-550/20';
      case 'navy': return 'from-blue-600 to-indigo-800 text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'teal': return 'from-teal-400 to-emerald-500 text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'gradient': return 'from-violet-400 via-pink-400 to-rose-400 text-violet-400 bg-violet-500/10 border-violet-500/20';
      default: return 'from-violet-400 to-indigo-500 text-violet-500 bg-violet-500/10 border-violet-500/20';
    }
  };

  const accent = getThemeAccentClass();

  // Dynamic Font Class selection
  const getFontFamilyClass = () => {
    switch (portfolio.fontPack) {
      case 'sora': return 'font-sora';
      case 'poppins': return 'font-poppins';
      case 'manrope': return 'font-manrope';
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const fontClass = getFontFamilyClass();

  return (
    <main id="published-portfolio-root" className="w-full min-h-screen">

      {/* Schema Markup Dynamic Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": portfolio.name || 'Portfolio',
            "jobTitle": portfolio.tagline || '',
            "description": portfolio.seo?.description || portfolio.meta?.description || '',
            "url": getPortfolioUrl(portfolio.username || '')
          })
        }}
      />

      {(() => {
        const activeTmplId = portfolio.templateId || portfolio.layoutStyle || 'default';
        const activeVerId = (portfolio as any)?.templateVersionId || 'current';
        console.log("[MODE FLOW]", {
          component: "page.tsx",
          mode: "published",
          isEditMode: false,
          portfolioId: portfolio.id,
          templateId: activeTmplId
        });
        console.log('[DIAGNOSTIC - PUBLISHED PORTFOLIO]', {
          RENDERER: 'PUBLISHED PORTFOLIO',
          portfolioId: portfolio.id,
          templateId: activeTmplId,
          versionId: activeVerId,
          packagePath: `data/templates/${activeTmplId}/${activeVerId}`
        });
        return (
          <PortfolioRenderer
            data={portfolio}
            mode="published"
            activePage={activePage}
            isEditMode={false}
            onFieldChange={() => { }}
            selectedElementId={null}
            setSelectedElementId={() => { }}
          />
        );
      })()}
    </main>
  );
}
