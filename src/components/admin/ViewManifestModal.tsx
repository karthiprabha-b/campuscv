import React, { useState } from 'react';
import { FileCode, X, Copy, Check } from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';

interface ViewManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateRecord | null;
}

export default function ViewManifestModal({
  isOpen,
  onClose,
  template
}: ViewManifestModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !template) return null;

  const manifestObj = {
    id: template.id,
    name: template.name,
    version: template.version,
    author: template.author,
    description: template.description,
    category: template.category,
    supportsDarkMode: template.supportsDarkMode,
    sections: template.sections,
    fieldCounts: template.fieldCounts,
    editorCompatibility: template.editorCompatibility
  };

  const jsonText = template.manifestJson || JSON.stringify(manifestObj, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-zinc-200 text-left relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-[#7C3AED]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900">manifest.json &amp; Self-Describing Schema</h3>
              <p className="text-[11px] text-zinc-500 font-mono">Template: {template.name} ({template.id})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-purple-50 text-zinc-700 hover:text-[#7C3AED] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg text-sm font-bold">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[420px] border border-zinc-800">
          <pre>{jsonText}</pre>
        </div>
      </div>
    </div>
  );
}
