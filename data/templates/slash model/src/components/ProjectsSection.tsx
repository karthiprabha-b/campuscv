'use client';

import React, { useState } from 'react';

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

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Enterprise Analytics Dashboard',
    categoryTag: 'SYSTEMS ARCHITECTURE',
    filterCategory: ['coded', 'fullstack'],
    image: '/assets/images/project-dashboard.jpg',
    shortDesc: 'High-throughput real-time monitoring platform handling 1M+ daily telemetry events with sub-50ms render latency.',
    description: 'Engineered a next-generation real-time telemetry console tailored for multi-region cloud workloads. Reduced data processing latency by 64% using web workers and virtualized data tables.',
    highlights: [
      'Engineered sub-50ms canvas visualizations using WebGL & React',
      'Designed a resilient WebSocket reconciliation engine for intermittent connections',
      'Achieved 100% test coverage for core financial calculation pipelines'
    ],
    techStack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    demoUrl: 'https://example.com/demo1',
    codeUrl: 'https://github.com/example/analytics'
  },
  {
    id: 'proj-2',
    title: 'Minimalist Commerce System',
    categoryTag: 'FULL-STACK SAAS',
    filterCategory: ['coded', 'designed', 'fullstack'],
    image: '/assets/images/project-ecommerce.jpg',
    shortDesc: 'Headless storefront with instant optimistic checkout, dynamic tax calculation, and multi-currency support.',
    description: 'Designed and deployed a modern eCommerce experience prioritizing extreme typography and spatial balance. Integrated Stripe Elements with serverless webhook processing.',
    highlights: [
      'Sub-second page transitions via Next.js App Router and Edge Caching',
      'Lighthouse performance score of 99/100 across mobile and desktop',
      'Dynamic currency conversion supporting 42 regional currencies'
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'PostgreSQL'],
    demoUrl: 'https://example.com/demo2',
    codeUrl: 'https://github.com/example/commerce'
  },
  {
    id: 'proj-3',
    title: 'Monochromatic Design System',
    categoryTag: 'UI / UX ARCHITECTURE',
    filterCategory: ['designed'],
    image: '/assets/images/project-dashboard.jpg',
    shortDesc: 'A rigorous accessible component library built for high-contrast enterprise design and micro-interactions.',
    description: 'Crafted a comprehensive design system spanning 60+ accessible primitives. Standardized design tokens across Figma, React, and automated style linters.',
    highlights: [
      'WCAG AAA compliance across all high-contrast typography tokens',
      'Zero-runtime CSS footprint with customized Tailwind preset',
      'Adopted by 4 independent engineering teams across 12 micro-frontends'
    ],
    techStack: ['Figma', 'TypeScript', 'React', 'Storybook', 'Tailwind CSS'],
    demoUrl: 'https://example.com/demo3',
    codeUrl: 'https://github.com/example/design-system'
  }
];

interface ProjectsSectionProps {
  data?: any;
  onSelectProject: (project: ProjectItem) => void;
}

export default function ProjectsSection({ data = {}, onSelectProject }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'coded' | 'designed' | 'fullstack'>('all');
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:portfolio:root:div:title']?.value ||
    data?.projectsTitle ||
    'Portfolio';

  const userProjects = Array.isArray(data?.projects) ? data.projects : (Array.isArray(data?.portfolioProjects) ? data.portfolioProjects : null);

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let rawList: any[] = [];
  if (Array.isArray(userProjects)) {
    rawList = userProjects;
  } else if (!hasCustomData) {
    rawList = DEFAULT_PROJECTS;
  }

  // If no projects data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  const projects: ProjectItem[] = rawList.map((p: any, idx: number) => {
    const rawImg = p.image || p.imageUrl || p.thumbnail || p.cover || (idx % 2 === 0 ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
    const tags = Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.tags) ? p.tags : (Array.isArray(p.technologies) ? p.technologies : ['React', 'TypeScript', 'Tailwind']));
    const categoryTag = p.categoryTag || p.category || (idx % 2 === 0 ? 'SYSTEMS ARCHITECTURE' : 'FULL-STACK SAAS');
    const catLower = categoryTag.toLowerCase();
    const filterCat: ('coded' | 'designed' | 'fullstack')[] = catLower.includes('design') 
      ? ['designed'] 
      : (catLower.includes('full') ? ['fullstack', 'coded'] : ['coded']);

    return {
      id: p.id || `proj-${idx}`,
      title: p.title || p.name || `Project ${idx + 1}`,
      categoryTag,
      filterCategory: filterCat,
      image: rawImg,
      shortDesc: p.shortDesc || p.summary || p.description || 'Modern digital application engineered with clean modular components, performance benchmarks, and sleek UX.',
      description: p.description || p.fullDesc || p.shortDesc || 'An in-depth project showcase highlighting architecture, state management, and user flows.',
      highlights: Array.isArray(p.highlights) && p.highlights.length > 0 ? p.highlights : [
        'Engineered responsive interface using modern web paradigms',
        'Implemented resilient API caching and automated validation workflows',
        'Designed scalable design tokens with seamless styling parity'
      ],
      techStack: tags,
      demoUrl: p.demoUrl || p.liveUrl || p.url || p.link || '',
      codeUrl: p.codeUrl || p.githubUrl || p.github || ''
    };
  });

  const filteredProjects = (Array.isArray(projects) ? projects : DEFAULT_PROJECTS).filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.filterCategory && proj.filterCategory.includes(activeFilter);
  });

  return (
    <section 
      id="portfolio" 
      data-section="projects"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:portfolio:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Boxed Header */}
        <div className="text-center mb-12">
          <div 
            data-node-id="text:portfolio:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:portfolio:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-700 mt-4 font-normal">
            Selected engineering case studies, full-stack architectures, and modern digital interfaces.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {(['all', 'coded', 'designed', 'fullstack'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-heading text-xs font-black tracking-widest uppercase px-5 py-2.5 border-2 border-black transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] shadow-solid-sm border-black'
                  : 'bg-white text-black hover:bg-[var(--primary,#000000)] hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)]'
              }`}
            >
              {filter === 'fullstack' ? 'FULL STACK' : filter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, pIdx) => {
            const cardImgOverride = contentOverrides[`image:project:${pIdx}:img`]?.src || project.image;
            const projectTitle = contentOverrides[`text:project:${pIdx}:title`]?.value || project.title;
            const projectDesc = contentOverrides[`text:project:${pIdx}:desc`]?.value || project.shortDesc;

            return (
              <article
                key={project.id || pIdx}
                data-node-id={`card:project:${pIdx}`}
                data-node-type="card"
                className="bg-white border-3 border-black shadow-solid-md flex flex-col group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary,#000000)] text-black"
                style={styleOverrides[`card:project:${pIdx}`]}
              >
                {/* Project Image Viewport */}
                <div className="relative w-full aspect-video border-b-2 border-black bg-neutral-900 overflow-hidden">
                  <span className="absolute top-3 left-3 z-10 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] text-[10px] font-heading font-black tracking-widest uppercase px-2.5 py-1 shadow-sm">
                    {project.categoryTag}
                  </span>
                  <img
                    src={cardImgOverride}
                    alt={projectTitle}
                    data-node-id={`image:project:${pIdx}:img`}
                    data-node-type="image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow">
                  <h3 
                    data-node-id={`text:project:${pIdx}:title`}
                    data-node-type="text"
                    className="font-heading font-black text-lg text-black tracking-tight mb-2"
                  >
                    {projectTitle}
                  </h3>
                  
                  <p 
                    data-node-id={`text:project:${pIdx}:desc`}
                    data-node-type="text"
                    className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-5 flex-grow font-normal"
                  >
                    {projectDesc}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack && project.techStack.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 bg-neutral-100 text-black border border-neutral-300 font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <button
                      onClick={() => onSelectProject(project)}
                      data-node-id={`button:project:${pIdx}:casestudy`}
                      data-node-type="button"
                      className="bracket-link text-xs font-black p-0 cursor-pointer"
                    >
                      | CASE STUDY |
                    </button>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bracket-link text-xs font-black p-0 no-underline"
                    >
                      | DEMO ↗ |
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Geometric Wave Divider */}
        <div className="geometric-divider" aria-hidden="true">
          <svg viewBox="0 0 32 12"><path d="M0,6 Q4,0 8,6 T16,6 T24,6 T32,6"/></svg>
        </div>

      </div>
    </section>
  );
}
