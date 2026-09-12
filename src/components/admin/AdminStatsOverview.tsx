"use client";

import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  CreditCard, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  FileUp, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Database, 
  Layers 
} from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';
import { loadAdminUsersAndTransactions, AdminDataSummary } from '../../utils/adminStatsHelper';

interface AdminStatsOverviewProps {
  templates: TemplateRecord[];
  onOpenUploadModal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function AdminStatsOverview({ templates, onOpenUploadModal, onNavigateTab }: AdminStatsOverviewProps) {
  const totalTemplates = templates.length;
  const [dataSummary, setDataSummary] = useState<AdminDataSummary | null>(null);

  useEffect(() => {
    loadAdminUsersAndTransactions().then(setDataSummary).catch(console.error);

    const handleDataUpdate = () => {
      loadAdminUsersAndTransactions().then(setDataSummary).catch(console.error);
    };

    window.addEventListener('campuscv:plans-updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    window.addEventListener('portly_portfolio_updated', handleDataUpdate);
    window.addEventListener('auth_state_changed', handleDataUpdate);

    return () => {
      window.removeEventListener('campuscv:plans-updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
      window.removeEventListener('portly_portfolio_updated', handleDataUpdate);
      window.removeEventListener('auth_state_changed', handleDataUpdate);
    };
  }, []);

  const activeSubscribers = dataSummary ? dataSummary.activePaidCount : 5;
  const grossVolume = dataSummary ? dataSummary.totalRevenue : 1206;

  return (
    <div className="space-y-7 text-left font-sans">
      
      {/* Metric Cards Grid - 30-40% Orange & Brand Multi-Color Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Templates (Orange Gradient Accent) */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl space-y-1.5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Templates Catalog
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-extrabold text-slate-900 font-bricolage">
            {totalTemplates}
          </div>
          <div className="text-xs text-orange-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active &amp; Ready to Deploy</span>
          </div>
        </div>

        {/* Metric 2: Active Users (Purple Accent) */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl space-y-1.5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Active Subscribers
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-extrabold text-purple-700 font-bricolage">
            {activeSubscribers}
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Verified paid students</span>
          </div>
        </div>

        {/* Metric 3: Revenue (Orange/Coral Accent) */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl space-y-1.5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Gross Volume
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-extrabold text-orange-600 font-bricolage">
            ₹{grossVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {dataSummary?.transactions.length || 0} transactions processed
          </div>
        </div>

        {/* Metric 4: Storage / CDN (Blue Accent) */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl space-y-1.5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Edge Storage
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-[28px] font-extrabold text-blue-700 font-bricolage">
            5.9 MB
          </div>
          <div className="text-xs text-emerald-600 font-bold">
            99.99% CDN uptime
          </div>
        </div>

      </div>

      {/* Quick Actions Bar with 30-40% Orange buttons */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Quick Actions &amp; Operations</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
          >
            <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Template</span>
          </button>
          
          <button
            onClick={() => onNavigateTab?.('plans')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>Add / Edit Plan</span>
          </button>

          <button
            onClick={() => onNavigateTab?.('plans')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Ticket className="w-4 h-4 text-orange-500" />
            <span>Create Coupon</span>
          </button>

          <button
            onClick={() => onNavigateTab?.('users')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 hover:border-purple-400 text-purple-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-4 h-4 text-purple-600" />
            <span>View Users &amp; Ledger</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Recent Platform Activity</span>
          </h3>
          <button onClick={() => onNavigateTab?.('logs')} className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors cursor-pointer">
            View all logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs text-slate-600">
          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/60">
                <FileUp className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">stu-creative-bold (v2.0) packaged</p>
                <p className="text-slate-500">Student Creative Bold with dynamic name sync and zero flicker</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Just now</span>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/60">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">User subscription active</p>
                <p className="text-slate-500">Muthukumaran Velayutham (30-days Pro Pass)</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Today</span>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">New portfolio published</p>
                <p className="text-slate-500">Karthikeyan Prabakaran /karthikeyan</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Yesterday</span>
          </div>
        </div>
      </div>

    </div>
  );
}
