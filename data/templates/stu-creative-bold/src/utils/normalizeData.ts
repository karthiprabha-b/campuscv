import {
  heroData as defaultHero,
  aboutData as defaultAbout,
  approachSteps as defaultApproach,
  educationHistory as defaultEducation,
  skillCategories as defaultSkills,
  certifications as defaultCertifications,
  projects as defaultProjects,
  experiences as defaultExperiences,
  testimonials as defaultTestimonials,
  achievements as defaultAchievements,
  HeroData,
  AboutData,
  ApproachStep,
  EducationItem,
  SkillCategory,
  CertificationItem,
  ProjectItem,
  ExperienceItem,
  TestimonialItem,
  AchievementItem,
  ContactData,
  NavLink
} from '../data/portfolio';

export interface NormalizedPortfolioData {
  name: string;
  fullName: string;
  title: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  hero: HeroData & { avatarUrl?: string };
  about: AboutData;
  approachSteps: ApproachStep[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  experience: ExperienceItem[];
  timeline: ExperienceItem[];
  testimonials: TestimonialItem[];
  achievements: AchievementItem[];
  contact: ContactData;
  navLinks: NavLink[];
  contentOverrides?: Record<string, any>;
  imageOverrides?: Record<string, any>;
  [key: string]: any;
}

export function normalizeData(raw: any): NormalizedPortfolioData {
  const base = typeof raw === 'object' && raw !== null ? raw : {};
  const data = base.data || base.portfolio || base.cv || base.resume || base.profile || (base.name || base.hero || base.skills || base.education ? base : {}) || {};

  // Check if raw payload represents empty catalog preview or user data
  const hasUserContext = Boolean(
    data.name ||
    data.fullName ||
    data.title ||
    data.headline ||
    data.role ||
    data.bio ||
    data.summary ||
    data.email ||
    data.ownerEmail ||
    (Array.isArray(data.education) && data.education.length > 0) ||
    (Array.isArray(data.canonicalProfile?.education) && data.canonicalProfile.education.length > 0) ||
    (Array.isArray(data.skills) && data.skills.length > 0) ||
    (Array.isArray(data.canonicalProfile?.skills) && data.canonicalProfile.skills.length > 0) ||
    (Array.isArray(data.certifications) && data.certifications.length > 0) ||
    (Array.isArray(data.projects) && data.projects.length > 0) ||
    (Array.isArray(data.experience) && data.experience.length > 0) ||
    (Array.isArray(data.experiences) && data.experiences.length > 0) ||
    data.canonicalProfile?.personal?.fullName
  );

  // Extract candidate full name across all possible structures
  const resolvedName = (
    data.fullName ||
    data.name ||
    data.canonicalProfile?.personal?.fullName ||
    data.canonicalProfile?.personal?.name ||
    data.profile?.fullName ||
    data.profile?.name ||
    data.personalInfo?.fullName ||
    data.personalInfo?.name ||
    data.personal?.fullName ||
    data.personal?.name ||
    data.basics?.name ||
    data.hero?.name ||
    (hasUserContext ? "" : defaultHero.name)
  ).trim();

  const resolvedTitle = (
    data.title ||
    data.tagline ||
    data.headline ||
    data.role ||
    data.designation ||
    data.canonicalProfile?.personal?.headline ||
    data.canonicalProfile?.personal?.role ||
    data.hero?.title ||
    data.profile?.headline ||
    data.profile?.role ||
    data.personalInfo?.headline ||
    data.personal?.headline ||
    data.personal?.role ||
    data.basics?.label ||
    (hasUserContext ? "Software Developer & Engineer" : defaultHero.title)
  ).trim();

  // Resolve profile avatar
  const rawOverride =
    data.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data.contentOverrides?.['image:about:root:img:0']?.src ||
    data.contentOverrides?.['about.avatarUrl']?.src ||
    data.imageOverrides?.['image:hero:root:img:0'] ||
    data.imageOverrides?.['image:about:root:img:0'] ||
    data.imageOverrides?.['hero.avatarUrl'] ||
    data.imageOverrides?.['about.avatarUrl'];

  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value) : rawOverride;
  const avatarUrl =
    explicitAvatar ||
    data.hero?.avatarUrl ||
    data.hero?.profileImage ||
    data.profileImage ||
    data.avatarUrl ||
    data.canonicalProfile?.personal?.profilePhoto ||
    data.canonicalProfile?.personal?.avatarUrl ||
    data.profile?.photo ||
    data.profile?.avatarUrl ||
    data.profile?.image ||
    data.profile?.profileImage ||
    data.personalInfo?.photo ||
    data.personal?.profilePhoto ||
    data.personal?.avatarUrl ||
    data.avatar ||
    data.photo ||
    data.image ||
    data.about?.avatarUrl ||
    data.about?.profileImage ||
    data.basics?.image ||
    data.basics?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  // 1. Normalize Hero
  const heroDescription =
    data.hero?.description ||
    data.hero?.intro ||
    data.hero?.introductionText ||
    data.aboutMe ||
    data.bio ||
    data.summary ||
    data.canonicalProfile?.personal?.summary ||
    data.profile?.summary ||
    data.profile?.about ||
    data.profile?.bio ||
    data.personal?.summary ||
    data.basics?.summary ||
    (hasUserContext ? "Passionate developer focused on engineering robust, high-performance web applications." : defaultHero.description);

  const hero: HeroData & { avatarUrl?: string } = {
    greeting: data.hero?.greeting || data.greeting || defaultHero.greeting,
    name: resolvedName || defaultHero.name,
    title: data.hero?.title || resolvedTitle,
    highlightedTitle: data.hero?.highlightedTitle || data.highlightedTitle || data.hero?.subtitle || (hasUserContext ? "" : defaultHero.highlightedTitle),
    description: heroDescription,
    primaryCtaText: data.hero?.primaryCtaText || defaultHero.primaryCtaText,
    primaryCtaHref: data.hero?.primaryCtaHref || defaultHero.primaryCtaHref,
    secondaryCtaText: data.hero?.secondaryCtaText || defaultHero.secondaryCtaText,
    secondaryCtaHref: data.hero?.secondaryCtaHref || defaultHero.secondaryCtaHref,
    avatarUrl,
    ...(data.hero && typeof data.hero === 'object' ? data.hero : {})
  };
  hero.name = resolvedName || defaultHero.name;
  hero.avatarUrl = avatarUrl;

  // 2. Normalize About
  const aboutRaw = data.about || {};
  let stats: any[] = [];
  const rawStats = Array.isArray(aboutRaw.stats)
    ? aboutRaw.stats
    : (Array.isArray(data.stats)
      ? data.stats
      : (Array.isArray(data.metrics)
        ? data.metrics
        : []));

  if (Array.isArray(rawStats) && rawStats.length > 0) {
    stats = rawStats.map((st: any, idx: number) => {
      const rawVal = st.value !== undefined ? st.value : st.val;
      let numVal = 0;
      let suffix = st.suffix || '';
      
      if (typeof rawVal === 'number') {
        numVal = rawVal;
      } else if (typeof rawVal === 'string') {
        const match = rawVal.match(/(\d+)/);
        numVal = match ? parseInt(match[1]) : 0;
        if (!suffix) {
          if (rawVal.includes('+')) suffix = '+';
          else if (rawVal.includes('%')) suffix = '%';
          else if (rawVal.toLowerCase().includes('years') || rawVal.toLowerCase().includes('yrs')) suffix = ' yrs';
        }
      }

      return {
        value: numVal,
        suffix: suffix,
        label: st.label || st.title || `Stat ${idx + 1}`,
        icon: st.icon || ['BookOpen', 'Briefcase', 'Award', 'Heart'][idx % 4]
      };
    });
  }

  const aboutDescription =
    (typeof aboutRaw === 'string' ? aboutRaw : aboutRaw.description) ||
    aboutRaw.bio ||
    aboutRaw.story ||
    data.aboutMe ||
    data.bio ||
    data.summary ||
    data.canonicalProfile?.personal?.summary ||
    data.profile?.about ||
    data.profile?.summary ||
    data.profile?.bio ||
    data.personal?.summary ||
    heroDescription;

  const about: AboutData = {
    title: aboutRaw.title || data.aboutHeading || defaultAbout.title,
    subtitle: aboutRaw.subtitle || data.aboutSubtitle || data.headline || (resolvedName ? `About ${resolvedName}` : defaultAbout.subtitle),
    description: aboutDescription,
    objective: aboutRaw.objective || data.objective || aboutRaw.mission || (hasUserContext ? "" : defaultAbout.objective),
    stats
  };

  // 3. Normalize Approach Steps / Process
  let approachStepsList: ApproachStep[] = [];
  const rawApproach = data.approachSteps || data.approach || data.workflow || data.process || data.steps;
  if (Array.isArray(rawApproach) && rawApproach.length > 0) {
    approachStepsList = rawApproach.map((st: any, idx: number) => ({
      step: String(st.step || st.number || st.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)),
      title: st.title || st.name || `Phase ${idx + 1}`,
      description: st.description || st.desc || st.details || '',
      icon: st.icon || ['Search', 'Palette', 'Cpu', 'Rocket'][idx % 4]
    }));
  } else if (!hasUserContext) {
    approachStepsList = defaultApproach;
  }

  // 4. Normalize Education
  let educationList: EducationItem[] = [];
  const rawEdu = data.education || data.canonicalProfile?.education || data.educationHistory || data.academics || data.educationList || data.profile?.education || data.cv?.education || data.resume?.education;
  if (Array.isArray(rawEdu) && rawEdu.length > 0) {
    const isDemoEdu = (e: any) => {
      const inst = (e.institution || e.school || e.university || '').toLowerCase();
      return inst.includes('stanford university') || inst.includes('berkeley') || inst.includes('creative tech university');
    };
    const hasReal = rawEdu.some((e: any) => !isDemoEdu(e));
    const candidateList = hasReal ? rawEdu.filter((e: any) => !isDemoEdu(e)) : rawEdu;

    educationList = candidateList.map((edu: any) => {
      const start = (edu.startDate || edu.startYear || edu.start || '').toString().trim();
      const end = (edu.endDate || edu.endYear || edu.end || edu.graduationYear || '').toString().trim();
      const period = (edu.period || edu.duration || edu.year || edu.years || (start && end ? `${start} — ${end}` : (start || end || ''))).toString().trim();

      return {
        degree: edu.degree || edu.title || edu.major || edu.qualification || edu.course || edu.name || 'Degree / Academic Program',
        institution: edu.institution || edu.school || edu.university || edu.college || edu.organization || 'Institution',
        duration: period,
        grade: edu.grade || edu.gpa || edu.score || edu.cgpa || edu.percentage || '',
        description: edu.description || edu.details || (Array.isArray(edu.highlights) ? edu.highlights.join(' ') : '') || ''
      };
    });
  } else if (!hasUserContext) {
    educationList = defaultEducation;
  }

  // 5. Normalize Skills
  let skillsList: SkillCategory[] = [];
  const rawSkills = data.skills || data.canonicalProfile?.skills || data.skillCategories || data.skillsList || data.techStack || data.tools || data.profile?.skills || data.cv?.skills || data.resume?.skills;

  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    // Check if rawSkills is pre-categorized with multiple items
    if (
      typeof rawSkills[0] === 'object' &&
      rawSkills[0] !== null &&
      ('category' in rawSkills[0] || 'title' in rawSkills[0]) &&
      Array.isArray(rawSkills[0].items || rawSkills[0].skills) &&
      (rawSkills[0].items?.length > 1 || rawSkills[0].skills?.length > 1 || rawSkills.length <= 3)
    ) {
      skillsList = rawSkills.map((cat: any) => ({
        category: cat.category || cat.title || 'Technical Skills',
        items: (cat.items || cat.skills || []).map((it: any) => ({
          name: typeof it === 'string' ? it : (it.name || it.title || it.skill || ''),
          percentage: typeof it === 'object' && typeof it.percentage === 'number' ? it.percentage : 85
        })).filter((s: any) => s.name)
      })).filter((c: any) => c.items.length > 0);
    }

    if (skillsList.length === 0 || (skillsList.length > 3 && skillsList.every(c => c.items.length === 1))) {
      const flatList: { name: string; percentage: number }[] = [];
      rawSkills.forEach((sk: any) => {
        if (typeof sk === 'string' && sk.trim()) {
          flatList.push({ name: sk.trim(), percentage: 85 });
        } else if (typeof sk === 'object' && sk !== null) {
          if (Array.isArray(sk.items)) {
            sk.items.forEach((it: any) => {
              const n = typeof it === 'string' ? it : (it.name || it.title || it.skill || '');
              if (n && n.trim()) flatList.push({ name: n.trim(), percentage: it.percentage || 85 });
            });
          } else if (Array.isArray(sk.skills)) {
            sk.skills.forEach((it: any) => {
              const n = typeof it === 'string' ? it : (it.name || it.title || it.skill || '');
              if (n && n.trim()) flatList.push({ name: n.trim(), percentage: it.percentage || 85 });
            });
          } else {
            const n = sk.name || sk.title || sk.skill || (typeof sk.category === 'string' && !sk.name ? sk.category : '');
            if (n && n.trim()) {
              flatList.push({ name: n.trim(), percentage: typeof sk.percentage === 'number' ? sk.percentage : (typeof sk.level === 'number' ? sk.level : 85) });
            }
          }
        }
      });

      const seen = new Set<string>();
      const uniqueSkills = flatList.filter((s) => {
        const lower = s.name.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      if (uniqueSkills.length <= 6) {
        skillsList = [{ category: 'Core Expertise & Technical Skills', items: uniqueSkills }];
      } else if (uniqueSkills.length <= 12) {
        const half = Math.ceil(uniqueSkills.length / 2);
        skillsList = [
          { category: 'Core Languages & Frameworks', items: uniqueSkills.slice(0, half) },
          { category: 'Tools, Libraries & Technologies', items: uniqueSkills.slice(half) }
        ];
      } else {
        const third = Math.ceil(uniqueSkills.length / 3);
        skillsList = [
          { category: 'Languages & Frameworks', items: uniqueSkills.slice(0, third) },
          { category: 'Tools & Libraries', items: uniqueSkills.slice(third, third * 2) },
          { category: 'Competencies & Architecture', items: uniqueSkills.slice(third * 2) }
        ];
      }
    }
  } else if (!hasUserContext) {
    skillsList = defaultSkills;
  }

  // 6. Normalize Certifications
  let certList: CertificationItem[] = [];
  const rawCerts = data.certifications || data.canonicalProfile?.certifications || data.certificates || data.credentials || data.awards || data.profile?.certifications || data.cv?.certifications || data.resume?.certifications;
  if (Array.isArray(rawCerts) && rawCerts.length > 0) {
    const isExactDemoCertTitle = (title: string) => {
      const t = (title || '').toLowerCase().trim();
      return (
        t.includes('google ux design') ||
        t.includes('typescript enterprise') ||
        t.includes('full-stack web engineering boot camp') ||
        t.includes('advanced react & next.js')
      );
    };

    const hasReal = rawCerts.some((c: any) => !isExactDemoCertTitle(c.title || c.name || ''));
    const candidateList = hasReal ? rawCerts.filter((c: any) => !isExactDemoCertTitle(c.title || c.name || '')) : rawCerts;

    certList = candidateList.map((c: any) => ({
      title: c.title || c.name || c.certificateName || c.certificationName || c.credential || 'Professional Certification',
      organization: c.organization || c.issuer || c.provider || c.authority || c.issuedBy || 'Verified Authority',
      date: c.date || c.issueDate || c.year || c.issueYear || c.dateIssued || '',
      credentialUrl: c.credentialUrl || c.url || c.link || '#'
    }));
  } else if (!hasUserContext) {
    certList = defaultCertifications;
  }

  // 7. Normalize Projects
  let projectsList: ProjectItem[] = [];
  const rawProjects = data.projects || data.canonicalProfile?.projects || data.portfolioProjects || data.portfolio || data.works || data.featuredProjects || data.profile?.projects || data.cv?.projects || data.resume?.projects;
  if (Array.isArray(rawProjects) && rawProjects.length > 0) {
    const isDemoProj = (p: any) => {
      const t = (p.title || p.name || '').toLowerCase();
      return t.includes('fintech dashboard ui') || t.includes('travel landing page') || t.includes('ai saas analytics platform') || t.includes('minimalist e-commerce');
    };
    const hasReal = rawProjects.some((p: any) => !isDemoProj(p));
    const candidateList = hasReal ? rawProjects.filter((p: any) => !isDemoProj(p)) : rawProjects;

    projectsList = candidateList.map((p: any) => {
      const tags = Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.technologies) ? p.technologies : (Array.isArray(p.tags) ? p.tags : []));
      return {
        title: p.title || p.name || p.projectName || 'Featured Project',
        category: p.category || p.subtitle || p.type || 'Design & Development',
        description: p.description || p.summary || p.shortDesc || p.details || '',
        image: p.image || p.imageUrl || p.thumbnail || p.cover || '',
        techStack: tags,
        liveUrl: p.liveUrl || p.link || p.live || p.demo || p.url || '',
        githubUrl: p.githubUrl || p.github || p.repo || ''
      };
    });
  } else if (!hasUserContext) {
    projectsList = defaultProjects;
  }

  // 8. Normalize Experience
  let expList: ExperienceItem[] = [];
  const rawExp = data.experiences || data.experience || data.canonicalProfile?.experience || data.workExperience || data.work || data.timeline || data.profile?.experience || data.cv?.experience || data.resume?.experience;
  if (Array.isArray(rawExp) && rawExp.length > 0) {
    const isDemoExp = (e: any) => {
      const c = (e.company || '').toLowerCase();
      const r = (e.role || '').toLowerCase();
      return c.includes('creative spark studio') || (c.includes('pixel perfect') && r.includes('junior web developer'));
    };
    const hasReal = rawExp.some((e: any) => !isDemoExp(e));
    const candidateList = hasReal ? rawExp.filter((e: any) => !isDemoExp(e)) : rawExp;

    expList = candidateList.map((e: any) => {
      let descBullets: string[] = [];
      const rawDesc = e.description || e.desc || e.summary || e.responsibilities;
      if (Array.isArray(rawDesc)) {
        descBullets = rawDesc;
      } else if (Array.isArray(e.bullets)) {
        descBullets = e.bullets;
      } else if (Array.isArray(e.highlights)) {
        descBullets = e.highlights;
      } else if (typeof rawDesc === 'string' && rawDesc.trim()) {
        descBullets = rawDesc.split('\n').map((s: string) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
      }

      if (descBullets.length === 0 && (e.role || e.title || e.position)) {
        descBullets = [e.role || e.title || e.position];
      }

      const start = (e.startDate || e.startYear || '').toString().trim();
      const end = (e.endDate || e.endYear || '').toString().trim();
      const period = (e.duration || e.period || (start && end ? `${start} — ${end}` : (start || end || ''))).toString().trim();

      return {
        company: e.company || e.organization || e.client || e.subtitle || e.employer || 'Organization',
        role: e.role || e.position || e.title || e.designation || 'Engineer',
        duration: period,
        description: descBullets
      };
    });
  } else if (!hasUserContext) {
    expList = defaultExperiences;
  }

  // 9. Normalize Testimonials
  let testimonialsList: TestimonialItem[] = [];
  const rawTestimonials = data.testimonials || data.canonicalProfile?.testimonials || data.feedback || data.reviews || data.recommendations || data.profile?.testimonials;
  if (Array.isArray(rawTestimonials) && rawTestimonials.length > 0) {
    testimonialsList = rawTestimonials.map((t: any) => ({
      quote: t.quote || t.content || t.message || t.feedback || '',
      author: t.author || t.name || 'Colleague',
      role: t.role || t.title || t.designation || '',
      avatar: t.avatar || t.avatarUrl || t.image || ''
    }));
  } else if (!hasUserContext) {
    testimonialsList = defaultTestimonials;
  }

  // 10. Normalize Achievements
  let achievementsList: AchievementItem[] = [];
  const rawAch = data.achievements || data.canonicalProfile?.achievements || data.awards || data.honors || data.milestones || data.profile?.achievements;
  if (Array.isArray(rawAch) && rawAch.length > 0) {
    achievementsList = rawAch.map((a: any) => ({
      title: a.title || a.name || a.award || a.honor || 'Honors & Recognition',
      organization: a.organization || a.issuer || a.event || '',
      value: a.value || a.year || a.score || a.place || '',
      description: a.description || a.details || a.summary || ''
    }));
  } else if (!hasUserContext) {
    achievementsList = defaultAchievements;
  }

  // 11. Normalize Contact & Socials
  const contactRaw = data.contact || {};
  const rawSocials = data.socials || data.socialLinks || data.social || contactRaw.socials || data.canonicalProfile?.social || data.profile?.socialLinks || {};
  const contact: ContactData = {
    email: contactRaw.email || data.email || data.ownerEmail || data.canonicalProfile?.personal?.email || data.profile?.email || data.personalInfo?.email || data.personal?.email || data.basics?.email || '',
    phone: contactRaw.phone || data.phone || data.phoneNumber || data.canonicalProfile?.personal?.phone || data.profile?.phone || data.personalInfo?.phone || data.personal?.phone || data.basics?.phone || '',
    location: contactRaw.location || data.location || data.canonicalProfile?.personal?.city || data.profile?.location || data.personalInfo?.location || data.personal?.location || data.basics?.location?.city || '',
    socials: {
      linkedin: rawSocials.linkedin || '',
      github: rawSocials.github || '',
      instagram: rawSocials.instagram || '',
      twitter: rawSocials.twitter || rawSocials.x || '',
      behance: rawSocials.behance || '',
      ...(typeof rawSocials === 'object' ? rawSocials : {})
    }
  };

  const navLinks: NavLink[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" }
  ];

  return {
    ...data,
    name: resolvedName || defaultHero.name,
    fullName: resolvedName || defaultHero.name,
    title: resolvedTitle,
    theme: data.theme,
    hero,
    about,
    approachSteps: approachStepsList,
    education: educationList,
    skills: skillsList,
    certifications: certList,
    projects: projectsList,
    experiences: expList,
    experience: expList,
    timeline: expList,
    testimonials: testimonialsList,
    achievements: achievementsList,
    contact,
    navLinks,
    contentOverrides: data.contentOverrides,
    imageOverrides: data.imageOverrides,
  };
}
