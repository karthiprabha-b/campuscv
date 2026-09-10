/**
 * urlHelper.ts — Single Source of Truth for CampusCV URLs
 *
 * Production App: https://portfolio.campuscv.com
 * Marketing / WordPress: https://campuscv.com
 * Local: http://localhost:3000
 *
 * Portfolio Link Format: https://portfolio.campuscv.com/[username] (Clean root URL without /p/)
 */

export const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'auth', 'dashboard', 'editor', 'preview', 'login', 'signup', 'onboarding',
  'pricing', 'privacy', 'security', 'terms', 'help', 'faq', 'guide', 'grants',
  'templates', 'template-files', 'template-assets', 'assets', 'static', 'public',
  'p', 'cv', 'app', 'settings', 'profile', 'logout', 'null', 'undefined',
  'favicon.ico', 'icon.png', 'robots.txt', 'sitemap.xml', 'uploads', 'debug'
]);

export function isReservedUsername(username: string): boolean {
  if (!username) return true;
  return RESERVED_USERNAMES.has(normalizeUsername(username));
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://portfolio.campuscv.com';
  }
  return 'http://localhost:3000';
}

export function getMarketingUrl(): string {
  if (process.env.NEXT_PUBLIC_MARKETING_URL) {
    return process.env.NEXT_PUBLIC_MARKETING_URL.replace(/\/+$/, '');
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://campuscv.com';
  }
  return 'http://localhost:3000';
}

export function normalizeUsername(username: string): string {
  if (!username) return '';
  return username
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
}

/**
 * Generates the clean root portfolio URL: https://portfolio.campuscv.com/[username]
 */
export function getPortfolioUrl(username: string): string {
  if (!username) return '';
  const cleanUser = normalizeUsername(username);
  return `${getBaseUrl()}/${cleanUser}`;
}

// Alias for backward compatibility
export function getPublicPortfolioUrl(username: string): string {
  return getPortfolioUrl(username);
}

/**
 * Legacy URL with /p/ prefix for backward compatibility
 */
export function getLegacyPortfolioUrl(username: string): string {
  if (!username) return '';
  const cleanUser = normalizeUsername(username);
  return `${getBaseUrl()}/p/${cleanUser}`;
}

export function getEditorUrl(portfolioId: string): string {
  if (!portfolioId) return '';
  return `${getBaseUrl()}/editor/${encodeURIComponent(portfolioId)}`;
}

export function getPreviewUrl(portfolioId: string): string {
  if (!portfolioId) return '';
  return `${getBaseUrl()}/preview/${encodeURIComponent(portfolioId)}`;
}

export function getQrUrl(username: string): string {
  return getPortfolioUrl(username);
}

export function getShareUrl(username: string): string {
  return getPortfolioUrl(username);
}
