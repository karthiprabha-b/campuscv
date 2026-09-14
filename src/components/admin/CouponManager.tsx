"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Ticket, Check, Copy, Layers, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
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

  const handleCreate = async (e: React.FormEvent) => {
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

    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
    } catch (err) {
      console.warn('[CouponManager] API create failed:', err);
    }

    mockDb.saveCoupon(newCoupon);
    const updated = await mockDb.syncCouponsFromServer();
    setCoupons(updated);
    setIsCreating(false);
    setCode('');
    setSelectedPlanIds([]);
    onUpdate?.();
  };

  const handleDelete = async (coupon: CouponCode) => {
    if (!confirm(`Delete coupon code "${coupon.code}"?`)) return;
    try {
      await fetch(`/api/coupons?id=${encodeURIComponent(coupon.id)}&code=${encodeURIComponent(coupon.code)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('[CouponManager] API delete failed:', err);
    }
    mockDb.deleteCoupon(coupon.id, coupon.code);
    const updated = await mockDb.syncCouponsFromServer();
    setCoupons(updated);
    onUpdate?.();
  };

  const handleToggleActive = async (coupon: CouponCode) => {
    const updatedCoupon = { ...coupon, isActive: !coupon.isActive };
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCoupon),
      });
    } catch (err) {
      console.warn('[CouponManager] API toggle failed:', err);
    }
    mockDb.saveCoupon(updatedCoupon);
    const updated = await mockDb.syncCouponsFromServer();
    setCoupons(updated);
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs text-left font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 font-bricolage tracking-tight">Coupons &amp; Promotional Discounts</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 font-mono">
              Promotions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Generate coupon codes for percentage or fixed INR discounts during checkout.</p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-orange-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isCreating ? 'Cancel' : 'Create Coupon'}</span>
        </button>
      </div>

      {/* Coupon Creation Panel */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Create Promotional Coupon</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            
            {/* Code */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">Code</label>
              <input
                type="text"
                placeholder="LAUNCH50"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">Type</label>
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="percent">Percent (%) Off</option>
                <option value="fixed">Fixed (₹) Off</option>
              </select>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">Discount Value</label>
              <input
                type="number"
                min="1"
                max={discountType === 'percent' ? 100 : 9999}
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            {/* Max Uses */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">Max Uses</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={e => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Expiry (Days) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">Expires In (Days)</label>
              <input
                type="number"
                min="1"
                value={expiresDays}
                onChange={e => setExpiresDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-orange-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

          </div>

          {/* Applicable Plans Checkboxes */}
          <div className="space-y-1.5 pt-2 border-t border-orange-200/80">
            <label className="text-[11px] font-bold text-slate-600 uppercase font-mono block">
              Applicable Plans (Leave empty to apply to All Plans)
            </label>
            <div className="flex flex-wrap gap-2">
              {plans.map(p => {
                const isSelected = selectedPlanIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlanSelection(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-orange-500/20 transition-all cursor-pointer"
            >
              Save &amp; Activate Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => {
          const isExpired = c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
          const isCopied = copiedCode === c.code;

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 relative group ${
                !c.isActive || isExpired
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-sm text-slate-900 tracking-wider block">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {c.discountType === 'percent' ? `${c.discountValue || c.discountPercent}% Discount` : `₹${c.discountValue} Flat Off`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(c.code)}
                  title="Copy code"
                  className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Usage Stats & Expiry */}
              <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Redeemed:</span>
                  <span className="font-bold text-slate-800">{c.usedCount || 0} / {c.maxUses || '∞'} times</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expires:</span>
                  <span className="font-mono text-[11px] text-slate-600">{new Date(c.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(c)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    c.isActive && !isExpired
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {c.isActive && !isExpired ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleDelete(c)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
