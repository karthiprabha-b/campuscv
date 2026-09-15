"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicPortfolioUrl, getPortfolioUrl } from '../../utils/urlHelper';
import CampusCvLogo from '../../components/common/CampusCvLogo';
import CampusCvBrand from '../../components/common/CampusCvBrand';
import CampusCvQrCode from '../../components/common/CampusCvQrCode';
import CustomDomainSection from '../../components/dashboard/CustomDomainSection';
import PortfolioAnalytics from '../../components/analytics/PortfolioAnalytics';
import { supabase } from '../../lib/supabase/client';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Layout, 
  Check,
  QrCode,
  Copy,
  RotateCcw,
  Lock,
  ShieldAlert,
  User,
  Tag,
  Receipt,
  Sparkles,
  ShoppingBag,
  Palette,
  ChevronDown,
  Settings,
  Share2,
  X,
  ArrowRight,
  CreditCard,
  Download,
  LayoutGrid,
  Globe,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  Eye,
} from 'lucide-react';
import { 
  initializeMockDb, 
  mockAuth, 
  mockDb, 
  PortfolioData, 
  UserProfile, 
  PlanConfig, 
  CouponCode, 
  Transaction,
  checkTemplateAccess,
  getUserPlanTier,
  getPlanTemplateLimit
} from '../../utils/mockDb';
import { downloadInvoicePdf } from '../../utils/invoicePdfGenerator';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { TemplateRecord } from '../../types/adminTemplate';
import { getPortfolios, savePortfolio, deletePortfolio } from '../../lib/portfolioStore';
import UpgradePlanModal from '../../components/common/UpgradePlanModal';
import { resolveInstalledTemplateAsync } from '../../utils/installedTemplateResolver';
import UserPortfolioPreviewModal from '../../components/dashboard/UserPortfolioPreviewModal';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F7FA] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'billing'>('overview');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userPortfolios, setUserPortfolios] = useState<PortfolioData[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'templates') setActiveTab('templates');
    else if (tab === 'billing' || tab === 'plans') setActiveTab('billing');
    else if (tab === 'overview') setActiveTab('overview');
  }, [searchParams]);

  // Profile modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaveLoading, setProfileSaveLoading] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Plans & Coupons states
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [planCouponCode, setPlanCouponCode] = useState('');
  const [appliedPlanCoupon, setAppliedPlanCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState<{
    isOpen: boolean;
    planName: string;
    amount: number;
    paymentId: string;
    orderId: string;
    tx?: any;
  } | null>(null);

  const [upgradeModalConfig, setUpgradeModalConfig] = useState<{
    isOpen: boolean;
    requiredTier?: 'free' | 'monthly' | 'quarterly' | 'yearly';
    templateName?: string;
    reason?: 'plan_tier' | 'limit_reached' | 'unpaid';
    currentUsageCount?: number;
    planLimit?: number;
  } | null>(null);

  // Dynamic Razorpay SDK loader
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
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

  // Plan coupon discount helper
  const getPlanDiscount = (plan: PlanConfig) => {
    if (!appliedPlanCoupon) return { discount: 0, finalPrice: plan.price, isApplicable: false };
    const isApplicable = !appliedPlanCoupon.applicablePlanIds ||
      appliedPlanCoupon.applicablePlanIds.length === 0 ||
      appliedPlanCoupon.applicablePlanIds.includes(plan.id);

    if (!isApplicable) {
      return { discount: 0, finalPrice: plan.price, isApplicable: false };
    }

    const isTrial = (plan.id || '').toLowerCase().includes('trial') || 
      (plan.id || '').toLowerCase().includes('test') || 
      (plan.name || '').toLowerCase().includes('trial') || 
      (plan.tier || '').toLowerCase() === 'trial';

    let discount = 0;
    if (appliedPlanCoupon.discountType === 'fixed') {
      discount = Math.min(plan.price, appliedPlanCoupon.discountValue || 0);
    } else {
      const pct = appliedPlanCoupon.discountPercent ?? appliedPlanCoupon.discountValue ?? 0;
      discount = Math.round((plan.price * pct) / 100);
    }

    let finalPrice = plan.price - discount;
    if (isTrial) {
      finalPrice = Math.max(0, finalPrice);
      discount = plan.price - finalPrice;
    } else {
      // Monthly, Quarterly, Yearly: Minimum value is ₹ 1 when 100% coupon is applied
      finalPrice = Math.max(1, finalPrice);
      discount = plan.price - finalPrice;
    }

    return { discount, finalPrice, isApplicable: true };
  };

  const handlePayWithRazorpay = async (plan: PlanConfig) => {
    if (!user) {
      alert('Please log in to upgrade your subscription.');
      return;
    }

    setPaymentLoading(plan.id);

    try {
      const { finalPrice, isApplicable } = getPlanDiscount(plan);
      const couponCode = (appliedPlanCoupon && isApplicable) ? appliedPlanCoupon.code : undefined;

      // Direct FREE Activation if final price is ₹ 0 (e.g., 100% discount coupon)
      if (finalPrice === 0) {
        if (appliedPlanCoupon && isApplicable) {
          mockDb.useCoupon(appliedPlanCoupon.id);
        }

        // Upgrade user locally
        mockAuth.upgradeToPro(plan.duration);
        const updatedUser = mockAuth.getCurrentUser();
        if (updatedUser) {
          updatedUser.storageLimitMB = plan.storageMB;
          updatedUser.planType = `${plan.duration}-days` as any;
          localStorage.setItem('portly_current_user', JSON.stringify(updatedUser));
        }

        // Update Supabase profile
        try {
          const { supabaseDb } = await import('../../lib/supabase/dbService');
          if (user.id) {
            await supabaseDb.upsertProfile({
              id: user.id,
              email: user.email,
              is_pro: true,
              plan_type: `${plan.duration}-days`,
              storage_limit_mb: plan.storageMB,
              subscription_expires_at: updatedUser?.subscriptionExpires,
            });
          }
        } catch (suErr) {
          console.warn('[Supabase profile update on free activation err]', suErr);
        }

        // Record free transaction for invoice and history
        const nowIso = new Date().toISOString();
        const expiresIso = updatedUser?.subscriptionExpires || new Date(Date.now() + plan.duration * 86400000).toISOString();
        const freeTxId = 'FREE_PROMO_' + Math.random().toString(36).substring(2, 9).toUpperCase();
        const tx = mockDb.addTransaction({
          email: user.email,
          itemType: 'subscription',
          itemName: `${plan.name} (${plan.duration} Days)`,
          price: 0,
          originalPrice: plan.price,
          couponApplied: couponCode,
          paymentId: freeTxId,
          orderId: 'ORDER_' + freeTxId,
          planId: plan.id,
          durationDays: plan.duration,
          startDate: nowIso,
          expiresDate: expiresIso,
          customerName: user.name || user.email.split('@')[0],
          customerEmail: user.email,
          status: 'PAID',
        });

        // Refresh transactions list & state
        setAppliedPlanCoupon(null);
        setPlanCouponCode('');
        await refreshData();

        setPaymentSuccessModal({
          isOpen: true,
          planName: plan.name,
          amount: 0,
          paymentId: freeTxId,
          orderId: 'ORDER_' + freeTxId,
          tx,
        });

        setPaymentLoading(null);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Could not load Razorpay payment gateway. Please check your internet connection and try again.');
        setPaymentLoading(null);
        return;
      }

      const resolvedRazorpayPlanId = (plan.id === 'plan-test-5' || !plan.razorpayPlanId) ? undefined : (
        plan.razorpayPlanId || (
          plan.id === 'plan-monthly' ? 'plan_TZ2SXEPIncd4pq' :
          plan.id === 'plan-quarterly' ? 'plan_TZ2TfhcN0WL6eE' :
          plan.id === 'plan-yearly' ? 'plan_TZ2Ui2Jy2k0Oa2' : undefined
        )
      );

      let isSubscriptionMode = Boolean(resolvedRazorpayPlanId && !appliedPlanCoupon);
      let checkoutOptions: any = null;

      if (isSubscriptionMode) {
        // Step 1: Create Razorpay Subscription on server (for AutoPay / Recurring)
        const subRes = await fetch('/api/razorpay/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayPlanId: resolvedRazorpayPlanId,
            planId: plan.id,
            planName: plan.name,
            userEmail: user.email,
          }),
        });

        const subData = await subRes.json();
        if (!subRes.ok || !subData.subscriptionId) {
          console.warn('Subscription creation failed, falling back to one-time order:', subData);
          isSubscriptionMode = false;
        } else {
          checkoutOptions = {
            key: subData.keyId,
            subscription_id: subData.subscriptionId,
            name: 'CampusCV',
            description: `${plan.name} AutoPay Subscription`,
            image: '/favicon.ico',
          };
        }
      }

      if (!isSubscriptionMode) {
        // Step 1 Fallback: Create Razorpay Order on server
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalPrice,
            planId: plan.id,
            planName: plan.name,
            userEmail: user.email,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          alert(orderData.error || 'Failed to initialize Razorpay payment. Please verify API keys.');
          setPaymentLoading(null);
          return;
        }

        checkoutOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'CampusCV',
          description: `${plan.name} (${plan.duration} Days Subscription)`,
          image: '/favicon.ico',
          order_id: orderData.orderId,
        };
      }

      // Step 2: Open Razorpay Modal
      const options = {
        ...checkoutOptions,
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment Signature on server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                amount: finalPrice,
                userEmail: user.email,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              if (appliedPlanCoupon && isApplicable) {
                mockDb.useCoupon(appliedPlanCoupon.id);
              }

              // Upgrade user locally
              mockAuth.upgradeToPro(plan.duration);
              const updatedUser = mockAuth.getCurrentUser();
              if (updatedUser) {
                updatedUser.storageLimitMB = plan.storageMB;
                updatedUser.planType = `${plan.duration}-days` as any;
                localStorage.setItem('portly_current_user', JSON.stringify(updatedUser));
              }

              // Update Supabase profile
              try {
                const { supabaseDb } = await import('../../lib/supabase/dbService');
                if (user.id) {
                  await supabaseDb.upsertProfile({
                    id: user.id,
                    email: user.email,
                    is_pro: true,
                    plan_type: `${plan.duration}-days`,
                    storage_limit_mb: plan.storageMB,
                    subscription_expires_at: updatedUser?.subscriptionExpires,
                  });
                }
              } catch (suErr) {
                console.warn('[Supabase profile update on payment err]', suErr);
              }

              // Record transaction with full metadata for invoice
              const nowIso = new Date().toISOString();
              const expiresIso = updatedUser?.subscriptionExpires || new Date(Date.now() + plan.duration * 86400000).toISOString();
              const tx = mockDb.addTransaction({
                email: user.email,
                itemType: 'subscription',
                itemName: `${plan.name} (${plan.duration} Days)`,
                price: finalPrice,
                originalPrice: plan.price,
                couponApplied: couponCode,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || response.razorpay_subscription_id,
                subscriptionId: response.razorpay_subscription_id,
                planId: plan.id,
                durationDays: plan.duration,
                startDate: nowIso,
                expiresDate: expiresIso,
                customerName: user.name || user.email.split('@')[0],
                customerEmail: user.email,
                status: 'PAID',
              });

              setAppliedPlanCoupon(null);
              setPlanCouponCode('');
              await refreshData();

              setPaymentSuccessModal({
                isOpen: true,
                planName: plan.name,
                amount: finalPrice,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || response.razorpay_subscription_id,
                tx,
              });
            } else {
              alert(verifyData.error || 'Payment verification failed on server.');
            }
          } catch (verErr: any) {
            console.error('Payment verification error:', verErr);
            alert('Error verifying payment.');
          } finally {
            setPaymentLoading(null);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        alert(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        setPaymentLoading(null);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay checkout error:', err);
      alert(err?.message || 'Payment initiation failed.');
      setPaymentLoading(null);
    }
  };

  // Templates states
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [templateCouponInput, setTemplateCouponInput] = useState<Record<string, string>>({});

  // User Transactions
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);

  // ── New UI-only states ──
  const [showQrModal, setShowQrModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBillingSection, setShowBillingSection] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewModalConfig, setPreviewModalConfig] = useState<{ isOpen: boolean; overrideTemplateId?: string | null }>({
    isOpen: false,
    overrideTemplateId: null
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);

  const refreshData = async (currentUser?: UserProfile | null) => {
    try {
      let activeUser = currentUser || mockAuth.getCurrentUser();
      let currentUid = activeUser?.id;

      try {
        const { data: { user: suUser } } = await supabase.auth.getUser();
        if (suUser) {
          currentUid = suUser.id;
          let profile: any = null;
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', suUser.id)
              .maybeSingle();
            profile = data;
          } catch {}

          const isProFromDb = profile ? (profile.is_pro ?? false) : false;
          const planTypeFromDb = profile?.plan_type || (isProFromDb ? '30-days' : 'free');
          const expiresAtFromDb = profile?.subscription_expires_at || undefined;

          activeUser = {
            id: suUser.id,
            email: profile?.email || suUser.email || activeUser?.email || '',
            name: profile?.full_name || suUser.user_metadata?.full_name || suUser.user_metadata?.name || activeUser?.name || suUser.email?.split('@')[0] || 'User',
            isPro: isProFromDb,
            planType: planTypeFromDb,
            subscriptionExpires: expiresAtFromDb,
            storageLimitMB: profile?.storage_limit_mb || 500,
          };
          localStorage.setItem('portly_current_user', JSON.stringify(activeUser));
          const users = JSON.parse(localStorage.getItem('portly_users') || '[]');
          const idx = users.findIndex((u: any) => u.email.toLowerCase() === (activeUser?.email || '').toLowerCase());
          if (idx !== -1) {
            users[idx] = activeUser;
          } else {
            users.push(activeUser);
          }
          localStorage.setItem('portly_users', JSON.stringify(users));
        }
      } catch {}

      if (activeUser) {
        setUser({ ...activeUser, id: currentUid || activeUser.id });
        setUserTransactions(mockDb.getTransactions(activeUser.email));
      }

      const list = await getPortfolios(currentUid);
      setUserPortfolios(list);
      if (list.length > 0) {
        setSelectedPortfolio(list[0]);
      } else {
        setSelectedPortfolio(null);
      }
      setPlans(mockDb.getPlans().filter(p => p.isActive));
      
      const activeTemplates = await adminTemplateDb.syncWithServerRegistryAsync(false);
      setTemplates(activeTemplates.filter(t => (t.status || 'active') === 'active'));

      // Always sync coupons from server so freshly created/deleted coupons take effect immediately
      await mockDb.syncCouponsFromServer().catch(() => {});
    } catch (e) {
      console.error('[Dashboard refreshData error]', e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      initializeMockDb();
      mockAuth.checkSubscriptionExpiry();

      let activeUser = mockAuth.getCurrentUser();
      try {
        const { data: { user: suUser } } = await supabase.auth.getUser();
        if (suUser) {
          let profile: any = null;
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', suUser.id)
              .maybeSingle();
            profile = data;
          } catch {}

          const isProFromDb = profile ? (profile.is_pro ?? false) : false;
          const planTypeFromDb = profile?.plan_type || (isProFromDb ? '30-days' : 'free');
          const expiresAtFromDb = profile?.subscription_expires_at || undefined;

          activeUser = {
            id: suUser.id,
            email: profile?.email || suUser.email || activeUser?.email || '',
            name: profile?.full_name || suUser.user_metadata?.full_name || suUser.user_metadata?.name || activeUser?.name || suUser.email?.split('@')[0] || 'User',
            isPro: isProFromDb,
            planType: planTypeFromDb,
            subscriptionExpires: expiresAtFromDb,
            storageLimitMB: profile?.storage_limit_mb || 500,
          };
          localStorage.setItem('portly_current_user', JSON.stringify(activeUser));
        }
      } catch {}

      if (!activeUser) {
        router.push('/auth/login');
        return;
      }

      if (mounted) {
        setUser(activeUser);
        setEditName(activeUser.name || '');
        await refreshData(activeUser);
      }
    };

    init();

    // Instant re-sync when navigating back, switching tabs, or updating plans in admin
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };
    const handlePlansUpdated = () => {
      setPlans(mockDb.getPlans().filter(p => p.isActive));
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('campuscv:plans-updated', handlePlansUpdated);
    window.addEventListener('storage', handlePlansUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('campuscv:plans-updated', handlePlansUpdated);
      window.removeEventListener('storage', handlePlansUpdated);
    };
  }, []);

  const handleLogout = async () => {
    await mockAuth.logout();
    router.replace('/');
    router.refresh();
  };

  const handleCreateNewPortfolio = () => {
    if (!user?.isPro || isExpired) {
      setActiveTab('billing');
      alert("Subscription Required: Please choose and purchase a plan to create your portfolio.");
      return;
    }
    if (userPortfolios.length >= 1) {
      alert("One account can create 1 portfolio only. Please delete your existing portfolio to build a new one.");
      return;
    }
    router.push('/onboarding');
  };

  const handleDeletePortfolio = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this portfolio website?')) {
      await deletePortfolio(id);
      const updated = await getPortfolios();
      setUserPortfolios(updated);
      if (updated.length > 0) {
        setSelectedPortfolio(updated[0]);
      } else {
        setSelectedPortfolio(null);
      }
    }
  };

  const handleApplyPlanCoupon = async (planId?: string) => {
    setCouponError('');
    if (!planCouponCode.trim()) {
      setAppliedPlanCoupon(null);
      return;
    }
    const coupon = await mockDb.validateCouponAsync(planCouponCode.trim(), planId);
    if (coupon) {
      setAppliedPlanCoupon(coupon);
    } else {
      setAppliedPlanCoupon(null);
      setCouponError('Invalid, expired, or inapplicable coupon code');
    }
  };

  const handleUpgrade = (plan: PlanConfig) => {
    if (!user) return;
    let finalPrice = plan.price;
    let couponCode: string | undefined = undefined;

    if (appliedPlanCoupon) {
      const isTrial = (plan.id || '').toLowerCase().includes('trial') || 
        (plan.id || '').toLowerCase().includes('test') || 
        (plan.name || '').toLowerCase().includes('trial') || 
        (plan.tier || '').toLowerCase() === 'trial';
      const discount = (plan.price * (appliedPlanCoupon.discountPercent ?? appliedPlanCoupon.discountValue ?? 0)) / 100;
      finalPrice = isTrial ? Math.max(0, plan.price - discount) : Math.max(1, plan.price - discount);
      couponCode = appliedPlanCoupon.code;
      mockDb.useCoupon(appliedPlanCoupon.id);
    }

    mockAuth.upgradeToPro(plan.duration);
    const updatedUser = mockAuth.getCurrentUser();
    if (updatedUser) {
      updatedUser.storageLimitMB = plan.storageMB;
      localStorage.setItem('portly_current_user', JSON.stringify(updatedUser));
    }

    mockDb.addTransaction({
      email: user.email,
      itemType: 'subscription',
      itemName: `${plan.name} (${plan.duration} Days)`,
      price: finalPrice,
      originalPrice: plan.price,
      couponApplied: couponCode,
    });

    setAppliedPlanCoupon(null);
    setPlanCouponCode('');
    refreshData();
    alert(`Success! Plan upgraded to ${plan.name} (${plan.duration} Days).`);
  };

  const handleBuyTemplate = (tpl: TemplateRecord) => {
    if (!user) return;
    const origPrice = tpl.price || 0;
    const inputCode = (templateCouponInput[tpl.id] || '').trim();
    let finalPrice = origPrice;
    let couponCode: string | undefined = undefined;

    if (inputCode) {
      const coupon = mockDb.validateCoupon(inputCode);
      if (coupon) {
        const discount = (origPrice * (coupon.discountPercent ?? 0)) / 100;
        finalPrice = Math.max(0, origPrice - discount);
        couponCode = coupon.code;
        mockDb.useCoupon(coupon.id);
      } else {
        alert("Invalid or expired coupon code for template!");
        return;
      }
    }

    if (confirm(`Confirm purchase of template "${tpl.name}" for $${finalPrice.toFixed(2)}${couponCode ? ` (Coupon: ${couponCode})` : ''}?`)) {
      mockDb.purchaseTemplate(user.email, tpl.id, origPrice, couponCode, finalPrice);
      setTemplateCouponInput(prev => ({ ...prev, [tpl.id]: '' }));
      refreshData();
      alert(`Success! Template "${tpl.name}" is now unlocked for your account.`);
    }
  };

  const handleApplyTemplateToPortfolio = async (tplId: string) => {
    if (!selectedPortfolio) {
      router.push(`/onboarding?templateId=${encodeURIComponent(tplId)}`);
      return;
    }
    const resolvedTmpl = await resolveInstalledTemplateAsync(tplId, selectedPortfolio);
    const sectionFiles = (resolvedTmpl.sectionFiles && Object.keys(resolvedTmpl.sectionFiles).length > 0) ? resolvedTmpl.sectionFiles : selectedPortfolio.sectionFiles;
    const updated = { ...selectedPortfolio, templateId: tplId, layoutStyle: tplId, sectionFiles };
    await savePortfolio(updated);
    setSelectedPortfolio(updated);
    setUserPortfolios(await getPortfolios());
    alert(`Template applied to portfolio "${selectedPortfolio.name}"!`);
  };

  const handleForceExpire = () => {
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      currentUser.isPro = false;
      currentUser.planType = 'expired';
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      currentUser.subscriptionExpires = yesterday.toISOString().split('T')[0];
      localStorage.setItem('portly_current_user', JSON.stringify(currentUser));
      const users = JSON.parse(localStorage.getItem('portly_users') || '[]');
      const idx = users.findIndex((u: any) => u.email === currentUser.email);
      if (idx !== -1) {
        users[idx] = currentUser;
        localStorage.setItem('portly_users', JSON.stringify(users));
      }
      setUser(currentUser);
      alert("Subscription expired!");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = mockAuth.getCurrentUser();
    if (!currentUser) return;

    setProfileSaveLoading(true);
    setProfileFeedback(null);

    try {
      const { supabase } = await import('../../lib/supabase/client');
      const { supabaseDb } = await import('../../lib/supabase/dbService');

      // 1. Direct Password Change in Supabase Auth
      if (newPassword) {
        if (newPassword.length < 6) {
          setProfileFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
          setProfileSaveLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setProfileFeedback({ type: 'error', message: 'New passwords do not match.' });
          setProfileSaveLoading(false);
          return;
        }

        const { error: suPwdError } = await supabase.auth.updateUser({
          password: newPassword.trim(),
        });

        if (suPwdError) {
          setProfileFeedback({ type: 'error', message: suPwdError.message });
          setProfileSaveLoading(false);
          return;
        }

        currentUser.password = newPassword.trim();
      }

      // 2. Update Name in Supabase Profiles & Auth
      if (editName.trim()) {
        currentUser.name = editName.trim();
        await supabase.auth.updateUser({
          data: { full_name: editName.trim(), name: editName.trim() }
        }).catch(() => {});
        
        try {
          const { data: { user: suUser } } = await supabase.auth.getUser();
          if (suUser) {
            await supabaseDb.upsertProfile({
              id: suUser.id,
              email: suUser.email || currentUser.email,
              full_name: editName.trim(),
            });
          }
        } catch {}
      }

      // 3. Update Local Storage Fallback Cache
      localStorage.setItem('portly_current_user', JSON.stringify(currentUser));
      const users: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
      const uIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (uIdx !== -1) {
        users[uIdx] = { ...users[uIdx], name: editName.trim(), ...(newPassword ? { password: newPassword.trim() } : {}) };
        localStorage.setItem('portly_users', JSON.stringify(users));
      }

      setUser({ ...currentUser });
      setProfileFeedback({ type: 'success', message: 'Password & profile updated successfully in Supabase!' });
      
      setTimeout(() => {
        setShowProfileModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setProfileFeedback(null);
      }, 1200);
    } catch (err: any) {
      setProfileFeedback({ type: 'error', message: err.message || 'Failed to update password.' });
    } finally {
      setProfileSaveLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setProfileFeedback(null);
    try {
      const { supabase } = await import('../../lib/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/forgot-password` : undefined
      });
      if (error) {
        setProfileFeedback({ type: 'error', message: error.message });
      } else {
        setProfileFeedback({ type: 'success', message: `Password reset recovery link sent to ${user.email}!` });
      }
    } catch (err: any) {
      setProfileFeedback({ type: 'error', message: err.message || 'Failed to send reset email.' });
    }
  };

  const isTemplateUnlocked = (tpl: TemplateRecord) => {
    if (!tpl.isPremium || tpl.price === 0) return true;
    if (user?.purchasedTemplateIds?.includes(tpl.id)) return true;
    if (tpl.purchasedBy?.includes(user?.email || '')) return true;
    return false;
  };

  const handleCopyLink = () => {
    if (!selectedPortfolio) return;
    navigator.clipboard.writeText(getPublicPortfolioUrl(selectedPortfolio.username));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadInvoice = async (tx: any) => {
    try {
      await downloadInvoicePdf(tx, user, selectedPortfolio?.username);
    } catch (err) {
      console.error('[Invoice Download Error]', err);
    }
  };

  // Helpers
  const firstName = user?.name?.split(' ')[0] || 'there';
  const storageUsed = 126; // MB (mock)
  const storageLimit = user?.storageLimitMB || 25;
  const storagePercent = Math.min(100, Math.round((storageUsed / storageLimit) * 100));
  const activeTemplate = selectedPortfolio ? templates.find(t => t.id === selectedPortfolio.templateId) : null;

  // Subscription status calculations
  const daysUntilExpiry = user?.subscriptionExpires
    ? Math.ceil((new Date(user.subscriptionExpires).getTime() - Date.now()) / 86400000)
    : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const hasEverPurchased = Boolean(user?.subscriptionExpires);
  const isExpired = user?.planType === 'expired' || (hasEverPurchased && new Date(user!.subscriptionExpires!).getTime() < Date.now());
  const isUnpaidNewUser = !user?.isPro && !isExpired && !hasEverPurchased;
  const isSubscribed = Boolean(user?.isPro && !isExpired);

  return (
    <div className="min-h-screen bg-[#F7F7FA] font-sans text-zinc-950 antialiased">

      {/* ══════════════════════════════════════════
          NAVIGATION BAR
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 h-[60px] sm:h-[68px] bg-white/95 backdrop-blur-md border-b border-zinc-200 flex items-center px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">

          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center shrink-0">
              <CampusCvLogo className="h-7 sm:h-8 lg:h-9 w-auto" />
            </Link>
          </div>

          {/* Center: Nav Tabs — properly centered pill */}
          <nav className="hidden sm:flex items-center justify-center gap-0.5 sm:gap-1 p-1 bg-zinc-100/80 rounded-2xl border border-zinc-200/60 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 lg:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-[#7C3AED] shadow-xs font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
              }`}
            >
              Overview
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 lg:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white text-[#7C3AED] shadow-xs font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
              }`}
            >
              Templates
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('billing')}
              className={`px-3 lg:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-white text-[#7C3AED] shadow-xs font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
              }`}
            >
              Plans &amp; Billing
            </button>
          </nav>

          {/* Right: User dropdown & neat divider docked together */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 justify-end">
            <div className="h-5 w-px bg-zinc-200 hidden md:block" />

            {/* User dropdown with avatar & name */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(prev => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2.5 pr-1.5 sm:pr-2 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold uppercase shrink-0 shadow-xs">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-800 hidden md:block max-w-[100px] lg:max-w-[160px] truncate">{user?.name || 'User'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-900/10 overflow-hidden z-50">
                  <div className="p-3 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900">{user?.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { setShowProfileModal(true); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-zinc-400" />
                      Account Settings
                    </button>
                    <div className="border-t border-zinc-100 my-1" />
                    <button
                      onClick={() => { if (confirm("Reset CampusCV Database? This will erase all local data.")) { localStorage.clear(); window.location.href = '/'; } }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset All Data
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left cursor-pointer">
                      <LogOut className="w-4 h-4 text-zinc-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Tab Bar (visible only on xs) ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 flex items-center h-14 px-2 safe-area-pb">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'text-[#7C3AED]' : 'text-zinc-400'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'templates' ? 'text-[#7C3AED]' : 'text-zinc-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'billing' ? 'text-[#7C3AED]' : 'text-zinc-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Billing
        </button>
      </nav>

      {/* ══════════════════════════════════════════
          MAIN CONTENT (TABS)
      ══════════════════════════════════════════ */}
      <main className="w-full max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 text-left pb-20 sm:pb-0">

        {/* ══════════════════════════════════════════
            TAB 1: OVERVIEW
        ══════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Welcome Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bricolage tracking-tight text-zinc-950 leading-tight">
                Welcome back, {firstName}.
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 mt-1 font-dm-sans">
                {userPortfolios.length > 0
                  ? 'Your portfolio is live and ready to share.'
                  : 'Set up your portfolio to get started.'}
              </p>
            </div>

            {/* PORTFOLIO HERO CARD / EMPTY STATE */}
            {dataLoading ? (
              <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px]">
                <div className="w-10 h-10 border-3 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-zinc-500">Loading your portfolio dashboard...</p>
              </div>
            ) : userPortfolios.length === 0 ? (
              /* Empty state */
              <div className="bg-white border border-dashed border-zinc-300 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center space-y-5 shadow-sm">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <CampusCvLogo variant="icon" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 font-bricolage">No portfolio yet</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-sm mx-auto">
                    Create your professional portfolio. Choose a template, add your details, and publish your personal website.
                  </p>
                </div>
                <button
                  onClick={handleCreateNewPortfolio}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Build My Portfolio
                </button>
              </div>
            ) : selectedPortfolio && (
              /* Featured Hero Portfolio Card */
              <div className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="flex flex-col lg:flex-row items-stretch">
                  
                  {/* Left: Metadata & Primary Actions */}
                  <div className="lg:w-[42%] xl:w-[38%] p-5 sm:p-7 lg:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-100 space-y-6">
                    <div className="space-y-4">
                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE
                        </span>
                        {activeTemplate && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium">
                            {activeTemplate.name} Portfolio
                          </span>
                        )}
                      </div>

                      {/* Portfolio Title */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Your Portfolio</p>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-bricolage text-zinc-950 mt-0.5 leading-tight">
                          {selectedPortfolio.name}
                        </h2>
                      </div>

                      {/* Public Live URL Input */}
                      <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200/90 rounded-2xl">
                        <Globe className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
                        <span className="text-xs sm:text-sm font-mono text-zinc-600 truncate flex-1 select-all">
                          {getPublicPortfolioUrl(selectedPortfolio.username).replace(/^https?:\/\//, '')}
                        </span>
                      </div>

                      {/* Template label */}
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Layout className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Template: <strong className="text-zinc-800 font-semibold capitalize">{activeTemplate?.name || selectedPortfolio.templateId}</strong></span>
                      </div>
                    </div>

                      {/* Action buttons */}
                    <div className="space-y-2.5 pt-2">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {isExpired ? (
                          <button
                            onClick={() => setActiveTab('billing')}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs px-2 sm:px-3 text-center cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Renew to Edit</span>
                          </button>
                        ) : isUnpaidNewUser ? (
                          <button
                            onClick={() => setActiveTab('billing')}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs px-2 sm:px-3 text-center cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Buy a Plan</span>
                          </button>
                        ) : (
                          <Link
                            href={`/editor/${selectedPortfolio.id}`}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs px-2 sm:px-3 text-center"
                          >
                            <Pencil className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Edit Portfolio</span>
                          </Link>
                        )}
                        <a
                          href={`/${selectedPortfolio.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs px-2 sm:px-3 text-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">View Live</span>
                        </a>
                      </div>

                      {/* Second row: Full Live Preview, QR code, Copy link */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <button
                          onClick={() => setPreviewModalConfig({ isOpen: true, overrideTemplateId: null })}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 bg-violet-50 hover:bg-violet-100 border border-violet-200/80 text-[#7C3AED] rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer px-1.5 sm:px-2"
                          title="Interactive Device Preview"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Preview</span>
                        </button>
                        <button
                          onClick={() => setShowQrModal(true)}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer px-1.5 sm:px-2"
                        >
                          <QrCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">QR Code</span>
                        </button>
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer px-1.5 sm:px-2"
                        >
                          {copiedLink ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-emerald-600 font-bold truncate">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <span className="truncate">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="pt-1 flex justify-start">
                        <button
                          onClick={(e) => handleDeletePortfolio(selectedPortfolio.id, e)}
                          className="text-xs text-zinc-400 hover:text-red-600 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Delete Portfolio</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Prominent thumbnail preview with browser mockup */}
                  <div className="lg:w-[58%] xl:w-[62%] bg-zinc-50 flex flex-col justify-between border-t lg:border-t-0">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-zinc-100">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 bg-zinc-100 rounded-md px-2.5 py-1 text-[11px] sm:text-xs font-mono text-zinc-500 text-center truncate ml-2">
                        {getPublicPortfolioUrl(selectedPortfolio.username).replace(/^https?:\/\//, '')}
                      </div>
                      <button
                        onClick={() => setPreviewModalConfig({ isOpen: true, overrideTemplateId: null })}
                        className="p-1 rounded-md text-zinc-400 hover:text-[#7C3AED] hover:bg-violet-50 transition-colors"
                        title="Open Fullscreen Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interactive Aspect Ratio Preview container */}
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-100/60 p-3 sm:p-6 lg:p-8">
                      <div 
                        onClick={() => setPreviewModalConfig({ isOpen: true, overrideTemplateId: null })}
                        className="w-full max-w-[520px] aspect-[16/10] relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-zinc-200 bg-white cursor-pointer group transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {activeTemplate?.thumbnail ? (
                          <img
                            src={activeTemplate.thumbnail}
                            alt={activeTemplate.name}
                            onError={(e) => {
                              const id = (activeTemplate.id || '').toLowerCase();
                              const cat = (activeTemplate.category || '').toLowerCase();
                              if (id.includes('cs') || cat.includes('developer') || id.includes('software')) {
                                (e.currentTarget as HTMLImageElement).src = '/templates/cs/thumbnail.png';
                              } else if (id.includes('student') || cat.includes('student')) {
                                (e.currentTarget as HTMLImageElement).src = '/templates/student/thumbnail.png';
                              } else {
                                (e.currentTarget as HTMLImageElement).src = '/templates/designer/thumbnail.png';
                              }
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#7C3AED]/10 via-white to-[#A78BFA]/10 flex flex-col items-center justify-center gap-3 p-6 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center">
                              <Layout className="w-6 h-6 text-[#7C3AED]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-900">{selectedPortfolio.name}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">Portfolio preview</p>
                            </div>
                          </div>
                        )}

                        {/* Interactive Hover Overlay */}
                        <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 text-white">
                          <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-600/50 transform group-hover:scale-110 transition-transform">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs font-bold tracking-wide drop-shadow-sm font-bricolage">
                            Click for Full Live Preview
                          </span>
                          <span className="text-[10px] text-zinc-300 font-mono">
                            Desktop • Tablet • Mobile
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VISITOR ANALYTICS SECTION */}
            {selectedPortfolio && (
              <PortfolioAnalytics
                portfolioId={selectedPortfolio.id}
                username={selectedPortfolio.username}
              />
            )}

            {/* CUSTOM DOMAIN SETTINGS */}
            {selectedPortfolio && (
              <CustomDomainSection
                portfolioId={selectedPortfolio.id}
                portfolioUsername={selectedPortfolio.username}
              />
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB 2: TEMPLATES
        ══════════════════════════════════════════ */}
        {activeTab === 'templates' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bricolage tracking-tight text-zinc-950 leading-tight">
                Discover Templates
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 mt-1 font-dm-sans">
                Explore beautifully crafted designs for your portfolio.
              </p>
            </div>

            {templates.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-10 text-center text-zinc-400 text-sm">
                No templates available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...templates].sort((a, b) => {
                    const TIER_ORDER: Record<string, number> = { 'free': 0, 'trial': 1, 'monthly': 1, 'quarterly': 2, 'yearly': 3, 'pro': 3 };
                    const aRank = TIER_ORDER[(a.planTier || 'free').toLowerCase()] ?? 1;
                    const bRank = TIER_ORDER[(b.planTier || 'free').toLowerCase()] ?? 1;
                    return aRank - bRank;
                  }).map((t, idx) => {
                  const isCurrentlyUsed = selectedPortfolio?.templateId === t.id;
                  const access = checkTemplateAccess(user, t, userPortfolios.length);
                  const isLocked = !isCurrentlyUsed && !access.isAccessible;

                  const rawTier = (t.planTier || (t.isPremium ? 'yearly' : 'monthly')).toLowerCase();
                  const planTier = rawTier === 'free' ? 'free' : rawTier === 'quarterly' ? 'quarterly' : (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

                  return (
                    <div
                      key={t.id ? `${t.id}-${idx}` : `dashboard-tpl-${idx}`}
                      className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all shrink-0 ${
                        isLocked ? 'border-zinc-200/80 opacity-95' : 'border-zinc-200'
                      }`}
                    >
                      {/* Large preview image */}
                      <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden select-none">
                        {t.thumbnail ? (
                          <img
                            src={t.thumbnail}
                            alt={t.name}
                            onError={(e) => {
                              const id = (t.id || '').toLowerCase();
                              const cat = (t.category || '').toLowerCase();
                              if (id.includes('cs') || cat.includes('developer') || id.includes('software')) {
                                (e.currentTarget as HTMLImageElement).src = '/templates/cs/thumbnail.png';
                              } else if (id.includes('student') || cat.includes('student')) {
                                (e.currentTarget as HTMLImageElement).src = '/templates/student/thumbnail.png';
                              } else {
                                (e.currentTarget as HTMLImageElement).src = '/templates/designer/thumbnail.png';
                              }
                            }}
                            className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500 ${
                              isLocked ? 'grayscale-[30%]' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                            <Layout className="w-10 h-10 text-zinc-400" />
                          </div>
                        )}

                        {/* Top Left: Plan Tier Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm ${
                            planTier === 'free'
                              ? 'bg-emerald-500/90 text-white'
                              : planTier === 'monthly'
                                ? 'bg-sky-500/90 text-white'
                                : planTier === 'quarterly'
                                  ? 'bg-indigo-600/90 text-white'
                                  : 'bg-violet-700/90 text-white'
                          }`}>
                            {planTier}
                          </span>
                        </div>

                        {/* Top Right: Currently used or Locked badge */}
                        {isCurrentlyUsed ? (
                          <div className="absolute top-3 right-3 bg-zinc-950/80 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </div>
                        ) : isLocked ? (
                          <div className="absolute top-3 right-3 bg-amber-500/95 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </div>
                        ) : null}
                      </div>

                      {/* Info + actions */}
                      <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                        <div className="space-y-1.5">
                          {/* Title & category badge aligned */}
                          <div className="flex items-start justify-between gap-2 min-h-[44px]">
                            <h4 className="font-bold text-zinc-900 text-sm leading-snug line-clamp-2 flex-1">{t.name}</h4>
                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded shrink-0 capitalize mt-0.5">{t.category}</span>
                          </div>
                          {/* Description */}
                          <p className="text-xs text-zinc-500 leading-[18px] line-clamp-2 h-[36px] overflow-hidden">{t.description}</p>
                        </div>

                        {/* Action buttons pinned to bottom */}
                        <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                          {selectedPortfolio && (
                            <button
                              type="button"
                              onClick={() => setPreviewModalConfig({ isOpen: true, overrideTemplateId: t.id })}
                              className="h-9 px-2.5 rounded-xl border border-zinc-200 hover:border-violet-300 hover:bg-violet-50 text-zinc-600 hover:text-[#7C3AED] text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-xs"
                              title={`Preview ${t.name} with your portfolio content`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Preview</span>
                            </button>
                          )}

                          {isLocked ? (
                            <button
                              onClick={() => {
                                setUpgradeModalConfig({
                                  isOpen: true,
                                  templateName: t.name,
                                  requiredTier: access.requiredTier,
                                  reason: access.reason,
                                  currentUsageCount: userPortfolios.length,
                                  planLimit: access.planLimit,
                                });
                              }}
                              className="flex-1 h-9 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5 shrink-0" />
                              <span>Upgrade to Unlock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!user?.isPro || isExpired) {
                                  setActiveTab('billing');
                                  alert("Subscription Required: Please choose and purchase a plan to apply templates.");
                                  return;
                                }
                                handleApplyTemplateToPortfolio(t.id);
                              }}
                              disabled={isCurrentlyUsed}
                              className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${
                                isCurrentlyUsed
                                  ? 'bg-zinc-100 text-zinc-400 cursor-default'
                                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm cursor-pointer'
                              }`}
                            >
                              {isCurrentlyUsed ? 'Active Template' : 'Use Template'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB 3: PLANS & BILLING
        ══════════════════════════════════════════ */}
        {activeTab === 'billing' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bricolage text-zinc-950">Plans &amp; Pricing</h1>
                <p className="text-sm text-zinc-500 mt-1 font-dm-sans">
                  Choose the plan that fits your career goals. Secure payments with Razorpay.
                </p>
              </div>

              {/* Current Active Plan Status */}
              <div className={`border rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xs ${
                isExpired
                  ? 'bg-red-50/70 border-red-200 text-red-700'
                  : isUnpaidNewUser
                  ? 'bg-violet-50/70 border-violet-200 text-violet-700'
                  : 'bg-white border-zinc-200'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isExpired
                    ? 'bg-red-100 text-red-600'
                    : isUnpaidNewUser
                    ? 'bg-violet-100 text-[#7C3AED]'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>
                  {isExpired ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : isUnpaidNewUser ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Subscription Status</div>
                  <div className={`text-xs font-bold capitalize ${
                    isExpired ? 'text-red-700' : isUnpaidNewUser ? 'text-violet-700' : 'text-zinc-900'
                  }`}>
                    {isExpired
                      ? 'Expired — Renew Required'
                      : isUnpaidNewUser
                      ? 'No Active Plan — Buy a Plan'
                      : `${user?.planType?.replace('-', ' ') || 'Active Pro'}`}
                    {user?.subscriptionExpires && !isExpired && !isUnpaidNewUser
                      ? ` (Expires: ${new Date(user.subscriptionExpires).toLocaleDateString()})`
                      : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Expired Warning Banner */}
            {isExpired && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-red-900 font-bricolage">Subscription Expired — Editing Locked</h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      Your published website is currently showing an offline expired notice and portfolio editing is paused. Pick a plan below to reactivate immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New User Choose Plan Banner */}
            {isUnpaidNewUser && (
              <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-2 border-violet-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-violet-950 font-bricolage">Ready to Publish? Choose a Plan</h4>
                    <p className="text-xs text-violet-700 mt-0.5 font-dm-sans">
                      Select any plan below to unlock custom domains, live portfolio publishing, unlimited themes, and high-res exports.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Code Input */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs text-zinc-600 w-full sm:w-auto">
                <Tag className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span>Have a promotional coupon code?</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="ENTER COUPON..."
                  value={planCouponCode}
                  onChange={(e) => {
                    setPlanCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  className="h-9 px-3 text-xs font-mono uppercase bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#7C3AED] w-full sm:w-48"
                />
                <button
                  onClick={() => handleApplyPlanCoupon()}
                  className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>

            {appliedPlanCoupon && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Coupon <strong>{appliedPlanCoupon.code}</strong> applied! ({appliedPlanCoupon.discountType === 'percent' ? `${appliedPlanCoupon.discountValue}% OFF` : `₹${appliedPlanCoupon.discountValue} OFF`})
                  <span className="text-[11px] text-emerald-600 font-normal">
                    ({!appliedPlanCoupon.applicablePlanIds || appliedPlanCoupon.applicablePlanIds.length === 0 ? 'Applies to All Plans' : 'Connected to selected plans'})
                  </span>
                </span>
                <button
                  onClick={() => {
                    setAppliedPlanCoupon(null);
                    setPlanCouponCode('');
                  }}
                  className="text-emerald-700 hover:text-emerald-900 underline text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
                {couponError}
              </div>
            )}

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
              
              {/* 0. 1 Month Trial Plan */}
              {(() => {
                const testPlan = plans.find(p => p.id === 'plan-test-5') || {
                  id: 'plan-test-5',
                  name: '1 Month Trial',
                  desc: '',
                  price: 30,
                  duration: 30,
                  storage: '500 MB',
                  features: ['1 Month Access', 'Portfolio Website', '3 Templates', 'QR Code & Custom URL'],
                  buttonText: 'START TRIAL FOR ₹ 30',
                };
                const { finalPrice, isApplicable } = getPlanDiscount(testPlan as any);
                const isLoading = paymentLoading === testPlan.id;

                return (
                  <div className="bg-white rounded-[28px] border border-zinc-200/90 shadow-sm hover:shadow-md transition-all p-7 flex flex-col justify-between relative overflow-hidden">
                    <div>
                      <h3 className="text-2xl font-bold font-bricolage text-zinc-950">{testPlan.name}</h3>
                      {testPlan.desc && !testPlan.desc.includes('One-Time') && !testPlan.desc.includes('30 Days') && (
                        <p className="text-xs font-medium text-zinc-500 mt-1">{testPlan.desc}</p>
                      )}

                      <div className="my-7">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-black font-bricolage text-indigo-600">
                            ₹ {finalPrice}
                          </span>
                          {appliedPlanCoupon && isApplicable && finalPrice !== testPlan.price && (
                            <span className="text-sm text-zinc-400 line-through font-mono ml-1">
                              ₹{testPlan.price}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-zinc-500 ml-1">/Month</span>
                        </div>
                      </div>

                      <ul className="space-y-4 text-xs font-medium text-zinc-700 pt-2">
                        {(testPlan.features && testPlan.features.length > 0 ? testPlan.features : ['1 Month Access', 'Portfolio Website', '3 Templates', 'QR Code & Custom URL']).filter(f => !f.includes('Auto-Debit') && !f.includes('One-Time')).map((feat, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 mt-6 border-t border-zinc-100">
                      <button
                        onClick={() => handlePayWithRazorpay(testPlan as any)}
                        disabled={isLoading || paymentLoading !== null}
                        className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>{finalPrice === 0 ? 'START FREE TRIAL' : `START TRIAL FOR ₹ ${finalPrice}`}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 1. Monthly Plan */}
              {(() => {
                const monthly = plans.find(p => p.id === 'plan-monthly') || {
                  id: 'plan-monthly',
                  name: 'Monthly',
                  desc: 'Perfect for getting started',
                  price: 175,
                  duration: 30,
                  storage: '500 MB',
                  features: ['Portfolio website', '3 Template selection', 'QR code', 'Mobile responsive', 'Profile updates'],
                  buttonText: 'START FOR ₹ 175',
                };
                const { finalPrice, isApplicable } = getPlanDiscount(monthly as any);
                const isLoading = paymentLoading === monthly.id;

                return (
                  <div className="bg-white rounded-[28px] border border-zinc-200/80 shadow-sm hover:shadow-md transition-all p-7 sm:p-9 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold font-bricolage text-zinc-950">Monthly</h3>
                      <p className="text-xs font-medium text-zinc-500 mt-1">Perfect for getting started</p>

                      <div className="my-7">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-black font-bricolage text-zinc-950">
                            ₹ {finalPrice}
                          </span>
                          {appliedPlanCoupon && isApplicable && finalPrice !== monthly.price && (
                            <span className="text-sm text-zinc-400 line-through font-mono ml-1">
                              ₹{monthly.price}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-zinc-500 ml-1">/Month</span>
                        </div>
                        {appliedPlanCoupon && isApplicable && finalPrice !== monthly.price && (
                          <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                            <span>✨ First month only • Renews at ₹{monthly.price}/month</span>
                          </p>
                        )}
                      </div>

                      <ul className="space-y-4 text-xs font-medium text-zinc-700 pt-2">
                        {['Portfolio website', '3 Template selection', 'QR code', 'Mobile responsive', 'Profile updates'].map((feat, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 mt-6 border-t border-zinc-100">
                      <button
                        onClick={() => handlePayWithRazorpay(monthly as any)}
                        disabled={isLoading || paymentLoading !== null}
                        className="w-full h-12 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>{finalPrice === 0 ? 'ACTIVATE FOR FREE' : `START FOR ₹ ${finalPrice}`}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Quarterly Plan */}
              {(() => {
                const quarterly = plans.find(p => p.id === 'plan-quarterly') || {
                  id: 'plan-quarterly',
                  name: 'Quarterly',
                  desc: '90 Days Access',
                  price: 450,
                  duration: 90,
                  storage: '1 GB',
                  features: ['Everything in Monthly', 'Personal URL', '6 Template selection', 'Template switching'],
                  buttonText: 'CHOOSE QUARTERLY',
                };
                const { finalPrice, isApplicable } = getPlanDiscount(quarterly as any);
                const isLoading = paymentLoading === quarterly.id;

                return (
                  <div className="bg-white rounded-[28px] border border-zinc-200/80 shadow-sm hover:shadow-md transition-all p-7 sm:p-9 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold font-bricolage text-zinc-950">Quarterly</h3>

                      <div className="my-7">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-black font-bricolage text-zinc-950">
                            ₹ {finalPrice}
                          </span>
                          {appliedPlanCoupon && isApplicable && finalPrice !== quarterly.price && (
                            <span className="text-sm text-zinc-400 line-through font-mono ml-1">
                              ₹{quarterly.price}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-zinc-500 ml-1">/3 months</span>
                        </div>
                        {appliedPlanCoupon && isApplicable && finalPrice !== quarterly.price && (
                          <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                            <span>✨ First 3 months only • Renews at ₹{quarterly.price}</span>
                          </p>
                        )}
                      </div>

                      <ul className="space-y-4 text-xs font-medium text-zinc-700 pt-2">
                        {['Everything in Monthly', 'Personal URL', '6 Template selection', 'Template switching'].map((feat, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 mt-6 border-t border-zinc-100">
                      <button
                        onClick={() => handlePayWithRazorpay(quarterly as any)}
                        disabled={isLoading || paymentLoading !== null}
                        className="w-full h-12 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>{finalPrice === 0 ? 'ACTIVATE FOR FREE' : (appliedPlanCoupon && isApplicable ? `CHOOSE FOR ₹ ${finalPrice}` : 'CHOOSE QUARTERLY')}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Yearly Plan (Dark Navy - Best Value) */}
              {(() => {
                const yearly = plans.find(p => p.id === 'plan-yearly') || {
                  id: 'plan-yearly',
                  name: 'Yearly',
                  desc: 'Best Value',
                  price: 1200,
                  duration: 365,
                  storage: '2 GB',
                  features: ['Everything in Quarterly', '12 Template selection', 'Unlimited updates'],
                  buttonText: 'GET YEARLY PLAN',
                };
                const { finalPrice, isApplicable } = getPlanDiscount(yearly as any);
                const isLoading = paymentLoading === yearly.id;

                return (
                  <div className="bg-[#0A0E27] rounded-[28px] shadow-2xl p-7 sm:p-9 text-white flex flex-col justify-between relative overflow-hidden border border-indigo-950">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold font-bricolage text-white">Yearly</h3>
                      <p className="text-xs font-medium text-zinc-400 mt-1">Best Value</p>

                      <div className="my-7">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-black font-bricolage text-white">
                            ₹ {finalPrice}
                          </span>
                          {appliedPlanCoupon && isApplicable && finalPrice !== yearly.price && (
                            <span className="text-sm text-zinc-400 line-through font-mono ml-1">
                              ₹{yearly.price}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-zinc-400 ml-1">/Year</span>
                        </div>
                        {appliedPlanCoupon && isApplicable && finalPrice !== yearly.price ? (
                          <p className="text-[11px] font-medium text-emerald-400 mt-1 flex items-center gap-1">
                            <span>✨ First year only • Renews at ₹{yearly.price}/yr</span>
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-amber-300 mt-1.5">Just ₹100 per month</p>
                        )}
                      </div>

                      <ul className="space-y-4 text-xs font-medium text-zinc-200 pt-2">
                        {['Everything in Quarterly', '12 Template selection', 'Unlimited updates'].map((feat, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 mt-6 border-t border-white/10 relative z-10">
                      <button
                        onClick={() => handlePayWithRazorpay(yearly as any)}
                        disabled={isLoading || paymentLoading !== null}
                        className="w-full h-12 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>{finalPrice === 0 ? 'ACTIVATE FOR FREE' : (appliedPlanCoupon && isApplicable ? `GET YEARLY FOR ₹ ${finalPrice}` : 'GET YEARLY PLAN')}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* BILLING HISTORY & TAX INVOICES */}
            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-bricolage text-zinc-950">Payment History &amp; Invoices</h2>
                  <p className="text-xs text-zinc-500 mt-0.5 font-dm-sans">
                    Review your recent Razorpay transactions and download tax invoices.
                  </p>
                </div>
              </div>

              {userTransactions.length === 0 ? (
                <div className="bg-white border border-dashed border-zinc-200 rounded-2xl p-8 text-center text-zinc-400 text-xs">
                  No transactions recorded yet. Upgrade your plan to see invoices here.
                </div>
              ) : (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                          <th className="py-3 px-4 font-bold">Transaction ID</th>
                          <th className="py-3 px-4 font-bold">Item Description</th>
                          <th className="py-3 px-4 font-bold">Date</th>
                          <th className="py-3 px-4 font-bold">Amount</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {userTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-zinc-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">{tx.id}</td>
                            <td className="py-3 px-4 font-bold text-zinc-900">{tx.itemName}</td>
                            <td className="py-3 px-4 text-zinc-500">{new Date(tx.timestamp).toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-mono font-bold text-zinc-900">₹{tx.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                <Check className="w-3 h-3" /> Paid
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDownloadInvoice(tx)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-purple-50 hover:text-[#7C3AED] text-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════
          PAYMENT SUCCESS MODAL
      ══════════════════════════════════════════ */}
      {paymentSuccessModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-6 text-white text-center relative">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold font-bricolage">Payment Successful!</h3>
              <p className="text-xs text-white/80 mt-1">Your subscription has been activated immediately.</p>
              <button
                onClick={() => setPaymentSuccessModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-left">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Plan:</span>
                  <span className="font-bold text-zinc-900">{paymentSuccessModal.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600 font-mono">₹{paymentSuccessModal.amount.toFixed(2)} INR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Payment ID:</span>
                  <span className="font-mono text-zinc-700 text-[11px] truncate max-w-[200px]">{paymentSuccessModal.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order ID:</span>
                  <span className="font-mono text-zinc-700 text-[11px] truncate max-w-[200px]">{paymentSuccessModal.orderId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (paymentSuccessModal.tx) {
                      handleDownloadInvoice(paymentSuccessModal.tx);
                    }
                  }}
                  className="h-11 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C3AED] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => setPaymentSuccessModal(null)}
                  className="h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          QR CODE MODAL
      ══════════════════════════════════════════ */}
      {showQrModal && selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Your Portfolio QR</p>
                <h3 className="text-lg font-bold text-zinc-950 mt-0.5">Scan to visit</h3>
              </div>
              <button onClick={() => setShowQrModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              <CampusCvQrCode
                username={selectedPortfolio.username}
                customDomain={selectedPortfolio.customDomain}
                size={180}
                showActions={true}
                showUrlText={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PROFILE & SECURITY MODAL (unchanged logic)
      ══════════════════════════════════════════ */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] p-6 text-white relative">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-center">Account Settings</h3>
              <p className="text-sm text-white/70 text-center mt-0.5">Manage your profile, credentials & security</p>
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-left">
              
              {/* Inline Feedback Alerts */}
              {profileFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    profileFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {profileFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{profileFeedback.message}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 bg-white border border-zinc-200 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  required
                />
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Change Password</h4>
                </div>
                
                {[
                  { label: 'New Password', value: newPassword, onChange: setNewPassword, placeholder: 'Min 6 characters' },
                  { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, placeholder: '••••••••' },
                ].map(({ label, value, onChange, placeholder }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">{label}</label>
                    <input
                      type="password"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full h-11 bg-white border border-zinc-200 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={profileSaveLoading}
                className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-600/20 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {profileSaveLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {upgradeModalConfig && (
        <UpgradePlanModal
          isOpen={upgradeModalConfig.isOpen}
          onClose={() => setUpgradeModalConfig(null)}
          templateName={upgradeModalConfig.templateName}
          requiredTier={upgradeModalConfig.requiredTier}
          reason={upgradeModalConfig.reason}
          currentUsageCount={upgradeModalConfig.currentUsageCount}
          planLimit={upgradeModalConfig.planLimit}
          onUpgradeSuccess={(upgradedPlan) => {
            setUser(mockAuth.getCurrentUser());
            alert(`🎉 Successfully upgraded to ${upgradedPlan.name}! You can now use all templates in your new tier.`);
          }}
        />
      )}

      {/* Live Real Portfolio Preview Modal */}
      {selectedPortfolio && (
        <UserPortfolioPreviewModal
          isOpen={previewModalConfig.isOpen}
          onClose={() => setPreviewModalConfig({ isOpen: false, overrideTemplateId: null })}
          portfolio={selectedPortfolio}
          overrideTemplateId={previewModalConfig.overrideTemplateId}
          onOpenEditor={() => {
            setPreviewModalConfig({ isOpen: false, overrideTemplateId: null });
            router.push(`/editor/${selectedPortfolio.id}`);
          }}
        />
      )}

    </div>
  );
}
