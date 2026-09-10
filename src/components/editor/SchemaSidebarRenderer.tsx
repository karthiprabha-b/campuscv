"use client";

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  ChevronDown, 
  ChevronRight, 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  X, 
  Check, 
  Tag, 
  Layers, 
  User, 
  Share2, 
  Briefcase, 
  Code, 
  Award, 
  GraduationCap 
} from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';
import { EditorSchema, EditorSectionSchema, EditorFieldSchema, deriveSchemaFromData } from '../../types/schema';
import { defaultEditorSchema } from '../../utils/defaultEditorSchema';
import { handleImageUpload, deleteServerAsset } from '../../utils/imageUploadStorage';

interface ImageFieldProps {
  field: EditorFieldSchema;
  val: string;
  onValueChange: (newVal: string) => void;
  fieldId: string;
}

function ImageField({ field, val, onValueChange, fieldId }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fStr = `${fieldId || ''} ${field.key || ''} ${field.label || ''}`.toLowerCase();
      const category = (fStr.includes('avatar') || fStr.includes('profile') || fStr.includes('photo'))
        ? 'avatar'
        : (fStr.includes('project') || fStr.includes('work'))
        ? 'projects'
        : (fStr.includes('hero') || fStr.includes('banner'))
        ? 'banners'
        : 'general';
      handleImageUpload(
        file,
        () => {},
        (finalUrl) => { if (finalUrl) onValueChange(finalUrl); },
        { 
          category,
          oldUrl: val,
          replace: true
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
        {field.label}
      </label>
      <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-xl">
        <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center">
          {val ? (
            <img src={val} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-5 h-5 text-zinc-500" />
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-grow">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Upload className="w-3 h-3" />
              <span>{val ? 'Replace' : 'Upload'}</span>
            </button>
            {val && (
              <button
                type="button"
                onClick={() => {
                  if (val && val.includes('/uploads/users/')) {
                    deleteServerAsset(val);
                  }
                  onValueChange('');
                }}
                className="px-2 py-1 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 text-xs font-semibold rounded-lg transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileRef}
            onChange={handleFile}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

interface TagsFieldProps {
  field: EditorFieldSchema;
  tagsList: string[];
  onTagsChange: (newTags: string[]) => void;
  fieldId: string;
}

function TagsField({ field, tagsList, onTagsChange, fieldId }: TagsFieldProps) {
  const [currentInput, setCurrentInput] = useState('');

  const handleAddTag = () => {
    if (!currentInput.trim()) return;
    onTagsChange([...(tagsList || []), currentInput.trim()]);
    setCurrentInput('');
  };

  const handleRemoveTag = (idx: number) => {
    const updated = [...(tagsList || [])];
    updated.splice(idx, 1);
    onTagsChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
        {field.label}
      </label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-900/90 border border-zinc-800 rounded-xl min-h-[42px]">
        {(tagsList || []).map((t, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium rounded-lg"
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(idx)}
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-grow min-w-[120px]">
          <input
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="+ Add tag & press Enter"
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none px-1 py-0.5"
          />
        </div>
      </div>
    </div>
  );
}

interface SchemaSidebarRendererProps {
  schema: EditorSchema;
  portfolio: PortfolioData;
  onPortfolioChange: (updated: PortfolioData) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  expandedSection: string | null;
  setExpandedSection: (sectionId: string | null) => void;
}

export default function SchemaSidebarRenderer({
  schema,
  portfolio,
  onPortfolioChange,
  selectedElementId,
  setSelectedElementId,
  expandedSection,
  setExpandedSection
}: SchemaSidebarRendererProps) {
  // Ensure safe array normalization for schema
  const safeSchema: EditorSchema = React.useMemo(() => {
    let list: any = schema;
    if (list && typeof list === 'object' && !Array.isArray(list)) {
      list = list.sections || list.editorSchema || list.schema || list.default;
    }
    if (Array.isArray(list) && list.length > 0) return list;
    if (Array.isArray(defaultEditorSchema) && defaultEditorSchema.length > 0) return defaultEditorSchema;
    return deriveSchemaFromData(portfolio);
  }, [schema, portfolio]);

  // Helper to read nested property path from portfolio (e.g. "socialLinks.github", "name", "projects[0].title")
  const getFieldValue = (path: string, itemObj?: any): any => {
    if (itemObj) {
      return itemObj[path] !== undefined ? itemObj[path] : '';
    }

    if (path.startsWith('socialLinks.')) {
      const sub = path.split('.')[1];
      return portfolio.socialLinks?.[sub as keyof typeof portfolio.socialLinks] || '';
    }

    return (portfolio as any)[path] !== undefined ? (portfolio as any)[path] : '';
  };

  // Helper to set nested property path in portfolio
  const updateFieldValue = (path: string, value: any, itemIdx?: number, sectionId?: string) => {
    const updated = { ...portfolio };

    if (itemIdx !== undefined && sectionId) {
      const currentList = Array.isArray((updated as any)[sectionId]) ? [...(updated as any)[sectionId]] : [];
      if (currentList[itemIdx]) {
        currentList[itemIdx] = { ...currentList[itemIdx], [path]: value };
        (updated as any)[sectionId] = currentList;
      }
      onPortfolioChange(updated);
      return;
    }

    if (path.startsWith('socialLinks.')) {
      const sub = path.split('.')[1];
      updated.socialLinks = { ...(updated.socialLinks || {}), [sub]: value };
    } else {
      (updated as any)[path] = value;
    }

    onPortfolioChange(updated);
  };

  // Array operations
  const handleAddItem = (section: EditorSectionSchema) => {
    const updated = { ...portfolio };
    const list = Array.isArray((updated as any)[section.id]) ? [...(updated as any)[section.id]] : [];

    const newItem: Record<string, any> = {
      id: `${section.id}-${Date.now()}`
    };

    (section.fields || []).forEach(f => {
      if (f.type === 'tags') newItem[f.key] = ['React', 'TypeScript'];
      else if (f.key === 'title') newItem[f.key] = 'New ' + (section.itemLabel || 'Item');
      else if (f.key === 'role') newItem[f.key] = 'New Role';
      else if (f.key === 'name') newItem[f.key] = 'New Item';
      else newItem[f.key] = '';
    });

    list.push(newItem);
    (updated as any)[section.id] = list;
    onPortfolioChange(updated);
  };

  const handleRemoveItem = (sectionId: string, idx: number) => {
    const updated = { ...portfolio };
    const list = Array.isArray((updated as any)[sectionId]) ? [...(updated as any)[sectionId]] : [];
    list.splice(idx, 1);
    (updated as any)[sectionId] = list;
    onPortfolioChange(updated);
  };

  const handleDuplicateItem = (sectionId: string, idx: number) => {
    const updated = { ...portfolio };
    const list = Array.isArray((updated as any)[sectionId]) ? [...(updated as any)[sectionId]] : [];
    if (list[idx]) {
      const dup = { ...list[idx], id: `${sectionId}-${Date.now()}` };
      list.splice(idx + 1, 0, dup);
      (updated as any)[sectionId] = list;
      onPortfolioChange(updated);
    }
  };

  const handleMoveItem = (sectionId: string, idx: number, direction: 'up' | 'down') => {
    const updated = { ...portfolio };
    const list = Array.isArray((updated as any)[sectionId]) ? [...(updated as any)[sectionId]] : [];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      (updated as any)[sectionId] = list;
      onPortfolioChange(updated);
    }
  };

  // Section Icon Mapper
  const getSectionIcon = (id: string) => {
    const s = id.toLowerCase();
    if (s.includes('profile') || s.includes('hero')) return <User className="w-4 h-4 text-purple-400" />;
    if (s.includes('social')) return <Share2 className="w-4 h-4 text-cyan-400" />;
    if (s.includes('proj')) return <Briefcase className="w-4 h-4 text-emerald-400" />;
    if (s.includes('exp') || s.includes('timeline')) return <Layers className="w-4 h-4 text-amber-400" />;
    if (s.includes('skill')) return <Code className="w-4 h-4 text-rose-400" />;
    if (s.includes('cert')) return <Award className="w-4 h-4 text-indigo-400" />;
    if (s.includes('edu')) return <GraduationCap className="w-4 h-4 text-blue-400" />;
    return <Layers className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="space-y-3 p-1">
      {safeSchema.map(section => {
        const isExpanded = expandedSection === section.id;

        return (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden transition-all duration-200 shadow-sm"
          >
            {/* Accordion Section Header */}
            <button
              type="button"
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                {getSectionIcon(section.id)}
                <span className="text-sm font-bold text-zinc-100">{section.title}</span>
                {section.type === 'array' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold rounded-full">
                    {Array.isArray((portfolio as any)[section.id]) ? (portfolio as any)[section.id].length : 0}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {/* Accordion Content Body */}
            {isExpanded && (
              <div className="p-4 border-t border-zinc-800/80 space-y-4 bg-zinc-950/40">
                {section.type === 'object' || !section.type ? (
                  // Render Object Fields
                  (section.fields || []).map(field => {
                    const fieldId = `input-${section.id}-${field.key}`;
                    const val = getFieldValue(field.key);

                    if (field.type === 'image') {
                      return (
                        <div key={field.key} id={fieldId}>
                          <ImageField
                            field={field}
                            val={val}
                            onValueChange={newVal => updateFieldValue(field.key, newVal)}
                            fieldId={fieldId}
                          />
                        </div>
                      );
                    }

                    if (field.type === 'tags') {
                      const tagsArr = Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',') : []);
                      return (
                        <div key={field.key} id={fieldId}>
                          <TagsField
                            field={field}
                            tagsList={tagsArr}
                            onTagsChange={newTags => updateFieldValue(field.key, newTags)}
                            fieldId={fieldId}
                          />
                        </div>
                      );
                    }

                    if (field.type === 'textarea') {
                      return (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                            {field.label}
                          </label>
                          <textarea
                            id={fieldId}
                            rows={3}
                            value={val}
                            onChange={e => updateFieldValue(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-zinc-900/90 border border-zinc-800 text-white text-xs rounded-xl p-3 placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-y"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                          {field.label}
                        </label>
                        <input
                          id={fieldId}
                          type={field.type === 'url' ? 'url' : 'text'}
                          value={val}
                          onChange={e => updateFieldValue(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-zinc-900/90 border border-zinc-800 text-white text-xs rounded-xl p-3 placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                        />
                      </div>
                    );
                  })
                ) : (
                  // Render Array Items List
                  <div className="space-y-3">
                    {Array.isArray((portfolio as any)[section.id]) &&
                      (portfolio as any)[section.id].map((itemObj: any, idx: number) => (
                        <div
                          key={itemObj.id || idx}
                          className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3 relative group/item"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="text-xs font-bold text-purple-400 font-mono">
                              #{idx + 1} {itemObj.title || itemObj.name || itemObj.role || section.itemLabel || 'Item'}
                            </span>
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveItem(section.id, idx, 'up')}
                                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < (portfolio as any)[section.id].length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveItem(section.id, idx, 'down')}
                                  className="p-1 hover:bg-zinc-800 text-[#7C3AED] hover:text-white rounded-lg transition-colors"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDuplicateItem(section.id, idx)}
                                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(section.id, idx)}
                                className="p-1 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {(section.fields || []).map(field => {
                            const fieldId = `input-${section.id}-${field.key}-${idx}`;
                            const val = getFieldValue(field.key, itemObj);

                            if (field.type === 'image') {
                              return (
                                <div key={field.key} id={fieldId}>
                                  <ImageField
                                    field={field}
                                    val={val}
                                    onValueChange={newVal => updateFieldValue(field.key, newVal, idx, section.id)}
                                    fieldId={fieldId}
                                  />
                                </div>
                              );
                            }

                            if (field.type === 'tags') {
                              const tagsArr = Array.isArray(val)
                                ? val
                                : typeof val === 'string'
                                ? val.split(',')
                                : [];
                              return (
                                <div key={field.key} id={fieldId}>
                                  <TagsField
                                    field={field}
                                    tagsList={tagsArr}
                                    onTagsChange={newTags => updateFieldValue(field.key, newTags, idx, section.id)}
                                    fieldId={fieldId}
                                  />
                                </div>
                              );
                            }

                            if (field.type === 'textarea') {
                              return (
                                <div key={field.key} className="space-y-1">
                                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                    {field.label}
                                  </label>
                                  <textarea
                                    id={fieldId}
                                    rows={2}
                                    value={val}
                                    onChange={e =>
                                      updateFieldValue(field.key, e.target.value, idx, section.id)
                                    }
                                    placeholder={field.placeholder}
                                    className="w-full bg-zinc-950/80 border border-zinc-800 text-white text-xs rounded-xl p-2.5 placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-y"
                                  />
                                </div>
                              );
                            }

                            return (
                              <div key={field.key} className="space-y-1">
                                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                  {field.label}
                                </label>
                                <input
                                  id={fieldId}
                                  type={field.type === 'url' ? 'url' : 'text'}
                                  value={val}
                                  onChange={e =>
                                    updateFieldValue(field.key, e.target.value, idx, section.id)
                                  }
                                  placeholder={field.placeholder}
                                  className="w-full bg-zinc-950/80 border border-zinc-800 text-white text-xs rounded-xl p-2.5 placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ))}

                    <button
                      type="button"
                      onClick={() => handleAddItem(section)}
                      className="w-full py-2.5 border border-dashed border-purple-500/40 hover:border-[#7C3AED] bg-purple-500/10 hover:bg-purple-500/20 text-[#7C3AED] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add {section.itemLabel || 'Item'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
