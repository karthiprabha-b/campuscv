/**
 * sectionDetector.ts — Strict Layout-Aware Section Boundary Manager
 *
 * Implements deterministic section detection:
 * - Identifies true section heading lines
 * - Assigns strict [startLine, endLine] boundaries
 * - Ensures content under one section NEVER leaks into another
 */

export interface SectionRange {
  name: string;
  canonicalName: string;
  startLine: number;
  endLine: number;
  lines: string[];
  content: string;
}

export interface DetectedSections {
  HEADER_CONTACT: SectionRange;
  SUMMARY?: SectionRange;
  EDUCATION?: SectionRange;
  EXPERIENCE?: SectionRange;
  PROJECTS?: SectionRange;
  SKILLS?: SectionRange;
  CERTIFICATIONS?: SectionRange;
  ACHIEVEMENTS?: SectionRange;
  LINKS?: SectionRange;
  LANGUAGES?: SectionRange;
  allSections: Record<string, string>;
  sectionRanges: Record<string, SectionRange>;
  detectedSectionNames: string[];
}

export const SECTION_PATTERNS: Record<string, RegExp> = {
  SUMMARY: /^(?:Profile|About|About Me|Summary|Professional Summary|Executive Summary|Career Summary|Objective|Career Objective|Profile Summary|Personal Profile|Bio|Background Summary)$/i,
  EDUCATION: /^(?:Education|Academic Background|Academics|Academic History|Academic Details|Academic Qualifications|Educational Qualifications|Educational Background|Qualifications|Degrees|Education and Training|Education & Training|Academic Details & Qualifications)$/i,
  EXPERIENCE: /^(?:Experience|Work Experience|Professional Experience|Employment|Employment History|Work History|Career History|Internships|Internship Experience|Relevant Experience|Practical Experience|Industry Experience|Job Experience|Professional Background)$/i,
  PROJECTS: /^(?:Projects|Key Projects|Featured Projects|Academic Projects|Personal Projects|Selected Projects|Major Projects|Technical Projects|Key Accomplishments & Projects|Featured Projects & Achievements|Notable Projects|Project Work|Project Experience|Software Projects)$/i,
  SKILLS: /^(?:Skills|Technical Skills|Core Skills|Key Skills|Technical Expertise|Languages & Technologies|Tools & Technologies|Technologies & Tools|Technical Proficiencies|Core Competencies|Skills & Tools|Capabilities & Tools|Technical Proficiency|Skills & Capabilities|Tools & Platforms|Areas of Expertise|Strengths & Skills|Technical Knowledge|Expertise|Technologies)$/i,
  CERTIFICATIONS: /^(?:Certifications|Certificates|Courses|Licenses|Achievements & Certifications|Professional Certifications|Trainings|Honors & Certifications|Licenses & Certificates|Certificates & Licenses|Certifications & Licenses|Courses & Certifications|Professional Credentials)$/i,
  ACHIEVEMENTS: /^(?:Achievements|Awards|Honors|Accomplishments|Awards & Honors|Recognitions|Honors & Awards|Extracurricular Activities|Co-curricular Activities)$/i,
  LINKS: /^(?:Links|Profiles|Social|Connect|Online Profiles|Social Links|Websites|Social Profiles|Contact Links|Social Media)$/i,
  LANGUAGES: /^(?:Languages|Language Proficiency|Languages Known|Language Skills)$/i
};

export function segmentSections(text: string): DetectedSections {
  const rawLines = text.split('\n');
  const lines = rawLines.map(l => l.trim());

  // Step 1: Detect all heading lines and their line indices
  interface HeadingMarker {
    lineIndex: number;
    canonicalName: string;
    rawText: string;
  }

  const markers: HeadingMarker[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Reject inline field labels like "Technologies:", "Tech Stack:", "Role:", "GitHub:"
    if (/^(?:Technologies|Tech Stack|Technologies Used|Built with|Tools Used|Tech & Keywords|Role|Company|Date|Duration|Location|GitHub|LinkedIn)\s*:/i.test(line)) {
      continue;
    }

    // Clean leading bullets/numbers/hashes/brackets and trailing colons/periods
    const cleaned = line
      .replace(/^[\d#.*–—\-•●\[\(\{\s]+/, '')
      .replace(/[\]\)\}\s]*$/, '')
      .replace(/[:.]\s*$/, '')
      .trim();

    if (cleaned.length < 2 || cleaned.length > 50) continue;

    for (const [canonicalName, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line) || pattern.test(cleaned)) {
        markers.push({
          lineIndex: i,
          canonicalName,
          rawText: line
        });
        break;
      }
    }
  }

  // Step 2: Build discrete non-overlapping Section Ranges
  const sectionRanges: Record<string, SectionRange> = {};
  const allSections: Record<string, string> = {};
  const detectedSectionNames: string[] = [];

  // Header & Contact range is everything before the first detected section marker
  const firstMarkerIndex = markers.length > 0 ? markers[0].lineIndex : lines.length;
  const headerLines = rawLines.slice(0, firstMarkerIndex).filter(l => l.trim().length > 0);

  sectionRanges['HEADER_CONTACT'] = {
    name: 'HEADER_CONTACT',
    canonicalName: 'HEADER_CONTACT',
    startLine: 0,
    endLine: Math.max(0, firstMarkerIndex - 1),
    lines: headerLines,
    content: headerLines.join('\n').trim()
  };
  allSections['HEADER_CONTACT'] = sectionRanges['HEADER_CONTACT'].content;

  // Process each section range
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    const nextMarker = markers[i + 1];

    const start = marker.lineIndex + 1;
    const end = nextMarker ? nextMarker.lineIndex : rawLines.length;

    const sectionRawLines = rawLines.slice(start, end).filter(l => l.trim().length > 0);
    const content = sectionRawLines.join('\n').trim();

    const range: SectionRange = {
      name: marker.rawText,
      canonicalName: marker.canonicalName,
      startLine: start,
      endLine: end - 1,
      lines: sectionRawLines,
      content
    };

    sectionRanges[marker.canonicalName] = range;
    allSections[marker.canonicalName] = content;

    if (!detectedSectionNames.includes(marker.canonicalName)) {
      detectedSectionNames.push(marker.canonicalName);
    }
  }

  return {
    HEADER_CONTACT: sectionRanges['HEADER_CONTACT'],
    SUMMARY: sectionRanges['SUMMARY'],
    EDUCATION: sectionRanges['EDUCATION'],
    EXPERIENCE: sectionRanges['EXPERIENCE'],
    PROJECTS: sectionRanges['PROJECTS'],
    SKILLS: sectionRanges['SKILLS'],
    CERTIFICATIONS: sectionRanges['CERTIFICATIONS'],
    ACHIEVEMENTS: sectionRanges['ACHIEVEMENTS'],
    LINKS: sectionRanges['LINKS'],
    LANGUAGES: sectionRanges['LANGUAGES'],
    allSections,
    sectionRanges,
    detectedSectionNames
  };
}
