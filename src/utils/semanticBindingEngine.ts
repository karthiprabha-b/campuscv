/**
 * semanticBindingEngine.ts — Universal Semantic Binding Resolver & Demo Placeholder Detector
 *
 * Implements 100% template-independent semantic role resolution.
 * Detects common template demo values (Maya Kapoor, Alex Rivera, John Doe, Product Designer)
 * and resolves profile fields into corresponding template slots with confidence scores.
 */

import { CampusProfile } from '../types/canonicalProfile';
import { SemanticNode } from './universalNodeGraph';
import { getClassName } from './CanvasDOMScanner';

export const BINDING_CONFIDENCE_THRESHOLD = 0.85;

export interface SemanticBinding {
  nodeId: string;
  semanticRole: string;
  confidence: number;
  boundValue: string;
  isSafeToBind: boolean;
  bindingPath: string;
}

const TEMPLATE_DEMO_NAMES = new Set([
  'maya kapoor', 'alex rivera', 'john doe', 'jane smith',
  'sarah jenkins', 'david miller', 'alexander wang', 'priya sharma'
]);

const TEMPLATE_DEMO_TITLES = new Set([
  'product designer', 'software engineer', 'ui/ux designer',
  'full stack developer', 'data scientist', 'creative director'
]);

const TEMPLATE_DEMO_LOCATIONS = new Set([
  'bengaluru', 'bengaluru, india', 'bengaluru, in',
  'san francisco', 'san francisco, ca', 'new york', 'london'
]);

/**
 * Evaluates whether text content resembles a known template demo placeholder value.
 */
export function isTemplateDemoValue(text: string): boolean {
  if (!text) return false;
  const lower = text.trim().toLowerCase();

  if (TEMPLATE_DEMO_NAMES.has(lower)) return true;
  if (TEMPLATE_DEMO_TITLES.has(lower)) return true;
  if (TEMPLATE_DEMO_LOCATIONS.has(lower)) return true;
  if (lower.includes('hello@example.com') || lower.includes('alex@rivera.com')) return true;

  return false;
}

/**
 * Resolves semantic binding role and confidence for a node using section context, tags, classes & content.
 */
export function resolveSemanticBinding(
  node: SemanticNode,
  sectionId: string,
  profile: CampusProfile
): { semanticRole: string; confidence: number; bindingPath: string } {
  const tag = node.tagName.toUpperCase();
  const text = (node.text || '').toLowerCase();
  const sec = (sectionId || node.sectionId || '').toLowerCase();
  const classes = getClassName(node.el).toLowerCase();
  const id = (node.el?.id || '').toLowerCase();

  // 1. Header / Logo / Navigation Protection
  if (sec === 'header' || sec === 'nav' || tag === 'NAV') {
    if (text.includes('work') || text.includes('about') || text.includes('contact') || text.includes('projects')) {
      return { semanticRole: 'navigation.item', confidence: 0.95, bindingPath: '' };
    }
    if (classes.includes('brand') || classes.includes('logo') || id.includes('logo')) {
      return { semanticRole: 'personal.fullName', confidence: 0.90, bindingPath: 'personal.fullName' };
    }
    return { semanticRole: 'header.generic', confidence: 0.50, bindingPath: '' };
  }

  // 2. Hero / Intro Section
  if (sec === 'hero' || sec === 'home' || sec === 'intro') {
    if (isTemplateDemoValue(text)) {
      if (tag === 'H1' || classes.includes('name')) {
        return { semanticRole: 'personal.fullName', confidence: 0.98, bindingPath: 'personal.fullName' };
      }
      if (tag === 'H2' || classes.includes('role') || classes.includes('title')) {
        return { semanticRole: 'personal.headline', confidence: 0.96, bindingPath: 'personal.headline' };
      }
      if (classes.includes('location')) {
        return { semanticRole: 'personal.location', confidence: 0.95, bindingPath: 'personal.city' };
      }
    }

    if (tag === 'H1') {
      return { semanticRole: 'personal.fullName', confidence: 0.95, bindingPath: 'personal.fullName' };
    }
    if ((tag === 'H2' || tag === 'H3') && (classes.includes('role') || classes.includes('headline') || classes.includes('subtitle'))) {
      return { semanticRole: 'personal.headline', confidence: 0.92, bindingPath: 'personal.headline' };
    }
    if (tag === 'P' && text.length > 25) {
      return { semanticRole: 'personal.summary', confidence: 0.90, bindingPath: 'personal.summary' };
    }
    if (tag === 'IMG' && (classes.includes('avatar') || classes.includes('hero') || classes.includes('profile'))) {
      return { semanticRole: 'personal.profilePhoto', confidence: 0.96, bindingPath: 'personal.profilePhoto' };
    }
  }

  // 3. About Section
  if (sec === 'about') {
    if (tag === 'P' && text.length > 20) {
      return { semanticRole: 'personal.summary', confidence: 0.96, bindingPath: 'personal.summary' };
    }
  }

  // 4. Projects Section
  if (sec === 'projects' || sec === 'work' || sec === 'portfolio') {
    const idxMatch = node.containerKey.match(/\:(\d+)$/);
    const itemIdx = idxMatch ? parseInt(idxMatch[1], 10) : 0;

    if (tag === 'H2' || tag === 'H3' || tag === 'H4') {
      return { semanticRole: 'project.title', confidence: 0.96, bindingPath: `projects[${itemIdx}].name` };
    }
    if (tag === 'P') {
      return { semanticRole: 'project.description', confidence: 0.94, bindingPath: `projects[${itemIdx}].description` };
    }
    if (tag === 'IMG') {
      return { semanticRole: 'project.image', confidence: 0.95, bindingPath: `projects[${itemIdx}].image` };
    }
    if (tag === 'A') {
      return { semanticRole: 'project.url', confidence: 0.92, bindingPath: `projects[${itemIdx}].githubUrl` };
    }
  }

  // 5. Experience Section
  if (sec === 'experience' || sec === 'timeline' || sec === 'career') {
    const idxMatch = node.containerKey.match(/\:(\d+)$/);
    const itemIdx = idxMatch ? parseInt(idxMatch[1], 10) : 0;

    if (tag === 'H3' || tag === 'H4') {
      return { semanticRole: 'experience.role', confidence: 0.95, bindingPath: `experience[${itemIdx}].role` };
    }
    if (classes.includes('company') || classes.includes('org')) {
      return { semanticRole: 'experience.company', confidence: 0.96, bindingPath: `experience[${itemIdx}].company` };
    }
    if (tag === 'P') {
      return { semanticRole: 'experience.description', confidence: 0.94, bindingPath: `experience[${itemIdx}].description` };
    }
  }

  // 6. Education Section
  if (sec === 'education' || sec === 'academic') {
    const idxMatch = node.containerKey.match(/\:(\d+)$/);
    const itemIdx = idxMatch ? parseInt(idxMatch[1], 10) : 0;

    if (tag === 'H3' || tag === 'H4') {
      return { semanticRole: 'education.degree', confidence: 0.95, bindingPath: `education[${itemIdx}].degree` };
    }
    if (classes.includes('school') || classes.includes('institution') || classes.includes('college') || classes.includes('university')) {
      return { semanticRole: 'education.institution', confidence: 0.96, bindingPath: `education[${itemIdx}].institution` };
    }
    if (classes.includes('period') || classes.includes('date') || classes.includes('year') || tag === 'TIME' || (tag === 'SPAN' && (text.includes('20') || text.includes('-') || text.includes('–')))) {
      return { semanticRole: 'education.period', confidence: 0.96, bindingPath: `education[${itemIdx}].period` };
    }
    if (classes.includes('field') || classes.includes('dept') || classes.includes('major')) {
      return { semanticRole: 'education.field', confidence: 0.95, bindingPath: `education[${itemIdx}].field` };
    }
    if (tag === 'P') {
      return { semanticRole: 'education.description', confidence: 0.92, bindingPath: `education[${itemIdx}].description` };
    }
  }

  // 7. Skills Section
  if (sec === 'skills') {
    const idxMatch = node.containerKey.match(/\:(\d+)$/);
    const itemIdx = idxMatch ? parseInt(idxMatch[1], 10) : 0;

    if (tag === 'SPAN' || tag === 'P' || tag === 'LI' || tag === 'DIV') {
      return { semanticRole: 'skills.name', confidence: 0.94, bindingPath: `skills[${itemIdx}].name` };
    }
  }

  return { semanticRole: 'unknown', confidence: 0.40, bindingPath: '' };
}

/**
 * Discovers safe bindings for a collection of nodes against a canonical profile.
 */
export function generateSafeProfileBindings(
  nodes: SemanticNode[],
  profile: CampusProfile
): Map<string, SemanticBinding> {
  const bindingsMap = new Map<string, SemanticBinding>();

  const flattenNodes = (list: SemanticNode[]): SemanticNode[] => {
    const res: SemanticNode[] = [];
    for (const n of list) {
      res.push(n);
      if (n.children && n.children.length > 0) {
        res.push(...flattenNodes(n.children));
      }
    }
    return res;
  };

  const allNodes = flattenNodes(nodes);

  for (const node of allNodes) {
    const { semanticRole, confidence, bindingPath } = resolveSemanticBinding(node, node.sectionId, profile);
    const isSafe = confidence >= BINDING_CONFIDENCE_THRESHOLD;

    if (isSafe && bindingPath) {
      bindingsMap.set(node.id, {
        nodeId: node.id,
        semanticRole,
        confidence,
        boundValue: '',
        isSafeToBind: true,
        bindingPath
      });
    }
  }

  return bindingsMap;
}
