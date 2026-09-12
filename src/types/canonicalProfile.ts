/**
 * canonicalProfile.ts — Single Source of Truth for User Profile Data
 *
 * All user data from Resume Upload or Manual Onboarding is normalized into this structure.
 * Templates bind to this schema automatically via universal semantic field mappings.
 */

export interface PersonalDetails {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  profilePhoto: string;
  summary: string;
}

export interface CareerDetails {
  specialization: string;
  industry: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  school?: string;
  university?: string;
  degree: string;
  department: string;
  specialization: string;
  field?: string;
  fieldOfStudy?: string;
  startYear: string;
  endYear: string;
  startDate?: string;
  endDate?: string;
  period?: string;
  duration?: string;
  year?: string;
  years?: string;
  cgpa?: string;
  percentage?: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  projectUrl: string;
  image: string;
  achievements: string[];
  metrics: string[];
}

export interface SkillEntry {
  id: string;
  name: string;
  category: string;
  proficiency?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  title?: string;
  organization: string;
  issuer?: string;
  issueDate: string;
  date?: string;
  year?: string;
  issuedDate?: string;
  period?: string;
  credentialId: string;
  credentialUrl: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  behance?: string;
  dribbble?: string;
  twitter?: string;
  otherLinks: string[];
}

export interface LanguageEntry {
  name: string;
  proficiency: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

export interface VolunteeringEntry {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeMeta {
  fileUrl?: string;
  fileName?: string;
  extractedText?: string;
  parsedAt?: number;
}

export interface CampusProfile {
  id: string;
  userId: string;
  personal: PersonalDetails;
  career: CareerDetails;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillEntry[];
  certifications: CertificationEntry[];
  social: SocialLinks;
  languages: LanguageEntry[];
  awards: AwardEntry[];
  publications: PublicationEntry[];
  volunteering: VolunteeringEntry[];
  interests: string[];
  resume?: ResumeMeta;
  createdAt: number;
  updatedAt: number;
}

/**
 * Creates a clean, empty CampusProfile.
 * ABSOLUTELY NO FAKE DEMO VALUES.
 */
export function createEmptyCanonicalProfile(id = `profile-${Date.now()}`, userId = 'user-default'): CampusProfile {
  return {
    id,
    userId,
    personal: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      profilePhoto: '',
      summary: ''
    },
    career: {
      specialization: '',
      industry: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    social: {
      github: '',
      linkedin: '',
      portfolio: '',
      behance: '',
      dribbble: '',
      twitter: '',
      otherLinks: []
    },
    languages: [],
    awards: [],
    publications: [],
    volunteering: [],
    interests: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

/**
 * Universal Canonical Profile Normalizer:
 * Ingests any arbitrary, raw resume JSON (from Groq AI extraction, manual form, or DB)
 * and normalizes all keys, types, and collections into the strict CampusProfile schema.
 */
export function normalizeToCanonicalProfile(raw: any, fallbackId?: string, fallbackUserId?: string): CampusProfile {
  if (!raw || typeof raw !== 'object') {
    return createEmptyCanonicalProfile(fallbackId, fallbackUserId);
  }

  const profile = createEmptyCanonicalProfile(
    raw.id || fallbackId,
    raw.userId || fallbackUserId || 'user-default'
  );

  // 1. Personal / Profile Normalization
  const pers = raw.personal || raw.profile || raw.basics || raw.contact || {};
  profile.personal = {
    fullName: (pers.fullName || pers.name || raw.name || raw.fullName || raw.hero?.name || '').trim(),
    headline: (pers.headline || pers.role || pers.title || pers.position || raw.headline || raw.tagline || raw.role || raw.hero?.role || raw.hero?.title || '').trim(),
    email: (pers.email || raw.email || raw.ownerEmail || '').trim(),
    phone: (pers.phone || pers.mobile || pers.phoneNumber || raw.phone || '').trim(),
    city: (pers.city || pers.location || raw.location || '').trim(),
    state: (pers.state || '').trim(),
    country: (pers.country || '').trim(),
    profilePhoto: (pers.profilePhoto || pers.photo || pers.avatarUrl || pers.avatar || pers.image || raw.profileImage || raw.avatarUrl || raw.avatar || raw.image || raw.photo || '').trim(),
    summary: (pers.summary || pers.bio || pers.about || pers.aboutMe || raw.summary || raw.aboutMe || raw.about?.description || raw.hero?.description || '').trim()
  };

  // 2. Career Details
  const career = raw.career || {};
  profile.career = {
    specialization: (career.specialization || pers.specialization || profile.personal.headline || '').trim(),
    industry: (career.industry || pers.industry || '').trim()
  };

  // 3. Experience Normalization
  const rawExp = Array.isArray(raw.experience)
    ? raw.experience
    : (Array.isArray(raw.work)
      ? raw.work
      : (Array.isArray(raw.workExperience)
        ? raw.workExperience
        : (Array.isArray(raw.timeline) ? raw.timeline : [])));

  profile.experience = rawExp
    .filter((exp: any) => exp && typeof exp === 'object')
    .map((exp: any, idx: number): ExperienceEntry => {
      const company = (exp.company || exp.employer || exp.organization || exp.subtitle || exp.company_name || '').trim();
      const role = (exp.role || exp.title || exp.position || exp.jobTitle || exp.designation || exp.job_title || '').trim();
      const startDate = (exp.startDate || exp.start || exp.start_date || exp.from || '').trim();
      const endDate = (exp.endDate || exp.end || exp.end_date || exp.to || '').trim();
      const isCurrent = Boolean(exp.current || exp.isCurrent || /present|current/i.test(endDate || exp.period || ''));
      const location = (exp.location || exp.city || '').trim();
      const description = (exp.description || exp.desc || exp.summary || exp.details || '').trim();

      const achievements: string[] = Array.isArray(exp.achievements)
        ? exp.achievements.map((a: any) => typeof a === 'string' ? a.trim() : (a?.title || String(a || ''))).filter(Boolean)
        : (Array.isArray(exp.bullets)
          ? exp.bullets.map((b: any) => typeof b === 'string' ? b.trim() : String(b || '')).filter(Boolean)
          : (Array.isArray(exp.highlights)
            ? exp.highlights.map((h: any) => typeof h === 'string' ? h.trim() : String(h || '')).filter(Boolean)
            : (description ? [description] : [])));

      const technologies: string[] = Array.isArray(exp.technologies)
        ? exp.technologies.map((t: any) => typeof t === 'string' ? t.trim() : (t?.name || String(t || ''))).filter(Boolean)
        : (Array.isArray(exp.techStack)
          ? exp.techStack.map((t: any) => typeof t === 'string' ? t.trim() : String(t || '')).filter(Boolean)
          : (Array.isArray(exp.skills)
            ? exp.skills.map((s: any) => typeof s === 'string' ? s.trim() : (s?.name || String(s || ''))).filter(Boolean)
            : []));

      return {
        id: exp.id || `exp-${Date.now()}-${idx + 1}`,
        company: company || 'Company',
        role: role || 'Role',
        employmentType: exp.employmentType || 'Full-time',
        startDate,
        endDate: isCurrent ? 'Present' : endDate,
        current: isCurrent,
        location,
        description,
        achievements,
        technologies
      };
    });

  // 4. Education Normalization
  const rawEdu = Array.isArray(raw.education)
    ? raw.education
    : (Array.isArray(raw.academics)
      ? raw.academics
      : (Array.isArray(raw.academicCredentials) ? raw.academicCredentials : []));

  profile.education = rawEdu
    .filter((edu: any) => edu && typeof edu === 'object')
    .map((edu: any, idx: number): EducationEntry => {
      const institution = (edu.institution || edu.school || edu.university || edu.college || edu.organization || '').trim();
      const degree = (edu.degree || edu.title || edu.credential || edu.program || '').trim();
      const department = (edu.department || edu.specialization || edu.field || edu.major || edu.fieldOfStudy || '').trim();
      const specialization = (edu.specialization || edu.department || edu.field || edu.major || edu.fieldOfStudy || '').trim();
      const field = department || specialization || '';
      const startYear = (edu.startYear || edu.startDate || edu.start || edu.from || '').trim();
      const endYear = (edu.endYear || edu.endDate || edu.end || edu.to || edu.graduationYear || edu.graduation || '').trim();
      const period = (edu.period || edu.duration || edu.years || edu.year || (startYear && endYear ? `${startYear} – ${endYear}` : (startYear || endYear || ''))).trim();
      const cgpa = (edu.cgpa || edu.gpa || edu.grade || edu.percentage || '').trim();
      const description = (edu.description || edu.desc || edu.details || '').trim();

      return {
        id: edu.id || `edu-${Date.now()}-${idx + 1}`,
        institution: institution || 'Institution',
        school: institution || 'Institution',
        university: institution || 'Institution',
        degree: degree || 'Degree',
        department,
        specialization,
        field,
        fieldOfStudy: field,
        startYear,
        endYear,
        startDate: startYear,
        endDate: endYear,
        period,
        duration: period,
        year: period,
        years: period,
        cgpa: cgpa || undefined,
        description
      };
    });

  // 5. Projects Normalization
  const rawProj = Array.isArray(raw.projects)
    ? raw.projects
    : (Array.isArray(raw.portfolioProjects)
      ? raw.portfolioProjects
      : (Array.isArray(raw.works) ? raw.works : []));

  profile.projects = rawProj
    .filter((proj: any) => proj && typeof proj === 'object')
    .map((proj: any, idx: number): ProjectEntry => {
      const name = (proj.name || proj.title || proj.projectName || '').trim();
      const description = (proj.description || proj.desc || proj.summary || proj.details || '').trim();
      const githubUrl = (proj.githubUrl || proj.github || proj.repo || proj.repoUrl || '').trim();
      const liveUrl = (proj.liveUrl || proj.live || proj.demo || proj.demoUrl || proj.url || proj.link || '').trim();
      const image = (proj.image || proj.imageUrl || proj.thumbnail || (Array.isArray(proj.images) ? proj.images[0] : '') || '').trim();

      const technologies: string[] = Array.isArray(proj.technologies)
        ? proj.technologies.map((t: any) => typeof t === 'string' ? t.trim() : (t?.name || String(t || ''))).filter(Boolean)
        : (Array.isArray(proj.tags)
          ? proj.tags.map((t: any) => typeof t === 'string' ? t.trim() : (t?.name || String(t || ''))).filter(Boolean)
          : (Array.isArray(proj.stack)
            ? proj.stack.map((t: any) => typeof t === 'string' ? t.trim() : String(t || '')).filter(Boolean)
            : []));

      const achievements: string[] = Array.isArray(proj.achievements)
        ? proj.achievements.map((a: any) => typeof a === 'string' ? a.trim() : (a?.title || String(a || ''))).filter(Boolean)
        : (Array.isArray(proj.highlights)
          ? proj.highlights.map((h: any) => typeof h === 'string' ? h.trim() : String(h || '')).filter(Boolean)
          : []);

      return {
        id: proj.id || `proj-${Date.now()}-${idx + 1}`,
        name: name || `Project ${idx + 1}`,
        description,
        technologies,
        githubUrl,
        liveUrl,
        projectUrl: liveUrl || githubUrl,
        image,
        achievements,
        metrics: []
      };
    });

  // 6. Skills Normalization
  const rawSkillsCandidates = [
    raw.canonicalProfile?.skills,
    raw.canonical_profile?.skills,
    raw.skills,
    raw.skillsList,
    raw.technicalSkills,
    raw.techStack,
    raw.profile?.skills,
    raw.personalInfo?.skills
  ];

  let rawSkills: any[] = [];
  for (const c of rawSkillsCandidates) {
    if (Array.isArray(c) && c.length > 0) {
      rawSkills = c;
      break;
    }
  }

  const flattenedSkills: any[] = [];
  rawSkills.forEach((sk: any) => {
    if (typeof sk === 'string' && sk.trim()) {
      flattenedSkills.push({ name: sk.trim(), category: 'Technical Skills' });
    } else if (sk && typeof sk === 'object') {
      const categoryName = sk.category || sk.name || sk.title || 'Technical Skills';
      if (Array.isArray(sk.items)) {
        sk.items.forEach((it: any) => {
          if (typeof it === 'string' && it.trim()) {
            flattenedSkills.push({ name: it.trim(), category: categoryName });
          } else if (it && typeof it === 'object') {
            flattenedSkills.push({ ...it, category: it.category || categoryName });
          }
        });
      } else if (Array.isArray(sk.skills)) {
        sk.skills.forEach((it: any) => {
          if (typeof it === 'string' && it.trim()) {
            flattenedSkills.push({ name: it.trim(), category: categoryName });
          } else if (it && typeof it === 'object') {
            flattenedSkills.push({ ...it, category: it.category || categoryName });
          }
        });
      } else {
        flattenedSkills.push(sk);
      }
    }
  });

  profile.skills = flattenedSkills
    .map((sk: any, idx: number): SkillEntry | null => {
      if (typeof sk === 'string') {
        const trimmed = sk.trim();
        return {
          id: `skill-${Date.now()}-${idx + 1}`,
          name: trimmed || 'New Skill',
          category: 'Technical Skills',
          proficiency: 'Advanced'
        };
      }
      if (sk && typeof sk === 'object') {
        const name = (sk.name || sk.skill || sk.title || sk.label || '').trim();
        if (!name) return null;
        return {
          id: sk.id || `skill-${Date.now()}-${idx + 1}`,
          name,
          category: (sk.category || 'Technical Skills').trim(),
          proficiency: (sk.proficiency || sk.level || 'Advanced').trim()
        };
      }
      return null;
    })
    .filter((s: any): s is SkillEntry => s !== null && s.name.length > 0);

  // 7. Certifications Normalization
  const rawCerts = Array.isArray(raw.certifications)
    ? raw.certifications
    : (Array.isArray(raw.canonicalProfile?.certifications)
      ? raw.canonicalProfile.certifications
      : (Array.isArray(raw.canonical_profile?.certifications)
        ? raw.canonical_profile.certifications
        : (Array.isArray(raw.certificates)
          ? raw.certificates
          : (Array.isArray(raw.awards) ? raw.awards : []))));

  profile.certifications = rawCerts
    .filter((cert: any) => cert && typeof cert === 'object')
    .map((cert: any, idx: number): CertificationEntry => {
      const name = (cert.name || cert.title || cert.certificateName || '').trim();
      const organization = (cert.organization || cert.issuer || cert.issuedBy || cert.by || '').trim();
      const issueDate = (cert.issueDate || cert.date || cert.year || cert.issuedDate || cert.period || '').trim();
      const credentialUrl = (cert.credentialUrl || cert.url || cert.link || cert.certificateUrl || '').trim();
      const credentialId = (cert.credentialId || cert.id || '').trim();

      return {
        id: cert.id || `cert-${Date.now()}-${idx + 1}`,
        name: name || 'Certification',
        title: name || 'Certification',
        organization,
        issuer: organization,
        issueDate,
        date: issueDate,
        year: issueDate,
        issuedDate: issueDate,
        period: issueDate,
        credentialId,
        credentialUrl
      };
    });

  // 8. Social Links Normalization
  const soc = raw.social || raw.socialLinks || raw.socials || pers.social || pers.socialLinks || {};
  profile.social = {
    linkedin: (soc.linkedin || '').trim(),
    github: (soc.github || '').trim(),
    twitter: (soc.twitter || soc.x || '').trim(),
    portfolio: (soc.portfolio || soc.website || soc.url || '').trim(),
    behance: (soc.behance || '').trim(),
    dribbble: (soc.dribbble || '').trim(),
    otherLinks: Array.isArray(soc.otherLinks) ? soc.otherLinks.filter(Boolean) : []
  };

  // 9. Languages, Awards, Interests
  if (Array.isArray(raw.languages)) {
    profile.languages = raw.languages.map((l: any) => {
      if (typeof l === 'string') return { name: l.trim(), proficiency: 'Professional' };
      return { name: (l.name || l.language || '').trim(), proficiency: (l.proficiency || 'Professional').trim() };
    }).filter((l: any) => l.name.length > 0);
  }

  if (Array.isArray(raw.awards)) {
    profile.awards = raw.awards.map((aw: any, idx: number): AwardEntry => ({
      id: aw.id || `aw-${idx + 1}`,
      title: (aw.title || aw.name || '').trim(),
      organization: (aw.organization || aw.issuer || '').trim(),
      year: (aw.year || aw.date || '').trim(),
      description: (aw.description || '').trim()
    })).filter((a: any) => a.title.length > 0);
  }

  if (Array.isArray(raw.interests)) {
    profile.interests = raw.interests.map((i: any) => typeof i === 'string' ? i.trim() : (i.name || String(i))).filter(Boolean);
  }

  profile.createdAt = raw.createdAt || Date.now();
  profile.updatedAt = Date.now();

  return profile;
}

