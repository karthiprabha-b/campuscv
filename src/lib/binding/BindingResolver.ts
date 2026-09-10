/**
 * BindingResolver.ts — Binding Priority & Confidence Decision Engine
 *
 * Implements strict priority resolution and confidence scoring thresholds:
 * 1. Explicit metadata (data-cv-field) -> 1.0
 * 2. Manifest binding (template.binding.json) -> 0.95-0.99
 * 3. Semantic automatic detection -> 0.90-0.95
 * 4. Known placeholder detection -> 0.90-0.95
 * 5. Low confidence -> Do NOT modify
 *
 * Thresholds:
 * >= 0.90 : Automatic binding
 * 0.70 - 0.89 : Candidate only
 * < 0.70 : Do not modify
 */

import { UniversalCanonicalProfile } from './BindingSchema';
import { DetectionResult, detectElementSemanticField } from './SemanticFieldDetector';
import { TemplateBindingManifestRecord } from './TemplateBindingManifest';

export interface ResolvedFieldBinding {
  fieldPath: string;
  boundValue: any;
  confidence: number;
  source: 'EXPLICIT' | 'MANIFEST' | 'AUTO_DETECTED' | 'DEMO_PLACEHOLDER';
  status: 'BOUND' | 'CANDIDATE_ONLY' | 'UNRESOLVED';
}

export const AUTO_BIND_THRESHOLD = 0.90;
export const CANDIDATE_THRESHOLD = 0.70;

/**
 * Resolves a field path (e.g. "name", "email", "socials.linkedin", "projects[0].title") from canonical profile.
 */
export function resolveProfileValue(fieldPath: string, profile: UniversalCanonicalProfile): any {
  if (!fieldPath || !profile) return undefined;

  const normalizedPath = fieldPath.trim();

  // Alias maps
  if (normalizedPath === 'name' || normalizedPath === 'fullName' || normalizedPath === 'hero.name' || normalizedPath === 'personal.name') return profile.name;
  if (normalizedPath === 'firstName') return profile.firstName;
  if (normalizedPath === 'lastName') return profile.lastName;
  if (
    normalizedPath === 'headline' ||
    normalizedPath === 'role' ||
    normalizedPath === 'title' ||
    normalizedPath === 'hero.role' ||
    normalizedPath === 'hero.headline' ||
    normalizedPath === 'hero.title' ||
    normalizedPath === 'personal.role' ||
    normalizedPath === 'personal.headline' ||
    normalizedPath === 'about.title' ||
    normalizedPath === 'about.heading' ||
    normalizedPath === 'about.headline'
  ) return profile.headline || profile.role;
  if (
    normalizedPath === 'bio' ||
    normalizedPath === 'about' ||
    normalizedPath === 'summary' ||
    normalizedPath === 'hero.description' ||
    normalizedPath === 'hero.subtitle' ||
    normalizedPath === 'hero.introductionText' ||
    normalizedPath === 'about.description' ||
    normalizedPath === 'about.bio' ||
    normalizedPath === 'about.text' ||
    normalizedPath === 'about.summary' ||
    normalizedPath === 'personal.summary' ||
    normalizedPath === 'personal.bio'
  ) return profile.bio || profile.about || profile.summary;
  if (normalizedPath === 'email' || normalizedPath === 'personal.email' || normalizedPath === 'contact.email') return profile.email;
  if (normalizedPath === 'phone' || normalizedPath === 'personal.phone' || normalizedPath === 'contact.phone') return profile.phone;
  if (normalizedPath === 'location' || normalizedPath === 'hero.location' || normalizedPath === 'personal.location' || normalizedPath === 'contact.location') return profile.location;
  if (normalizedPath === 'website' || normalizedPath === 'personal.website') return profile.website;
  if (
    normalizedPath === 'profileImage' ||
    normalizedPath === 'avatar' ||
    normalizedPath === 'photo' ||
    normalizedPath === 'hero.profileImage' ||
    normalizedPath === 'hero.avatarUrl' ||
    normalizedPath === 'about.avatarUrl' ||
    normalizedPath === 'about.image' ||
    normalizedPath === 'about.avatar' ||
    normalizedPath === 'about.photo' ||
    normalizedPath === 'personal.profileImage' ||
    normalizedPath === 'personal.avatarUrl' ||
    normalizedPath === 'personal.photo' ||
    normalizedPath === 'personal.profilePhoto'
  ) return profile.profileImage;
  if (normalizedPath === 'resume' || normalizedPath === 'resumeUrl') return profile.resumeUrl;

  // Socials
  if (normalizedPath.startsWith('socials.') || normalizedPath.startsWith('social.')) {
    const key = normalizedPath.split('.')[1];
    return profile.socials?.[key] || '';
  }

  // Collections
  if (normalizedPath === 'projects') return profile.projects;
  if (normalizedPath === 'experience' || normalizedPath === 'timeline') return profile.experience;
  if (normalizedPath === 'education') return profile.education;
  if (normalizedPath === 'skills') return profile.skills;
  if (normalizedPath === 'certifications') return profile.certifications;
  if (normalizedPath === 'achievements') return profile.achievements;
  if (normalizedPath === 'services') return profile.services;

  // Deep Path Traverser
  const parts = normalizedPath.split('.');
  let curr: any = profile;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return curr;
}

/**
 * Resolves optimal field binding for a DOM element according to priority ladder and confidence thresholds.
 */
export function resolveElementBinding(
  el: HTMLElement,
  profile: UniversalCanonicalProfile,
  manifest?: TemplateBindingManifestRecord | null
): ResolvedFieldBinding | null {
  const nodeId = el.getAttribute('data-node-id') || el.id || '';

  // Priority 1: Explicit Metadata
  const explicit = el.getAttribute('data-cv-field') || el.getAttribute('data-cv') || el.getAttribute('data-field') || el.getAttribute('data-editable');
  if (explicit && explicit.trim()) {
    const fieldPath = explicit.trim();
    const val = resolveProfileValue(fieldPath, profile);
    if (val !== undefined && val !== null) {
      return {
        fieldPath,
        boundValue: val,
        confidence: 1.0,
        source: 'EXPLICIT',
        status: 'BOUND'
      };
    }
  }

  // Priority 2: Manifest Binding
  if (manifest && nodeId) {
    const manifestEntry = manifest.bindings.find(b => b.target === nodeId);
    if (manifestEntry && manifestEntry.confidence >= CANDIDATE_THRESHOLD) {
      const val = resolveProfileValue(manifestEntry.field, profile);
      if (val !== undefined && val !== null) {
        const isAuto = manifestEntry.confidence >= AUTO_BIND_THRESHOLD;
        return {
          fieldPath: manifestEntry.field,
          boundValue: val,
          confidence: manifestEntry.confidence,
          source: 'MANIFEST',
          status: isAuto ? 'BOUND' : 'CANDIDATE_ONLY'
        };
      }
    }
  }

  // Priority 3 & 4: Semantic Automatic Detection & Placeholder Detection
  const semantic = detectElementSemanticField(el);
  if (semantic && semantic.field) {
    const val = resolveProfileValue(semantic.field, profile);
    if (val !== undefined && val !== null) {
      const isAuto = semantic.confidence >= AUTO_BIND_THRESHOLD;
      return {
        fieldPath: semantic.field,
        boundValue: val,
        confidence: semantic.confidence,
        source: semantic.source,
        status: isAuto ? 'BOUND' : 'CANDIDATE_ONLY'
      };
    }
  }

  return null;
}
