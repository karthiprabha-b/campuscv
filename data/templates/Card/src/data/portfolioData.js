export const portfolioData = {
  profile: {
    name: "Alex Sterling",
    nickname: "alex",
    title: "Senior Full-Stack & Cloud Engineer",
    roles: [
      "Full-Stack Architect",
      "Next.js & React Specialist",
      "Cloud & Distributed Systems Engineer",
      "AI & GenAI Solutions Builder"
    ],
    availability: "Available for Q4 Opportunities & Freelance",
    statusText: "Building next-gen digital experiences",
    email: "alex.sterling.dev@example.com",
    phone: "+1 (555) 234-8900",
    location: "San Francisco, CA (Open to Remote)",
    timezone: "America/Los_Angeles",
    yearsOfExperience: 6,
    projectsCompleted: 42,
    satisfiedClients: 28,
    coffeeCups: "2.4k",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "Passionate engineer dedicated to crafting fluid, high-performance web and cloud architectures. I bridge the gap between design aesthetic precision and scalable backend infrastructure.",
    story: "Over the past 6+ years, I've designed and scaled systems handling millions of daily queries while obsessing over micro-interactions and pixel-perfect UIs. From high-throughput APIs to real-time collaboration engines, I thrive at the intersection of modern frontend elegance and distributed backend robustness.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      dribbble: "https://dribbble.com",
      discord: "https://discord.com"
    },
    hobbies: [
      { name: "Open Source Contributor", icon: "Code2" },
      { name: "Mechanical Keyboards", icon: "Keyboard" },
      { name: "Astrophotography", icon: "Camera" },
      { name: "Specialty Coffee Roasting", icon: "Coffee" },
    ],
    coreValues: [
      { title: "Speed & Fluidity", desc: "60fps interactions, sub-100ms response times, zero visual clutter." },
      { title: "Resilient Architecture", desc: "Fault-tolerant, auto-scaling, and clean modular codebases." },
      { title: "Empathetic Design", desc: "Software crafted to delight users and solve genuine business needs." }
    ]
  },

  experience: [
    {
      id: "exp-1",
      role: "Lead Full-Stack Engineer",
      company: "Nexus AI Technologies",
      location: "San Francisco, CA",
      period: "2023 - Present",
      type: "Full-time",
      description: "Leading the core platform team building multi-tenant AI workspace orchestration and real-time collaborative canvas.",
      highlights: [
        "Architected distributed streaming inference interface reducing latency by 42% for 150k+ active creators.",
        "Engineered zero-downtime micro-frontend framework using Next.js 14 App Router, WebSockets, and Edge functions.",
        "Mentored a cross-functional squad of 8 frontend and backend engineers, instituting rigorous CI/CD test standards."
      ],
      technologies: ["Next.js", "TypeScript", "Python / FastAPI", "Kafka", "PostgreSQL", "Redis", "AWS EKS", "Tailwind CSS"],
      badgeColor: "emerald"
    },
    {
      id: "exp-2",
      role: "Senior Frontend Engineer",
      company: "Aether Cloud Systems",
      location: "Remote",
      period: "2021 - 2023",
      type: "Full-time",
      description: "Spearheaded design system modernization and high-volume observability dashboard for enterprise Kubernetes clusters.",
      highlights: [
        "Constructed WebGL-accelerated telemetry visualization handling 50k metric datapoints/sec with 60 FPS render loops.",
        "Reduced initial bundle payload by 58% through fine-grained code splitting, dynamic imports, and modern asset pipelines.",
        "Authored the company-wide accessible component library adopted across 14 internal and external web apps."
      ],
      technologies: ["React", "TypeScript", "GraphQL", "D3.js / WebGL", "Node.js", "Docker", "Tailwind CSS"],
      badgeColor: "cyan"
    },
    {
      id: "exp-3",
      role: "Full-Stack Software Engineer",
      company: "Vanguard Digital Lab",
      location: "Austin, TX",
      period: "2019 - 2021",
      type: "Full-time",
      description: "Built scalable fintech payment gateways, customer onboarding flows, and fraud analytics pipelines.",
      highlights: [
        "Delivered PCI-DSS compliant checkout engine processing over $12M in monthly transaction volume.",
        "Integrated real-time biometric verification API cutting onboarding abandonment rates by 34%.",
        "Refactored legacy monolith into event-driven Go and Node.js microservices with Redis caching layer."
      ],
      technologies: ["Go", "Node.js", "React", "MongoDB", "Stripe API", "AWS Lambda", "Docker"],
      badgeColor: "violet"
    }
  ],

  education: [
    {
      id: "edu-1",
      degree: "Master of Science in Computer Science",
      field: "Distributed Systems & Machine Intelligence",
      institution: "Stanford University",
      location: "Stanford, CA",
      period: "2017 - 2019",
      grade: "3.92 / 4.0 GPA",
      honors: ["Dean's List for Academic Excellence", "Graduate Research Fellow in Cloud Computing"],
      courses: [
        "Advanced Distributed Systems",
        "Deep Learning Architectures",
        "Concurrent Algorithms",
        "Human-Computer Interaction (HCI)"
      ],
      activities: ["President of Stanford Tech Innovators", "Hackathon Mentor", "Open Source Initiative"]
    },
    {
      id: "edu-2",
      degree: "Bachelor of Science in Software Engineering",
      field: "Computer Science & Mathematics Minor",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      period: "2013 - 2017",
      grade: "Summa Cum Laude (3.95 GPA)",
      honors: ["Departmental Honors Award", "1st Place - CalHacks Silicon Valley 2016"],
      courses: [
        "Data Structures & Algorithms",
        "Operating Systems & Compilers",
        "Database System Concepts",
        "Cryptography & Network Security"
      ],
      activities: ["ACM Student Chapter Lead", "Peer Academic Tutor for Algorithmic Design"]
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "OmniFlow AI Canvas",
      tagline: "Infinite collaborative canvas for multi-agent LLM workflows and visual prompting.",
      description: "Next-generation visual node engine for chaining autonomous AI agents, API webhooks, and live vector search nodes.",
      longDescription: "OmniFlow is an infinite spatial canvas that gives developers and creators visual superpowers to orchestrate complex reasoning chains, real-time code generation, and vector retrieval in a single reactive workspace. Built with custom WebGL nodes, CRDT-backed real-time multi-cursor sync, and edge streaming.",
      category: "AI / ML",
      featured: true,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      tags: ["Next.js 14", "TypeScript", "LangChain", "WebSockets", "Python", "Tailwind CSS", "Zustand"],
      metrics: ["50k+ Monthly Active Users", "4.9/5 Rating on ProductHunt", "< 35ms CRDT Latency"],
      features: [
        "Real-time multiplayer canvas with fractional position sync",
        "Multi-modal node inputs (Voice, Image, PDF, Code, SQL)",
        "One-click serverless deployment of canvas chains into REST endpoints",
        "Integrated token cost estimator & LLM response comparator"
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      year: "2024"
    },
    {
      id: "proj-2",
      title: "PulseMetrics Cloud APM",
      tagline: "Zero-overhead distributed tracing and real-time observability for microservices.",
      description: "High-throughput telemetry ingestion platform with real-time anomaly detection and interactive dependency topology graphs.",
      longDescription: "An ultra-fast cloud performance monitoring solution capable of ingesting 250,000 trace spans per second. Features interactive 3D cluster topology graphs, automated eBPF kernel profiling, and predictive incident alert thresholds powered by statistical modeling.",
      category: "Cloud & Systems",
      featured: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tags: ["Go", "React", "ClickHouse", "eBPF", "gRPC", "Docker", "Tailwind CSS"],
      metrics: ["250k Spans/sec Ingestion", "Sub-100ms Query Times", "99.999% Reliability"],
      features: [
        "Interactive 3D dependency mesh graph using Three.js / Canvas",
        "Automated root-cause diagnosis for tail-latency regressions",
        "Native OpenTelemetry (OTel) collectors integration",
        "Customizable Grafana-compatible dashboard builder"
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      year: "2024"
    },
    {
      id: "proj-3",
      title: "HyperPay Global Checkout",
      tagline: "Frictionless multi-currency fintech checkout with dynamic localized payment methods.",
      description: "Modern headless payment widget SDK supporting crypto, fiat, Apple Pay, and local European/Asian instant payment rails.",
      longDescription: "A drop-in payment SDK engineered for global e-commerce. It uses geolocation-aware route optimization to select the highest-converting localized payment methods and dynamic currency conversion, boosting checkout conversion rates by 26%.",
      category: "Full-Stack",
      featured: true,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      tags: ["Next.js", "TypeScript", "Stripe API", "Webhooks", "PostgreSQL", "Prisma", "Tailwind CSS"],
      metrics: ["$40M+ Processed Volume", "99.98% Conversion Uptime", "38 Supported Currencies"],
      features: [
        "Headless React & Vue embeddable widgets with < 12kB bundle",
        "Adaptive fraud prevention heuristics with instant 3D Secure 2 fallback",
        "Comprehensive merchant analytics portal with instant settlement payout triggers"
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      year: "2023"
    },
    {
      id: "proj-4",
      title: "Nova Mobile Health Companion",
      tagline: "Biometric health tracking, circadian sleep coach, and AI nutritional scanner.",
      description: "Cross-platform mobile application interfacing with wearable sensor APIs and local neural vision models for nutritional logging.",
      longDescription: "Nova delivers personalized wellness recommendations using on-device CoreML/TensorFlow Lite models. Tracks sleep cycles, HRV spikes, workout recovery scores, and provides real-time meal macro-breakdowns via phone camera.",
      category: "Mobile",
      featured: false,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      tags: ["React Native", "Expo", "TypeScript", "HealthKit / Google Fit", "Node.js", "GraphQL"],
      metrics: ["120k App Store Downloads", "4.8 Star Rating", "Featured in Health Weekly"],
      features: [
        "Zero-cloud offline biometric analysis with encrypted local storage",
        "Dynamic widget integrations for iOS 17 Lock Screen & Android Dynamic Island",
        "Smart sleep cadence alarm using accelerometer feedback"
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      year: "2023"
    }
  ],

  skillCategories: [
    {
      title: "Frontend Engineering",
      icon: "Layout",
      skills: [
        { name: "React 18 / 19", level: 98, experience: "6 yrs", isPrimary: true },
        { name: "Next.js (App Router)", level: 96, experience: "5 yrs", isPrimary: true },
        { name: "TypeScript", level: 95, experience: "6 yrs", isPrimary: true },
        { name: "Tailwind CSS & CSS3", level: 96, experience: "5 yrs", isPrimary: true },
        { name: "Framer Motion & Animations", level: 90, experience: "4 yrs" },
        { name: "State (Zustand / Redux / TanStack)", level: 92, experience: "5 yrs" },
        { name: "WebGL / Three.js / Canvas", level: 78, experience: "3 yrs" },
        { name: "Micro-Frontends & Design Systems", level: 90, experience: "4 yrs" }
      ]
    },
    {
      title: "Backend & Distributed Systems",
      icon: "Server",
      skills: [
        { name: "Node.js & Express / NestJS", level: 94, experience: "6 yrs", isPrimary: true },
        { name: "Go (Golang)", level: 88, experience: "4 yrs", isPrimary: true },
        { name: "Python (FastAPI / Django)", level: 90, experience: "5 yrs", isPrimary: true },
        { name: "PostgreSQL & Supabase", level: 92, experience: "6 yrs", isPrimary: true },
        { name: "Redis & Distributed Caching", level: 90, experience: "5 yrs" },
        { name: "GraphQL & REST APIs", level: 95, experience: "6 yrs" },
        { name: "Apache Kafka & Event Streams", level: 82, experience: "3 yrs" },
        { name: "MongoDB & Prisma ORM", level: 88, experience: "5 yrs" }
      ]
    },
    {
      title: "Cloud, DevOps & Infrastructure",
      icon: "Cloud",
      skills: [
        { name: "Amazon Web Services (AWS)", level: 90, experience: "5 yrs", isPrimary: true },
        { name: "Docker & Containerization", level: 94, experience: "6 yrs", isPrimary: true },
        { name: "Kubernetes & Helm", level: 84, experience: "4 yrs" },
        { name: "Terraform & IaC", level: 82, experience: "3 yrs" },
        { name: "CI/CD (GitHub Actions / GitLab)", level: 92, experience: "5 yrs" },
        { name: "Vercel / Cloudflare Workers", level: 96, experience: "5 yrs" },
        { name: "Prometheus & Grafana", level: 85, experience: "4 yrs" },
        { name: "Linux Administration & Bash", level: 88, experience: "6 yrs" }
      ]
    },
    {
      title: "AI, Tools & Architecture",
      icon: "Cpu",
      skills: [
        { name: "LLM Orchestration (LangChain / LlamaIndex)", level: 88, experience: "2 yrs", isPrimary: true },
        { name: "Vector Databases (Pinecone / pgvector)", level: 86, experience: "2 yrs" },
        { name: "Git & Monorepo Tooling (Turborepo)", level: 94, experience: "6 yrs" },
        { name: "Unit & E2E Testing (Jest / Playwright)", level: 90, experience: "5 yrs" },
        { name: "Figma UI/UX Prototyping", level: 85, experience: "4 yrs" },
        { name: "Security (OWASP & OAuth2 / OIDC)", level: 88, experience: "5 yrs" }
      ]
    }
  ],

  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "Nov 2023",
      expiryDate: "Nov 2026",
      credentialId: "AWS-PSA-9482104",
      credentialUrl: "https://aws.amazon.com/verification",
      badgeIcon: "CloudCheck",
      skills: ["Cloud Architecture", "Multi-region Failover", "VPC Security", "Cost Optimization"],
      featured: true
    },
    {
      id: "cert-2",
      title: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      issueDate: "Aug 2023",
      expiryDate: "Aug 2026",
      credentialId: "LF-CKA-7739102",
      credentialUrl: "https://www.cncf.io/certification/cka/",
      badgeIcon: "Boxes",
      skills: ["Cluster Architecture", "Storage", "Workloads & Scheduling", "Networking & Troubleshooting"],
      featured: true
    },
    {
      id: "cert-3",
      title: "Meta Certified Senior Front-End Developer",
      issuer: "Meta (Coursera)",
      issueDate: "Mar 2023",
      credentialId: "META-FED-5520194",
      credentialUrl: "https://coursera.org/verify/professional-cert",
      badgeIcon: "Code",
      skills: ["Advanced React", "UI/UX Architecture", "Web Performance", "Accessible Design"],
      featured: true
    },
    {
      id: "cert-4",
      title: "HashiCorp Certified: Terraform Associate (003)",
      issuer: "HashiCorp",
      issueDate: "Jan 2024",
      expiryDate: "Jan 2026",
      credentialId: "HASHI-TF-3391002",
      credentialUrl: "https://www.credly.com",
      badgeIcon: "Layers",
      skills: ["Infrastructure as Code", "Terraform Cloud", "Modules", "State Management"],
      featured: false
    }
  ],

  contactInfo: {
    headline: "Let's build something extraordinary together.",
    subheadline: "Whether you have a groundbreaking product idea, an engineering architecture challenge, or an open high-impact role, my inbox is always open.",
    responseTime: "Typically responds within 4 to 8 hours",
    locationDetail: "San Francisco, CA (PST / UTC-7)",
    services: [
      "Full-Stack Web App Engineering",
      "Next.js Performance & SEO Architecture",
      "Cloud Infrastructure & Distributed Backend",
      "AI / LLM Integration & Workflow Automation",
      "Technical Advisory & Fractional CTO"
    ]
  }
};

export default portfolioData;
