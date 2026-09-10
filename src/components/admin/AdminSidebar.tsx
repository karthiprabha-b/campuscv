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
  UploadCloud
} from 'lucide-react';
import CampusCvLogo from '../common/CampusCvLogo';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUploadModal: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, onOpenUploadModal }: AdminSidebarProps) {
  const sections = [
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
      title: 'USERS',
      items: [
        { id: 'users', label: 'Users & Ledger', icon: Users },
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
    <aside className="w-[240px] shrink-0 min-h-screen bg-white border-r border-[#E7E9EE] flex flex-col justify-between fixed top-0 left-0 z-40 select-none font-sans">
      <div className="flex flex-col gap-6 p-5">
        
        {/* Top Brand Header */}
        <div className="flex flex-col gap-1.5 pb-3 border-b border-[#F0F1F5]">
          <div className="flex items-center">
            <CampusCvLogo />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 font-mono">
            Admin Console
          </span>
        </div>

        {/* Upload Action Button */}
        <button
          onClick={onOpenUploadModal}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Template</span>
        </button>

        {/* Navigation Sections */}
        <nav className="space-y-5">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="text-[11px] font-bold text-[#98A2B3] uppercase tracking-wider px-2 font-mono">
                {sec.title}
              </h4>
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-semibold'
                          : 'text-[#667085] hover:text-[#111318] hover:bg-[#F8F9FB] font-medium'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-purple-600 rounded-r" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Account Footer with Logout */}
      <div className="p-4 border-t border-[#E7E9EE] bg-[#F8F9FB] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#111318] truncate font-bricolage">Admin Account</p>
            <p className="text-[10px] text-[#667085] font-semibold font-mono truncate">Super Admin</p>
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
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
