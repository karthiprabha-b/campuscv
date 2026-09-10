'use client';

import React, { useState, useEffect } from 'react';
import TextFx from './TextFx';

interface Project {
  id: string;
  title: string;
  category: string;
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

interface ProjectsProps {
  data?: any;
  onSelectProject?: (project: Project) => void;
}

export default function Projects({ data = {}, onSelectProject = () => {} }: ProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = React.useRef<number | null>(null);

  const projectsSection = data?.projects || {};
  const eyebrow = projectsSection?.eyebrow || 'SELECTED WORKS';
  const title = projectsSection?.title || 'Featured Projects';
  const description = projectsSection?.description || 'A curated portfolio of production applications, interfaces, and scalable design architectures. Click any card to view full case studies.';

  const defaultProjects: Project[] = [
    {
      id: "proj-1",
      title: "Aurora Financial Intelligence",
      category: "Web Apps",
      tagline: "Next-generation asset analytics & portfolio tracking suite",
      description: "A comprehensive real-time financial tracking dashboard featuring interactive asset allocation visualizers and live market watchlists.",
      longDescription: "Aurora gives high-net-worth investors and fund managers real-time telemetry over multi-currency portfolios. Engineered with Next.js App Router, custom SVG chart visualizers, and an ultra-refined editorial design language.",
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
      description: "An intuitive mobile ecosystem blending financial literacy with personal wellness metrics and mood-based expense tracking.",
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
      tags: ["Design System", "Storybook", "TypeScript", "Accessibility", "Tokens"],
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
      longDescription: "Combines high-fashion editorial layouts, smooth page transitions, and a custom interactive product showcase for an artisanal studio.",
      image: "/images/port-item2.jpg",
      tags: ["Branding", "Creative Direction", "Next.js", "Web Animations", "E-Commerce"],
      metrics: "Awwwards Site of the Day nominee",
      liveUrl: "https://example.com/kroma",
      githubUrl: "https://github.com/example/kroma-studio",
      featured: false
    }
  ];

  const rawProjects = (Array.isArray(data?.projects) && data.projects.length > 0)
    ? data.projects
    : (Array.isArray(projectsSection?.items) && projectsSection.items.length > 0)
      ? projectsSection.items
      : (Array.isArray(data?.portfolio?.projects) && data.portfolio.projects.length > 0)
        ? data.portfolio.projects
        : (Array.isArray(data?.works) && data.works.length > 0)
          ? data.works
          : defaultProjects;

  const allProjects: Project[] = (Array.isArray(rawProjects) && rawProjects.length > 0 ? rawProjects : defaultProjects).map((p: any, idx: number) => {
    if (typeof p === 'string') {
      return {
        id: `proj-${idx}`,
        title: p,
        category: 'Web Apps',
        tagline: 'Production project',
        description: '',
        longDescription: '',
        image: idx % 2 === 0 ? '/images/project1.jpg' : '/images/project2.jpg',
        tags: [],
        metrics: '',
        liveUrl: '',
        githubUrl: '',
        featured: false
      };
    }
    let tags: string[] = [];
    if (Array.isArray(p?.tags)) tags = p.tags.map((t: any) => typeof t === 'string' ? t : (t?.name || String(t)));
    else if (Array.isArray(p?.technologies)) tags = p.technologies.map((t: any) => typeof t === 'string' ? t : (t?.name || String(t)));
    else if (Array.isArray(p?.skills)) tags = p.skills.map((t: any) => typeof t === 'string' ? t : (t?.name || String(t)));
    else if (typeof p?.tags === 'string' && p.tags) tags = p.tags.split(',').map((t: string) => t.trim());

    return {
      id: p?.id || `proj-${idx}`,
      title: p?.title || p?.name || 'Project Title',
      category: p?.category || p?.type || 'Web Apps',
      tagline: p?.tagline || p?.subtitle || p?.category || 'Production application',
      description: p?.description || p?.summary || '',
      longDescription: p?.longDescription || p?.description || p?.summary || '',
      image: p?.image || p?.thumbnail || p?.cover || (idx % 2 === 0 ? '/images/project1.jpg' : '/images/project2.jpg'),
      tags,
      metrics: p?.metrics || p?.outcome || p?.stats || '',
      liveUrl: p?.liveUrl || p?.link || p?.url || '',
      githubUrl: p?.githubUrl || p?.github || p?.repo || '',
      featured: Boolean(p?.featured)
    };
  });

  // Responsive itemsPerView
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 768) {
        setItemsPerView(1);
      } else if (w < 1100) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, allProjects.length - itemsPerView);

  // Automatic left-to-right carousel sliding (loops automatically)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  const renderCard = (project: Project, idx: number) => (
    <div
      className="project-compact-card h-100 d-flex flex-column justify-content-between p-3 p-xl-4 bg-white border"
      onClick={() => onSelectProject(project)}
      data-cv={`projects[${idx}]`}
      data-cv-item={`projects[${idx}]`}
      data-node-id={`container:projects:card:${idx}`}
      style={{
        cursor: 'pointer',
      }}
    >
      <div>
        {/* Visual Thumbnail */}
        <div
          className="project-thumb-wrap mb-3 overflow-hidden position-relative"
          style={{
            height: '175px',
            backgroundColor: '#f1f1f0',
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            data-cv={`projects[${idx}].image`}
            data-cv-image={`projects[${idx}].image`}
            data-edit-key={`projects.${idx}.image`}
            data-node-id={`image:projects:card:${idx}:img:0`}
            data-node-type="image"
            className="project-thumb-img w-100 h-100"
            style={{
              objectFit: 'cover',
            }}
          />
          {/* Category Pill */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
            <span
              className="badge bg-dark text-white text-uppercase"
              data-cv={`projects[${idx}].category`}
              data-edit-key={`projects.${idx}.category`}
              data-node-id={`text:projects:card:${idx}:cat:0`}
              data-node-type="text"
              style={{ borderRadius: '0', fontSize: '0.68rem', letterSpacing: '0.06em', padding: '4px 8px' }}
            >
              {project.category}
            </span>
          </div>

          {project.featured && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
              <span
                className="badge text-dark bg-white border"
                style={{ borderRadius: '0', fontSize: '0.68rem', fontWeight: 700, padding: '4px 8px' }}
              >
                ★ Featured
              </span>
            </div>
          )}
        </div>

        {/* Meta & Title */}
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="text-muted fw-bold" style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
            0{idx + 1}
          </span>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>•</span>
          <span
            className="text-muted fw-semibold text-truncate"
            data-cv={`projects[${idx}].tagline`}
            data-edit-key={`projects.${idx}.tagline`}
            data-node-id={`text:projects:card:${idx}:tagline:0`}
            data-node-type="text"
            style={{ fontSize: '0.78rem' }}
          >
            {project.tagline}
          </span>
        </div>

        <h3
          className="fs-5 fw-bold text-dark mb-2 project-card-title"
          data-cv={`projects[${idx}].title`}
          data-edit-key={`projects.${idx}.title`}
          data-node-id={`text:projects:card:${idx}:title:0`}
          data-node-type="text"
        >
          {project.title}
        </h3>

        <p
          className="text-muted mb-2"
          data-cv={`projects[${idx}].description`}
          data-edit-key={`projects.${idx}.description`}
          data-node-id={`text:projects:card:${idx}:desc:0`}
          data-node-type="text"
          style={{ fontSize: '0.85rem', lineHeight: 1.55 }}
        >
          {project.description}
        </p>

        {/* Outcome Pill */}
        {project.metrics && (
          <div className="d-inline-flex align-items-center gap-1 px-2 py-1 bg-light border mb-3">
            <span
              className="fw-semibold text-dark text-truncate"
              data-cv={`projects[${idx}].metrics`}
              data-edit-key={`projects.${idx}.metrics`}
              data-node-id={`text:projects:card:${idx}:metrics:0`}
              data-node-type="text"
              style={{ fontSize: '0.75rem' }}
            >
              🚀 {project.metrics}
            </span>
          </div>
        )}

        {/* Tech Badges */}
        {project.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag, tIdx) => (
              <span
                key={tIdx}
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#f8f9fa',
                  color: '#212529',
                  padding: '2px 7px',
                  border: '1px solid #e5e7eb',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  padding: '2px 6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-top d-flex justify-content-between align-items-center">
        <span className="text-dark fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          View Case Study
        </span>
        <span className="text-dark fw-bold fs-6 project-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </div>
  );

  return (
    <section
      id="projects"
      data-cv-section="projects"
      data-node-id="section:projects:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="05"
    >
      <span id="portfolio" style={{ position: 'relative', top: '-80px', visibility: 'hidden' }} />

      {/* Centered Header */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <span
            className="text-muted text-uppercase fw-bold d-block mb-1"
            data-cv="projects.eyebrow"
            data-node-id="text:projects:eyebrow:0"
            style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
          >
            {eyebrow}
          </span>
          <h2
            className="display-1 my-2"
            data-cv="projects.title"
            data-node-id="text:projects:title:0"
          >
            <TextFx text={title} />
          </h2>
          <p
            className="text-muted"
            data-cv="projects.description"
            data-node-id="text:projects:description:0"
            style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Automatic Left-to-Right Carousel Slider */}
      <div
        className="projects-carousel-container position-relative"
        data-cv-collection="projects"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden" style={{ margin: '0 -8px' }}>
          <div
            className="d-flex"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
            }}
          >
            {allProjects.map((project, idx) => (
              <div
                key={project.id || idx}
                className="px-2 d-flex flex-column"
                style={{
                  flex: `0 0 ${100 / itemsPerView}%`,
                  maxWidth: `${100 / itemsPerView}%`,
                  minWidth: `${100 / itemsPerView}%`,
                  boxSizing: 'border-box',
                }}
              >
                {renderCard(project, idx)}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Controls & Dots */}
        {maxIndex > 0 && (
          <div className="d-flex align-items-center justify-content-between mt-4 px-1">
            {/* Pagination Dots */}
            <div className="d-flex gap-2 align-items-center">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className="border-0 p-0"
                  style={{
                    width: currentIndex === dotIdx ? '28px' : '8px',
                    height: '8px',
                    backgroundColor: currentIndex === dotIdx ? 'var(--bs-primary, #ff534a)' : '#dee2e6',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="btn btn-outline-dark d-flex align-items-center justify-content-center p-0"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '0',
                  borderWidth: '1px',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                }}
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="btn btn-dark d-flex align-items-center justify-content-center p-0 text-white"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '0',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
