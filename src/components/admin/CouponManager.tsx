"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Ticket, Check, Copy, Layers, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockDb, CouponCode, PlanConfig } from '../../utils/mockDb';

interface CouponManagerProps {
  onUpdate?: () => void;
}

export default function CouponManager({ onUpdate }: CouponManagerProps) {
  const [coupons, setCoupons] = useState<CouponCode[]>(() => mockDb.getCoupons());
  const [plans, setPlans] = useState<PlanConfig[]>(() => mockDb.getPlans());
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  React.useEffect(() => {
    mockDb.syncCouponsFromServer().then((updated) => {
      setCoupons(updated);
    });

    const handlePlansUpdated = () => {
      setPlans(mockDb.getPlans());
    };

    window.addEventListener('campuscv:plans-updated', handlePlansUpdated);
    window.addEventListener('storage', handlePlansUpdated);
    return () => {
      window.removeEventListener('campuscv:plans-updated', handlePlansUpdated);
      window.removeEventListener('storage', handlePlansUpdated);
    };
  }, []);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(20);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresDays, setExpiresDays] = useState(30);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]); // empty means All Plans

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: CouponCode = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      discountPercent: discountType === 'percent' ? Number(discountValue) : undefined,
      maxUses: Number(maxUses),
      usedCount: 0,
      expiresAt: new Date(Date.now() + Number(expiresDays) * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      applicablePlanIds: selectedPlanIds,
      createdAt: new Date().toISOString(),
    };

    mockDb.saveCoupon(newCoupon);
    setCoupons(mockDb.getCoupons());
    setIsCreating(false);
    setCode('');
    setSelectedPlanIds([]);
    onUpdate?.();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete coupon code?')) return;
    mockDb.deleteCoupon(id);
    setCoupons(mockDb.getCoupons());
    onUpdate?.();
  };

  const handleToggleActive = (coupon: CouponCode) => {
    const updated = { ...coupon, isActive: !coupon.isActive };
    mockDb.saveCoupon(updated);
    setCoupons(mockDb.getCoupons());
    onUpdate?.();
  };

  const handleCopy = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const togglePlanSelection = (planId: string) => {
    if (selectedPlanIds.includes(planId)) {
      setSelectedPlanIds(selectedPlanIds.filter(id => id !== planId));
    } else {
      setSelectedPlanIds([...selectedPlanIds, planId]);
    }
  };

  return (
    <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-6 shadow-xs text-left font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#111318] font-bricolage tracking-tight">Coupon Codes &amp; Plan Discounts</h2>
          <p className="text-xs text-[#667085]">Create discount promo codes and connect them to specific subscription plans.</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupon Creation Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#F8F9FB] border border-[#E7E9EE] rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#111318] uppercase tracking-wider font-mono">Create Discount Coupon</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#667085] uppercase">Code</label>
              <input
                type="text"
                placeholder="e.g. CAMPUS50"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:border-purple-600 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#667085] uppercase">Discount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={discountValue}
                  onChange={e => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-purple-600 outline-none"
                  required
                />
                <select
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value as any)}
                  className="px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-purple-600 outline-none"
                >
                  <option value="percent">%</option>
                  <option value="fixed">₹</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#667085] uppercase">Max Uses</label>
              <input
                type="number"
                value={maxUses}
                onChange={e => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-purple-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#667085] uppercase">Expires In (Days)</label>
              <input
                type="number"
                value={expiresDays}
                onChange={e => setExpiresDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Connected Plans Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Connected Plans (Which plans can use this coupon)</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {selectedPlanIds.length === 0 ? '✓ Applies to All Plans' : `${selectedPlanIds.length} plan(s) selected`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedPlanIds([])}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedPlanIds.length === 0
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Plans
              </button>
              {plans.map(p => {
                const isSelected = selectedPlanIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlanSelection(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p.name} (₹{p.price})</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons Data Table */}
      {coupons.length === 0 ? (
        <div className="bg-[#F8F9FB] border border-dashed border-[#E7E9EE] rounded-2xl p-10 text-center space-y-3">
          <Ticket className="w-8 h-8 text-purple-600 mx-auto" />
          <div>
            <p className="text-sm font-bold text-[#111318]">No coupon codes yet</p>
            <p className="text-xs text-[#667085] mt-0.5">Create your first discount code for promotional campaigns.</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#98A2B3] font-mono border-b border-[#E7E9EE] bg-[#F8F9FB]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Code</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Discount</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Connected Plans</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Usage</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Expires</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((cpn) => {
                const isExpired = new Date(cpn.expiresAt) < new Date();
                const connectedPlanNames = !cpn.applicablePlanIds || cpn.applicablePlanIds.length === 0
                  ? ['All Plans']
                  : cpn.applicablePlanIds.map(id => plans.find(p => p.id === id)?.name || id);

                return (
                  <tr key={cpn.id} className="hover:bg-[#FAFAFA] transition-colors h-[54px]">
                    
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-purple-700">
                      <div className="flex items-center gap-2">
                        <span>{cpn.code}</span>
                        <button
                          onClick={() => handleCopy(cpn.code)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === cpn.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-4 font-bold text-[#111318]">
                      {cpn.discountType === 'percent' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                    </td>

                    {/* Connected Plans */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {connectedPlanNames.map((name, idx) => (
                          <span
                            key={idx}
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              name === 'All Plans'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Usage */}
                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">
                      {cpn.usedCount} / {cpn.maxUses === -1 ? '∞' : cpn.maxUses}
                    </td>

                    {/* Expires */}
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(cpn.expiresAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(cpn)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer ${
                          !isExpired && cpn.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {!isExpired && cpn.isActive ? 'Active' : 'Inactive / Expired'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(cpn.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
