/**
 * themeTypographyPresets.ts
 * Curated theme accent colors and 25+ modern typography styles for CampusCV portfolios
 */

export interface FontPreset {
  id: string;
  name: string;
  category: 'Modern Sans' | 'Tech & Grotesk' | 'Editorial Serif' | 'Code Monospace' | 'Display & Creative';
  fontFamily: string;
  googleQuery: string;
  description: string;
}

export const THEME_COLOR_PRESETS = [
  { name: 'Violet', value: '#8b5cf6', category: 'Purple' },
  { name: 'Indigo', value: '#6366f1', category: 'Purple' },
  { name: 'Royal Blue', value: '#2563eb', category: 'Blue' },
  { name: 'Sky Blue', value: '#0284c7', category: 'Blue' },
  { name: 'Cyan', value: '#06b6d4', category: 'Blue' },
  { name: 'Teal', value: '#0d9488', category: 'Green' },
  { name: 'Emerald', value: '#10b981', category: 'Green' },
  { name: 'Lime', value: '#65a30d', category: 'Green' },
  { name: 'Amber', value: '#f59e0b', category: 'Warm' },
  { name: 'Orange', value: '#f97316', category: 'Warm' },
  { name: 'Coral', value: '#fb7185', category: 'Warm' },
  { name: 'Rose', value: '#f43f5e', category: 'Pink' },
  { name: 'Fuchsia', value: '#d946ef', category: 'Pink' },
  { name: 'Purple', value: '#9333ea', category: 'Purple' },
  { name: 'Midnight', value: '#0f172a', category: 'Dark' },
  { name: 'Charcoal', value: '#27272a', category: 'Dark' },
];

export const GOOGLE_FONT_PRESETS: FontPreset[] = [
  // ── Modern Sans ──
  {
    id: 'inter',
    name: 'Inter',
    category: 'Modern Sans',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    googleQuery: 'Inter:ital,wght@0,300..900;1,300..900',
    description: 'Clean, neutral and ultra-readable'
  },
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    category: 'Modern Sans',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleQuery: 'Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800',
    description: 'Modern, geometric and crisp product style'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Modern Sans',
    fontFamily: "'DM Sans', sans-serif",
    googleQuery: 'DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900',
    description: 'Friendly geometric sans with high legibility'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'Modern Sans',
    fontFamily: "'Outfit', sans-serif",
    googleQuery: 'Outfit:wght@300..900',
    description: 'Contemporary, confident brand typography'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Modern Sans',
    fontFamily: "'Poppins', sans-serif",
    googleQuery: 'Poppins:ital,wght@0,300..900;1,300..900',
    description: 'Rounded geometric curves and high energy'
  },
  {
    id: 'manrope',
    name: 'Manrope',
    category: 'Modern Sans',
    fontFamily: "'Manrope', sans-serif",
    googleQuery: 'Manrope:wght@300..800',
    description: 'Semi-condensed, elegant modern sans'
  },
  {
    id: 'figtree',
    name: 'Figtree',
    category: 'Modern Sans',
    fontFamily: "'Figtree', sans-serif",
    googleQuery: 'Figtree:ital,wght@0,300..900;1,300..900',
    description: 'Clean, friendly, modern UI favorite'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'Modern Sans',
    fontFamily: "'Roboto', sans-serif",
    googleQuery: 'Roboto:ital,wght@0,300..900;1,300..900',
    description: 'Universal standard and balanced proportions'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Modern Sans',
    fontFamily: "'Montserrat', sans-serif",
    googleQuery: 'Montserrat:ital,wght@0,300..900;1,300..900',
    description: 'Classic urban geometric display sans'
  },
  {
    id: 'raleway',
    name: 'Raleway',
    category: 'Modern Sans',
    fontFamily: "'Raleway', sans-serif",
    googleQuery: 'Raleway:ital,wght@0,300..900;1,300..900',
    description: 'Sophisticated headings and slender weights'
  },

  // ── Tech & Grotesk ──
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    category: 'Tech & Grotesk',
    fontFamily: "'Space Grotesk', sans-serif",
    googleQuery: 'Space+Grotesk:wght@300..700',
    description: 'Brutalist tech & neo-grotesque flair'
  },
  {
    id: 'sora',
    name: 'Sora',
    category: 'Tech & Grotesk',
    fontFamily: "'Sora', sans-serif",
    googleQuery: 'Sora:wght@300..800',
    description: 'Futuristic aesthetic tailored for web3 & AI'
  },
  {
    id: 'bricolage-grotesque',
    name: 'Bricolage Grotesque',
    category: 'Tech & Grotesk',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    googleQuery: 'Bricolage+Grotesque:opsz,wght@12..96,300..800',
    description: 'Expressive, editorial with quirky personality'
  },
  {
    id: 'epilogue',
    name: 'Epilogue',
    category: 'Tech & Grotesk',
    fontFamily: "'Epilogue', sans-serif",
    googleQuery: 'Epilogue:ital,wght@0,300..900;1,300..900',
    description: 'Solid, impactful proportions for builders'
  },
  {
    id: 'unbounded',
    name: 'Unbounded',
    category: 'Tech & Grotesk',
    fontFamily: "'Unbounded', sans-serif",
    googleQuery: 'Unbounded:wght@300..900',
    description: 'Ultra-wide, headline-stealing futuristic'
  },

  // ── Editorial Serif ──
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    category: 'Editorial Serif',
    fontFamily: "'Playfair Display', Georgia, serif",
    googleQuery: 'Playfair+Display:ital,wght@0,400..900;1,400..900',
    description: 'High-contrast luxury, high fashion editorial'
  },
  {
    id: 'instrument-serif',
    name: 'Instrument Serif',
    category: 'Editorial Serif',
    fontFamily: "'Instrument Serif', Georgia, serif",
    googleQuery: 'Instrument+Serif:ital@0;1',
    description: 'Sublime, modern magazine aesthetic'
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'Editorial Serif',
    fontFamily: "'Lora', Georgia, serif",
    googleQuery: 'Lora:ital,wght@0,400..700;1,400..700',
    description: 'Contemporary serif with warm calligraphy curves'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'Editorial Serif',
    fontFamily: "'Merriweather', serif",
    googleQuery: 'Merriweather:ital,wght@0,300..900;1,300..900',
    description: 'Highly readable on screens, pleasant bookish tone'
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    category: 'Editorial Serif',
    fontFamily: "'Cinzel', serif",
    googleQuery: 'Cinzel:wght@400..900',
    description: 'Classical Roman monument inscriptions'
  },

  // ── Code Monospace ──
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'Code Monospace',
    fontFamily: "'JetBrains Mono', monospace",
    googleQuery: 'JetBrains+Mono:ital,wght@0,300..800;1,300..800',
    description: 'Top developer monospace with code ligature charm'
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    category: 'Code Monospace',
    fontFamily: "'Space Mono', monospace",
    googleQuery: 'Space+Mono:ital,wght@0,400;0,700;1,400;1,700',
    description: 'Retro 80s sci-fi terminal & cyberpunk'
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'Code Monospace',
    fontFamily: "'Fira Code', monospace",
    googleQuery: 'Fira+Code:wght@300..700',
    description: 'Popular technical developer font'
  },

  // ── Display & Creative ──
  {
    id: 'syne',
    name: 'Syne',
    category: 'Display & Creative',
    fontFamily: "'Syne', sans-serif",
    googleQuery: 'Syne:wght@400..800',
    description: 'Avant-garde creative studio display'
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'Display & Creative',
    fontFamily: "'Caveat', cursive",
    googleQuery: 'Caveat:wght@400..700',
    description: 'Natural handwriting & playful human touch'
  }
];

export function getGoogleFontUrl(fontQueryOrName: string): string {
  if (!fontQueryOrName) return '';
  const match = GOOGLE_FONT_PRESETS.find(f => 
    f.name.toLowerCase() === fontQueryOrName.toLowerCase() ||
    f.fontFamily.toLowerCase().includes(fontQueryOrName.toLowerCase()) ||
    f.id === fontQueryOrName.toLowerCase()
  );

  const query = match ? match.googleQuery : fontQueryOrName.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
}
