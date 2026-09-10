-- =============================================================================
-- CAMPUSCV MIGRATION: 01_CUSTOM_DOMAINS
-- Custom domain mappings for student/user portfolios
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id TEXT NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  normalized_domain TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'active', 'failed', 'removed')),
  verification_token TEXT,
  verified_at TIMESTAMPTZ,
  ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: A portfolio can have only one active/pending custom domain at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_domains_active_portfolio
  ON public.custom_domains (portfolio_id)
  WHERE status IN ('pending', 'verified', 'active');

-- Index on normalized domain for ultra-fast hostname resolution
CREATE INDEX IF NOT EXISTS idx_custom_domains_normalized
  ON public.custom_domains (normalized_domain);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_custom_domains_user_id
  ON public.custom_domains (user_id);

-- Index on status
CREATE INDEX IF NOT EXISTS idx_custom_domains_status
  ON public.custom_domains (status);

-- Trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS tr_custom_domains_updated_at ON public.custom_domains;
CREATE TRIGGER tr_custom_domains_updated_at
  BEFORE UPDATE ON public.custom_domains
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
