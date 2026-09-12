"use client";

import React, { useEffect } from "react";
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
  const data: NormalizedPortfolioData = normalizeData(rawPropsData);

  const isSectionVisible = (sectionName: string): boolean => {
    const key = String(sectionName).toLowerCase();
    if (data?.deletedNodes?.[`section:${key}:root:section:0`] === true || data?.deletedNodes?.[key] === true) {
      return false;
    }
    if (data?.hiddenNodes?.[`section:${key}:root:section:0`] === true || data?.hiddenNodes?.[key] === true) {
      return false;
    }
    if (Array.isArray(data?.hiddenFields) && (data.hiddenFields.includes(`sections.${key}`) || data.hiddenFields.includes(key))) {
      return false;
    }

    if (data[`${key}.visible`] !== undefined) return Boolean(data[`${key}.visible`]);
    if (data[`${sectionName}.visible`] !== undefined) return Boolean(data[`${sectionName}.visible`]);
    if (data[`${key}Visible`] !== undefined) return Boolean(data[`${key}Visible`]);
    if (data[`${sectionName}Visible`] !== undefined) return Boolean(data[`${sectionName}Visible`]);
    if (data[key] && typeof data[key] === "object" && data[key].visible !== undefined) {
      return Boolean(data[key].visible);
    }
    return true;
  };

  const primaryAccent = data.theme?.primaryColor || data.accentColor || data.themeColor || "";
  const dynamicStyles: React.CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    backgroundColor: "#FAF9F6",
    color: "#111111",
    ...(primaryAccent
      ? ({
          "--brand-yellow": primaryAccent,
          "--primary": primaryAccent,
          "--campuscv-accent": primaryAccent,
          "--cv-accent": primaryAccent,
        } as any)
      : {})
  };

  return (
    <div
      className="portfolio-root light min-h-screen bg-[#FAF9F6] text-[#111111] font-sans antialiased relative overflow-hidden"
      data-theme="light"
      data-campuscv-template="stu-creative-bold"
      style={dynamicStyles}
    >
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />

      <BackgroundDecor />

      <Navbar data={data} navLinks={data.navLinks} name={data.name} />

      <main className="relative z-10">
        {/* 1. Hero Section */}
        {isSectionVisible("hero") && <Hero data={data} hero={data.hero} />}

        {/* 2. About Section */}
        {isSectionVisible("about") && <About data={data} about={data.about} />}

        {/* 3. My Approach (Workflow) Section */}
        {isSectionVisible("approach") && <Approach data={data} approachSteps={data.approachSteps} />}

        {/* 4. Education History Section */}
        {isSectionVisible("education") && <Education data={data} education={data.education} />}

        {/* 5. Skills & Proficiency Section */}
        {isSectionVisible("skills") && <Skills data={data} skills={data.skills} />}

        {/* 6. Certifications Section */}
        {isSectionVisible("certifications") && <Certifications data={data} certifications={data.certifications} />}

        {/* 7. Featured Projects Section */}
        {isSectionVisible("projects") && <Projects data={data} projects={data.projects} />}

        {/* 8. Career Work Experience Section */}
        {isSectionVisible("experience") && <Experience data={data} experiences={data.experiences} />}

        {/* 9. Testimonials Section */}
        {isSectionVisible("testimonials") && (
          <section
            id="testimonials"
            data-section="testimonials"
            data-node-id="section:testimonials:root:section:0"
            className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#111111]/[0.02]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col mb-16 items-center text-center space-y-3">
                <span
                  data-field="testimonials.subtitle"
                  className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
                >
                  Feedback
                </span>
                <h2
                  data-field="testimonials.title"
                  data-node-id="text:testimonials:root:h2:0"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
                >
                  WHAT PEOPLE SAY
                </h2>
                <div className="w-12 h-1 bg-[#FFC107] mt-2" />
              </div>
              <TestimonialCarousel data={data} testimonials={data.testimonials} />
            </div>
          </section>
        )}

        {/* 10. Achievements / Awards Section */}
        {isSectionVisible("achievements") && <Achievements data={data} achievements={data.achievements} />}

        {/* 11. Contact Section */}
        {isSectionVisible("contact") && <Contact data={data} contact={data.contact} />}
      </main>

      <Footer data={data} contact={data.contact} navLinks={data.navLinks} name={data.name} />

      <ScrollToTop />
    </div>
  );
}

export { Template as Portfolio };

