/**
 * parseCertifications.ts — Robust Certifications Section Parser
 *
 * Handles bulleted items, single-line certificates, multi-line blocks, and various issuer formats.
 */

import { CertificationEntry } from '../../types/canonicalProfile';

export function parseCertificationsSection(sectionText: string): CertificationEntry[] {
  if (!sectionText) return [];

  const rawLines = sectionText
    .split('\n')
    .map(s => s.trim())
    .filter(l => Boolean(l) && !/^(?:Certifications?|Certificates?|Licenses?|Courses?|Credentials?|Awards?)$/i.test(l));

  if (rawLines.length === 0) return [];

  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  rawLines.forEach(line => {
    const isBullet = /^[•●▪◦·*–—\-]\s+/.test(line) || /^\d+\.\s+/.test(line);
    const isUrl = /^https?:\/\//i.test(line) || /^Credential\s*:/i.test(line) || /^Certificate\s*URL\s*:/i.test(line);
    const isPureDateLine = /^(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?\d{4}(?:\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:\d{4}|Present|Current))?$/i.test(line);

    if ((isUrl || isPureDateLine) && currentBlock.length > 0) {
      currentBlock.push(line);
      return;
    }

    if (isBullet) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = [line];
    } else {
      // If line contains a year and currentBlock is already multi-line, start a new block
      const hasYear = /\b(20\d{2}|19\d{2})\b/.test(line);
      if (hasYear && currentBlock.length >= 2) {
        blocks.push(currentBlock);
        currentBlock = [line];
      } else if (currentBlock.length === 0) {
        currentBlock = [line];
      } else if (currentBlock.length >= 3) {
        blocks.push(currentBlock);
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  const entries: CertificationEntry[] = [];

  blocks.forEach((blockLines, idx) => {
    if (blockLines.length === 0) return;

    const blockStr = blockLines.join('\n');
    let title = blockLines[0].replace(/^[•●▪◦·*–—\-]\s*/, '').replace(/^\d+\.\s*/, '').trim();

    let organization = '';
    let issueDate = '';
    let credentialUrl = '';
    let grade = '';

    // Date extraction
    const dateMatch = blockStr.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*20\d{2}|19\d{2})\s*[-–—to]*\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*20\d{2}|19\d{2}|Present|Current)?\b/i) || blockStr.match(/\b(20\d{2}|19\d{2})\b/);
    if (dateMatch) {
      issueDate = dateMatch[0].trim();
    }

    const gradeMatch = blockStr.match(/Grade\s*:\s*([^\n]+)/i);
    if (gradeMatch) {
      grade = gradeMatch[1].trim();
    }

    const urlMatch = blockStr.match(/(?:https?:\/\/)[^\s]+/i);
    if (urlMatch) {
      credentialUrl = urlMatch[0];
    }

    // Organization extraction patterns: "Course Name - Organization", "Course Name | Organization", "Course Name by Organization"
    if (/\s+[-–—|]\s+/.test(title) && !organization) {
      const parts = title.split(/\s+[-–—|]\s+/).map(p => p.trim());
      if (parts.length >= 2) {
        title = parts[0];
        organization = parts[1].replace(/\s*\(\d{4}\)$/, '').trim();
      }
    } else if (/\s+by\s+/i.test(title) && !organization) {
      const parts = title.split(/\s+by\s+/i).map(p => p.trim());
      if (parts.length >= 2) {
        title = parts[0];
        organization = parts[1].replace(/\s*\(\d{4}\)$/, '').trim();
      }
    } else if (/\s+from\s+/i.test(title) && !organization) {
      const parts = title.split(/\s+from\s+/i).map(p => p.trim());
      if (parts.length >= 2) {
        title = parts[0];
        organization = parts[1].replace(/\s*\(\d{4}\)$/, '').trim();
      }
    }

    if (!organization) {
      blockLines.forEach(l => {
        if (l === title || l.startsWith(title)) return;
        if (/Grade\s*:/i.test(l)) return;
        if (/^https?:\/\//i.test(l)) return;

        if (/Coursera|Udemy|edX|NPTEL|DeepLearning\.AI|Oracle|Cisco|Meta|Google|Microsoft|AWS|Amazon|IBM|HackerRank|freeCodeCamp|LinkedIn|Simplilearn|Great Learning|Stanford|Harvard|MIT|University|College|Institute|Academy/i.test(l) && !organization) {
          organization = l.replace(/^[•●▪◦·*–—\-]\s*/, '').trim();
        }
      });
    }

    if (!organization && blockLines.length > 1) {
      const candidateOrg = blockLines[1].replace(/^[•●▪◦·*–—\-]\s*/, '').trim();
      if (!candidateOrg.startsWith('http') && !candidateOrg.startsWith('Grade')) {
        organization = candidateOrg;
      }
    }

    // Strip date suffix from title if present (e.g., "Python for Everybody (2023)")
    title = title.replace(/\s*\((?:19|20)\d{2}\)$/, '').trim();

    if (title && title.length >= 2) {
      entries.push({
        id: `cert-${Date.now()}-${idx + 1}`,
        name: title,
        organization: organization || 'Certified',
        issueDate: issueDate || '',
        credentialId: grade ? `Grade: ${grade}` : '',
        credentialUrl: credentialUrl || ''
      });
    }
  });

  return entries;
}
