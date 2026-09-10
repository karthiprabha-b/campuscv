import React, { useRef } from 'react';
import {
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Layers,
  LayoutList,
  X,
  Upload,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';
import { handleImageUpload as processImageUpload } from '../../utils/imageUploadStorage';

interface DynamicInspectorPanelProps {
  element: any; // Legacy: supports both old and new SelectedElement shapes
  portfolio: PortfolioData;
  onClose: () => void;
  onUpdateField: (field: string, value: any) => void;
  onListAction?: (action: 'add' | 'duplicate' | 'moveUp' | 'moveDown' | 'delete', index?: number) => void;
}

export default function DynamicInspectorPanel({
  element,
  portfolio,
  onClose,
  onUpdateField,
  onListAction
}: DynamicInspectorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Always resolve current value directly from portfolio single source of truth
  const getCurrentValue = () => {
    if (!portfolio || !element) return element.value || '';
    const field = element.field;
    if (field === 'name') return portfolio.name ?? element.value;
    if (field === 'tagline') return portfolio.tagline ?? element.value;
    if (field === 'aboutMe') return portfolio.aboutMe ?? element.value;
    if (field === 'profileImage') return portfolio.profileImage ?? element.value;
    if (field.startsWith('socialLinks.')) {
      const key = field.split('.')[1];
      return (portfolio.socialLinks as any)?.[key] ?? element.value;
    }
    return (portfolio as any)[field] ?? element.value ?? '';
  };

  const currentValue = getCurrentValue();

  const getElementIcon = () => {
    switch (element.type) {
      case 'text':
        return <Type className="w-4 h-4 text-[#7C3AED]" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'button':
        return <MousePointerClick className="w-4 h-4 text-blue-500" />;
      case 'section':
        return <Layers className="w-4 h-4 text-amber-500" />;
      case 'list':
      case 'card':
        return <LayoutList className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#7C3AED]" />;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const field = element.field || '';
      const category = (field.includes('avatar') || field.includes('profile') || field.includes('photo'))
        ? 'avatar'
        : (field.includes('project'))
        ? 'projects'
        : (field.includes('hero') || field.includes('banner'))
        ? 'banners'
        : 'general';

      processImageUpload(
        file,
        (blobUrl) => onUpdateField(element.field, blobUrl),
        (finalUrl) => { if (finalUrl) onUpdateField(element.field, finalUrl); },
        { category, username: (portfolio as any)?.username || (portfolio as any)?.id }
      );
    }
  };

  return (
    <div className="w-full bg-white border border-zinc-200/90 rounded-2xl p-4 space-y-4 shadow-sm text-left animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200">
            {getElementIcon()}
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              {element.type} INSPECTOR
            </span>
            <h4 className="text-xs font-extrabold text-zinc-900 capitalize truncate max-w-[170px]">
              {element.field.replace(/[^a-zA-Z0-9]/g, ' ')}
            </h4>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TEXT INSPECTOR */}
      {element.type === 'text' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Text Content
            </label>
            {element.options?.multiline || (typeof currentValue === 'string' && currentValue.length > 50) ? (
              <textarea
                rows={4}
                value={currentValue || ''}
                onChange={(e) => onUpdateField(element.field, e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 text-zinc-900 font-medium leading-relaxed resize-none shadow-xs"
              />
            ) : (
              <input
                type="text"
                value={currentValue || ''}
                onChange={(e) => onUpdateField(element.field, e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 text-zinc-900 font-medium shadow-xs"
              />
            )}
          </div>
          <p className="text-[10px] text-zinc-400 font-mono">
            Tip: You can also click directly on text in the canvas to edit inline.
          </p>
        </div>
      )}

      {/* IMAGE INSPECTOR */}
      {element.type === 'image' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Image Preview
            </label>
            <div className="h-32 w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 relative group">
              <img
                src={currentValue}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Image</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Image URL / Source
            </label>
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => onUpdateField(element.field, e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs focus:outline-none focus:border-[#7C3AED] text-zinc-900 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateField(element.field, '')}
              className="px-3 py-2 border border-zinc-200 hover:bg-red-50 hover:border-red-200 text-zinc-500 hover:text-red-600 text-xs font-bold rounded-xl transition-colors"
              title="Remove Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* BUTTON INSPECTOR */}
      {element.type === 'button' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Button Text
            </label>
            <input
              type="text"
              value={currentValue || ''}
              onChange={(e) => onUpdateField(element.field, e.target.value)}
              placeholder="e.g. View Projects"
              className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#7C3AED] text-zinc-900 font-bold shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-zinc-400" />
              <span>Target URL Link</span>
            </label>
            <input
              type="text"
              value={element.options?.linkUrl || ''}
              onChange={(e) => onUpdateField(element.field + '_link', e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs focus:outline-none focus:border-[#7C3AED] text-zinc-900 font-mono shadow-xs"
            />
          </div>
        </div>
      )}

      {/* CARD / LIST INSPECTOR */}
      {(element.type === 'card' || element.type === 'list') && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            List Item Actions
          </span>
          <div className="grid grid-cols-2 gap-2">
            {onListAction && (
              <>
                <button
                  type="button"
                  onClick={() => onListAction('moveUp', element.options?.index)}
                  className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Move Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => onListAction('moveDown', element.options?.index)}
                  className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Move Down</span>
                </button>
                <button
                  type="button"
                  onClick={() => onListAction('duplicate', element.options?.index)}
                  className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => onListAction('delete', element.options?.index)}
                  className="p-2 border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* SECTION INSPECTOR */}
      {element.type === 'section' && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            Section Controls ({element.section})
          </span>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onListAction && onListAction('delete')}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hide / Remove Section</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
