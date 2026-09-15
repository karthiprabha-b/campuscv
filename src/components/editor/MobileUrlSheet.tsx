"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Globe, Link as LinkIcon, ExternalLink, Copy, CheckCheck,
  QrCode, Sparkles, Check, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';
import { normalizeUsername } from '../../utils/urlHelper';
import CampusCvQrCode from '../common/CampusCvQrCode';

interface MobileUrlSheetProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

export default function MobileUrlSheet({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
}: MobileUrlSheetProps) {
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
    if (portfolio?.id && isOpen) {
      fetch(`/api/domains?portfolioId=${encodeURIComponent(portfolio.id)}`)
        .then(res => res.json())
        .then(data => {
          if (mounted && data?.success && data.domain) {
            setCustomDomainRecord(data.domain);
            setCustomDomainInput(data.domain.domain);
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [portfolio?.id, isOpen]);

  const activeHost = typeof window !== 'undefined' ? window.location.host : 'portfolio.campuscv.com';

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
    if (clean && clean !== portfolio.username) {
      onPortfolioChange({
        ...portfolio,
        username: clean,
        _lastUpdated: Date.now()
      });
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
        onPortfolioChange({
          ...portfolio,
          customDomain: data.domain.normalized_domain,
          _lastUpdated: Date.now()
        });
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed inset-x-0 bottom-0 top-14 z-[550] bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col select-none md:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-zinc-900 font-bricolage">URL & Custom Domain</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-5">
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
                  <span>Checking availability...</span>
                </p>
              )}
              {!checking && availResult && (
                <div className="flex items-center gap-1 pt-0.5">
                  {availResult.available ? (
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{availResult.message || 'Username is available!'}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span>{availResult.message || 'Username is taken'}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Custom Domain Connect Form */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-violet-600" />
                <span>Custom Domain</span>
              </label>

              <form onSubmit={handleConnectCustomDomain} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="e.g. johnkumar.com"
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-xs font-mono bg-zinc-50 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={domainSaving || !customDomainInput.trim()}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    {domainSaving ? 'Connecting...' : 'Set'}
                  </button>
                </div>

                {domainFeedback && (
                  <p className={`text-[10px] font-semibold flex items-center gap-1 ${
                    domainFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {domainFeedback.type === 'success' ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{domainFeedback.message}</span>
                  </p>
                )}
              </form>
            </div>

            {/* 3. Live Public Link Share & Visit */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                  Live Public Link
                </label>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-2xl space-y-2.5">
                <p className="text-[11px] font-mono font-bold text-violet-900 truncate">
                  {effectivePublicUrl}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyPublicUrl}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-zinc-50 border border-violet-200 text-violet-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={effectivePublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Portfolio QR Code */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                Portfolio QR Code
              </label>

              <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col items-center">
                <CampusCvQrCode
                  username={portfolio.username}
                  customDomain={portfolio.customDomain}
                  size={130}
                  showActions={true}
                  showUrlText={false}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
