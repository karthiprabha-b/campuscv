"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutTemplate, Check, Sparkles, Lock } from 'lucide-react';
import { PortfolioData, mockAuth, checkTemplateAccess } from '../../utils/mockDb';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { resolveInstalledTemplateSync, resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';
import { getCanonicalTemplateId } from '../../utils/templateResolver';
import UpgradePlanModal from '../common/UpgradePlanModal';

interface MobileTemplatesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

function deduplicateTemplateList(list: any[]): any[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const unique: any[] = [];
  for (const t of list) {
    if ((t.status || 'active') !== 'active') continue;
    const canonicalId = getCanonicalTemplateId(t.id);
    const normName = (t.name || '').toLowerCase().trim();
    if (seenIds.has(canonicalId) || (normName && seenNames.has(normName))) continue;
    seenIds.add(canonicalId);
    if (normName) seenNames.add(normName);
    unique.push({ ...t, id: canonicalId });
  }
  return unique;
}

export default function MobileTemplatesSheet({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
}: MobileTemplatesSheetProps) {
  const [templates, setTemplates] = useState<any[]>(() => deduplicateTemplateList(adminTemplateDb.getActiveTemplates()));
  const [currentUser, setCurrentUser] = useState<any>(() => mockAuth.getCurrentUser());
  const [upgradeModal, setUpgradeModal] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(mockAuth.getCurrentUser());
      adminTemplateDb.syncWithServerRegistryAsync(false).then(list => {
        setTemplates(deduplicateTemplateList(list));
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTemplateId = portfolio?.templateId || portfolio?.layoutStyle || 'default';

  const handleSelectTemplate = async (id: string) => {
    const targetTemplate = templates.find(t => t.id === id);
    const access = checkTemplateAccess(currentUser, targetTemplate);
    if (!access.isAccessible) {
      setUpgradeModal({
        isOpen: true,
        templateName: targetTemplate?.name || id,
        requiredTier: access.requiredTier,
        reason: access.reason,
        planLimit: access.planLimit,
      });
      return;
    }

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
              {templates.filter((tpl: any) => {
                if (tpl.id === currentTemplateId) return true;
                const access = checkTemplateAccess(currentUser, tpl);
                return access.isAccessible;
              }).map((tpl: any) => {
                const isActive = tpl.id === currentTemplateId;
                const access = checkTemplateAccess(currentUser, tpl);
                const isLocked = !isActive && !access.isAccessible;

                const rawTier = (tpl.planTier || (tpl.isPremium ? 'yearly' : 'monthly')).toLowerCase();
                const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-violet-600 bg-violet-50/40 shadow-md'
                        : isLocked
                          ? 'border-zinc-200 bg-zinc-50/50 hover:border-amber-300'
                          : 'border-zinc-200 hover:border-violet-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-zinc-900">{tpl.name}</h4>
                          <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                            planTier === 'free'
                              ? 'bg-emerald-100 text-emerald-700'
                              : planTier === 'monthly'
                                ? 'bg-sky-100 text-sky-700'
                                : planTier === 'quarterly'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-violet-100 text-violet-700'
                          }`}>
                            {planTier}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{tpl.description}</p>
                      </div>

                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold shrink-0">
                          <Lock className="w-3 h-3" />
                          <span>Lock</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 uppercase font-mono">
                      <span>{tpl.category}</span>
                      <span className={isLocked ? 'text-amber-600 font-bold' : 'text-violet-600 font-bold'}>
                        {isActive ? 'Active' : isLocked ? 'Upgrade Plan' : 'Apply'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade Plan Modal */}
          {upgradeModal && (
            <UpgradePlanModal
              isOpen={upgradeModal.isOpen}
              onClose={() => setUpgradeModal(null)}
              templateName={upgradeModal.templateName}
              requiredTier={upgradeModal.requiredTier}
              reason={upgradeModal.reason}
              planLimit={upgradeModal.planLimit}
              onUpgradeSuccess={(upgradedPlan) => {
                setCurrentUser(mockAuth.getCurrentUser());
                alert(`🎉 Successfully upgraded to ${upgradedPlan.name}! You can now switch to this template.`);
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
