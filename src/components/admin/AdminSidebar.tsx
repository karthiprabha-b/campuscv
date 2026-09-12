"use client";

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FolderGit2, 
  CheckSquare, 
  CreditCard, 
  Users, 
  FileText, 
  Settings,
  UploadCloud,
  Sparkles,
  Receipt
} from 'lucide-react';
import CampusCvLogo from '../common/CampusCvLogo';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUploadModal: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, onOpenUploadModal }: AdminSidebarProps) {
  const sections: SidebarSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { id: 'library', label: 'Templates', icon: FolderGit2 },
        { id: 'installed', label: 'Installed Templates', icon: CheckSquare },
      ]
    },
    {
      title: 'MONETIZATION',
      items: [
        { id: 'plans', label: 'Plans & Coupons', icon: CreditCard },
      ]
    },
    {
      title: 'USERS & FINANCE',
      items: [
        { id: 'users', label: 'Users & Ledger', icon: Users, badge: 'Finance' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'logs', label: 'Audit Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-[240px] shrink-0 min-h-screen bg-white border-r border-slate-200/90 flex flex-col justify-between fixed top-0 left-0 z-40 select-none font-sans shadow-sm">
      <div className="flex flex-col gap-5 p-5">
        
        {/* Top Brand Header with CampusCV Multi-Color Logo */}
        <div className="flex flex-col gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CampusCvLogo />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 font-mono">
              Admin
            </span>
          </div>
        </div>

        {/* Upload Action Button with 30-40% Brand Orange Gradient */}
        <button
          onClick={onOpenUploadModal}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all cursor-pointer active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Template</span>
        </button>

        {/* Navigation Sections */}
        <nav className="space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 font-mono">
                {sec.title}
              </h4>
              <div className="space-y-0.5 pt-0.5">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all cursor-pointer relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-50 to-purple-50 text-orange-700 font-bold border border-orange-200/70 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-orange-500 rounded-r" />
                        )}
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-600 stroke-[2.5]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Account Footer with Sign Out */}
      <div className="p-4 border-t border-slate-200/90 bg-slate-50/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate font-bricolage">Admin Account</p>
            <p className="text-[10px] text-orange-600 font-bold font-mono truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('campuscv_admin_session');
              window.location.href = '/admin/login';
            }
          }}
          title="Sign Out of Admin Console"
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
