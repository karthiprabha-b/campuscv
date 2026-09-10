export interface Project {
  id: string;
  title: string;
  category: "all" | "ai" | "fullstack" | "systems";
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  highlights: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  logoBg: string;
  logoColor: string;
  iconType: "layers" | "zap" | "code" | "sparkles";
  period: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  skills: string[];
  projectLink?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  badgeBg: string;
  badgeColor: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  verifyUrl: string;
  description: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Alex Rivera",
    preferredName: "Olivia Rhye", // Reference alias for styling fidelity
    role: "Computer Science Student & Full Stack Engineer",
    subRole: "I'm a CS Senior & Full Stack Developer based in San Francisco.",
    headlineSummary: "Specialise in scalable distributed web systems, generative AI applications, and cloud architecture.",
    bio: [
      "I'm a final-year Computer Science student at UC Berkeley with a deep fascination for high-performance software engineering, cloud architecture, and modern web applications.",
      "Over the past 4 years, I've balanced rigorous theoretical coursework with building end-to-end platforms used by thousands of students. I've interned at fast-growing tech startups, conducted applied AI research with the Berkeley AI Research (BAIR) lab, and led campus software engineering teams.",
      "I'm passionate about helping early-stage ventures build robust products, improving developer experience, and creating delightful, human-centered digital experiences."
    ],
    location: "San Francisco, CA",
    country: "United States",
    status: "Available for Summer & Full-Time '26",
    email: "alex.rivera.cs@berkeley.edu",
    phone: "+1 (510) 847-2931",
    handle: "@alexrivera",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      portfolio: "https://alexrivera.dev"
    },
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80",
    stats: [
      { label: "Cumulative GPA", value: "3.94", sub: "Dean's Honors List" },
      { label: "Projects Completed", value: "18+", sub: "Production & Open Source" },
      { label: "LeetCode Solved", value: "450+", sub: "Top 4% Contest Rating" },
      { label: "Internships & Labs", value: "3", sub: "Silicon Valley" }
    ]
  },

  experience: [
    {
      id: "exp-1",
      role: "Software Engineer Intern",
      company: "CloudScale Technologies",
      logoBg: "bg-brand-100",
      logoColor: "text-brand-600",
      iconType: "layers",
      period: "Jun 2025 – Aug 2025",
      location: "San Francisco, CA",
      type: "Internship",
      description: "Engineered distributed telemetry pipelines and high-throughput microservices.",
      highlights: [
        "Architected an event ingestion pipeline with Go and Apache Kafka processing 120,000+ events/sec with sub-50ms latency.",
        "Built an automated multi-tier cache using Redis and GraphQL, cutting p99 backend latency by 42%.",
        "Configured Terraform and AWS ECS infrastructure with automated CI/CD canary deployments."
      ],
      skills: ["Go", "Apache Kafka", "AWS ECS", "Redis", "GraphQL", "Docker", "Terraform"],
      projectLink: "https://github.com"
    },
    {
      id: "exp-2",
      role: "Undergraduate AI Research Assistant",
      company: "Berkeley AI Research (BAIR)",
      logoBg: "bg-emerald-100",
      logoColor: "text-emerald-600",
      iconType: "sparkles",
      period: "Jan 2025 – May 2025",
      location: "Berkeley, CA",
      type: "Research",
      description: "Researched retrieval-augmented generation (RAG) efficiency for multimodal scientific synthesis.",
      highlights: [
        "Fine-tuned vision-language transformers with PyTorch and Hugging Face Accelerate, boosting benchmark accuracy by 18.4%.",
        "Built high-speed vector embeddings index using pgvector and Pinecone.",
        "Co-authored research findings submitted to NeurIPS 2025 student workshop."
      ],
      skills: ["Python", "PyTorch", "Hugging Face", "pgvector", "CUDA", "FastAPI"],
      projectLink: "https://github.com"
    },
    {
      id: "exp-3",
      role: "Lead Full Stack Developer",
      company: "Cal Open Source & Student Hub",
      logoBg: "bg-blue-100",
      logoColor: "text-blue-600",
      iconType: "code",
      period: "Sep 2024 – Dec 2024",
      location: "Berkeley, CA",
      type: "Student Leadership",
      description: "Led 5 engineers building CampusPulse, an event booking platform serving 8,000+ students.",
      highlights: [
        "Implemented real-time WebSocket seat reservation engine, preventing concurrency lock collisions.",
        "Integrated OAuth2 authentication and Stripe event ticketing.",
        "Delivered zero-downtime automated releases on Kubernetes."
      ],
      skills: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      projectLink: "https://github.com"
    }
  ] as ExperienceItem[],

  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science & Applied Data Science",
      school: "University of California, Berkeley",
      period: "2022 – 2026 (Expected May)",
      gpa: "3.94 / 4.00 (Dean's Honor List - All Semesters)",
      honors: [
        "Teaching Assistant (TA) for CS 61B (Data Structures) mentoring 60+ undergraduates.",
        "CalHacks 2024 Grand Prize Winner out of 2,500+ participants nationwide.",
        "President @ Computer Science Student Association (CSSA)."
      ],
      coursework: [
        "Data Structures & Algorithms",
        "Operating Systems & Architecture (CS 162)",
        "Distributed Computing",
        "Database Management Systems",
        "Artificial Intelligence & Deep Learning",
        "Computer Security & Cryptography",
        "Web Development & UI/UX"
      ]
    }
  ],

  projects: [
    {
      id: "nexus-cloud",
      title: "NexusAI - Realtime Multimodal Assistant",
      category: "ai",
      categoryLabel: "AI & Full-Stack",
      shortDesc: "Real-time voice and vision multimodal assistant with streaming video analysis and vector memory store.",
      fullDesc: "NexusAI is an intelligent multimodal workspace that enables users to interact naturally with AI through streaming audio, live canvas drawings, and uploaded documents. Built with Next.js, FastAPI, and vector similarity search.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
      highlights: [
        "Under 200ms audio streaming latency via WebSockets and WebAudio API.",
        "Semantic document indexing powered by pgvector and Pinecone.",
        "Interactive canvas with markdown, code sandbox execution, and diagram rendering."
      ],
      techStack: ["Next.js 14", "TypeScript", "FastAPI", "Python", "pgvector", "TailwindCSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://demo.nexus-ai.dev"
    },
    {
      id: "hyperkv",
      title: "HyperKV - Distributed Key-Value Engine",
      category: "systems",
      categoryLabel: "Systems & Cloud",
      shortDesc: "High-throughput fault-tolerant distributed key-value store implementing Raft consensus in Go.",
      fullDesc: "A distributed, persistent key-value storage engine engineered from scratch in Go. Employs Raft leader election, log replication, snapshotting, and LSM-tree disk persistence for high write throughput.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80",
      highlights: [
        "Full Raft consensus protocol implementation with automatic failover.",
        "Benchmarked at 85,000 write ops/sec under concurrent stress tests.",
        "Custom gRPC protocol buffers with connection pooling and metrics export."
      ],
      techStack: ["Go (Golang)", "gRPC", "Protobuf", "Raft", "Docker", "Prometheus"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com"
    },
    {
      id: "campuspulse",
      title: "CampusPulse - Student Hub & Booking Platform",
      category: "fullstack",
      categoryLabel: "Full-Stack Web",
      shortDesc: "Campus social platform and study room reservation system with live availability heatmaps and ticket QR passes.",
      fullDesc: "A complete university community application serving thousands of undergraduate students. Features automated room reservation locks, push notifications, event discovery feed, and interactive campus map.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
      highlights: [
        "Over 8,000 monthly active campus users.",
        "Concurrency-safe slot reservation engine preventing double bookings.",
        "Admin moderation dashboard with analytics charts."
      ],
      techStack: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "JWT"],
      githubUrl: "https://github.com",
      liveUrl: "https://campuspulse.demo.site"
    },
    {
      id: "vision-drone",
      title: "AeroVision - Edge Obstacle Detection",
      category: "ai",
      categoryLabel: "Computer Vision & Edge AI",
      shortDesc: "Real-time edge computing object detection pipeline running on Jetson Nano for autonomous drones.",
      fullDesc: "Trained and quantized lightweight YOLOv8 models for real-time 45 FPS obstacle detection and spatial trajectory calculation running directly on low-power edge compute hardware.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=700&q=80",
      highlights: [
        "TensorRT quantization yielding 3.2x speedup with less than 1.5% mAP drop.",
        "Integrated Kalman filter for trajectory predictive tracking.",
        "Tested in 20+ field flight simulations."
      ],
      techStack: ["Python", "PyTorch", "YOLOv8", "TensorRT", "OpenCV", "ROS2"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com"
    }
  ] as Project[],

  skills: {
    categories: [
      {
        title: "Programming Languages",
        items: [
          { name: "Python", level: 95, tag: "Primary" },
          { name: "TypeScript / JavaScript", level: 92, tag: "Primary" },
          { name: "Go (Golang)", level: 85, tag: "Backend" },
          { name: "C / C++", level: 88, tag: "Systems" },
          { name: "SQL (Postgres)", level: 90, tag: "Databases" }
        ]
      },
      {
        title: "Frameworks & Libraries",
        items: [
          { name: "React / Next.js", level: 94, tag: "Frontend" },
          { name: "Node.js / Express", level: 90, tag: "Backend" },
          { name: "FastAPI / Flask", level: 92, tag: "APIs & AI" },
          { name: "Tailwind CSS", level: 96, tag: "Design" },
          { name: "PyTorch & Transformers", level: 86, tag: "AI/ML" }
        ]
      },
      {
        title: "Cloud & DevOps",
        items: [
          { name: "AWS (S3, EC2, Lambda)", level: 88, tag: "Cloud" },
          { name: "Docker & Kubernetes", level: 90, tag: "DevOps" },
          { name: "PostgreSQL & Redis", level: 92, tag: "Data" },
          { name: "Git & GitHub Actions", level: 94, tag: "CI/CD" }
        ]
      }
    ],
    tools: [
      "Docker", "Git / GitHub", "AWS Cloud", "Postman", "Linux", 
      "Figma UI/UX", "VS Code", "Jupyter", "GraphQL", "Redis", "Kafka", "Prisma"
    ]
  },

  certificates: [
    {
      id: "cert-aws-saa",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services (AWS)",
      badgeBg: "bg-amber-50",
      badgeColor: "text-amber-600",
      issueDate: "Jan 2025",
      expiryDate: "Jan 2028",
      credentialId: "AWS-SAA-884920482",
      verifyUrl: "https://aws.amazon.com/verification",
      description: "Demonstrated comprehensive expertise in designing secure, resilient, high-performing, and cost-optimized cloud architectures on AWS."
    },
    {
      id: "cert-gcp-ace",
      title: "Google Cloud Associate Cloud Engineer",
      issuer: "Google Cloud Platform",
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-600",
      issueDate: "Nov 2024",
      expiryDate: "Nov 2027",
      credentialId: "GCP-ACE-55912401",
      verifyUrl: "https://cloud.google.com/certification",
      description: "Certified proficiency in deploying applications, monitoring operations, and managing enterprise identity & access controls on GCP."
    },
    {
      id: "cert-meta-fullstack",
      title: "Meta Full-Stack Professional Certificate",
      issuer: "Meta / Coursera",
      badgeBg: "bg-purple-50",
      badgeColor: "text-purple-600",
      issueDate: "Aug 2024",
      expiryDate: "Lifetime",
      credentialId: "META-FS-991048234",
      verifyUrl: "https://coursera.org/verify",
      description: "Comprehensive 9-course specialization covering advanced React, Django/Python APIs, relational database design, and end-to-end web deployment."
    }
  ] as CertificateItem[]
};
