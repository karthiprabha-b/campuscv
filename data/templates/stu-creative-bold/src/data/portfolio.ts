export interface NavLink {
  label: string;
  href: string;
}

export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  stats: {
    value: number;
    suffix: string;
    label: string;
    icon: string;
  }[];
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface ApproachStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  items: {
    name: string;
    percentage: number;
  }[];
}

export interface ToolItem {
  name: string;
  iconName: string;
}

export interface CertificationItem {
  title: string;
  organization: string;
  date: string;
  credentialUrl: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface AchievementItem {
  title: string;
  organization: string;
  value: string;
  description: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  socials: {
    linkedin: string;
    github: string;
    instagram: string;
    twitter: string;
    behance: string;
  };
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const heroData: HeroData = {
  greeting: "HEY, I'M",
  name: "PORTFOLIO",
  title: "SOFTWARE DEVELOPER",
  highlightedTitle: "",
  description: "Builder-focused Software Developer with hands-on technical skills.",
  primaryCtaText: "VIEW MY WORK",
  primaryCtaHref: "#projects",
  secondaryCtaText: "GET IN TOUCH",
  secondaryCtaHref: "#contact",
};

export const aboutData: AboutData = {
  title: "ABOUT ME",
  subtitle: "Creative professional with a passion for designing and building modern web experiences.",
  description: "Passionate developer focused on building clean, high-performance, and impactful digital solutions.",
  objective: "To apply technical expertise and design excellence in crafting scalable, modern software products.",
  stats: [
    { value: 1, suffix: "+", label: "Years Experience", icon: "Briefcase" },
    { value: 6, suffix: "+", label: "Projects Shipped", icon: "BookOpen" },
    { value: 60, suffix: "+", label: "Contributions", icon: "Award" },
    { value: 99.8, suffix: "%", label: "Satisfaction", icon: "Heart" },
  ]
};

export const services: Service[] = [
  {
    icon: "Layers",
    title: "UI/UX Design",
    description: "Designing intuitive, high-fidelity wireframes, interactive user flows, and modern design systems that match current branding standards.",
  },
  {
    icon: "Code",
    title: "Web Development",
    description: "Building responsive, highly performant single page applications using React, Next.js, and utility-first styling libraries like Tailwind CSS.",
  },
  {
    icon: "Sparkles",
    title: "Branding",
    description: "Creating unique visual identities, logo marks, consistent typographic styling, and color structures that elevate visual storytelling.",
  },
  {
    icon: "Target",
    title: "Problem Solving",
    description: "Tuning codebases for optimal speed, optimizing databases, implementing robust state management, and fixing layout logic.",
  },
];

export const approachSteps: ApproachStep[] = [
  {
    step: "01",
    title: "Understand",
    description: "I research the problem, analyze user requirements, gather assets, and outline the software constraints.",
    icon: "Search",
  },
  {
    step: "02",
    title: "Design",
    description: "I sketch layouts, create interactive high-fidelity Figma prototypes, and establish the visual style guide.",
    icon: "Palette",
  },
  {
    step: "03",
    title: "Develop",
    description: "I write clean, modular React/TypeScript code, configure Tailwind variables, and test component functionality.",
    icon: "Cpu",
  },
  {
    step: "04",
    title: "Launch",
    description: "I deploy the web application to high-speed staging environments, run SEO checkups, and publish the release.",
    icon: "Rocket",
  },
];

export const educationHistory: EducationItem[] = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Creative Tech University",
    duration: "2023 - Present",
    grade: "CGPA: 9.4/10",
    description: "Specializing in Human-Computer Interaction and Software Engineering. Core coursework in Data Structures, Web Technology, and Systems Design.",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Bold Vision Academy",
    duration: "2021 - 2023",
    grade: "Grade: 95.8%",
    description: "Focused on Mathematics, Physics, and Computer Science. Completed several self-paced intro-to-coding certifications.",
  },
  {
    degree: "Secondary School Leaving Certificate",
    institution: "St. Jude International School",
    duration: "2011 - 2021",
    grade: "Grade: 98.2%",
    description: "Graduated with honors. Active participant in state-level design competitions and mathematics olympiads.",
  },
];

export const skillCategories: SkillCategory[] = [];

export const toolsIUse: ToolItem[] = [
  { name: "VS Code", iconName: "vscode" },
  { name: "GitHub", iconName: "github" },
  { name: "Postman", iconName: "postman" },
];

export const certifications: CertificationItem[] = [];

export const projects: ProjectItem[] = [
  {
    title: "Fintech Dashboard UI",
    category: "UI Design",
    description: "A dark-themed premium analytics dashboard displaying real-time crypto markets, transactions history, and investment goals.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    techStack: ["Figma", "Design Systems", "Prototyping"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Travel Landing Page",
    category: "Web",
    description: "A gorgeous, interactive travel booking landing page featuring rich search parameters, high-quality images, and layout layouts.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    techStack: ["Next.js", "Framer Motion", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "E-commerce Store Front",
    category: "Web",
    description: "A fully responsive storefront displaying collections, filter tags, shopping cart side panels, and seamless checkout integrations.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    techStack: ["React", "Tailwind CSS", "Redux Toolkit"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "SaaS Analytics Software",
    category: "Web",
    description: "A premium marketing analytics platform featuring interactive chart layouts, custom report builders, and multiple API integrations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    techStack: ["Next.js", "Recharts", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const experiences: ExperienceItem[] = [
  {
    company: "Pixel Perfect Solutions",
    role: "Frontend Engineering Intern",
    duration: "May 2025 - Present",
    description: [
      "Developed interactive layout modules using Next.js 15, improving page load performance by 22%.",
      "Collaborated with UI/UX designers to translate high-fidelity Figma components into precise, fully responsive React assemblies.",
      "Established strict ESLint and TypeScript code standards, cutting production rendering bugs by 15%.",
    ],
  },
  {
    company: "Creative Spark Studio",
    role: "Junior Web Developer & Designer",
    duration: "Nov 2024 - Apr 2025",
    description: [
      "Designed and deployed 10+ landing pages for local startup clients utilizing React and Tailwind CSS.",
      "Optimized client websites for accessibility (WCAG AA standards) and search engine visibility.",
      "Designed logos, style guides, and promotional graphics in Adobe Illustrator.",
    ],
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote: "A standout software engineer who brings both exceptional coding craftsmanship and architectural precision to every project. Strong attention to detail and code quality.",
    author: "Sarah Jenkins",
    role: "Senior Engineering Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    quote: "Delivered our modern web application features with high speed, clean code structure, and excellent UI responsiveness. Highly recommended.",
    author: "David Kovacs",
    role: "Technical Co-Founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    quote: "Demonstrates immense talent in problem-solving and full-stack development. Absorbs complex requirements and delivers polished solutions quickly.",
    author: "Dr. Alan Mercer",
    role: "Technical Advisor & Mentor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  },
];

export const achievements: AchievementItem[] = [
  {
    title: "1st Place - Smart City Hackathon",
    organization: "Tech Innovators Forum",
    value: "2025",
    description: "Designed and developed an IoT-based parking reservation mobile application frontend in under 36 hours.",
  },
  {
    title: "Best Design UI Excellence Award",
    organization: "Global Web Design Association",
    value: "2024",
    description: "Recognized among 200+ student applicants for exceptional visual branding and web interactivity.",
  },
  {
    title: "Academic Honor Roll",
    organization: "Creative Tech University",
    value: "4.0/4.0",
    description: "Awarded top merit scholarship for academic excellence in Computer Science and systems design.",
  },
  {
    title: "Published: Micro-interactivity Paper",
    organization: "HCI Student Journal",
    value: "2024",
    description: "Co-authored a research brief analyzing the impact of micro-animations on student retention in e-learning platforms.",
  },
];

export const contactData: ContactData = {
  email: "",
  phone: "",
  location: "",
  socials: {
    linkedin: "",
    github: "",
    instagram: "",
    twitter: "",
    behance: "",
  },
};
