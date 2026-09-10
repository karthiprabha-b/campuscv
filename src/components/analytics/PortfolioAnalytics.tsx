"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { BarChart2, Eye, Users, TrendingUp, Globe, Monitor, Smartphone, ArrowUpRight, RefreshCw, MessageSquare } from 'lucide-react';

interface AnalyticsData {
  portfolioId: string;
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

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e8f0', borderRadius: 16,
      padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f0f23', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ value, max, label, count }: { value: number; max: number; label: string; count: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: '0.8rem', color: '#374151', width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#818cf8)', borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', width: 28, textAlign: 'right', flexShrink: 0 }}>{count}</div>
    </div>
  );
}

function DayChart({ dailyViews }: { dailyViews: { date: string; count: number }[] }) {
  if (!dailyViews.length) return <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem 0' }}>No data yet</div>;
  const max = Math.max(...dailyViews.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px' }}>
      {dailyViews.map((d, i) => {
        const h = Math.max(4, Math.round((d.count / max) * 72));
        const dayLabel = new Date(d.date).toLocaleDateString('en', { weekday: 'short' });
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div title={`${d.count} views on ${d.date}`} style={{
              width: '100%', height: h,
              background: 'linear-gradient(180deg,#6366f1,#818cf8)',
              borderRadius: 4, cursor: 'default',
              transition: 'height 0.4s ease',
            }} />
            <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PortfolioAnalytics({ portfolioId, username }: PortfolioAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'analytics' | 'messages'>('analytics');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [aRes, mRes] = await Promise.all([
        fetch(`/api/analytics?portfolioId=${encodeURIComponent(portfolioId)}`),
        fetch(`/api/contact?username=${encodeURIComponent(username)}`),
      ]);
      if (aRes.ok) setAnalytics(await aRes.json());
      if (mRes.ok) {
        const d = await mRes.json();
        setMessages(d.messages || []);
      }
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [portfolioId, username]);

  useEffect(() => { load(); }, [load]);

  const mobileCount = analytics?.deviceBreakdown.find(d => d.device === 'mobile')?.count ?? 0;
  const desktopCount = analytics?.deviceBreakdown.find(d => d.device === 'desktop')?.count ?? 0;
  const totalDevice = mobileCount + desktopCount || 1;
  const maxReferrer = Math.max(...(analytics?.topReferrers.map(r => r.count) ?? [1]), 1);
  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#64748b', gap: 10 }}>
        <div style={{ width: 20, height: 20, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        Loading analytics…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f0f23', margin: 0 }}>Portfolio Analytics</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>Track who's viewing your portfolio</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3, gap: 2 }}>
            {(['analytics', 'messages'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontSize: '0.8rem', fontWeight: 600, padding: '0.35rem 0.9rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0f0f23' : '#64748b',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {t === 'messages' ? <MessageSquare size={13}/> : <BarChart2 size={13}/>}
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'messages' && unreadCount > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: 999, padding: '0.1rem 0.4rem', minWidth: 16, textAlign: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            style={{ width: 36, height: 36, border: '1px solid #e8e8f0', borderRadius: 10, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {tab === 'analytics' && (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard icon={<Eye size={16}/>} label="Total Views" value={analytics?.totalViews ?? 0} sub="All time" color="#6366f1" />
            <StatCard icon={<Users size={16}/>} label="Unique Visitors" value={analytics?.uniqueVisitors ?? 0} sub="Distinct IPs" color="#10b981" />
            <StatCard icon={<TrendingUp size={16}/>} label="Today" value={analytics?.todayViews ?? 0} sub="Views today" color="#f59e0b" />
            <StatCard icon={<Globe size={16}/>} label="This Week" value={analytics?.weekViews ?? 0} sub="Last 7 days" color="#3b82f6" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Daily chart */}
            <div style={{ background: '#fff', border: '1px solid #e8e8f0', borderRadius: 16, padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BarChart2 size={14} color="#6366f1"/> Last 7 Days
              </div>
              <DayChart dailyViews={analytics?.dailyViews ?? []} />
            </div>

            {/* Device breakdown */}
            <div style={{ background: '#fff', border: '1px solid #e8e8f0', borderRadius: 16, padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Monitor size={14} color="#6366f1"/> Device Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Monitor size={16} color="#6366f1" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: '#374151' }}>Desktop</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{Math.round((desktopCount / totalDevice) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((desktopCount / totalDevice) * 100)}%`, height: '100%', background: '#6366f1', borderRadius: 999 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', width: 24, textAlign: 'right' }}>{desktopCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone size={16} color="#10b981" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: '#374151' }}>Mobile</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{Math.round((mobileCount / totalDevice) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((mobileCount / totalDevice) * 100)}%`, height: '100%', background: '#10b981', borderRadius: 999 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', width: 24, textAlign: 'right' }}>{mobileCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top referrers */}
          {(analytics?.topReferrers?.length ?? 0) > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e8e8f0', borderRadius: 16, padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowUpRight size={14} color="#6366f1"/> Top Traffic Sources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {analytics!.topReferrers.map((r, i) => (
                  <MiniBar key={i} value={r.count} max={maxReferrer} label={r.referrer || 'direct'} count={r.count} />
                ))}
              </div>
            </div>
          )}

          {analytics?.totalViews === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📊</div>
              No views recorded yet. Share your portfolio to start tracking!
            </div>
          )}
        </>
      )}

      {tab === 'messages' && (
        <div>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💬</div>
              No messages yet. Visitors can contact you from your public portfolio.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((m) => (
                <div key={m.id} style={{
                  background: m.read ? '#fff' : '#f5f3ff',
                  border: `1px solid ${m.read ? '#e8e8f0' : '#c4b5fd'}`,
                  borderRadius: 14, padding: '1.1rem 1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                        {m.sender_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f0f23' }}>{m.sender_name}</div>
                        <a href={`mailto:${m.sender_email}`} style={{ fontSize: '0.75rem', color: '#6366f1', textDecoration: 'none' }}>{m.sender_email}</a>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {new Date(m.received_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>{m.message}</p>
                  <div style={{ marginTop: 10 }}>
                    <a href={`mailto:${m.sender_email}?subject=Re: Your message to ${username}`}
                       style={{ fontSize: '0.775rem', fontWeight: 600, color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Reply ↗
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
