import React, { useState, useEffect } from 'react';
import { Edit3, X, Save, ShieldCheck } from 'lucide-react';
import { TemplateRecord, TemplateStatus } from '../../types/adminTemplate';

interface EditMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateRecord | null;
  onSave: (updated: Partial<TemplateRecord>) => void;
}

export default function EditMetadataModal({
  isOpen,
  onClose,
  template,
  onSave
}: EditMetadataModalProps) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Developer');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TemplateStatus>('active');
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setVersion(template.version || '1.0.0');
      setAuthor(template.author || '');
      setCategory(template.category || 'Developer');
      setDescription(template.description || '');
      setStatus(template.status || 'active');
      setIsPremium(template.isPremium ?? false);
      setPrice(template.price ?? 0);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      version,
      author,
      category,
      description,
      status,
      isPremium,
      price: isPremium ? price : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-zinc-200 text-left relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-[#7C3AED]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900">Edit Template Metadata</h3>
              <p className="text-[11px] text-zinc-500 font-mono">ID: {template.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-mono text-zinc-900 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:outline-none focus:border-[#7C3AED] bg-white"
              >
                <option value="Developer">Developer</option>
                <option value="Student">Student</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Universal">Universal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-semibold text-zinc-900 focus:outline-none focus:border-[#7C3AED] bg-white"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled / Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="broken">Broken</option>
                <option value="validation-failed">Validation Failed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl font-normal text-zinc-800 focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          {/* Marketplace Pricing */}
          <div className="border border-zinc-100 rounded-xl p-3 space-y-3 bg-zinc-50/60">
            <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Marketplace Pricing</p>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-purple-600 w-4 h-4"
                checked={isPremium}
                onChange={e => setIsPremium(e.target.checked)}
              />
              <span className="text-xs font-semibold text-zinc-800">Mark as Premium (paid template)</span>
            </label>
            {isPremium && (
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 uppercase tracking-wider text-[10px] block">Template Price ($)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-150">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 text-zinc-600 font-semibold rounded-xl hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
