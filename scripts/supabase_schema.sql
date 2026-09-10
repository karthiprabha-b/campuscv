-- =============================================================================
-- CAMPUSCV SUPABASE PRODUCTION DATABASE SCHEMA
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked to auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan_type TEXT NOT NULL DEFAULT 'free',
  is_pro BOOLEAN NOT NULL DEFAULT false,
  storage_limit_mb INTEGER NOT NULL DEFAULT 500,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PLANS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  storage_mb INTEGER NOT NULL DEFAULT 25,
  storage_label TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default plans if not already present
INSERT INTO public.plans (id, name, duration_days, price, currency, storage_mb, storage_label, description, is_active)
VALUES
  ('plan-15', 'Starter Pack', 15, 19, 'INR', 25, '25 MB', 'Ideal for simple portfolio submissions.', true),
  ('plan-30', 'Growth Pack', 30, 49, 'INR', 100, '100 MB', 'Standard plan for job hunting.', true),
  ('plan-90', 'Pro Professional', 90, 99, 'INR', 200, '200 MB', 'Perfect for active interns & freelancers.', true),
  ('plan-365', 'Developer Unlimited', 365, 299, 'INR', 500, '500 MB', 'Premium hosting for graduating students.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  duration_days = EXCLUDED.duration_days,
  price = EXCLUDED.price,
  storage_mb = EXCLUDED.storage_mb,
  storage_label = EXCLUDED.storage_label,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- 3. SUBSCRIPTIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES public.plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled', 'pending')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PAYMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  plan_id TEXT REFERENCES public.plans(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PAYMENT_EVENTS TABLE (Webhook Idempotency)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PORTFOLIOS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  slug TEXT UNIQUE,
  template_id TEXT NOT NULL DEFAULT 'product-designer-portfolio',
  template_version_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  custom_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on slug for fast public lookup
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios (LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios (user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_published ON public.portfolios (published);

-- 7. PORTFOLIO_CONTENT TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT UNIQUE NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  about JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero JSONB NOT NULL DEFAULT '{}'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  canonical_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. PORTFOLIO_DESIGN TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_design (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT UNIQUE NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  template_id TEXT,
  accent_color TEXT,
  font_family TEXT,
  font_size TEXT,
  theme_mode TEXT NOT NULL DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light')),
  custom_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_css TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. USER_ACTIVITY TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  portfolio_id TEXT REFERENCES public.portfolios(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- AUTOMATIC TIMESTAMPS & PROFILE CREATION TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger updated_at on relevant tables
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER tr_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_portfolio_content_updated_at ON public.portfolio_content;
CREATE TRIGGER tr_portfolio_content_updated_at BEFORE UPDATE ON public.portfolio_content FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_portfolio_design_updated_at ON public.portfolio_design;
CREATE TRIGGER tr_portfolio_design_updated_at BEFORE UPDATE ON public.portfolio_design FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: When new user signs up in auth.users, auto create public.profiles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, plan_type, is_pro, storage_limit_mb, subscription_expires_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    CASE WHEN NEW.email ILIKE '%campuscv.in%' THEN 'admin' ELSE 'user' END,
    CASE WHEN NEW.email ILIKE '%campuscv.in%' THEN '365-days' ELSE 'free' END,
    CASE WHEN NEW.email ILIKE '%campuscv.in%' THEN true ELSE false END,
    500,
    CASE WHEN NEW.email ILIKE '%campuscv.in%' THEN now() + INTERVAL '365 days' ELSE NULL END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_design ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Helper to check if current authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
CREATE POLICY "Public can view basic profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NOT NULL OR public.is_admin());

-- 2. Plans Policies (Public read)
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (true);

-- 3. Portfolios Policies
DROP POLICY IF EXISTS "Anyone can view published portfolios" ON public.portfolios;
CREATE POLICY "Anyone can view published portfolios" ON public.portfolios FOR SELECT
  USING (published = true OR auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own portfolios" ON public.portfolios;
CREATE POLICY "Users can insert own portfolios" ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL OR user_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own portfolios" ON public.portfolios;
CREATE POLICY "Users can update own portfolios" ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Users can delete own portfolios" ON public.portfolios;
CREATE POLICY "Users can delete own portfolios" ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- 4. Portfolio Content Policies
DROP POLICY IF EXISTS "Anyone can view published portfolio content" ON public.portfolio_content;
CREATE POLICY "Anyone can view published portfolio content" ON public.portfolio_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_content.portfolio_id
      AND (portfolios.published = true OR portfolios.user_id = auth.uid() OR portfolios.user_id IS NULL OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can modify own portfolio content" ON public.portfolio_content;
CREATE POLICY "Users can modify own portfolio content" ON public.portfolio_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_content.portfolio_id
      AND (portfolios.user_id = auth.uid() OR portfolios.user_id IS NULL OR public.is_admin())
    )
  );

-- 5. Portfolio Design Policies
DROP POLICY IF EXISTS "Anyone can view published portfolio design" ON public.portfolio_design;
CREATE POLICY "Anyone can view published portfolio design" ON public.portfolio_design FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_design.portfolio_id
      AND (portfolios.published = true OR portfolios.user_id = auth.uid() OR portfolios.user_id IS NULL OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can modify own portfolio design" ON public.portfolio_design;
CREATE POLICY "Users can modify own portfolio design" ON public.portfolio_design FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_design.portfolio_id
      AND (portfolios.user_id = auth.uid() OR portfolios.user_id IS NULL OR public.is_admin())
    )
  );

-- 6. Subscriptions Policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 7. Payments Policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 8. User Activity Policies
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
CREATE POLICY "Users can view own activity" ON public.user_activity FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- =============================================================================
-- STORAGE BUCKETS SETUP
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('portfolio-images', 'portfolio-images', true),
  ('project-images', 'project-images', true),
  ('resumes', 'resumes', false),
  ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage Policies for public read on public buckets
DROP POLICY IF EXISTS "Public access for avatars" ON storage.objects;
CREATE POLICY "Public access for avatars" ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'portfolio-images', 'project-images'));

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('avatars', 'portfolio-images', 'project-images', 'resumes', 'documents'));
