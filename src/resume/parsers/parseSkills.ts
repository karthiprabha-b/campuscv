/**
 * parseSkills.ts — Skills Section Parser & Normalizer
 *
 * Scoped strictly to the SKILLS / TECHNICAL SKILLS / TECHNOLOGIES section:
 * - Extracts ONLY valid technology names and tools
 * - Rejects sentences, URLs, dates, names, section headings, or arbitrary words
 * - Normalizes and deduplicates skills
 * - Returns [] if no skills section exists
 */

import { SkillEntry } from '../../types/canonicalProfile';

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface StructuredSkillsResult {
  categories: SkillCategory[];
  allSkills: string[];
  entries: SkillEntry[];
}

const SKILL_NORMALIZATION_MAP: Record<string, string> = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'next js': 'Next.js',
  'next.js': 'Next.js',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'react native': 'React Native',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'py': 'Python',
  'python': 'Python',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'express': 'Express',
  'expressjs': 'Express',
  'express.js': 'Express',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'aws': 'AWS',
  'gcp': 'GCP',
  'azure': 'Azure',
  'docker': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'git': 'Git',
  'github': 'GitHub',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'sqlite': 'SQLite',
  'redis': 'Redis',
  'graphql': 'GraphQL',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'rest apis': 'REST APIs',
  'restful apis': 'REST APIs',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'figma': 'Figma',
  'linux': 'Linux',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-learn',
  'sklearn': 'Scikit-learn',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'opencv': 'OpenCV',
  'fastapi': 'FastAPI',
  'django': 'Django',
  'flask': 'Flask',
  'storybook': 'Storybook',
  'jest': 'Jest',
  'webpack': 'Webpack'
};

const INVALID_SKILL_PATTERNS = [
  /https?:\/\//i,
  /@/,
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2}|19\d{2})\b/i,
  /\b(?:University|College|Institute|School|Degree|B\.Tech|B\.E|B\.S|M\.S)\b/i,
  /\b(?:Experience|Work Experience|Employment|Projects|Education|Profile|Summary|About Me)\b/i,
  /\b(?:Developer|Engineer|Student|Manager|Infowaves|Stripe|Google|Amazon)\b/i,
  /\b(?:while|building|responsibilities|achievements|engineered|developed|implemented)\b/i
];

export function normalizeSkillName(rawName: string): string {
  const trimmed = rawName.replace(/^[\s•●▪◦·*–—\-#]+/, '').replace(/[\s,;:]+$/, '').trim();
  const lower = trimmed.toLowerCase();
  if (SKILL_NORMALIZATION_MAP[lower]) {
    return SKILL_NORMALIZATION_MAP[lower];
  }
  return trimmed;
}

export function parseSkillsSection(sectionText: string): SkillEntry[] {
  const structured = parseStructuredSkills(sectionText);
  return structured.entries;
}

export function parseStructuredSkills(sectionText: string): StructuredSkillsResult {
  if (!sectionText || !sectionText.trim()) {
    return { categories: [], allSkills: [], entries: [] };
  }

  const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  const categories: SkillCategory[] = [];
  const seenLower = new Set<string>();
  const allSkills: string[] = [];
  const entries: SkillEntry[] = [];

  lines.forEach((line) => {
    let categoryName = 'Technical';
    let rawSkillsStr = line;

    // Check category prefix (e.g., "Languages: Python, JavaScript, Java")
    if (/:/.test(line)) {
      const parts = line.split(':');
      categoryName = parts[0].replace(/^[•●▪◦·*–—\-]\s*/, '').trim();
      rawSkillsStr = parts.slice(1).join(':').trim();
    }

    const items = rawSkillsStr
      .split(/[,|\t•;]/)
      .map(s => s.replace(/^[•●▪◦·*–—\-]\s*/, '').trim())
      .filter(Boolean);

    const categorySkills: string[] = [];

    items.forEach((rawItem) => {
      if (!rawItem || rawItem.length < 2 || rawItem.length > 35) return;

      // Reject prose, dates, URLs, and section headers
      for (const pattern of INVALID_SKILL_PATTERNS) {
        if (pattern.test(rawItem)) return;
      }

      // Reject if item contains more than 4 words
      if (rawItem.split(/\s+/).length > 4) return;

      const normalized = normalizeSkillName(rawItem);
      const lower = normalized.toLowerCase();

      if (normalized.length >= 2 && !seenLower.has(lower)) {
        seenLower.add(lower);
        allSkills.push(normalized);
        categorySkills.push(normalized);

        entries.push({
          id: `skill-${Date.now()}-${entries.length + 1}`,
          name: normalized,
          category: categoryName
        });
      }
    });

    if (categorySkills.length > 0) {
      categories.push({
        name: categoryName,
        skills: categorySkills
      });
    }
  });

  return {
    categories,
    allSkills,
    entries
  };
}
