"use client";

import React from 'react';
import { Search, Bell, Sparkles, UploadCloud } from 'lucide-react';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  onOpenUploadModal?: () => void;
}

export default function AdminTopBar({ title, subtitle, onOpenUploadModal }: AdminTopBarProps) {
  return (
    <header className="h-[68px] bg-white border-b border-slate-200/90 sticky top-0 z-30 px-8 flex items-center justify-between font-sans shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 font-bricolage tracking-tight">{title}</h1>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3.5">
        {/* Compact Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates, users, orders..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Quick Upload Action */}
        {onOpenUploadModal && (
          <button
            onClick={onOpenUploadModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload</span>
          </button>
        )}

        {/* Notifications Icon Button with Orange Notification Dot */}
        <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-orange-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* Admin Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
          A
        </div>
      </div>
    </header>
  );
}
