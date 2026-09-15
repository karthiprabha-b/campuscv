"use client";

import React from "react";
import {
  Home,
  FolderGit2,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Cpu,
  Award,
  Mail,
  ExternalLink
} from "lucide-react";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800";

interface SidebarProps {
  data?: any;
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  isSectionVisible?: (sectionId: string) => boolean;
}

export default function Sidebar({
  data = {},
  activeSection,
  onSectionClick,
  isSectionVisible = () => true,
}: SidebarProps) {
  const name = data?.name || data?.fullName || data?.hero?.name || data?.profile?.name || data?.basics?.name || data?.personal?.name || "Alex Rivera";
  const email = data?.email || data?.ownerEmail || data?.contact?.email || data?.profile?.email || data?.basics?.email || "";
  
  const rawAvatarOverride = data?.contentOverrides?.['image:hero:avatar:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:avatar:0'] === 'string' ? data?.contentOverrides?.['image:hero:avatar:0'] : null) ||
    data?.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data?.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data?.imageOverrides?.['hero.avatarUrl'] ||
    data?.imageOverrides?.['hero.profileImage'] ||
    data?.imageOverrides?.['profileImage'] ||
    data?.imageOverrides?.['avatarUrl'];

  const avatar = rawAvatarOverride ||
    data?.profileImage ||
    data?.avatarUrl ||
    data?.avatar ||
    data?.photo ||
    data?.profilePhoto ||
    data?.hero?.profileImage ||
    data?.hero?.avatarUrl ||
    data?.about?.avatarUrl ||
    data?.about?.image ||
    data?.profile?.avatar ||
    data?.basics?.image ||
    DEFAULT_AVATAR;

  const projectCount = Array.isArray(data?.projects) 
    ? data.projects.length 
    : (Array.isArray(data?.portfolioProjects) 
        ? data.portfolioProjects.length 
        : (Array.isArray(data?.works) ? data.works.length : 0));

  const allNavItemsMap: Record<string, any> = {
    hero: { id: "hero", label: "Home", icon: Home },
    about: { id: "about", label: "About Me", icon: Users },
    education: { id: "education", label: "Education", icon: GraduationCap },
    experience: { id: "experience", label: "Experience", icon: Briefcase },
    projects: { id: "projects", label: "Projects", icon: FolderGit2, badge: projectCount > 0 ? String(projectCount) : undefined },
    skills: { id: "skills", label: "Skills", icon: Cpu },
    certificates: { id: "certificates", label: "Certificates", icon: Award },
    certifications: { id: "certificates", label: "Certificates", icon: Award },
    contact: { id: "contact", label: "Contact", icon: Mail },
  };

  const defaultNavOrder = [
    "hero",
    "about",
    "education",
    "experience",
    "projects",
    "skills",
    "certificates",
    "contact"
  ];

  const hasCustomOrder = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0;
  const rawNavOrder = hasCustomOrder 
    ? data.sectionOrder 
    : (Array.isArray(data?.sections) && data.sections.length > 0 ? data.sections : defaultNavOrder);

  const orderedNavIds: string[] = [];
  const seenNav = new Set<string>();

  rawNavOrder.forEach((rawId: any) => {
    const rawVal = typeof rawId === 'object' && rawId !== null ? (rawId.id || rawId.name || '') : rawId;
    let id = String(rawVal || '').toLowerCase().trim();
    if (id === 'home' || id === 'intro') id = 'hero';
    if (id === 'certifications' || id === 'awards') id = 'certificates';
    if (id === 'timeline' || id === 'work') id = 'experience';
    if (id === 'academics') id = 'education';
    if (id === 'portfolio') id = 'projects';
    if (id === 'tech') id = 'skills';
    if (allNavItemsMap[id] && !seenNav.has(id)) {
      orderedNavIds.push(id);
      seenNav.add(id);
    }
  });

  if (!hasCustomOrder) {
    defaultNavOrder.forEach((id) => {
      if (!seenNav.has(id)) {
        orderedNavIds.push(id);
        seenNav.add(id);
      }
    });
  }

  const navItems = orderedNavIds
    .map(id => allNavItemsMap[id])
    .filter(item => item && isSectionVisible(item.id));

  const initials = name ? name.trim().split(/\s+/).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : "CV";
  
  const customLogo = data?.logo || 
    data?.brandLogo || 
    data?.profile?.logo || 
    data?.hero?.logo ||
    data?.contentOverrides?.['image:sidebar:logo:0']?.src ||
    (typeof data?.contentOverrides?.['image:sidebar:logo:0'] === 'string' ? data?.contentOverrides?.['image:sidebar:logo:0'] : null);

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30 select-none">
      {/* Top Navigation Area */}
      <div className="p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Brand Header */}
        <a 
          href="#hero" 
          className="flex items-center gap-3 px-1 py-1 cursor-pointer group no-underline" 
          onClick={(e) => {
            onSectionClick("hero");
          }}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0 overflow-hidden transition-transform group-hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, var(--brand-700, #6941C6) 0%, var(--brand-500, #7F56D9) 100%)',
              boxShadow: '0 0 0 4px rgba(127, 86, 217, 0.15)'
            }}
            data-cv="brand.logo"
            data-node-id="image:sidebar:logo:0"
          >
            {customLogo ? (
              <img src={customLogo} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-extrabold text-sm tracking-tight text-white select-none">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span 
              className="font-bold text-gray-900 tracking-tight text-base font-heading block leading-tight truncate group-hover:text-brand-600 transition-colors"
              data-cv="brand.name"
              data-node-id="text:sidebar:name:0"
            >
              {name}
            </span>
            <span className="text-xs text-gray-500 font-medium truncate block">
              Portfolio
            </span>
          </div>
        </a>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  onSectionClick(item.id);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all text-left group cursor-pointer no-underline ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold border border-brand-200/60 shadow-2xs"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-brand-200/70 text-brand-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">
                {name}
              </p>
              {email && (
                <p className="text-xs text-gray-500 truncate">
                  {email}
                </p>
              )}
            </div>
          </div>
          <a
            href="#contact"
            onClick={() => onSectionClick("contact")}
            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-white rounded-md transition-all flex-shrink-0 cursor-pointer"
            title="View Contact Details"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
