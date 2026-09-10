"use client";

import React, { useState } from 'react';
import { Search, UploadCloud, SlidersHorizontal } from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';
import TemplateCard from './TemplateCard';

interface TemplateLibraryGridProps {
  templates: TemplateRecord[];
  onPreview: (template: TemplateRecord) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onDownloadZip: (template: TemplateRecord) => void;
  onOpenUploadModal: () => void;
  onEditMetadata?: (template: TemplateRecord) => void;
  onDuplicate?: (id: string) => void;
  onViewManifest?: (template: TemplateRecord) => void;
  onRevalidate?: (id: string) => void;
}

export default function TemplateLibraryGrid({
  templates,
  onPreview,
  onToggleStatus,
  onDelete,
  onDownloadZip,
  onOpenUploadModal,
  onEditMetadata,
  onDuplicate,
  onViewManifest,
  hideHeader = true,
}: TemplateLibraryGridProps & { hideHeader?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  const categories = ['All', 'Developer', 'Student', 'Designer', 'Minimalist'];

  const filtered = templates.filter((t) => {
    if (!t) return false;
    if (t.status === 'deleted' && selectedStatus !== 'deleted') return false;
    const q = searchQuery.toLowerCase();
    const name = (t.name || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const author = (t.author || '').toLowerCase();
    const id = (t.id || '').toLowerCase();
    const category = (t.category || '').toLowerCase();

    const matchesSearch = 
      name.includes(q) || 
      desc.includes(q) ||
      author.includes(q) ||
      id.includes(q);

    const matchesCat = selectedCategory === 'All' || category.includes(selectedCategory.toLowerCase());
    const matchesStatus = selectedStatus === 'all' ? t.status !== 'deleted' : t.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Optional Top Header & CTA Bar */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#111318] font-bricolage tracking-tight">Templates</h2>
            <p className="text-xs text-[#667085]">Manage and publish portfolio templates for your platform.</p>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Template</span>
          </button>
        </div>
      )}

      {/* Controls Bar: Search, Category Filters, Sort & Upload */}
      <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:bg-white focus:border-purple-600 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-[#667085] hover:text-[#111318] hover:bg-[#F8F9FB] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Upload CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Template</span>
          </button>
        </div>
      </div>

      {/* 3-Column Desktop Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-12 text-center space-y-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-10 h-10 mx-auto flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#111318] text-sm">No Matching Templates</h3>
            <p className="text-xs text-[#667085] max-w-sm mx-auto">
              Try adjusting your search query or category filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((t, idx) => (
            <TemplateCard
              key={t.id ? `${t.id}-${idx}` : `template-${idx}`}
              template={t}
              onPreview={onPreview}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onDownloadZip={onDownloadZip}
              onEditMetadata={onEditMetadata}
              onDuplicate={onDuplicate}
              onViewManifest={onViewManifest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
