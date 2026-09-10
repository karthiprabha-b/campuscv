/**
 * SocialBindingResolver.ts — Social Link & Email Binding Engine
 *
 * Detects social platforms (LinkedIn, GitHub, Instagram, Twitter, Facebook, Dribbble, Behance, YouTube, Email),
 * normalizes URLs (https://, mailto:), and binds href attributes ONLY while preserving all original text, icons, and CSS.
 */

import { UniversalCanonicalProfile } from './BindingSchema';

export interface SocialBindingInfo {
  platform?: string;
  originalHref?: string;
  boundHref?: string;
  original?: string;
  bound?: string;
  working: boolean;
}

/**
 * Normalizes a raw social URL or email address.
 */
export function normalizeSocialUrl(platform: string, rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (platform === 'email') {
    const cleanMail = trimmed.replace(/^mailto:/i, '').trim();
    return `mailto:${cleanMail}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }
  return `https://${trimmed}`;
}

/**
 * Identifies the social platform of an anchor element using href, text, aria-label, classes, and icon metadata.
 */
export function detectAnchorPlatform(anchorEl: HTMLAnchorElement): string | null {
  const href = (anchorEl.getAttribute('href') || '').toLowerCase();
  const text = (anchorEl.innerText || anchorEl.textContent || '').toLowerCase();
  const aria = (anchorEl.getAttribute('aria-label') || anchorEl.getAttribute('title') || '').toLowerCase();
  const classes = (anchorEl.className && typeof anchorEl.className === 'string' ? anchorEl.className : '').toLowerCase();
  const id = (anchorEl.id || '').toLowerCase();

  const combined = `${href} ${text} ${aria} ${classes} ${id}`;

  const svgIcons = Array.from(anchorEl.querySelectorAll('svg, i, span, img'));
  let iconText = '';
  for (const icon of svgIcons) {
    const iconClass = (icon.className && typeof icon.className === 'string' ? icon.className : '').toLowerCase();
    const iconData = (icon.getAttribute('data-icon') || icon.getAttribute('title') || icon.getAttribute('alt') || '').toLowerCase();
    iconText += ` ${iconClass} ${iconData}`;
  }

  const fullCombined = `${combined} ${iconText}`;

  if (fullCombined.includes('linkedin')) return 'linkedin';
  if (fullCombined.includes('github')) return 'github';
  if (fullCombined.includes('instagram')) return 'instagram';
  if (fullCombined.includes('twitter') || fullCombined.includes('x.com') || fullCombined.includes('twitter-icon')) return 'twitter';
  if (fullCombined.includes('facebook')) return 'facebook';
  if (fullCombined.includes('dribbble')) return 'dribbble';
  if (fullCombined.includes('behance')) return 'behance';
  if (fullCombined.includes('youtube')) return 'youtube';
  if (href.startsWith('mailto:') || fullCombined.includes('mailto:') || fullCombined.includes('email') || fullCombined.includes('envelope')) return 'email';
  if (fullCombined.includes('website') || fullCombined.includes('portfolio') || fullCombined.includes('globe')) return 'website';

  return null;
}

/**
 * Resolves user's URL for a detected platform from canonical profile.
 */
export function getUserPlatformUrl(platform: string, profile: UniversalCanonicalProfile): string {
  if (!profile) return '';

  if (platform === 'email') return profile.email || '';
  if (platform === 'website') return profile.website || profile.socials?.website || '';

  const socials = profile.socials || {};
  return socials[platform] || '';
}

/**
 * Binds user social links and email addresses to all anchor elements in root container.
 */
export function bindSocialLinksContainer(
  rootEl: HTMLElement,
  profile: UniversalCanonicalProfile
): Record<string, SocialBindingInfo> {
  const anchors = Array.from(rootEl.querySelectorAll('a')) as HTMLAnchorElement[];
  const boundMap: Record<string, SocialBindingInfo> = {
    LinkedIn: { original: 'N/A', bound: 'N/A', working: true },
    Behance: { original: 'N/A', bound: 'N/A', working: true },
    Dribbble: { original: 'N/A', bound: 'N/A', working: true },
    Email: { original: 'N/A', bound: 'N/A', working: true },
    GitHub: { original: 'N/A', bound: 'N/A', working: true },
    Instagram: { original: 'N/A', bound: 'N/A', working: true },
    Twitter: { original: 'N/A', bound: 'N/A', working: true }
  };

  const unresolved: HTMLAnchorElement[] = [];

  for (const anchor of anchors) {
    const platform = detectAnchorPlatform(anchor);
    if (!platform) {
      const parentSec = anchor.closest('#contact, #footer, .social, .socials, .contact, nav');
      const hasIcon = anchor.querySelector('svg, i, img') !== null;
      if (parentSec || hasIcon) {
        unresolved.push(anchor);
      }
      continue;
    }

    const originalHref = anchor.getAttribute('href') || '';
    const userUrl = getUserPlatformUrl(platform, profile);

    if (userUrl && userUrl.trim().length > 0) {
      const boundHref = normalizeSocialUrl(platform, userUrl);
      if (boundHref && anchor.href !== boundHref) {
        anchor.href = boundHref;
        anchor.setAttribute('href', boundHref);
      }

      console.log(`[SOCIAL BINDING]\nplatform:\n${platform}\noriginalHref:\n${originalHref}\nboundHref:\n${boundHref}\nstatus:\nBOUND`);

      const keyName = platform === 'linkedin' ? 'LinkedIn' : (platform === 'behance' ? 'Behance' : (platform === 'dribbble' ? 'Dribbble' : (platform === 'email' ? 'Email' : (platform === 'github' ? 'GitHub' : (platform === 'instagram' ? 'Instagram' : (platform === 'twitter' ? 'Twitter' : platform.charAt(0).toUpperCase() + platform.slice(1)))))));

      boundMap[keyName] = {
        platform,
        originalHref,
        boundHref,
        original: originalHref,
        bound: boundHref,
        working: true
      };
    } else {
      console.log(`[SOCIAL BINDING]\nplatform:\n${platform}\noriginalHref:\n${originalHref}\nboundHref:\n${originalHref}\nstatus:\nPRESERVED_TEMPLATE`);
    }
  }

  if (unresolved.length > 0) {
    console.log(`UNRESOLVED SOCIAL LINKS`, unresolved);
  }

  return boundMap;
}
