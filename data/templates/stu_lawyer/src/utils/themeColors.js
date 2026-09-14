/**
 * themeColors.js — Color computation utility for Executive Lawyer template
 */

export function getThemeColors(accentHex = '#C89B3C') {
  let hex = String(accentHex || '#C89B3C').trim().replace('#', '');
  if (hex.toLowerCase() === 'transparent' || hex.toLowerCase() === 'none' || !hex) {
    hex = 'C89B3C';
  }
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) {
    hex = 'C89B3C';
  }
  const r = parseInt(hex.substring(0, 2), 16) || 200;
  const g = parseInt(hex.substring(2, 4), 16) || 155;
  const b = parseInt(hex.substring(4, 6), 16) || 60;

  // Darker shade (-20%)
  const dr = Math.max(0, Math.floor(r * 0.8));
  const dg = Math.max(0, Math.floor(g * 0.8));
  const db = Math.max(0, Math.floor(b * 0.8));
  const darkHex = `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;

  // Lighter shade (+25%)
  const lr = Math.min(255, Math.floor(r + (255 - r) * 0.25));
  const lg = Math.min(255, Math.floor(g + (255 - g) * 0.25));
  const lb = Math.min(255, Math.floor(b + (255 - b) * 0.25));
  const lightHex = `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;

  // Contrast foreground
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  const contrastForeground = yiq >= 150 ? '#0B0F19' : '#FFFFFF';

  return {
    accent: `#${hex}`,
    accentRgb: `${r}, ${g}, ${b}`,
    accentDark: darkHex,
    accentLight: lightHex,
    contrastForeground
  };
}
