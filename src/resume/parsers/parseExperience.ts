/**
 * parseExperience.ts — Work Experience Section Parser
 *
 * Scoped strictly to the EXPERIENCE / WORK EXPERIENCE section:
 * - Extracts: jobTitle, company, location, startDate, endDate, current, description, technologies
 * - Rejects non-employment lines like "TECHNICAL SKILLS" or standalone project titles
 * - Associates inline technology lists with the experience entry
 * - Returns [] if no experience section exists
 */

import { ExperienceEntry } from '../../types/canonicalProfile';

const ACTION_VERB_REGEX = /^(?:Engineered|Developed|Built|Led|Designed|Created|Implemented|Architected|Managed|Formulated|Spearheaded|Configured|Constructed|Maintained|Automated|Optimized|Refactored|Tested|Deployed|Collaborated|Assisted|Streamlined|Produced|Organized|Trained|Authored|Directed|Executed|Integrated|Resolved|Researched|Drafted|Initiated|Facilitated|Administered)\b/i;

const ROLE_INDICATORS = /\b(?:Software Developer|Software Engineer|Frontend Developer|Frontend Engineer|Backend Developer|Backend Engineer|Full Stack Developer|Full Stack Engineer|Data Engineer|Data Scientist|AI Engineer|AI Developer|AI Practitioner|Systems Engineer|Cloud Engineer|Cloud Architect|Solutions Architect|DevOps Engineer|Mobile Developer|iOS Developer|Android Developer|Product Manager|Product Designer|UI\/UX Designer|UX Researcher|Web Developer|Intern|Engineering Intern|Developer Intern|Research Intern|Research Associate|Architect|Analyst|Consultant|Specialist|Lead|Co-founder|Founder|Manager|Director|Associate|Officer|Specialist|Developer)\b/i;

const TECH_HEADER_REGEX = /^(?:Technologies|Tech Stack|Technologies Used|Tools & Technologies|Key Technologies|Tech & Keywords|Built with|Tools|Stack)\s*:?/i;

const DATE_RANGE_REGEX = /\b((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}\/\d{4})?\s*20\d{2}|19\d{2})\s*[-–—to]+\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2}\/\d{4})?\s*20\d{2}|19\d{2}|Present|Current)\b/i;

const SINGLE_DATE_REGEX = /\b((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*(?:20\d{2}|19\d{2})|(?:20\d{2}|19\d{2}))\b/i;

export function parseExperienceSection(sectionText: string): ExperienceEntry[] {
  if (!sectionText || !sectionText.trim()) return [];

  const rawLines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  // Group rawLines into discrete experience entry blocks
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Reject section headers or tech headers from starting a new block
    if (/^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION)$/i.test(line)) continue;

    const isBullet = /^[•●▪◦·*–—\-]\s*/.test(line);
    const isActionVerb = ACTION_VERB_REGEX.test(line.replace(/^[•●▪◦·*–—\-]\s*/, ''));
    const isTechHeader = TECH_HEADER_REGEX.test(line);
    const isDateLine = DATE_RANGE_REGEX.test(line) && line.length < 50;

    const isPotentialHeader = !isBullet && !isActionVerb && !isTechHeader && !isDateLine;
    const matchesRoleOrCompany = isPotentialHeader && (
      ROLE_INDICATORS.test(line) ||
      /^(?:Inc|LLC|Ltd|Corp|Co|Technologies|Systems|Solutions|Labs|Group|Company|Studio|Startup|Amazon|Microsoft|Oracle|Google|Infowaves|RoboSystems|SaaSify|TechInnovators|PixelCraft|CloudExperts|Freelance)\b/i.test(line) ||
      (line.includes('|') && ROLE_INDICATORS.test(line)) ||
      (line.includes('–') && ROLE_INDICATORS.test(line)) ||
      (line.includes('-') && ROLE_INDICATORS.test(line))
    );

    const currentBlockHasContent = currentBlock.length >= 2 && currentBlock.some(l => 
      DATE_RANGE_REGEX.test(l) || /^[•●▪◦·*–—\-]\s*/.test(l) || ACTION_VERB_REGEX.test(l) || TECH_HEADER_REGEX.test(l)
    );

    if (matchesRoleOrCompany && currentBlockHasContent) {
      blocks.push(currentBlock);
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  const entries: ExperienceEntry[] = [];

  blocks.forEach((blockLines, idx) => {
    let role = '';
    let company = '';
    let location = '';
    let startDate = '';
    let endDate = '';
    let current = false;
    const achievements: string[] = [];
    const descLines: string[] = [];
    const technologies: string[] = [];

    const fullBlockStr = blockLines.join('\n');

    // 1. Extract Date Range
    const dateMatch = fullBlockStr.match(DATE_RANGE_REGEX);
    if (dateMatch) {
      startDate = dateMatch[1].trim();
      endDate = dateMatch[2].trim();
      if (/Present|Current/i.test(endDate)) {
        current = true;
      }
    } else {
      const singleDate = fullBlockStr.match(SINGLE_DATE_REGEX);
      if (singleDate) {
        startDate = singleDate[1].trim();
      }
    }

    // 2. Extract Technologies & Tech Stack
    let inTechSection = false;
    const unconsumedLines: string[] = [];

    for (let i = 0; i < blockLines.length; i++) {
      const line = blockLines[i];

      if (TECH_HEADER_REGEX.test(line)) {
        const afterColon = line.replace(TECH_HEADER_REGEX, '').trim();
        if (afterColon) {
          const techs = afterColon.split(/[,|•;]/).map(t => t.trim()).filter(Boolean);
          technologies.push(...techs);
        } else {
          inTechSection = true;
        }
        continue;
      }

      if (inTechSection) {
        if (!/^[•●▪◦·*–—\-]\s*/.test(line) && !ACTION_VERB_REGEX.test(line) && !ROLE_INDICATORS.test(line)) {
          const techs = line.split(/[,|•;]/).map(t => t.trim()).filter(Boolean);
          technologies.push(...techs);
          inTechSection = false;
          continue;
        } else {
          inTechSection = false;
        }
      }

      unconsumedLines.push(line);
    }

    // 3. Extract Role, Company, Location
    const nonBulletLines: string[] = [];
    unconsumedLines.forEach(l => {
      const isBullet = /^[•●▪◦·*–—\-]\s*/.test(l) || ACTION_VERB_REGEX.test(l.replace(/^[•●▪◦·*–—\-]\s*/, ''));
      const isDateOnly = DATE_RANGE_REGEX.test(l) && l.replace(DATE_RANGE_REGEX, '').trim().length < 3;

      if (isBullet) {
        achievements.push(l.replace(/^[•●▪◦·*–—\-]\s*/, '').trim());
      } else if (!isDateOnly) {
        nonBulletLines.push(l);
      }
    });

    if (nonBulletLines.length > 0) {
      const first = nonBulletLines[0];
      if (/[-–—|]/.test(first) && !ACTION_VERB_REGEX.test(first) && !first.includes(' / ')) {
        const parts = first.split(/[-–—|]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          if (ROLE_INDICATORS.test(parts[0])) {
            role = parts[0];
            company = parts[1];
          } else {
            company = parts[0];
            role = parts[1];
          }
        }
      }
    }

    // Line 0 as role / company
    if (nonBulletLines.length >= 1) {
      const line0 = nonBulletLines[0].replace(DATE_RANGE_REGEX, '').replace(SINGLE_DATE_REGEX, '').trim();
      const line1 = nonBulletLines.length > 1 ? nonBulletLines[1].replace(DATE_RANGE_REGEX, '').replace(SINGLE_DATE_REGEX, '').trim() : '';

      if (/^Freelance$/i.test(line1)) {
        role = line0;
        company = 'Freelance';
      } else if (/^Freelance$/i.test(line0)) {
        company = 'Freelance';
        role = line1 || 'Freelance Developer';
      } else if (!role && ROLE_INDICATORS.test(line0)) {
        role = line0;
        if (line1 && !company && !/^(?:Thanjavur|Bengaluru|Bangalore|Chennai|Hyderabad|Mumbai|Pune|Delhi|Noida|San Francisco|Seattle|New York|Austin|Remote|India|USA)\b/i.test(line1)) {
          company = line1;
        }
      }
    }

    for (let i = 0; i < Math.min(4, nonBulletLines.length); i++) {
      const l = nonBulletLines[i];
      if (l === role || l === company) continue;

      const lineWithoutDates = l.replace(DATE_RANGE_REGEX, '').replace(SINGLE_DATE_REGEX, '').trim();
      if (!lineWithoutDates) continue;

      if (!role && ROLE_INDICATORS.test(lineWithoutDates) && !ACTION_VERB_REGEX.test(lineWithoutDates)) {
        role = lineWithoutDates;
      } else if (!company && (
        /^(?:Inc|LLC|Ltd|Corp|Co|Technologies|Systems|Solutions|Labs|Group|Company|Studio|Startup|Amazon|Microsoft|Oracle|Google|Infowaves|RoboSystems|SaaSify|TechInnovators|PixelCraft|CloudExperts|Freelance)\b/i.test(lineWithoutDates) ||
        !/^(?:Thanjavur|Bengaluru|Bangalore|Chennai|Hyderabad|Mumbai|Pune|Delhi|Noida|San Francisco|Seattle|New York|Austin|Remote|India|USA)\b/i.test(lineWithoutDates)
      ) && lineWithoutDates.length <= 60 && !ACTION_VERB_REGEX.test(lineWithoutDates)) {
        company = lineWithoutDates;
      } else if (!location && /^(?:Thanjavur|Bengaluru|Bangalore|Chennai|Hyderabad|Mumbai|Pune|Delhi|Noida|San Francisco|Seattle|New York|Austin|Remote|India|USA|CA|WA|TX|NY|Tamil Nadu|Karnataka|Maharashtra|Telangana)\b/i.test(lineWithoutDates)) {
        location = lineWithoutDates;
      }
    }

    if (!role && nonBulletLines.length > 0) {
      role = nonBulletLines[0].replace(DATE_RANGE_REGEX, '').trim();
    }
    if (!company && nonBulletLines.length > 1 && nonBulletLines[1] !== role) {
      const candidate = nonBulletLines[1].replace(DATE_RANGE_REGEX, '').trim();
      if (/^(?:Thanjavur|Bengaluru|Bangalore|Chennai|Hyderabad|Mumbai|Pune|Delhi|Noida|San Francisco|Seattle|New York|Austin|Remote|India|USA)\b/i.test(candidate)) {
        location = candidate;
      } else {
        company = candidate;
      }
    }

    // STRICT REJECTION: If role or company is "TECHNICAL SKILLS" or a section header or a tech list, reject
    if (/^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION)$/i.test(role) || /^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION)$/i.test(company)) {
      return;
    }

    const remainingDesc = descLines
      .filter(l => l !== role && l !== company && l !== location)
      .join(' ')
      .trim();

    const fullDescription = remainingDesc || achievements.join(' ');

    let employmentType = 'Full-time';
    if (/Intern/i.test(role) || /Internship/i.test(role)) {
      employmentType = 'Internship';
    } else if (/Freelance/i.test(role) || /Freelance/i.test(company)) {
      employmentType = 'Freelance';
    } else if (/Contract/i.test(role)) {
      employmentType = 'Contract';
    }

    if (role && role.length >= 2 && !/^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION)$/i.test(role)) {
      entries.push({
        id: `exp-${Date.now()}-${idx + 1}`,
        company: company || 'Company',
        role: role,
        employmentType,
        startDate,
        endDate,
        current,
        location,
        description: fullDescription,
        achievements: achievements.length ? achievements : (remainingDesc ? [remainingDesc] : []),
        technologies: Array.from(new Set(technologies))
      });
    }
  });

  return entries;
}
