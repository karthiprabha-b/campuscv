export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  metrics: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  architecturePoints: string[];
}

export interface ExperienceItem {
  id: string;
  year: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  summary: string;
  achievements: string[];
  techStack: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  honors: string;
  highlights: string[];
  keyCourses: string[];
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    badge?: string;
  }[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verifyUrl: string;
  icon: string; // provider logo code or icon
  skillsCovered: string[];
}

export const PORTFOLIO_DATA = {
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
    resumeUrl: "#contact",
  },
  stats: [
    { value: "7+", label: "Years Experience", sublabel: "Production Engineering" },
    { value: "48+", label: "Services Deployed", sublabel: "Microservices & Serverless" },
    { value: "99.99%", label: "Uptime Achieved", sublabel: "Critical Infrastructure" },
    { value: "1.2M+", label: "Daily Req Handled", sublabel: "Sub-50ms Latency" },
  ],
  soundbites: [
    {
      id: "track-1",
      title: "Episode #01: Zero-Downtime Database Migrations at Scale",
      duration: "4:32",
      date: "Sep 2026",
      category: "System Architecture",
      summary: "How we partitioned PostgreSQL tables with zero lock contention across 200M active records using pg_roll and shadow writes.",
      snippetCode: `// Shadow-write migration router
async function writeWithDualState(record: UserRecord) {
  const primaryPromise = db.primary.insert(record);
  const shadowPromise = db.v2_cluster.insert(record)
    .catch(err => telemetry.recordDrift(err));
  return await primaryPromise;
}`
    },
    {
      id: "track-2",
      title: "Episode #02: Sub-10ms Global Edge Routing with Next.js & Rust",
      duration: "6:15",
      date: "Aug 2026",
      category: "Edge Computing",
      summary: "Deploying Rust WASM modules to Cloudflare Edge workers orchestrated with Next.js SSR to achieve instant rendering globally.",
      snippetCode: `// WASM Geo-DNS cache interceptor
#[wasm_bindgen]
pub fn route_traffic_region(client_ip: &str) -> String {
    let region = geoip_lookup(client_ip);
    format!("https://{}.edge.system.internal/api/v1", region.closest_pop)
}`
    },
    {
      id: "track-3",
      title: "Episode #03: Kubernetes Auto-Healing with Custom CRDs",
      duration: "5:08",
      date: "Jul 2026",
      category: "DevOps & Cloud",
      summary: "Writing Go operator controllers to watch memory fragmentation patterns and gracefully recycle pods before OOMKilled events.",
      snippetCode: `func (r *PodReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    pod := &corev1.Pod{}
    if err := r.Get(ctx, req.NamespacedName, pod); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    if isMemoryFragmented(pod) {
        return r.triggerGracefulDrain(ctx, pod)
    }
    return ctrl.Result{RequeueAfter: time.Minute * 2}, nil
}`
    }
  ],
  about: {
    story: `I am a Senior Software Engineer and Systems Architect who loves building clean, hyper-performant web applications, event-driven backends, and fault-tolerant cloud architecture. Over the last 7+ years, I have helped startups scale from zero to millions of users and led modern architecture overhauls at enterprise scale.`,
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
    ]
  },
  education: [
    {
      id: "edu-1",
      degree: "Master of Science in Computer Science",
      field: "Distributed Systems & Machine Learning",
      institution: "Stanford University",
      location: "Stanford, CA",
      period: "2019 — 2021",
      gpa: "3.92 / 4.0",
      honors: "Graduate Fellowship & Department Honors",
      highlights: [
        "Published thesis on 'Decentralized Consensus Algorithms for High-Throughput IoT Networks'",
        "Graduate Research Assistant at the Distributed Systems & Cloud Computing Lab",
        "1st Place in Stanford Annual Hackathon (Distributed Edge Cache Project)"
      ],
      keyCourses: [
        "Advanced Distributed Systems",
        "Cloud Computing Architecture",
        "Database System Implementation",
        "Deep Learning Systems"
      ]
    },
    {
      id: "edu-2",
      degree: "Bachelor of Science in Software Engineering",
      field: "Computer Science & Applied Mathematics",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      period: "2015 — 2019",
      gpa: "3.88 / 4.0",
      honors: "Magna Cum Laude & Dean's Honor List (All Semesters)",
      highlights: [
        "Lead Teaching Assistant for CS61B: Data Structures & Algorithms (300+ students)",
        "President of IEEE Computer Society Student Chapter",
        "Winner of ACM Inter-Collegiate Programming Contest (Regional Finalist)"
      ],
      keyCourses: [
        "Operating Systems & Systems Programming",
        "Data Structures & Algorithms",
        "Computer Networks",
        "Computer Architecture"
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      year: "2024 - Present",
      period: "Jan 2024 — Present",
      role: "Staff / Lead Systems Engineer",
      company: "Vortex Scale Technologies",
      location: "San Francisco, CA (Hybrid)",
      type: "Full-Time",
      summary: "Architecting real-time distributed ingest pipelines and high-concurrency microservices processing 1.2M+ RPS with sub-50ms p99 latency.",
      achievements: [
        "Led cross-functional team of 12 engineers in migrating legacy monolith into Go/gRPC event-driven microservices on AWS EKS.",
        "Engineered custom caching mesh using Redis Cluster & Cloudflare Workers, reducing database server costs by $180,000/year.",
        "Built automated CI/CD deployment orchestrator with canary releases and automatic rollback on SLO degradation."
      ],
      techStack: ["Go", "Next.js", "TypeScript", "AWS EKS", "Kafka", "PostgreSQL", "Redis", "Terraform", "OpenTelemetry"]
    },
    {
      id: "exp-2",
      year: "2021 - 2023",
      period: "Jun 2021 — Dec 2023",
      role: "Senior Full-Stack Engineer",
      company: "Hyperion Cloud Solutions",
      location: "Remote",
      type: "Full-Time",
      summary: "Designed and built customer-facing cloud management dashboard and real-time telemetry streaming engines used by 25,000+ enterprise developers.",
      achievements: [
        "Developed full-stack Next.js 14 web application with real-time WebSocket telemetry, interactive metric canvas charts, and instant role-based access.",
        "Reduced initial dashboard load time from 4.2s to 0.7s (83% improvement) via code-splitting, optimistic UI mutations, and Edge cache headers.",
        "Authored internal UI design system and component library adopted by 6 engineering squads."
      ],
      techStack: ["React", "Next.js", "Node.js", "GraphQL", "TailwindCSS", "Docker", "Kubernetes", "PostgreSQL"]
    },
    {
      id: "exp-3",
      year: "2019 - 2021",
      period: "Jul 2019 — May 2021",
      role: "Software Engineer",
      company: "Nexus Data Labs",
      location: "San Jose, CA",
      type: "Full-Time",
      summary: "Engineered scalable REST & GraphQL APIs, database ingestion pipelines, and interactive analytics dashboards.",
      achievements: [
        "Implemented distributed background task queue using Celery and RabbitMQ processing 10M+ daily analytical events.",
        "Designed schema migration framework allowing seamless zero-downtime upgrades for 50+ multi-tenant database clusters.",
        "Automated unit, integration, and E2E testing suites in GitHub Actions, bringing branch test coverage from 62% to 94%."
      ],
      techStack: ["Python", "Django", "TypeScript", "React", "PostgreSQL", "Docker", "AWS S3", "GitHub Actions"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "KubePulse: Real-Time Kubernetes Cluster Sentinel",
      category: "Cloud & Distributed",
      description: "An open-source, lightweight monitoring & auto-remediation daemon for Kubernetes clusters with visual node topology and live metrics.",
      longDescription: "KubePulse hooks into the Kubernetes API Server via eBPF probes and metrics-server to detect memory pressure, thread lockups, and traffic anomalies before they cause crash loops. Includes an interactive Next.js dashboard with live 3D node graphs and instant Slack alert webhooks.",
      metrics: "5.2k GitHub Stars • 400+ Active Clusters • <1% CPU Overhead",
      tags: ["Go", "Next.js", "Kubernetes", "eBPF", "WebSockets", "TailwindCSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: true,
      architecturePoints: [
        "eBPF kernel probe agents streaming metrics via gRPC channels",
        "Next.js App Router front-end with WebSockets and Canvas node graphs",
        "Stateless controller architecture with leader election via Raft consensus"
      ]
    },
    {
      id: "proj-2",
      title: "OmniFlow: Distributed Event-Driven Workflow Engine",
      category: "Systems / DevOps",
      description: "Fault-tolerant workflow orchestration engine capable of executing millions of state machine transitions with durable replay.",
      longDescription: "Inspired by Temporal and AWS Step Functions, OmniFlow enables developers to write durable asynchronous workflows in TypeScript and Go without worrying about network partitions, pod restarts, or worker failure recovery.",
      metrics: "12,000 tx/sec throughput • Zero state loss guarantee",
      tags: ["TypeScript", "Go", "PostgreSQL", "Kafka", "Docker", "Redis"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: true,
      architecturePoints: [
        "Event sourcing engine storing immutable mutation logs in PostgreSQL",
        "Deterministic event replay with automatic checkpoint pruning",
        "Distributed lock-free worker pools with heartbeat health checks"
      ]
    },
    {
      id: "proj-3",
      title: "NeuroDocs: AI-Augmented Engineering Knowledge Base",
      category: "AI & ML",
      description: "Semantic search and code documentation intelligence tool indexing multi-repo architectures with vector embeddings.",
      longDescription: "NeuroDocs connects to GitHub, GitLab, and Jira, parses AST syntax trees and markdown docs, and builds a unified semantic knowledge graph. Engineers can query complex cross-service dependencies in natural language.",
      metrics: "94% Answer Accuracy • Sub-200ms Vector Retrieval",
      tags: ["Next.js 14", "Python", "FastAPI", "OpenAI / pgvector", "TailwindCSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: true,
      architecturePoints: [
        "AST code parser extracting symbol call graphs and docstrings",
        "Hybrid search combining BM25 keyword match with pgvector cosine similarity",
        "Streaming response generation using server-sent events (SSE) in Next.js"
      ]
    },
    {
      id: "proj-4",
      title: "VeloxDB: High-Speed Embedded Key-Value Store",
      category: "Systems / DevOps",
      description: "Ultra-fast LSM-tree based storage engine written in Rust with WAL durability and memory-mapped file cache.",
      longDescription: "Designed for write-heavy logging and telemetry collection. Achieves 450,000 write ops/sec on standard SSD drives with snappy bloom filter lookups.",
      metrics: "450k writes/sec • Zero GC Pauses • 100% Rust",
      tags: ["Rust", "LSM-Tree", "Memory Mapping", "Concurrency", "Benchmarking"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: false,
      architecturePoints: [
        "Log-Structured Merge-Tree (LSM) with tiered background compaction",
        "Concurrent SkipList in-memory memtable with lock-free atomic ops",
        "Murmur3 bloom filters for instant negative read rejection"
      ]
    },
    {
      id: "proj-5",
      title: "DevSprint: Engineering Team Velocity & DORA Dashboard",
      category: "Full Stack",
      description: "Full-stack web platform computing deployment frequency, lead time for changes, MTTR, and change failure rates from Git & CI data.",
      longDescription: "Built for engineering leaders to measure elite team performance without invasive surveillance. Connects directly to GitHub Actions and Datadog to provide actionable insights.",
      metrics: "Used by 45+ Engineering Orgs • DORA Metric Standard",
      tags: ["React", "Next.js", "TypeScript", "PostgreSQL", "Prisma", "Chart.js"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: false,
      architecturePoints: [
        "Webhook ingestion pipeline processing GitHub deployment events",
        "Aggregated time-bucket analytical queries with material views",
        "Exportable PDF executive summaries and automated Slack digests"
      ]
    },
    {
      id: "proj-6",
      title: "AuraUI: Accessible Dark-Mode Component Library",
      category: "Full Stack",
      description: "Enterprise-grade, accessible React & Tailwind component system with 40+ primitives, micro-animations, and keyboard shortcuts.",
      longDescription: "Built with WAI-ARIA compliance, fluid typography, full focus-trap management, and customizable theme tokens designed for high-density developer consoles.",
      metrics: "15k Weekly Downloads • 100% WCAG AAA Compliance",
      tags: ["React", "TypeScript", "TailwindCSS", "Radix UI", "Storybook"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      featured: false,
      architecturePoints: [
        "Compound component architecture with React context providers",
        "Zero runtime CSS-in-JS overhead using Tailwind utility generation",
        "Automated visual regression testing with Playwright and Storybook"
      ]
    }
  ],
  skillCategories: [
    {
      title: "Programming Languages",
      iconName: "Code2",
      skills: [
        { name: "TypeScript / JavaScript", level: 95, experience: "7 yrs", badge: "Expert" },
        { name: "Go (Golang)", level: 90, experience: "5 yrs", badge: "Advanced" },
        { name: "Python", level: 88, experience: "6 yrs", badge: "Advanced" },
        { name: "Rust", level: 78, experience: "3 yrs", badge: "Proficient" },
        { name: "SQL (PostgreSQL/MySQL)", level: 92, experience: "7 yrs", badge: "Expert" },
        { name: "Bash / Shell Scripting", level: 85, experience: "7 yrs", badge: "Proficient" }
      ]
    },
    {
      title: "Frontend & Web Technologies",
      iconName: "Layout",
      skills: [
        { name: "React 18 / 19", level: 96, experience: "7 yrs", badge: "Expert" },
        { name: "Next.js (App Router)", level: 95, experience: "5 yrs", badge: "Expert" },
        { name: "TailwindCSS & CSS3", level: 94, experience: "6 yrs", badge: "Expert" },
        { name: "State (Zustand / Redux)", level: 90, experience: "6 yrs", badge: "Advanced" },
        { name: "HTML5 / Web APIs / Canvas", level: 92, experience: "7 yrs", badge: "Expert" },
        { name: "Performance / Web Vitals", level: 93, experience: "5 yrs", badge: "Specialist" }
      ]
    },
    {
      title: "Backend & Distributed Systems",
      iconName: "Server",
      skills: [
        { name: "Node.js / Express / Fastify", level: 94, experience: "7 yrs", badge: "Expert" },
        { name: "gRPC & Protocol Buffers", level: 88, experience: "4 yrs", badge: "Advanced" },
        { name: "RESTful & GraphQL APIs", level: 95, experience: "7 yrs", badge: "Expert" },
        { name: "Kafka & Event Streaming", level: 86, experience: "4 yrs", badge: "Advanced" },
        { name: "Microservices Architecture", level: 92, experience: "6 yrs", badge: "Specialist" },
        { name: "WebSockets & SSE", level: 90, experience: "5 yrs", badge: "Advanced" }
      ]
    },
    {
      title: "Cloud, DevOps & Infrastructure",
      iconName: "Cloud",
      skills: [
        { name: "Amazon Web Services (AWS)", level: 92, experience: "6 yrs", badge: "Certified" },
        { name: "Kubernetes (K8s) & Helm", level: 90, experience: "5 yrs", badge: "Certified CKA" },
        { name: "Docker & Containerization", level: 96, experience: "7 yrs", badge: "Expert" },
        { name: "Terraform (IaC)", level: 88, experience: "4 yrs", badge: "Advanced" },
        { name: "CI/CD (GitHub Actions, Argo)", level: 93, experience: "6 yrs", badge: "Specialist" },
        { name: "Monitoring (Prometheus/Grafana)", level: 89, experience: "5 yrs", badge: "Advanced" }
      ]
    },
    {
      title: "Databases & Storage",
      iconName: "Database",
      skills: [
        { name: "PostgreSQL (Query Tuning)", level: 94, experience: "7 yrs", badge: "Expert" },
        { name: "Redis & In-Memory Caching", level: 92, experience: "6 yrs", badge: "Advanced" },
        { name: "MongoDB & Document Stores", level: 85, experience: "5 yrs", badge: "Proficient" },
        { name: "Elasticsearch / Vector DBs", level: 82, experience: "3 yrs", badge: "Proficient" },
        { name: "Prisma & Drizzle ORM", level: 90, experience: "4 yrs", badge: "Advanced" },
        { name: "Distributed Lock & Raft", level: 84, experience: "3 yrs", badge: "Proficient" }
      ]
    }
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "2024",
      credentialId: "AWS-PSA-99482104",
      verifyUrl: "https://aws.amazon.com/verification",
      icon: "aws",
      skillsCovered: ["Multi-Region VPCs", "High Availability", "Cost Optimization", "Disaster Recovery"]
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      issueDate: "2023",
      credentialId: "CKA-2309-847291",
      verifyUrl: "https://www.cncf.io/certification/cka/",
      icon: "k8s",
      skillsCovered: ["Cluster Architecture", "Troubleshooting", "Networking & Ingress", "Security & RBAC"]
    },
    {
      id: "cert-3",
      name: "Google Cloud Professional Cloud Architect",
      issuer: "Google Cloud",
      issueDate: "2023",
      credentialId: "GCP-PCA-7731092",
      verifyUrl: "https://cloud.google.com/certification",
      icon: "gcp",
      skillsCovered: ["GKE Clusters", "BigQuery Pipelines", "Cloud Spanner", "Zero-Trust IAM"]
    },
    {
      id: "cert-4",
      name: "HashiCorp Certified: Terraform Associate (003)",
      issuer: "HashiCorp",
      issueDate: "2024",
      credentialId: "HASHI-TA-4491823",
      verifyUrl: "https://www.credly.com",
      icon: "terraform",
      skillsCovered: ["Infrastructure as Code", "Terraform Cloud", "State Management", "Modular Pipelines"]
    },
    {
      id: "cert-5",
      name: "Meta Certified Senior Front-End Developer",
      issuer: "Meta / Coursera",
      issueDate: "2022",
      credentialId: "META-FED-1092834",
      verifyUrl: "https://www.coursera.org",
      icon: "meta",
      skillsCovered: ["React Architecture", "Accessibility (a11y)", "Web Performance", "Jest & React Testing"]
    },
    {
      id: "cert-6",
      name: "MongoDB Certified Developer Associate",
      issuer: "MongoDB Inc.",
      issueDate: "2023",
      credentialId: "MDB-DEV-3981045",
      verifyUrl: "https://university.mongodb.com",
      icon: "mongodb",
      skillsCovered: ["Aggregation Pipelines", "Indexing Strategies", "Sharding & Replication", "Atlas Search"]
    }
  ],
  contact: {
    heading: "Let's Build Something Exceptional Together",
    subheading: "Whether you have an ambitious greenfield project, a challenging system architecture to untangle, or a key role on your team, I'd love to talk.",
    email: "alex.mercer.dev@example.com",
    telegram: "@alexmercer_dev",
    location: "San Francisco, CA (Available Remote / Travel)",
    calendlyUrl: "https://calendly.com",
    responseTime: "Within 24 hours"
  }
};
