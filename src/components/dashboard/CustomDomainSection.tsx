"use client";

import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, Trash2, Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { normalizeDomain, DEFAULT_CAMPUSCV_SERVER_IP, DEFAULT_CAMPUSCV_HOST } from '../../lib/domainUtils';

interface CustomDomainSectionProps {
  portfolioId: string;
  portfolioUsername?: string;
}

export default function CustomDomainSection({ portfolioId, portfolioUsername }: CustomDomainSectionProps) {
  const [domainInput, setDomainInput] = useState('');
  const [domainRecord, setDomainRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const serverIp = DEFAULT_CAMPUSCV_SERVER_IP;
  const serverHost = DEFAULT_CAMPUSCV_HOST;

  // Load current custom domain for portfolio
  const loadDomain = async () => {
    if (!portfolioId && !portfolioUsername) {
      setLoading(false);
      return;
    }
    try {
      const queryParams = new URLSearchParams();
      if (portfolioId) queryParams.set('portfolioId', portfolioId);
      if (portfolioUsername) queryParams.set('username', portfolioUsername);

      const res = await fetch(`/api/domains?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.domain) {
        setDomainRecord(data.domain);
      } else {
        setDomainRecord(null);
      }
    } catch (e) {
      console.warn('[Fetch Domain Error]', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomain();
  }, [portfolioId, portfolioUsername]);

  // Connect Domain (State A -> State B)
  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId,
          username: portfolioUsername,
          domain: domainInput.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.domain) {
        setFeedback({ type: 'error', message: data.error || 'Failed to connect domain.' });
      } else {
        setDomainRecord(data.domain);
        setDomainInput('');
        setFeedback({
          type: 'success',
          message: 'Domain added! Please configure the DNS records below and click "Verify DNS".',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error connecting domain.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Verify DNS (State B / C -> State D)
  const handleVerifyDns = async () => {
    if (!domainRecord?.id) return;
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/domains/${domainRecord.id}/verify`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.verified) {
        setFeedback({ type: 'success', message: data.message });
        await loadDomain();
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'DNS record has not propagated yet. Please check your registrar settings.',
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Verification request failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Disconnect Domain
  const handleDisconnectDomain = async () => {
    if (!domainRecord?.id) return;
    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/domains/${domainRecord.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setDomainRecord(null);
        setShowDisconnectModal(false);
        setFeedback({ type: 'success', message: 'Custom domain disconnected successfully.' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to disconnect domain.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to disconnect domain.' });
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 flex items-center justify-center min-h-[160px]">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE A: No custom domain connected
  // ═══════════════════════════════════════════════════════════════════════════
  if (!domainRecord) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 transition-all">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">Custom Domain</h3>
              <p className="text-xs sm:text-sm text-zinc-500">
                Publish your CampusCV portfolio on your own personal or custom domain (e.g. <span className="font-semibold text-zinc-700">johnkumar.com</span>).
              </p>
            </div>
          </div>

          {feedback && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleConnectDomain} className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="e.g. yourname.com or portfolio.yourname.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full h-10 sm:h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-mono"
                required
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading || !domainInput.trim()}
              className="h-10 sm:h-11 px-5 sm:px-6 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {actionLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Connect Domain</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </form>

          {/* Upfront DNS instructions for user registrar */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-zinc-100 space-y-3">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
              DNS Records to add in your domain registrar (Hostinger, GoDaddy, Cloudflare, etc.):
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-2.5">Type</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-2.5">Name / Host</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-2.5">Value / Points To</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 font-mono text-zinc-800 text-[11px] sm:text-xs">
                  <tr>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-purple-700">A</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-semibold">@ (or root)</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-zinc-700 font-semibold">{serverIp}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(serverIp, 'ip_preview')}
                        className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        title="Copy Server IP"
                      >
                        {copiedKey === 'ip_preview' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400">
              Point your domain using the records above, type your domain name, and click &quot;Connect Domain&quot;.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = domainRecord.status === 'verified' || domainRecord.status === 'active';
  const isSslActive = domainRecord.ssl_status === 'active';
  const isApex = domainRecord.normalized_domain.split('.').length === 2;

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE D: Everything active (DNS verified + HTTPS active)
  // ═══════════════════════════════════════════════════════════════════════════
  if (isVerified && isSslActive) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-emerald-200/90 overflow-hidden shadow-xs hover:border-emerald-300 transition-all">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Icon & Domain Status Details */}
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 break-all leading-tight">
                    {domainRecord.domain}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Domain connected
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> HTTPS active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 leading-normal break-words">
                  Your portfolio is live and securely served at{' '}
                  <a
                    href={`https://${domainRecord.normalized_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <span>https://{domainRecord.normalized_domain}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </p>
              </div>
            </div>

            {/* Right / Bottom: Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
              <a
                href={`https://${domainRecord.normalized_domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 sm:h-10 px-3 sm:px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs text-center"
              >
                <span className="truncate">Visit Domain</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <button
                type="button"
                onClick={() => setShowDisconnectModal(true)}
                className="h-9 sm:h-10 px-3 text-red-600 hover:bg-red-50 bg-red-50/40 sm:bg-transparent rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Disconnect</span>
              </button>
            </div>

          </div>
        </div>

        {/* Disconnect confirmation modal */}
        {showDisconnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 space-y-4 shadow-2xl">
              <h4 className="text-base font-bold text-zinc-900">Disconnect Custom Domain?</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Are you sure you want to disconnect <span className="font-semibold text-zinc-800">{domainRecord.domain}</span>? Your portfolio and assets will remain completely safe and accessible via your CampusCV URL.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisconnectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectDomain}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? 'Disconnecting...' : 'Yes, Disconnect Domain'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE C: DNS verified, SSL Provisioning
  // ═══════════════════════════════════════════════════════════════════════════
  if (isVerified && !isSslActive) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 overflow-hidden shadow-xs p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Custom Domain</span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Domain verified
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 break-all">{domainRecord.domain}</h3>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1.5 pt-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              SSL Status: Provisioning HTTPS certificate...
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
            <button
              onClick={handleVerifyDns}
              disabled={actionLoading}
              className="h-9 sm:h-10 px-3 sm:px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
              <span className="truncate">Refresh Status</span>
            </button>
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="h-9 sm:h-10 px-3 text-red-600 hover:bg-red-50 bg-red-50/40 sm:bg-transparent rounded-xl text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE B: Domain added but waiting for DNS verification
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 transition-all">
      <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Custom Domain</span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                ⏳ Waiting for DNS verification
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 mt-1 break-all">{domainRecord.domain}</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
            <button
              onClick={handleVerifyDns}
              disabled={actionLoading}
              className="h-9 sm:h-10 px-3 sm:px-5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {actionLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="truncate">Verify DNS</span>
            </button>
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="h-9 sm:h-10 px-3 text-zinc-500 hover:text-red-600 bg-zinc-100/60 sm:bg-transparent hover:bg-zinc-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold space-y-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="flex-1">{feedback.message}</span>
            </div>

            {feedback.type === 'error' && (
              <div className="pt-1 flex items-center justify-end gap-2 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={async () => {
                    if (!domainRecord?.id) return;
                    setActionLoading(true);
                    try {
                      const res = await fetch(`/api/domains/${domainRecord.id}/verify?force=true`, { method: 'POST' });
                      const data = await res.json();
                      if (data.verified) {
                        setFeedback({ type: 'success', message: data.message });
                        await loadDomain();
                      }
                    } catch {} finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>I have added the DNS records — Activate Domain Now</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* DNS Instructions Table */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Required DNS Records in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Name / Host</th>
                  <th className="px-4 py-3">Value / Points To</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-zinc-800">
                {/* Apex A Record */}
                <tr className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-purple-700">A</td>
                  <td className="px-4 py-3 font-semibold">@</td>
                  <td className="px-4 py-3 text-zinc-600">{serverIp}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(serverIp, 'ip')}
                      className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      title="Copy IP"
                    >
                      {copiedKey === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-zinc-400">
            Note: DNS changes can take up to 24 hours to propagate across global DNS providers, though most changes take effect in 1–5 minutes.
          </p>
        </div>

      </div>

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-zinc-900">Remove Domain Mapping?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Remove custom domain configuration for <span className="font-semibold text-zinc-800">{domainRecord.domain}</span>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisconnectDomain}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
