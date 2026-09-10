/**
 * semanticParser.test.ts — Automated Unit Test Suite for Semantic Resume Parsing
 */

import { parseResumeText } from '../../utils/resumeParser';
import { RESUME_FIXTURES } from './fixtures/resumeFixtures';

const KARTHIK_TEST_RESUME_TEXT = `
KARTHIKEYAN PRABAKARAN
Artificial Intelligence & Data Science
karthikeyan.p@example.com | +91 9876543210 | Thanjavur, Tamil Nadu
https://github.com/karthikeyanprabakaran23 | https://linkedin.com/in/karthikeyan

PROFILE SUMMARY
Artificial Intelligence and Data Science student with strong technical foundations in python automation, full-stack development, and data processing.

EDUCATION
P.R. Engineering College, Thanjavur
B.Tech – Artificial Intelligence & Data Science
Aug 2022 – May 2026
Relevant Coursework: Artificial Intelligence, Machine Learning, Data Analysis, Statistics, Programming

WORK EXPERIENCE
Freelance – Data & Automation Developer
Aug 2025 – Present
• Developed custom python scripts to automate web data extraction and dataset processing.
• Built structured database workflows for client data reporting.
• Created automated data validation checks reducing manual entry errors by 40%.
• Delivered end-to-end technical solutions meeting client timeline specifications.

PROJECTS

Leads – Automated Lead Data Management
GitHub: https://github.com/karthikeyanprabakaran23-
gif/Leads
• Developed a Python-based application to collect, store, and manage business lead data.
• Designed structured workflows for organizing datasets suitable for analysis and reporting.
• Automated repetitive data-handling tasks, reducing manual effort by approximately 50%.
• Strengthened understanding of basic data pipelines and structured data processing.
Tech & Keywords: Python, Data Collection, Data Management, Structured Data, Automation

Google Maps Lead Scraper
GitHub: https://github.com/karthikeyanprabakaran23-gif/Google-Maps-Scraper
• Built a web scraper to extract business listing information from Google Maps.
• Extracted key business data including name, contact details, address, and ratings.
• Implemented data cleaning procedures to format scraped output into structured CSV files.
• Gained practical experience in web scraping techniques and data extraction workflows.
Tech & Keywords: Python, Web Scraping, BeautifulSoup, Data Processing, CSV Export

AI Hospital Discharge Management System
GitHub: https://github.com/karthikeyanprabakaran23-gif/AI-Hospital-Discharge
• Contributed to an AI-assisted concept system designed to streamline patient discharge summaries.
• Assisted in designing structured data input templates for clinical documentation.
• Explored logic for automating discharge report generation to reduce administrative delays.
• Applied concepts of software design, data organization, and healthcare workflow optimization.
Tech & Keywords: Python, AI Concepts, Healthcare IT, Workflow Automation, Software Design

Interior Design Shop Web Application
GitHub: https://github.com/karthikeyanprabakaran23-gif/Interior-Design-Shop
• Developed a full-stack web application prototype for an interior design product shop.
• Implemented responsive frontend UI layouts for browsing catalog items and product details.
• Designed database schemas for managing product categories and customer inquiries.
Tech & Keywords: React, JavaScript, Node.js, Web Development, UI/UX Design

Game Development Fundamentals (Unity – Learning Project)
GitHub: https://github.com/karthikeyanprabakaran23-gif/Unity-Game-Dev
• Built interactive 2D game mechanics using C# and Unity game engine.
• Implemented physics interactions, player movement logic, and score tracking systems.
Tech & Keywords: Unity, C#, Game Engine, 2D Mechanics, Interactive Logic

TECHNICAL SKILLS
Programming Languages: Python, C, C++, JavaScript, SQL
Web & Backend Development: HTML5, CSS3, React, Node.js, Express
Databases: PostgreSQL, MySQL, SQLite, MongoDB
Data, Automation & Analytics: Web Scraping, Pandas, NumPy, Data Cleaning, Automation
AI / Machine Learning (Foundational): Machine Learning Concepts, Data Preprocessing
Tools & Platforms: Git, GitHub, VS Code, Linux

CERTIFICATIONS
Honours Diploma in Full Stack Development (HDFD)
CSC – Computer Software College, Thanjavur
Apr 2023 – Apr 2024
Grade: A (Excellent)
`.trim();

async function runSemanticParserTests() {
  console.log('====================================================');
  console.log('       SEMANTIC RESUME PARSER AUDIT TEST            ');
  console.log('====================================================\n');

  const result = parseResumeText(KARTHIK_TEST_RESUME_TEXT, 'Karthik_Resume.pdf');
  const profile = result.profile;

  console.log('--- EXTRACTED PROFILE SUMMARY ---');
  console.log('Name          :', profile.personal.fullName);
  console.log('Email         :', profile.personal.email);
  console.log('Education     :', profile.education.length);
  console.log('Experience    :', profile.experience.length);
  console.log('Projects      :', profile.projects.length);
  console.log('Certifications:', profile.certifications.length);
  console.log('Skills        :', profile.skills.length);

  console.log('\n--- PROJECT TITLES & DETAILS ---');
  profile.projects.forEach((proj, idx) => {
    console.log(`[Project ${idx + 1}] ${proj.name}`);
    console.log(`  Bullets     : ${proj.achievements?.length || 0}`);
    console.log(`  GitHub      : ${proj.githubUrl || 'N/A'}`);
    console.log(`  Technologies: ${proj.technologies?.join(', ') || 'N/A'}`);
  });

  // ASSERTIONS FOR TEST RESUME
  const assertions = [
    { cond: Boolean(profile.personal.fullName), label: 'profile.name exists' },
    { cond: Boolean(profile.personal.email), label: 'profile.email exists' },
    { cond: profile.education.length === 1, label: 'education.length === 1' },
    { cond: profile.experience.length === 1, label: 'experience.length === 1' },
    { cond: profile.projects.length === 5, label: 'projects.length === 5' },
    { cond: profile.certifications.length === 1, label: 'certifications.length === 1' },
    {
      cond: profile.projects[0]?.name?.includes('Leads'),
      label: 'projects[0].title === "Leads – Automated Lead Data Management"'
    },
    {
      cond: (profile.projects[0]?.achievements?.length || 0) === 4,
      label: 'projects[0].bullets.length === 4'
    },
    {
      cond: profile.projects[0]?.githubUrl?.includes('/Leads') ?? false,
      label: 'projects[0].githubUrl contains "/Leads"'
    },
    {
      cond: profile.projects[1]?.name?.includes('Google Maps Lead Scraper') ?? false,
      label: 'projects[1].title === "Google Maps Lead Scraper"'
    },
    {
      cond: profile.projects[2]?.name?.includes('AI Hospital Discharge') ?? false,
      label: 'projects[2].title === "AI Hospital Discharge Management System"'
    },
    {
      cond: profile.projects[3]?.name?.includes('Interior Design Shop') ?? false,
      label: 'projects[3].title === "Interior Design Shop Web Application"'
    },
    {
      cond: profile.projects[4]?.name?.includes('Game Development Fundamentals') ?? false,
      label: 'projects[4].title contains "Game Development Fundamentals"'
    },
    {
      cond: !profile.projects.some(p => p.name === 'gif/Leads' || p.name === 'data.' || p.name === '50%.' || p.name === 'and reporting.'),
      label: 'NO project title equal to URL fragments or line continuations'
    }
  ];

  console.log('\n--- ASSERTION VERIFICATION RESULTS ---');
  let allPassed = true;
  assertions.forEach((a, i) => {
    const status = a.cond ? '✓ PASS' : '✗ FAIL';
    if (!a.cond) allPassed = false;
    console.log(`[${status}] Assertion ${i + 1}: ${a.label}`);
  });

  console.log('\n====================================================');
  if (allPassed) {
    console.log('✨ ALL SEMANTIC PARSER ASSERTIONS PASSED 100% SUCCESSFULLY!');
  } else {
    console.error('❌ SOME ASSERTIONS FAILED');
    process.exit(1);
  }
}

runSemanticParserTests().catch(err => {
  console.error('Test execution exception:', err);
  process.exit(1);
});
