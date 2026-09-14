/**
 * CampusCV Universal Editor Engine V2 (Master Architecture)
 *
 * 100% Template-Independent & Agnostic.
 * Portfolio JSON is the single source of truth.
 * Manages JSON updates, collection object generation, property reflection,
 * 50-step undo/redo history, autosave tracking, and responsive breakpoint state.
 */

import { PortfolioData } from './mockDb';

export type ElementType =
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'avatar'
  | 'button'
  | 'link'
  | 'card'
  | 'list'
  | 'section'
  | 'badge'
  | 'stat'
  | 'timeline'
  | 'skill'
  | 'project'
  | 'education'
  | 'experience'
  | 'certification'
  | 'unknown';

export interface SelectedElementInfo {
  id: string;
  fieldPath: string;
  elementType: ElementType;
  sectionId?: string;
  index?: number;
  label?: string;
  el?: HTMLElement;
}

export class UniversalEditorEngine {
  private portfolio: PortfolioData;
  private historyPast: PortfolioData[] = [];
  private historyFuture: PortfolioData[] = [];
  private listeners: Set<(portfolio: PortfolioData) => void> = new Set();
  private maxHistory: number = 50;

  constructor(initialPortfolio: PortfolioData) {
    this.portfolio = initialPortfolio;
  }

  public getPortfolio(): PortfolioData {
    return this.portfolio;
  }

  public subscribe(listener: (portfolio: PortfolioData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.portfolio));
  }

  private pushState() {
    this.historyPast.push(JSON.parse(JSON.stringify(this.portfolio)));
    if (this.historyPast.length > this.maxHistory) {
      this.historyPast.shift();
    }
    this.historyFuture = [];
  }

  public undo(): PortfolioData | null {
    if (this.historyPast.length === 0) return null;
    this.historyFuture.push(JSON.parse(JSON.stringify(this.portfolio)));
    this.portfolio = this.historyPast.pop()!;
    this.notify();
    return this.portfolio;
  }

  public redo(): PortfolioData | null {
    if (this.historyFuture.length === 0) return null;
    this.historyPast.push(JSON.parse(JSON.stringify(this.portfolio)));
    this.portfolio = this.historyFuture.pop()!;
    this.notify();
    return this.portfolio;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Collection Operations
  // ─────────────────────────────────────────────────────────────────────────

  public addCollectionItem(collectionKey: string, customItem?: any): any {
    this.pushState();
    const list = Array.isArray((this.portfolio as any)[collectionKey])
      ? [...(this.portfolio as any)[collectionKey]]
      : [];

    const newItem = customItem || this.createDefaultItem(collectionKey, list);
    list.push(newItem);

    this.portfolio = { ...this.portfolio, [collectionKey]: list };
    this.notify();
    return newItem;
  }

  public deleteItem(fieldPath: string): boolean {
    this.pushState();
    const match = fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (match) {
      const [, collectionKey, indexStr] = match;
      const idx = parseInt(indexStr, 10);
      const list = (this.portfolio as any)[collectionKey];
      if (Array.isArray(list)) {
        const nextList = list.filter((_, i) => i !== idx);
        this.portfolio = { ...this.portfolio, [collectionKey]: nextList };
        this.notify();
        return true;
      }
    }

    // Non-collection element deletion persistence
    const currentDeleted = this.portfolio.deletedFields || [];
    if (!currentDeleted.includes(fieldPath)) {
      this.portfolio = {
        ...this.portfolio,
        deletedFields: [...currentDeleted, fieldPath],
      };
      this.notify();
      return true;
    }

    return false;
  }

  public duplicateItem(fieldPath: string): any {
    const match = fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (!match) return null;

    this.pushState();
    const [, collectionKey, indexStr] = match;
    const idx = parseInt(indexStr, 10);
    const list = [...((this.portfolio as any)[collectionKey] || [])];

    if (list[idx]) {
      const source = list[idx];
      const cloned = typeof source === 'object'
        ? {
            ...source,
            id: `${collectionKey}-${Date.now()}`,
            title: source.title ? `${source.title} (Copy)` : source.name ? `${source.name} (Copy)` : undefined,
          }
        : `${source} (Copy)`;

      list.splice(idx + 1, 0, cloned);
      this.portfolio = { ...this.portfolio, [collectionKey]: list };
      this.notify();
      return cloned;
    }

    return null;
  }

  public reorderCollection(collectionKey: string, fromIndex: number, toIndex: number): boolean {
    const list = [...((this.portfolio as any)[collectionKey] || [])];
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) {
      return false;
    }

    this.pushState();
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);

    this.portfolio = { ...this.portfolio, [collectionKey]: list };
    this.notify();
    return true;
  }

  public updateField(fieldPath: string, value: any): void {
    this.pushState();
    const updated = { ...this.portfolio } as any;

    if (fieldPath === 'profile.name' || fieldPath === 'name') {
      updated.name = value;
    } else if (['profile.headline', 'profile.tagline', 'tagline', 'headline'].includes(fieldPath)) {
      updated.tagline = value;
    } else if (['profile.about', 'aboutMe', 'bio'].includes(fieldPath)) {
      updated.aboutMe = value;
    } else if (['profile.photo', 'profileImage', 'avatarUrl'].includes(fieldPath)) {
      updated.profileImage = value;
    } else if (fieldPath.startsWith('social.')) {
      const key = fieldPath.split('.')[1];
      updated.socialLinks = { ...(updated.socialLinks || {}), [key]: value };
    } else if (fieldPath.startsWith('projects[')) {
      const m = fieldPath.match(/projects\[(\d+)\](?:\.(.+))?/);
      if (m) {
        const idx = parseInt(m[1], 10); const sub = m[2] || 'title';
        const arr = [...(updated.projects || [])];
        if (arr[idx]) arr[idx] = { ...arr[idx], [sub]: value };
        updated.projects = arr;
      }
    } else if (/^(experience|timeline)\[(\d+)\]/.test(fieldPath)) {
      const m = fieldPath.match(/(?:experience|timeline)\[(\d+)\](?:\.(.+))?/);
      if (m) {
        const idx = parseInt(m[1], 10); const sub = m[2] || 'title';
        const arr = [...(updated.timeline || [])];
        if (arr[idx]) arr[idx] = { ...arr[idx], [sub]: value };
        updated.timeline = arr;
      }
    } else if (fieldPath.startsWith('skills[')) {
      const m = fieldPath.match(/skills\[(\d+)\]/);
      if (m) {
        const arr = [...(updated.skills || [])];
        arr[parseInt(m[1], 10)] = value;
        updated.skills = arr;
      }
    } else {
      updated[fieldPath] = value;
    }

    this.portfolio = updated;
    this.notify();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Default Factory Helpers
  // ─────────────────────────────────────────────────────────────────────────

  private createDefaultItem(collectionKey: string, existingList: any[]): any {
    return createUniversalCollectionObject(collectionKey, existingList);
  }
}

export function createUniversalCollectionObject(collectionKey: string, existingList?: any[]): any {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);

  const keyLower = (collectionKey || '').toLowerCase();
  const prefix = keyLower.slice(0, 4);
  const sample = existingList && existingList.length > 0 ? existingList[0] : null;

  if (typeof sample === 'string' || (keyLower === 'skills' && (!sample || typeof sample === 'string'))) {
    return 'New Skill';
  }

  // 1. Projects
  if (keyLower === 'projects' || keyLower === 'project' || keyLower === 'portfolio') {
    return {
      id: `proj-${timestamp}-${random}`,
      title: 'New Portfolio Project',
      name: 'New Portfolio Project',
      projectName: 'New Portfolio Project',
      subtitle: 'Modern Web Application & Cloud Architecture',
      tagline: 'Modern Web Application & Cloud Architecture',
      desc: 'Engineered a full-stack web application with responsive UI, robust backend services, and automated CI/CD.',
      description: 'Engineered a full-stack web application with responsive UI, robust backend services, and automated CI/CD.',
      summary: 'Engineered a full-stack web application with responsive UI, robust backend services, and automated CI/CD.',
      details: 'Engineered a full-stack web application with responsive UI, robust backend services, and automated CI/CD.',
      tags: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      technologies: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      tech: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      link: 'https://github.com',
      liveUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      github: 'https://github.com',
      url: 'https://github.com',
      href: 'https://github.com',
      category: 'Full Stack',
      type: 'Web Application',
      subCategory: 'Frontend & Backend',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Designed high-performance user interface with optimized bundle size and fast render times.',
        'Integrated RESTful APIs and real-time state management for seamless interactions.'
      ],
      metrics: [
        { label: 'Performance', value: '99%' },
        { label: 'Uptime', value: '99.9%' }
      ],
      featured: false,
    };
  }

  // 2. Timeline / Experience / Work
  if (keyLower === 'timeline' || keyLower === 'experience' || keyLower === 'work' || keyLower === 'workexperience') {
    return {
      id: `exp-${timestamp}-${random}`,
      title: 'Software Engineer',
      role: 'Software Engineer',
      position: 'Software Engineer',
      designation: 'Software Engineer',
      company: 'Tech Enterprise',
      organization: 'Tech Enterprise',
      employer: 'Tech Enterprise',
      subtitle: 'Tech Enterprise',
      period: '2023 – Present',
      date: '2023 – Present',
      duration: '2023 – Present',
      year: '2023 – Present',
      years: '2023 – Present',
      startDate: '2023',
      endDate: 'Present',
      start: '2023',
      end: 'Present',
      location: 'Remote',
      type: 'Full-Time',
      current: true,
      desc: 'Engineered high-performance web applications and collaborated with cross-functional product teams.',
      description: 'Engineered high-performance web applications and collaborated with cross-functional product teams.',
      summary: 'Engineered high-performance web applications and collaborated with cross-functional product teams.',
      achievements: [
        'Architected core system features delivering sub-second latency and 99.9% uptime.',
        'Collaborated with cross-functional teams to design, test, and deploy production software.'
      ],
      highlights: [
        'Architected core system features delivering sub-second latency and 99.9% uptime.',
        'Collaborated with cross-functional teams to design, test, and deploy production software.'
      ],
      details: [
        'Architected core system features delivering sub-second latency and 99.9% uptime.',
        'Collaborated with cross-functional teams to design, test, and deploy production software.'
      ],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      tags: ['Engineering', 'Product'],
      featured: false,
    };
  }

  // 3. Education
  if (keyLower === 'education' || keyLower === 'edu' || keyLower === 'academics') {
    return {
      id: `edu-${timestamp}-${random}`,
      title: 'Bachelor of Technology',
      degree: 'Bachelor of Technology',
      qualification: 'Bachelor of Technology',
      credential: 'Bachelor of Technology',
      school: 'University Institute of Technology',
      university: 'University Institute of Technology',
      institution: 'University Institute of Technology',
      college: 'University Institute of Technology',
      company: 'University Institute of Technology',
      field: 'Computer Science & Engineering',
      fieldOfStudy: 'Computer Science & Engineering',
      department: 'Computer Science & Engineering',
      specialization: 'Computer Science & Engineering',
      major: 'Computer Science & Engineering',
      period: '2020 – 2024',
      duration: '2020 – 2024',
      year: '2020 – 2024',
      years: '2020 – 2024',
      date: '2020 – 2024',
      startYear: '2020',
      endYear: '2024',
      startDate: '2020',
      endDate: '2024',
      start: '2020',
      end: '2024',
      gpa: '8.8 / 10.0',
      grade: '8.8 / 10.0',
      cgpa: '8.8 / 10.0',
      location: 'Campus City',
      honors: 'First Class with Distinction',
      desc: 'Core coursework in Algorithms, Data Structures, Operating Systems, and Distributed Computing.',
      description: 'Core coursework in Algorithms, Data Structures, Operating Systems, and Distributed Computing.',
      highlights: [
        'Specialized in Algorithms, Distributed Systems, and Modern Software Engineering.',
        'Participated in university hackathons and led the developer student club.'
      ],
      keyCourses: ['Data Structures & Algorithms', 'Operating Systems', 'Database Management', 'Computer Networks'],
      courses: ['Data Structures & Algorithms', 'Operating Systems', 'Database Management', 'Computer Networks'],
      featured: false,
    };
  }

  // 4. Certifications / Certificates / Awards
  if (keyLower === 'certifications' || keyLower === 'certificates' || keyLower === 'awards' || keyLower === 'achievements') {
    return {
      id: `cert-${timestamp}-${random}`,
      name: 'Professional Cloud & Engineering Certification',
      title: 'Professional Cloud & Engineering Certification',
      credential: 'Professional Cloud & Engineering Certification',
      issuer: 'Technical Certification Authority',
      organization: 'Technical Certification Authority',
      authority: 'Technical Certification Authority',
      issuedBy: 'Technical Certification Authority',
      date: '2024',
      year: '2024',
      issueDate: '2024',
      link: 'https://credentials.example.com',
      url: 'https://credentials.example.com',
      credentialUrl: 'https://credentials.example.com',
      desc: 'Demonstrated proficiency in building, deploying, and maintaining production cloud systems.',
      description: 'Demonstrated proficiency in building, deploying, and maintaining production cloud systems.',
    };
  }

  // 5. Skills (Object form)
  if (keyLower === 'skills' || keyLower === 'skill') {
    return {
      id: `skill-${timestamp}-${random}`,
      name: 'New Skill',
      title: 'New Skill',
      skill: 'New Skill',
      category: 'Technical Skills',
      level: 'Advanced',
      proficiency: 'Advanced',
      rating: 5,
    };
  }

  // 6. Generic schema from sample object if available
  if (sample && typeof sample === 'object') {
    const cloned = { ...sample, id: `${prefix}-${timestamp}-${random}` };
    Object.keys(cloned).forEach((k) => {
      if (k === 'id' || k === '__type') return;
      const val = cloned[k];
      if (typeof val === 'boolean') cloned[k] = false;
      else if (typeof val === 'number') cloned[k] = 0;
      else if (Array.isArray(val)) cloned[k] = [];
      else if (typeof val === 'string' && val.length > 0) cloned[k] = val;
      else cloned[k] = '';
    });
    return cloned;
  }

  // Fallback object
  return {
    id: `item-${timestamp}-${random}`,
    title: 'New Item',
    name: 'New Item',
    description: '',
    desc: '',
    featured: false,
  };
}

export interface ReflectedProperty {
  key: string;
  label: string;
  type: 'text' | 'longtext' | 'url' | 'image' | 'array' | 'boolean' | 'number';
  value: any;
}

export function reflectObjectProperties(obj: Record<string, any>, collectionKey?: string): ReflectedProperty[] {
  if (!obj || typeof obj !== 'object') return [];

  const keyLower = (collectionKey || '').toLowerCase();

  // 1. CANONICAL EDUCATION SCHEMA
  if (keyLower.includes('edu')) {
    const degreeVal = obj.degree || obj.title || obj.qualification || obj.credential || '';
    const instVal = obj.institution || obj.school || obj.university || obj.college || obj.company || '';
    const fieldVal = obj.fieldOfStudy || obj.field || obj.department || obj.specialization || obj.major || '';
    const startVal = obj.startDate || obj.startYear || obj.start || obj.from || (typeof obj.period === 'string' ? obj.period.split(/[–\-]/)[0]?.trim() : '') || '';
    const endVal = obj.endDate || obj.endYear || obj.graduationYear || obj.end || obj.to || (typeof obj.period === 'string' ? obj.period.split(/[–\-]/)[1]?.trim() : '') || '';
    const descVal = obj.description || obj.desc || obj.details || obj.summary || '';

    return [
      { key: 'degree', label: 'Degree / Qualification', type: 'text', value: degreeVal },
      { key: 'institution', label: 'Institution / University', type: 'text', value: instVal },
      { key: 'field', label: 'Field of Study / Department', type: 'text', value: fieldVal },
      { key: 'startDate', label: 'Start Date / Year', type: 'text', value: startVal },
      { key: 'endDate', label: 'End Date / Graduation Year', type: 'text', value: endVal },
      { key: 'description', label: 'Description & Details', type: 'longtext', value: descVal },
    ];
  }

  // 2. CANONICAL EXPERIENCE SCHEMA
  if (keyLower.includes('exp') || keyLower.includes('timeline') || keyLower.includes('work')) {
    const roleVal = obj.role || obj.title || obj.position || '';
    const compVal = obj.company || obj.organization || obj.employer || '';
    const startVal = obj.startDate || obj.start || (typeof obj.period === 'string' ? obj.period.split('-')[0]?.trim() : '') || '';
    const endVal = obj.endDate || obj.end || (obj.current ? 'Present' : '') || (typeof obj.period === 'string' ? obj.period.split('-')[1]?.trim() : '') || '';
    const currVal = Boolean(obj.current || (typeof endVal === 'string' && endVal.toLowerCase() === 'present'));
    const descVal = obj.description || obj.desc || obj.summary || (Array.isArray(obj.details) ? obj.details.join('\n') : '');

    return [
      { key: 'role', label: 'Role / Position Title', type: 'text', value: roleVal },
      { key: 'company', label: 'Company / Organization', type: 'text', value: compVal },
      { key: 'startDate', label: 'Start Date', type: 'text', value: startVal },
      { key: 'endDate', label: 'End Date', type: 'text', value: endVal },
      { key: 'current', label: 'Current Role', type: 'boolean', value: currVal },
      { key: 'description', label: 'Description & Achievements', type: 'longtext', value: descVal },
    ];
  }

  // 3. CANONICAL PROJECT SCHEMA
  if (keyLower.includes('proj')) {
    const titleVal = obj.title || obj.name || obj.projectName || '';
    const descVal = obj.description || obj.desc || obj.summary || '';
    const techVal = Array.isArray(obj.technologies) ? obj.technologies : (Array.isArray(obj.tags) ? obj.tags : (Array.isArray(obj.tech) ? obj.tech : []));
    const linkVal = obj.link || obj.liveUrl || obj.url || obj.href || '';
    const githubVal = obj.github || obj.githubUrl || '';
    const imageVal = obj.image || obj.imageUrl || obj.thumbnail || '';

    return [
      { key: 'title', label: 'Project Title', type: 'text', value: titleVal },
      { key: 'description', label: 'Description', type: 'longtext', value: descVal },
      { key: 'technologies', label: 'Technologies & Tags', type: 'array', value: techVal },
      { key: 'link', label: 'Live Demo URL', type: 'url', value: linkVal },
      { key: 'github', label: 'GitHub Repository URL', type: 'url', value: githubVal },
      { key: 'image', label: 'Project Image', type: 'image', value: imageVal },
    ];
  }

  // 4. CANONICAL CERTIFICATION SCHEMA
  if (keyLower.includes('cert') || keyLower.includes('award')) {
    const titleVal = obj.title || obj.name || obj.credential || '';
    const issuerVal = obj.issuer || obj.organization || '';
    const dateVal = obj.date || obj.year || obj.issueDate || '';
    const urlVal = obj.url || obj.link || obj.credentialUrl || '';

    return [
      { key: 'title', label: 'Title / Certification Name', type: 'text', value: titleVal },
      { key: 'issuer', label: 'Issuing Organization', type: 'text', value: issuerVal },
      { key: 'date', label: 'Date / Year', type: 'text', value: dateVal },
      { key: 'url', label: 'Credential URL', type: 'url', value: urlVal },
    ];
  }

  // 5. CANONICAL SKILL SCHEMA
  if (keyLower.includes('skill')) {
    const nameVal = typeof obj === 'string' ? obj : (obj.name || obj.title || obj.skill || '');
    const catVal = typeof obj === 'object' ? (obj.category || obj.group || '') : '';
    const levelVal = typeof obj === 'object' ? (obj.level || obj.proficiency || '') : '';

    return [
      { key: 'name', label: 'Skill Name', type: 'text', value: nameVal },
      { key: 'category', label: 'Category', type: 'text', value: catVal },
      { key: 'level', label: 'Proficiency Level', type: 'text', value: levelVal },
    ];
  }

  // 6. Generic reflection without alias duplication
  const seenCanonicalLabels = new Set<string>();
  const result: ReflectedProperty[] = [];
  const entries = Object.entries(obj).filter(([k]) => !['id', '__type', 'key'].includes(k));

  for (const [key, value] of entries) {
    let canonicalKey = key;

    if (['role', 'position', 'positionTitle'].includes(key)) {
      if (obj.title !== undefined && key !== 'title') continue;
      canonicalKey = 'title';
    } else if (['organization', 'employer'].includes(key)) {
      if (obj.company !== undefined && key !== 'company') continue;
      canonicalKey = 'company';
    } else if (['period', 'date', 'start', 'startYear'].includes(key)) {
      if (obj.startDate !== undefined && key !== 'startDate') continue;
      canonicalKey = 'startDate';
    } else if (['end', 'endYear'].includes(key)) {
      if (obj.endDate !== undefined && key !== 'endDate') continue;
      canonicalKey = 'endDate';
    } else if (['desc', 'summary', 'details'].includes(key)) {
      if (obj.description !== undefined && key !== 'description') continue;
      canonicalKey = 'description';
    }

    const label = canonicalKey.charAt(0).toUpperCase() + canonicalKey.slice(1).replace(/([A-Z])/g, ' $1');
    if (seenCanonicalLabels.has(label.toLowerCase())) continue;
    seenCanonicalLabels.add(label.toLowerCase());

    let type: ReflectedProperty['type'] = 'text';
    if (typeof value === 'boolean') type = 'boolean';
    else if (typeof value === 'number') type = 'number';
    else if (Array.isArray(value)) type = 'array';
    else if (typeof value === 'string') {
      const lower = canonicalKey.toLowerCase();
      if (lower.includes('url') || lower.includes('link') || lower.includes('github') || lower.includes('demo')) type = 'url';
      else if (lower.includes('image') || lower.includes('photo') || lower.includes('avatar') || lower.includes('thumbnail')) type = 'image';
      else if (value.length > 50 || lower.includes('desc') || lower.includes('bio') || lower.includes('about')) type = 'longtext';
    }

    result.push({ key, label, type, value });
  }

  return result;
}
