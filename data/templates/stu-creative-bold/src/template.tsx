"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundDecor from "./components/BackgroundDecor";
import ScrollToTop from "./components/ScrollToTop";
import TestimonialCarousel from "./components/TestimonialCarousel";

// Section imports
import Hero from "./sections/Hero";
import About from "./sections/About";
import Approach from "./sections/Approach";
import Education from "./sections/Education";
import Skills from "./sections/Skills";
import Certifications from "./sections/Certifications";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

import { normalizeData, NormalizedPortfolioData } from "./utils/normalizeData";
import "./styles/index.css";

const CRITICAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');

  :root {
    --brand-yellow: #FFC107;
    --brand-dark: #111111;
    --brand-cream: #FAF9F6;
    --brand-muted: #666666;
    --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-outfit: 'Outfit', sans-serif;
  }

  .portfolio-root {
    background-color: #FAF9F6 !important;
    color: #111111 !important;
    font-family: 'Inter', sans-serif;
  }

  .bg-brand-yellow {
    background-color: #FFC107 !important;
  }

  .text-brand-yellow {
    color: #FFC107 !important;
  }

  .border-brand-yellow {
    border-color: #FFC107 !important;
  }

  .bg-brand-dark {
    background-color: #111111 !important;
    color: #ffffff !important;
  }

  .text-brand-dark {
    color: #111111 !important;
  }

  .border-brand-dark {
    border-color: #111111 !important;
  }

  .text-brand-muted {
    color: #666666 !important;
  }

  .bg-brand-cream {
    background-color: #FAF9F6 !important;
  }

  .text-brand-cream {
    color: #FAF9F6 !important;
  }

  footer.bg-brand-dark {
    background-color: #111111 !important;
    color: #ffffff !important;
  }
`;

export interface TemplateProps {
  data?: any;
  portfolio?: any;
  profile?: any;
  cv?: any;
  resume?: any;
  [key: string]: any;
}

export default function Template(props: TemplateProps = {}) {
  const rawPropsData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || props || {};
  const [liveData, setLiveData] = useState<NormalizedPortfolioData>(() => normalizeData(rawPropsData));

  // Sync state whenever props change from parent CampusCV container
  useEffect(() => {
    const incoming = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || props || {};
    setLiveData(normalizeData(incoming));
  }, [props?.data, props?.portfolio, props?.profile, props?.cv, props?.resume, props]);

  // Real-time listener for CampusCV editor iframe postMessage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const payload = event.data;
        if (!payload || typeof payload !== "object") return;

        if (
          payload.type === "CAMPUSCV_SET_DATA" ||
          payload.type === "SET_PORTFOLIO_DATA" ||
          payload.type === "UPDATE_DATA" ||
          payload.type === "CAMPUSCV_UPDATE_DATA" ||
          payload.type === "campuscv_update"
        ) {
          const incoming = payload.data || payload.portfolio || payload.payload;
          if (incoming && typeof incoming === "object") {
            setLiveData(normalizeData(incoming));
          }
        } else if (payload.type === "UPDATE_FIELD" && payload.field) {
          setLiveData((prev) => {
            const copy: any = { ...prev };
            const parts = payload.field.split(".");
            if (parts.length === 1) {
              copy[parts[0]] = payload.value;
            } else if (parts.length === 2) {
              copy[parts[0]] = { ...copy[parts[0]], [parts[1]]: payload.value };
            }
            return normalizeData(copy);
          });
        }
      } catch (err) {
        console.warn("CampusCV postMessage listener notice:", err);
      }
    };

    window.addEventListener("message", handleMessage);

    // Announce template ready to CampusCV parent frame
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "CAMPUSCV_TEMPLATE_READY", templateId: "stu-creative-bold" }, "*");
      }
    } catch {}

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const data = liveData;

  const isSectionVisible = (sectionName: string): boolean => {
    const aliases: Record<string, string[]> = {
      hero: ["hero", "intro"],
      about: ["about", "bio", "summary"],
      approach: ["approach", "process", "workflow", "steps"],
      education: ["education", "academics", "educationHistory"],
      skills: ["skills", "skillCategories", "tools"],
      certifications: ["certifications", "certificates", "credentials"],
      projects: ["projects", "portfolio", "works"],
      experience: ["experience", "experiences", "workExperience", "timeline", "work"],
      testimonials: ["testimonials", "feedback", "reviews"],
      achievements: ["achievements", "awards", "honors"],
      contact: ["contact", "contactInfo", "socials"]
    };

    const keysToCheck = aliases[sectionName] || [sectionName];

    const deletedNodes = (data as any)?.deletedNodes || {};
    const hiddenNodes = (data as any)?.hiddenNodes || {};
    const hiddenFields = (data as any)?.hiddenFields || [];
    const styleOverrides = (data as any)?.styleOverrides || {};

    for (const key of keysToCheck) {
      if (
        deletedNodes[`section:${key}:root:section:0`] === true ||
        deletedNodes[key] === true ||
        deletedNodes[`section:${key}`] === true
      ) {
        return false;
      }

      if (
        hiddenNodes[`section:${key}:root:section:0`] === true ||
        hiddenNodes[key] === true ||
        hiddenNodes[`section:${key}`] === true
      ) {
        return false;
      }

      if (
        Array.isArray(hiddenFields) &&
        (hiddenFields.includes(`sections.${key}`) || hiddenFields.includes(key) || hiddenFields.includes(`section:${key}`))
      ) {
        return false;
      }

      if (
        styleOverrides[key]?.display === "none" ||
        styleOverrides[`section:${key}:root:section:0`]?.display === "none" ||
        styleOverrides[`section:${key}`]?.display === "none"
      ) {
        return false;
      }

      if (data[`${key}.visible`] === false || data[`${key}.visible`] === 0) return false;
      if (data[`${key}Visible`] === false || data[`${key}Visible`] === 0) return false;
    }

    if (data.sections && typeof data.sections === "object" && !Array.isArray(data.sections)) {
      for (const key of keysToCheck) {
        if (data.sections[key] === false || (typeof data.sections[key] === "object" && data.sections[key]?.visible === false)) {
          return false;
        }
      }
    }

    return true;
  };

  const hasHero = isSectionVisible("hero");
  const hasAbout = isSectionVisible("about") && Boolean(data.about?.description || data.about?.title || data.bio);
  const hasApproach = isSectionVisible("approach") && Array.isArray(data.approachSteps) && data.approachSteps.length > 0;
  const hasEducation = isSectionVisible("education") && Array.isArray(data.education) && data.education.length > 0;
  const hasSkills = isSectionVisible("skills") && Array.isArray(data.skills) && data.skills.length > 0;
  const hasCertifications = isSectionVisible("certifications") && Array.isArray(data.certifications) && data.certifications.length > 0;
  const hasProjects = isSectionVisible("projects") && Array.isArray(data.projects) && data.projects.length > 0;
  const hasExperience = isSectionVisible("experience") && ((Array.isArray(data.experiences) && data.experiences.length > 0) || (Array.isArray(data.experience) && data.experience.length > 0));
  const hasTestimonials = isSectionVisible("testimonials") && Array.isArray(data.testimonials) && data.testimonials.length > 0;
  const hasAchievements = isSectionVisible("achievements") && Array.isArray(data.achievements) && data.achievements.length > 0;
  const hasContact = isSectionVisible("contact");

  // Dynamic Navigation Links matching exact active sections
  const activeNavLinks = [
    { label: "Home", href: "#home", show: hasHero },
    { label: "About", href: "#about", show: hasAbout },
    { label: "Workflow", href: "#approach", show: hasApproach },
    { label: "Education", href: "#education", show: hasEducation },
    { label: "Skills", href: "#skills", show: hasSkills },
    { label: "Certifications", href: "#certifications", show: hasCertifications },
    { label: "Projects", href: "#projects", show: hasProjects },
    { label: "Experience", href: "#experience", show: hasExperience },
    { label: "Testimonials", href: "#testimonials", show: hasTestimonials },
    { label: "Achievements", href: "#achievements", show: hasAchievements },
    { label: "Contact", href: "#contact", show: hasContact }
  ].filter(l => l.show);

  const primaryAccent = data.theme?.primaryColor || data.accentColor || data.themeColor || "";
  const dynamicStyles: React.CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    backgroundColor: "#FAF9F6",
    color: "#111111",
    ...(primaryAccent
      ? {
          "--brand-yellow": primaryAccent,
          "--primary": primaryAccent,
        } as any
      : {})
  };

  return (
    <div
      id="template-root"
      data-template-root="true"
      className="portfolio-root light min-h-screen bg-[#FAF9F6] text-[#111111] font-sans antialiased relative overflow-hidden"
      data-theme="light"
      style={dynamicStyles}
    >
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />

      <BackgroundDecor />

      <Navbar data={data} navLinks={activeNavLinks} name={data.name} />

      <main className="relative z-10">
        {/* 1. Hero Section */}
        {hasHero && <Hero data={data} hero={data.hero} />}

        {/* 2. About Section */}
        {hasAbout && <About data={data} about={data.about} />}

        {/* 3. My Approach (Workflow) Section */}
        {hasApproach && <Approach data={data} approachSteps={data.approachSteps} />}

        {/* 4. Education History Section */}
        {hasEducation && <Education data={data} education={data.education} />}

        {/* 5. Skills & Proficiency Section */}
        {hasSkills && <Skills data={data} skills={data.skills} />}

        {/* 6. Certifications Section */}
        {hasCertifications && <Certifications data={data} certifications={data.certifications} />}

        {/* 7. Featured Projects Section */}
        {hasProjects && <Projects data={data} projects={data.projects} />}

        {/* 8. Career Work Experience Section */}
        {hasExperience && <Experience data={data} experiences={data.experiences} />}

        {/* 9. Testimonials Section */}
        {hasTestimonials && (
          <section
            id="testimonials"
            data-section="testimonials"
            data-cv-section="testimonials"
            className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#111111]/[0.02]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col mb-16 items-center text-center space-y-3">
                <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
                  Feedback
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
                  WHAT PEOPLE SAY
                </h2>
                <div className="w-12 h-1 bg-[#FFC107] mt-2" />
              </div>
              <TestimonialCarousel data={data} testimonials={data.testimonials} />
            </div>
          </section>
        )}

        {/* 10. Achievements / Awards Section */}
        {hasAchievements && <Achievements data={data} achievements={data.achievements} />}

        {/* 11. Contact Section */}
        {hasContact && <Contact data={data} contact={data.contact} />}
      </main>

      <Footer data={data} contact={data.contact} navLinks={activeNavLinks} name={data.name} />

      <ScrollToTop />
    </div>
  );
}

export { Template as Portfolio };
