import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UploadCloud, ArrowLeft, Layers, Sparkles } from 'lucide-react';

import CampusCvLogo from '../common/CampusCvLogo';

interface AdminHeaderProps {
  onOpenUploadModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminHeader({ onOpenUploadModal, activeTab, setActiveTab }: AdminHeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'library', label: 'Template Library' },
    { id: 'installed', label: 'Installed Templates' },
    { id: 'plans', label: 'Plans & Coupons' },
    { id: 'users', label: 'Users & Ledger' },
    { id: 'logs', label: 'Audit Logs' },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-40 text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <CampusCvLogo className="h-8 w-auto" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-purple-50 text-[#7C3AED] border border-purple-100 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono shadow-xs">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Enterprise Template Engine & Platform Pipeline</p>
          </div>
        </div>

        {/* Middle Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-500/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Template (.zip)</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-[10px] font-bold font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
