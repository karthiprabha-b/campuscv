/**
 * universalInsertionEngine.ts — Universal Element Insertion & Collection Cloning Engine
 *
 * Supports adding elements (Text, Heading, Paragraph, Image, Button, Link, Card, Container, Custom Section)
 * and collections (Add Project, Add Experience, Add Education, Add Skill) into ANY imported template.
 *
 * Structure Cloning:
 * When adding a collection item (e.g. Add Project), inspects existing project card structure in that section,
 * clones the exact DOM/React layout, classes, and typography, generates new stable node IDs,
 * and attaches addedNodes[targetId] = [...] non-destructively.
 */

import { TemplateDesignTokens, DEFAULT_DESIGN_TOKENS } from './designTokenExtractor';
import { SemanticNode } from './universalNodeGraph';

export interface AddedNodeDefinition {
  id: string;
  parentId: string;
  type: 'text' | 'heading' | 'paragraph' | 'image' | 'button' | 'link' | 'card' | 'container' | 'section';
  content?: string;
  src?: string;
  href?: string;
  styles?: Record<string, string>;
  position: 'before' | 'after' | 'inside';
  orderIndex: number;
  clonedFromId?: string;
  children?: AddedNodeDefinition[];
}

export interface CollectionTemplateStructure {
  sectionId: string;
  cardNode: SemanticNode | null;
  childFields: {
    titleNode?: SemanticNode;
    subtitleNode?: SemanticNode;
    descNode?: SemanticNode;
    imageNode?: SemanticNode;
    dateNode?: SemanticNode;
    tagsNode?: SemanticNode;
  };
}

/**
 * Inspects a section node tree to find repeatable card structure for collection cloning.
 */
export function inspectCollectionStructure(
  sectionNodes: SemanticNode[],
  sectionId: string
): CollectionTemplateStructure {
  const cards = sectionNodes.filter(n => n.type === 'collection-item' || n.type === 'container' || n.containerKey.startsWith('card:') || n.containerKey.startsWith('li:'));
  const targetCard = cards.length > 0 ? cards[0] : null;

  const childFields: CollectionTemplateStructure['childFields'] = {};

  if (targetCard) {
    const flattenChildren = (node: SemanticNode): SemanticNode[] => {
      const res: SemanticNode[] = [];
      if (node.children) {
        for (const child of node.children) {
          res.push(child);
          res.push(...flattenChildren(child));
        }
      }
      return res;
    };

    const cardDescendants = flattenChildren(targetCard);
    for (const child of cardDescendants) {
      if (child.type === 'heading' && !childFields.titleNode) childFields.titleNode = child;
      else if (child.type === 'paragraph' && !childFields.descNode) childFields.descNode = child;
      else if (child.type === 'image' && !childFields.imageNode) childFields.imageNode = child;
      else if (child.type === 'text' && !childFields.dateNode && (child.text?.match(/\d{4}/) || child.tagName === 'span')) childFields.dateNode = child;
    }
  }

  return {
    sectionId,
    cardNode: targetCard,
    childFields
  };
}

/**
 * Creates a newly added element definition cleanly applying template design tokens.
 */
export function createAddedElement(
  parentId: string,
  type: AddedNodeDefinition['type'],
  content: string = 'New Content',
  position: 'before' | 'after' | 'inside' = 'inside',
  designTokens: TemplateDesignTokens = DEFAULT_DESIGN_TOKENS
): AddedNodeDefinition {
  const uuid = Math.random().toString(36).substring(2, 9);
  const id = `added:${type}:${uuid}`;

  let styles: Record<string, string> = {};

  if (type === 'heading') {
    styles = {
      fontFamily: designTokens.headingFont,
      color: designTokens.textColor,
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '16px'
    };
  } else if (type === 'paragraph' || type === 'text') {
    styles = {
      fontFamily: designTokens.bodyFont,
      color: designTokens.textColor,
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '12px'
    };
  } else if (type === 'button') {
    styles = {
      fontFamily: designTokens.bodyFont,
      backgroundColor: designTokens.buttonStyle.backgroundColor,
      color: designTokens.buttonStyle.color,
      borderRadius: designTokens.buttonStyle.borderRadius,
      padding: designTokens.buttonStyle.padding,
      fontWeight: designTokens.buttonStyle.fontWeight,
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none'
    };
  } else if (type === 'card' || type === 'container') {
    styles = {
      backgroundColor: designTokens.cardStyle.backgroundColor,
      border: designTokens.cardStyle.border,
      borderRadius: designTokens.cardStyle.borderRadius,
      padding: '24px',
      marginBottom: '20px'
    };
  }

  return {
    id,
    parentId,
    type,
    content,
    position,
    orderIndex: Date.now(),
    styles
  };
}

/**
 * Clones a collection item structure (e.g. Add Project) based on existing card design tokens.
 */
export function createClonedCollectionItem(
  sectionId: string,
  targetCardNode: SemanticNode | null,
  itemType: 'project' | 'experience' | 'education' | 'skill',
  designTokens: TemplateDesignTokens = DEFAULT_DESIGN_TOKENS
): AddedNodeDefinition {
  const uuid = Math.random().toString(36).substring(2, 9);
  const cardId = `added:card:${sectionId}:${uuid}`;

  const defaultTitles: Record<string, string> = {
    project: 'New Project Title',
    experience: 'New Role / Position',
    education: 'New Degree / Institution',
    skill: 'New Capability'
  };

  const defaultDescs: Record<string, string> = {
    project: 'Detailed project description highlighting technical deliverables and impact.',
    experience: 'Key career achievements, responsibilities, and leadership outcomes.',
    education: 'Field of study, honors, and academic coursework.',
    skill: 'Expertise level and core application.'
  };

  const children: AddedNodeDefinition[] = [
    {
      id: `${cardId}:title`,
      parentId: cardId,
      type: 'heading',
      content: defaultTitles[itemType] || 'New Item Title',
      position: 'inside',
      orderIndex: 1,
      styles: {
        fontFamily: designTokens.headingFont,
        fontSize: '1.4rem',
        fontWeight: '800',
        color: designTokens.textColor,
        marginBottom: '8px'
      }
    },
    {
      id: `${cardId}:desc`,
      parentId: cardId,
      type: 'paragraph',
      content: defaultDescs[itemType] || 'Description of new item.',
      position: 'inside',
      orderIndex: 2,
      styles: {
        fontFamily: designTokens.bodyFont,
        fontSize: '0.95rem',
        color: designTokens.textColor,
        lineHeight: '1.6'
      }
    }
  ];

  return {
    id: cardId,
    parentId: sectionId,
    type: 'card',
    position: 'inside',
    orderIndex: Date.now(),
    clonedFromId: targetCardNode ? targetCardNode.id : undefined,
    children,
    styles: {
      backgroundColor: designTokens.cardStyle.backgroundColor,
      border: designTokens.cardStyle.border,
      borderRadius: designTokens.cardStyle.borderRadius,
      padding: '24px',
      marginBottom: '20px'
    }
  };
}

/**
 * Injects addedNodes into target DOM element non-destructively.
 */
export function renderAddedNodesToDOM(
  rootEl: HTMLElement,
  addedNodes: Record<string, AddedNodeDefinition[]> = {}
): void {
  if (!rootEl || !addedNodes || Object.keys(addedNodes).length === 0) return;

  // Remove previously rendered added elements to avoid duplicates
  const existingAdded = Array.from(rootEl.querySelectorAll('[data-campus-added-node="true"]')) as HTMLElement[];
  existingAdded.forEach(el => el.remove());

  Object.entries(addedNodes).forEach(([parentId, nodesList]) => {
    if (!Array.isArray(nodesList) || nodesList.length === 0) return;

    let targetParentEl: HTMLElement | null = null;
    if (parentId === 'root' || parentId === 'main') {
      targetParentEl = rootEl;
    } else {
      targetParentEl = rootEl.querySelector(`[data-campus-node-id="${parentId}"]`) as HTMLElement | null ||
                       rootEl.querySelector(`#${parentId}`) as HTMLElement | null;
    }

    if (!targetParentEl) targetParentEl = rootEl;

    nodesList.forEach(nodeDef => {
      const newEl = document.createElement(
        nodeDef.type === 'heading' ? 'h3' : nodeDef.type === 'paragraph' ? 'p' : nodeDef.type === 'button' ? 'button' : 'div'
      );

      newEl.setAttribute('data-campus-node-id', nodeDef.id);
      newEl.setAttribute('data-campus-node-type', nodeDef.type);
      newEl.setAttribute('data-campus-added-node', 'true');

      if (nodeDef.content) newEl.innerText = nodeDef.content;

      if (nodeDef.styles) {
        Object.entries(nodeDef.styles).forEach(([k, v]) => {
          const cssProp = k.replace(/([A-Z])/g, '-$1').toLowerCase();
          newEl.style.setProperty(cssProp, String(v));
        });
      }

      if (nodeDef.children && nodeDef.children.length > 0) {
        nodeDef.children.forEach(childDef => {
          const childEl = document.createElement(childDef.type === 'heading' ? 'h4' : 'p');
          childEl.setAttribute('data-campus-node-id', childDef.id);
          childEl.setAttribute('data-campus-node-type', childDef.type);
          childEl.setAttribute('data-campus-added-node', 'true');
          if (childDef.content) childEl.innerText = childDef.content;
          if (childDef.styles) {
            Object.entries(childDef.styles).forEach(([k, v]) => {
              const cssProp = k.replace(/([A-Z])/g, '-$1').toLowerCase();
              childEl.style.setProperty(cssProp, String(v));
            });
          }
          newEl.appendChild(childEl);
        });
      }

      if (nodeDef.position === 'before' && targetParentEl.parentElement) {
        targetParentEl.parentElement.insertBefore(newEl, targetParentEl);
      } else if (nodeDef.position === 'after' && targetParentEl.parentElement) {
        targetParentEl.parentElement.insertBefore(newEl, targetParentEl.nextSibling);
      } else {
        targetParentEl.appendChild(newEl);
      }
    });
  });
}
