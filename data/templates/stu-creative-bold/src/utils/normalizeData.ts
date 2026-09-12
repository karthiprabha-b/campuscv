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
function categorizeFlatSkills(flatSkills: Array<{ name: string; percentage: number }>): SkillCategory[] {
  if (!flatSkills || flatSkills.length === 0) return [];

  const aiKeywords = ['ai', 'artificial intelligence', 'ml', 'machine learning', 'data science', 'deep learning', 'nlp', 'computer vision', 'neural', 'pandas', 'numpy', 'scikit', 'tensorflow', 'pytorch', 'keras', 'opencv', 'generative', 'llm', 'rag', 'analytics', 'statistics', 'matplotlib', 'seaborn', 'scipy', 'jupyter', 'hugging face', 'langchain'];
  const frontendKeywords = ['react', 'vue', 'angular', 'next', 'svelte', 'html', 'css', 'tailwind', 'sass', 'scss', 'javascript', 'typescript', 'js', 'ts', 'ui', 'ux', 'frontend', 'web', 'responsive', 'bootstrap', 'figma', 'design', 'canvas', 'svg', 'three.js', 'framer', 'client'];
  const backendKeywords = ['node', 'express', 'nest', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'go', 'golang', 'rust', 'c#', 'c++', 'c', '.net', 'php', 'laravel', 'sql', 'mysql', 'postgres', 'postgresql', 'mongodb', 'redis', 'graphql', 'rest', 'api', 'backend', 'server', 'database', 'prisma', 'mongoose', 'nosql', 'dynamodb'];
  const toolsKeywords = ['git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'ci/cd', 'linux', 'webpack', 'vite', 'npm', 'yarn', 'pnpm', 'jira', 'agile', 'scrum', 'testing', 'jest', 'cypress', 'postman', 'nginx', 'bash', 'terminal', 'devops'];

  const aiGroup: Array<{ name: string; percentage: number }> = [];
  const frontendGroup: Array<{ name: string; percentage: number }> = [];
  const backendGroup: Array<{ name: string; percentage: number }> = [];
  const toolsGroup: Array<{ name: string; percentage: number }> = [];
  const otherGroup: Array<{ name: string; percentage: number }> = [];

  flatSkills.forEach(skill => {
    const lower = skill.name.toLowerCase();
    if (aiKeywords.some(kw => lower.includes(kw))) {
      aiGroup.push(skill);
    } else if (frontendKeywords.some(kw => lower.includes(kw))) {
      frontendGroup.push(skill);
    } else if (backendKeywords.some(kw => lower.includes(kw))) {
      backendGroup.push(skill);
    } else if (toolsKeywords.some(kw => lower.includes(kw))) {
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
      categories.push({ category: 'Technologies & Tools', items: otherGroup });
    } else {
      // Append others to the smallest category
      let minCat = categories[0];
      for (const c of categories) {
        if (c.items.length < minCat.items.length) minCat = c;
      }
      minCat.items.push(...otherGroup);
    }
  }

  // If only 1 category with > 6 skills, split evenly into 2 or 3 visually appealing cards
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

  // 1. Resolve Name (Prioritize real user names, falling back to edited hero.name, then template defaults)
  const defaultTemplateNames = ["ANUSHKAA MUTHUKUMARAN", "Anushkaa Muthukumaran", "Anushka"];
  const incomingHeroName = (typeof data.hero?.name === 'string' ? data.hero.name.trim() : '') || '';
  const isDefaultHeroName = Boolean(incomingHeroName && defaultTemplateNames.some(d => incomingHeroName.toLowerCase().includes(d.toLowerCase())));

  const resolvedName = (
    (!isDefaultHeroName && incomingHeroName) ||
    data.name ||
    data.fullName ||
    data.profile?.name ||
    data.profile?.fullName ||
    data.personalInfo?.name ||
    data.personalInfo?.fullName ||
    data.personal?.name ||
    data.personal?.fullName ||
    data.basics?.name ||
    incomingHeroName ||
    defaultHero.name ||
    'Portfolio'
  ).trim();

  // 2. Resolve Title / Role (Prioritize explicit hero.title or edited title)
  const resolvedTitle = (
    data.hero?.title ||
    data.title ||
    data.headline ||
    data.role ||
    data.designation ||
    data.profile?.headline ||
    data.personalInfo?.headline ||
    data.basics?.label ||
    defaultHero.title ||
    'Software Developer & Engineer'
  ).trim();

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
  const avatarUrl =
    explicitAvatar ||
    data.hero?.avatarUrl ||
    data.avatarUrl ||
    data.profileImage ||
    data.profile?.photo ||
    data.profile?.avatarUrl ||
    data.personalInfo?.photo ||
    data.avatar ||
    data.photo ||
    data.image ||
    data.about?.avatarUrl ||
    data.basics?.image ||
    data.basics?.avatar ||
    '/profile.png';

  // 4. Normalize Hero Section
  const heroIncoming = data.hero || {};
  const secondaryCta =
    heroIncoming.secondaryCtaText ||
    data.secondaryCtaText ||
    heroIncoming.secondaryButtonText ||
    data.secondaryButtonText ||
    (data.resumeUrl || data.resume ? "DOWNLOAD RESUME" : "GET IN TOUCH");

  const secondaryHref =
    heroIncoming.secondaryCtaHref ||
    data.secondaryCtaHref ||
    heroIncoming.secondaryButtonHref ||
    data.secondaryButtonHref ||
    data.resumeUrl ||
    data.resume ||
    "#contact";

  const hero: HeroData & { avatarUrl: string } = {
    greeting: heroIncoming.greeting || data.greeting || defaultHero.greeting || "HEY, I'M",
    name: heroIncoming.name || resolvedName,
    title: heroIncoming.title || resolvedTitle,
    highlightedTitle: heroIncoming.highlightedTitle !== undefined ? heroIncoming.highlightedTitle : (data.highlightedTitle || heroIncoming.subtitle || defaultHero.highlightedTitle || ""),
    description:
      heroIncoming.description ||
      heroIncoming.intro ||
      heroIncoming.introductionText ||
      data.bio ||
      data.summary ||
      data.profile?.summary ||
      data.profile?.about ||
      data.basics?.summary ||
      defaultHero.description ||
      "Builder-focused Software Developer with hands-on technical skills.",
    primaryCtaText: heroIncoming.primaryCtaText || data.primaryCtaText || defaultHero.primaryCtaText || "VIEW MY WORK",
    primaryCtaHref: heroIncoming.primaryCtaHref || data.primaryCtaHref || defaultHero.primaryCtaHref || "#projects",
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
    title: aboutRaw.title || data.aboutHeading || defaultAbout.title || "ABOUT ME",
    subtitle: aboutRaw.subtitle || data.aboutSubtitle || defaultAbout.subtitle || "A Glimpse Into My Journey",
    description:
      (typeof aboutRaw === 'string' ? aboutRaw : aboutRaw.description) ||
      aboutRaw.bio ||
      aboutRaw.story ||
      data.bio ||
      data.aboutMe ||
      data.summary ||
      data.profile?.about ||
      data.profile?.summary ||
      defaultAbout.description ||
      "Passionate developer focused on building impactful digital architectures.",
    objective: aboutRaw.objective || data.objective || aboutRaw.mission || defaultAbout.objective,
    stats
  };

  // 6. Normalize Approach Steps
  let approachStepsList = defaultApproach;
  const rawApproach = data.approachSteps || data.approach || data.workflow || data.process;
  if (Array.isArray(rawApproach) && rawApproach.length > 0) {
    approachStepsList = rawApproach.map((st: any, idx: number) => ({
      step: String(st.step || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)),
      title: st.title || st.name || `Phase ${idx + 1}`,
      description: st.description || st.desc || '',
      icon: st.icon || ['Search', 'Palette', 'Cpu', 'Rocket'][idx % 4]
    }));
  }

  // 7. Normalize Education History
  let educationList = defaultEducation;
  const rawEdu = data.education || data.educationHistory || data.academics || data.educationList;
  if (Array.isArray(rawEdu) && rawEdu.length > 0) {
    educationList = rawEdu.map((edu: any) => ({
      degree: edu.degree || edu.title || edu.major || edu.course || 'Degree Program',
      institution: edu.institution || edu.school || edu.university || edu.college || 'Institution',
      duration: edu.duration || edu.period || edu.year || (edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : (edu.startDate || edu.year || 'Present')),
      grade: edu.grade || edu.gpa || edu.cgpa || edu.score || edu.status || 'Graduated',
      description: edu.description || edu.details || (Array.isArray(edu.highlights) ? edu.highlights.join(' ') : '') || ''
    }));
  }

  // 8. Normalize Skills — Comprehensive & Universal extraction across all CampusCV formats
  let skillsList: SkillCategory[] = [];
  const rawSkills = data.skills || data.skillCategories || data.skillsList || data.techStack || data.profile?.skills || data.competencies;

  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    // Check if rawSkills is already categorized
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

      // If skills had explicit categories embedded in items, group by those
      const hasItemCategories = flatList.some(item => Boolean(item.category));
      if (hasItemCategories) {
        const catMap: Record<string, Array<{ name: string; percentage: number }>> = {};
        flatList.forEach(item => {
          const cName = item.category || 'General Competencies';
          if (!catMap[cName]) catMap[cName] = [];
          catMap[cName].push({ name: item.name, percentage: item.percentage });
        });
        skillsList = Object.entries(catMap).map(([category, items]) => ({ category, items }));
      } else {
        // Smart keyword categorization & grid balancing
        skillsList = categorizeFlatSkills(flatList);
      }
    }
  } else if (rawSkills && typeof rawSkills === 'object') {
    // Object format: { "Frontend": ["React", "CSS"], "Backend": ["Node", "SQL"] }
    skillsList = Object.entries(rawSkills).map(([catName, items]: [string, any]) => {
      const itemList = Array.isArray(items) ? items : [items];
      return {
        category: catName,
        items: itemList.map((it: any) => ({
          name: typeof it === 'string' ? it.trim() : (it?.name || it?.title || String(it)).trim(),
          percentage: typeof it?.percentage === 'number' ? it.percentage : 85
        })).filter((it: any) => it.name.length > 0)
      };
    }).filter(c => c.items.length > 0);
  }

  // Fallback to default skills if no valid skills were parsed
  if (skillsList.length === 0) {
    skillsList = defaultSkills;
  }

  // 9. Normalize Certifications
  let certList = defaultCertifications;
  const rawCerts = data.certifications || data.certificates || data.credentials || data.awards;
  if (Array.isArray(rawCerts) && rawCerts.length > 0) {
    certList = rawCerts.map((c: any) => ({
      title: c.title || c.name || 'Professional Certification',
      organization: c.organization || c.issuer || c.provider || c.authority || 'Verified Authority',
      date: c.date || c.issueDate || c.year || '2025',
      credentialUrl: c.credentialUrl || c.url || c.link || '#'
    }));
  }

  // 10. Normalize Projects
  let projectsList = defaultProjects;
  const rawProjects = data.projects || data.portfolioProjects || data.works || data.featuredProjects;
  if (Array.isArray(rawProjects) && rawProjects.length > 0) {
    projectsList = rawProjects.map((p: any) => ({
      title: p.title || p.name || 'Featured Project',
      category: p.category || p.type || 'Web Application',
      description: p.description || p.summary || p.shortDesc || '',
      image: p.image || p.imageUrl || p.thumbnail || p.cover || '',
      techStack: Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.tags) ? p.tags : (Array.isArray(p.technologies) ? p.technologies : ['React', 'Next.js', 'Tailwind CSS'])),
      liveUrl: p.liveUrl || p.live || p.demo || p.url || '',
      githubUrl: p.githubUrl || p.github || p.repo || ''
    }));
  }

  // 11. Normalize Work Experience
  let expList = defaultExperiences;
  const rawExp = data.experiences || data.experience || data.workExperience || data.work || data.timeline;
  if (Array.isArray(rawExp) && rawExp.length > 0) {
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
  }

  // 12. Normalize Testimonials
  let testimonialsList = defaultTestimonials;
  const rawTestimonials = data.testimonials || data.feedback || data.reviews;
  if (Array.isArray(rawTestimonials) && rawTestimonials.length > 0) {
    testimonialsList = rawTestimonials.map((t: any) => ({
      quote: t.quote || t.content || t.message || t.feedback || 'Outstanding collaboration and delivery.',
      author: t.author || t.name || 'Colleague',
      role: t.role || t.title || t.designation || 'Product Lead',
      avatar: t.avatar || t.avatarUrl || t.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
    }));
  }

  // 13. Normalize Achievements
  let achievementsList = defaultAchievements;
  const rawAch = data.achievements || data.awards || data.honors || data.milestones;
  if (Array.isArray(rawAch) && rawAch.length > 0) {
    achievementsList = rawAch.map((a: any) => ({
      title: a.title || a.name || 'Excellence Award',
      organization: a.organization || a.issuer || a.event || 'Global Tech Community',
      value: String(a.value || a.year || a.score || a.place || '2025'),
      description: a.description || a.details || a.summary || ''
    }));
  }

  // 14. Normalize Contact & Socials
  const contactRaw = data.contact || {};
  const contact: ContactData = {
    email: contactRaw.email || data.email || data.ownerEmail || data.profile?.email || data.personalInfo?.email || data.basics?.email || defaultContact.email || '',
    phone: contactRaw.phone || data.phone || data.phoneNumber || data.profile?.phone || data.personalInfo?.phone || data.basics?.phone || defaultContact.phone || '',
    location: contactRaw.location || data.location || data.profile?.location || data.personalInfo?.location || data.basics?.location?.city || defaultContact.location || '',
    socials: {
      linkedin: contactRaw.socials?.linkedin || data.socials?.linkedin || data.socialLinks?.linkedin || data.profile?.linkedin || defaultContact.socials.linkedin || '',
      github: contactRaw.socials?.github || data.socials?.github || data.socialLinks?.github || data.profile?.github || defaultContact.socials.github || '',
      instagram: contactRaw.socials?.instagram || data.socials?.instagram || data.socialLinks?.instagram || data.profile?.instagram || defaultContact.socials.instagram || '',
      twitter: contactRaw.socials?.twitter || data.socials?.twitter || data.socialLinks?.twitter || data.profile?.twitter || defaultContact.socials.twitter || '',
      behance: contactRaw.socials?.behance || data.socials?.behance || data.socialLinks?.behance || data.profile?.behance || defaultContact.socials.behance || ''
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

