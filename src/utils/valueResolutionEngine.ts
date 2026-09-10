/**
 * valueResolutionEngine.ts — Universal Content Resolution Engine
 *
 * Implements strict 3-tier value resolution hierarchy:
 *   Tier 1: userOverride (explicit manual edits saved in contentOverrides)
 *   Tier 2: profileData (imported PDF/DOCX or canonical user profile data)
 *   Tier 3: templateDefault (original template fallback copy when profile field is empty)
 *
 * Rule: User profile data MUST override template demo data (e.g. Maya Kapoor, Alex Rivera, John Doe).
 * Template demo data NEVER overwrites or contaminates the imported user profile.
 */

import { CampusProfile } from '../types/canonicalProfile';

export interface ValueResolutionResult {
  value: string;
  source: 'userOverride' | 'profileData' | 'templateDefault';
  bindingPath?: string;
}

/**
 * Safely resolves nested property paths (e.g. "personal.fullName", "projects[0].name").
 */
export function getNestedProfileValue(profile: any, path: string): any {
  if (!profile || !path) return undefined;

  // Normalize paths (e.g., "personal.name" -> "personal.fullName")
  let normalizedPath = path
    .replace(/^profile\./, '')
    .replace(/^personal\.name$/, 'personal.fullName')
    .replace(/^personal\.location$/, 'personal.city');

  // Handle array indexing: e.g. "projects[0].name"
  const parts = normalizedPath.split(/[\.\[\]]/).filter(Boolean);
  let curr = profile;

  for (const part of parts) {
    if (curr === null || curr === undefined) return undefined;
    curr = curr[part];
  }

  return curr;
}

/**
 * Resolves final content for any template node using strict priority rules.
 */
export function resolveValue(
  bindingPath: string | undefined,
  profile: CampusProfile | any,
  contentOverrides: Record<string, any> = {},
  templateDefault: string = ''
): ValueResolutionResult {
  // 1. Tier 1: User Explicit Override
  if (bindingPath && contentOverrides[bindingPath] !== undefined && contentOverrides[bindingPath] !== '') {
    return {
      value: String(contentOverrides[bindingPath]),
      source: 'userOverride',
      bindingPath
    };
  }

  // 2. Tier 2: User Profile Data
  if (bindingPath && profile) {
    const profileVal = getNestedProfileValue(profile, bindingPath);
    if (profileVal !== undefined && profileVal !== null && profileVal !== '') {
      let formattedVal = profileVal;

      if (Array.isArray(profileVal)) {
        formattedVal = profileVal.map(item => typeof item === 'object' ? item.name || item.title || item : item).join(', ');
      } else if (typeof profileVal === 'object') {
        formattedVal = profileVal.name || profileVal.title || profileVal.institution || profileVal.company || '';
      }

      if (formattedVal !== '') {
        return {
          value: String(formattedVal),
          source: 'profileData',
          bindingPath
        };
      }
    }
  }

  // 3. Tier 3: Template Default
  return {
    value: templateDefault,
    source: 'templateDefault',
    bindingPath
  };
}
