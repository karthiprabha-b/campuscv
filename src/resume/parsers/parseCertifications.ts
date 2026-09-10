/**
 * parseCertifications.ts — Robust Certifications Section Parser
 *
 * Handles both multi-line certification blocks and single-line certification records.
 */

import { CertificationEntry } from '../../types/canonicalProfile';

export function parseCertificationsSection(sectionText: string): CertificationEntry[] {
  if (!sectionText) return [];

  const rawLines = sectionText
    .split('\n')
    .map(s => s.trim())
    .filter(l => Boolean(l) && !/^(Certifications|Certificates|Licenses|Courses)$/i.test(l));

  if (rawLines.length === 0) return [];

  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  rawLines.forEach(line => {
    const isUrl = /^https?:\/\//i.test(line) || /^Credential\s*:/i.test(line);
    const isPureDateLine = /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}\s*[-–—to]*/i.test(line) && line.length < 30;

    if ((isUrl || isPureDateLine) && currentBlock.length > 0) {
      currentBlock.push(line);
      return;
    }

    const isSingleLineCertWithYear = /\b(20\d{2}|19\d{2})\b/.test(line)
      && line.length >= 15
      && !/Grade\s*:/i.test(line)
      && !isPureDateLine;

    if (isSingleLineCertWithYear) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  const entries: CertificationEntry[] = [];

  blocks.forEach((blockLines, idx) => {
    if (blockLines.length === 0) return;

    const blockStr = blockLines.join('\n');
    let title = blockLines[0].replace(/^[•●▪◦·*–—\-]\s*/, '').trim();

    let organization = '';
    let issueDate = '';
    let credentialUrl = '';
    let grade = '';

    const dateMatch = blockStr.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*20\d{2}|19\d{2})\s*[-–—to]*\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*20\d{2}|19\d{2}|Present|Current)?\b/i);
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

    // Organization extraction
    if (/[-–—|]/.test(title) && !organization) {
      const parts = title.split(/[-–—|]/).map(p => p.trim());
      if (parts.length >= 2) {
        title = parts[0];
        organization = parts[1].replace(/\s*\(\d{4}\)$/, '').trim();
      }
    }

    if (!organization) {
      blockLines.forEach(l => {
        if (l === title) return;
        if (/\b(20\d{2}|19\d{2})\b/.test(l) && !l.includes('College') && !l.includes('CSC')) return;
        if (/Grade\s*:/i.test(l)) return;

        if (/CSC|Computer Software College|University|Institute|School|Coursera|Udemy|edX|NPTEL|DeepLearning\.AI|Oracle|Cisco|Meta|Google|Microsoft|AWS|Amazon Web Services/i.test(l) && !organization) {
          organization = l;
        }
      });
    }

    if (!organization && blockLines.length > 1) {
      organization = blockLines[1];
    }

    if (title && title.length >= 3) {
      entries.push({
        id: `cert-${Date.now()}-${idx + 1}`,
        name: title,
        organization: organization || 'Issuing Organization',
        issueDate,
        credentialId: grade ? `Grade: ${grade}` : '',
        credentialUrl
      });
    }
  });

  return entries;
}
