// Default CampusCV Production App Host & IP
export const DEFAULT_CAMPUSCV_HOST = process.env.NEXT_PUBLIC_CAMPUSCV_HOST || 'portfolio.campuscv.com';
export const DEFAULT_CAMPUSCV_SERVER_IP = process.env.NEXT_PUBLIC_CAMPUSCV_SERVER_IP || process.env.CAMPUSCV_SERVER_IP || '187.127.188.246';

// Reserved and Internal Domains that cannot be claimed as custom domains
export const RESERVED_DOMAINS = new Set([
  'campuscv.com',
  'www.campuscv.com',
  'portfolio.campuscv.com',
  'app.campuscv.com',
  'api.campuscv.com',
  'admin.campuscv.com',
  'mail.campuscv.com',
  'smtp.campuscv.com',
  'dev.campuscv.com',
  'staging.campuscv.com',
  'localhost',
  'localhost.localdomain',
  'local',
  'broadcasthost',
]);

/**
 * Checks if a string is an IP address (IPv4 or IPv6).
 */
export function isIpAddress(host: string): boolean {
  if (!host) return false;
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(host)) return true;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^([0-9a-fA-F]{1,4}:)+(:[0-9a-fA-F]{1,4})+$/;
  if (ipv6Regex.test(host) || host.includes(':')) return true;
  return false;
}

/**
 * Normalizes user-inputted domain name.
 * 
 * Rules:
 * 1. Trims whitespace and converts to lowercase.
 * 2. Strips protocol (http://, https://, //).
 * 3. Strips trailing path, query params, hash (#).
 * 4. Strips port numbers if present (:3000, :443, :80).
 * 5. Removes trailing slashes or dots.
 * 6. Preserves explicit subdomains (e.g. www.johnkumar.com remains www.johnkumar.com).
 */
export function normalizeDomain(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let domain = input.trim().toLowerCase();

  // Strip protocol
  domain = domain.replace(/^(?:https?:)?\/\//, '');

  // Strip path, query params, and fragments
  domain = domain.split('/')[0].split('?')[0].split('#')[0];

  // Strip port if present
  domain = domain.split(':')[0];

  // Remove trailing dot (DNS root label)
  domain = domain.replace(/\.+$/, '');

  return domain;
}

/**
 * Validates domain syntax according to RFC 1035 / RFC 1123 standards.
 */
export function isValidDomainSyntax(domain: string): { valid: boolean; error?: string } {
  if (!domain) {
    return { valid: false, error: 'Domain name is required.' };
  }

  if (domain.length > 253) {
    return { valid: false, error: 'Domain name is too long (maximum 253 characters).' };
  }

  // Reject IP addresses
  if (isIpAddress(domain)) {
    return { valid: false, error: 'IP addresses cannot be used as custom domains.' };
  }

  // Reject localhost or single-word domains
  if (domain === 'localhost' || !domain.includes('.')) {
    return { valid: false, error: 'Domain must include a valid top-level domain (e.g. .com, .dev).' };
  }

  // Labels validation (e.g. "sub.example.com" -> ["sub", "example", "com"])
  const labels = domain.split('.');
  if (labels.length < 2) {
    return { valid: false, error: 'Domain must have at least two parts (e.g. domain.com).' };
  }

  // Check top-level domain (TLD) is at least 2 alpha characters
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,63}$/i.test(tld)) {
    return { valid: false, error: 'Invalid top-level domain (TLD).' };
  }

  for (const label of labels) {
    if (label.length === 0) {
      return { valid: false, error: 'Domain contains empty segments (consecutive dots).' };
    }
    if (label.length > 63) {
      return { valid: false, error: 'Domain segment exceeds 63 characters.' };
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return { valid: false, error: 'Domain segments cannot start or end with a hyphen.' };
    }
    if (!/^[a-z0-9-]+$/i.test(label)) {
      return { valid: false, error: 'Domain can only contain alphanumeric characters and hyphens.' };
    }
  }

  return { valid: true };
}

/**
 * Checks whether a domain is reserved by CampusCV or represents internal services.
 */
export function isReservedDomain(domain: string): boolean {
  if (!domain) return true;
  const normalized = normalizeDomain(domain);

  if (RESERVED_DOMAINS.has(normalized)) return true;

  // Check wildcard matching for campuscv.com subdomains
  if (normalized.endsWith('.campuscv.com')) return true;

  // Check localhost / local / internal patterns
  if (
    normalized === 'localhost' ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.localhost') ||
    isIpAddress(normalized)
  ) {
    return true;
  }

  return false;
}
