"use client";

import React from "react";
import { Download, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { heroData as fallbackHeroData } from "@/data/portfolio";

interface ResumeCTAProps {
  data?: any;
  hero?: any;
}

export default function ResumeCTA(props: ResumeCTAProps = {}) {
  const resumeHref = props.hero?.secondaryCtaHref || props.data?.hero?.secondaryCtaHref || props.data?.resumeUrl || fallbackHeroData.secondaryCtaHref;

  return (
    <section
      id="resume-cta"
      data-section="resume-cta"
      className="py-16 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-brand-yellow rounded-md p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden group"
        >
          {/* Decorative Background shapes */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none select-none">
            <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="#000" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-dots)" />
            </svg>
          </div>

          <div className="space-y-3 relative z-10 text-center md:text-left">
            <span className="text-[10px] font-black text-brand-dark/70 tracking-widest uppercase">
              Collab opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-brand-dark">
              INTERESTED IN MY WORK?
            </h2>
            <p className="text-sm font-semibold text-brand-dark/90 max-w-lg leading-relaxed">
              {"Let's create something exceptional together! Download my resume to review my full skill credentials or shoot me a direct message."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10 shrink-0">
            {/* Resume button */}
            <a
              href={resumeHref}
              download
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-dark text-brand-cream text-xs font-black tracking-widest uppercase border-2 border-brand-dark hover:bg-transparent hover:text-brand-dark transition-all duration-300 shadow-md rounded-sm"
            >
              <Download className="w-4 h-4 mr-2 stroke-[3]" />
              DOWNLOAD RESUME
            </a>

            {/* Contact button */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-dark text-brand-dark text-xs font-black tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-all duration-300 rounded-sm bg-transparent"
            >
              <MessageSquare className="w-4 h-4 mr-2 stroke-[3]" />
              CONTACT ME
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
