"use client";

import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, Power, Sparkles, CreditCard, RotateCcw } from 'lucide-react';
import { mockDb, PlanConfig, defaultPlans } from '../../utils/mockDb';

interface PlanManagerProps {
  onUpdate?: () => void;
}

export default function PlanManager({ onUpdate }: PlanManagerProps) {
  const [plans, setPlans] = useState<PlanConfig[]>(() => mockDb.getPlans());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleChange = (id: string, field: keyof PlanConfig, value: any) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = (plan: PlanConfig) => {
    mockDb.savePlan(plan);
    setEditingId(null);
    showToast(`Plan "${plan.name}" saved successfully.`);
    onUpdate?.();
  };

  const handleToggle = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;
    const updated = { ...plan, isActive: !plan.isActive };
    mockDb.savePlan(updated);
    setPlans(prev => prev.map(p => p.id === id ? updated : p));
    showToast(`Plan "${updated.name}" ${updated.isActive ? 'activated' : 'deactivated'}.`);
    onUpdate?.();
  };

  const handleAddPlan = () => {
    const newPlan: PlanConfig = {
      id: `plan-${Date.now()}`,
      duration: 30,
      name: 'Custom Pro Pass',
      price: 299,
      storage: '500 MB',
      storageMB: 500,
      desc: 'Full access to all portfolio templates and instant hosting.',
      tier: 'monthly',
      allowedTemplateCount: 5,
      isActive: true,
    };
    const updated = [...plans, newPlan];
    setPlans(updated);
    mockDb.savePlan(newPlan);
    setEditingId(newPlan.id);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this plan?')) return;
    mockDb.deletePlan(id);
    setPlans(prev => prev.filter(p => p.id !== id));
    showToast('Plan deleted.');
    onUpdate?.();
  };

  const handleResetDefaults = () => {
    if (!confirm('Reset all plans to defaults?')) return;
    defaultPlans.forEach(p => mockDb.savePlan(p));
    setPlans(defaultPlans);
    showToast('Plans reset to defaults.');
    onUpdate?.();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs text-left font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 font-bricolage tracking-tight">Subscription Plans &amp; Pricing</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 font-mono">
              Monetization
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage plan pricing in INR, allowed template quotas, storage limits, and active status.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            onClick={handleAddPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Plan</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl animate-fadeIn">
          ✓ {toast}
        </div>
      )}

      {/* Pricing Data Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 font-mono border-b border-slate-200 bg-slate-50">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Plan Name</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Tier</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Template Limit</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Price (₹)</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Duration</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Storage</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map((plan) => {
              const isEditing = editingId === plan.id;
              const currentLimit = plan.allowedTemplateCount ?? (plan.tier === 'yearly' ? 12 : (plan.tier === 'quarterly' ? 6 : 3));

              return (
                <tr key={plan.id} className="hover:bg-orange-50/20 transition-colors">
                  
                  {/* Plan Name & Description */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-bricolage">
                    {isEditing ? (
                      <div className="space-y-1.5 min-w-[180px]">
                        <input
                          type="text"
                          value={plan.name}
                          onChange={e => handleChange(plan.id, 'name', e.target.value)}
                          placeholder="Plan Name"
                          className="px-2 py-1 border border-orange-400 rounded-lg text-xs outline-none w-full font-bold"
                        />
                        <input
                          type="text"
                          value={plan.desc || ''}
                          onChange={e => handleChange(plan.id, 'desc', e.target.value)}
                          placeholder="Subtitle / Description"
                          className="px-2 py-0.5 border border-slate-200 rounded-md text-[11px] outline-none w-full text-slate-500 font-mono"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="block text-sm font-black text-slate-900">{plan.name}</span>
                        <span className="block text-[11px] text-slate-500 font-normal font-sans">{plan.desc}</span>
                      </div>
                    )}
                  </td>

                  {/* Tier */}
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <select
                        value={plan.tier}
                        onChange={e => handleChange(plan.id, 'tier', e.target.value)}
                        className="px-2 py-1 border border-orange-400 rounded-lg text-xs font-semibold outline-none bg-white"
                      >
                        <option value="trial">Trial</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom</option>
                      </select>
                    ) : (
                      <span className="font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full text-[11px] uppercase">
                        {plan.tier}
                      </span>
                    )}
                  </td>

                  {/* Template Quota Limit */}
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={currentLimit}
                        onChange={e => handleChange(plan.id, 'allowedTemplateCount', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 border border-orange-400 rounded-lg text-xs font-bold text-center outline-none"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-800 text-xs font-mono">
                        {currentLimit} Templates
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={e => handleChange(plan.id, 'price', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-orange-400 rounded-lg text-xs font-bold outline-none"
                        />
                      </div>
                    ) : (
                      <span className="font-black text-slate-900 text-sm font-bricolage">
                        ₹{plan.price}
                      </span>
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <input
                        type="number"
                        value={plan.duration}
                        onChange={e => handleChange(plan.id, 'duration', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-orange-400 rounded-lg text-xs outline-none"
                      />
                    ) : (
                      <span className="text-slate-600 font-semibold">{plan.duration} days</span>
                    )}
                  </td>

                  {/* Storage */}
                  <td className="py-3.5 px-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={plan.storage}
                        onChange={e => handleChange(plan.id, 'storage', e.target.value)}
                        className="w-20 px-2 py-1 border border-orange-400 rounded-lg text-xs outline-none"
                      />
                    ) : (
                      <span className="text-slate-600 font-mono">{plan.storage}</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggle(plan.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        plan.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${plan.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {plan.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(plan)}
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(plan.id)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit plan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
