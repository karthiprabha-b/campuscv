"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Download, 
  Trash2, 
  Power, 
  Copy,
  Edit3,
  FileCode,
  MoreHorizontal
} from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';

interface TemplateCardProps {
  template: TemplateRecord;
  onPreview: (template: TemplateRecord) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onDownloadZip: (template: TemplateRecord) => void;
  onEditMetadata?: (template: TemplateRecord) => void;
  onDuplicate?: (id: string) => void;
  onViewManifest?: (template: TemplateRecord) => void;
}

export default function TemplateCard({
  template,
  onPreview,
  onToggleStatus,
  onDelete,
  onDownloadZip,
  onEditMetadata,
  onDuplicate,
  onViewManifest,
}: TemplateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = template.status === 'active';

  const sectionsCount = template.sectionsCount || (template.sections ? template.sections.length : 6);
  const fieldsCount = template.fieldCounts?.total || 42;

  function getDistinctThumbnail(): string {
    const id = (template.id || '').toLowerCase();
    const cat = (template.category || '').toLowerCase();
    const fallback = (id.includes('cs') || id.includes('slash') || cat.includes('developer') || id.includes('software') || id.includes('engineer'))
      ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'
      : (id.includes('student') || cat.includes('student'))
        ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';

    const thumb = template.thumbnail?.trim();
    if (thumb) {
      if (thumb.startsWith('data:') || thumb.startsWith('http://') || thumb.startsWith('https://')) {
        return thumb;
      }
      if (thumb.startsWith('/')) {
        return thumb;
      }
      // Relative filename like "thumbnail.png" -> resolve via template API endpoint
      return `/api/template-files?templateId=${encodeURIComponent(template.id)}&file=${encodeURIComponent(thumb)}`;
    }
    return fallback;
  }

  const [imgSrc, setImgSrc] = useState(getDistinctThumbnail());

  useEffect(() => {
    setImgSrc(getDistinctThumbnail());
  }, [template.thumbnail, template.id, template.category]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-[#E7E9EE] rounded-[16px] overflow-hidden flex flex-col justify-between hover:border-purple-300 shadow-xs hover:shadow-md transition-all min-h-[410px] text-left font-sans group relative">
      
      {/* Top 16:9 Thumbnail Area */}
      <div className="w-full aspect-[16/9] bg-slate-100 relative overflow-hidden shrink-0 border-b border-[#E7E9EE]">
        <img 
          src={imgSrc} 
          alt={template.name} 
          onError={() => {
            const id = (template.id || '').toLowerCase();
            const cat = (template.category || '').toLowerCase();
            const fallback = (id.includes('cs') || cat.includes('developer') || id.includes('software') || id.includes('engineer'))
              ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'
              : (id.includes('student') || cat.includes('student'))
                ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
                : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
        />

        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            {isActive ? 'Active' : 'Disabled'}
          </span>
        </div>

        {/* Category & Plan Tier Tags */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-white/90 backdrop-blur-md text-purple-700 rounded-md border border-purple-100 shadow-xs">
            {template.category}
          </span>
          {(() => {
            const rawTier = (template.planTier || (template.isPremium ? 'yearly' : 'monthly')).toLowerCase();
            const tierBadge =
              rawTier === 'free' ? 'bg-zinc-900 text-white border-zinc-700' :
              rawTier === 'quarterly' ? 'bg-cyan-600 text-white border-cyan-500' :
              (rawTier === 'yearly' || rawTier === 'pro') ? 'bg-amber-600 text-white border-amber-500' :
              'bg-violet-700 text-white border-violet-600';
            return (
              <span className={`text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${tierBadge}`}>
                {rawTier}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-[#111318] truncate font-bricolage" title={template.name}>
              {template.name}
            </h3>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">v{template.version}</span>
          </div>
          
          <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
            {template.description || `${template.name} portfolio template.`}
          </p>
        </div>

        {/* Metadata stats */}
        <div className="text-[11px] font-mono text-[#667085] flex items-center gap-3 pt-1 border-t border-slate-100">
          <span>{sectionsCount} sections</span>
          <span>&bull;</span>
          <span>{fieldsCount} fields</span>
        </div>
      </div>

      {/* Action Buttons Footer (Primary Edit, Secondary Preview, ... Menu) */}
      <div className="p-3 border-t border-[#E7E9EE] bg-[#F8F9FB] flex items-center justify-between gap-2 shrink-0">
        
        <div className="flex items-center gap-2">
          {/* Primary Edit */}
          {onEditMetadata && (
            <button
              onClick={() => onEditMetadata(template)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Secondary Preview */}
          <button
            onClick={() => onPreview(template)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* ... More Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            title="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-44 bg-white border border-[#E7E9EE] rounded-xl shadow-lg p-1.5 z-30 space-y-0.5 text-xs">
              {onDuplicate && (
                <button
                  onClick={() => { onDuplicate(template.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors text-left"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
              )}

              {onViewManifest && (
                <button
                  onClick={() => { onViewManifest(template); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors text-left"
                >
                  <FileCode className="w-3.5 h-3.5" /> View Manifest
                </button>
              )}

              <button
                onClick={() => { onDownloadZip(template); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5" /> Export ZIP
              </button>

              <button
                onClick={() => { onToggleStatus(template.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors text-left"
              >
                <Power className="w-3.5 h-3.5" /> {isActive ? 'Disable' : 'Activate'}
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => { onDelete(template.id, template.name); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
