import { templateStorage } from './templateStorage';
import { sanitizeBase64FromPayload } from './imageUploadStorage';
import { normalizePortfolio } from './portfolioNormalizer';

export interface PortfolioData {
  id: string;
  username: string;
  ownerEmail?: string;
  category: string;
  templateId?: string;
  templateVersionId?: string;
  templateType?: string;
  meta?: { portfolioTitle: string; seoTitle: string; slug: string; description?: string; keywords?: string };
  navigation?: { brandName: string; logoUrl?: string; links?: { label: string; href: string }[] };
  hero?: { title: string; subtitle: string; description: string; avatarUrl?: string; badgeText?: string };
  profile?: { name?: string; fullName?: string; headline?: string; summary?: string; about?: string; photo?: string; avatarUrl?: string; location?: string; email?: string; phone?: string };
  about?: { title: string; subtitle?: string; description: string; bio?: string; avatarUrl?: string };
  title: string;
  name: string;
  tagline: string;
  profileImage: string;
  avatarUrl?: string;
  projectThumbnail: string;
  themeColor: string; // 'violet' | 'emerald' | 'retro' | 'indigo' | 'amber' | 'rose'
  fontPack: string; // 'sans' | 'serif' | 'mono'
  userSelectedAccent?: boolean;
  userSelectedFont?: boolean;
  userSelectedFontSize?: boolean;
  isDarkMode: boolean;
  stats: { label: string; value: string }[];
  skills: any[];
  certifications: any[];
  timeline: { title: string; subtitle: string; desc: string }[];
  experience?: any[];
  education?: any[];
  projects: any[];
  hiddenFields?: string[];
  aboutMe?: string;
  university?: string;
  major?: string;
  company?: string;
  role?: string;
  specialty?: string;
  industry?: string;
  niche?: string;
  published: boolean;
  customDomain?: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
  };
  sections: string[]; // List of active section layout identifiers
  enabledPages?: string[];
  blogs?: { title: string; date: string; readTime: string; desc: string }[];
  testimonials?: { author: string; role: string; quote: string }[];
  gallery?: { title: string; type: string; path: string }[];
  services?: { title: string; desc: string; icon: string }[];
  awards?: { title: string; issuer: string; date: string }[];
  publications?: { title: string; publisher: string; date: string; link?: string }[];
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; email?: string };
  layoutStyle?: string;
  spacingPreset?: string;
  sectionGap?: number;
  cardBorderRadius?: number;
  contentPadding?: number;
  animationPreset?: string;
  deletedFields?: string[];
  enableScrollAnimation?: boolean;
  enableHoverEffects?: boolean;
  advancedSettings?: Record<string, ElementStyle>;
  styleOverrides?: Record<string, any>;
  contentOverrides?: Record<string, any>;
  imageOverrides?: Record<string, any>;
  deletedNodes?: Record<string, boolean>;
  sectionOrder?: string[];
  addedElements?: any[];
  addedSections?: any[];
  sectionFiles?: Record<string, string>;
  templateCode?: string;
  customCSS?: string;
  bindings?: any;
  schema?: any;
  assetMap?: Record<string, string>;
  assetOverrides?: Record<string, any>;
  templateState?: Record<string, any>;
  _sectionFilesTemplateId?: string;
  _lastUpdated?: number;
  heroIntro?: string;
  aboutHeading?: string;
  skillsHeading?: string;
  projectsHeading?: string;
  timelineHeading?: string;
  contactHeading?: string;
  certificationsHeading?: string;
  blogsHeading?: string;
  galleryHeading?: string;
  testimonialsHeading?: string;
  servicesHeading?: string;
  awardsHeading?: string;
  publicationsHeading?: string;
  baseFontSize?: number;
  theme?: {
    primaryColor: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  typography?: {
    fontFamily: string;
    fontSize?: number;
  };
  button?: {
    primary?: {
      background?: string;
      textColor?: string;
      radius?: string;
    };
  };
  lastSaved?: number;
  lastPublished?: number;
}

export interface ElementStyle {
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: string;
  width?: number;
  height?: number;
  xPosition?: number;
  yPosition?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
  animation?: string;
  hideDesktop?: boolean;
  hideTablet?: boolean;
  hideMobile?: boolean;

  // Custom advanced design overrides
  containerWidth?: number;
  backgroundColor?: string;
  backgroundGradient?: string;
  alignment?: string;
  sectionWidth?: number;
  gridColumns?: number;
  sidebarPosition?: string;
  heroLayout?: string;
  sectionOrder?: string;
  fontFamily?: string;
  gapBetweenElements?: number;
  sectionSpacing?: number;
  shadowIntensity?: number;
  glassEffect?: boolean;
  blurEffect?: number;
  hoverAnimation?: string;
  scrollAnimation?: string;
  revealAnimation?: string;
  loadingAnimation?: string;
  lockElement?: boolean;
  hideElement?: boolean;
}

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  isPro: boolean;
  avatarUrl?: string;
  planType: 'free' | '15-days' | '30-days' | '90-days' | '365-days' | 'expired';
  planDurationDays?: 15 | 30 | 90 | 365;
  subscriptionExpires?: string;
  storageLimitMB: number;
  purchasedCustomDomainAddon?: boolean;
  password?: string;
  purchasedTemplateIds?: string[];
}

export interface Transaction {
  id: string;
  email: string;
  itemType: 'subscription' | 'marketplace_pack' | 'storage_upgrade' | 'custom_domain' | 'template_purchase';
  itemName: string;
  price: number;
  originalPrice?: number;
  couponApplied?: string;
  timestamp: string;
  paymentId?: string;
  orderId?: string;
  subscriptionId?: string;
  planId?: string;
  durationDays?: number;
  startDate?: string;
  expiresDate?: string;
  customerName?: string;
  customerEmail?: string;
  status?: string;
}

export interface PlanConfig {
  id: string;
  duration: number;
  name: string;
  price: number;
  storage: string;
  storageMB: number;
  desc: string;
  tier?: 'free' | 'monthly' | 'quarterly' | 'yearly';
  allowedTemplateCount?: number;
  subBadge?: string;
  features?: string[];
  buttonText?: string;
  isPopular?: boolean;
  isActive: boolean;
  razorpayPlanId?: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountPercent?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  applicablePlanIds: string[];
  createdAt?: string;
}

export const defaultPlans: PlanConfig[] = [
  {
    id: 'plan-test-5',
    duration: 30,
    name: '1 Month Trial',
    price: 30,
    storage: '500 MB',
    storageMB: 500,
    desc: '30 Days Access',
    tier: 'monthly',
    allowedTemplateCount: 3,
    features: [
      '1 Month Access',
      'Portfolio Website',
      '3 Templates Selection',
      'QR Code & Custom URL',
    ],
    buttonText: 'START TRIAL FOR ₹ 30',
    isActive: true,
  },
  {
    id: 'plan-monthly',
    duration: 30,
    name: 'Monthly',
    price: 175,
    storage: '500 MB',
    storageMB: 500,
    desc: 'Perfect for getting started',
    tier: 'monthly',
    allowedTemplateCount: 3,
    features: [
      'Portfolio website',
      '3 Template selection',
      'QR code',
      'Mobile responsive',
      'Profile updates',
    ],
    buttonText: 'START FOR ₹ 175',
    isActive: true,
    razorpayPlanId: 'plan_TZ2SXEPIncd4pq',
  },
  {
    id: 'plan-quarterly',
    duration: 90,
    name: 'Quarterly',
    price: 450,
    storage: '1 GB',
    storageMB: 1024,
    desc: '90 Days Access',
    tier: 'quarterly',
    allowedTemplateCount: 6,
    features: [
      'Everything in Monthly',
      'Personal URL',
      '6 Template selection',
      'Template switching',
    ],
    buttonText: 'CHOOSE QUARTERLY',
    isActive: true,
    razorpayPlanId: 'plan_TZ2TfhcN0WL6eE',
  },
  {
    id: 'plan-yearly',
    duration: 365,
    name: 'Yearly',
    price: 1200,
    storage: '2 GB',
    storageMB: 2048,
    desc: 'Best Value',
    tier: 'yearly',
    allowedTemplateCount: 12,
    subBadge: 'Just ₹100 per month',
    isPopular: true,
    features: [
      'Everything in Quarterly',
      'All 12+ Templates selection',
      'Unlimited updates',
    ],
    buttonText: 'GET YEARLY PLAN',
    isActive: true,
    razorpayPlanId: 'plan_TZ2Ui2Jy2k0Oa2',
  },
];

/**
 * Normalizes user plan tier string to canonical tier level
 */
export function getUserPlanTier(user: UserProfile | null): 'free' | 'monthly' | 'quarterly' | 'yearly' {
  if (!user || !user.isPro) return 'free';
  if (user.subscriptionExpires && new Date(user.subscriptionExpires).getTime() < Date.now()) {
    return 'free';
  }
  const p = (user.planType || '').toLowerCase();
  if (p.includes('year') || p.includes('365') || p.includes('annual')) return 'yearly';
  if (p.includes('quarter') || p.includes('90')) return 'quarterly';
  if (p.includes('month') || p.includes('30') || p.includes('trial')) return 'monthly';
  return 'monthly';
}

/**
 * Returns allowed template count quota for given plan tier
 */
export function getPlanTemplateLimit(userOrTier: UserProfile | string | null): number {
  const tier = typeof userOrTier === 'string' ? userOrTier.toLowerCase() : getUserPlanTier(userOrTier);
  if (tier === 'yearly' || tier.includes('year') || tier.includes('365')) return 12;
  if (tier === 'quarterly' || tier.includes('quarter') || tier.includes('90')) return 6;
  if (tier === 'monthly' || tier.includes('month') || tier.includes('30') || tier.includes('trial')) return 3;
  return 1; // Free tier
}

const TIER_HIERARCHY: Record<string, number> = {
  'free': 0,
  'monthly': 1,
  'quarterly': 2,
  'yearly': 3,
  'pro': 2
};

/**
 * Checks if user is eligible to use / switch to a template
 */
export function checkTemplateAccess(
  user: UserProfile | null,
  template: any,
  currentUsageCount: number = 0
): {
  isAccessible: boolean;
  reason?: 'plan_tier' | 'limit_reached' | 'unpaid';
  requiredTier: 'free' | 'monthly' | 'quarterly' | 'yearly';
  planLimit: number;
  userTier: 'free' | 'monthly' | 'quarterly' | 'yearly';
  message?: string;
} {
  const rawTier = (template?.planTier || (template?.isPremium ? 'yearly' : 'monthly')).toString().toLowerCase();
  const requiredTier: 'free' | 'monthly' | 'quarterly' | 'yearly' = 
    rawTier === 'free' ? 'free' : 
    rawTier === 'quarterly' ? 'quarterly' : 
    (rawTier === 'yearly' || rawTier === 'pro') ? 'yearly' : 'monthly';

  const userTier = getUserPlanTier(user);
  const planLimit = getPlanTemplateLimit(user);

  // 1. Check if user is unpaid / expired on a paid template
  if (requiredTier !== 'free' && (!user || !user.isPro || userTier === 'free')) {
    return {
      isAccessible: false,
      reason: 'unpaid',
      requiredTier,
      planLimit,
      userTier,
      message: `Subscription required. This template requires a ${requiredTier.toUpperCase()} plan.`
    };
  }

  // 2. Check Tier Hierarchy (Monthly cannot access Quarterly / Yearly; Quarterly cannot access Yearly)
  const userRank = TIER_HIERARCHY[userTier] ?? 0;
  const reqRank = TIER_HIERARCHY[requiredTier] ?? 1;

  if (userRank < reqRank) {
    return {
      isAccessible: false,
      reason: 'plan_tier',
      requiredTier,
      planLimit,
      userTier,
      message: `Upgrade required. This template is available on the ${requiredTier.toUpperCase()} plan.`
    };
  }

  // 3. Check template usage count limit
  if (currentUsageCount >= planLimit && planLimit < 999) {
    return {
      isAccessible: false,
      reason: 'limit_reached',
      requiredTier: userTier === 'monthly' ? 'quarterly' : 'yearly',
      planLimit,
      userTier,
      message: `You have reached your ${userTier.toUpperCase()} plan limit of ${planLimit} templates. Upgrade to unlock more!`
    };
  }

  return {
    isAccessible: true,
    requiredTier,
    planLimit,
    userTier
  };
}

export const defaultCoupons: CouponCode[] = [];

export interface AnalyticsEvent {
  id: string;
  portfolioId: string;
  eventType: 'view' | 'click' | 'download';
  timestamp: string;
  country?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  details?: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  uploadDate: string;
  version?: string;
  author?: string;
  zipFileName?: string;
  zipSizeFormatted?: string;
  isPremium?: boolean;
  price?: number;
  purchasedBy?: string[];
  themeConfig?: {
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    isDarkMode?: boolean;
    cardRadius?: number;
    sectionGap?: number;
  };
  layoutStyleConfig?: {
    sidebarPosition?: 'left' | 'top' | 'none';
    heroLayout?: 'split' | 'centered' | 'fullwidth';
    cardStyle?: 'glass' | 'bordered' | 'solid' | 'minimal';
  };
  sections?: string[];
  customCSS?: string;
  templateCode?: string;
  sectionFiles?: Record<string, string>;
}

export const defaultTemplatesCatalog: CustomTemplate[] = [];

export const initialPortfolios: PortfolioData[] = [];

export const mockAuth = {
  getCurrentUser: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('portly_current_user');
    if (!stored) {
      return null;
    }
    try {
      const user = JSON.parse(stored);
      if (user?.email === 'demo@campuscv.in') {
        localStorage.removeItem('portly_current_user');
        return null;
      }
      return user;
    } catch {
      localStorage.removeItem('portly_current_user');
      return null;
    }
  },
  login: (email: string, password?: string, name?: string, id?: string) => {
    // Check if user already exists in storage
    const users: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      localStorage.setItem('portly_current_user', JSON.stringify(existing));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: { user: existing } }));
      }
      return existing;
    }

    // Default admin emails to Pro for testing
    const isAdminEmail = email.toLowerCase().includes('campuscv.in') || email.toLowerCase() === 'admin@campuscv.in';

    const user: UserProfile = {
      id: id || undefined,
      email,
      name: name || email.split('@')[0],
      isPro: isAdminEmail,
      planType: isAdminEmail ? '365-days' : 'free',
      planDurationDays: isAdminEmail ? 365 : undefined,
      subscriptionExpires: isAdminEmail ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      storageLimitMB: 500
    };
    users.push(user);
    localStorage.setItem('portly_users', JSON.stringify(users));
    localStorage.setItem('portly_current_user', JSON.stringify(user));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: { user } }));
    }
    return user;
  },
  upgradeToPro: (durationDays: number = 30, planName?: string) => {
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      currentUser.isPro = true;
      const days = Number(durationDays) || 30;
      currentUser.planDurationDays = days as any;
      currentUser.planType = (days >= 365 ? '365-days' : days >= 90 ? '90-days' : '30-days') as any;

      // Smart duration calculation: if active, extend from existing expiry; otherwise from now
      const now = Date.now();
      const existingExpiry = currentUser.subscriptionExpires ? new Date(currentUser.subscriptionExpires).getTime() : 0;
      const baseTime = existingExpiry > now ? existingExpiry : now;
      currentUser.subscriptionExpires = new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString();

      localStorage.setItem('portly_current_user', JSON.stringify(currentUser));
      const users: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
      const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx !== -1) {
        users[idx] = currentUser;
        localStorage.setItem('portly_users', JSON.stringify(users));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: { user: currentUser } }));
      }
    }
  },
  logout: async () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('portly_current_user');
      sessionStorage.removeItem('portly_current_user');
      // Clear Supabase session tokens
      try {
        const { supabase } = await import('../lib/supabase/client');
        if (supabase && supabase.auth) {
          await supabase.auth.signOut().catch(() => {});
        }
      } catch (e) {}

      // Clear any auth tokens in localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth-token') || key === 'portly_current_user')) {
          localStorage.removeItem(key);
        }
      }

      // Clear cookies if any
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: { user: null } }));
    } catch (err) {
      console.warn('[mockAuth logout error]', err);
    }
  },
  checkSubscriptionExpiry: () => {
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser && currentUser.subscriptionExpires) {
      const isPast = new Date(currentUser.subscriptionExpires).getTime() < Date.now();
      if (isPast) {
        currentUser.isPro = false;
        currentUser.planType = 'expired';
        localStorage.setItem('portly_current_user', JSON.stringify(currentUser));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth_state_changed', { detail: { user: currentUser } }));
        }
        return true;
      }
    }
    return false;
  }
};

export function initializeMockDb() {
  if (typeof window === 'undefined') return;

  const draftLegacy = localStorage.getItem('portly_draft_portfolios');
  if (draftLegacy && !localStorage.getItem('portly_portfolios')) {
    localStorage.setItem('portly_portfolios', draftLegacy);
  }

  if (!localStorage.getItem('portly_portfolios')) {
    localStorage.setItem('portly_portfolios', JSON.stringify(initialPortfolios));
  }
  if (!localStorage.getItem('portly_published_portfolios')) {
    localStorage.setItem('portly_published_portfolios', JSON.stringify(initialPortfolios.map(p => ({ ...p, published: true, lastPublished: Date.now() }))));
  }
  if (!localStorage.getItem('portly_custom_templates')) {
    localStorage.setItem('portly_custom_templates', JSON.stringify(defaultTemplatesCatalog));
  }
  if (!localStorage.getItem('portly_plans')) {
    localStorage.setItem('portly_plans', JSON.stringify(defaultPlans));
  }
  if (!localStorage.getItem('portly_coupons')) {
    localStorage.setItem('portly_coupons', JSON.stringify([]));
  }
  if (!localStorage.getItem('portly_transactions')) {
    localStorage.setItem('portly_transactions', JSON.stringify([]));
  }
}

export const mockDb = {
  getPortfolios: (): PortfolioData[] => {
    if (typeof window === 'undefined') return initialPortfolios;
    const stored = localStorage.getItem('portly_portfolios');
    let list: PortfolioData[] = [];
    if (!stored) {
      list = initialPortfolios;
    } else {
      try {
        list = JSON.parse(stored);
      } catch {
        list = initialPortfolios;
      }
    }

    return list.map(p => {
      const cached = templateStorage.getTemplateSync(p.id);
      if (cached) {
        return { ...p, ...cached, profileImage: cached.profileImage || p.profileImage };
      }
      return p;
    });
  },
  getPublishedPortfolios: (): PortfolioData[] => {
    if (typeof window === 'undefined') return initialPortfolios.map(p => ({ ...p, published: true, lastPublished: Date.now() }));
    const stored = localStorage.getItem('portly_published_portfolios');
    let list: PortfolioData[] = [];
    if (!stored) {
      list = initialPortfolios.map(p => ({ ...p, published: true, lastPublished: Date.now() }));
    } else {
      try {
        list = JSON.parse(stored);
      } catch {
        list = initialPortfolios.map(p => ({ ...p, published: true, lastPublished: Date.now() }));
      }
    }

    return list.map(p => {
      const cached = templateStorage.getTemplateSync(`${p.id}-published`);
      if (cached) {
        return { ...p, ...cached, profileImage: cached.profileImage || p.profileImage };
      }
      return p;
    });
  },
  getPortfolioById: (id: string): PortfolioData | null => {
    const cached = templateStorage.getTemplateSync(id);
    if (cached) return cached;
    const portfolios = mockDb.getPortfolios();
    return portfolios.find(p => p.id === id) || null;
  },
  getPortfolioByUsername: (username: string): PortfolioData | null => {
    const portfolios = mockDb.getPublishedPortfolios();
    return portfolios.find(p => p.username.toLowerCase() === username.toLowerCase()) || null;
  },
  getPortfolioByCustomDomain: (domain: string): PortfolioData | null => {
    const portfolios = mockDb.getPublishedPortfolios();
    return portfolios.find(p => p.customDomain && p.customDomain.toLowerCase() === domain.toLowerCase()) || null;
  },
  createPortfolio: (arg1: any, arg2?: any): PortfolioData => {
    const portfolios = mockDb.getPortfolios();
    const newId = `port-${Date.now()}`;
    const dataObj = typeof arg1 === 'string' ? { category: arg1, ...arg2 } : arg1;
    const newPortfolio: PortfolioData = {
      ...initialPortfolios[0],
      ...dataObj,
      id: newId,
      username: dataObj?.username || `user-${Date.now().toString().slice(-4)}`,
      lastSaved: Date.now()
    };

    templateStorage.saveTemplateAsync(newPortfolio);
    portfolios.push(newPortfolio);

    const sanitized = sanitizeBase64FromPayload(portfolios);
    templateStorage.safeSetLocalStorage('portly_portfolios', JSON.stringify(sanitized));
    return newPortfolio;
  },
  updatePortfolio: async (portfolio: PortfolioData) => {
    if (typeof window === 'undefined') return portfolio;

    // Do NOT normalize during save! Save exactly the portfolio object currently in memory.
    const savedPortfolio = { ...portfolio };
    savedPortfolio._lastUpdated = Date.now();
    savedPortfolio.lastSaved = Date.now();

    // Log trace values inside updatePortfolio / savePortfolio
    console.log('[updatePortfolio/savePortfolio]', savedPortfolio.id);
    console.log('  Trace values during save:', {
      'hero.title': savedPortfolio.hero?.title,
      'about.description': savedPortfolio.about?.description,
      'theme.primaryColor': (savedPortfolio as any).theme?.primaryColor,
      'skills[0].title': Array.isArray(savedPortfolio.skills) && typeof savedPortfolio.skills[0] === 'object' ? (savedPortfolio.skills[0] as any).title : undefined,
      'skills[0] (raw)': Array.isArray(savedPortfolio.skills) ? savedPortfolio.skills[0] : undefined,
      'projects[0].title': Array.isArray(savedPortfolio.projects) && savedPortfolio.projects[0] ? (savedPortfolio.projects[0] as any).title : undefined
    });

    console.log('Storage key:', 'portly_portfolios');
    console.log('Storage written:', savedPortfolio);

    localStorage.setItem(
      "__DEBUG_SAVE__",
      JSON.stringify(savedPortfolio, null, 2)
    );

    await templateStorage.saveTemplateAsync(savedPortfolio);

    const stored = localStorage.getItem('portly_portfolios');
    let portfolios: PortfolioData[] = [];
    if (stored) {
      try {
        portfolios = JSON.parse(stored);
      } catch {
        portfolios = initialPortfolios;
      }
    } else {
      portfolios = initialPortfolios;
    }

    const idx = portfolios.findIndex(p => p.id === savedPortfolio.id);
    if (idx !== -1) {
      portfolios[idx] = savedPortfolio;
    } else {
      portfolios.unshift(savedPortfolio);
    }

    const fullSaved = templateStorage.safeSetLocalStorage('portly_portfolios', JSON.stringify(portfolios));
    if (!fullSaved) {
      const sanitized = sanitizeBase64FromPayload(portfolios).map(({ sectionFiles, templateCode, customCSS, ...rest }: any) => rest);
      templateStorage.safeSetLocalStorage('portly_portfolios', JSON.stringify(sanitized));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portly_portfolio_updated', { detail: savedPortfolio }));
    }

    return savedPortfolio;
  },
  publishPortfolio: (id: string): PortfolioData | null => {
    if (typeof window === 'undefined') return null;

    const draft = mockDb.getPortfolioById(id);
    if (!draft) return null;

    const published = {
      ...draft,
      published: true,
      lastPublished: Date.now()
    };

    // Save under key ${id}-published in IndexedDB
    const publishedDbId = { ...published, id: `${id}-published` };
    templateStorage.saveTemplateAsync(publishedDbId);

    const stored = localStorage.getItem('portly_published_portfolios');
    let publishedList: PortfolioData[] = [];
    if (stored) {
      try {
        publishedList = JSON.parse(stored);
      } catch {
        publishedList = [];
      }
    }

    const idx = publishedList.findIndex(p => p.id === id);
    if (idx !== -1) {
      publishedList[idx] = published;
    } else {
      publishedList.unshift(published);
    }

    const fullSaved = templateStorage.safeSetLocalStorage('portly_published_portfolios', JSON.stringify(publishedList));
    if (!fullSaved) {
      const sanitized = sanitizeBase64FromPayload(publishedList).map(({ sectionFiles, templateCode, customCSS, ...rest }: any) => rest);
      templateStorage.safeSetLocalStorage('portly_published_portfolios', JSON.stringify(sanitized));
    }

    window.dispatchEvent(new CustomEvent('portly_portfolio_published', { detail: published }));

    return published;
  },
  savePortfolio: async (portfolio: PortfolioData) => {
    return await mockDb.updatePortfolio(portfolio);
  },
  deletePortfolio: (id: string) => {
    // Delete from Saved
    const drafts = mockDb.getPortfolios();
    const updatedDrafts = drafts.filter(p => p.id !== id);
    templateStorage.safeSetLocalStorage('portly_portfolios', JSON.stringify(sanitizeBase64FromPayload(updatedDrafts)));

    // Delete from Published
    const published = mockDb.getPublishedPortfolios();
    const updatedPublished = published.filter(p => p.id !== id);
    templateStorage.safeSetLocalStorage('portly_published_portfolios', JSON.stringify(sanitizeBase64FromPayload(updatedPublished)));

    // Delete from templateStorage cache
    if (templateStorage && typeof templateStorage.deleteTemplate === 'function') {
      templateStorage.deleteTemplate(id);
      templateStorage.deleteTemplate(`${id}-published`);
    }
  },
  logAnalyticsEvent: (portfolioId: string, eventType: 'view' | 'click' | 'download', details?: string) => {
    if (typeof window === 'undefined') return;
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('portly_analytics') || '[]');
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      portfolioId,
      eventType,
      timestamp: new Date().toISOString(),
      country: 'United States',
      device: 'desktop',
      details
    };
    events.push(newEvent);
    localStorage.setItem('portly_analytics', JSON.stringify(events));
  },
  getAnalytics: (portfolioId: string): AnalyticsEvent[] => {
    if (typeof window === 'undefined') return [];
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('portly_analytics') || '[]');
    return events.filter(e => e.portfolioId === portfolioId);
  },
  getUserStorageUsage: (email: string): number => {
    if (typeof window === 'undefined') return 0;
    const portfoliosList = JSON.parse(localStorage.getItem('portly_portfolios') || '[]');
    const userPorts = portfoliosList.filter((p: any) => p.email === email || (!p.email && email === 'demo@campuscv.in'));
    let totalMB = 0;
    userPorts.forEach((p: any) => {
      const dataSize = JSON.stringify(p).length / (1024 * 1024);
      totalMB += dataSize + 2.4;
    });
    return parseFloat(totalMB.toFixed(2));
  },

  // Custom UI/UX Template Operations
  getCustomTemplates: (): CustomTemplate[] => {
    if (typeof window === 'undefined') return defaultTemplatesCatalog;
    const stored = localStorage.getItem('portly_custom_templates');
    let templatesList: CustomTemplate[] = defaultTemplatesCatalog;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          templatesList = parsed;
        }
      } catch { }
    }

    // Restore full sectionFiles, templateCode, customCSS from templateStorage / defaultTemplatesCatalog
    return templatesList.map((tpl) => {
      const cached = templateStorage.getTemplateSync(tpl.id);
      const catalog = defaultTemplatesCatalog.find(d => d.id === tpl.id);
      return {
        ...catalog,
        ...cached,
        ...tpl,
        sectionFiles: (cached && cached.sectionFiles && Object.keys(cached.sectionFiles).length > 0)
          ? cached.sectionFiles
          : (tpl.sectionFiles && Object.keys(tpl.sectionFiles).length > 0)
            ? tpl.sectionFiles
            : (catalog?.sectionFiles || {}),
        templateCode: cached?.templateCode || tpl.templateCode || catalog?.templateCode || '',
        customCSS: cached?.customCSS || tpl.customCSS || catalog?.customCSS || ''
      };
    });
  },

  getCustomTemplate: (id: string): CustomTemplate | null => {
    const templates = mockDb.getCustomTemplates();
    return templates.find(t => t.id === id) || templates[0] || null;
  },
  saveCustomTemplate: (template: CustomTemplate) => {
    if (typeof window === 'undefined') return;
    templateStorage.saveTemplateAsync(template);
    const current = mockDb.getCustomTemplates();
    const existingIdx = current.findIndex(t => t.id === template.id);
    if (existingIdx !== -1) {
      current[existingIdx] = template;
    } else {
      current.unshift(template);
    }
    const lightweightList = current.map(({ sectionFiles, assetMap, templateCode, customCSS, manifestJson, schemaCode, bindingsJson, bindings, schema, ...rest }: any) => rest);
    templateStorage.safeSetLocalStorage('portly_custom_templates', JSON.stringify(lightweightList));
  },
  deleteCustomTemplate: (id: string) => {
    if (typeof window === 'undefined') return;
    templateStorage.deleteTemplate(id);
    const current = mockDb.getCustomTemplates();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem('portly_custom_templates', JSON.stringify(updated));
  },

  // ── Plan Config ──────────────────────────────────────────────────────────────
  getPlans: (): PlanConfig[] => {
    if (typeof window === 'undefined') return defaultPlans;
    try {
      const stored = localStorage.getItem('portly_plans');
      if (!stored) {
        localStorage.setItem('portly_plans', JSON.stringify(defaultPlans));
        return defaultPlans;
      }
      let parsed: PlanConfig[] = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem('portly_plans', JSON.stringify(defaultPlans));
        return defaultPlans;
      }
      // If legacy plans exist, filter them out
      parsed = parsed.filter(p => p.id !== 'plan-15' && p.id !== 'plan-30' && p.id !== 'plan-90' && p.id !== 'plan-365');
      if (parsed.length === 0) {
        localStorage.setItem('portly_plans', JSON.stringify(defaultPlans));
        return defaultPlans;
      }
      // Merge defaults with stored values, preserving user-edited fields (price, name, desc, etc.)
      const mergedPlans: PlanConfig[] = defaultPlans.map(dp => {
        let found = parsed.find(p => p.id === dp.id);
        if (found) {
          // If legacy ₹5 or AutoPay text is stuck in stored desc/features, sanitize it!
          if (found.id === 'plan-test-5') {
            if (found.desc?.includes('5.00') || found.desc?.includes('5') || found.desc?.includes('Every Month') || found.desc?.includes('30 Days Access') || found.desc?.includes('One-Time')) {
              found.desc = '';
            }
            if (found.name === 'Test Plan' || found.name === 'Monthly Trial') {
              found.name = '1 Month Trial';
            }
            if (!found.buttonText || found.buttonText.includes('5') || found.buttonText.includes('TEST')) {
              found.buttonText = 'START TRIAL FOR ₹ 30';
            }
            if (!found.price || found.price === 5) {
              found.price = 30;
            }
            if (!found.features || found.features.some((f: string) => f.includes('AutoPay') || f.includes('5.00') || f.includes('Recurring') || f.includes('Every Month') || f.includes('One-Time') || f.includes('30 Days Full Access') || f.includes('All Templates Access'))) {
              found.features = [
                '1 Month Access',
                'Portfolio Website',
                '3 Templates',
                'QR Code & Custom URL',
              ];
            }
          }
          return { ...dp, ...found };
        }
        return dp;
      });
      // Also include any user-created custom plans
      parsed.forEach(p => {
        if (!mergedPlans.some(mp => mp.id === p.id)) {
          mergedPlans.push(p);
        }
      });
      return mergedPlans;
    } catch {
      return defaultPlans;
    }
  },
  savePlan: (plan: PlanConfig) => {
    const plans = mockDb.getPlans();
    const idx = plans.findIndex(p => p.id === plan.id);
    if (idx !== -1) plans[idx] = plan; else plans.push(plan);
    localStorage.setItem('portly_plans', JSON.stringify(plans));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('campuscv:plans-updated', { detail: plans }));
    }
  },
  deletePlan: (id: string) => {
    const plans = mockDb.getPlans().filter(p => p.id !== id);
    localStorage.setItem('portly_plans', JSON.stringify(plans));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('campuscv:plans-updated', { detail: plans }));
    }
  },

  // ── Coupon Codes ──────────────────────────────────────────────────────────────
  getCoupons: (): CouponCode[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('portly_coupons');
      if (!stored) {
        return [];
      }
      const parsed: CouponCode[] = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  syncCouponsFromServer: async (): Promise<CouponCode[]> => {
    if (typeof window === 'undefined') return mockDb.getCoupons();
    try {
      const res = await fetch('/api/coupons', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons && Array.isArray(data.coupons)) {
          const serverCoupons: CouponCode[] = data.coupons;
          localStorage.setItem('portly_coupons', JSON.stringify(serverCoupons));
          return serverCoupons;
        }
      }
    } catch (e) {
      console.warn('[MOCKDB] Could not sync coupons from server:', e);
    }
    return mockDb.getCoupons();
  },
  saveCoupon: (coupon: CouponCode) => {
    const list = mockDb.getCoupons();
    const idx = list.findIndex(c => c.id === coupon.id || c.code.trim().toUpperCase() === coupon.code.trim().toUpperCase());
    if (idx !== -1) list[idx] = coupon; else list.push(coupon);
    localStorage.setItem('portly_coupons', JSON.stringify(list));

    if (typeof window !== 'undefined') {
      fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coupon),
      }).catch(err => console.warn('[MOCKDB] Failed to save coupon to server API:', err));
    }
  },
  deleteCoupon: (id: string) => {
    const list = mockDb.getCoupons().filter(c => c.id !== id);
    localStorage.setItem('portly_coupons', JSON.stringify(list));

    if (typeof window !== 'undefined') {
      fetch(`/api/coupons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch(err => console.warn('[MOCKDB] Failed to delete coupon from server API:', err));
    }
  },
  validateCoupon: (code: string, planId?: string): CouponCode | null => {
    if (!code) return null;
    const now = new Date().toISOString();
    const cleanCode = code.trim().toUpperCase();
    const allCoupons = mockDb.getCoupons();

    const isMatch = (c: CouponCode) => {
      if ((c.code || '').trim().toUpperCase() !== cleanCode) return false;
      if (!c.isActive) return false;
      if (c.expiresAt && c.expiresAt < now) return false;
      if (c.maxUses !== -1 && (c.usedCount || 0) >= c.maxUses) return false;
      if (c.applicablePlanIds && c.applicablePlanIds.length > 0 && planId && !c.applicablePlanIds.includes(planId)) {
        return false;
      }
      return true;
    };

    const coupon = allCoupons.find(isMatch);
    return coupon || null;
  },
  validateCouponAsync: async (code: string, planId?: string): Promise<CouponCode | null> => {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();

    // 1. Always try server first — server is the source of truth
    if (typeof window !== 'undefined') {
      try {
        const encoded = encodeURIComponent(cleanCode);
        const url = `/api/coupons?validate=${encoded}${planId ? `&planId=${encodeURIComponent(planId)}` : ''}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.valid && data.coupon) {
            // Update local cache with the fresh server copy
            mockDb.saveCoupon(data.coupon);
            return data.coupon;
          } else {
            // Server says invalid/deleted — remove it from local cache so it stops working
            const local = mockDb.getCoupons();
            const staleCoupon = local.find(c => (c.code || '').trim().toUpperCase() === cleanCode);
            if (staleCoupon) {
              const freshList = local.filter(c => (c.code || '').trim().toUpperCase() !== cleanCode);
              localStorage.setItem('portly_coupons', JSON.stringify(freshList));
            }
            return null;
          }
        }
      } catch (e) {
        console.warn('[MOCKDB] Server coupon validation unreachable, falling back to local cache:', e);
      }
    }

    // 2. Fallback: use local cache only if server is unreachable
    return mockDb.validateCoupon(code, planId);
  },
  useCoupon: (id: string) => {
    const list = mockDb.getCoupons();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) { 
      list[idx].usedCount = (list[idx].usedCount || 0) + 1; 
      localStorage.setItem('portly_coupons', JSON.stringify(list));
      // Sync usage to server
      if (typeof window !== 'undefined') {
        fetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(list[idx]),
        }).catch(() => {});
      }
    }
  },

  // ── Transactions ──────────────────────────────────────────────────────────────
  getTransactions: (email?: string): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const all: Transaction[] = JSON.parse(localStorage.getItem('portly_transactions') || '[]');
    return email ? all.filter(t => t.email === email) : all;
  },
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const all = mockDb.getTransactions();
    const newTx: Transaction = { ...tx, id: `tx-${Date.now()}`, timestamp: new Date().toISOString() };
    all.unshift(newTx);
    localStorage.setItem('portly_transactions', JSON.stringify(all));
    return newTx;
  },

  // ── Template Purchase ─────────────────────────────────────────────────────────
  purchaseTemplate: (email: string, templateId: string, price: number, couponCode?: string, discountedPrice?: number) => {
    // Mark user as owner
    const user = mockAuth.getCurrentUser();
    if (user) {
      user.purchasedTemplateIds = [...(user.purchasedTemplateIds || []), templateId];
      localStorage.setItem('portly_current_user', JSON.stringify(user));
      const users: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');
      const idx = users.findIndex(u => u.email === email);
      if (idx !== -1) { users[idx] = user; localStorage.setItem('portly_users', JSON.stringify(users)); }
    }
    // Mark template as purchased by this user
    const templates = mockDb.getCustomTemplates();
    const tIdx = templates.findIndex(t => t.id === templateId);
    if (tIdx !== -1) {
      templates[tIdx].purchasedBy = [...(templates[tIdx].purchasedBy || []), email];
      localStorage.setItem('portly_custom_templates', JSON.stringify(templates));
    }
    // Log transaction
    const tpl = templates.find(t => t.id === templateId);
    mockDb.addTransaction({
      email,
      itemType: 'template_purchase',
      itemName: tpl?.name || templateId,
      price: discountedPrice ?? price,
      originalPrice: price,
      couponApplied: couponCode,
    });
  },

  // ── All Users (Admin) ────────────────────────────────────────────────────────
  getAllUsers: (): UserProfile[] => {
    if (typeof window === 'undefined') return [];
    const all: UserProfile[] = JSON.parse(localStorage.getItem('portly_users') || '[]');

    // Seed default known accounts if not already present
    const legacySeedUsers: UserProfile[] = [
      {
        email: 'demo@campuscv.in',
        name: 'Alex Rivera',
        isPro: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        planType: '365-days',
        planDurationDays: 365,
        subscriptionExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        storageLimitMB: 500,
      },
      {
        email: 'karthikeyan@campuscv.in',
        name: 'KARTHIKEYAN PRABAKARAN',
        isPro: true,
        planType: '365-days',
        planDurationDays: 365,
        subscriptionExpires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        storageLimitMB: 500,
      },
      {
        email: 'anushka@campuscv.in',
        name: 'ANUSHKAA',
        isPro: true,
        planType: '90-days',
        planDurationDays: 90,
        subscriptionExpires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        storageLimitMB: 200,
      },
    ];

    for (const legacy of legacySeedUsers) {
      if (!all.find(u => u.email.toLowerCase() === legacy.email.toLowerCase())) {
        all.push(legacy);
      }
    }

    const current = mockAuth.getCurrentUser();
    if (current && !all.find(u => u.email.toLowerCase() === current.email.toLowerCase())) {
      all.unshift(current);
    }
    return all;
  },
  clearAllUsers: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('portly_users');
    localStorage.removeItem('portly_current_user');
    localStorage.removeItem('portly_transactions');
  },
};
