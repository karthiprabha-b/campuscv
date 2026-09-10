/**
 * responsiveRules.ts — Centralized Preview Device Availability Rules
 *
 * Enforces authoritative rules mapping physical editor workspace width
 * to allowed preview canvas devices:
 *   - Desktop (>= 1024px) -> ['desktop', 'tablet', 'mobile']
 *   - Tablet (768px - 1023px) -> ['tablet', 'mobile']
 *   - Mobile (< 768px) -> ['mobile']
 */

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export function getAvailablePreviewDevices(editorWidth: number): PreviewDevice[] {
  if (editorWidth >= 1024) {
    return ['desktop', 'tablet', 'mobile'];
  }
  if (editorWidth >= 768) {
    return ['tablet', 'mobile'];
  }
  return ['mobile'];
}

export function sanitizePreviewDevice(
  currentDevice: PreviewDevice,
  editorWidth: number
): PreviewDevice {
  const available = getAvailablePreviewDevices(editorWidth);
  if (!available.includes(currentDevice)) {
    return available[0];
  }
  return currentDevice;
}
