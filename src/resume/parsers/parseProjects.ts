/**
 * parseProjects.ts — Robust Semantic Project Section Parser
 *
 * Scoped strictly to the PROJECTS section:
 * - Extracts: id, title, description, technologies, url, github
 * - Rejects standalone technology lines or URLs from becoming projects
 * - Returns [] if no projects section exists
 */

import { ProjectEntry } from '../../types/canonicalProfile';

const KNOWN_TECH_REGEX = /\b(?:React|Next\.js|Node\.js|Python|TypeScript|JavaScript|Vue|Angular|Tailwind|Tailwind CSS|Bootstrap|PostgreSQL|MongoDB|SQLite|MySQL|Redis|Docker|AWS|GCP|Figma|Flask|Django|FastAPI|PyTorch|TensorFlow|C\+\+|C#|Unity|OpenCV|Socket\.io|Express|GraphQL|HTML5|CSS3|Git|GitHub|Storybook|OpenAI API|Typer|BeautifulSoup)\b/i;

export function parseProjectsSection(sectionText: string): ProjectEntry[] {
  if (!sectionText || !sectionText.trim()) return [];

  const rawLines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  // Step 1: Pre-process lines to repair split URLs (e.g. "https://github.com/user-\ngif/Leads")
  const lines: string[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const current = rawLines[i];
    const next = rawLines[i + 1] || '';

    if (/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+-$/i.test(current) && /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/i.test(next)) {
      lines.push(`${current}${next}`);
      i++;
    } else if (/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/$/i.test(current) && /^[a-zA-Z0-9_-]+/i.test(next)) {
      lines.push(`${current}${next}`);
      i++;
    } else if (/^GitHub:\s*https?:\/\/.*-$/i.test(current) && /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/i.test(next)) {
      lines.push(`${current}${next}`);
      i++;
    } else {
      lines.push(current);
    }
  }

  // Step 2: Group lines into project blocks by identifying true Project Title boundaries
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  const isProjectTitleCandidate = (line: string): boolean => {
    if (!line || line.length < 3 || line.length > 90) return false;

    const isBullet = /^[•●▪◦·*–—\-]\s*/.test(line);
    const isUrl = /^(?:GitHub:\s*)?https?:\/\//i.test(line) || /^github\.com\//i.test(line) || /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/i.test(line);
    const isTechLine = /^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools|Stack|Technologies used)\s*:/i.test(line);
    const isCommaTechList = /^[A-Za-z0-9.#+,\s-]{3,80}$/.test(line) && line.includes(',') && line.split(',').length >= 2;
    const isKnownTechOnly = KNOWN_TECH_REGEX.test(line) && (line.includes(',') || line.includes('|') || line.includes('•'));
    const isSectionHeader = /^(PROJECTS|KEY PROJECTS|FEATURED PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS|SELECTED PROJECTS)$/i.test(line);
    const endsWithPeriodOrComma = /[.,;]$/.test(line) && !/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})/i.test(line);
    const startsWithLowercase = /^[a-z]/.test(line);
    const isSentenceContinuation = /^(?:collect|store|manage|organizing|reducing|strengthened|data\.|and|or|with|using|in|for|of|to|a|an|the)\b/i.test(line);

    if (isBullet || isUrl || isTechLine || isCommaTechList || isKnownTechOnly || isSectionHeader || endsWithPeriodOrComma || startsWithLowercase || isSentenceContinuation) {
      return false;
    }

    return true;
  };

  lines.forEach(line => {
    if (isProjectTitleCandidate(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = [line];
    } else {
      if (currentBlock.length === 0) {
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  // Step 3: Parse each block into a ProjectEntry
  const entries: ProjectEntry[] = [];

  blocks.forEach((blockLines, idx) => {
    if (blockLines.length === 0) return;

    const blockStr = blockLines.join('\n');
    const rawTitle = blockLines[0].replace(/^[•●▪◦·*–—\-]\s*/, '').trim();

    if (/^https?:\/\//i.test(rawTitle) || /^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools)\s*:/i.test(rawTitle)) {
      return;
    }

    let name = rawTitle;
    if (name.includes('GitHub:')) {
      name = name.split('GitHub:')[0].trim();
    }

    let githubUrl = '';
    let liveUrl = '';

    const githubMatch = blockStr.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?/i);
    if (githubMatch) {
      githubUrl = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
    }

    const urlMatches = blockStr.match(/(?:https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+/gi);
    if (urlMatches) {
      for (const u of urlMatches) {
        if (!u.includes('github.com')) {
          liveUrl = u;
          break;
        }
      }
    }

    let technologies: string[] = [];
    blockLines.forEach(l => {
      if (/^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools|Stack|Technologies used)\s*:?\s*(.*)/i.test(l)) {
        const match = l.match(/^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools|Stack|Technologies used)\s*:?\s*(.*)/i);
        if (match && match[1]) {
          const parsedTech = match[1].split(/[,|\t•;]/).map(s => s.trim()).filter(Boolean);
          technologies = Array.from(new Set([...technologies, ...parsedTech]));
        }
      } else if (KNOWN_TECH_REGEX.test(l) && (l.includes(',') || l.includes('|')) && l !== name) {
        const parsedTech = l.split(/[,|\t•;]/).map(s => s.trim()).filter(Boolean);
        technologies = Array.from(new Set([...technologies, ...parsedTech]));
      }
    });

    const bullets: string[] = [];
    const descriptionParts: string[] = [];

    blockLines.slice(1).forEach(l => {
      if (/^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools|Stack)\s*:/i.test(l)) return;
      if (/^GitHub:\s*https?:\/\//i.test(l) || /^https?:\/\/github\.com/i.test(l)) return;
      if (KNOWN_TECH_REGEX.test(l) && (l.includes(',') || l.includes('|'))) return;

      const isBullet = /^[•●▪◦·*–—\-]\s*/.test(l);
      const cleaned = l.replace(/^[•●▪◦·*–—\-]\s*/, '').trim();

      if (isBullet) {
        bullets.push(cleaned);
      } else if (cleaned && !cleaned.startsWith('http')) {
        descriptionParts.push(cleaned);
      }
    });

    const fullDescription = descriptionParts.join(' ') || bullets.join(' ');

    if (name && name.length >= 3 && !/^(Projects|Personal Projects|Key Projects|Featured Projects|Academic Projects|Selected Projects)$/i.test(name)) {
      entries.push({
        id: `proj-${Date.now()}-${idx + 1}`,
        name,
        description: fullDescription,
        technologies,
        githubUrl,
        liveUrl,
        projectUrl: liveUrl || githubUrl,
        image: '',
        achievements: bullets,
        metrics: []
      });
    }
  });

  return entries;
}
