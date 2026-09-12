"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Lock, 
  Check, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Star,
  Layers,
  Crown,
  Tag,
  Percent
} from 'lucide-react';
import { mockAuth, mockDb, PlanConfig, UserProfile, defaultPlans } from '../../utils/mockDb';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier?: 'free' | 'monthly' | 'quarterly' | 'yearly';
  templateName?: string;
  reason?: 'plan_tier' | 'limit_reached' | 'unpaid';
  currentUsageCount?: number;
  planLimit?: number;
  onUpgradeSuccess?: (upgradedPlan: PlanConfig) => void;
}

export default function UpgradePlanModal({
  isOpen,
  onClose,
  requiredTier = 'monthly',
  templateName,
  reason,
  currentUsageCount,
  planLimit,
  onUpgradeSuccess
}: UpgradePlanModalProps) {
  const [plans, setPlans] = useState<PlanConfig[]>(() => mockDb.getPlans());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => mockAuth.getCurrentUser());
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPlans(mockDb.getPlans());
      setCurrentUser(mockAuth.getCurrentUser());
      setCouponError(null);
      setAppliedCoupon(null);
      setCouponInput('');
      // Sync coupons from server so newly created coupons appear and deleted ones stop working
      mockDb.syncCouponsFromServer().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Plan ordering: Trial → Monthly → Quarterly → Yearly
  const trialPlan = plans.find(p => p.id === 'plan-test-5') || defaultPlans[0];
  const monthlyPlan = plans.find(p => p.id === 'plan-monthly' || (p.tier === 'monthly' && p.id !== 'plan-test-5')) || defaultPlans[1];
  const quarterlyPlan = plans.find(p => p.id === 'plan-quarterly' || p.tier === 'quarterly') || defaultPlans[2];
  const yearlyPlan = plans.find(p => p.id === 'plan-yearly' || p.tier === 'yearly') || defaultPlans[3];

  const planList = [trialPlan, monthlyPlan, quarterlyPlan, yearlyPlan].filter(Boolean) as PlanConfig[];

  // Dynamic Razorpay SDK loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculatePlanPricing = (plan: PlanConfig) => {
    const isTrial = (plan.id || '').toLowerCase().includes('trial') || 
      (plan.id || '').toLowerCase().includes('test') || 
      (plan.name || '').toLowerCase().includes('trial') || 
      (plan.tier || '').toLowerCase() === 'trial';

    let finalPrice = plan.price;
    let discountAmount = 0;
    let isApplicable = false;

    if (appliedCoupon) {
      if (!appliedCoupon.applicablePlanIds || appliedCoupon.applicablePlanIds.length === 0 || appliedCoupon.applicablePlanIds.includes(plan.id)) {
        isApplicable = true;
        if (appliedCoupon.discountType === 'percentage' || appliedCoupon.discountType === 'percent' || appliedCoupon.discountPercent !== undefined) {
          const pct = appliedCoupon.discountPercent ?? appliedCoupon.discountValue ?? 0;
          discountAmount = Math.round((plan.price * pct) / 100);
        } else if (appliedCoupon.discountType === 'fixed') {
          discountAmount = appliedCoupon.discountValue || 0;
        }

        if (isTrial) {
          finalPrice = Math.max(0, plan.price - discountAmount);
        } else {
          finalPrice = Math.max(1, plan.price - discountAmount);
        }
      }
    }

    let buttonLabel = '';
    if (isTrial) {
      buttonLabel = finalPrice === 0 ? 'START FREE TRIAL (₹0)' : `START TRIAL FOR ₹ ${finalPrice}`;
    } else if (plan.tier === 'monthly' || plan.id === 'plan-monthly') {
      buttonLabel = `START FOR ₹ ${finalPrice}`;
    } else if (plan.tier === 'quarterly' || plan.id === 'plan-quarterly') {
      buttonLabel = `CHOOSE QUARTERLY (₹ ${finalPrice})`;
    } else if (plan.tier === 'yearly' || plan.id === 'plan-yearly') {
      buttonLabel = `GET YEARLY PLAN (₹ ${finalPrice})`;
    } else {
      buttonLabel = `CHOOSE ${plan.name.toUpperCase()} (₹ ${finalPrice})`;
    }

    return {
      finalPrice,
      discountAmount,
      isApplicable,
      hasDiscount: isApplicable && finalPrice < plan.price,
      buttonLabel,
      isTrial
    };
  };

  const handleApplyCouponModal = async () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;
    setCouponError(null);
    setIsCheckingCoupon(true);

    try {
      let valid = await mockDb.validateCouponAsync(trimmed);
      if (!valid) {
        valid = await mockDb.validateCouponAsync(trimmed, 'plan-test-5');
      }
      if (!valid) {
        valid = await mockDb.validateCouponAsync(trimmed, 'plan-monthly');
      }

      if (valid) {
        setAppliedCoupon(valid);
        setCouponError(null);
      } else {
        setCouponError('Invalid, expired, or inapplicable coupon code');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handlePayWithRazorpay = async (plan: PlanConfig) => {
    const user = mockAuth.getCurrentUser();
    if (!user) {
      alert('Please log in to purchase a plan.');
      return;
    }

    setIsProcessing(plan.id);

    try {
      const { finalPrice } = calculatePlanPricing(plan);

      // If finalPrice is 0 (e.g. Trial Plan with 100% coupon), direct instant free activation
      if (finalPrice === 0) {
        if (appliedCoupon) {
          mockDb.useCoupon(appliedCoupon.id);
        }
        mockAuth.upgradeToPro(plan.duration);
        const updatedUser = mockAuth.getCurrentUser();
        if (updatedUser) {
          updatedUser.storageLimitMB = plan.storageMB;
          updatedUser.planType = `${plan.duration}-days` as any;
          localStorage.setItem('portly_current_user', JSON.stringify(updatedUser));
        }
        mockDb.addTransaction({
          email: user.email,
          itemType: 'subscription',
          itemName: `${plan.name} (${plan.duration} Days)`,
          price: 0,
          originalPrice: plan.price,
          couponApplied: appliedCoupon?.code,
          durationDays: plan.duration,
          status: 'success'
        });
        setIsProcessing(null);
        if (onUpgradeSuccess) onUpgradeSuccess(plan);
        onClose();
        alert(`Success! 1 Month Free Trial activated for ${user.email}.`);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Could not load Razorpay payment gateway. Please check your internet connection and try again.');
        setIsProcessing(null);
        return;
      }

      // Step 1: Create Order / Subscription via server API
      const resolvedRazorpayPlanId = (plan.id === 'plan-test-5' || !plan.razorpayPlanId) ? undefined : plan.razorpayPlanId;
      const isSubscriptionMode = Boolean(resolvedRazorpayPlanId && !appliedCoupon);

      let orderOrSubData: any = null;

      if (isSubscriptionMode) {
        const subRes = await fetch('/api/razorpay/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayPlanId: resolvedRazorpayPlanId,
            customerEmail: user.email,
            customerName: user.name || 'CampusCV User',
            planName: plan.name,
          })
        });
        const subData = await subRes.json();
        if (subRes.ok && subData.subscriptionId) {
          orderOrSubData = { type: 'subscription', id: subData.subscriptionId, key: subData.key };
        }
      }

      if (!orderOrSubData) {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalPrice,
            currency: 'INR',
            receipt: `rcpt_upg_${Date.now()}`,
            notes: {
              planId: plan.id,
              planName: plan.name,
              userEmail: user.email,
            }
          })
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.orderId) {
          alert(orderData.error || 'Failed to initialize payment. Please try again.');
          setIsProcessing(null);
          return;
        }
        orderOrSubData = { type: 'order', id: orderData.orderId, key: orderData.key };
      }

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: orderOrSubData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(finalPrice * 100),
        currency: 'INR',
        name: 'CampusCV Portfolio',
        description: `${plan.name} (${plan.duration} Days Access)`,
        image: '/logo.png',
        ...(orderOrSubData.type === 'subscription' 
          ? { subscription_id: orderOrSubData.id } 
          : { order_id: orderOrSubData.id }
        ),
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#7C3AED',
        },
        handler: async (response: any) => {
          try {
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                userEmail: user.email,
              })
            });

            mockAuth.upgradeToPro(plan.duration, plan.name);

            if (appliedCoupon) {
              mockDb.useCoupon(appliedCoupon.id);
            }

            mockDb.addTransaction({
              email: user.email,
              itemType: 'subscription',
              itemName: plan.name,
              price: finalPrice,
              originalPrice: plan.price,
              couponApplied: appliedCoupon?.code,
              durationDays: plan.duration,
              status: 'success',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || response.razorpay_subscription_id,
              subscriptionId: response.razorpay_subscription_id,
            });

            setIsProcessing(null);
            if (onUpgradeSuccess) {
              onUpgradeSuccess(plan);
            }
            onClose();
          } catch (err) {
            console.error('Payment verification error:', err);
            setIsProcessing(null);
            alert('Payment succeeded but verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(null);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay checkout error:', err);
      alert('An unexpected error occurred during checkout.');
      setIsProcessing(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200/90 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 text-white px-6 sm:px-8 py-5 flex items-start justify-between shrink-0">
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-violet-200 text-xs font-semibold border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Premium Templates</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-bricolage text-white leading-tight">
                {reason === 'limit_reached'
                  ? 'Template Usage Limit Reached'
                  : templateName
                    ? `Upgrade to Unlock "${templateName}"`
                    : 'Upgrade Your Plan'}
              </h2>
              <p className="text-xs sm:text-sm text-violet-200/90 font-dm-sans max-w-xl leading-relaxed">
                {reason === 'limit_reached'
                  ? `You've used ${currentUsageCount} of ${planLimit} allowed templates. Upgrade your plan tier to unlock more templates & advanced features.`
                  : templateName
                    ? `This template requires a ${requiredTier.toUpperCase()} plan or higher. Choose a plan below to unlock instantly.`
                    : 'Select a plan to access premium templates, custom domains, SEO tools, and priority recruiter views.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Coupon Code Section */}
            <div className="bg-gradient-to-r from-violet-50/80 via-purple-50/60 to-indigo-50/80 border border-violet-100 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="p-2 rounded-xl bg-violet-600/10 text-violet-700 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 font-bricolage flex items-center gap-1.5">
                    <span>Have a Coupon Code?</span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {appliedCoupon.discountPercent ?? appliedCoupon.discountValue}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Apply promo code to get instant discount across all plans
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applied: <b>{appliedCoupon.code}</b></span>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput('');
                        setCouponError(null);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] underline ml-2 cursor-pointer font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      placeholder="ENTER COUPON"
                      className="w-full sm:w-36 px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCouponModal();
                        }
                      }}
                    />
                    <button
                      onClick={handleApplyCouponModal}
                      disabled={!couponInput.trim() || isCheckingCoupon}
                      className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1"
                    >
                      {isCheckingCoupon ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {couponError && (
              <div className="text-xs text-rose-600 font-medium px-2 flex items-center gap-1">
                <span>⚠️ {couponError}</span>
              </div>
            )}

            {/* Plans Comparison — Trial → Monthly → Quarterly → Yearly */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {planList.map((p) => {
                const tier = (p.tier || 'monthly').toLowerCase();
                const isRequiredTier = tier === requiredTier.toLowerCase() || 
                  (requiredTier === 'monthly' && (p.id === 'plan-test-5' || p.id === 'plan-monthly')) ||
                  (requiredTier === 'quarterly' && p.id === 'plan-quarterly') ||
                  (requiredTier === 'yearly' && p.id === 'plan-yearly');

                const isRecommended = p.isPopular || p.id === 'plan-yearly';
                const { finalPrice, hasDiscount, buttonLabel } = calculatePlanPricing(p);

                const templateLimitText = p.allowedTemplateCount 
                  ? `${p.allowedTemplateCount} Templates`
                  : tier === 'yearly'
                    ? '12+ Templates'
                    : tier === 'quarterly'
                      ? '6 Templates'
                      : '3 Templates';

                // Tier color accent
                const tierColor = tier === 'yearly'
                  ? 'bg-violet-600'
                  : tier === 'quarterly'
                    ? 'bg-indigo-600'
                    : tier === 'monthly' && p.id !== 'plan-test-5'
                      ? 'bg-sky-600'
                      : 'bg-emerald-600';

                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl border-2 transition-all p-4 flex flex-col justify-between ${
                      isRequiredTier
                        ? 'border-violet-600 bg-violet-50/30 shadow-md shadow-violet-500/10'
                        : isRecommended
                          ? 'border-indigo-400 bg-indigo-50/20 shadow-sm'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    {/* Top Badge */}
                    {isRecommended && !isRequiredTier && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> Best Value
                      </div>
                    )}
                    {isRequiredTier && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        Required
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Tier label + name */}
                      <div>
                        <span className={`inline-block text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded text-white mb-1.5 ${tierColor}`}>
                          {p.id === 'plan-test-5' ? 'Trial' : tier}
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900 font-bricolage leading-tight">{p.name}</h3>
                        
                        {/* Price display with discount support */}
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className={`text-xl font-extrabold font-bricolage ${hasDiscount ? 'text-emerald-600' : 'text-zinc-950'}`}>
                            ₹{finalPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-zinc-400 line-through font-mono">
                              ₹{p.price}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500">/ {p.duration}d</span>
                        </div>
                      </div>

                      {/* Template Quota */}
                      <div className="p-2 rounded-lg bg-violet-100/60 border border-violet-200/80 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-violet-700 shrink-0" />
                        <span className="text-[11px] font-bold text-violet-900">{templateLimitText}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5 text-[11px] text-zinc-600">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 mt-3 border-t border-zinc-100">
                      <button
                        onClick={() => handlePayWithRazorpay(p)}
                        disabled={isProcessing !== null}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${
                          finalPrice === 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : isRequiredTier
                              ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20'
                              : isRecommended
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        }`}
                      >
                        {isProcessing === p.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{buttonLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-zinc-400 border-t border-zinc-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Payment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Template &amp; Feature Activation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-violet-600" />
                <span>Official Razorpay Gateway</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
