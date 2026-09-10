export interface ProjectItem {
  id: string;
  title: string;
  categoryTag: string;
  filterCategory: ('coded' | 'designed' | 'fullstack')[];
  image: string;
  shortDesc: string;
  description: string;
  highlights: string[];
  techStack: string[];
  demoUrl?: string;
  codeUrl?: string;
}

export interface SkillItem {
  name: string;
  level: string;
  icon: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  technologies: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description: string;
  honors?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
  description: string;
  skills: string[];
}

export const heroData = {
  greeting: "Hi, I am",
  name: "Tomasz Gajda",
  title: "Front-end Developer / UI Designer",
  image: "/assets/images/hero-portrait.jpg",
  quote: '"Crafting digital interfaces with clean code & modern aesthetics."',
  socials: [
    { name: "Email", url: "mailto:tomasz.gajda@example.com", icon: "mail" },
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  ]
};

export const subHeroData = {
  watermark: "IT",
  title: "IT BERRIES & DIGITAL ENGINEERING",
  text: "Building high-performance, accessible, and pixel-precise digital web experiences. Combining clean architectural principles with modern UI micro-interactions to create products that engage users and elevate brands.",
  linkText: "| READ MORE |",
  linkHref: "#about"
};

export const aboutData = {
  leadText: "I am a passionate Front-end Developer and UI Designer dedicated to building seamless, responsive, and aesthetically stunning web applications. With a strong eye for typography, spatial harmony, and performance optimization, I bridge the gap between creative design and robust engineering.",
  pillars: [
    {
      title: "Design",
      description: "I craft intuitive user interfaces with strong focus on visual hierarchy, typography, design systems, and responsive wireframes that captivate users.",
      icon: "design"
    },
    {
      title: "Development",
      description: "I write clean, modular, and maintainable code using TypeScript, React, Next.js, and modern CSS to build blazing-fast and scalable web apps.",
      icon: "code"
    },
    {
      title: "Maintenance",
      description: "I ensure ongoing performance audits, SEO optimization, continuous integration, cross-browser compatibility, and accessibility standards.",
      icon: "wrench"
    }
  ]
};

export const skillsData: {
  usingNow: SkillItem[];
  learning: SkillItem[];
  other: SkillItem[];
} = {
  usingNow: [
    { name: "HTML5", level: "EXPERT", icon: "html" },
    { name: "CSS3", level: "EXPERT", icon: "css" },
    { name: "JavaScript", level: "ADVANCED", icon: "js" },
    { name: "TypeScript", level: "ADVANCED", icon: "ts" },
    { name: "React", level: "EXPERT", icon: "react" },
    { name: "Next.js", level: "ADVANCED", icon: "next" },
    { name: "Git & GitHub", level: "EXPERT", icon: "git" },
    { name: "Figma", level: "EXPERT", icon: "figma" },
  ],
  learning: [
    { name: "GraphQL", level: "INTERMEDIATE", icon: "graphql" },
    { name: "Vue.js", level: "INTERMEDIATE", icon: "vue" },
    { name: "WebAssembly", level: "EXPLORING", icon: "wasm" },
    { name: "Three.js", level: "EXPLORING", icon: "three" },
  ],
  other: [
    { name: "Node.js", level: "PROFICIENT", icon: "node" },
    { name: "PostgreSQL", level: "PROFICIENT", icon: "postgres" },
    { name: "Docker", level: "PROFICIENT", icon: "docker" },
    { name: "Jest / Vitest", level: "ADVANCED", icon: "jest" },
  ]
};

export const projectsData: ProjectItem[] = [
  {
    id: "project-1",
    title: "PulseOps Cloud Analytics Dashboard",
    categoryTag: "Full Stack / UI System",
    filterCategory: ["coded", "fullstack"],
    image: "/assets/images/project-dashboard.jpg",
    shortDesc: "High-throughput cloud observability & metrics visualization platform with sub-second live charts and automated alerting.",
    description: "A real-time enterprise observability & analytics dashboard built for high-scale microservice environments. Features custom WebGL data visualization charts, dynamic metric tracking, WebSocket live telemetry streaming, and automated anomaly alerting.",
    highlights: [
      "Engineered responsive modular widgets handling 100k+ data points/sec with 60 FPS rendering.",
      "Implemented robust RBAC permission layers and end-to-end telemetry auditing.",
      "Designed bespoke dark-mode interface with zero-dependency CSS charting."
    ],
    techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS"],
    demoUrl: "https://example.com/demo1",
    codeUrl: "https://github.com/example/pulseops"
  },
  {
    id: "project-2",
    title: "NOIR Studio - Brutalist E-Commerce",
    categoryTag: "UI & Frontend",
    filterCategory: ["coded", "designed"],
    image: "/assets/images/project-ecommerce.jpg",
    shortDesc: "Avant-garde brutalist luxury fashion storefront engineered with Next.js ISR, bespoke typography layout, and Stripe checkout.",
    description: "An avant-garde, monochrome e-commerce experience crafted for a modern high-fashion design house. Features buttery-smooth micro-interactions, headless architecture, dynamic product viewports, and instantaneous checkout.",
    highlights: [
      "Sub-500ms initial page load using Next.js incremental static regeneration (ISR).",
      "Custom cart state persistence with zero server latency and offline synchronization.",
      "Awarded 'Site of the Day' on digital design showcases for exceptional typography and layout."
    ],
    techStack: ["Next.js", "React", "TypeScript", "Figma", "Stripe API", "TailwindCSS"],
    demoUrl: "https://example.com/demo2",
    codeUrl: "https://github.com/example/noir-studio"
  },
  {
    id: "project-3",
    title: "Aura AI - Creative Design Canvas",
    categoryTag: "AI & Full Stack",
    filterCategory: ["coded", "fullstack"],
    image: "/assets/images/project-dashboard.jpg",
    shortDesc: "AI-driven design co-pilot for rapid component prototyping, automated UI token synthesis, and collaborative real-time canvas.",
    description: "An AI-powered design co-pilot and canvas application that enables creative teams to generate, iterate, and export production-ready UI components, design tokens, and vector graphics seamlessly.",
    highlights: [
      "Real-time collaborative canvas powered by WebSockets and state engines.",
      "AI prompt tokenizer with streaming component generation and live preview renderers.",
      "Cross-platform keyboard shortcut system with comprehensive undo/redo stack."
    ],
    techStack: ["React", "Next.js", "FastAPI", "OpenAI API", "Redis", "TailwindCSS"],
    demoUrl: "https://example.com/demo3",
    codeUrl: "https://github.com/example/aura-ai"
  }
];

export const experienceData: ExperienceItem[] = [
  {
    role: "Lead Front-end Engineer",
    company: "Apex Interactive Solutions",
    period: "2023 — PRESENT",
    location: "Warsaw, Poland (Hybrid)",
    description: "Architecting design systems, core web applications, and micro-frontend infrastructure across distributed engineering teams.",
    bullets: [
      "Spearheaded redesign of flagship SaaS product, resulting in a 42% decrease in bounce rates and 3.2x faster Core Web Vitals.",
      "Authored multi-brand UI design system utilized across 14 internal product suites with 98% component reuse.",
      "Mentored 8 junior and mid-level developers in React, TypeScript, and modern state management patterns."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Design Systems", "TailwindCSS"]
  },
  {
    role: "Front-end Developer & UI Designer",
    company: "Pixel & Grid Digital Studio",
    period: "2021 — 2023",
    location: "Remote",
    description: "Delivered custom web applications, high-converting e-commerce experiences, and interactive brand sites for international clients.",
    bullets: [
      "Engineered 20+ responsive web platforms with custom interactive SVG animations and 60 FPS transitions.",
      "Collaborated closely with product managers and stakeholders to convert wireframes into production-ready web apps.",
      "Implemented automated CI/CD deployment pipelines using GitHub Actions and Vercel."
    ],
    technologies: ["JavaScript ES6+", "Vue.js", "TailwindCSS", "Figma", "Git"]
  },
  {
    role: "Junior Web Developer",
    company: "ByteCraft Technologies",
    period: "2019 — 2021",
    location: "Krakow, Poland",
    description: "Built responsive landing pages, maintained client web portals, and executed rigorous cross-browser testing.",
    bullets: [
      "Refactored legacy HTML/CSS codebases to modern modular JavaScript and responsive CSS grid layouts.",
      "Optimized web asset pipelines, reducing average page weight by 55%."
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "REST APIs"]
  }
];

export const educationData: EducationItem[] = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Technology & Information Sciences",
    period: "2017 — 2021",
    honors: "First Class Honors (GPA: 3.9 / 4.0)",
    description: "Specialization in Human-Computer Interaction, Algorithms & Data Structures, Software Architecture, and Distributed Systems."
  },
  {
    degree: "Diploma in Digital Media & Web Engineering",
    institution: "Institute of Creative Design & Technology",
    period: "2015 — 2017",
    honors: "Distinction Award",
    description: "Focused on Graphic Design, Typography, UI Prototyping, Frontend Web Standards, and Responsive Web Application Architecture."
  }
];

export const certificatesData: CertificateItem[] = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services (AWS)",
    issuedDate: "Issued Jan 2025 • Expires Jan 2028",
    credentialId: "AWS-PSA-9823419-2025",
    description: "Validates comprehensive expertise in designing highly available, cost-efficient, fault-tolerant, and scalable distributed systems on AWS cloud infrastructure.",
    skills: ["Cloud Architecture", "S3 & EC2", "VPC & Networking", "IAM Security", "Serverless Lambda"]
  },
  {
    id: "cert-2",
    title: "Meta Front-End Developer Professional",
    issuer: "Meta / Coursera Verified",
    issuedDate: "Issued Aug 2024",
    credentialId: "META-FE-7729103-2024",
    description: "Comprehensive 9-course credential covering advanced React architecture, UX principles, state management, test-driven development (Jest/RTL), and full-scale modern web applications.",
    skills: ["React.js", "JavaScript ES6+", "UI/UX Design", "Version Control (Git)", "Jest & Unit Testing"]
  },
  {
    id: "cert-3",
    title: "Google UX Design Professional",
    issuer: "Google Career Certificates",
    issuedDate: "Issued Mar 2024",
    credentialId: "GGL-UXD-3948120-2024",
    description: "In-depth foundation in user-centered design, rapid wireframing, high-fidelity prototyping in Figma, accessibility (WCAG 2.1 AA), and usability testing methodology.",
    skills: ["Figma", "Design Systems", "Usability Testing", "Wireframing", "Information Architecture"]
  }
];

export default {
  heroData,
  subHeroData,
  aboutData,
  skillsData,
  projectsData,
  experienceData,
  educationData,
  certificatesData
};
