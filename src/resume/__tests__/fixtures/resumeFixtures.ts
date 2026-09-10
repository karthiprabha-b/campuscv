/**
 * resumeFixtures.ts — 10 Required Test Fixtures for Resume Parser Acceptance
 */

export interface ResumeFixture {
  id: number;
  name: string;
  sourceType: 'pdf' | 'docx';
  rawText: string;
  expected: {
    fullName: string;
    email: string;
    phone?: string;
    headline?: string;
    educationCount: number;
    experienceCount: number;
    projectsCount: number;
    skillsCount: number;
    certificationsCount: number;
    socialGithub?: string;
    socialLinkedin?: string;
  };
}

export const RESUME_FIXTURES: ResumeFixture[] = [
  {
    id: 1,
    name: "simple one-column PDF",
    sourceType: "pdf",
    rawText: `
KARTHIKEYAN PRABAKARAN
Artificial Intelligence & Data Science
karthik@example.com | +91 9876543210 | Thanjavur, Tamil Nadu
https://github.com/karthik | https://linkedin.com/in/karthik

SUMMARY
Passionate Artificial Intelligence and Data Science student with strong foundations in full-stack development and machine learning.

EDUCATION
P.R. Engineering College
B.Tech Artificial Intelligence & Data Science
2022 - 2026
CGPA: 8.5 / 10

EXPERIENCE
Infowaves
Software Developer Intern
Jan 2026 - Present
• Engineered full-stack web applications using Next.js and PostgreSQL.

PROJECTS
CampusCV Portfolio Builder
Next.js, React, Supabase
https://github.com/karthik/campuscv
• Built automated resume import and portfolio template rendering engine.

SKILLS
Python, JavaScript, React, Next.js, PostgreSQL, Git

CERTIFICATIONS
AWS Certified Cloud Practitioner - Amazon Web Services (2025)
https://aws.amazon.com/verify/1234
    `.trim(),
    expected: {
      fullName: "Karthikeyan Prabakaran",
      email: "karthik@example.com",
      phone: "+91 9876543210",
      headline: "Artificial Intelligence & Data Science",
      educationCount: 1,
      experienceCount: 1,
      projectsCount: 1,
      skillsCount: 6,
      certificationsCount: 1,
      socialGithub: "https://github.com/karthik",
      socialLinkedin: "https://linkedin.com/in/karthik"
    }
  },

  {
    id: 2,
    name: "two-column PDF",
    sourceType: "pdf",
    rawText: `
PRIYA SHARMA
Frontend Architect
priya@techdomain.org | +91 9123456789 | Bengaluru, India
github.com/priyasharma | linkedin.com/in/priyasharma

PROFILE
Frontend specialist with 5 years experience creating high-throughput web systems.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, HTML5, CSS3
Frameworks: React, Next.js, Redux, Vue.js
Tools: Webpack, Docker, Jest, Git

WORK EXPERIENCE
PixelCraft Studios
Senior Frontend Developer
2023 - Present
• Led frontend architecture for 3 flagship enterprise applications.

TechInnovators Pvt Ltd
Frontend Engineer
2021 - 2023
• Developed responsive user interfaces with 99.9% uptime.

ACADEMIC QUALIFICATIONS
National Institute of Technology
B.Tech Computer Science & Engineering
2017 - 2021

FEATURED PROJECTS
Design System UI Library
React, Tailwind CSS, Storybook
https://github.com/priyasharma/ui-library

CERTIFICATIONS
Meta Certified Front-End Developer (2024)
    `.trim(),
    expected: {
      fullName: "Priya Sharma",
      email: "priya@techdomain.org",
      headline: "Frontend Architect",
      educationCount: 1,
      experienceCount: 2,
      projectsCount: 1,
      skillsCount: 12,
      certificationsCount: 1
    }
  },

  {
    id: 3,
    name: "DOCX resume",
    sourceType: "docx",
    rawText: `
ALEXANDER WANG
Data Scientist & AI Researcher
alex.wang@university.edu | San Francisco, CA
https://linkedin.com/in/alexwang-ai

CAREER SUMMARY
Research scientist specializing in deep learning, natural language processing, and computer vision models.

EDUCATION
Stanford University
M.S. Computer Science (AI Track)
2022 - 2024

University of California, Berkeley
B.S. Electrical Engineering & Computer Sciences
2018 - 2022

EMPLOYMENT HISTORY
OpenAI Lab
Research Associate Intern
Jun 2023 - Sep 2023
• Fine-tuned transformer models on multi-modal datasets.

KEY PROJECTS
Neural Vision Classifier
PyTorch, OpenCV, CUDA
https://github.com/alexwang/neural-vision

SKILLS & TOOLS
Python, PyTorch, TensorFlow, C++, CUDA, Docker, Linux

HONORS & CERTIFICATIONS
Deep Learning Specialization - Coursera (2023)
    `.trim(),
    expected: {
      fullName: "Alexander Wang",
      email: "alex.wang@university.edu",
      headline: "Data Scientist & AI Researcher",
      educationCount: 2,
      experienceCount: 1,
      projectsCount: 1,
      skillsCount: 7,
      certificationsCount: 1
    }
  },

  {
    id: 4,
    name: "student resume",
    sourceType: "pdf",
    rawText: `
SNEHA REDDY
B.Tech Student | CS Undergraduate
sneha.reddy@college.ac.in | Hyderabad, Telangana
linkedin.com/in/snehareddy-cs

OBJECTIVE
Motivated computer science student seeking software engineering internship opportunities.

ACADEMIC DETAILS
VNR Vignana Jyothi Institute of Engineering & Technology
B.Tech Computer Science & Engineering
2023 - 2027
CGPA: 9.1

ACADEMIC PROJECTS
Smart Attendance Management System
Python, OpenCV, Flask, SQLite
https://github.com/snehareddy/smart-attendance
• Designed facial recognition system achieving 96% accuracy.

College Event Portal
React, Node.js, Express, MongoDB
https://github.com/snehareddy/event-portal

TECHNICAL EXPERTISE
Python, Java, C, HTML, CSS, JavaScript, React, SQL, Git

CERTIFICATES
NPTEL Programming in Java - Elite Certificate (2024)
    `.trim(),
    expected: {
      fullName: "Sneha Reddy",
      email: "sneha.reddy@college.ac.in",
      educationCount: 1,
      experienceCount: 0,
      projectsCount: 2,
      skillsCount: 9,
      certificationsCount: 1
    }
  },

  {
    id: 5,
    name: "experienced professional resume",
    sourceType: "pdf",
    rawText: `
MICHAEL BROWN
Principal Cloud Architect
michael.brown@cloudexperts.com | Seattle, WA
linkedin.com/in/mbrown-cloud | github.com/mbrown-cloud

ABOUT ME
12+ years of experience leading enterprise cloud migrations and microservices platform engineering.

EMPLOYMENT HISTORY
Amazon Web Services (AWS)
Principal Solutions Architect
2021 - Present
• Designed multi-region resilient infrastructure for Fortune 500 clients.

Microsoft Corporation
Senior Cloud Engineer
2016 - 2021
• Built Azure Kubernetes deployment automation scripts.

Oracle
Systems Engineer
2012 - 2016

EDUCATION
University of Washington
B.S. Computer Engineering
2008 - 2012

CORE SKILLS
AWS, Azure, Terraform, Kubernetes, Go, Python, CI/CD, Microservices

CERTIFICATIONS
AWS Certified Solutions Architect Professional (2023)
Certified Kubernetes Administrator (CKA) (2022)
    `.trim(),
    expected: {
      fullName: "Michael Brown",
      email: "michael.brown@cloudexperts.com",
      headline: "Principal Cloud Architect",
      educationCount: 1,
      experienceCount: 3,
      projectsCount: 0,
      skillsCount: 8,
      certificationsCount: 2
    }
  },

  {
    id: 6,
    name: "resume without experience",
    sourceType: "pdf",
    rawText: `
RITIKA PATEL
UI/UX & Product Design Student
ritika.patel@designschool.in | Mumbai, India
https://behance.net/ritikapatel | https://dribbble.com/ritikapatel

PROFILE
Creative product designer passionate about user-centric mobile interfaces and design systems.

EDUCATION
National Institute of Design (NID)
B.Des Industrial & Communication Design
2022 - 2026

FEATURED PROJECTS
FinFlow Mobile Banking App
Figma, Design Systems, Prototyping
https://behance.net/gallery/123/finflow
• Conducted user research with 40 participants and built high-fidelity interactive prototype.

EcoTrack Sustainability Dashboard
Figma, User Research, Wireframing

SKILLS
Figma, Adobe XD, Illustrator, Photoshop, Wireframing, User Research, Usability Testing

CERTIFICATIONS
Google UX Design Professional Certificate - Coursera (2024)
    `.trim(),
    expected: {
      fullName: "Ritika Patel",
      email: "ritika.patel@designschool.in",
      headline: "UI/UX & Product Design Student",
      educationCount: 1,
      experienceCount: 0,
      projectsCount: 2,
      skillsCount: 7,
      certificationsCount: 1
    }
  },

  {
    id: 7,
    name: "resume with multiple projects",
    sourceType: "pdf",
    rawText: `
DAVID MILLER
Full Stack Software Engineer
david.m@devmail.io | Austin, TX
github.com/davidm-dev

SUMMARY
Full-stack web developer experienced with modern JS frameworks and cloud backends.

EDUCATION
University of Texas at Austin
B.S. Computer Science
2020 - 2024

SELECTED PROJECTS
DevBoard Task Manager
React, Node.js, Socket.io, PostgreSQL
https://github.com/davidm-dev/devboard
• Real-time collaborative kanban board supporting 500+ active users.

CryptoMetrics Dashboard
Next.js, Tailwind CSS, CoinGecko API
https://github.com/davidm-dev/cryptometrics

Markdown Notes App
Electron, React, TypeScript
https://github.com/davidm-dev/notes-app

AI Code Assistant CLI
Python, OpenAI API, Typer
https://github.com/davidm-dev/ai-cli

SKILLS
TypeScript, JavaScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Python, Docker
    `.trim(),
    expected: {
      fullName: "David Miller",
      email: "david.m@devmail.io",
      educationCount: 1,
      experienceCount: 0,
      projectsCount: 4,
      skillsCount: 10,
      certificationsCount: 0
    }
  },

  {
    id: 8,
    name: "resume with categorized skills",
    sourceType: "pdf",
    rawText: `
ANANYA KRISHNAN
Machine Learning & Backend Engineer
ananya.k@aimail.com | Chennai, Tamil Nadu
github.com/ananyak | linkedin.com/in/ananyak

ABOUT
Engineering graduate focused on scalable backend architectures and distributed ML training.

EDUCATION
Anna University - CEG Campus
B.E. Computer Science & Engineering
2020 - 2024
CGPA: 8.8

WORK EXPERIENCE
SaaSify Tech
Junior Backend Engineer
2024 - Present

TECHNICAL SKILLS
Languages: Python, C++, Java, JavaScript, SQL
Backend: FastAPI, Django, Express, Node.js
Machine Learning: PyTorch, Scikit-learn, Pandas, NumPy
Databases: PostgreSQL, Redis, MongoDB
DevOps: Docker, Git, Linux, GitHub Actions

CERTIFICATIONS
TensorFlow Developer Certificate - Google (2024)
    `.trim(),
    expected: {
      fullName: "Ananya Krishnan",
      email: "ananya.k@aimail.com",
      educationCount: 1,
      experienceCount: 1,
      projectsCount: 0,
      skillsCount: 19,
      certificationsCount: 1
    }
  },

  {
    id: 9,
    name: "resume with unusual headings",
    sourceType: "pdf",
    rawText: `
VIKRAM KUMAR
Robotics & Embedded Systems Specialist
vikram.k@robotics.org | Pune, Maharashtra
linkedin.com/in/vikram-robotics

CAREER OBJECTIVE
Hardware-software co-design enthusiast with expertise in ROS2, RTOS, and microcontrollers.

ACADEMICS
COEP Technological University
B.Tech Mechatronics Engineering
2021 - 2025

EMPLOYMENT
RoboSystems India
Embedded Systems Intern
Jan 2025 - Jun 2025

KEY ACCOMPLISHMENTS & PROJECTS
Autonomous Warehouse Robot
ROS2, C++, Python, Gazebo
https://github.com/vikram/warehouse-bot

CAPABILITIES & TOOLS
C++, Python, ROS2, STM32, Arduino, RTOS, PCB Design, Git

LICENSES & CERTIFICATES
ROS2 Basics for C++ - Construction (2024)
    `.trim(),
    expected: {
      fullName: "Vikram Kumar",
      email: "vikram.k@robotics.org",
      educationCount: 1,
      experienceCount: 1,
      projectsCount: 1,
      skillsCount: 8,
      certificationsCount: 1
    }
  },

  {
    id: 10,
    name: "scanned PDF",
    sourceType: "pdf",
    rawText: `
KARTHIKEYAN PRABAKARAN
AI & Data Science Specialist
karthikeyan.p@example.com | Thanjavur
github.com/karthikeyan-p

SUMMARY
Artificial Intelligence & Data Science student.

EDUCATION
P.R. Engineering College
B.Tech Artificial Intelligence & Data Science
2022 - 2026

SKILLS
Python, Data Science, Machine Learning, SQL
    `.trim(),
    expected: {
      fullName: "Karthikeyan Prabakaran",
      email: "karthikeyan.p@example.com",
      educationCount: 1,
      experienceCount: 0,
      projectsCount: 0,
      skillsCount: 4,
      certificationsCount: 0
    }
  }
];
