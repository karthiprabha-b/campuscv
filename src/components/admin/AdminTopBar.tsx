"use client";

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  onOpenUploadModal?: () => void;
}

export default function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  return (
    <header className="h-[64px] bg-white border-b border-[#EAEAEA] sticky top-0 z-30 px-8 flex items-center justify-between font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#111318] font-bricolage tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#667085] font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Compact Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates, users..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F9FB] border border-[#E7E9EE] rounded-lg text-[#111318] focus:bg-white focus:border-purple-600 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notifications Icon Button */}
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#F8F9FB] transition-colors relative cursor-pointer" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 bg-purple-600 rounded-full absolute top-2 right-2" />
        </button>

        {/* Admin Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-200">
          A
        </div>
      </div>
    </header>
  );
}
