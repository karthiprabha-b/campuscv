"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutTemplate, Check, Sparkles } from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { resolveInstalledTemplateSync, resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';

interface MobileTemplatesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

export default function MobileTemplatesSheet({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
}: MobileTemplatesSheetProps) {
  const [templates, setTemplates] = React.useState<any[]>(() => adminTemplateDb.getActiveTemplates());

  React.useEffect(() => {
    if (isOpen) {
      adminTemplateDb.syncWithServerRegistryAsync(false).then(list => {
        setTemplates(list.filter(t => (t.status || 'active') === 'active'));
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTemplateId = portfolio?.templateId || portfolio?.layoutStyle || 'default';

  const handleSelectTemplate = async (id: string) => {
    const resolvedTmpl = await resolveInstalledTemplateAsync(id, portfolio);
    const sectionFiles = (resolvedTmpl.sectionFiles && Object.keys(resolvedTmpl.sectionFiles).length > 0) ? resolvedTmpl.sectionFiles : portfolio.sectionFiles;
    onPortfolioChange({
      ...portfolio,
      templateId: id,
      layoutStyle: id,
      templateType: 'uploaded',
      sectionFiles,
      templateCode: resolvedTmpl.templateCode || portfolio.templateCode,
      _sectionFilesTemplateId: id,
      _lastUpdated: Date.now()
    });
    console.log('[TEMPLATE SELECTED]', id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed inset-x-0 bottom-0 top-16 z-[500] bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col select-none md:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-violet-600" />
              <span className="font-bold text-sm text-zinc-900">Switch Portfolio Template</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Catalog Grid Body */}
          <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((tpl: any) => {
                const isActive = tpl.id === currentTemplateId;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-violet-600 bg-violet-50/40 shadow-md'
                        : 'border-zinc-200 hover:border-violet-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900">{tpl.name}</h4>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{tpl.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 uppercase font-mono">
                      <span>{tpl.category}</span>
                      <span className="text-violet-600 font-bold">{isActive ? 'Active' : 'Apply'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
