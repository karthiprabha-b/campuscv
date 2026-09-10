import { normalizeDomain, isReservedDomain } from './domainUtils';
import { supabaseDb } from './supabase/dbService';
import { loadPublishedPortfolio, loadPortfolio } from './portfolioStore';
import { db } from './db';

export interface ResolvedPortfolioDomain {
  isCustomDomain: boolean;
  domain: string;
  normalizedDomain: string;
  portfolio: any | null;
  domainRecord: any | null;
  status: 'active' | 'verified' | 'pending' | 'failed' | 'not_found';
  sslStatus?: string;
}

/**
 * Server-side Hostname Resolver.
 * Maps an incoming Host header (e.g. "johnkumar.com") to its corresponding CampusCV portfolio.
 */
export async function resolvePortfolioFromHostname(rawHost: string | null | undefined): Promise<ResolvedPortfolioDomain | null> {
  if (!rawHost) return null;

  const normalized = normalizeDomain(rawHost);
  if (!normalized) return null;

  // 1. If standard CampusCV host or reserved system host, return null (handled by standard Next.js routing)
  if (isReservedDomain(normalized)) {
    return null;
  }

  // 2. Query custom_domains in Supabase (with fallback candidates for www. / apex)
  const candidates = [normalized];
  if (normalized.startsWith('www.')) {
    candidates.push(normalized.replace(/^www\./, ''));
  } else {
    candidates.push(`www.${normalized}`);
  }

  let domainRecord: any = null;

  // Query Supabase
  for (const cand of candidates) {
    domainRecord = await supabaseDb.getCustomDomainByNormalized(cand);
    if (domainRecord) break;
  }

  // Fallback query SQLite if Supabase is offline
  if (!domainRecord) {
    try {
      for (const cand of candidates) {
        const row = db.prepare(`
          SELECT * FROM custom_domains 
          WHERE normalized_domain = ? AND status != 'removed'
        `).get(cand) as any;
        if (row) {
          domainRecord = row;
          break;
        }
      }
    } catch (e) {
      console.warn('[DomainResolver SQLite fallback error]', e);
    }
  }

  if (!domainRecord) {
    console.log(`[DOMAIN RESOLVER] hostname=${normalized} status=not_found`);
    return {
      isCustomDomain: true,
      domain: rawHost,
      normalizedDomain: normalized,
      portfolio: null,
      domainRecord: null,
      status: 'not_found',
    };
  }

  const domainStatus = domainRecord.status || 'pending';
  const portfolioId = domainRecord.portfolio_id;
  const isDomainActive = domainStatus === 'active' || domainStatus === 'verified';

  console.log(`[DOMAIN RESOLVER] domain=${normalized} status=${domainStatus} portfolioId=${portfolioId}`);

  // If domain is not active/verified (e.g. pending, failed, removed), do NOT load or expose portfolio data
  if (!isDomainActive) {
    return {
      isCustomDomain: true,
      domain: domainRecord.domain || rawHost,
      normalizedDomain: domainRecord.normalized_domain || normalized,
      portfolio: null,
      domainRecord,
      status: domainStatus as any,
      sslStatus: domainRecord.ssl_status || 'pending',
    };
  }

  // 3. Load the published portfolio
  let portfolio: any = null;

  try {
    // First load the draft/portfolio record to determine publication identity
    const basePortfolio = await loadPortfolio(portfolioId);

    if (basePortfolio) {
      const publishedUsername =
        basePortfolio.username ||
        basePortfolio.slug ||
        null;

      if (publishedUsername) {
        portfolio = await loadPublishedPortfolio(publishedUsername);
      }

      // Fallback: load the published record directly by ID
      if (!portfolio) {
        portfolio = await loadPublishedPortfolio(`${portfolioId}-published`);
      }
    } else {
      // Fallback if basePortfolio is missing: load directly by portfolioId
      portfolio = await loadPublishedPortfolio(portfolioId);
      if (!portfolio) {
        portfolio = await loadPublishedPortfolio(`${portfolioId}-published`);
      }
    }

    if (portfolio) {
      console.log(
        `[DOMAIN PORTFOLIO] portfolioId="${portfolio.id}" username="${portfolio.username || ''}" published=${portfolio.published === 1 || portfolio.mode === 'published'} templateId="${portfolio.templateId || ''}"`
      );
      console.log(
        `[DOMAIN RENDER] domain="${normalized}" portfolioId="${portfolio.id}" mode="published"`
      );
    } else {
      console.warn(`[DOMAIN RESOLVER] No published portfolio found for active domain="${normalized}" portfolioId="${portfolioId}"`);
    }
  } catch (e) {
    console.error(`[DOMAIN RESOLVER] Failed to load portfolio for ID "${portfolioId}"`, e);
  }

  return {
    isCustomDomain: true,
    domain: domainRecord.domain || rawHost,
    normalizedDomain: domainRecord.normalized_domain || normalized,
    portfolio,
    domainRecord,
    status: 'active',
    sslStatus: domainRecord.ssl_status || 'pending',
  };
}
