/**
 * ImageBindingResolver.ts — Deterministic Profile Image & Asset Binder
 *
 * Implements deterministic priority ladder for profile/hero images:
 * Priority: 1. profileImage -> 2. avatar -> 3. photo -> 4. image
 *
 * Ensures pre-render resolution (NO FLICKER), fail-safe error handling,
 * and 100% attribute/style preservation.
 */

import { UniversalCanonicalProfile } from './BindingSchema';

export interface ImageBindingResult {
  source: 'user_uploaded' | 'template_demo';
  resolvedUrl: string;
  demoFallbackUsed: boolean;
}

/**
 * Deterministically resolves the single best profile image URL from user profile data.
 */
export function resolveProfileImageUrl(
  profile: UniversalCanonicalProfile,
  templateDemoImage: string = ''
): ImageBindingResult {
  if (!profile) {
    return {
      source: 'template_demo',
      resolvedUrl: templateDemoImage,
      demoFallbackUsed: true
    };
  }

  const userCandidate =
    profile.profileImage ||
    profile.avatar ||
    profile.photo;

  if (userCandidate && typeof userCandidate === 'string' && userCandidate.trim().length > 0) {
    return {
      source: 'user_uploaded',
      resolvedUrl: userCandidate.trim(),
      demoFallbackUsed: false
    };
  }

  return {
    source: 'template_demo',
    resolvedUrl: templateDemoImage,
    demoFallbackUsed: true
  };
}

/**
 * Binds resolved profile image to an HTMLImageElement without visual flickering,
 * preserving all existing classes, wrappers, dimensions, and CSS styling.
 */
export function bindProfileImageElement(
  imgEl: HTMLImageElement,
  profile: UniversalCanonicalProfile,
  templateDemoImage?: string
): ImageBindingResult {
  const originalDemoSrc = imgEl.getAttribute('data-original-demo-src') || templateDemoImage || imgEl.src;
  if (!imgEl.hasAttribute('data-original-demo-src')) {
    imgEl.setAttribute('data-original-demo-src', originalDemoSrc);
  }

  const result = resolveProfileImageUrl(profile, originalDemoSrc);

  // Set SRC immediately to avoid rendering demo image first -> NO FLICKER
  const currentAttr = imgEl.getAttribute('src');
  const boundAttr = imgEl.getAttribute('data-bound-src');
  if (boundAttr !== result.resolvedUrl && currentAttr !== result.resolvedUrl && imgEl.src !== result.resolvedUrl) {
    imgEl.setAttribute('data-bound-src', result.resolvedUrl);
    imgEl.src = result.resolvedUrl;
  }

  // Attach onerror handler for fail-safe fallback to template demo image if user image fails to load
  imgEl.onerror = () => {
    if (originalDemoSrc && imgEl.src !== originalDemoSrc) {
      imgEl.setAttribute('data-bound-src', originalDemoSrc);
      imgEl.src = originalDemoSrc;
    }
  };

  return result;
}
