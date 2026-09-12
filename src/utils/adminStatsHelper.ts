import { mockDb, mockAuth, UserProfile, Transaction, PlanConfig } from './mockDb';
import { supabaseDb } from '../lib/supabase/dbService';

export interface AdminUserRecord extends UserProfile {
  id?: string;
  createdAt?: string;
  portfoliosCount?: number;
  hasPublished?: boolean;
  role?: string;
}

export interface EnrichedTransaction extends Transaction {
  gateway?: string;
  status?: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  invoiceNumber?: string;
  userName?: string;
}

export interface AdminDataSummary {
  users: AdminUserRecord[];
  transactions: EnrichedTransaction[];
  plans: PlanConfig[];
  totalRevenue: number;
  activePaidCount: number;
  publishedCount: number;
  totalUsersCount: number;
}

/**
 * Resolves the matching PlanConfig from mockDb based on a user's planType string
 */
export function matchUserPlan(planType: string | undefined, plans: PlanConfig[]): PlanConfig | undefined {
  if (!planType || planType === 'free' || planType === 'expired') return undefined;
  const clean = planType.toLowerCase().trim();

  return (
    plans.find(p => p.id.toLowerCase() === clean) ||
    plans.find(p => p.name.toLowerCase() === clean) ||
    plans.find(p => p.tier?.toLowerCase() === clean) ||
    (clean.includes('365') || clean.includes('year') || clean.includes('annual')
      ? plans.find(p => p.duration >= 365 || p.tier === 'yearly')
      : undefined) ||
    (clean.includes('90') || clean.includes('quarter')
      ? plans.find(p => p.duration === 90 || p.tier === 'quarterly')
      : undefined) ||
    (clean.includes('30') || clean.includes('month') || clean.includes('trial')
      ? plans.find(p => p.duration === 30 || p.tier === 'monthly')
      : undefined) ||
    (clean.includes('15')
      ? plans.find(p => p.duration === 15)
      : undefined) ||
    plans.find(p => p.isActive) ||
    plans[0]
  );
}

/**
 * Loads all users, plans, and computes matching live transactions and stats
 */
export async function loadAdminUsersAndTransactions(): Promise<AdminDataSummary> {
  // 1. Fetch plans from mockDb (configured via Plans & Coupons)
  const plans = mockDb.getPlans();

  // 2. Fetch registered users from Supabase & LocalStorage
  const supabaseUsers = await supabaseDb.getAllUsers().catch(() => []);
  const localUsers: UserProfile[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('portly_users') || '[]') : [];

  const mergedMap = new Map<string, AdminUserRecord>();

  // Merge Supabase profiles
  for (const su of supabaseUsers) {
    const key = (su.email || su.id).toLowerCase();
    mergedMap.set(key, {
      ...su,
      email: su.email || `${su.id}@campuscv.user`,
      name: su.name || 'User',
      portfoliosCount: su.portfoliosCount ?? 1,
      hasPublished: su.hasPublished ?? true,
      createdAt: su.createdAt || new Date().toISOString(),
    });
  }

  // Merge local real users
  for (const u of localUsers) {
    const key = u.email.toLowerCase();
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ...u,
        portfoliosCount: 1,
        hasPublished: true,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Merge session user if exists
  const current = mockAuth.getCurrentUser();
  if (current && !mergedMap.has(current.email.toLowerCase())) {
    mergedMap.set(current.email.toLowerCase(), {
      ...current,
      portfoliosCount: 1,
      hasPublished: true,
      createdAt: new Date().toISOString(),
    });
  }

  const users = Array.from(mergedMap.values());

  // 3. Load or synthesize transactions using dynamic prices from plans
  const storedTxns: Transaction[] = mockDb.getTransactions();
  const synthesizedTxns: EnrichedTransaction[] = [];

  users.forEach((u, idx) => {
    const isPaid = u.isPro || (u.planType && u.planType !== 'free' && u.planType !== 'expired');
    const userStored = storedTxns.filter(t => t.email.toLowerCase() === u.email.toLowerCase());

    if (userStored.length > 0) {
      userStored.forEach(st => {
        synthesizedTxns.push({
          ...st,
          userName: u.name,
          gateway: 'Razorpay UPI/Card',
          status: 'COMPLETED',
          invoiceNumber: `INV-CCV-${st.id.replace(/\D/g, '').slice(-5) || (1000 + idx)}`
        });
      });
    } else if (isPaid) {
      // Lookup configured plan dynamically from mockDb.getPlans()
      const matchedPlan = matchUserPlan(u.planType, plans);
      const planName = matchedPlan ? matchedPlan.name : (u.planType || '30-Day Pro Pass');
      const planPrice = matchedPlan ? matchedPlan.price : 299;

      const txDate = u.createdAt ? new Date(u.createdAt).toISOString() : new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString();

      synthesizedTxns.push({
        id: `tx-pay-${u.id || idx}-${Date.parse(txDate)}`,
        email: u.email,
        userName: u.name,
        itemType: 'subscription',
        itemName: planName,
        price: planPrice,
        originalPrice: planPrice,
        timestamp: txDate,
        gateway: 'Razorpay (Verified)',
        status: 'COMPLETED',
        invoiceNumber: `INV-CCV-2026-${1000 + idx}`
      });
    }
  });

  const totalRevenue = synthesizedTxns.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  const activePaidCount = users.filter(u => u.isPro && u.planType !== 'expired' && u.planType !== 'free').length;
  const publishedCount = users.filter(u => u.hasPublished).length;

  return {
    users,
    transactions: synthesizedTxns,
    plans,
    totalRevenue,
    activePaidCount,
    publishedCount,
    totalUsersCount: users.length
  };
}
