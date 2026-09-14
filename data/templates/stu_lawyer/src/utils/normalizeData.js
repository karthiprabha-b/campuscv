import { DEFAULT_EXECUTIVE_DATA as FALLBACK_DEF } from './defaultData';

const BACKUP_DEF = {
  name: "Alexander Vance",
  title: "Executive Legal Counsel & Corporate Strategist",
  roleLabel: "Legal & Corporate Advisory",
  hero: {
    smallLabel: "WELCOME TO MY EXECUTIVE PORTFOLIO",
    headline: "Strategic Legal Counsel.",
    highlightText: "Committed to Excellence.",
    intro: "Providing high-stakes corporate counsel, regulatory compliance strategies, and bespoke legal advisory for fortune leaders, startups, and high-net-worth clients.",
    summary: "Over 8+ years of expertise in corporate jurisprudence, cross-border M&A negotiations, commercial litigation defense, and intellectual property protection.",
    name: "Alexander Vance",
    title: "Senior Legal Counsel & Partner",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
    badgeYears: "8+",
    badgeLabel: "Years Legal Excellence",
    badgeSatisfaction: "99.4%",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      dribbble: "https://dribbble.com",
    },
  },
  metrics: [
    { id: "1", number: 8, suffix: "+", label: "Years Experience", description: "In top-tier corporate litigation and legal advisory.", iconName: "Briefcase" },
    { id: "2", number: 180, suffix: "+", label: "Cases & Deals Closed", description: "Cross-border mergers, tech IPOs, and commercial disputes.", iconName: "Award" },
    { id: "3", number: 45, suffix: "+", label: "Corporate Clients", description: "From Fortune 500 enterprises to high-growth scaleups.", iconName: "Building2" },
    { id: "4", number: 99, suffix: "%", label: "Success Rate", description: "Uncompromising dedication to client outcome and ethics.", iconName: "ShieldCheck" },
  ],
  about: {
    story: "With a distinguished career rooted in top-tier appellate litigation and corporate strategy, I advise boardrooms on high-velocity transactions, corporate governance, and complex dispute resolution. My practice bridges rigorous statutory legal mastery with modern tech-forward business agility.",
    mission: "To deliver uncompromising, result-driven legal leadership that safeguards capital, minimizes operational risk, and accelerates enterprise growth.",
    values: ["Unwavering Integrity", "Strategic Foresight", "Transparent Advocacy", "Fiduciary Excellence"],
    educationShort: "LL.M. Harvard Law School | J.D. Columbia University",
    location: "New York & London",
    availability: "Available for Board Advisory & Retainers",
    languages: ["English (Native)", "French (Fluent)", "German (Conversational)"],
    expertise: ["Corporate M&A", "Commercial Litigation", "Regulatory Compliance", "IP & Tech Law", "Risk Management"],
  },
  services: [
    { id: "s1", title: "Corporate Governance & M&A", description: "Structured advisory for multi-million dollar acquisitions, venture financing rounds, and shareholder structuring.", detailedPoints: ["Due diligence audits", "Share purchase agreements", "Regulatory filings", "Joint venture framing"], iconName: "Scale" },
    { id: "s2", title: "Commercial Litigation Defense", description: "High-stakes representation in arbitration, contract breach disputes, and federal appellate courts.", detailedPoints: ["Pre-trial negotiation", "Arbitration & mediation", "Contract enforcement", "Asset protection"], iconName: "Shield" },
    { id: "s3", title: "Tech & IP Regulation", description: "Safeguarding trade secrets, global trademark portfolios, data privacy (GDPR/CCPA), and AI compliance.", detailedPoints: ["Patent & trademark strategy", "Data privacy frameworks", "SaaS agreements", "Licensing terms"], iconName: "FileText" },
    { id: "s4", title: "Crisis Management & Compliance", description: "Rapid-response legal defense for regulatory inquiries, anti-trust investigations, and executive risk.", detailedPoints: ["Internal investigations", "Whistleblower defense", "Media legal strategy", "Compliance training"], iconName: "CheckCircle2" },
  ],
  skills: [
    {
      category: "Legal & Regulatory",
      skills: [
        { name: "Corporate Jurisprudence", level: 95 },
        { name: "M&A Structuring", level: 92 },
        { name: "Commercial Contracts", level: 98 },
        { name: "IP & Antitrust Law", level: 88 },
      ],
    },
    {
      category: "Consulting & Strategy",
      skills: [
        { name: "Enterprise Risk Advisory", level: 94 },
        { name: "Regulatory Compliance", level: 96 },
        { name: "Boardroom Negotiations", level: 90 },
        { name: "Cross-Border Arbitration", level: 86 },
      ],
    },
    {
      category: "Tools & Governance",
      skills: [
        { name: "LexisNexis & Westlaw", level: 95 },
        { name: "Ironclad CLM", level: 90 },
        { name: "DocuSign eSignature", level: 98 },
        { name: "Compliance AI", level: 85 },
      ],
    },
  ],
  projects: [
    {
      id: "p1",
      title: "$1.4B Cross-Border Tech Acquisition",
      category: "M&A Structuring",
      description: "Structured multi-jurisdictional buyout agreement for Silicon Valley enterprise SaaS provider expanding into EMEA.",
      longDescription: "Spearheaded regulatory anti-trust clearance across 4 regulatory authorities, drafted IP transfer covenants, and negotiated debt-financing terms protecting client shareholder equity.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      techStack: ["M&A Law", "Antitrust Filings", "Cross-Border Escrow", "IP Assignment"],
      featured: true,
      impactMetrics: ["$1.4B Valuation Finalized", "Zero Regulatory Injunctions", "Approved in 90 Days"],
    },
    {
      id: "p2",
      title: "Global AI Data Compliance Framework",
      category: "Tech & IP Regulation",
      description: "Drafted sovereign privacy architecture and enterprise LLM licensing agreements for Fortune 100 fintech group.",
      longDescription: "Engineered legal compliance pipelines aligning automated generative AI workflows with GDPR, CCPA, and the EU AI Act statutory frameworks.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      techStack: ["EU AI Act", "GDPR Architecture", "SaaS Licensing", "Algorithmic Audit"],
      featured: true,
      impactMetrics: ["100% Privacy Compliance", "Protected 45M User Records", "Implemented in 14 Nations"],
    },
    {
      id: "p3",
      title: "Commercial Appellate Defense Victory",
      category: "Litigation & Arbitration",
      description: "Defended renewable energy conglomerate in $85M breach of contract lawsuit, obtaining complete dismissal.",
      longDescription: "Drafted appellate briefs highlighting contract ambiguity in force majeure clauses, securing summary judgment dismissal with full legal fee reimbursement.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      techStack: ["Commercial Litigation", "Appellate Briefs", "Summary Judgment", "Contract Law"],
      featured: false,
      impactMetrics: ["$85M Liability Dismissed", "100% Legal Cost Recovery", "Precedent Set in 2nd Circuit"],
    },
  ],
  experience: [
    {
      id: "exp1",
      role: "Senior Partner & Practice Chair",
      company: "Vance & Sterling LLP",
      type: "Executive Partnership",
      duration: "2021 - Present",
      location: "New York & London",
      achievements: [
        "Head of the Global Tech M&A & Private Equity Practice leading 25+ senior associates and partners.",
        "Advised on $6.2B aggregate deal volume across cross-border tech mergers, SaaS carve-outs, and venture financings.",
        "Represented premier enterprise technology firms before federal appellate courts and international commercial arbitration tribunals."
      ],
      technologies: ["Tech M&A", "Cross-Border Tax", "Corporate Governance", "Boardroom Advisory", "Private Equity"]
    },
    {
      id: "exp2",
      role: "Senior Legal Counsel",
      company: "Apex Global Technologies",
      type: "In-House Executive",
      duration: "2018 - 2021",
      location: "San Francisco, CA",
      achievements: [
        "Oversaw all corporate legal operations, multi-jurisdiction regulatory compliance, and patent IP portfolios during Series C through IPO readiness.",
        "Structured enterprise licensing agreements valued at over $300M with Fortune 50 clients.",
        "Instituted automated contract lifecycle management (CLM) decreasing contract cycle turnaround times by 45%."
      ],
      technologies: ["Commercial Contracts", "IP Licensing", "SEC Compliance", "Data Privacy", "Venture Capital"]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Harvard Law School",
      degree: "Master of Laws (LL.M.) in Corporate Finance & Governance",
      duration: "2015 - 2016",
      location: "Cambridge, MA",
      description: "Focused on international financial transactions, antitrust regulation, and boardroom fiduciary dynamics.",
      honors: "Dean's Scholar Prize in Corporate Governance",
    },
    {
      id: "edu2",
      institution: "Columbia Law School",
      degree: "Juris Doctor (J.D.)",
      duration: "2012 - 2015",
      location: "New York, NY",
      description: "Senior Editor, Columbia Law Review. Concentrated in Securities Regulation and Appellate Litigation.",
      honors: "James Kent Scholar (Top 2% of Class)",
    },
    {
      id: "edu3",
      institution: "Yale University",
      degree: "Bachelor of Arts (B.A.) in Economics & Ethics",
      duration: "2008 - 2012",
      location: "New Haven, CT",
      description: "Summa Cum Laude, Phi Beta Kappa honors. President of the Yale Political Union.",
      honors: "Summa Cum Laude • Phi Beta Kappa",
    },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Marcus Sterling",
      role: "Managing Director & General Partner",
      organization: "Sterling Peak Capital",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      review: "Alexander's ability to navigate cutthroat antitrust obstacles while preserving deal momentum was instrumental in closing our $1.4B buyout ahead of schedule. Truly an elite corporate strategist.",
      rating: 5,
      type: "Client",
    },
    {
      id: "t2",
      name: "Elena Rostova",
      role: "Chief Legal Officer",
      organization: "Vanguard Biotech Inc.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      review: "In high-stakes federal litigation, having Alexander in our corner gave the executive board total confidence. Unrivaled courtroom presence and razor-sharp brief writing.",
      rating: 5,
      type: "Client",
    },
    {
      id: "t3",
      name: "Dean Arthur Pendelton",
      role: "Professor of Jurisprudence",
      organization: "Columbia Law School",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      review: "Alexander was among the most brilliant legal minds to graduate our chambers in a generation. His ethical clarity and fiduciary discipline set the gold standard.",
      rating: 5,
      type: "Mentor",
    },
  ],
};

export function normalizeData(raw = {}) {
  const data = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
  const def = (FALLBACK_DEF && typeof FALLBACK_DEF === 'object' && FALLBACK_DEF.hero) ? FALLBACK_DEF : BACKUP_DEF;

  // Safe object extractors
  const rawHero = (data?.hero && typeof data.hero === 'object') ? data.hero : {};
  const rawPersonalInfo = (data?.personalInfo && typeof data.personalInfo === 'object') ? data.personalInfo : {};
  const rawBasics = (data?.basics && typeof data.basics === 'object') ? data.basics : {};
  const rawAbout = (data?.about && typeof data.about === 'object') ? data.about : {};
  const rawContact = (data?.contact && typeof data.contact === 'object') ? data.contact : {};

  // 1. Name & Title
  const name =
    data?.name ||
    rawHero?.name ||
    rawPersonalInfo?.fullName ||
    rawPersonalInfo?.name ||
    rawBasics?.name ||
    def?.name ||
    "Alexander Vance";

  const title =
    data?.role ||
    data?.title ||
    rawHero?.role ||
    rawHero?.title ||
    rawPersonalInfo?.title ||
    rawBasics?.headline ||
    data?.headline ||
    def?.title ||
    "Executive Legal Counsel";

  const customHeadline = rawHero?.headline || data?.headline || data?.role || rawHero?.title;

  // 2. Hero
  const hero = {
    smallLabel: rawHero?.smallLabel || data?.smallLabel || "WELCOME TO MY EXECUTIVE PORTFOLIO",
    headline: customHeadline || def?.hero?.headline || "Strategic Legal Counsel.",
    highlightText: rawHero?.highlightText || data?.highlightText || (customHeadline ? "" : (def?.hero?.highlightText || "Committed to Excellence.")),
    intro:
      rawHero?.intro ||
      rawHero?.introductionText ||
      rawHero?.description ||
      data?.aboutMe ||
      data?.bio ||
      rawAbout?.description ||
      rawAbout?.bio ||
      data?.summary ||
      rawPersonalInfo?.summary ||
      rawBasics?.summary ||
      def?.hero?.intro ||
      "Providing high-stakes corporate counsel and bespoke legal advisory.",
    summary:
      rawHero?.summary ||
      data?.summaryQuote ||
      (data?.aboutMe || data?.bio ? "" : (def?.hero?.summary || "Over 8+ years of expertise in corporate jurisprudence and strategy.")),
    name: name,
    title: title,
    avatarUrl:
      rawHero?.avatarUrl ||
      rawHero?.profileImage ||
      data?.avatarUrl ||
      data?.profileImage ||
      rawAbout?.avatarUrl ||
      rawAbout?.profileImage ||
      rawPersonalInfo?.photoUrl ||
      rawBasics?.picture ||
      def?.hero?.avatarUrl ||
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
    badgeYears: rawHero?.badgeYears || (Array.isArray(data?.experience) && data.experience.length > 0 ? `${data.experience.length}+` : def?.hero?.badgeYears) || "8+",
    badgeLabel: rawHero?.badgeLabel || def?.hero?.badgeLabel || "Years Professional Excellence",
    badgeSatisfaction: rawHero?.badgeSatisfaction || def?.hero?.badgeSatisfaction || "99.4%",
    socials: normalizeSocials(rawHero?.socials || data?.socials || data?.socialLinks || def?.hero?.socials),
  };

  // 3. Metrics
  const metrics =
    Array.isArray(data?.metrics) && data.metrics.length > 0
      ? data.metrics.filter(Boolean).map((m, idx) => {
          const item = typeof m === 'object' ? m : { number: m };
          return {
            id: item.id || `m-${idx}`,
            number: item.number !== undefined ? item.number : (def?.metrics?.[idx % (def?.metrics?.length || 1)]?.number || 8),
            suffix: item.suffix || "+",
            label: item.label || def?.metrics?.[idx % (def?.metrics?.length || 1)]?.label || "Metric",
            description: item.description || def?.metrics?.[idx % (def?.metrics?.length || 1)]?.description || "",
            iconName: item.iconName || def?.metrics?.[idx % (def?.metrics?.length || 1)]?.iconName || "Award",
          };
        })
      : def?.metrics || BACKUP_DEF.metrics;

  // 4. About
  const about = {
    story:
      rawAbout?.story ||
      rawAbout?.bio ||
      rawAbout?.description ||
      data?.aboutMe ||
      data?.bio ||
      data?.summary ||
      def?.about?.story ||
      BACKUP_DEF.about.story,
    mission: rawAbout?.mission || data?.mission || (data?.aboutMe || data?.bio ? `To deliver high-impact results, uphold excellence, and advance innovations as a ${title}.` : (def?.about?.mission || BACKUP_DEF.about.mission)),
    values:
      Array.isArray(rawAbout?.values) && rawAbout.values.length > 0
        ? rawAbout.values
        : Array.isArray(data?.values) && data.values.length > 0
        ? data.values
        : (Array.isArray(data?.skills) && data.skills.length > 0
            ? data.skills.slice(0, 4).map((s) => (typeof s === 'string' ? s : s?.name || s?.title || String(s)))
            : (def?.about?.values || BACKUP_DEF.about.values)),
    educationShort:
      rawAbout?.educationShort ||
      data?.educationShort ||
      (Array.isArray(data?.education) && data.education[0]
        ? `${data.education[0].degree || ''} | ${data.education[0].institution || data.education[0].school || ''}`.trim()
        : (def?.about?.educationShort || BACKUP_DEF.about.educationShort)),
    location:
      rawAbout?.location ||
      data?.location ||
      rawContact?.location ||
      rawPersonalInfo?.location ||
      rawBasics?.location?.city ||
      def?.about?.location ||
      BACKUP_DEF.about.location,
    availability:
      rawAbout?.availability ||
      data?.availability ||
      data?.personal?.availability ||
      "Available for Opportunities",
    languages:
      Array.isArray(rawAbout?.languages) && rawAbout.languages.length > 0
        ? rawAbout.languages
        : Array.isArray(data?.languages) && data.languages.length > 0
        ? data.languages.map((l) => (typeof l === 'string' ? l : l?.name || l?.language || String(l)))
        : ["English (Professional)"],
    expertise:
      Array.isArray(rawAbout?.expertise) && rawAbout.expertise.length > 0
        ? rawAbout.expertise
        : Array.isArray(data?.expertise) && data.expertise.length > 0
        ? data.expertise
        : (Array.isArray(data?.skills) && data.skills.length > 0
            ? data.skills.slice(0, 5).map((s) => (typeof s === 'string' ? s : s?.name || s?.title || String(s)))
            : (def?.about?.expertise || BACKUP_DEF.about.expertise)),
  };

  // 5. Skills
  const skills = normalizeSkills(data?.skills, def?.skills || BACKUP_DEF.skills);

  // 6. Projects
  const projects = normalizeProjects(data?.projects || data?.featuredProjects || data?.caseStudies, def?.projects || BACKUP_DEF.projects);

  // 7. Services
  const services = normalizeServices(data?.services || data?.practiceAreas, def?.services || BACKUP_DEF.services);

  // 8. Experience
  const experience = normalizeExperience(data?.experience || data?.work || data?.history, def?.experience || BACKUP_DEF.experience);

  // 9. Education
  const education = normalizeEducation(data?.education || data?.academics, def?.education || BACKUP_DEF.education);

  // 10. Testimonials
  const testimonials = normalizeTestimonials(data?.testimonials || data?.references || data?.reviews, def?.testimonials || BACKUP_DEF.testimonials);

  // 11. Contact
  const email =
    rawContact?.email ||
    data?.email ||
    rawPersonalInfo?.email ||
    rawBasics?.email ||
    `contact@${String(name).toLowerCase().replace(/[^a-z0-9]/g, '') || 'vance'}.com`;

  const phone =
    rawContact?.phone ||
    data?.phone ||
    rawPersonalInfo?.phone ||
    rawBasics?.phone ||
    "+1 (212) 555-0198";

  return {
    ...data,
    name,
    title,
    hero,
    metrics,
    achievements: metrics,
    about,
    skills,
    projects,
    services,
    experience,
    education,
    testimonials,
    contact: {
      email,
      phone,
      location: about.location,
      hours: "Mon - Fri | 09:00 AM - 07:00 PM EST",
    },
  };
}

function normalizeSocials(rawSocials) {
  const def = BACKUP_DEF.hero.socials;
  if (!rawSocials) return def;

  if (Array.isArray(rawSocials)) {
    const res = { ...def };
    rawSocials.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const key = String(item.platform || item.network || item.name || '').toLowerCase();
      if (key.includes('linkedin')) res.linkedin = item.url || res.linkedin;
      if (key.includes('github')) res.github = item.url || res.github;
      if (key.includes('twitter') || key.includes('x')) res.twitter = item.url || res.twitter;
      if (key.includes('dribbble')) res.dribbble = item.url || res.dribbble;
    });
    return res;
  }

  if (typeof rawSocials === 'object') {
    return {
      linkedin: rawSocials.linkedin || def.linkedin,
      github: rawSocials.github || def.github,
      twitter: rawSocials.twitter || def.twitter,
      dribbble: rawSocials.dribbble || def.dribbble,
    };
  }

  return def;
}

function normalizeSkills(rawSkills, defSkills) {
  const def = defSkills || BACKUP_DEF.skills;
  if (!rawSkills || !Array.isArray(rawSkills) || rawSkills.length === 0) return def;

  // If skills are already pre-grouped with category and skills array
  if (rawSkills[0]?.category && Array.isArray(rawSkills[0]?.skills)) {
    return rawSkills.filter(Boolean).map((cat) => ({
      category: cat?.category || "Core Practice",
      skills: (cat?.skills || []).map((s) => (typeof s === 'string' ? { name: s, level: 90 } : { name: s?.name || s?.title || "Skill", level: s?.level || 90 })),
    }));
  }

  // Extract all skills from user data (strings or objects)
  const allSkills = rawSkills
    .filter(Boolean)
    .map((s) => (typeof s === 'string' ? { name: String(s), level: 95 } : { name: s?.name || s?.title || s?.skill || String(s), level: s?.level || 90 }))
    .filter(s => s.name && s.name.trim().length > 0);

  if (allSkills.length === 0) return def;

  const numCats = allSkills.length >= 3 ? 3 : (allSkills.length === 2 ? 2 : 1);
  const catNames = ["Legal & Regulatory", "Consulting & Strategy", "Tools & Governance"];

  const cats = Array.from({ length: numCats }, (_, i) => ({
    category: catNames[i] || `Expertise Area ${i + 1}`,
    skills: []
  }));

  // Distribute all skills into balanced columns so NO skills are dropped
  allSkills.forEach((skill, idx) => {
    const targetCat = idx % numCats;
    cats[targetCat].skills.push(skill);
  });

  return cats;
}

function normalizeProjects(rawProjects, defProjects) {
  const def = defProjects || BACKUP_DEF.projects;
  if (!rawProjects || !Array.isArray(rawProjects) || rawProjects.length === 0) return def;

  return rawProjects.filter(Boolean).map((p, idx) => {
    const item = typeof p === 'object' ? p : { title: String(p) };
    const defFallback = def[idx % def.length] || BACKUP_DEF.projects[0];
    return {
      id: item.id || `proj-${idx}`,
      title: item.title || item.name || defFallback.title,
      category: item.category || item.tag || defFallback.category,
      description: item.description || item.summary || defFallback.description,
      longDescription: item.longDescription || item.description || defFallback.longDescription,
      imageUrl: item.imageUrl || item.image || item.thumbnail || defFallback.imageUrl,
      techStack: Array.isArray(item.techStack) && item.techStack.length
        ? item.techStack
        : Array.isArray(item.technologies) && item.technologies.length
        ? item.technologies
        : defFallback.techStack,
      featured: item.featured !== undefined ? !!item.featured : idx === 0,
      impactMetrics: Array.isArray(item.impactMetrics) && item.impactMetrics.length
        ? item.impactMetrics
        : Array.isArray(item.highlights) && item.highlights.length
        ? item.highlights
        : defFallback.impactMetrics,
      githubUrl: item.githubUrl || item.github || "",
      liveUrl: item.liveUrl || item.link || item.url || "",
    };
  });
}

function normalizeServices(rawServices, defServices) {
  const def = defServices || BACKUP_DEF.services;
  if (!rawServices || !Array.isArray(rawServices) || rawServices.length === 0) return def;

  return rawServices.filter(Boolean).map((s, idx) => {
    const item = typeof s === 'object' ? s : { title: String(s) };
    const defFallback = def[idx % def.length] || BACKUP_DEF.services[0];
    return {
      id: item.id || `serv-${idx}`,
      title: item.title || item.name || defFallback.title,
      description: item.description || defFallback.description,
      detailedPoints: Array.isArray(item.detailedPoints) && item.detailedPoints.length
        ? item.detailedPoints
        : Array.isArray(item.points) && item.points.length
        ? item.points
        : defFallback.detailedPoints,
      iconName: item.iconName || defFallback.iconName || "Scale",
    };
  });
}

function normalizeExperience(rawExp, defExp) {
  const def = defExp || BACKUP_DEF.experience;
  if (!rawExp || !Array.isArray(rawExp) || rawExp.length === 0) return def;

  return rawExp.filter(Boolean).map((e, idx) => {
    const item = typeof e === 'object' ? e : { role: String(e) };
    const defFallback = def[idx % def.length] || BACKUP_DEF.experience[0];
    return {
      id: item.id || `exp-${idx}`,
      role: item.role || item.title || item.position || defFallback.role,
      company: item.company || item.employer || item.organization || defFallback.company,
      type: item.type || defFallback.type || "Executive Role",
      duration: item.duration || (item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : (item.year || defFallback.duration)),
      location: item.location || defFallback.location,
      achievements: Array.isArray(item.achievements) && item.achievements.length
        ? item.achievements
        : Array.isArray(item.highlights) && item.highlights.length
        ? item.highlights
        : item.description
        ? [item.description]
        : defFallback.achievements,
      technologies: Array.isArray(item.technologies) && item.technologies.length
        ? item.technologies
        : Array.isArray(item.skills) && item.skills.length
        ? item.skills
        : defFallback.technologies,
    };
  });
}

function normalizeEducation(rawEdu, defEdu) {
  const def = defEdu || BACKUP_DEF.education;
  if (!rawEdu || !Array.isArray(rawEdu) || rawEdu.length === 0) return def;

  return rawEdu.filter(Boolean).map((ed, idx) => {
    const item = typeof ed === 'object' ? ed : { institution: String(ed) };
    const defFallback = def[idx % def.length] || BACKUP_DEF.education[0];
    return {
      id: item.id || `edu-${idx}`,
      institution: item.institution || item.school || item.university || defFallback.institution,
      degree: item.degree || item.title || item.fieldOfStudy || defFallback.degree,
      duration: item.duration || (item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : (item.year || defFallback.duration)),
      location: item.location || defFallback.location,
      description: item.description || defFallback.description,
      honors: item.honors || item.grade || defFallback.honors || "",
    };
  });
}

function normalizeTestimonials(rawTestimonials, defTestimonials) {
  const def = defTestimonials || BACKUP_DEF.testimonials;
  if (!rawTestimonials || !Array.isArray(rawTestimonials) || rawTestimonials.length === 0) return def;

  return rawTestimonials.filter(Boolean).map((t, idx) => {
    const item = typeof t === 'object' ? t : { name: String(t) };
    const defFallback = def[idx % def.length] || BACKUP_DEF.testimonials[0];
    return {
      id: item.id || `t-${idx}`,
      name: item.name || item.author || defFallback.name,
      role: item.role || item.title || item.position || defFallback.role,
      organization: item.organization || item.company || defFallback.organization,
      photoUrl: item.photoUrl || item.avatarUrl || item.image || defFallback.photoUrl,
      review: item.review || item.quote || item.testimonial || item.content || defFallback.review,
      rating: typeof item.rating === 'number' ? item.rating : 5,
      type: item.type || defFallback.type,
    };
  });
}
