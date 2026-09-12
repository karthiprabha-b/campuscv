"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  Layers, 
  Moon, 
  Code2, 
  Palette, 
  Briefcase, 
  GraduationCap, 
  Database 
} from 'lucide-react';
import AppHeader from '../../components/common/AppHeader';
import AppFooter from '../../components/common/AppFooter';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { TemplateRecord } from '../../types/adminTemplate';
import TemplatePreviewModal from '../../components/admin/TemplatePreviewModal';
import { mockAuth } from '../../utils/mockDb';
import { supabase } from '../../lib/supabase/client';

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Layers },
  { id: 'engineering', name: 'Engineering & CS', icon: Code2 },
  { id: 'designer', name: 'UI/UX & Design', icon: Palette },
  { id: 'data', name: 'Data & AI', icon: Database },
  { id: 'student', name: 'Students & Placements', icon: GraduationCap },
  { id: 'business', name: 'Business & Management', icon: Briefcase },
];

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRecord | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check auth status
    const checkAuth = async () => {
      const local = mockAuth.getCurrentUser();
      if (local) {
        setIsLoggedIn(true);
      } else {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          setIsLoggedIn(!!user);
        } catch {
          setIsLoggedIn(false);
        }
      }
    };
    checkAuth();

    // 2. Load templates from canonical server registry
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const syncedList = await adminTemplateDb.syncWithServerRegistryAsync(false);
        setTemplates(syncedList.filter(t => (t.status || 'active') === 'active'));
      } catch (err) {
        console.error('Failed to load templates:', err);
        setTemplates(adminTemplateDb.getActiveTemplates());
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Plan tier sort order: free/trial → monthly → quarterly → yearly
  const PLAN_TIER_ORDER: Record<string, number> = {
    'free': 0,
    'trial': 1,
    'monthly': 1,
    'quarterly': 2,
    'yearly': 3,
    'pro': 3,
  };
  const getTemplateTierOrder = (t: TemplateRecord): number => {
    const tier = (t.planTier || 'free').toLowerCase();
    return PLAN_TIER_ORDER[tier] ?? 1;
  };

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || 
      t.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'engineering' && (t.category.toLowerCase().includes('engineer') || t.category.toLowerCase().includes('developer') || t.category.toLowerCase().includes('cs'))) ||
      (selectedCategory === 'designer' && (t.category.toLowerCase().includes('design') || t.category.toLowerCase().includes('creative'))) ||
      (selectedCategory === 'student' && (t.category.toLowerCase().includes('student') || t.category.toLowerCase().includes('placement') || t.category.toLowerCase().includes('academic')));
    
    const matchesSearch = searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  // Sort: free/trial → monthly → quarterly → yearly
  }).sort((a, b) => getTemplateTierOrder(a) - getTemplateTierOrder(b));

  const handleUseTemplate = (template: TemplateRecord) => {
    if (isLoggedIn) {
      router.push(`/dashboard?selectedTemplate=${template.id}`);
    } else {
      router.push(`/auth/signup?templateId=${template.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-dm-sans overflow-x-hidden antialiased">
      {/* 01: Header */}
      <AppHeader />

      <main className="pt-24 pb-24 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200 text-purple-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Recruiter-Tested Layouts</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05] font-bricolage">
            Explore Portfolio Templates
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal">
            Choose a professionally designed, responsive template tailored for your industry. Preview live on any device and start building instantly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by role, skill, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all shadow-xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-slate-100 border border-slate-200/80 shadow-xs">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                        : 'text-slate-600 hover:text-purple-700 hover:bg-white/90'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 font-medium text-sm">Loading available templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border border-slate-200 max-w-xl mx-auto p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-bricolage">No templates found</h3>
            <p className="text-sm text-slate-500">
              No templates matched &quot;{searchQuery}&quot;. Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-5 py-2.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm hover:bg-purple-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const thumbnailSrc = template.thumbnail || '/templates/cs/thumbnail.png';

              return (
                <div
                  key={template.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 hover:border-purple-200 shadow-xs hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Thumbnail Box with Hover Actions */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={thumbnailSrc}
                      alt={template.name}
                      onError={(e) => {
                        // Fallback image
                        (e.currentTarget as HTMLImageElement).src = '/templates/cs/thumbnail.png';
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge Overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[11px] border border-slate-200 shadow-xs capitalize">
                        {template.category}
                      </span>
                      {(() => {
                        const rawTier = (template.planTier || (template.isPremium ? 'yearly' : 'monthly')).toLowerCase();
                        const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';
                        return (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wide text-white shadow-xs ${
                            planTier === 'free'
                              ? 'bg-emerald-600/90'
                              : planTier === 'monthly'
                                ? 'bg-sky-600/90'
                                : planTier === 'quarterly'
                                  ? 'bg-indigo-600/90'
                                  : 'bg-violet-700/90'
                          }`}>
                            {planTier}
                          </span>
                        );
                      })()}
                      {template.supportsDarkMode && (
                        <span className="px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] flex items-center gap-1">
                          <Moon className="w-3 h-3 text-purple-400" />
                          Dark
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-600 font-mono text-[10px] font-semibold border border-slate-200">
                        v{template.version}
                      </span>
                    </div>

                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(template)}
                        className="px-4 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg hover:bg-purple-50 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-purple-600" />
                        <span>Live Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        className="px-4 py-2.5 rounded-full bg-purple-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg hover:bg-purple-700 transition-all cursor-pointer"
                      >
                        <span>Use This</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight font-bricolage group-hover:text-purple-600 transition-colors">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Tags List */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1.5">
                        {template.tags?.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Card Actions */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(template)}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-600" />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(template)}
                          className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <span>Use Template</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 03: Live Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {/* 04: Footer */}
      <AppFooter />
    </div>
  );
}
