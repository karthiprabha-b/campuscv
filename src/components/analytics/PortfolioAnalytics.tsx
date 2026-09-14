"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart2, 
  Eye, 
  Users, 
  TrendingUp, 
  Globe, 
  Monitor, 
  Smartphone, 
  ArrowUpRight, 
  RefreshCw, 
  MessageSquare,
  Activity,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AnalyticsData {
  portfolioId: string;
  username: string;
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  weekViews: number;
  deviceBreakdown: { device: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  dailyViews: { date: string; count: number }[];
}

interface ContactMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  message: string;
  read: number;
  received_at: number;
}

interface PortfolioAnalyticsProps {
  portfolioId: string;
  username: string;
}

export default function PortfolioAnalytics({ portfolioId, username }: PortfolioAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [tab, setTab] = useState<'analytics' | 'messages'>('analytics');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [aRes, mRes] = await Promise.all([
        fetch(`/api/analytics?portfolioId=${encodeURIComponent(portfolioId)}&username=${encodeURIComponent(username)}`),
        fetch(`/api/contact?username=${encodeURIComponent(username)}`),
      ]);
      if (aRes.ok) {
        const data = await aRes.json();
        setAnalytics(data);
      }
      if (mRes.ok) {
        const d = await mRes.json();
        setMessages(d.messages || []);
      }
      setLastUpdated(new Date());
    } catch (e) {
      console.error('[PortfolioAnalytics Load Error]', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [portfolioId, username]);

  useEffect(() => {
    load();
    // Auto refresh analytics every 30 seconds
    const timer = setInterval(() => {
      load(true);
    }, 30000);
    return () => clearInterval(timer);
  }, [load]);

  const mobileCount = analytics?.deviceBreakdown?.find(d => d.device === 'mobile')?.count ?? 0;
  const desktopCount = analytics?.deviceBreakdown?.find(d => d.device === 'desktop')?.count ?? 0;
  const totalDevice = (mobileCount + desktopCount) || 1;
  const maxReferrer = Math.max(...(analytics?.topReferrers?.map(r => r.count) ?? [1]), 1);
  const unreadCount = messages.filter(m => !m.read).length;
  const maxDaily = Math.max(...(analytics?.dailyViews?.map(d => d.count) ?? [1]), 1);

  if (loading && !analytics) {
    return (
      <div className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 font-dm-sans">Loading visitor analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-5 sm:p-7 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED]">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-bricolage text-zinc-950">
              Live Visitor Analytics
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Auto Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-dm-sans">
            Real-time telemetry showing how many visitors watch and browse your portfolio website.
          </p>
        </div>

        {/* Tab switcher + Refresh button */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/50">
            <button
              onClick={() => setTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'analytics'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#7C3AED]" />
              Traffic Stats
            </button>
            <button
              onClick={() => setTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'messages'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
              Inquiries
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            title="Refresh analytics"
            className="w-8 h-8 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#7C3AED]' : ''}`} />
          </button>
        </div>
      </div>

      {tab === 'analytics' ? (
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Stat Cards Grid (4 columns) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* 1. Total Views */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 via-white to-zinc-50 border border-purple-100/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 font-mono">Total Views</span>
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-bricolage tracking-tight">
                  {analytics?.totalViews?.toLocaleString() ?? 0}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">All-time portfolio hits</p>
              </div>
            </div>

            {/* 2. Unique Visitors */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-zinc-50 border border-emerald-100/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 font-mono">Unique Visitors</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-bricolage tracking-tight">
                  {analytics?.uniqueVisitors?.toLocaleString() ?? 0}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Distinct IP audiences</p>
              </div>
            </div>

            {/* 3. Today's Visits */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-zinc-50 border border-amber-100/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 font-mono">Today's Visits</span>
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-bricolage tracking-tight">
                  {analytics?.todayViews?.toLocaleString() ?? 0}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Views in last 24h</p>
              </div>
            </div>

            {/* 4. This Week */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-zinc-50 border border-blue-100/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 font-mono">Last 7 Days</span>
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-bricolage tracking-tight">
                  {analytics?.weekViews?.toLocaleString() ?? 0}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Weekly velocity</p>
              </div>
            </div>

          </div>

          {/* 7-Day Chart & Device/Traffic Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* 7-Day Visual Bar Chart (2 cols on lg) */}
            <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#7C3AED]" />
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900">7-Day Visitor Trend</h4>
                </div>
                <span className="text-[11px] font-semibold text-zinc-400">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Bar Chart Container */}
              <div className="pt-4 pb-2">
                <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 px-1">
                  {(analytics?.dailyViews || []).map((d, idx) => {
                    const heightPct = maxDaily > 0 ? Math.max(6, Math.round((d.count / maxDaily) * 100)) : 6;
                    const dateObj = new Date(d.date + 'T00:00:00');
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const isToday = idx === (analytics?.dailyViews?.length ?? 0) - 1;

                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        
                        {/* Count Tooltip/Badge */}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all ${
                          d.count > 0 
                            ? 'bg-purple-100 text-[#7C3AED] opacity-100 group-hover:scale-110' 
                            : 'text-zinc-300 opacity-60 group-hover:opacity-100'
                        }`}>
                          {d.count}
                        </span>

                        {/* Bar */}
                        <div className="w-full max-w-[42px] h-full flex items-end">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isToday
                                ? 'bg-gradient-to-t from-[#7C3AED] to-[#9333EA] shadow-xs'
                                : d.count > 0
                                ? 'bg-gradient-to-t from-[#7C3AED]/70 to-[#A78BFA]'
                                : 'bg-zinc-200'
                            } group-hover:brightness-110`}
                            title={`${d.count} views on ${formattedDate}`}
                          />
                        </div>

                        {/* Day Label */}
                        <div className="text-center">
                          <p className={`text-[10px] font-bold ${isToday ? 'text-[#7C3AED]' : 'text-zinc-600'}`}>
                            {isToday ? 'Today' : dayName}
                          </p>
                          <p className="text-[9px] text-zinc-400 hidden sm:block">{formattedDate}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  Active Visits
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  Every visit to your public URL counts in real time
                </span>
              </div>
            </div>

            {/* Devices & Traffic Sources (1 col on lg) */}
            <div className="space-y-4">
              
              {/* Device Split */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Devices
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">{totalDevice} logged</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Desktop */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" /> Desktop
                      </span>
                      <span className="font-bold text-zinc-900">
                        {Math.round((desktopCount / totalDevice) * 100)}% ({desktopCount})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((desktopCount / totalDevice) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> Mobile
                      </span>
                      <span className="font-bold text-zinc-900">
                        {Math.round((mobileCount / totalDevice) * 100)}% ({mobileCount})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-200/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((mobileCount / totalDevice) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Referrers */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Top Sources
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">Referrers</span>
                </div>

                {(!analytics?.topReferrers || analytics.topReferrers.length === 0) ? (
                  <p className="text-xs text-zinc-400 italic py-2">Direct &amp; organic links</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {analytics.topReferrers.slice(0, 4).map((ref, i) => {
                      const pct = maxReferrer > 0 ? Math.round((ref.count / maxReferrer) * 100) : 0;
                      const label = ref.referrer === 'direct' || !ref.referrer ? 'Direct Link / QR' : ref.referrer;
                      return (
                        <div key={i} className="text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-zinc-700 truncate max-w-[130px]" title={label}>
                              {label}
                            </span>
                            <span className="font-bold text-zinc-900">{ref.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-200/80 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Zero visits friendly helper */}
          {analytics?.totalViews === 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <p className="text-xs text-zinc-700 font-dm-sans">
                  No views recorded yet. Share your portfolio URL or scan your QR code to test live visit tracking!
                </p>
              </div>
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span>Visit Now</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

        </div>
      ) : (
        /* Inquiries / Contact Messages Tab */
        <div className="p-5 sm:p-7">
          {messages.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-3 bg-zinc-50/50 rounded-2xl border border-zinc-200/70">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED] mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900">No Visitor Inquiries Yet</h4>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  When recruiters and clients send messages via your portfolio contact form, they will appear right here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    m.read ? 'bg-white border-zinc-200' : 'bg-purple-50/40 border-purple-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white flex items-center justify-center font-bold text-xs">
                        {m.sender_name?.[0] || 'V'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-950">{m.sender_name}</p>
                        <a
                          href={`mailto:${m.sender_email}`}
                          className="text-xs text-[#7C3AED] hover:underline"
                        >
                          {m.sender_email}
                        </a>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                      {new Date(m.received_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 mt-2 bg-white/70 p-3 rounded-xl border border-zinc-100 whitespace-pre-wrap leading-relaxed">
                    {m.message}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <a
                      href={`mailto:${m.sender_email}?subject=Re: Your inquiry on CampusCV Portfolio`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9]"
                    >
                      <span>Reply to Email</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
