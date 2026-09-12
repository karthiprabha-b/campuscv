"use client";

import React from "react";
import { Download, MessageSquare } from "lucide-react";
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
      data-node-id="section:resume-cta:root:section:0"
      className="py-16 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-[#FFC107] rounded-md p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden group"
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
            <span className="text-[10px] font-black text-[#111111]/70 tracking-widest uppercase">
              Collab opportunities
            </span>
            <h2
              data-field="resumeCTA.title"
              data-node-id="text:resumeCTA:root:h2:title"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
            >
              INTERESTED IN MY WORK?
            </h2>
            <p
              data-field="resumeCTA.description"
              data-node-id="text:resumeCTA:root:p:desc"
              className="text-sm font-semibold text-[#111111]/90 max-w-lg leading-relaxed"
            >
              {"Let's create something exceptional together! Download my resume to review my full skill credentials or shoot me a direct message."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10 shrink-0">
            {/* Resume button */}
            <a
              href={resumeHref}
              download
              data-field="resumeCTA.primaryButtonText"
              data-node-id="button:resumeCTA:root:a:download"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#111111] text-[#FAF9F6] text-xs font-black tracking-widest uppercase border-2 border-[#111111] hover:bg-white hover:text-[#111111] transition-colors duration-150 shadow-md rounded-sm cursor-pointer select-none"
            >
              <Download className="w-4 h-4 mr-2 stroke-[3]" />
              DOWNLOAD RESUME
            </a>

            {/* Contact button */}
            <a
              href="#contact"
              data-field="resumeCTA.secondaryButtonText"
              data-node-id="button:resumeCTA:root:a:contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#111111] text-[#111111] text-xs font-black tracking-widest uppercase hover:bg-[#111111] hover:text-[#FAF9F6] transition-colors duration-150 rounded-sm bg-transparent cursor-pointer select-none"
            >
              <MessageSquare className="w-4 h-4 mr-2 stroke-[3]" />
              CONTACT ME
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
