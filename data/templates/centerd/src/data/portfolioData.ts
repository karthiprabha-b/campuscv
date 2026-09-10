export interface Project {
  id: string;
  title: string;
  category: 'UI/UX' | 'Web Apps' | 'Mobile' | 'Branding';
  tagline: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  grade?: string;
  details: string[];
  coursework: string[];
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; level: number; experience: string; iconName?: string }[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verifyUrl: string;
  badge: string;
  skillsCovered: string[];
}

export interface ServiceHighlight {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const portfolioData = {
  personal: {
    firstName: "Julia",
    lastName: "Stiles",
    brandName: "Julia.",
    role: "DESIGNER / DEVELOPER",
    tagline: "Bridging human-centered design and cutting-edge frontend architecture.",
    email: "contact@yoursite.com",
    phone: "+1 (555) 389-2910",
    location: "San Francisco, CA & Remote",
    availability: "Available for freelance & full-time roles",
    avatar: "/images/portrait.jpg",
    bio: [
      "I am a multidisciplinary Designer & Full-Stack Frontend Engineer with 6+ years of experience transforming complex systems into intuitive, elegant digital products.",
      "My work sits at the intersection of aesthetic precision, micro-interactions, and robust modern web engineering. I've partnered with venture-backed startups, Fortune 500 enterprises, and creative studios worldwide to ship products loved by millions."
    ],
    stats: [
      { value: "06+", label: "Years Experience" },
      { value: "85+", label: "Projects Completed" },
      { value: "99%", label: "Client Satisfaction" },
      { value: "14", label: "Design Awards" }
    ],
    socials: [
      { name: "Facebook", href: "https://facebook.com", icon: "Facebook" },
      { name: "Instagram", href: "https://instagram.com", icon: "Instagram" },
      { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
      { name: "LinkedIn", href: "https://linkedin.com", icon: "Linkedin" },
      { name: "GitHub", href: "https://github.com", icon: "Github" },
      { name: "Dribbble", href: "https://dribbble.com", icon: "Dribbble" }
    ]
  },

  services: [
    {
      number: "01",
      title: "UI/UX Design",
      description: "At in proin consequat ut cursus venenatis sapien. User research, design systems, and delightful micro-interactions.",
      deliverables: ["Figma Design Systems", "User Journey Maps", "Interactive Prototyping", "Design Audits"]
    },
    {
      number: "02",
      title: "Illustration",
      description: "At in proin consequat ut cursus venenatis sapien. Vector graphics, digital character design, and custom brand storytelling.",
      deliverables: ["Custom Vector Art", "Icon Systems", "Editorial Graphics", "Visual Assets"]
    },
    {
      number: "03",
      title: "Graphic Design",
      description: "At in proin consequat ut cursus venenatis sapien. Distinct visual identities, typography guidelines, and marketing art.",
      deliverables: ["Brand Identity", "Motion Design", "Typography Systems", "Print & Packaging"]
    }
  ] as ServiceHighlight[],

  experiences: [
    {
      id: "exp-1",
      role: "Lead Product Designer & Frontend Architect",
      company: "Aura Creative Labs",
      period: "2023 — Present",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-Time",
      description: "Leading the core product design and frontend team building next-generation AI analytics dashboards.",
      achievements: [
        "Redesigned enterprise analytics portal, reducing workflow time by 42% for 120k+ daily active users.",
        "Built a cross-platform design token system with Next.js, React, and CSS variables adopted across 6 internal products.",
        "Mentored a team of 8 designers and frontend engineers, establishing high accessibility (WCAG AAA) standards."
      ],
      skills: ["Design Systems", "Next.js", "TypeScript", "Figma", "Design Tokens", "Accessibility"]
    },
    {
      id: "exp-2",
      role: "Senior UI/UX & Web Developer",
      company: "Hyperion Digital Agency",
      period: "2021 — 2023",
      location: "New York, NY (Remote)",
      type: "Full-Time",
      description: "Delivered high-impact web apps and e-commerce platforms for global clients across fintech and luxury retail.",
      achievements: [
        "Engineered 18+ client web apps with 99.9% uptime, achieving average Lighthouse performance scores of 98/100.",
        "Spearheaded motion design and fluid interaction libraries that drove a 35% boost in landing page conversion rates.",
        "Authored reusable animation primitives and responsive layout engines."
      ],
      skills: ["React", "UI/UX Architecture", "Vanilla CSS", "GraphQL", "Client Leadership"]
    },
    {
      id: "exp-3",
      role: "Product & Interaction Designer",
      company: "Studio Vertex",
      period: "2019 — 2021",
      location: "Seattle, WA",
      type: "Full-Time",
      description: "Created human-centered digital experiences, brand identities, and mobile app wireframes from concept to launch.",
      achievements: [
        "Designed and validated MVP for a fintech mobile app acquired by a leading financial institution for $14M.",
        "Conducted 50+ qualitative user testing sessions to iterate on frictionless onboarding flows."
      ],
      skills: ["User Testing", "Figma", "Prototyping", "Design Strategy", "Mobile UI"]
    }
  ] as ExperienceItem[],

  education: [
    {
      id: "edu-1",
      degree: "Master of Science in Human-Computer Interaction (HCI)",
      institution: "Stanford University",
      period: "2017 — 2019",
      location: "Stanford, CA",
      grade: "3.94 GPA — Graduated with Honors",
      details: [
        "Specialized in interactive systems, cognitive ergonomics, and AI-assisted design interfaces.",
        "Published thesis on 'Micro-Feedback Mechanisms in High-Stakes Financial Dashboards'.",
        "Recipient of the Excellence in Digital Design Fellowship."
      ],
      coursework: [
        "Interactive UI Architecture",
        "User-Centered Research",
        "Advanced Cognitive Psychology",
        "Data Visualization & Information Aesthetics"
      ]
    },
    {
      id: "edu-2",
      degree: "Bachelor of Science in Computer Science & Digital Arts",
      institution: "University of California, Berkeley",
      period: "2013 — 2017",
      location: "Berkeley, CA",
      grade: "Magna Cum Laude",
      details: [
        "Dual concentration in Software Engineering and Graphic Typography & Visual Communication.",
        "President of the Berkeley Web & Mobile Design Collective.",
        "Winner of CalHacks 2016 for Best User Experience Design."
      ],
      coursework: [
        "Data Structures & Algorithms",
        "Web Engineering & Distributed Systems",
        "Typography & Color Theory",
        "Visual Interaction Systems"
      ]
    }
  ] as EducationItem[],

  projects: [
    {
      id: "proj-1",
      title: "Aurora Financial Intelligence",
      category: "Web Apps",
      tagline: "Next-generation asset analytics & portfolio tracking suite",
      description: "A comprehensive real-time financial tracking dashboard featuring interactive asset allocation visualizers, live market watchlists, and smart automated transaction auditing.",
      longDescription: "Aurora gives high-net-worth investors and fund managers real-time telemetry over multi-currency portfolios. Engineered with Next.js App Router, custom SVG chart visualizers, and an ultra-refined dark-neon editorial design language.",
      image: "/images/project1.jpg",
      tags: ["Next.js", "TypeScript", "Data Visualization", "Figma", "CSS Glassmorphism"],
      metrics: "+42% user retention, $1.48M simulated volume",
      liveUrl: "https://example.com/aurora",
      githubUrl: "https://github.com/example/aurora-finance",
      featured: true
    },
    {
      id: "proj-2",
      title: "Zenith Mobile Wellness",
      category: "Mobile",
      tagline: "Mindful spending & financial wellbeing companion app",
      description: "An intuitive mobile ecosystem blending financial literacy with personal wellness metrics, mood-based expense tracking, and goal progression meters.",
      longDescription: "Zenith redefines financial anxiety into empowerment. It features custom warm-toned dark mode surfaces, gamified savings streaks, and animated progress rings.",
      image: "/images/project2.jpg",
      tags: ["Mobile UI", "Figma", "React Native", "Motion Design", "Design System"],
      metrics: "4.9/5 App Store Rating, 240K+ active downloads",
      liveUrl: "https://example.com/zenith",
      githubUrl: "https://github.com/example/zenith-wellness",
      featured: true
    },
    {
      id: "proj-3",
      title: "Nova Editorial Design System",
      category: "UI/UX",
      tagline: "Scalable multi-brand token system & UI component library",
      description: "An open-source design library with over 140+ accessible components, automated WCAG contrast auditing, and multi-theme switcher.",
      longDescription: "A modular, scalable component system built for enterprise software teams. Features accessible keyboard navigation, custom layout primitives, and comprehensive Figma variable synchronizers.",
      image: "/images/port-item3.jpg",
      tags: ["Design System", "Storybook", "TypeScript", "Accessibility (a11y)", "Tokens"],
      metrics: "140+ components, 100% test coverage",
      liveUrl: "https://example.com/nova-ds",
      githubUrl: "https://github.com/example/nova-design-system",
      featured: true
    },
    {
      id: "proj-4",
      title: "Kroma Studio Portfolio & Store",
      category: "Branding",
      tagline: "Luxury visual identity & digital exhibition platform",
      description: "Bespoke typography-driven online experience and limited-edition product catalogue for an avant-garde creative collective.",
      longDescription: "Combines high-fashion editorial layouts, smooth page transitions, and a custom interactive 3D product showcase for an artisanal studio.",
      image: "/images/port-item2.jpg",
      tags: ["Branding", "Creative Direction", "Next.js", "Web Animations", "E-Commerce"],
      metrics: "Awwwards Site of the Day nominee",
      liveUrl: "https://example.com/kroma",
      githubUrl: "https://github.com/example/kroma-studio",
      featured: false
    }
  ] as Project[],

  skillCategories: [
    {
      category: "Design & Prototyping",
      description: "Crafting intuitive user interfaces, cohesive design systems, and engaging micro-interactions.",
      skills: [
        { name: "UI/UX Design", level: 98, experience: "6+ yrs" },
        { name: "Figma & Design Systems", level: 96, experience: "5+ yrs" },
        { name: "Interactive Prototyping", level: 92, experience: "5+ yrs" },
        { name: "User Research & Testing", level: 88, experience: "4+ yrs" },
        { name: "Motion & Micro-interactions", level: 85, experience: "4+ yrs" },
        { name: "Information Architecture", level: 90, experience: "5+ yrs" }
      ]
    },
    {
      category: "Frontend & Architecture",
      description: "Building fast, accessible, responsive web applications with modern standards.",
      skills: [
        { name: "Next.js (App Router)", level: 95, experience: "4+ yrs" },
        { name: "React & TypeScript", level: 96, experience: "6+ yrs" },
        { name: "Modern CSS & Responsive Systems", level: 98, experience: "6+ yrs" },
        { name: "Performance & SEO", level: 90, experience: "5+ yrs" },
        { name: "State Management & APIs", level: 88, experience: "4+ yrs" },
        { name: "WCAG Accessibility (a11y)", level: 92, experience: "4+ yrs" }
      ]
    },
    {
      category: "Tools, Backend & Cloud",
      description: "Supporting workflows, API integrations, and developer infrastructure.",
      skills: [
        { name: "Git & GitHub CI/CD", level: 92, experience: "6+ yrs" },
        { name: "REST & GraphQL APIs", level: 88, experience: "5+ yrs" },
        { name: "Node.js & Edge Functions", level: 84, experience: "4+ yrs" },
        { name: "Vercel / Cloudflare", level: 90, experience: "5+ yrs" },
        { name: "Design Tokens & Storybook", level: 92, experience: "4+ yrs" },
        { name: "Unit & E2E Testing", level: 82, experience: "3+ yrs" }
      ]
    }
  ] as SkillCategory[],

  certificates: [
    {
      id: "cert-1",
      title: "Google UX Design Professional Certificate",
      issuer: "Google",
      issueDate: "Jan 2024",
      credentialId: "G-UX-892401-ST",
      verifyUrl: "https://coursera.org/verify/professional-cert/google-ux",
      badge: "Google Certified",
      skillsCovered: ["User Research", "Wireframing", "Figma Systems", "Inclusive Design", "Usability Studies"]
    },
    {
      id: "cert-2",
      title: "Meta Certified Frontend Developer Professional",
      issuer: "Meta",
      issueDate: "Aug 2023",
      credentialId: "META-FE-99321-JS",
      verifyUrl: "https://coursera.org/verify/meta-frontend",
      badge: "Meta Certified",
      skillsCovered: ["React Deep-Dive", "Advanced JavaScript", "Web Optimization", "UI Testing", "State Architecture"]
    },
    {
      id: "cert-3",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "Nov 2023",
      credentialId: "AWS-CCP-440219-01",
      verifyUrl: "https://aws.amazon.com/verification",
      badge: "AWS Certified",
      skillsCovered: ["Cloud Infrastructure", "Security & IAM", "Serverless Architecture", "Edge CDN Deployments"]
    },
    {
      id: "cert-4",
      title: "Figma Advanced Design Systems & Variables Master",
      issuer: "Figma Academy",
      issueDate: "May 2024",
      credentialId: "FDM-90812-JULIA",
      verifyUrl: "https://figma.com/education",
      badge: "Design Master",
      skillsCovered: ["Design Tokens", "Multi-brand Modes", "Component Libraries", "Variable Typography", "Handoff"]
    }
  ] as CertificateItem[]
};
