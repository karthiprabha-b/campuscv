import dns from 'dns';
import { normalizeDomain, DEFAULT_CAMPUSCV_HOST, DEFAULT_CAMPUSCV_SERVER_IP } from './domainUtils';

export interface DnsVerificationResult {
  verified: boolean;
  type: 'A' | 'CNAME' | 'HTTP' | 'NONE';
  detectedValues: string[];
  expectedValue: string;
  message: string;
}

// Global DNS resolvers to check for fast propagation
const DNS_RESOLVER_IPS = [
  '8.8.8.8',        // Google Primary
  '1.1.1.1',        // Cloudflare Primary
  '208.67.222.222',  // OpenDNS
  '8.8.4.4',        // Google Secondary
  '1.0.0.1',        // Cloudflare Secondary
];

/**
 * Server-side DNS verification service (Runs on Node.js Server).
 * Queries multiple global DNS resolvers with fallbacks to ensure fast, reliable verification for any domain.
 */
export async function verifyDomainDns(
  domain: string,
  options?: {
    expectedIp?: string;
    expectedCname?: string;
  }
): Promise<DnsVerificationResult> {
  const normalized = normalizeDomain(domain);
  const expectedIp = options?.expectedIp || process.env.CAMPUSCV_SERVER_IP || DEFAULT_CAMPUSCV_SERVER_IP;
  const expectedCname = (options?.expectedCname || DEFAULT_CAMPUSCV_HOST).toLowerCase();

  const labels = normalized.split('.');
  const isApex = labels.length === 2;

  const detectedValuesSet = new Set<string>();

  // Helper to test a specific resolver
  const testWithResolver = async (resolverInstance: dns.promises.Resolver | typeof dns.promises) => {
    // 1. Try A record lookup
    try {
      const aRecords = await resolverInstance.resolve4(normalized);
      if (aRecords && aRecords.length > 0) {
        aRecords.forEach(ip => detectedValuesSet.add(ip));

        const isDev = process.env.NODE_ENV !== 'production';
        const matchesServerIp = 
          aRecords.includes(expectedIp) || 
          aRecords.includes('187.127.188.246') || 
          aRecords.includes('142.93.219.15') || 
          aRecords.includes('142.93.218.15') ||
          (isDev && aRecords.includes('127.0.0.1'));

        if (matchesServerIp) {
          const matchedIp = aRecords.find(ip => ip === expectedIp || ip === '187.127.188.246' || ip === '142.93.219.15' || ip === '142.93.218.15' || (isDev && ip === '127.0.0.1')) || expectedIp;
          return { 
            verified: true, 
            type: 'A' as const, 
            detectedValues: aRecords, 
            expectedValue: expectedIp, 
            message: `✓ A record successfully verified pointing to ${matchedIp}.` 
          };
        }
      }
    } catch {}

    // 2. Try CNAME record lookup
    try {
      const cnames = await resolverInstance.resolveCname(normalized);
      if (cnames && cnames.length > 0) {
        const cleanCnames = cnames.map(c => c.toLowerCase().replace(/\.+$/, ''));
        cleanCnames.forEach(c => detectedValuesSet.add(c));
        if (cleanCnames.some(c => c === expectedCname || c.includes('campuscv.com') || c.includes('portfolio.campuscv.com'))) {
          return { 
            verified: true, 
            type: 'CNAME' as const, 
            detectedValues: cleanCnames, 
            expectedValue: expectedCname, 
            message: `✓ CNAME record successfully verified pointing to ${expectedCname}.` 
          };
        }
      }
    } catch {}

    return null;
  };

  try {
    // Step 1: Check with default system resolver
    const systemResult = await testWithResolver(dns.promises);
    if (systemResult) return systemResult;

    // Step 2: Check with fast global DNS servers
    for (const serverIp of DNS_RESOLVER_IPS) {
      try {
        const resolver = new dns.promises.Resolver();
        resolver.setServers([serverIp]);
        const res = await testWithResolver(resolver);
        if (res) return res;
      } catch {}
    }

    const detected = Array.from(detectedValuesSet);

    if (detected.length > 0) {
      return {
        verified: false,
        type: 'NONE',
        detectedValues: detected,
        expectedValue: isApex ? `A: ${expectedIp}` : `CNAME: ${expectedCname}`,
        message: `DNS records found (${detected.join(', ')}), but expecting A Record pointing to ${expectedIp} or CNAME pointing to ${expectedCname}.`,
      };
    }

    return {
      verified: false,
      type: 'NONE',
      detectedValues: [],
      expectedValue: isApex ? `A: ${expectedIp}` : `CNAME: ${expectedCname}`,
      message: 'No active DNS records detected yet. Please allow a few minutes for your DNS provider to propagate changes.',
    };
  } catch (err: any) {
    return {
      verified: false,
      type: 'NONE',
      detectedValues: [],
      expectedValue: isApex ? expectedIp : expectedCname,
      message: err.message || 'DNS resolution check in progress. Please verify your domain DNS records.',
    };
  }
}
