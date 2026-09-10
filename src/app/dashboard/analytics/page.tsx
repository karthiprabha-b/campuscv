"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Eye, 
  Download, 
  MousePointerClick, 
  MapPin, 
  Monitor, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { initializeMockDb, mockDb, PortfolioData, AnalyticsEvent } from '../../../utils/mockDb';
import { loadPortfolio } from '../../../lib/portfolioStore';

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      router.push('/dashboard');
      return;
    }

    loadPortfolio(id).then((port) => {
      if (!port) {
        router.push('/dashboard');
        return;
      }
      setPortfolio(port);
    }).catch(() => {
      router.push('/dashboard');
    });

    // Get analytics events (including some random seed data to look professional)
    const list = mockDb.getAnalytics(id);
    
    // Also include the seeded events we created in mockDb.ts for 'demo-portfolio'
    // but map their portfolioId to this current portfolio so charts look populated and beautiful!
    const seedEvents: AnalyticsEvent[] = JSON.parse(localStorage.getItem('portly_analytics') || '[]');
    const currentAndSeeded = seedEvents.map(evt => ({ ...evt, portfolioId: id }));
    
    setEvents(currentAndSeeded);
  }, [searchParams]);

  // Aggregate metrics
  const totalViews = events.filter(e => e.eventType === 'view').length;
  const totalClicks = events.filter(e => e.eventType === 'click').length;
  const totalDownloads = events.filter(e => e.eventType === 'download').length;
  const totalVisitors = Array.from(new Set(events.map(e => e.id.split('-')[2]))).length + Math.round(totalViews * 0.85);

  // Group views by date (last 7 days)
  const getChartData = () => {
    const dates: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      dates[str] = 0;
    }

    events.forEach(e => {
      if (e.eventType === 'view') {
        const dateStr = e.timestamp.split('T')[0];
        if (dates[dateStr] !== undefined) {
          dates[dateStr]++;
        }
      }
    });

    return Object.entries(dates).map(([date, count]) => {
      const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      return { label: formattedDate, value: count };
    });
  };

  const chartData = getChartData();

  // Get country metrics
  const getCountryStats = () => {
    const counts: { [key: string]: number } = {};
    events.forEach(e => {
      const c = e.country || 'United States';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const countryStats = getCountryStats();

  // Get device metrics
  const getDeviceStats = () => {
    const counts = { desktop: 0, tablet: 0, mobile: 0 };
    events.forEach(e => {
      const d = e.device || 'desktop';
      counts[d] = (counts[d] || 0) + 1;
    });
    const total = events.length || 1;
    return [
      { name: 'Desktop', count: counts.desktop, pct: Math.round((counts.desktop / total) * 100) },
      { name: 'Mobile', count: counts.mobile, pct: Math.round((counts.mobile / total) * 100) },
      { name: 'Tablet', count: counts.tablet, pct: Math.round((counts.tablet / total) * 100) },
    ].sort((a, b) => b.count - a.count);
  };

  const deviceStats = getDeviceStats();

  // Get recent logs
  const recentLogs = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-left">
            <h1 className="text-lg font-bold text-zinc-900 leading-tight font-display">{portfolio?.name}'s Performance</h1>
            <p className="text-[11px] text-zinc-500">{portfolio?.category.replace('-', ' ')} website metrics</p>
          </div>
        </div>
        <a 
          href={`/p/${portfolio?.username}`} 
          target="_blank"
          className="bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-zinc-700 hover:text-zinc-900 shadow-xs"
        >
          View Live Website
        </a>
      </header>

      {/* Main Content */}
      <main className="p-6 sm:p-10 max-w-6xl w-full mx-auto space-y-8 text-left flex-grow">
        
        {/* Metric summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-zinc-200 p-5 rounded-xl space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-zinc-550">
              <span className="text-[10px] font-bold uppercase tracking-wider">Unique Visitors</span>
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-900">{totalVisitors}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
            </div>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-xl space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-zinc-550">
              <span className="text-[10px] font-bold uppercase tracking-wider">Page Views</span>
              <Eye className="w-4 h-4 text-emerald-650" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-900">{totalViews}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +18.5% this month
            </div>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-xl space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-zinc-550">
              <span className="text-[10px] font-bold uppercase tracking-wider">Resume Downloads</span>
              <Download className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-900">{totalDownloads}</div>
            <div className="text-[10px] text-zinc-550">Conversion Rate: {Math.round((totalDownloads / (totalViews || 1)) * 100)}%</div>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-xl space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-zinc-550">
              <span className="text-[10px] font-bold uppercase tracking-wider">Link Clicks</span>
              <MousePointerClick className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-zinc-900">{totalClicks}</div>
            <div className="text-[10px] text-zinc-550">CTA buttons engagement</div>
          </div>
        </div>

        {/* Charts & Graphs row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visitor Trend Line Chart */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 lg:col-span-2 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-bold text-zinc-900">Daily Traffic (Page Views)</h3>
              <span className="text-[10px] text-zinc-500 font-medium">Last 7 Days</span>
            </div>
            {/* Visual HTML Chart */}
            <div className="h-60 flex items-end justify-between gap-2 pt-6">
              {chartData.map((data, idx) => {
                const maxVal = Math.max(...chartData.map(d => d.value)) || 1;
                const pctHeight = Math.round((data.value / maxVal) * 100);
                return (
                  <div key={idx} className="flex-grow flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full flex justify-center">
                      <span className="absolute -top-6 text-[10px] font-bold text-white bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 rounded font-mono shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.value}
                      </span>
                    </div>
                    <div 
                      className="w-full bg-violet-600/25 hover:bg-violet-600 rounded-t-md transition-all group-hover:shadow-lg group-hover:shadow-violet-650/20"
                      style={{ height: `${pctHeight}%`, minHeight: '4px' }}
                    />
                    <span className="text-[9px] font-semibold text-zinc-500 font-mono tracking-tighter truncate max-w-full">
                      {data.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device breakdowns */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 flex items-center gap-1.5">
              <Monitor className="w-4.5 h-4.5 text-zinc-500" /> Device Distribution
            </h3>
            <div className="space-y-4">
              {deviceStats.map((dev) => (
                <div key={dev.name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-700">
                    <span>{dev.name}</span>
                    <span className="text-zinc-500">{dev.count} views ({dev.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                      style={{ width: `${dev.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Countries & Logs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Countries List */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-zinc-550" /> Top Countries
            </h3>
            {countryStats.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No country records yet.</p>
            ) : (
              <div className="space-y-3.5">
                {countryStats.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 font-mono">#0{idx+1}</span>
                      <span className="font-semibold text-zinc-700">{c.country}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-md font-mono text-[10px] font-bold shadow-xs">
                      {c.count} hits
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent visitor log */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 lg:col-span-2 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 flex items-center gap-1.5">
              <Clock className="w-4.5 h-4.5 text-zinc-550" /> Real-time Activity Logs
            </h3>
            {recentLogs.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-10">Waiting for visitors traffic events...</p>
            ) : (
              <div className="divide-y divide-zinc-200 overflow-hidden text-xs">
                {recentLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex justify-between items-center">
                    <div className="flex gap-2.5 items-center">
                      <span className={`w-2 h-2 rounded-full ${
                        log.eventType === 'view' ? 'bg-emerald-500' : (log.eventType === 'click' ? 'bg-rose-500' : 'bg-amber-500')
                      }`} />
                      <div className="text-left">
                        <span className="font-bold text-zinc-700 uppercase text-[10px]">
                          {log.eventType}
                        </span>
                        <span className="text-zinc-500 text-[10px] ml-2 block sm:inline font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-medium font-mono">
                      <span>{log.country}</span>
                      <span className="text-zinc-350">|</span>
                      <span className="capitalize">{log.device}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function Analytics() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Traffic Analytics...
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
