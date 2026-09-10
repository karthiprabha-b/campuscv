import { getSupabaseBrowserClient } from './client';
import { getSupabaseServerClient } from './server';
import { Database, Json } from './types';

// Helper to get client depending on runtime environment
export function getDbClient() {
  if (typeof window !== 'undefined') {
    return getSupabaseBrowserClient();
  }
  return getSupabaseServerClient();
}

/**
 * Normalizes portfolio object into the 3 relational Supabase tables:
 * - portfolios
 * - portfolio_content
 * - portfolio_design
 */
export function decomposePortfolio(portfolio: any) {
  const now = new Date().toISOString();
  const portfolioId = portfolio.id || `port-${Date.now()}`;
  const slug = portfolio.username || portfolio.meta?.slug || portfolio.slug || `user-${Date.now().toString().slice(-4)}`;

  const portfolioRow: Database['public']['Tables']['portfolios']['Insert'] = {
    id: portfolioId,
    user_id: portfolio.userId || portfolio.user_id || null,
    title: portfolio.title || portfolio.meta?.portfolioTitle || `${portfolio.name || 'User'}'s Portfolio`,
    slug: slug.toLowerCase(),
    template_id: portfolio.templateId || portfolio.layoutStyle || '',
    template_version_id: portfolio.templateVersionId || null,
    status: portfolio.published ? 'published' : 'draft',
    published: Boolean(portfolio.published),
    published_at: portfolio.published ? (portfolio.published_at || now) : null,
    custom_domain: portfolio.customDomain || null,
    updated_at: now,
  };

  const contentRow: Database['public']['Tables']['portfolio_content']['Insert'] = {
    portfolio_id: portfolioId,
    profile: (portfolio.profile || portfolio.personal || {}) as Json,
    about: (portfolio.about || { description: portfolio.aboutMe || '' }) as Json,
    hero: (portfolio.hero || { title: portfolio.name || '', subtitle: portfolio.tagline || '', description: portfolio.aboutMe || '' }) as Json,
    projects: (Array.isArray(portfolio.projects) ? portfolio.projects : []) as unknown as Json,
    experience: (Array.isArray(portfolio.experience) ? portfolio.experience : (portfolio.timeline || [])) as unknown as Json,
    education: (Array.isArray(portfolio.education) ? portfolio.education : []) as unknown as Json,
    skills: (Array.isArray(portfolio.skills) ? portfolio.skills : []) as unknown as Json,
    certifications: (Array.isArray(portfolio.certifications) ? portfolio.certifications : []) as unknown as Json,
    social_links: (portfolio.socialLinks || portfolio.social || {}) as Json,
    contact: (portfolio.contact || {}) as Json,
    custom_sections: (portfolio.custom_sections || portfolio.addedSections || []) as unknown as Json,
    canonical_profile: (portfolio.canonicalProfile || {}) as Json,
    raw_data: portfolio as Json, // Stores complete document to prevent any loss
    updated_at: now,
  };

  const designRow: Database['public']['Tables']['portfolio_design']['Insert'] = {
    portfolio_id: portfolioId,
    template_id: portfolio.templateId || portfolio.layoutStyle || '',
    accent_color: portfolio.themeColor || portfolio.theme?.primaryColor || 'violet',
    font_family: portfolio.fontPack || portfolio.typography?.fontFamily || 'sans',
    font_size: String(portfolio.baseFontSize || portfolio.typography?.fontSize || '16'),
    theme_mode: portfolio.isDarkMode ? 'dark' : 'light',
    custom_settings: {
      styleOverrides: portfolio.styleOverrides || {},
      contentOverrides: portfolio.contentOverrides || {},
      imageOverrides: portfolio.imageOverrides || {},
      deletedNodes: portfolio.deletedNodes || {},
      advancedSettings: portfolio.advancedSettings || {},
      spacingPreset: portfolio.spacingPreset,
      sectionGap: portfolio.sectionGap,
      cardBorderRadius: portfolio.cardBorderRadius,
      contentPadding: portfolio.contentPadding,
      animationPreset: portfolio.animationPreset,
      sectionOrder: portfolio.sectionOrder,
    } as Json,
    custom_css: portfolio.customCSS || null,
    updated_at: now,
  };

  return { portfolioRow, contentRow, designRow };
}

/**
 * Reassembles a full Portfolio object from Supabase relational rows.
 */
export function reassemblePortfolio(
  portfolioRow: any,
  contentRow?: any,
  designRow?: any
): any {
  const raw = (contentRow?.raw_data as any) || {};

  const assembled = {
    ...raw,
    id: portfolioRow.id,
    user_id: portfolioRow.user_id,
    userId: portfolioRow.user_id,
    username: portfolioRow.slug || raw.username,
    title: portfolioRow.title || raw.title,
    templateId: portfolioRow.template_id || designRow?.template_id || raw.templateId || '',
    layoutStyle: portfolioRow.template_id || designRow?.template_id || raw.layoutStyle || '',
    templateVersionId: portfolioRow.template_version_id || raw.templateVersionId,
    published: portfolioRow.published,
    customDomain: portfolioRow.custom_domain || raw.customDomain,
    themeColor: designRow?.accent_color || raw.themeColor || 'violet',
    fontPack: designRow?.font_family || raw.fontPack || 'sans',
    isDarkMode: designRow?.theme_mode === 'dark',
    customCSS: designRow?.custom_css || raw.customCSS || '',
  };

  if (contentRow) {
    if (contentRow.profile && Object.keys(contentRow.profile).length > 0) {
      assembled.profile = contentRow.profile;
      assembled.personal = contentRow.profile;
    }
    if (contentRow.hero && Object.keys(contentRow.hero).length > 0) assembled.hero = contentRow.hero;
    if (contentRow.about && Object.keys(contentRow.about).length > 0) assembled.about = contentRow.about;
    if (Array.isArray(contentRow.projects)) assembled.projects = contentRow.projects;
    if (Array.isArray(contentRow.experience)) assembled.experience = contentRow.experience;
    if (Array.isArray(contentRow.education)) assembled.education = contentRow.education;
    if (Array.isArray(contentRow.skills)) assembled.skills = contentRow.skills;
    if (Array.isArray(contentRow.certifications)) assembled.certifications = contentRow.certifications;
    if (contentRow.social_links && Object.keys(contentRow.social_links).length > 0) {
      assembled.socialLinks = contentRow.social_links;
      assembled.social = contentRow.social_links;
    }
    if (contentRow.canonical_profile && Object.keys(contentRow.canonical_profile).length > 0) {
      assembled.canonicalProfile = contentRow.canonical_profile;
    }
  }

  if (designRow?.custom_settings && typeof designRow.custom_settings === 'object') {
    const cs = designRow.custom_settings as any;
    if (cs.styleOverrides) assembled.styleOverrides = cs.styleOverrides;
    if (cs.contentOverrides) assembled.contentOverrides = cs.contentOverrides;
    if (cs.imageOverrides) assembled.imageOverrides = cs.imageOverrides;
    if (cs.deletedNodes) assembled.deletedNodes = cs.deletedNodes;
    if (cs.advancedSettings) assembled.advancedSettings = cs.advancedSettings;
    if (cs.spacingPreset) assembled.spacingPreset = cs.spacingPreset;
    if (cs.sectionGap !== undefined) assembled.sectionGap = cs.sectionGap;
    if (cs.cardBorderRadius !== undefined) assembled.cardBorderRadius = cs.cardBorderRadius;
    if (cs.contentPadding !== undefined) assembled.contentPadding = cs.contentPadding;
    if (cs.animationPreset) assembled.animationPreset = cs.animationPreset;
    if (cs.sectionOrder) assembled.sectionOrder = cs.sectionOrder;
  }

  // Ensure essential top-level fields are always populated
  assembled.name = assembled.name || raw.name || raw.personal?.fullName || assembled.profile?.fullName || assembled.profile?.name || raw.canonicalProfile?.personal?.fullName || '';
  assembled.tagline = assembled.tagline || raw.tagline || raw.personal?.headline || assembled.profile?.headline || raw.canonicalProfile?.personal?.headline || '';
  assembled.aboutMe = assembled.aboutMe || raw.aboutMe || raw.personal?.summary || assembled.profile?.summary || raw.canonicalProfile?.personal?.summary || '';
  assembled.profileImage = assembled.profileImage || raw.profileImage || raw.personal?.profilePhoto || assembled.profile?.photo || raw.canonicalProfile?.personal?.profilePhoto || raw.avatarUrl || '';

  return assembled;
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Data Operations
// ─────────────────────────────────────────────────────────────────────────────

export const supabaseDb = {
  /**
   * Save or update a portfolio and its content/design in Supabase.
   */
  async savePortfolio(portfolio: any): Promise<boolean> {
    try {
      const client = getDbClient() as any;
      const { portfolioRow, contentRow, designRow } = decomposePortfolio(portfolio);

      const { error: portErr } = await client
        .from('portfolios')
        .upsert(portfolioRow, { onConflict: 'id' });

      if (portErr) {
        console.warn('[Supabase savePortfolio error - portfolios table]', portErr.message);
        return false;
      }

      const { error: contentErr } = await client
        .from('portfolio_content')
        .upsert(contentRow, { onConflict: 'portfolio_id' });

      if (contentErr) {
        console.warn('[Supabase savePortfolio error - content table]', contentErr.message);
      }

      const { error: designErr } = await client
        .from('portfolio_design')
        .upsert(designRow, { onConflict: 'portfolio_id' });

      if (designErr) {
        console.warn('[Supabase savePortfolio error - design table]', designErr.message);
      }

      return true;
    } catch (e) {
      console.warn('[Supabase savePortfolio exception]', e);
      return false;
    }
  },

  /**
   * Load portfolio by ID from Supabase.
   */
  async loadPortfolio(id: string): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const { data: port, error } = await client
        .from('portfolios')
        .select('*, portfolio_content(*), portfolio_design(*)')
        .eq('id', id)
        .maybeSingle();

      if (error || !port) return null;

      const content = Array.isArray(port.portfolio_content) ? port.portfolio_content[0] : port.portfolio_content;
      const design = Array.isArray(port.portfolio_design) ? port.portfolio_design[0] : port.portfolio_design;

      return reassemblePortfolio(port, content, design);
    } catch (e) {
      console.warn('[Supabase loadPortfolio exception]', e);
      return null;
    }
  },

  /**
   * Load published portfolio by username/slug from Supabase.
   */
  async loadPublishedPortfolio(slugOrUsername: string): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const { data: port, error } = await client
        .from('portfolios')
        .select('*, portfolio_content(*), portfolio_design(*)')
        .ilike('slug', slugOrUsername)
        .eq('published', true)
        .maybeSingle();

      if (error || !port) {
        // Try exact match on ID if slug match fails
        const { data: portById } = await client
          .from('portfolios')
          .select('*, portfolio_content(*), portfolio_design(*)')
          .eq('id', slugOrUsername)
          .eq('published', true)
          .maybeSingle();

        if (portById) {
          const c = Array.isArray(portById.portfolio_content) ? portById.portfolio_content[0] : portById.portfolio_content;
          const d = Array.isArray(portById.portfolio_design) ? portById.portfolio_design[0] : portById.portfolio_design;
          return reassemblePortfolio(portById, c, d);
        }

        return null;
      }

      const content = Array.isArray(port.portfolio_content) ? port.portfolio_content[0] : port.portfolio_content;
      const design = Array.isArray(port.portfolio_design) ? port.portfolio_design[0] : port.portfolio_design;

      const result = reassemblePortfolio(port, content, design);
      result.renderMode = 'published';
      result.mode = 'published';
      return result;
    } catch (e) {
      console.warn('[Supabase loadPublishedPortfolio exception]', e);
      return null;
    }
  },

  /**
   * Publish a portfolio in Supabase.
   */
  async publishPortfolio(id: string): Promise<boolean> {
    try {
      const client = getDbClient() as any;
      const now = new Date().toISOString();

      const { error } = await client
        .from('portfolios')
        .update({
          published: true,
          status: 'published',
          published_at: now,
          updated_at: now,
        })
        .eq('id', id);

      return !error;
    } catch (e) {
      console.warn('[Supabase publishPortfolio exception]', e);
      return false;
    }
  },

  /**
   * Delete portfolio from Supabase.
   */
  async deletePortfolio(id: string): Promise<boolean> {
    try {
      const client = getDbClient() as any;
      const { error } = await client.from('portfolios').delete().eq('id', id);
      return !error;
    } catch (e) {
      console.warn('[Supabase deletePortfolio exception]', e);
      return false;
    }
  },

  /**
   * Get all portfolios (for dashboard or admin).
   */
  async getPortfolios(userId?: string): Promise<any[]> {
    try {
      const client = getDbClient() as any;
      let query = client
        .from('portfolios')
        .select('*, portfolio_content(*), portfolio_design(*)');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      let { data, error } = await query;
      if (error || !data) data = [];

      return data.map((port: any) => {
        const c = Array.isArray(port.portfolio_content) ? port.portfolio_content[0] : port.portfolio_content;
        const d = Array.isArray(port.portfolio_design) ? port.portfolio_design[0] : port.portfolio_design;
        return reassemblePortfolio(port, c, d);
      });
    } catch (e) {
      console.warn('[Supabase getPortfolios exception]', e);
      return [];
    }
  },

  /**
   * Fetch all users/profiles for Admin Users table with plan, portfolio count, and payment stats.
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const client = getDbClient() as any;
      const { data: profiles, error } = await client
        .from('profiles')
        .select(`
          *,
          portfolios(id, title, slug, published, created_at),
          subscriptions(id, plan_id, status, expires_at),
          payments(id, amount, status, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error || !profiles) return [];

      return profiles.map((p: any) => {
        const ports = p.portfolios || [];
        const subs = p.subscriptions || [];
        const pmts = p.payments || [];
        const activeSub = subs.find((s: any) => s.status === 'active') || subs[0];

        return {
          id: p.id,
          email: p.email,
          name: p.full_name || p.email?.split('@')[0] || 'User',
          isPro: p.is_pro,
          planType: p.plan_type || activeSub?.plan_id || 'Free Starter',
          subscriptionExpires: p.subscription_expires_at || activeSub?.expires_at,
          storageLimitMB: p.storage_limit_mb || 500,
          role: p.role,
          createdAt: p.created_at,
          portfoliosCount: ports.length,
          hasPublished: ports.some((pt: any) => pt.published),
          portfolios: ports,
          transactions: pmts,
        };
      });
    } catch (e) {
      console.warn('[Supabase getAllUsers exception]', e);
      return [];
    }
  },

  /**
   * Fetch a single user profile by id.
   */
  async getProfileById(id: string): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return data;
    } catch (e) {
      console.warn('[Supabase getProfileById error]', e);
      return null;
    }
  },

  /**
   * Create or update user profile in Supabase with automatic plan duration calculation.
   */
  async upsertProfile(profile: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role?: 'user' | 'admin';
    plan_type?: string;
    duration_days?: number;
    is_pro?: boolean;
    storage_limit_mb?: number;
    subscription_expires_at?: string | null;
  }): Promise<boolean> {
    try {
      const client = getDbClient() as any;

      // Check if profile already exists to preserve existing subscription / data if not explicitly provided
      const { data: existing } = await client
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();

      const isPro = profile.is_pro !== undefined 
        ? profile.is_pro 
        : (profile.plan_type !== undefined ? (profile.plan_type !== 'expired' && profile.plan_type !== 'free') : (existing?.is_pro ?? false));

      const planType = profile.plan_type !== undefined
        ? profile.plan_type
        : (existing?.plan_type || (isPro ? '30-days' : 'free'));

      let durationDays = profile.duration_days;
      if (!durationDays && planType !== 'expired' && planType !== 'free') {
        if (planType.includes('365') || planType.toLowerCase().includes('year')) durationDays = 365;
        else if (planType.includes('90') || planType.toLowerCase().includes('quarter')) durationDays = 90;
        else if (planType.includes('30') || planType.toLowerCase().includes('month')) durationDays = 30;
        else durationDays = 30;
      }

      // Compute dynamic expiration date
      let expiresAt = profile.subscription_expires_at;
      if (!isPro) {
        expiresAt = null;
      } else if (expiresAt === undefined) {
        if (existing?.subscription_expires_at && existing?.is_pro) {
          expiresAt = existing.subscription_expires_at;
        } else if (durationDays) {
          const purchaseDate = new Date();
          purchaseDate.setDate(purchaseDate.getDate() + durationDays);
          expiresAt = purchaseDate.toISOString();
        } else {
          expiresAt = null;
        }
      }

      const updatePayload: any = {
        id: profile.id,
        email: profile.email || existing?.email,
        full_name: profile.full_name || existing?.full_name || profile.email?.split('@')[0] || 'User',
        avatar_url: profile.avatar_url ?? existing?.avatar_url ?? '',
        role: profile.role || existing?.role || 'user',
        plan_type: planType,
        is_pro: isPro,
        storage_limit_mb: profile.storage_limit_mb ?? existing?.storage_limit_mb ?? 500,
        subscription_expires_at: expiresAt,
        updated_at: new Date().toISOString()
      };

      const { error } = await client
        .from('profiles')
        .upsert(updatePayload, { onConflict: 'id' });

      return !error;
    } catch (e) {
      console.warn('[Supabase upsertProfile error]', e);
      return false;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Custom Domains
  // ─────────────────────────────────────────────────────────────────────────────

  async getCustomDomainByNormalized(normalizedDomain: string): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const { data, error } = await client
        .from('custom_domains')
        .select('*')
        .eq('normalized_domain', normalizedDomain.toLowerCase())
        .neq('status', 'removed')
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn('[Supabase getCustomDomainByNormalized exception]', e);
    }
    return null;
  },

  async getCustomDomainByPortfolio(portfolioId: string): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const { data, error } = await client
        .from('custom_domains')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .neq('status', 'removed')
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn('[Supabase getCustomDomainByPortfolio exception]', e);
    }
    return null;
  },

  async createCustomDomain(domainData: {
    portfolio_id: string;
    user_id?: string | null;
    domain: string;
    normalized_domain: string;
    status?: 'pending' | 'verified' | 'active' | 'failed' | 'removed';
    ssl_status?: 'pending' | 'provisioning' | 'active' | 'failed';
    verification_token?: string;
  }): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const now = new Date().toISOString();
      const insertPayload = {
        ...domainData,
        status: domainData.status || 'pending',
        ssl_status: domainData.ssl_status || 'pending',
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await client
        .from('custom_domains')
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error('[Supabase createCustomDomain error]', error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('[Supabase createCustomDomain exception]', e);
      return null;
    }
  },

  async updateCustomDomain(id: string, updates: Partial<{
    portfolio_id?: string;
    user_id?: string | null;
    domain?: string;
    normalized_domain?: string;
    status: 'pending' | 'verified' | 'active' | 'failed' | 'removed';
    verified_at: string | null;
    ssl_status: 'pending' | 'provisioning' | 'active' | 'failed';
    verification_token?: string | null;
    updated_at?: string;
  }>): Promise<any | null> {
    try {
      const client = getDbClient() as any;
      const now = new Date().toISOString();
      const { data, error } = await client
        .from('custom_domains')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[Supabase updateCustomDomain error]', error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('[Supabase updateCustomDomain exception]', e);
      return null;
    }
  },

  async removeCustomDomain(id: string): Promise<boolean> {
    try {
      const client = getDbClient() as any;
      const now = new Date().toISOString();
      const { error } = await client
        .from('custom_domains')
        .update({ status: 'removed', updated_at: now })
        .eq('id', id);

      return !error;
    } catch (e) {
      console.warn('[Supabase removeCustomDomain exception]', e);
      return false;
    }
  },
};
