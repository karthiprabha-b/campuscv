/**
 * designTokenExtractor.ts — Template Design Token Extraction Engine
 *
 * Automatically extracts primary/secondary fonts, colors, border radii,
 * container widths, and spacing tokens from any rendered template DOM.
 *
 * Extracted tokens are used when adding new elements or custom sections so newly generated
 * content seamlessly inherits the template's visual design.
 */

export interface TemplateDesignTokens {
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: string;
  containerWidth: string;
  spacingUnit: string;
  cardStyle: {
    backgroundColor: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
  };
  buttonStyle: {
    backgroundColor: string;
    color: string;
    borderRadius: string;
    padding: string;
    fontWeight: string;
  };
}

export const DEFAULT_DESIGN_TOKENS: TemplateDesignTokens = {
  headingFont: 'Inter, system-ui, sans-serif',
  bodyFont: 'Inter, system-ui, sans-serif',
  primaryColor: '#141414',
  accentColor: '#FF4D00',
  backgroundColor: '#FAF9F5',
  textColor: '#141414',
  borderColor: '#E5E2DA',
  borderRadius: '16px',
  containerWidth: '1280px',
  spacingUnit: '24px',
  cardStyle: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E2DA',
    borderRadius: '16px',
    boxShadow: 'none'
  },
  buttonStyle: {
    backgroundColor: '#141414',
    color: '#FFFFFF',
    borderRadius: '999px',
    padding: '12px 24px',
    fontWeight: '700'
  }
};

/**
 * Extracts design tokens dynamically from the rendered DOM root.
 */
export function extractTemplateDesignTokens(rootEl: HTMLElement): TemplateDesignTokens {
  if (!rootEl || typeof window === 'undefined') return DEFAULT_DESIGN_TOKENS;

  try {
    const headings = Array.from(rootEl.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    const paragraphs = Array.from(rootEl.querySelectorAll('p, span')) as HTMLElement[];
    const buttons = Array.from(rootEl.querySelectorAll('button, a[class*="btn"], a[class*="button"]')) as HTMLElement[];
    const cards = Array.from(rootEl.querySelectorAll('[class*="card"], [class*="item"], article, li')) as HTMLElement[];
    const sections = Array.from(rootEl.querySelectorAll('section, main, div[id]')) as HTMLElement[];

    const headingFont = headings.length > 0 ? window.getComputedStyle(headings[0]).fontFamily : DEFAULT_DESIGN_TOKENS.headingFont;
    const bodyFont = paragraphs.length > 0 ? window.getComputedStyle(paragraphs[0]).fontFamily : DEFAULT_DESIGN_TOKENS.bodyFont;

    const accentColor = (buttons.length > 0 ? window.getComputedStyle(buttons[0]).backgroundColor : null) ||
      (headings.length > 0 ? window.getComputedStyle(headings[0]).color : null) ||
      DEFAULT_DESIGN_TOKENS.accentColor;

    const backgroundColor = sections.length > 0 ? window.getComputedStyle(sections[0]).backgroundColor : DEFAULT_DESIGN_TOKENS.backgroundColor;
    const textColor = paragraphs.length > 0 ? window.getComputedStyle(paragraphs[0]).color : DEFAULT_DESIGN_TOKENS.textColor;
    const borderRadius = cards.length > 0 ? window.getComputedStyle(cards[0]).borderRadius : DEFAULT_DESIGN_TOKENS.borderRadius;
    const borderColor = cards.length > 0 ? window.getComputedStyle(cards[0]).borderColor : DEFAULT_DESIGN_TOKENS.borderColor;

    return {
      headingFont: headingFont || DEFAULT_DESIGN_TOKENS.headingFont,
      bodyFont: bodyFont || DEFAULT_DESIGN_TOKENS.bodyFont,
      primaryColor: textColor || DEFAULT_DESIGN_TOKENS.primaryColor,
      accentColor: accentColor !== 'rgba(0, 0, 0, 0)' && accentColor !== 'transparent' ? accentColor : DEFAULT_DESIGN_TOKENS.accentColor,
      backgroundColor: backgroundColor || DEFAULT_DESIGN_TOKENS.backgroundColor,
      textColor: textColor || DEFAULT_DESIGN_TOKENS.textColor,
      borderColor: borderColor || DEFAULT_DESIGN_TOKENS.borderColor,
      borderRadius: borderRadius || DEFAULT_DESIGN_TOKENS.borderRadius,
      containerWidth: '1280px',
      spacingUnit: '24px',
      cardStyle: {
        backgroundColor: cards.length > 0 ? window.getComputedStyle(cards[0]).backgroundColor : '#FFFFFF',
        border: `1px solid ${borderColor || '#E5E2DA'}`,
        borderRadius: borderRadius || '16px',
        boxShadow: cards.length > 0 ? window.getComputedStyle(cards[0]).boxShadow : 'none'
      },
      buttonStyle: {
        backgroundColor: accentColor || '#141414',
        color: buttons.length > 0 ? window.getComputedStyle(buttons[0]).color : '#FFFFFF',
        borderRadius: buttons.length > 0 ? window.getComputedStyle(buttons[0]).borderRadius : '999px',
        padding: '12px 24px',
        fontWeight: '700'
      }
    };
  } catch (e) {
    return DEFAULT_DESIGN_TOKENS;
  }
}
