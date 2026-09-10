/**
 * templateBinder.ts — Universal Template Binding Engine
 *
 * Single Source of Truth Architecture:
 * Canonical CampusProfile -> Universal Template Binder -> Template Props
 *
 * Supports machine-readable contracts (manifest.json, schema.json, bindings.json)
 * and universal semantic alias resolution.
 */

import { CampusProfile } from '../types/canonicalProfile';
import { normalizeExperienceDates, normalizeEducationDates } from './dateFormatters';

export interface TemplateBinderOptions {
  renderMode?: 'DEMO' | 'EDITOR' | 'PREVIEW' | 'PUBLISHED';
  templateId?: string;
  manifest?: any;
  schema?: any;
  bindings?: any;
  templateOverrides?: Record<string, any>;
  contentOverrides?: Record<string, any>;
}

export const DEFAULT_DESIGNER_PORTRAIT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="%23FAF9F5"/><rect x="40" y="40" width="520" height="720" rx="32" fill="%23E5E2DA" opacity="0.4"/><circle cx="300" cy="320" r="140" fill="%23141414" opacity="0.85"/><path d="M120 720C120 540 200 480 300 480C400 480 480 540 480 720" fill="%23141414" opacity="0.85"/><circle cx="480" cy="180" r="16" fill="%23FF4D00"/><path d="M250 300Q300 340 350 300" stroke="%23FAF9F5" stroke-width="8" stroke-linecap="round"/></svg>`;

export function bindProfileToTemplate(
  profile: CampusProfile,
  options: TemplateBinderOptions = {}
): Record<string, any> {
  const mode = options.renderMode || 'EDITOR';
  const templateId = options.templateId || 'default';
  const overrides = options.templateOverrides?.[templateId] || options.contentOverrides || {};

  const p = profile || {};
  const personal = p.personal || {};

  // 1. Map Canonical Personal Details
  const fullName = personal.fullName || (p as any).name || (p as any).fullName || (p as any).hero?.name || (p as any).profile?.fullName || '';
  const headline = personal.headline || (p as any).tagline || (p as any).headline || (p as any).role || (p as any).hero?.role || (p as any).profile?.headline || '';
  const summary = personal.summary || (p as any).aboutMe || (p as any).summary || (p as any).profile?.summary || '';
  const location = [personal.city, personal.state, personal.country].filter(Boolean).join(', ') || personal.city || (p as any).location || (p as any).university || '';
  const profilePhoto = personal.profilePhoto || (p as any).profileImage || (p as any).avatarUrl || (p as any).avatar || (p as any).photo || (p as any).image || (p as any).profile?.photo || (p as any).profile?.profileImage || (p as any).profile?.avatarUrl || null;

  console.log('[CV DEBUG][STAGE G: BINDING ENGINE]', {
    stage: 'UNIVERSAL BINDING ENGINE',
    templateId,
    renderMode: mode,
    name: fullName,
    profileImage: profilePhoto,
    email: personal.email,
    linkedin: p.social?.linkedin,
    experienceCount: p.experience?.length,
    educationCount: p.education?.length,
    projectsCount: Array.isArray(p.projects) ? p.projects.length : (p.projects === undefined ? 'undefined' : 0),
    timestamp: new Date().toISOString()
  });

  // 2. Map Canonical Collections
  const projects = (p.projects || []).map((proj: any, idx: number) => {
    const rawTitle = typeof proj?.title === 'string' ? proj.title : (typeof proj?.name === 'string' ? proj.name : (typeof proj?.projectName === 'string' ? proj.projectName : ''));
    const rawDesc = typeof proj?.description === 'string' ? proj.description : (typeof proj?.desc === 'string' ? proj.desc : (typeof proj?.summary === 'string' ? proj.summary : ''));
    const rawCategory = typeof proj?.category === 'string' ? proj.category : (typeof proj?.subCategory === 'string' ? proj.subCategory : 'Featured Work');
    const techArr = Array.isArray(proj?.technologies) 
      ? proj.technologies.map((t: any) => typeof t === 'string' ? t : (t?.name || t?.title || String(t || '')))
      : (Array.isArray(proj?.tags) ? proj.tags.map((t: any) => typeof t === 'string' ? t : (t?.name || t?.title || String(t || ''))) : []);
    const imgUrl = typeof proj?.image === 'string' ? proj.image : (typeof proj?.imageUrl === 'string' ? proj.imageUrl : (typeof proj?.thumbnail === 'string' ? proj.thumbnail : null));

    return {
      id: proj?.id || `proj-${idx + 1}`,
      key: proj?.id || `proj-${idx + 1}`,
      title: rawTitle || 'Project Title',
      name: rawTitle || 'Project Title',
      subtitle: typeof proj?.subtitle === 'string' ? proj.subtitle : (techArr.slice(0, 2).join(' • ')),
      desc: rawDesc,
      description: rawDesc,
      category: rawCategory,
      tags: techArr,
      technologies: techArr,
      stack: techArr,
      imageUrl: imgUrl,
      image: imgUrl,
      github: typeof proj?.githubUrl === 'string' ? proj.githubUrl : (typeof proj?.github === 'string' ? proj.github : ''),
      githubUrl: typeof proj?.githubUrl === 'string' ? proj.githubUrl : (typeof proj?.github === 'string' ? proj.github : ''),
      demo: typeof proj?.liveUrl === 'string' ? proj.liveUrl : (typeof proj?.demo === 'string' ? proj.demo : ''),
      liveUrl: typeof proj?.liveUrl === 'string' ? proj.liveUrl : (typeof proj?.demo === 'string' ? proj.demo : ''),
      achievements: Array.isArray(proj?.achievements) ? proj.achievements.map((a: any) => typeof a === 'string' ? a : (a?.title || String(a || ''))) : []
    };
  });

  const experience = (p.experience || []).map((exp: any, idx: number) => {
    const rawCompany = typeof exp?.company === 'string' ? exp.company : (typeof exp?.organization === 'string' ? exp.organization : (typeof exp?.employer === 'string' ? exp.employer : ''));
    const rawRole = typeof exp?.role === 'string' ? exp.role : (typeof exp?.title === 'string' ? exp.title : (typeof exp?.position === 'string' ? exp.position : ''));
    const rawDesc = typeof exp?.description === 'string' ? exp.description : (typeof exp?.desc === 'string' ? exp.desc : (typeof exp?.summary === 'string' ? exp.summary : ''));
    const bullets = Array.isArray(exp?.achievements) 
      ? exp.achievements.map((a: any) => typeof a === 'string' ? a : (a?.title || String(a || ''))) 
      : (Array.isArray(exp?.highlights) ? exp.highlights.map((h: any) => typeof h === 'string' ? h : String(h || '')) : []);

    const dateInfo = normalizeExperienceDates(exp);

    return {
      id: exp?.id ? `${exp.id}-${idx}` : `exp-${idx}`,
      key: exp?.id ? `${exp.id}-${idx}` : `exp-${idx}`,
      company: rawCompany,
      subtitle: rawCompany,
      role: rawRole,
      title: rawRole,
      ...dateInfo,
      desc: rawDesc,
      description: rawDesc,
      bullets,
      highlights: bullets
    };
  });

  const education = (p.education || []).map((edu: any, idx: number) => {
    const rawSchool = typeof edu?.institution === 'string' ? edu.institution : (typeof edu?.school === 'string' ? edu.school : (typeof edu?.university === 'string' ? edu.university : ''));
    const rawDegree = typeof edu?.degree === 'string' ? edu.degree : (typeof edu?.title === 'string' ? edu.title : (typeof edu?.credential === 'string' ? edu.credential : ''));
    const rawDesc = typeof edu?.description === 'string' ? edu.description : (typeof edu?.desc === 'string' ? edu.desc : '');

    const dateInfo = normalizeEducationDates(edu);

    return {
      id: edu?.id ? `${edu.id}-${idx}` : `edu-${idx}`,
      key: edu?.id ? `${edu.id}-${idx}` : `edu-${idx}`,
      institution: rawSchool,
      school: rawSchool,
      degree: rawDegree,
      title: rawDegree,
      department: typeof edu?.department === 'string' ? edu.department : '',
      specialization: typeof edu?.specialization === 'string' ? edu.specialization : '',
      ...dateInfo,
      cgpa: typeof edu?.gpa === 'string' ? edu.gpa : (typeof edu?.cgpa === 'string' ? edu.cgpa : ''),
      desc: rawDesc,
      description: rawDesc
    };
  });

  const skills = (p.skills || []).map((sk: any, idx: number) => {
    if (typeof sk === 'string') {
      return sk;
    }
    const rawName = typeof sk?.name === 'string' ? sk.name : (typeof sk?.title === 'string' ? sk.title : (typeof sk?.skill === 'string' ? sk.skill : (typeof sk === 'string' ? sk : 'Skill')));
    const rawCategory = typeof sk?.category === 'string' ? sk.category : (typeof sk?.group === 'string' ? sk.group : 'Core Skill');
    const rawProf = typeof sk?.proficiency === 'string' ? sk.proficiency : (typeof sk?.level === 'string' ? sk.level : 'Advanced');

    return {
      id: sk?.id ? `${sk.id}-${idx}` : `skill-${idx}`,
      key: sk?.id ? `${sk.id}-${idx}` : `skill-${idx}`,
      name: rawName || 'Skill',
      title: rawName || 'Skill',
      skill: rawName || 'Skill',
      category: rawCategory || 'Core Skill',
      proficiency: rawProf || 'Advanced',
      level: rawProf || 'Advanced'
    };
  });

  const certifications = (p.certifications || []).map((cert: any, idx: number) => {
    const rawName = typeof cert?.name === 'string' ? cert.name : (typeof cert?.title === 'string' ? cert.title : (typeof cert?.credential === 'string' ? cert.credential : ''));
    const rawOrg = typeof cert?.organization === 'string' ? cert.organization : (typeof cert?.issuer === 'string' ? cert.issuer : '');

    return {
      id: cert?.id ? `${cert.id}-${idx}` : `cert-${idx}`,
      key: cert?.id ? `${cert.id}-${idx}` : `cert-${idx}`,
      name: rawName,
      title: rawName,
      organization: rawOrg,
      issuer: rawOrg,
      issueDate: typeof cert?.issueDate === 'string' ? cert.issueDate : (typeof cert?.year === 'string' ? cert.year : ''),
      year: typeof cert?.issueDate === 'string' ? cert.issueDate : (typeof cert?.year === 'string' ? cert.year : ''),
      credentialId: typeof cert?.credentialId === 'string' ? cert.credentialId : '',
      credentialUrl: typeof cert?.credentialUrl === 'string' ? cert.credentialUrl : (typeof cert?.link === 'string' ? cert.link : '')
    };
  });

  // 3. Intelligent Domain & Profession Content Derivation
  const candidateText = `${headline} ${summary} ${p.personal?.summary || ''} ${(p.skills || []).map((s: any) => typeof s === 'string' ? s : s.name).join(' ')} ${(p.experience || []).map((e: any) => `${e.role} ${e.company}`).join(' ')} ${(p.education || []).map((ed: any) => `${ed.degree} ${ed.department || ''}`).join(' ')}`;
  const lowerText = candidateText.toLowerCase();

  // Compute realistic years of active experience
  let earliestYear = 9999;
  const currentYear = new Date().getFullYear();
  (p.experience || []).forEach((exp: any) => {
    const start = exp.startDate || exp.startYear || exp.start || exp.period || exp.year || '';
    const match = String(start).match(/\b(19\d\d|20\d\d)\b/);
    if (match) {
      const y = parseInt(match[1], 10);
      if (y > 1980 && y < earliestYear) earliestYear = y;
    }
  });
  if (earliestYear === 9999) {
    (p.education || []).forEach((edu: any) => {
      const start = edu.startDate || edu.startYear || edu.start || edu.period || edu.year || '';
      const match = String(start).match(/\b(19\d\d|20\d\d)\b/);
      if (match) {
        const y = parseInt(match[1], 10);
        if (y > 1980 && y < earliestYear) earliestYear = y;
      }
    });
  }
  let yearsNum = 3;
  if (earliestYear !== 9999 && earliestYear <= currentYear) {
    yearsNum = Math.max(1, currentYear - earliestYear);
  } else if (p.experience && p.experience.length > 0) {
    yearsNum = Math.max(2, p.experience.length * 2);
  }
  const yearsStr = `${yearsNum}+`;
  const projectsNum = Math.max(projects.length > 0 ? projects.length : 6, 4);
  const skillsNum = Math.max(skills.length > 0 ? skills.length : 16, 8);

  // Detect domain
  let detectedDomain: 'TECH' | 'DESIGN' | 'LEGAL' | 'HEALTHCARE' | 'FINANCE' | 'MARKETING' | 'GENERAL' = 'TECH';
  if (lowerText.match(/legal|law|attorney|lawyer|counsel|juris|litigation|paralegal|advocate/)) {
    detectedDomain = 'LEGAL';
  } else if (lowerText.match(/doctor|physician|nurse|medical|clinical|surgeon|dentist|pharmac|hospital|patient/)) {
    detectedDomain = 'HEALTHCARE';
  } else if (lowerText.match(/design|ui\/ux|ux\/ui|product design|graphic|visual design|motion|illustrat|figma/)) {
    detectedDomain = 'DESIGN';
  } else if (lowerText.match(/finance|banking|accountant|financial|investment|audit|fintech|cpa|wealth/)) {
    detectedDomain = 'FINANCE';
  } else if (lowerText.match(/marketing|seo|growth|content|social media|brand manager|copywrit|pr/)) {
    detectedDomain = 'MARKETING';
  }

  let domainBadgeLabel = `${yearsStr} Years Engineering`;
  let domainMetrics = [
    { id: "1", number: yearsNum, suffix: "+", label: "Years Experience", description: "In software engineering, scalable architectures & modern frameworks.", iconName: "Briefcase" },
    { id: "2", number: projectsNum, suffix: "+", label: "Projects Shipped", description: "Production web applications, APIs & open-source tools.", iconName: "FolderGit2" },
    { id: "3", number: skillsNum, suffix: "+", label: "Technologies Mastered", description: "Modern languages, cloud systems & verified competencies.", iconName: "Cpu" },
    { id: "4", number: 99.8, suffix: "%", label: "Code Quality & CSAT", description: "Consistent 60fps UX, high reliability & client satisfaction.", iconName: "ShieldCheck" },
  ];
  let domainPrinciples = [
    { title: "Clean & Scalable Architecture", description: "Writing modular, test-driven, and fault-tolerant codebases.", icon: "✦" },
    { title: "Performance & Reliability", description: "Sub-100ms response times, fluid 60fps UX, and zero computational waste.", icon: "✦" },
    { title: "Continuous Innovation", description: "Adopting bleeding-edge AI models, modern frameworks, and best engineering practices.", icon: "✦" },
  ];
  let domainCoreValues = [
    { title: "Speed & Fluidity", desc: "60fps interactions, sub-100ms response times, zero visual clutter." },
    { title: "Resilient Architecture", desc: "Fault-tolerant, auto-scaling, and clean modular codebases." },
    { title: "Empathetic Engineering", desc: "Software crafted to delight users and solve genuine real-world needs." },
  ];

  if (detectedDomain === 'DESIGN') {
    domainBadgeLabel = `${yearsStr} Years Design Craft`;
    domainMetrics = [
      { id: "1", number: yearsNum, suffix: "+", label: "Years Experience", description: "In product design, UI/UX architecture & user research.", iconName: "Briefcase" },
      { id: "2", number: projectsNum, suffix: "+", label: "Projects Delivered", description: "End-to-end design systems, mobile apps & web interfaces.", iconName: "FolderGit2" },
      { id: "3", number: 99, suffix: "%", label: "Client Satisfaction", description: "User-centric designs driving measurable engagement.", iconName: "ShieldCheck" },
      { id: "4", number: skillsNum, suffix: "+", label: "Design Capabilities", description: "Figma, design systems, interactive prototypes & typography.", iconName: "Award" },
    ];
    domainPrinciples = [
      { title: "Human-Centered Empathy", description: "Designing intuitive interfaces rooted in qualitative user research and ergonomics.", icon: "✦" },
      { title: "Pixel-Perfect Craft", description: "Obsession with typography, micro-interactions, layout balance, and design systems.", icon: "✦" },
      { title: "Modern Design Architecture", description: "Bridging the gap between design tokens, scalable components, and production code.", icon: "✦" },
    ];
    domainCoreValues = [
      { title: "Human-Centered Craft", desc: "Intuitive interfaces rooted in ergonomics and qualitative research." },
      { title: "Systemic Scalability", desc: "Component design systems that scale seamlessly across platforms." },
      { title: "Delightful Micro-UX", desc: "Thoughtful animations, typography hierarchy, and effortless workflows." },
    ];
  } else if (detectedDomain === 'LEGAL') {
    domainBadgeLabel = `${yearsStr} Years Legal Excellence`;
    domainMetrics = [
      { id: "1", number: yearsNum, suffix: "+", label: "Years Experience", description: "In legal research, compliance audits & strategic advisory.", iconName: "Briefcase" },
      { id: "2", number: Math.max(projectsNum * 8, 45), suffix: "+", label: "Matters & Briefs Handled", description: "Contract negotiation, compliance audits & strategic counsel.", iconName: "Award" },
      { id: "3", number: 40, suffix: "+", label: "Client Accounts", description: "Advising enterprise leaders, startups & executive boards.", iconName: "Building2" },
      { id: "4", number: 99, suffix: "%", label: "Client Trust Score", description: "Uncompromising dedication to client outcome and ethics.", iconName: "ShieldCheck" },
    ];
  } else if (detectedDomain === 'HEALTHCARE') {
    domainBadgeLabel = `${yearsStr} Years Clinical Excellence`;
    domainMetrics = [
      { id: "1", number: yearsNum, suffix: "+", label: "Years Experience", description: "In patient care, diagnostics & healthcare excellence.", iconName: "Briefcase" },
      { id: "2", number: Math.max(projectsNum * 25, 250), suffix: "+", label: "Patients & Consults", description: "Comprehensive diagnoses, treatments & patient care plans.", iconName: "Award" },
      { id: "3", number: 99.5, suffix: "%", label: "Patient Care Score", description: "Dedicated compassionate healthcare and clinical precision.", iconName: "ShieldCheck" },
      { id: "4", number: skillsNum, suffix: "+", label: "Clinical Competencies", description: "Diagnostics, treatment protocols & patient safety standards.", iconName: "Cpu" },
    ];
  }

  const domainStats = domainMetrics.map(m => ({
    value: `${m.number}${m.suffix}`,
    label: m.label,
    desc: m.description,
    description: m.description,
    iconName: m.iconName
  }));

  const dynamicLanguages = (Array.isArray(p.languages) && p.languages.length > 0)
    ? p.languages.map((l: any) => typeof l === 'string' ? l : (l.name || l.title || String(l))).join(', ')
    : 'English';

  const domainQuickFacts = {
    role: headline || fullName || "Software Developer",
    location: location || "Remote / Worldwide",
    experience: `${yearsStr} Years Active`,
    status: (personal as any).availability || (p as any).availability || '🟢 Available for Opportunities',
    languages: dynamicLanguages
  };

  // 4. Assemble Bound Data Object
  const boundData: Record<string, any> = {
    mode,
    templateId,
    name: fullName || undefined,
    fullName: fullName || undefined,
    headline: headline || undefined,
    title: (p as any).portfolioTitle || (p as any).title || undefined,
    tagline: headline || undefined,
    role: headline || undefined,
    location: location || undefined,
    profileImage: profilePhoto || undefined,
    avatarUrl: profilePhoto || undefined,
    aboutMe: summary || undefined,
    badgeYears: yearsStr,
    badgeLabel: domainBadgeLabel,
    badgeSatisfaction: "99.8%",
    stats: (p as any).stats || domainStats,
    metrics: (p as any).metrics || domainMetrics,
    coreValues: (p as any).coreValues || domainCoreValues,
    principles: (p as any).principles || domainPrinciples,
    pillars: (p as any).principles || domainPrinciples,
    quickFacts: domainQuickFacts,

    personal: {
      name: fullName,
      fullName: fullName,
      role: headline,
      headline: headline,
      location: location,
      email: personal.email || (p as any).email || (p as any).ownerEmail || '',
      phone: personal.phone || (p as any).phone || '',
      profilePhoto: profilePhoto,
      avatarUrl: profilePhoto,
      summary: summary,
      bio: summary,
      availability: (personal as any).availability || (p as any).availability || '🟢 Available for Opportunities',
      experienceYears: `${yearsStr} Years Active`,
      languages: dynamicLanguages,
      stats: domainStats,
    },

    profile: {
      name: fullName,
      fullName: fullName,
      headline,
      bio: summary,
      summary,
      location,
      university: (p as any).university || (education[0]?.institution) || '',
      degree: (p as any).degree || (education[0]?.degree) || '',
      graduationYear: (p as any).graduationYear || ((education[0] as any)?.year) || '',
      avatarUrl: profilePhoto,
      photo: profilePhoto,
      email: p.personal?.email || '',
      phone: p.personal?.phone || '',
      yearsOfExperience: yearsNum,
      projectsCompleted: projectsNum,
      stats: domainStats,
      coreValues: domainCoreValues,
      hobbies: [
        { name: "System Architecture" },
        { name: "Continuous Learning" },
        { name: "Open Source Contributor" },
        { name: "Tech Innovation" }
      ]
    },

    hero: {
      title: (p as any).heroTitle || (p as any).hero?.title || undefined,
      name: fullName || undefined,
      fullName: fullName || undefined,
      subtitle: headline || undefined,
      role: headline || undefined,
      headline: headline || undefined,
      description: summary || headline || undefined,
      introductionText: summary || headline || undefined,
      location: location || undefined,
      avatarUrl: profilePhoto || undefined,
      availability: (personal as any).availability || (p as any).availability || undefined,
      badgeYears: yearsStr,
      badgeLabel: domainBadgeLabel,
      badgeSatisfaction: "99.8%",
      stats: domainStats,
      metrics: domainMetrics,
      quickFacts: domainQuickFacts,
    },

    about: {
      headline: (p as any).aboutHeadline || (p as any).about?.headline || undefined,
      title: (p as any).aboutTitle || (p as any).about?.title || undefined,
      name: fullName || undefined,
      avatarUrl: profilePhoto || undefined,
      description: summary || undefined,
      bio: summary || undefined,
      location: location || undefined,
      stats: domainStats,
      metrics: domainMetrics,
      principles: domainPrinciples,
      pillars: domainPrinciples,
      coreValues: domainCoreValues,
      quickFacts: domainQuickFacts,
      role: headline,
      languages: dynamicLanguages,
      experienceYears: `${yearsStr} Years Active`,
    },

    projects: Array.isArray(projects) ? projects : [],
    experience: Array.isArray(experience) ? experience : [],
    timeline: Array.isArray(experience) ? experience : [],
    education: Array.isArray(education) ? education : [],
    skills: Array.isArray(skills) ? skills : [],
    certifications: Array.isArray(certifications) ? certifications : [],

    social: {
      linkedin: p.social?.linkedin || (p as any).socials?.linkedin || '',
      github: p.social?.github || (p as any).socials?.github || '',
      twitter: p.social?.twitter || (p as any).socials?.twitter || (p as any).socials?.x || '',
      instagram: (p.social as any)?.instagram || (p as any).socials?.instagram || '',
      dribbble: (p.social as any)?.dribbble || (p as any).socials?.dribbble || '',
      behance: (p.social as any)?.behance || (p as any).socials?.behance || '',
      website: (p.social as any)?.website || (p as any).socials?.website || '',
      ...(p.social || {}),
      ...((p as any).socials || {})
    },
    socialLinks: Array.isArray(p.social?.otherLinks) && p.social.otherLinks.length > 0
      ? p.social.otherLinks
      : Object.entries(p.social || {})
          .filter(([k, v]) => typeof v === 'string' && v.startsWith('http'))
          .map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), url: v, display: String(v).replace(/^https?:\/\//, '') })),
    languages: p.languages || [],
    awards: p.awards || [],
    publications: p.publications || [],
    achievements: (p as any).achievements || undefined,
    interests: (p as any).interests || undefined,

    // Explicit Template Overrides Layer
    ...overrides
  };

  return boundData;
}
