"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import {
  initializeMockDb,
  mockDb,
  PortfolioData
} from '../../utils/mockDb';
import PortfolioRenderer from '../../components/templates/PortfolioRenderer';
import { loadPublishedPortfolio } from '../../lib/portfolioStore';
import { supabase } from '../../lib/supabase/client';
import { getPortfolioUrl, normalizeUsername, isReservedUsername } from '../../utils/urlHelper';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublishedPortfolioRoot({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawUsername = resolvedParams?.username || '';
  const username = normalizeUsername(rawUsername);

  // If this username matches a reserved system route, let next.js 404 or route handle it
  if (isReservedUsername(username)) {
    notFound();
  }

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activePage, setActivePage] = useState('Home');
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);

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
      if (!username || isReservedUsername(username)) {
        setLoading(false);
        return;
      }
      try {
        const port = await loadPublishedPortfolio(username);
        if (!mounted) return;

        if (port) {
          console.log('[/[username]] Loaded published portfolio:', port);
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
        console.error('[/[username] Load error]', err);
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
  const handlePageChange = (page: string) => {
    setActivePage(page);
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio?.id,
          username,
          eventType: 'click',
          details: `Navigated to ${page}`
        }),
      }).catch(() => {});
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Loading portfolio...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col justify-center items-center px-4 text-center font-sans space-y-6 text-white">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center text-red-400 text-3xl shadow-2xl shadow-red-500/10 animate-pulse">
          🔒
        </div>
        <div className="space-y-2.5 max-w-md">
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Subscription Expired
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-bricolage pt-1">
            Website Temporarily Offline
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-dm-sans">
            The active subscription for this portfolio website has expired.
          </p>
          <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            If you are the portfolio owner, please log in to your CampusCV dashboard and renew your plan to restore live access immediately.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/30"
          >
            <span>Renew on CampusCV</span>
          </a>
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
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center gap-6 text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold">
          404
        </div>
        <div>
          <h1 className="text-xl font-bold font-bricolage">Portfolio Not Found</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            No published portfolio found for <span className="font-mono text-violet-400">@{username}</span>.
          </p>
        </div>
        <a
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

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
      <PortfolioRenderer
        data={portfolio}
        portfolio={portfolio}
        mode="published"
        activePage={activePage}
        setActivePage={setActivePage}
        isEditMode={false}
        onFieldChange={() => { }}
        selectedElementId={null}
        setSelectedElementId={() => { }}
      />
    </main>
  );
}
