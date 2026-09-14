export const DEFAULT_ENGINEERING_DATA = {
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

export default DEFAULT_ENGINEERING_DATA;
