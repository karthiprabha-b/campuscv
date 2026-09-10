/**
 * parseEducation.ts — Education Section Parser
 *
 * Scoped strictly to the EDUCATION section:
 * - Separates: institution, degree, fieldOfStudy, dates, gpa, location, description
 * - If GPA is not present, leaves gpa = "" (never invents)
 * - Returns [] if no education section exists
 */

import { EducationEntry } from '../../types/canonicalProfile';

const DEGREE_REGEX = /\b(?:Bachelor|Master|B\.E|B\.Tech|M\.E|M\.Tech|B\.S|M\.S|B\.A|M\.A|Ph\.D|PhD|Doctorate|Diploma|BSc|MSc|B\.Des|M\.Des|BBA|MBA|BCA|MCA|B\.Com|M\.Com|High School|Secondary School|Higher Secondary|HSC|SSLC|Degree|B\.S\.|M\.S\.|B\.E\.|B\.Tech\.|Associate)\b/i;

const INSTITUTION_REGEX = /\b(?:University|College|Institute|School|Academy|Polytechnic|Faculty|Campus|Stanford|Harvard|Berkeley|MIT|IIT|NIT|BITS|PRIST|P\.R\.|Anna|COEP|NID|VNR|SRM|VIT|PSG|IIIT|IIM|Christ|Amrita|Manipal)\b/i;

const DATE_RANGE_REGEX = /\b((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}\/\d{4})?\s*20\d{2}|19\d{2})\s*[-–—to]+\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}\/\d{4})?\s*20\d{2}|19\d{2}|Present|Current)\b/i;

const FIELD_REGEX = /\b(?:Artificial Intelligence|Data Science|Computer Science|Engineering|Information Technology|Mechanical|Electrical|Civil|Electronics|Communication|Mechatronics|Biotechnology|Design|Industrial Design|Communication Design|Physics|Mathematics|Chemistry|Business|Commerce|Management|Cybersecurity|Cloud Computing|Robotics|Software Engineering|Web Development|Full Stack|Automobile|Aerospace|Biomedical|Chemical)\b/i;

export function parseEducationSection(sectionText: string): EducationEntry[] {
  if (!sectionText || !sectionText.trim()) return [];

  const rawLines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  // Group lines into discrete education entry blocks
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isInst = INSTITUTION_REGEX.test(line);
    const isDeg = DEGREE_REGEX.test(line) && !line.includes('Relevant Coursework');
    const isNewInstitutionHeader = (isInst || isDeg) && !/CGPA|GPA|Score|Grade|Percentage/i.test(line);

    const currentHasInstOrDeg = currentBlock.some(l => INSTITUTION_REGEX.test(l) || DEGREE_REGEX.test(l));
    const currentHasDatesOrDetails = currentBlock.some(l => 
      DATE_RANGE_REGEX.test(l) || /\b(20\d{2}|19\d{2})\b/.test(l) || /CGPA|GPA|Score|Grade|Percentage/i.test(l)
    );

    if (isNewInstitutionHeader && currentHasInstOrDeg && currentHasDatesOrDetails && currentBlock.length >= 2) {
      blocks.push(currentBlock);
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  const entries: EducationEntry[] = [];

  blocks.forEach((blockLines, idx) => {
    const blockStr = blockLines.join('\n');

    let institution = '';
    let degree = '';
    let specialization = '';
    let startYear = '';
    let endYear = '';
    let cgpa = '';
    const otherDetails: string[] = [];

    // 1. Date range extraction
    const dateMatch = blockStr.match(DATE_RANGE_REGEX);
    if (dateMatch) {
      startYear = dateMatch[1].trim();
      endYear = dateMatch[2].trim();
    } else {
      const yearMatches = blockStr.match(/\b(20\d{2}|19\d{2})\b/g);
      if (yearMatches && yearMatches.length >= 1) startYear = yearMatches[0];
      if (yearMatches && yearMatches.length >= 2) endYear = yearMatches[1];
    }

    // 2. Explicit GPA extraction
    const cgpaMatch = blockStr.match(/\b(?:CGPA|GPA|Score|Percentage|Grade)\s*:?\s*(\d(?:\.\d{1,2})?\s*\/\s*\d+|\d\.\d{1,2}|\d{2,3}%|[A-O]\+?)\b/i);
    if (cgpaMatch) {
      cgpa = cgpaMatch[1];
    }

    // 3. Line by line classification
    blockLines.forEach(l => {
      if (DATE_RANGE_REGEX.test(l) && l.replace(DATE_RANGE_REGEX, '').trim().length < 3) return;
      if (/^(?:CGPA|GPA|Score|Percentage|Grade)\s*:/i.test(l)) return;

      // Degree and Specialization delimiter check
      if (DEGREE_REGEX.test(l) && !degree) {
        if (/[-–—|]|\s+in\s+/i.test(l)) {
          const parts = l.split(/[-–—|]|\s+in\s+/i).map(p => p.trim()).filter(Boolean);
          if (DEGREE_REGEX.test(parts[0])) {
            degree = parts[0];
            if (parts.length > 1 && !specialization) {
              specialization = parts.slice(1).join(' ').trim();
            }
          } else {
            degree = l;
          }
        } else {
          degree = l;
        }
      }
      // Institution
      else if (INSTITUTION_REGEX.test(l) && !institution) {
        institution = l;
      }
      // Field of study
      else if (FIELD_REGEX.test(l) && !specialization) {
        specialization = l;
      }
      else if (!l.includes(institution) && !l.includes(degree)) {
        otherDetails.push(l);
      }
    });

    // Fallbacks if unresolved
    if (!institution && blockLines.length > 0) {
      institution = blockLines[0];
    }
    if (!degree && blockLines.length > 1 && blockLines[1] !== institution) {
      degree = blockLines[1];
    }

    // Clean up dates from institution/degree strings
    if (institution) institution = institution.replace(DATE_RANGE_REGEX, '').replace(/\b(20\d{2}|19\d{2})\b/g, '').trim();
    if (degree) degree = degree.replace(DATE_RANGE_REGEX, '').replace(/\b(20\d{2}|19\d{2})\b/g, '').trim();

    if (institution || degree) {
      entries.push({
        id: `edu-${Date.now()}-${idx + 1}`,
        institution: institution || 'Institution',
        degree: degree || 'Degree / Qualification',
        department: specialization,
        specialization,
        startYear,
        endYear,
        cgpa,
        description: otherDetails.join(' ')
      });
    }
  });

  return entries;
}
