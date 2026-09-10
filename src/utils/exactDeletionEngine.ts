/**
 * exactDeletionEngine.ts — Safe Exact Node Deletion Commands
 *
 * Enforces precise deletion rules:
 * - deleteNode(nodeId): Deletes ONLY the target node (e.g. project title, image)
 * - deleteContainer(containerId): Deletes container/card
 * - deleteSection(sectionId): Deletes section
 *
 * Never infers container/section deletion when a user selects a leaf text node!
 */

export interface DeletionCommandResult {
  deletedNodes: Record<string, boolean>;
  affectedNodeIds: string[];
  deletedType: 'node' | 'container' | 'section';
}

/**
 * Deletes ONLY the target leaf node by setting deletedNodes[nodeId] = true.
 */
export function deleteNode(
  nodeId: string,
  existingDeletedNodes: Record<string, boolean> = {}
): DeletionCommandResult {
  if (!nodeId) {
    return { deletedNodes: { ...existingDeletedNodes }, affectedNodeIds: [], deletedType: 'node' };
  }

  const nextDeleted = { ...existingDeletedNodes, [nodeId]: true };
  return {
    deletedNodes: nextDeleted,
    affectedNodeIds: [nodeId],
    deletedType: 'node'
  };
}

/**
 * Deletes a container/card node and its child node IDs.
 */
export function deleteContainer(
  containerId: string,
  childNodeIds: string[] = [],
  existingDeletedNodes: Record<string, boolean> = {}
): DeletionCommandResult {
  if (!containerId) {
    return { deletedNodes: { ...existingDeletedNodes }, affectedNodeIds: [], deletedType: 'container' };
  }

  const affected = [containerId, ...childNodeIds];
  const nextDeleted = { ...existingDeletedNodes };
  affected.forEach(id => {
    nextDeleted[id] = true;
  });

  return {
    deletedNodes: nextDeleted,
    affectedNodeIds: affected,
    deletedType: 'container'
  };
}

/**
 * Deletes an entire section by section ID.
 */
export function deleteSection(
  sectionId: string,
  sectionNodeIds: string[] = [],
  existingDeletedNodes: Record<string, boolean> = {}
): DeletionCommandResult {
  if (!sectionId) {
    return { deletedNodes: { ...existingDeletedNodes }, affectedNodeIds: [], deletedType: 'section' };
  }

  const affected = [sectionId, ...sectionNodeIds];
  const nextDeleted = { ...existingDeletedNodes };
  affected.forEach(id => {
    nextDeleted[id] = true;
  });

  return {
    deletedNodes: nextDeleted,
    affectedNodeIds: affected,
    deletedType: 'section'
  };
}

/**
 * Restores (undoes deletion of) a target node or array of node IDs.
 */
export function restoreNode(
  nodeIds: string | string[],
  existingDeletedNodes: Record<string, boolean> = {}
): Record<string, boolean> {
  const nextDeleted = { ...existingDeletedNodes };
  const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
  ids.forEach(id => {
    delete nextDeleted[id];
  });
  return nextDeleted;
}
