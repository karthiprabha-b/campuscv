/**
 * parseSocials.ts — Links & Social Profiles Parser
 *
 * Implements deterministic classification of online profile links and portfolios:
 * - github.com/user -> social.github
 * - linkedin.com/in/user -> social.linkedin
 * - behance.net/user -> social.behance
 * - dribbble.com/user -> social.dribbble
 * - twitter.com/user or x.com/user -> social.twitter
 * - Personal portfolio websites -> social.portfolio
 */

import { SocialLinks } from '../../types/canonicalProfile';
import { validateUrl } from '../validate/validateFields';

export function parseSocialsSection(rawText: string): SocialLinks {
  const social: SocialLinks = {
    github: '',
    linkedin: '',
    portfolio: '',
    behance: '',
    dribbble: '',
    twitter: '',
    otherLinks: []
  };

  if (!rawText) return social;

  // 1. LinkedIn
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|company)\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    social.linkedin = validateUrl(linkedinMatch[0]);
  }

  // 2. GitHub (user profile, avoiding repo links when user link exists)
  const userGithub = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)(?!\/[a-zA-Z0-9_-]+)/i);
  if (userGithub) {
    social.github = validateUrl(userGithub[0]);
  } else {
    const anyGithub = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (anyGithub) social.github = validateUrl(anyGithub[0]);
  }

  // 3. Behance
  const behanceMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?behance\.net\/([a-zA-Z0-9_-]+)/i);
  if (behanceMatch) {
    social.behance = validateUrl(behanceMatch[0]);
  }

  // 4. Dribbble
  const dribbbleMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?dribbble\.com\/([a-zA-Z0-9_-]+)/i);
  if (dribbbleMatch) {
    social.dribbble = validateUrl(dribbbleMatch[0]);
  }

  // 5. Twitter / X
  const twitterMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/([a-zA-Z0-9_-]+)/i);
  if (twitterMatch) {
    social.twitter = validateUrl(twitterMatch[0]);
  }

  // 6. Portfolio / Personal website
  const urlMatches = rawText.match(/(?:https?:\/\/)(?:www\.)?[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+[^\s]*/gi);
  if (urlMatches) {
    for (const url of urlMatches) {
      if (
        !url.includes('linkedin.com') &&
        !url.includes('github.com') &&
        !url.includes('behance.net') &&
        !url.includes('dribbble.com') &&
        !url.includes('twitter.com') &&
        !url.includes('x.com') &&
        !url.includes('coursera.org') &&
        !url.includes('amazon.com') &&
        !url.includes('google.com') &&
        !social.portfolio
      ) {
        social.portfolio = validateUrl(url);
      }
    }
  }

  return social;
}
