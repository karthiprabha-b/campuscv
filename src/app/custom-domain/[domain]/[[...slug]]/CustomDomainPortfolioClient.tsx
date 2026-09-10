"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import PortfolioRenderer from '../../../../components/templates/PortfolioRenderer';
import { ResolvedPortfolioDomain } from '../../../../lib/domainResolver';

interface ClientProps {
  domain: string;
  initialSubpage?: string;
  resolution: ResolvedPortfolioDomain | null;
}

export default function CustomDomainPortfolioClient({
  domain,
  initialSubpage = 'Home',
  resolution,
}: ClientProps) {
  const [activePage, setActivePage] = useState(initialSubpage);

  useEffect(() => {
    if (resolution?.portfolio) {
      const port = resolution.portfolio;
      // Record analytics
      try {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolioId: port.id,
            username: port.username,
            customDomain: domain,
          }),
        }).catch(() => {});
      } catch (_) {}
    }
  }, [resolution, domain]);

  // State 1: Domain not connected or unknown
  if (!resolution || resolution.status === 'not_found' || !resolution.portfolio) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center gap-6 text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-400">
          🌐
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-xl font-bold font-bricolage">Domain Not Connected</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The custom domain <span className="font-mono text-violet-400">{domain}</span> is not currently mapped to an active CampusCV portfolio.
          </p>
          <p className="text-[11px] text-zinc-500">
            If you are the owner, please log in to your dashboard and verify your domain setup.
          </p>
        </div>
        <a
          href="https://portfolio.campuscv.com/dashboard"
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20"
        >
          Go to CampusCV Dashboard
        </a>
      </div>
    );
  }

  // State 2: DNS Pending verification
  if (resolution.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center gap-6 text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-center text-2xl font-bold text-amber-400 animate-pulse">
          ⏳
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-xl font-bold font-bricolage">DNS Verification Pending</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="font-mono text-amber-400">{domain}</span> has been connected, but DNS verification is still pending.
          </p>
          <p className="text-[11px] text-zinc-500">
            Please allow a few moments for DNS propagation, then visit your dashboard to trigger verification.
          </p>
        </div>
        <a
          href="https://portfolio.campuscv.com/dashboard"
          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
        >
          Open Dashboard
        </a>
      </div>
    );
  }

  const portfolio = resolution.portfolio;

  // State 3: Subscription Expired Check
  const isExpired = (portfolio as any).isExpired === true ||
    (portfolio as any).isPro === false ||
    (portfolio as any).planType === 'expired' ||
    (portfolio.subscriptionExpires && new Date(portfolio.subscriptionExpires).getTime() < Date.now());

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
            The active subscription for this custom domain portfolio has expired.
          </p>
          <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            If you are the portfolio owner, please log in to your CampusCV dashboard and renew your plan to restore live access immediately.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://portfolio.campuscv.com/dashboard"
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

  const canonicalUrl = `https://${resolution.normalizedDomain}`;

  return (
    <main id="custom-domain-portfolio-root" className="w-full min-h-screen">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": portfolio.name || 'Portfolio',
            "jobTitle": portfolio.tagline || '',
            "description": portfolio.seo?.description || portfolio.meta?.description || '',
            "url": canonicalUrl,
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
        onFieldChange={() => {}}
        selectedElementId={null}
        setSelectedElementId={() => {}}
      />
    </main>
  );
}
