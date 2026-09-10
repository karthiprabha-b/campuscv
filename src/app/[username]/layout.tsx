import type { Metadata } from 'next';
import { loadPublishedPortfolio } from '../../lib/portfolioStore';
import { getPortfolioUrl, normalizeUsername, getBaseUrl, isReservedUsername } from '../../utils/urlHelper';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolved = await params;
  const rawUsername = resolved?.username || '';
  const username = normalizeUsername(rawUsername);

  if (isReservedUsername(username)) {
    return {
      title: 'CampusCV',
      robots: { index: false, follow: false }
    };
  }

  const canonicalUrl = getPortfolioUrl(username);
  const base = getBaseUrl();

  let title = `${username}'s Portfolio | CampusCV`;
  let description = 'Check out my verified portfolio built on CampusCV — A Smarter Way to Build Your Resume.';
  let ogImage = `${base}/assets/Campus%20CV%20Logo.png`;

  try {
    const portfolio = await loadPublishedPortfolio(username);
    if (portfolio) {
      title = portfolio.seo?.title || `${portfolio.name || username} — Professional Portfolio | CampusCV`;
      description = portfolio.seo?.description || portfolio.aboutMe || portfolio.tagline || description;
      const candidateImg = portfolio.profileImage || portfolio.avatarUrl || portfolio.photo || portfolio.projects?.[0]?.image;
      if (candidateImg && typeof candidateImg === 'string' && candidateImg.trim().length > 0) {
        ogImage = candidateImg.startsWith('http') ? candidateImg : `${base}${candidateImg.startsWith('/') ? '' : '/'}${candidateImg}`;
      }
    }
  } catch (e) {}

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'CampusCV',
      type: 'profile',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function PublishedRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
