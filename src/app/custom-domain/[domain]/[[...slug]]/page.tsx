import React from 'react';
import type { Metadata } from 'next';
import { resolvePortfolioFromHostname } from '../../../../lib/domainResolver';
import CustomDomainPortfolioClient from './CustomDomainPortfolioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ domain: string; slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawDomain = resolvedParams?.domain || '';
  const domain = decodeURIComponent(rawDomain).toLowerCase().trim();

  try {
    const resolution = await resolvePortfolioFromHostname(domain);
    if (resolution?.portfolio) {
      const port = resolution.portfolio;
      const title = port.seo?.title || (port.name ? `${port.name} | Portfolio` : `${domain} | Portfolio`);
      const description = port.seo?.description || port.meta?.description || port.tagline || '';
      const canonical = `https://${resolution.normalizedDomain}`;

      return {
        title,
        description,
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: 'CampusCV',
          type: 'profile',
        },
      };
    }
  } catch {}

  return {
    title: `${domain} | Portfolio`,
    description: 'Personal portfolio website hosted on CampusCV.',
  };
}

export default async function CustomDomainPortfolioPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawDomain = resolvedParams?.domain || '';
  const domain = decodeURIComponent(rawDomain).toLowerCase().trim();
  const initialSubpage = resolvedParams?.slug?.[0] || 'Home';

  console.log(`[DOMAIN REQUEST] host=${domain} initialSubpage=${initialSubpage}`);

  let resolution = null;
  try {
    resolution = await resolvePortfolioFromHostname(domain);
  } catch (err) {
    console.error(`[DOMAIN RESOLVER ERROR] host=${domain}`, err);
  }

  return (
    <CustomDomainPortfolioClient
      domain={domain}
      initialSubpage={initialSubpage}
      resolution={resolution}
    />
  );
}
