/**
 * BindingSchema.ts — Canonical Profile Data Contract for Universal Binding Engine
 *
 * Provides a single, unified canonical profile schema and normalization functions.
 * All uploaded templates receive this standard canonical object.
 */

export interface UniversalSocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  dribbble?: string;
  behance?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface UniversalEducationEntry {
  id: string;
  degree: string;
  institution: string;
  school?: string;
  university?: string;
  startYear?: string;
  endYear?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  period?: string;
  year?: string;
  years?: string;
  fieldOfStudy?: string;
  field?: string;
  department?: string;
  specialization?: string;
  major?: string;
  description?: string;
  cgpa?: string;
  gpa?: string;
  honors?: string;
  location?: string;
}

export interface UniversalExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  description?: string;
  highlights?: string[];
}

export interface UniversalProjectEntry {
  id: string;
  title: string;
  name?: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  image?: string;
  category?: string;
}

export interface UniversalSkillEntry {
  id: string;
  name: string;
  category?: string;
  proficiency?: string;
  level?: string;
}

export interface UniversalCertificationEntry {
  id: string;
  title: string;
  name?: string;
  organization: string;
  issuer?: string;
  issueDate?: string;
  year?: string;
  credentialUrl?: string;
}

export interface UniversalAchievementEntry {
  id: string;
  title: string;
  description?: string;
  year?: string;
}

export interface UniversalServiceEntry {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface UniversalCanonicalProfile {
  name: string;
  firstName: string;
  lastName: string;

  headline: string;
  role: string;
  title: string;

  bio: string;
  about: string;
  summary: string;

  email: string;
  phone: string;
  location: string;
  website: string;

  profileImage: string;
  avatar: string;
  photo: string;

  resumeUrl: string;

  socials: UniversalSocialLinks;

  education: UniversalEducationEntry[];
  experience: UniversalExperienceEntry[];
  projects: UniversalProjectEntry[];
  skills: UniversalSkillEntry[];
  certifications: UniversalCertificationEntry[];
  achievements: UniversalAchievementEntry[];
  services: UniversalServiceEntry[];
}

/**
 * Normalizes any raw/legacy portfolio database payload into a UniversalCanonicalProfile.
 */
export function toUniversalCanonicalProfile(raw: any): UniversalCanonicalProfile {
  if (!raw || typeof raw !== 'object') raw = {};

  const personal = raw.personal || {};
  const profile = raw.profile || {};
  const hero = raw.hero || {};
  const canonical = raw.canonicalProfile || {};
  const canonicalPersonal = canonical.personal || {};

  // 1. Resolve Name
  const fullName =
    raw.name ||
    raw.fullName ||
    personal.fullName ||
    personal.name ||
    profile.fullName ||
    profile.name ||
    hero.name ||
    canonicalPersonal.fullName ||
    '';

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // 2. Resolve Headline / Role / Title
  const headline =
    raw.headline ||
    raw.tagline ||
    raw.role ||
    personal.headline ||
    personal.role ||
    profile.headline ||
    profile.role ||
    hero.role ||
    hero.subtitle ||
    canonicalPersonal.headline ||
    '';

  const role = headline;
  const title = headline || (fullName ? `${fullName} - Portfolio` : '');

  // 3. Resolve Bio / About / Summary
  const bio =
    raw.aboutMe ||
    raw.bio ||
    raw.summary ||
    raw.about?.description ||
    raw.about?.bio ||
    personal.summary ||
    personal.bio ||
    profile.bio ||
    profile.summary ||
    hero.description ||
    canonicalPersonal.summary ||
    '';

  const about = bio;
  const summary = bio;

  // 4. Resolve Contact Details
  const email =
    raw.email ||
    raw.ownerEmail ||
    personal.email ||
    profile.email ||
    canonicalPersonal.email ||
    '';

  const phone =
    raw.phone ||
    personal.phone ||
    profile.phone ||
    canonicalPersonal.phone ||
    '';

  const location =
    raw.location ||
    personal.location ||
    [personal.city, personal.state, personal.country].filter(Boolean).join(', ') ||
    profile.location ||
    hero.location ||
    '';

  const website =
    raw.website ||
    raw.portfolioUrl ||
    raw.socials?.website ||
    raw.socialLinks?.website ||
    raw.social?.website ||
    '';

  // 5. Resolve Profile Image (Priority 1..6)
  // Priority 1: Explicit Node Override (e.g. contentOverrides['image:about:root:img:0'], 'image:hero:root:img:0', or imageOverrides)
  const heroNodeOverride =
    raw.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof raw.contentOverrides?.['image:about:root:img:0'] === 'string' ? raw.contentOverrides?.['image:about:root:img:0'] : '') ||
    raw.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof raw.contentOverrides?.['image:hero:root:img:0'] === 'string' ? raw.contentOverrides?.['image:hero:root:img:0'] : '') ||
    raw.imageOverrides?.['image:about:root:img:0'] ||
    raw.imageOverrides?.['image:hero:root:img:0'] ||
    Object.entries(raw.contentOverrides || {}).find(([k, v]: any) => (k.includes('hero') || k.includes('about') || k.includes('profile') || k.includes('avatar')) && k.includes('img') && (v?.src || typeof v === 'string'))?.[1] ||
    Object.entries(raw.imageOverrides || {}).find(([k, v]: any) => (k.includes('hero') || k.includes('about') || k.includes('profile') || k.includes('avatar')) && typeof v === 'string')?.[1];

  const resolvedNodeSrc = typeof heroNodeOverride === 'object' && heroNodeOverride !== null ? (heroNodeOverride as any).src || (heroNodeOverride as any).value : heroNodeOverride;

  const profileImage =
    (typeof resolvedNodeSrc === 'string' && resolvedNodeSrc.trim().length > 0 ? resolvedNodeSrc.trim() : '') ||
    raw.profileImage ||
    raw.avatarUrl ||
    raw.avatar ||
    raw.photo ||
    raw.image ||
    personal.profilePhoto ||
    personal.avatarUrl ||
    profile.avatarUrl ||
    profile.photo ||
    profile.image ||
    profile.profileImage ||
    hero.avatarUrl ||
    hero.profileImage ||
    raw.about?.avatarUrl ||
    raw.about?.image ||
    raw.images?.profileImage ||
    '';

  const avatar = profileImage;
  const photo = profileImage;

  // 6. Resolve Resume URL
  const resumeUrl = raw.resumeUrl || raw.resume || canonical.resume || '';

  // 7. Resolve Social Links
  const rawSocials = raw.socials || raw.socialLinks || raw.social || canonical.social || {};
  const socials: UniversalSocialLinks = {
    linkedin: rawSocials.linkedin || (canonical.social as any)?.linkedin || '',
    github: rawSocials.github || (canonical.social as any)?.github || '',
    instagram: rawSocials.instagram || (canonical.social as any)?.instagram || '',
    twitter: rawSocials.twitter || rawSocials.x || (canonical.social as any)?.twitter || '',
    facebook: rawSocials.facebook || (canonical.social as any)?.facebook || '',
    dribbble: rawSocials.dribbble || (canonical.social as any)?.dribbble || '',
    behance: rawSocials.behance || (canonical.social as any)?.behance || '',
    youtube: rawSocials.youtube || (canonical.social as any)?.youtube || '',
    website: website || rawSocials.website || (canonical.social as any)?.website || ''
  };

  // 8. Resolve Collections
  const education: UniversalEducationEntry[] = (Array.isArray(raw.education) ? raw.education : (canonical.education || [])).map((edu: any, idx: number) => {
    const inst = edu.institution || edu.school || edu.university || edu.college || '';
    const deg = edu.degree || edu.title || edu.qualification || '';
    const start = edu.startDate || edu.startYear || edu.start || edu.from || '';
    const end = edu.endDate || edu.endYear || edu.graduationYear || edu.graduation || edu.end || edu.to || '';
    const dur = edu.duration || edu.period || edu.years || edu.year || (start && end ? `${start} – ${end}` : (start || end || ''));
    const field = edu.fieldOfStudy || edu.field || edu.department || edu.specialization || edu.major || '';
    return {
      id: edu.id || `edu-${idx}`,
      degree: deg,
      institution: inst,
      school: inst,
      university: inst,
      startDate: start,
      endDate: end,
      startYear: start,
      endYear: end,
      duration: dur,
      period: dur,
      year: dur,
      years: dur,
      fieldOfStudy: field,
      field: field,
      department: field,
      specialization: field,
      major: field,
      description: edu.description || edu.desc || edu.details || '',
      cgpa: edu.cgpa || edu.gpa || edu.grade || '',
      honors: edu.honors || edu.grade || '',
      location: edu.location || ''
    };
  });

  const experience: UniversalExperienceEntry[] = (Array.isArray(raw.experience) ? raw.experience : (Array.isArray(raw.timeline) ? raw.timeline : (canonical.experience || []))).map((exp: any, idx: number) => {
    const comp = exp.company || exp.organization || exp.employer || '';
    const r = exp.role || exp.title || exp.position || '';
    return {
      id: exp.id || `exp-${idx}`,
      role: r,
      company: comp,
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      duration: exp.duration || exp.period || '',
      description: exp.description || exp.desc || '',
      highlights: Array.isArray(exp.highlights) ? exp.highlights : (Array.isArray(exp.bullets) ? exp.bullets : [])
    };
  });

  const projects: UniversalProjectEntry[] = (Array.isArray(raw.projects) ? raw.projects : (canonical.projects || [])).map((proj: any, idx: number) => {
    const t = proj.title || proj.name || proj.projectName || 'Project Title';
    const tech = Array.isArray(proj.technologies) ? proj.technologies : (Array.isArray(proj.tags) ? proj.tags : []);
    return {
      id: proj.id || `proj-${idx}`,
      title: t,
      name: t,
      description: proj.description || proj.desc || proj.summary || '',
      technologies: tech.map((x: any) => typeof x === 'string' ? x : (x.name || x.title || String(x))),
      githubUrl: proj.githubUrl || proj.github || '',
      liveUrl: proj.liveUrl || proj.demo || proj.link || '',
      imageUrl: proj.imageUrl || proj.image || proj.thumbnail || '',
      image: proj.imageUrl || proj.image || proj.thumbnail || '',
      category: proj.category || 'Featured Work'
    };
  });

  const skills: UniversalSkillEntry[] = (Array.isArray(raw.skills) ? raw.skills : (canonical.skills || [])).map((sk: any, idx: number) => {
    if (typeof sk === 'string') {
      return { id: `skill-${idx}`, name: sk, category: 'Core Skill', proficiency: 'Advanced' };
    }
    const skName = sk.name || sk.title || sk.skill || 'Skill';
    return {
      id: sk.id || `skill-${idx}`,
      name: skName,
      category: sk.category || sk.group || 'Core Skill',
      proficiency: sk.proficiency || sk.level || 'Advanced',
      level: sk.proficiency || sk.level || 'Advanced'
    };
  });

  const certifications: UniversalCertificationEntry[] = (Array.isArray(raw.certifications) ? raw.certifications : (canonical.certifications || [])).map((cert: any, idx: number) => {
    const certTitle = cert.title || cert.name || cert.credential || '';
    const certOrg = cert.organization || cert.issuer || '';
    return {
      id: cert.id || `cert-${idx}`,
      title: certTitle,
      name: certTitle,
      organization: certOrg,
      issuer: certOrg,
      issueDate: cert.issueDate || cert.year || '',
      year: cert.issueDate || cert.year || '',
      credentialUrl: cert.credentialUrl || cert.link || ''
    };
  });

  const achievements: UniversalAchievementEntry[] = (Array.isArray(raw.achievements) ? raw.achievements : []).map((ach: any, idx: number) => ({
    id: ach.id || `ach-${idx}`,
    title: typeof ach === 'string' ? ach : (ach.title || ach.name || ''),
    description: ach.description || ach.desc || '',
    year: ach.year || ''
  }));

  const services: UniversalServiceEntry[] = (Array.isArray(raw.services) ? raw.services : (Array.isArray(raw.specialties) ? raw.specialties : [])).map((srv: any, idx: number) => ({
    id: srv.id || `srv-${idx}`,
    title: typeof srv === 'string' ? srv : (srv.title || srv.name || ''),
    description: srv.description || srv.desc || '',
    icon: srv.icon || ''
  }));

  return {
    name: fullName,
    firstName,
    lastName,
    headline,
    role,
    title,
    bio,
    about,
    summary,
    email,
    phone,
    location,
    website,
    profileImage,
    avatar,
    photo,
    resumeUrl,
    socials,
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    services
  };
}
