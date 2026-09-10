"use client";

import React from 'react';
import { UploadCloud, CreditCard, Ticket, Clock, CheckCircle2, UserPlus, FileUp } from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';

interface AdminStatsOverviewProps {
  templates: TemplateRecord[];
  onOpenUploadModal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function AdminStatsOverview({ templates, onOpenUploadModal, onNavigateTab }: AdminStatsOverviewProps) {
  const totalTemplates = templates.length;

  return (
    <div className="space-y-8 text-left font-sans">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Templates */}
        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs hover:border-purple-200 transition-all">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">
            Templates
          </span>
          <div className="text-2xl sm:text-[28px] font-bold text-[#111318] font-bricolage">
            {totalTemplates}
          </div>
          <div className="text-xs text-emerald-600 font-medium pt-0.5">
            +1 this month
          </div>
        </div>

        {/* Metric 2: Active Users */}
        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs hover:border-purple-200 transition-all">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">
            Active Users
          </span>
          <div className="text-2xl sm:text-[28px] font-bold text-[#111318] font-bricolage">
            1
          </div>
          <div className="text-xs text-emerald-600 font-medium pt-0.5">
            +12% growth
          </div>
        </div>

        {/* Metric 3: Revenue */}
        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs hover:border-purple-200 transition-all">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">
            Revenue
          </span>
          <div className="text-2xl sm:text-[28px] font-bold text-[#111318] font-bricolage">
            ₹99
          </div>
          <div className="text-xs text-[#667085] font-medium pt-0.5">
            This month
          </div>
        </div>

        {/* Metric 4: Storage */}
        <div className="bg-white border border-[#E7E9EE] p-5 rounded-[16px] space-y-1 shadow-xs hover:border-purple-200 transition-all">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667085]">
            Storage
          </span>
          <div className="text-2xl sm:text-[28px] font-bold text-[#111318] font-bricolage">
            5.9 MB
          </div>
          <div className="text-xs text-[#667085] font-medium pt-0.5">
            CDN usage
          </div>
        </div>

      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-[#111318] uppercase tracking-wider font-mono">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Template</span>
          </button>
          
          <button
            onClick={() => onNavigateTab?.('plans')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-purple-600" />
            <span>Add Plan</span>
          </button>

          <button
            onClick={() => onNavigateTab?.('plans')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-purple-600" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111318] uppercase tracking-wider font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Recent Activity</span>
          </h3>
          <button onClick={() => onNavigateTab?.('logs')} className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors">
            View all logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs text-[#667085]">
          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FileUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-[#111318]">Template uploaded</p>
                <p className="text-slate-500">Product Designer Portfolio v1.0</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">2 hours ago</span>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-[#111318]">New user registered</p>
                <p className="text-slate-500">alex@stanford.edu</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">4 hours ago</span>
          </div>

          <div className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-[#111318]">Plan updated</p>
                <p className="text-slate-500">Yearly Growth Pack (₹999)</p>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Yesterday</span>
          </div>
        </div>
      </div>

    </div>
  );
}
