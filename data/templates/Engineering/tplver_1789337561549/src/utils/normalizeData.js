import { DEFAULT_ENGINEERING_DATA } from './engineeringDefaults';
import defaultDataObj from './engineeringDefaults';

export function normalizeEngineeringData(rawPortfolio) {
  const def = (DEFAULT_ENGINEERING_DATA && DEFAULT_ENGINEERING_DATA.profile) 
    ? DEFAULT_ENGINEERING_DATA 
    : (defaultDataObj && defaultDataObj.profile ? defaultDataObj : null);

  const fallbackData = def || {
    profile: {
      name: "Alex Mercer",
      title: "Senior Full-Stack & Systems Architect",
      tagline: "Engineering resilient distributed systems & high-performance modern web apps",
      handwrittenNote: "Building scalable software with obsessive craft & speed.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      location: "San Francisco, CA & Remote Worldwide",
      availability: "Available for Senior Roles & High-Impact Consulting",
      experienceYears: "7+",
      email: "alex.mercer.dev@example.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      dockerhub: "https://hub.docker.com",
      leetcode: "https://leetcode.com",
      resumeUrl: "#contact"
    },
    stats: [
      { value: "7+", label: "Years Experience", sublabel: "Production Engineering" },
      { value: "48+", label: "Services Deployed", sublabel: "Microservices & Serverless" },
      { value: "99.99%", label: "Uptime Achieved", sublabel: "Critical Infrastructure" },
      { value: "1.2M+", label: "Daily Req Handled", sublabel: "Sub-50ms Latency" }
    ],
    about: {
      story: "I am a Senior Software Engineer and Systems Architect who loves building clean, hyper-performant web applications, event-driven backends, and fault-tolerant cloud architecture. Over the last 7+ years, I have helped startups scale from zero to millions of users and led modern architecture overhauls at enterprise scale.",
      philosophy: [
        {
          title: "Clean Architecture & Ergonomics",
          desc: "Type safety, composable APIs, and modular abstractions that make teams move 10x faster without breaking production."
        },
        {
          title: "Observability & Resilience First",
          desc: "If it cannot be monitored and automatically recovered, it is not ready for production. Traces, SLOs, and circuit breakers by default."
        },
        {
          title: "Obsession with User Experience",
          desc: "Engineers should care deeply about latency, smooth micro-interactions, accessibility, and visual polish just as much as backend throughput."
        }
      ],
      handwrittenNote: "Building scalable software with obsessive craft & speed."
    },
    education: [
      {
        id: "edu-1",
        institution: "Stanford University",
        degree: "M.S. in Computer Science (Distributed Systems)",
        field: "Systems & Infrastructure",
        location: "Stanford, CA",
        period: "2017 – 2019",
        gpa: "3.94 / 4.0",
        honors: "Graduate Fellowship & Outstanding Thesis Award",
        highlights: [
          "Researched Byzantine fault tolerance & lockless consensus protocols under the Distributed Systems Group.",
          "Published paper on 'Adaptive Gossip Protocols for Sub-Millisecond Node State Sync in Multi-Region Clusters'.",
          "Head Teaching Assistant for Advanced Operating Systems (CS240) & Cloud Infrastructure (CS349D)."
        ],
        keyCourses: [
          "Advanced Distributed Systems",
          "Operating Systems Principles",
          "Database System Implementation",
          "Cloud Computing Architecture",
          "Asynchronous Network Programming",
          "Fault-Tolerant Computing"
        ]
      },
      {
        id: "edu-2",
        institution: "UC Berkeley",
        degree: "B.S. in Electrical Engineering & Computer Sciences",
        field: "Computer Science Honours",
        location: "Berkeley, CA",
        period: "2013 – 2017",
        gpa: "3.91 / 4.0",
        honors: "Summa Cum Laude, Eta Kappa Nu (EECS Honor Society)",
        highlights: [
          "President of the Berkeley Open Computing Facility (OCF), managing campus-wide UNIX infrastructure for 30,000+ students.",
          "1st Place Winner at CalHacks 2016 for building a decentralized peer-to-peer compute grid.",
          "Undergraduate research in high-throughput network packet classification on multi-core architectures."
        ],
        keyCourses: [
          "Data Structures & Algorithms (CS61B)",
          "Structure & Interpretation of Computer Programs (CS61A)",
          "Computer Architecture (CS61C)",
          "Internet Architecture & Protocols (CS168)",
          "Feedback Control Systems",
          "Machine Learning (CS189)"
        ]
      }
    ],
    experience: [
      {
        id: "exp-1",
        role: "Lead Systems Architect & Staff Engineer",
        company: "Apex Cloud Networks",
        type: "Full-Time Staff",
        location: "San Francisco, CA (Hybrid)",
        duration: "2022 – Present",
        period: "2022 – Present",
        year: "2022 - 2026",
        achievements: [
          "Architected multi-region event pipeline handling 1.2M+ websocket events/sec with sub-45ms global latency using Rust & Kafka.",
          "Reduced annual cloud compute & egress spending by 38% ($420k/yr) by redesigning Kubernetes cluster auto-scaling and memory footprint.",
          "Mentored team of 14 senior engineers across distributed systems, telemetry, and web frontend infrastructure."
        ],
        techStack: ["Go", "Rust", "Kafka", "Kubernetes", "AWS EKS", "ClickHouse", "Terraform", "TypeScript", "Next.js"]
      },
      {
        id: "exp-2",
        role: "Senior Full-Stack Engineer",
        company: "Vortex Intelligence",
        type: "Full-Time",
        location: "San Francisco, CA",
        duration: "2019 – 2022",
        period: "2019 – 2022",
        year: "2019 - 2022",
        achievements: [
          "Engineered real-time data visualizer with Canvas/WebGL frontend and Go backend, serving 40k+ concurrent active sessions.",
          "Built resilient GraphQL federation gateway uniting 12 microservices with automated distributed tracing & caching.",
          "Spearheaded 100% CI/CD migration to GitHub Actions & ArgoCD, slashing deployment rollback frequency to under 0.2%."
        ],
        techStack: ["TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Docker", "GCP"]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "PulseStream — Distributed Realtime Engine",
        subtitle: "Sub-millisecond pub/sub broker & telemetry pipeline",
        description: "A distributed streaming engine written in Go and Rust that handles fault-tolerant event streams with zero-copy deserialization and raft-backed partition replication.",
        tags: ["Go", "Rust", "Raft Consensus", "gRPC", "Prometheus"],
        category: "Systems & Cloud",
        metrics: [
          { label: "Throughput", value: "850k ops/sec" },
          { label: "P99 Latency", value: "< 2.8ms" },
          { label: "Availability", value: "99.999%" }
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://github.com"
      },
      {
        id: "proj-2",
        title: "KubeShield — Zero-Trust Cluster Firewall",
        subtitle: "Automated eBPF-powered network security mesh",
        description: "Lightweight kernel-level security agent for Kubernetes clusters that detects unauthorized egress calls and enforces network isolation policies in real-time.",
        tags: ["eBPF", "C", "Rust", "Kubernetes", "Cilium", "OpenTelemetry"],
        category: "DevOps & Security",
        metrics: [
          { label: "Kernel Overhead", value: "< 0.4%" },
          { label: "Threat Detection", value: "Instantaneous" },
          { label: "Adoption", value: "12k+ Stars" }
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://github.com"
      },
      {
        id: "proj-3",
        title: "NovaDB — Embedded Vector & Key-Value Store",
        subtitle: "High-density SIMD-accelerated local search database",
        description: "An embedded storage engine optimized for local AI inference and semantic search with SIMD-vector indexing, lockless memory maps, and transactional crash safety.",
        tags: ["Rust", "AVX-512", "HNSW Index", "WASM", "RocksDB API"],
        category: "Database & AI",
        metrics: [
          { label: "Search QPS", value: "42,000 / sec" },
          { label: "Memory Footprint", value: "14MB Idle" },
          { label: "Vector Dims", value: "Up to 1536" }
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://github.com"
      }
    ],
    skills: [
      {
        id: "cat-1",
        category: "Backend & Systems",
        description: "Core languages, runtime architectures & event systems",
        skills: [
          { name: "Go (Golang)", level: 96, icon: "Terminal", tag: "Expert" },
          { name: "Rust", level: 90, icon: "Cpu", tag: "Advanced" },
          { name: "Node.js / TypeScript", level: 95, icon: "Code2", tag: "Expert" },
          { name: "Python", level: 88, icon: "Binary", tag: "Advanced" },
          { name: "gRPC & Protobuf", level: 92, icon: "Workflow", tag: "Expert" },
          { name: "Kafka & Event-Driven", level: 90, icon: "Activity", tag: "Advanced" }
        ]
      },
      {
        id: "cat-2",
        category: "Cloud Native & DevOps",
        description: "Container orchestration, observability & infrastructure as code",
        skills: [
          { name: "Kubernetes (K8s)", level: 94, icon: "Server", tag: "Expert" },
          { name: "Docker & OCI", level: 96, icon: "Box", tag: "Expert" },
          { name: "AWS & GCP", level: 92, icon: "Cloud", tag: "Expert" },
          { name: "Terraform / OpenTofu", level: 90, icon: "Layers", tag: "Advanced" },
          { name: "CI/CD & GitOps", level: 94, icon: "GitBranch", tag: "Expert" },
          { name: "Prometheus & Grafana", level: 89, icon: "Gauge", tag: "Advanced" }
        ]
      },
      {
        id: "cat-3",
        category: "Full-Stack Web & Tools",
        description: "Modern frontend frameworks, API design & database engines",
        skills: [
          { name: "Next.js & React", level: 95, icon: "Layout", tag: "Expert" },
          { name: "Tailwind CSS", level: 94, icon: "Palette", tag: "Expert" },
          { name: "PostgreSQL & Prisma", level: 92, icon: "Database", tag: "Advanced" },
          { name: "Redis & Valkey", level: 90, icon: "Zap", tag: "Advanced" },
          { name: "GraphQL & REST", level: 94, icon: "Network", tag: "Expert" },
          { name: "Linux & Bash", level: 95, icon: "TerminalSquare", tag: "Expert" }
        ]
      }
    ],
    certificates: [
      {
        id: "cert-1",
        title: "AWS Certified Solutions Architect – Professional (SAP-C02)",
        issuer: "Amazon Web Services",
        date: "2023",
        verifyUrl: "https://aws.amazon.com",
        badge: "Professional Level"
      },
      {
        id: "cert-2",
        title: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF / Linux Foundation)",
        date: "2022",
        verifyUrl: "https://cncf.io",
        badge: "Core Infrastructure"
      },
      {
        id: "cert-3",
        title: "HashiCorp Certified: Terraform Associate",
        issuer: "HashiCorp",
        date: "2023",
        verifyUrl: "https://hashicorp.com",
        badge: "Infrastructure as Code"
      }
    ],
    contact: {
      location: "San Francisco, CA & Remote Worldwide",
      phone: "+1 (415) 890-3421",
      email: "alex.mercer.dev@example.com",
      responseTime: "Guaranteed Response < 24 Hours",
      telegram: "@alexmercer_arch"
    }
  };

  const activeDef = fallbackData;

  if (!rawPortfolio || typeof rawPortfolio !== 'object') {
    return activeDef;
  }

  const p = rawPortfolio;

  // 1. Resolve Profile & Socials
  const rawName = p.name || p.fullName || p.profile?.name || p.personal?.fullName || p.basics?.name || activeDef.profile.name;
  const rawTitle = p.headline || p.title || p.role || p.profile?.title || p.personal?.headline || p.basics?.label || activeDef.profile.title;
  const rawTagline = p.tagline || p.hero?.tagline || p.hero?.subtitle || activeDef.profile.tagline;
  const rawBio = p.bio || p.aboutMe || p.summary || p.about?.story || p.about?.description || p.profile?.summary || activeDef.about.story;
  const rawLocation = p.location || p.city || p.profile?.location || p.personal?.location || p.basics?.location?.city || activeDef.profile.location;
  const rawEmail = p.email || p.contact?.email || p.personal?.email || p.basics?.email || activeDef.profile.email;
  const rawPhone = p.phone || p.contact?.phone || p.personal?.phone || p.basics?.phone || activeDef.contact.phone;

  // Resolve Profile Image
  const rawAvatar = 
    p.profileImage ||
    p.avatarUrl ||
    p.about?.avatarUrl ||
    p.hero?.avatarUrl ||
    p.profile?.avatarUrl ||
    p.profile?.photo ||
    p.personal?.profilePhoto ||
    p.basics?.picture ||
    activeDef.profile.avatarUrl;

  const rawGithub = p.socials?.github || p.socialLinks?.github || p.github || p.profile?.github || activeDef.profile.github;
  const rawLinkedin = p.socials?.linkedin || p.socialLinks?.linkedin || p.linkedin || p.profile?.linkedin || activeDef.profile.linkedin;
  const rawTwitter = p.socials?.twitter || p.socialLinks?.twitter || p.twitter || p.profile?.twitter || activeDef.profile.twitter;

  const profile = {
    name: rawName,
    title: rawTitle,
    tagline: rawTagline,
    handwrittenNote: p.about?.handwrittenNote || activeDef.profile.handwrittenNote,
    avatarUrl: rawAvatar,
    location: rawLocation,
    availability: p.availability || p.profile?.availability || activeDef.profile.availability,
    experienceYears: p.experienceYears || (Array.isArray(p.experience) && p.experience.length > 0 ? `${p.experience.length}+` : activeDef.profile.experienceYears),
    email: rawEmail,
    github: rawGithub,
    linkedin: rawLinkedin,
    twitter: rawTwitter,
    dockerhub: p.socials?.dockerhub || activeDef.profile.dockerhub,
    leetcode: p.socials?.leetcode || activeDef.profile.leetcode,
    resumeUrl: p.resumeUrl || p.resume || activeDef.profile.resumeUrl,
  };

  // 2. Resolve Stats
  let stats = activeDef.stats;
  if (Array.isArray(p.stats) && p.stats.length > 0) {
    stats = p.stats.map((s, i) => ({
      value: s.value || s.number || (s.suffix ? `${s.number}${s.suffix}` : '99%'),
      label: s.label || s.title || `Metric ${i + 1}`,
      sublabel: s.sublabel || s.description || 'Verified'
    }));
  } else {
    const expCount = Array.isArray(p.experience) && p.experience.length > 0 ? `${p.experience.length}+` : '7+';
    const projCount = Array.isArray(p.projects) && p.projects.length > 0 ? `${p.projects.length}+` : '48+';
    stats = [
      { value: expCount, label: "Years Experience", sublabel: "Production Engineering" },
      { value: projCount, label: "Projects Built", sublabel: "Production Systems" },
      { value: "99.99%", label: "Uptime & Quality", sublabel: "Critical Infrastructure" },
      { value: "1.2M+", label: "Daily Req Handled", sublabel: "Sub-50ms Latency" },
    ];
  }

  // 3. Resolve About
  const about = {
    story: rawBio,
    philosophy: Array.isArray(p.about?.philosophy) && p.about.philosophy.length > 0 ? p.about.philosophy : activeDef.about.philosophy,
    handwrittenNote: p.about?.handwrittenNote || activeDef.about.handwrittenNote
  };

  // 4. Resolve Education (100% user data preserved)
  let education = activeDef.education;
  if (Array.isArray(p.education) && p.education.length > 0) {
    education = p.education.map((edu, idx) => {
      const sYear = edu.startDate || edu.startYear || edu.from || '';
      const eYear = edu.endDate || edu.endYear || edu.to || edu.graduationYear || '';
      const period = edu.period || edu.duration || edu.year || (sYear && eYear ? `${sYear} – ${eYear}` : (sYear || eYear || '2020 – 2024'));

      return {
        id: edu.id || `edu-${idx + 1}`,
        institution: edu.institution || edu.school || edu.university || edu.college || 'University',
        degree: edu.degree || edu.qualification || edu.title || 'Degree in Computer Science',
        field: edu.field || edu.fieldOfStudy || edu.major || edu.department || 'Computer Science & Engineering',
        location: edu.location || edu.city || profile.location || 'San Francisco, CA',
        period: period,
        gpa: edu.gpa || edu.grade || '',
        honors: edu.honors || edu.score || '',
        highlights: Array.isArray(edu.highlights) && edu.highlights.length > 0 ? edu.highlights : (
          edu.description ? [edu.description] : [
            "Specialized in high-performance algorithms, system software, and scalable data infrastructure.",
            "Collaborated on open-source research and distributed computing coursework."
          ]
        ),
        keyCourses: Array.isArray(edu.keyCourses) && edu.keyCourses.length > 0 ? edu.keyCourses : (
          Array.isArray(edu.courses) && edu.courses.length > 0 ? edu.courses : [
            "Distributed Systems",
            "Operating Systems",
            "Algorithms & Complexity",
            "Cloud Infrastructure",
            "Database Internals"
          ]
        )
      };
    });
  }

  // 5. Resolve Experience (100% user data preserved)
  let experience = activeDef.experience;
  if (Array.isArray(p.experience) && p.experience.length > 0) {
    experience = p.experience.map((exp, idx) => {
      const sYear = exp.startDate || exp.startYear || exp.from || '';
      const eYear = exp.endDate || exp.endYear || exp.to || (exp.current ? 'Present' : '');
      const period = exp.period || exp.duration || exp.year || (sYear && eYear ? `${sYear} – ${eYear}` : (sYear || eYear || '2022 – Present'));

      let achievements = [];
      if (Array.isArray(exp.achievements) && exp.achievements.length > 0) {
        achievements = exp.achievements;
      } else if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
        achievements = exp.highlights;
      } else if (Array.isArray(exp.bullets) && exp.bullets.length > 0) {
        achievements = exp.bullets;
      } else if (exp.description) {
        achievements = [exp.description];
      } else {
        achievements = [
          "Engineered high-throughput service components and automated mission-critical workflows.",
          "Collaborated across engineering teams to ship reliable, high-performance features on schedule."
        ];
      }

      const techStack = Array.isArray(exp.techStack) && exp.techStack.length > 0
        ? exp.techStack
        : (Array.isArray(exp.skills) && exp.skills.length > 0 ? exp.skills : ["Go", "Kubernetes", "TypeScript", "PostgreSQL"]);

      return {
        id: exp.id || `exp-${idx + 1}`,
        role: exp.role || exp.title || exp.position || 'Software Engineer',
        company: exp.company || exp.employer || exp.organization || 'Tech Enterprise',
        type: exp.type || 'Full-Time',
        location: exp.location || profile.location || 'Remote',
        duration: period,
        period: period,
        year: period,
        achievements: achievements,
        techStack: techStack
      };
    });
  }

  // 6. Resolve Projects (100% user data preserved)
  let projects = activeDef.projects;
  if (Array.isArray(p.projects) && p.projects.length > 0) {
    projects = p.projects.map((proj, idx) => {
      const tags = Array.isArray(proj.tags) && proj.tags.length > 0
        ? proj.tags
        : (Array.isArray(proj.technologies) && proj.technologies.length > 0 ? proj.technologies : ["Systems", "Full-Stack", "Cloud"]);

      let metrics = [];
      if (Array.isArray(proj.metrics) && proj.metrics.length > 0) {
        metrics = proj.metrics;
      } else if (proj.stars || proj.users) {
        metrics = [
          { label: "Users / Stars", value: proj.stars || proj.users || "10k+" },
          { label: "Status", value: "Production Ready" },
          { label: "Reliability", value: "99.9%" }
        ];
      } else {
        metrics = [
          { label: "Performance", value: "Sub-5ms" },
          { label: "Availability", value: "99.99%" },
          { label: "Adoption", value: "Production" }
        ];
      }

      return {
        id: proj.id || `proj-${idx + 1}`,
        title: proj.title || proj.name || `Engineering Project ${idx + 1}`,
        subtitle: proj.subtitle || proj.tagline || proj.category || 'Architecture & Engineering',
        description: proj.description || proj.summary || 'Engineered high-performance software application with resilient architecture and clean APIs.',
        tags: tags,
        category: proj.category || 'Systems & Web',
        metrics: metrics,
        githubUrl: proj.githubUrl || proj.github || proj.link || profile.github || "https://github.com",
        liveUrl: proj.liveUrl || proj.url || proj.demoUrl || proj.link || profile.github || "https://github.com",
      };
    });
  }

  // 7. Resolve Skills (Group ALL uploaded user skills dynamically into 3 Pillars)
  let skills = activeDef.skills;
  if (Array.isArray(p.skills) && p.skills.length > 0) {
    const rawSkillList = [];
    p.skills.forEach(sk => {
      if (typeof sk === 'string') {
        rawSkillList.push({ name: sk, level: 90, icon: 'Code2', tag: 'Proficient' });
      } else if (sk && typeof sk === 'object') {
        if (Array.isArray(sk.skills)) {
          sk.skills.forEach(sItem => {
            const sName = typeof sItem === 'string' ? sItem : (sItem.name || sItem.skill || '');
            if (sName) {
              rawSkillList.push({
                name: sName,
                level: typeof sItem === 'object' && sItem.level ? sItem.level : 90,
                icon: (typeof sItem === 'object' && sItem.icon) ? sItem.icon : 'Code2',
                tag: (typeof sItem === 'object' && sItem.tag) ? sItem.tag : 'Verified'
              });
            }
          });
        } else if (sk.name || sk.skill) {
          rawSkillList.push({
            name: sk.name || sk.skill,
            level: sk.level || 90,
            icon: sk.icon || 'Code2',
            tag: sk.tag || 'Verified'
          });
        }
      }
    });

    if (rawSkillList.length > 0) {
      const perCategory = Math.ceil(rawSkillList.length / 3);
      const cat1Skills = rawSkillList.slice(0, perCategory);
      const cat2Skills = rawSkillList.slice(perCategory, perCategory * 2);
      const cat3Skills = rawSkillList.slice(perCategory * 2);

      const icons1 = ['Terminal', 'Cpu', 'Code2', 'Binary', 'Workflow', 'Activity'];
      const icons2 = ['Server', 'Box', 'Cloud', 'Layers', 'GitBranch', 'Gauge'];
      const icons3 = ['Layout', 'Palette', 'Database', 'Zap', 'Network', 'TerminalSquare'];

      skills = [
        {
          id: "cat-1",
          category: "Backend & Systems",
          description: "Core languages, runtime architectures & event systems",
          skills: (cat1Skills.length > 0 ? cat1Skills : activeDef.skills[0].skills).map((s, idx) => ({
            ...s,
            icon: icons1[idx % icons1.length]
          }))
        },
        {
          id: "cat-2",
          category: "Cloud Native & DevOps",
          description: "Container orchestration, observability & infrastructure as code",
          skills: (cat2Skills.length > 0 ? cat2Skills : activeDef.skills[1].skills).map((s, idx) => ({
            ...s,
            icon: icons2[idx % icons2.length]
          }))
        },
        {
          id: "cat-3",
          category: "Full-Stack Web & Tools",
          description: "Modern frontend frameworks, API design & database engines",
          skills: (cat3Skills.length > 0 ? cat3Skills : activeDef.skills[2].skills).map((s, idx) => ({
            ...s,
            icon: icons3[idx % icons3.length]
          }))
        }
      ];
    }
  }

  // 8. Resolve Certificates (100% user data preserved)
  let certificates = activeDef.certificates;
  const rawCerts = p.certificates || p.certifications || p.credentials || [];
  if (Array.isArray(rawCerts) && rawCerts.length > 0) {
    certificates = rawCerts.map((cert, idx) => ({
      id: cert.id || `cert-${idx + 1}`,
      title: cert.title || cert.name || `Professional Certification ${idx + 1}`,
      issuer: cert.issuer || cert.organization || cert.authority || 'Issuing Organization',
      date: cert.date || cert.year || cert.issueDate || '2023',
      verifyUrl: cert.verifyUrl || cert.url || cert.link || 'https://example.com',
      badge: cert.badge || cert.level || 'Certified'
    }));
  }

  // 9. Resolve Contact
  const contact = {
    location: rawLocation,
    phone: rawPhone,
    email: rawEmail,
    responseTime: p.contact?.responseTime || activeDef.contact.responseTime,
    telegram: p.contact?.telegram || p.socials?.telegram || activeDef.contact.telegram,
  };

  return {
    profile,
    stats,
    about,
    education: education || activeDef.education,
    experience: experience || activeDef.experience,
    projects: projects || activeDef.projects,
    skills: skills || activeDef.skills,
    skillCategories: skills || activeDef.skills,
    certificates: certificates || activeDef.certificates,
    contact,
  };
}

export default normalizeEngineeringData;
