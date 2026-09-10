"use client";

import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, Power } from 'lucide-react';
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
    showToast(`Plan "${plan.name}" saved.`);
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
      name: 'New Plan',
      price: 49,
      storage: '100 MB',
      storageMB: 100,
      desc: 'New subscription plan.',
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
    <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-6 shadow-xs text-left font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#111318] font-bricolage tracking-tight">Subscription Plans</h2>
          <p className="text-xs text-[#667085]">Manage plan pricing, storage allocations, and availability.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 border border-[#E7E9EE] text-slate-600 hover:bg-[#F8F9FB] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleAddPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plan</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
          {toast}
        </div>
      )}

      {/* Pricing Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#98A2B3] font-mono border-b border-[#E7E9EE] bg-[#F8F9FB]">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Plan</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Price</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Duration</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Storage</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map((plan) => {
              const isEditing = editingId === plan.id;
              return (
                <tr key={plan.id} className="hover:bg-[#FAFAFA] transition-colors">
                  
                  {/* Plan Name & Description */}
                  <td className="py-3.5 px-4 font-bold text-[#111318] font-bricolage">
                    {isEditing ? (
                      <div className="space-y-1.5 min-w-[180px]">
                        <input
                          type="text"
                          value={plan.name}
                          onChange={e => handleChange(plan.id, 'name', e.target.value)}
                          placeholder="Plan Name"
                          className="px-2 py-1 border border-purple-300 rounded-lg text-xs outline-none w-full"
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
                        <div>{plan.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-normal">{plan.desc}</div>
                      </div>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        value={plan.price}
                        onChange={e => handleChange(plan.id, 'price', Number(e.target.value))}
                        className="px-2 py-1 border border-purple-300 rounded-lg text-xs outline-none w-20"
                      />
                    ) : (
                      `₹${plan.price}`
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                    {isEditing ? (
                      <input
                        type="number"
                        value={plan.duration}
                        onChange={e => handleChange(plan.id, 'duration', Number(e.target.value))}
                        className="px-2 py-1 border border-purple-300 rounded-lg text-xs outline-none w-20"
                      />
                    ) : (
                      `${plan.duration} days`
                    )}
                  </td>

                  {/* Storage */}
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={plan.storage}
                        onChange={e => handleChange(plan.id, 'storage', e.target.value)}
                        className="px-2 py-1 border border-purple-300 rounded-lg text-xs outline-none w-24"
                      />
                    ) : (
                      plan.storage
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      plan.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(plan)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(plan.id)}
                          className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Plan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggle(plan.id)}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title={plan.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
