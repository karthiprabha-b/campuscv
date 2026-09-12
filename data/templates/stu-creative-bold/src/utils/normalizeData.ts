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
  contactData as defaultContact,
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
    [key: string]: any;
  };
  hero: HeroData & { avatarUrl?: string; [key: string]: any };
  about: AboutData & { [key: string]: any };
  approachSteps: ApproachStep[];
  education: EducationItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  testimonials: TestimonialItem[];
  achievements: AchievementItem[];
  contact: ContactData;
  navLinks: NavLink[];
  contentOverrides?: Record<string, any>;
  styleOverrides?: Record<string, any>;
  imageOverrides?: Record<string, any>;
  deletedNodes?: Record<string, boolean>;
  hiddenNodes?: Record<string, boolean>;
  [key: string]: any;
}

/**
 * Categorize a flat list of skills intelligently based on common technical keywords.
 */
function getFirstNonEmptyArray(...candidates: any[]): any[] {
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
    if (c && typeof c === 'object' && !Array.isArray(c) && Object.keys(c).length > 0) {
      return [c];
    }
  }
  return [];
}

function getFirstNonEmptyString(...candidates: any[]): string {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c.trim();
  }
  return '';
}

/**
 * Categorize a flat list of skills intelligently based on common technical keywords.
 */
function categorizeFlatSkills(flatSkills: Array<{ name: string; percentage: number }>): SkillCategory[] {
  if (!flatSkills || flatSkills.length === 0) return [];

  const aiRegex = /\b(ai|artificial intelligence|ml|machine learning|data science|deep learning|nlp|natural language|computer vision|neural|neural network|pandas|numpy|scikit|sklearn|tensorflow|pytorch|keras|opencv|generative|llm|rag|analytics|statistics|data analysis|data analytics|matplotlib|seaborn|scipy|jupyter|hugging face|langchain|prompt engineering|transformers)\b/i;
  const frontendRegex = /\b(react|react\.js|reactjs|vue|vue\.js|angular|next|next\.js|nextjs|svelte|html|html5|css|css3|tailwind|tailwindcss|tailwind css|sass|scss|javascript|typescript|js|ts|ui|ux|ui\/ux|frontend|front-end|web|web development|responsive|bootstrap|figma|canvas|svg|three\.js|threejs|framer|framer motion|redux|zustand)\b/i;
  const backendRegex = /\b(node|node\.js|nodejs|express|express\.js|expressjs|nest|nestjs|python|django|flask|fastapi|java|spring|spring boot|go|golang|rust|c\+\+|cpp|c#|csharp|\.net|php|laravel|sql|mysql|postgres|postgresql|mongodb|redis|graphql|rest|rest api|rest apis|backend|back-end|server|database|databases|prisma|mongoose|nosql|dynamodb|firebase|supabase|sqlite)\b/i;
  const toolsRegex = /\b(git|github|gitlab|docker|kubernetes|k8s|aws|azure|gcp|google cloud|cloud|ci\/cd|cicd|linux|unix|webpack|vite|npm|yarn|pnpm|jira|agile|scrum|testing|jest|cypress|postman|nginx|bash|terminal|devops|vs code|vscode)\b/i;

  const aiGroup: Array<{ name: string; percentage: number }> = [];
  const frontendGroup: Array<{ name: string; percentage: number }> = [];
  const backendGroup: Array<{ name: string; percentage: number }> = [];
  const toolsGroup: Array<{ name: string; percentage: number }> = [];
  const otherGroup: Array<{ name: string; percentage: number }> = [];

  flatSkills.forEach(skill => {
    const name = skill.name.trim();
    if (!name) return;

    if (aiRegex.test(name)) {
      aiGroup.push(skill);
    } else if (frontendRegex.test(name)) {
      frontendGroup.push(skill);
    } else if (backendRegex.test(name)) {
      backendGroup.push(skill);
    } else if (toolsRegex.test(name)) {
      toolsGroup.push(skill);
    } else {
      otherGroup.push(skill);
    }
  });

  const categories: SkillCategory[] = [];

  if (aiGroup.length > 0) {
    categories.push({ category: 'AI, Data Science & Machine Learning', items: aiGroup });
  }
  if (frontendGroup.length > 0) {
    categories.push({ category: 'Frontend & UI Engineering', items: frontendGroup });
  }
  if (backendGroup.length > 0) {
    categories.push({ category: 'Backend, Database & APIs', items: backendGroup });
  }
  if (toolsGroup.length > 0) {
    categories.push({ category: 'Tools, DevOps & Cloud', items: toolsGroup });
  }

  if (otherGroup.length > 0) {
    if (categories.length === 0) {
      categories.push({ category: 'Core Skills & Competencies', items: otherGroup });
    } else if (categories.length < 4) {
      categories.push({ category: 'Core Technologies & Tools', items: otherGroup });
    } else {
      let minCat = categories[0];
      for (const c of categories) {
        if (c.items.length < minCat.items.length) minCat = c;
      }
      minCat.items.push(...otherGroup);
    }
  }

  // If only 1 category with > 6 skills, split into balanced cards
  if (categories.length === 1 && categories[0].items.length > 6) {
    const all = categories[0].items;
    if (all.length <= 10) {
      const mid = Math.ceil(all.length / 2);
      return [
        { category: 'Core Technologies & Frameworks', items: all.slice(0, mid) },
        { category: 'Development & Tools', items: all.slice(mid) }
      ];
    } else {
      const chunk = Math.ceil(all.length / 3);
      return [
        { category: 'Frontend & Web Development', items: all.slice(0, chunk) },
        { category: 'Backend, Database & APIs', items: all.slice(chunk, chunk * 2) },
        { category: 'Tools & Technologies', items: all.slice(chunk * 2) }
      ];
    }
  }

  return categories;
}

export function normalizeData(raw: any): NormalizedPortfolioData {
  const data = typeof raw === 'object' && raw !== null ? (raw.data || raw.portfolio || raw.cv || raw.resume || raw.profile || raw) : {};

  // 1. Resolve Name
  const defaultTemplateNames = ["ANUSHKAA MUTHUKUMARAN", "Anushkaa Muthukumaran", "Anushka"];
  const incomingHeroName = (typeof data.hero?.name === 'string' ? data.hero.name.trim() : '') || '';
  const isDefaultHeroName = Boolean(incomingHeroName && defaultTemplateNames.some(d => incomingHeroName.toLowerCase().includes(d.toLowerCase())));

  const resolvedName = getFirstNonEmptyString(
    !isDefaultHeroName ? incomingHeroName : '',
    data.name,
    data.fullName,
    data.profile?.fullName,
    data.profile?.name,
    data.personalInfo?.fullName,
    data.personalInfo?.name,
    data.personal?.fullName,
    data.personal?.name,
    data.canonicalProfile?.personal?.fullName,
    data.canonicalProfile?.personal?.name,
    data.basics?.name,
    incomingHeroName,
    'Portfolio'
  );

  // 2. Resolve Title / Role
  const rawTitleVal = (typeof data.hero?.title === 'string' ? data.hero.title.trim() : '') || '';
  const isDefaultTitle = rawTitleVal.toLowerCase().includes('ui/ux designer &') || rawTitleVal.toLowerCase() === 'software developer';
  const resolvedTitle = getFirstNonEmptyString(
    !isDefaultTitle ? rawTitleVal : '',
    data.title,
    data.headline,
    data.role,
    data.designation,
    data.profile?.headline,
    data.personalInfo?.headline,
    data.personal?.headline,
    data.canonicalProfile?.personal?.headline,
    data.basics?.label,
    rawTitleVal,
    'Software Developer'
  );

  // 3. Resolve Profile Avatar Image
  const rawOverride =
    data.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data.contentOverrides?.['image:about:root:img:0']?.src ||
    data.imageOverrides?.['image:hero:root:img:0'] ||
    data.imageOverrides?.['image:about:root:img:0'] ||
    data.imageOverrides?.['hero.avatarUrl'] ||
    data.imageOverrides?.['about.avatarUrl'];

  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value) : rawOverride;
  const avatarUrl = getFirstNonEmptyString(
    explicitAvatar,
    data.hero?.avatarUrl,
    data.avatarUrl,
    data.profileImage,
    data.profile?.photo,
    data.profile?.avatarUrl,
    data.personalInfo?.photo,
    data.personal?.profilePhoto,
    data.canonicalProfile?.personal?.profilePhoto,
    data.avatar,
    data.photo,
    data.image,
    data.about?.avatarUrl,
    data.basics?.image,
    '/profile.png'
  );

  // 4. Normalize Hero Section
  const heroIncoming = data.hero || {};
  const secondaryCta = getFirstNonEmptyString(
    heroIncoming.secondaryCtaText,
    data.secondaryCtaText,
    heroIncoming.secondaryButtonText,
    data.secondaryButtonText,
    data.resumeUrl || data.resume ? "DOWNLOAD RESUME" : "GET IN TOUCH"
  );

  const secondaryHref = getFirstNonEmptyString(
    heroIncoming.secondaryCtaHref,
    data.secondaryCtaHref,
    heroIncoming.secondaryButtonHref,
    data.secondaryButtonHref,
    data.resumeUrl,
    data.resume,
    "#contact"
  );

  const hero: HeroData & { avatarUrl: string } = {
    greeting: heroIncoming.greeting || data.greeting || "HEY, I'M",
    name: heroIncoming.name || resolvedName,
    title: heroIncoming.title || resolvedTitle,
    highlightedTitle: heroIncoming.highlightedTitle !== undefined ? heroIncoming.highlightedTitle : (data.highlightedTitle || heroIncoming.subtitle || ""),
    description: getFirstNonEmptyString(
      heroIncoming.description,
      heroIncoming.intro,
      heroIncoming.introductionText,
      data.bio,
      data.summary,
      data.profile?.summary,
      data.profile?.about,
      data.personal?.summary,
      data.canonicalProfile?.personal?.summary,
      data.basics?.summary,
      "Passionate developer building scalable, high-performance software."
    ),
    primaryCtaText: heroIncoming.primaryCtaText || data.primaryCtaText || "VIEW MY WORK",
    primaryCtaHref: heroIncoming.primaryCtaHref || data.primaryCtaHref || "#projects",
    secondaryCtaText: secondaryCta,
    secondaryCtaHref: secondaryHref,
    avatarUrl: explicitAvatar || heroIncoming.avatarUrl || avatarUrl,
    ...heroIncoming
  };
  hero.name = heroIncoming.name || resolvedName;
  hero.title = heroIncoming.title || resolvedTitle;
  hero.secondaryCtaText = secondaryCta;
  hero.secondaryCtaHref = secondaryHref;
  hero.avatarUrl = explicitAvatar || heroIncoming.avatarUrl || avatarUrl;

  // 5. Normalize About Section
  const aboutRaw = data.about || {};
  let stats = defaultAbout.stats;
  if (Array.isArray(aboutRaw.stats) && aboutRaw.stats.length > 0) {
    stats = aboutRaw.stats.map((st: any, idx: number) => ({
      value: typeof st.value === 'number' ? st.value : (parseInt(String(st.value).replace(/\D/g, '')) || (idx + 1) * 5),
      suffix: st.suffix !== undefined ? st.suffix : (String(st.value).includes('+') ? '+' : (String(st.value).includes('%') ? '%' : '')),
      label: st.label || st.title || `Stat ${idx + 1}`,
      icon: st.icon || ['BookOpen', 'Briefcase', 'Award', 'Heart'][idx % 4]
    }));
  } else if (Array.isArray(data.stats) && data.stats.length > 0) {
    stats = data.stats.map((st: any, idx: number) => ({
      value: typeof st.value === 'number' ? st.value : (parseInt(String(st.value).replace(/\D/g, '')) || (idx + 1) * 5),
      suffix: st.suffix !== undefined ? st.suffix : '',
      label: st.label || st.title || `Stat ${idx + 1}`,
      icon: st.icon || ['BookOpen', 'Briefcase', 'Award', 'Heart'][idx % 4]
    }));
  }

  const about: AboutData = {
    title: aboutRaw.title || data.aboutHeading || "ABOUT ME",
    subtitle: aboutRaw.subtitle || data.aboutSubtitle || "A Glimpse Into My Journey",
    description: getFirstNonEmptyString(
      typeof aboutRaw === 'string' ? aboutRaw : aboutRaw.description,
      aboutRaw.bio,
      aboutRaw.story,
      data.bio,
      data.aboutMe,
      data.summary,
      data.profile?.about,
      data.profile?.summary,
      data.personal?.summary,
      data.canonicalProfile?.personal?.summary,
      "Passionate developer focused on building impactful digital architectures."
    ),
    objective: aboutRaw.objective || data.objective || aboutRaw.mission || defaultAbout.objective,
    stats
  };

  // 6. Normalize Approach Steps
  let approachStepsList = defaultApproach;
  const rawApproach = getFirstNonEmptyArray(data.approachSteps, data.approach, data.workflow, data.process);
  if (rawApproach.length > 0) {
    approachStepsList = rawApproach.map((st: any, idx: number) => ({
      step: String(st.step || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)),
      title: st.title || st.name || `Phase ${idx + 1}`,
      description: st.description || st.desc || '',
      icon: st.icon || ['Search', 'Palette', 'Cpu', 'Rocket'][idx % 4]
    }));
  }

  // 7. Normalize Education History
  let educationList: EducationItem[] = [];
  const rawEdu = getFirstNonEmptyArray(
    data.education,
    data.educationHistory,
    data.academics,
    data.educationList,
    data.profile?.education,
    data.canonicalProfile?.education
  );
  if (rawEdu.length > 0) {
    educationList = rawEdu.map((edu: any) => ({
      degree: edu.degree || edu.title || edu.major || edu.course || 'Degree Program',
      institution: edu.institution || edu.school || edu.university || edu.college || 'Institution',
      duration: edu.duration || edu.period || edu.year || (edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : (edu.startDate || edu.year || 'Present')),
      grade: edu.grade || edu.gpa || edu.cgpa || edu.score || edu.status || 'Graduated',
      description: edu.description || edu.details || (Array.isArray(edu.highlights) ? edu.highlights.join(' ') : '') || ''
    }));
  } else if (!data.name && !data.id) {
    educationList = defaultEducation;
  }

  // 8. Normalize Skills — Comprehensive & Universal extraction across all formats
  let skillsList: SkillCategory[] = [];
  const isDemoSkillList = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return true;
    const demoKeywords = ['react / next.js', 'typescript', 'html5 & css3', 'tailwind css', 'node.js & express', 'sql & mongodb', 'rest apis', 'figma (auto-layout', 'adobe creative suite', 'prototyping & wireframing'];
    let flat: string[] = [];
    arr.forEach(item => {
      if (typeof item === 'string') flat.push(item.toLowerCase());
      else if (item && typeof item === 'object') {
        if (Array.isArray(item.items)) {
          item.items.forEach((it: any) => flat.push((it.name || it || '').toLowerCase()));
        } else {
          flat.push((item.name || item.title || item.skill || '').toLowerCase());
        }
      }
    });
    if (flat.length === 0) return true;
    return flat.every(s => demoKeywords.some(d => s.includes(d) || d.includes(s)));
  };

  const rawSkillsCandidates = [
    data.canonicalProfile?.skills,
    data.canonicalProfile?.technicalSkills,
    data.profile?.skills,
    data.personalInfo?.skills,
    data.personal?.skills,
    data.skills,
    data.skillCategories,
    data.skillsList,
    data.technicalSkills,
    data.techStack,
    data.profile?.capabilities,
    data.competencies,
    data.expertise
  ];

  let rawSkills: any[] = [];
  for (const c of rawSkillsCandidates) {
    if (Array.isArray(c) && c.length > 0 && !isDemoSkillList(c)) {
      rawSkills = c;
      break;
    }
  }
  if (rawSkills.length === 0) {
    for (const c of rawSkillsCandidates) {
      if (Array.isArray(c) && c.length > 0) {
        rawSkills = c;
        break;
      }
    }
  }

  const isDemoSkill = (name: string) => {
    const s = String(name || '').toLowerCase();
    return s.includes('figma (auto-layout') || s.includes('adobe creative suite') || s.includes('prototyping & wireframing');
  };

  if (rawSkills.length > 0) {
    const isCategorized = rawSkills.some(
      (item: any) =>
        item &&
        typeof item === 'object' &&
        ('items' in item || 'skills' in item || 'data' in item || 'list' in item) &&
        Array.isArray(item.items || item.skills || item.data || item.list)
    );

    if (isCategorized) {
      skillsList = rawSkills.map((cat: any, idx: number) => {
        const catName = cat.category || cat.title || cat.name || `Skill Group ${idx + 1}`;
        const rawItems = cat.items || cat.skills || cat.data || cat.list || [];
        const items = rawItems.map((it: any) => {
          if (typeof it === 'string') {
            return { name: it.trim(), percentage: 85 };
          }
          return {
            name: (it.name || it.title || it.skill || '').trim(),
            percentage: typeof it.percentage === 'number' ? it.percentage : (typeof it.level === 'number' ? it.level : 85)
          };
        }).filter((it: any) => it.name.length > 0);

        return {
          category: catName,
          items
        };
      }).filter((c: any) => c.items.length > 0);

      // Strip demo skills from categories if real skills exist
      const hasRealSkills = skillsList.some(cat => cat.items.some(it => !isDemoSkill(it.name)));
      if (hasRealSkills) {
        skillsList = skillsList.map(cat => ({
          ...cat,
          items: cat.items.filter(it => !isDemoSkill(it.name))
        })).filter(cat => cat.items.length > 0);
      }
    } else {
      // Flat list of skills: strings or objects
      const flatList: Array<{ name: string; percentage: number; category?: string }> = [];

      rawSkills.forEach((sk: any) => {
        if (typeof sk === 'string' && sk.trim()) {
          flatList.push({ name: sk.trim(), percentage: 85 });
        } else if (typeof sk === 'object' && sk !== null) {
          const name = (sk.name || sk.title || sk.skill || '').trim();
          if (name) {
            const category = sk.category || sk.type || sk.group;
            const percentage = typeof sk.percentage === 'number' ? sk.percentage : (typeof sk.level === 'number' ? sk.level : 85);
            flatList.push({ name, percentage, category });
          }
        }
      });

      // Filter out demo skills if real user skills exist
      const realSkills = flatList.filter(s => !isDemoSkill(s.name));
      const activeList = realSkills.length > 0 ? realSkills : flatList;

      // If all items share generic category name like 'Technical Skills', categorize automatically into 4 cards
      const uniqueCats = new Set(activeList.map(item => item.category).filter(Boolean));
      const isGenericSingleCat = uniqueCats.size <= 1 && (uniqueCats.has('Technical Skills') || uniqueCats.has('Technical') || uniqueCats.has('Core Skills') || uniqueCats.has('General Competencies') || uniqueCats.size === 0);

      if (!isGenericSingleCat && uniqueCats.size > 1) {
        const catMap: Record<string, Array<{ name: string; percentage: number }>> = {};
        activeList.forEach(item => {
          const cName = item.category || 'General Competencies';
          if (!catMap[cName]) catMap[cName] = [];
          catMap[cName].push({ name: item.name, percentage: item.percentage });
        });
        skillsList = Object.entries(catMap).map(([category, items]) => ({ category, items }));
      } else {
        skillsList = categorizeFlatSkills(activeList);
      }
    }
  } else if (!data.name && !data.id && !data.username) {
    skillsList = defaultSkills;
  }

  // 9. Normalize Certifications — STRICTLY no demo fallback if user data exists
  let certList: CertificationItem[] = [];
  const rawCerts = getFirstNonEmptyArray(
    data.certifications,
    data.certificates,
    data.credentials,
    data.awards,
    data.profile?.certifications,
    data.canonicalProfile?.certifications
  );

  const isExactDemoCertTitle = (title: string) => {
    const t = (title || '').toLowerCase().trim();
    return (
      t.includes('google ux design') ||
      t.includes('typescript enterprise') ||
      t.includes('full-stack web engineering boot camp') ||
      t.includes('advanced react & next.js') ||
      t === 'professional certification'
    );
  };

  if (rawCerts.length > 0) {
    const mapped = rawCerts.map((c: any) => ({
      title: c.title || c.name || '',
      organization: c.organization || c.issuer || c.provider || c.authority || '',
      date: c.date || c.issueDate || c.year || '',
      credentialUrl: c.credentialUrl || c.url || c.link || ''
    })).filter((c: any) => c.title.trim().length > 0);

    const hasRealCert = mapped.some((c: any) => !isExactDemoCertTitle(c.title));
    if (hasRealCert) {
      certList = mapped.filter((c: any) => !isExactDemoCertTitle(c.title));
    } else if (!data.name && !data.id && !data.username) {
      certList = defaultCertifications;
    } else {
      certList = [];
    }
  } else if (!data.name && !data.id && !data.username) {
    certList = defaultCertifications;
  }

  // 10. Normalize Projects
  let projectsList: ProjectItem[] = [];
  const rawProjects = getFirstNonEmptyArray(
    data.projects,
    data.portfolioProjects,
    data.works,
    data.featuredProjects,
    data.profile?.projects,
    data.canonicalProfile?.projects
  );

  if (rawProjects.length > 0) {
    projectsList = rawProjects.map((p: any) => ({
      title: p.title || p.name || 'Featured Project',
      category: p.category || p.type || 'Web Application',
      description: p.description || p.summary || p.shortDesc || '',
      image: p.image || p.imageUrl || p.thumbnail || p.cover || '',
      techStack: Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.tags) ? p.tags : (Array.isArray(p.technologies) ? p.technologies : ['React', 'Next.js', 'Tailwind CSS'])),
      liveUrl: p.liveUrl || p.live || p.demo || p.url || '',
      githubUrl: p.githubUrl || p.github || p.repo || ''
    }));
  } else if (!data.name && !data.id && !data.username) {
    projectsList = defaultProjects;
  }

  // 11. Normalize Work Experience
  let expList: ExperienceItem[] = [];
  const rawExp = getFirstNonEmptyArray(
    data.experiences,
    data.experience,
    data.workExperience,
    data.work,
    data.timeline,
    data.profile?.experience,
    data.canonicalProfile?.experience
  );

  if (rawExp.length > 0) {
    expList = rawExp.map((e: any) => {
      let descBullets: string[] = [];
      if (Array.isArray(e.description)) {
        descBullets = e.description;
      } else if (Array.isArray(e.bullets)) {
        descBullets = e.bullets;
      } else if (Array.isArray(e.highlights)) {
        descBullets = e.highlights;
      } else if (typeof e.description === 'string' && e.description.trim()) {
        descBullets = e.description.split('\n').map((s: string) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
      }

      if (descBullets.length === 0) {
        descBullets = [e.summary || e.role || 'Contributed to high-impact development initiatives.'];
      }

      return {
        company: e.company || e.organization || e.client || 'Company',
        role: e.role || e.position || e.title || 'Engineer',
        duration: e.duration || e.period || (e.startDate && e.endDate ? `${e.startDate} - ${e.endDate}` : (e.startDate || e.year || 'Present')),
        description: descBullets
      };
    });
  } else if (!data.name && !data.id && !data.username) {
    expList = defaultExperiences;
  }

  // 12. Normalize Testimonials
  let testimonialsList = defaultTestimonials;
  const rawTestimonials = getFirstNonEmptyArray(data.testimonials, data.feedback, data.reviews);
  if (rawTestimonials.length > 0) {
    testimonialsList = rawTestimonials.map((t: any) => ({
      quote: t.quote || t.content || t.message || t.feedback || 'Outstanding collaboration and delivery.',
      author: t.author || t.name || 'Colleague',
      role: t.role || t.title || t.designation || 'Product Lead',
      avatar: t.avatar || t.avatarUrl || t.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
    }));
  }

  // 13. Normalize Achievements
  let achievementsList = defaultAchievements;
  const rawAch = getFirstNonEmptyArray(data.achievements, data.awards, data.honors, data.milestones);
  if (rawAch.length > 0) {
    achievementsList = rawAch.map((a: any) => ({
      title: a.title || a.name || 'Excellence Award',
      organization: a.organization || a.issuer || a.event || 'Global Tech Community',
      value: String(a.value || a.year || a.score || a.place || '2025'),
      description: a.description || a.details || a.summary || ''
    }));
  }

  // 14. Normalize Contact & Socials — STRICTLY clean real values, NO fake Chennai or fake phone fallbacks
  const contactRaw = data.contact || {};
  const resolvedEmail = getFirstNonEmptyString(
    contactRaw.email,
    data.email,
    data.ownerEmail,
    data.profile?.email,
    data.personalInfo?.email,
    data.personal?.email,
    data.basics?.email,
    data.canonicalProfile?.personal?.email,
    ''
  );

  const resolvedPhone = getFirstNonEmptyString(
    contactRaw.phone,
    data.phone,
    data.phoneNumber,
    data.profile?.phone,
    data.personalInfo?.phone,
    data.personal?.phone,
    data.basics?.phone,
    data.canonicalProfile?.personal?.phone,
    ''
  );

  const resolvedLocation = getFirstNonEmptyString(
    contactRaw.location,
    data.location,
    data.profile?.location,
    data.personalInfo?.location,
    data.personal?.location,
    data.basics?.location?.city ? `${data.basics.location.city}${data.basics.location.region ? `, ${data.basics.location.region}` : ''}` : '',
    data.basics?.location?.address,
    data.city ? `${data.city}${data.state ? `, ${data.state}` : ''}` : '',
    data.hero?.location,
    data.canonicalProfile?.personal?.city ? [data.canonicalProfile.personal.city, data.canonicalProfile.personal.state, data.canonicalProfile.personal.country].filter(Boolean).join(', ') : '',
    data.canonicalProfile?.personal?.location,
    ''
  );

  const contact: ContactData = {
    email: resolvedEmail,
    phone: resolvedPhone,
    location: resolvedLocation,
    socials: {
      linkedin: getFirstNonEmptyString(contactRaw.socials?.linkedin, data.socials?.linkedin, data.socialLinks?.linkedin, data.profile?.linkedin, data.canonicalProfile?.social?.linkedin, ''),
      github: getFirstNonEmptyString(contactRaw.socials?.github, data.socials?.github, data.socialLinks?.github, data.profile?.github, data.canonicalProfile?.social?.github, ''),
      instagram: getFirstNonEmptyString(contactRaw.socials?.instagram, data.socials?.instagram, data.socialLinks?.instagram, data.profile?.instagram, data.canonicalProfile?.social?.instagram, ''),
      twitter: getFirstNonEmptyString(contactRaw.socials?.twitter, data.socials?.twitter, data.socialLinks?.twitter, data.profile?.twitter, data.canonicalProfile?.social?.twitter, ''),
      behance: getFirstNonEmptyString(contactRaw.socials?.behance, data.socials?.behance, data.socialLinks?.behance, data.profile?.behance, data.canonicalProfile?.social?.behance, '')
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
    name: resolvedName,
    fullName: resolvedName,
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
    testimonials: testimonialsList,
    achievements: achievementsList,
    contact,
    navLinks,
    contentOverrides: data.contentOverrides || {},
    styleOverrides: data.styleOverrides || {},
    imageOverrides: data.imageOverrides || {},
    deletedNodes: data.deletedNodes || {},
    hiddenNodes: data.hiddenNodes || {}
  };
}

