"use client";

import React from "react";
import { ArrowDownRight, ArrowDown, MessageSquare, FileText } from "lucide-react";
import { HeroData } from "@/data/portfolio";

interface HeroProps {
  data?: any;
  hero?: Partial<HeroData> & { avatarUrl?: string; [key: string]: any };
}

export default function Hero(props: HeroProps = {}) {
  const incoming = props.hero || props.data?.hero || props.data || {};
  const rawName = incoming.name || props.data?.name || props.data?.fullName || "Portfolio";

  const secondaryText =
    incoming.secondaryCtaText ||
    props.data?.secondaryCtaText ||
    incoming.secondaryButtonText ||
    props.data?.secondaryButtonText ||
    (props.data?.resumeUrl || incoming.resumeUrl ? "DOWNLOAD RESUME" : "GET IN TOUCH");

  const secondaryHref =
    incoming.secondaryCtaHref ||
    props.data?.secondaryCtaHref ||
    incoming.secondaryButtonHref ||
    props.data?.secondaryButtonHref ||
    props.data?.resumeUrl ||
    incoming.resumeUrl ||
    "#contact";

  const hero: HeroData & { avatarUrl?: string } = {
    greeting: incoming.greeting || props.data?.greeting || "HEY, I'M",
    name: rawName,
    title: incoming.title || props.data?.title || "SOFTWARE DEVELOPER",
    highlightedTitle: incoming.highlightedTitle || props.data?.highlightedTitle || "",
    description: incoming.description || incoming.intro || incoming.introductionText || props.data?.profile?.summary || props.data?.bio || props.data?.summary || "Builder-focused Developer with hands-on technical skills.",
    primaryCtaText: incoming.primaryCtaText || props.data?.primaryCtaText || "VIEW MY WORK",
    primaryCtaHref: incoming.primaryCtaHref || props.data?.primaryCtaHref || "#projects",
    secondaryCtaText: secondaryText,
    secondaryCtaHref: secondaryHref,
    avatarUrl: incoming.avatarUrl || props.data?.avatarUrl || props.data?.profile?.photo || props.data?.profileImage || props.data?.avatar || "/profile.png"
  };

  return (
    <section
      id="home"
      data-section="hero"
      data-node-id="section:hero:root:section:0"
      className="relative min-h-[90vh] pt-28 pb-16 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side: Bold Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <span
            data-field="hero.greeting"
            data-node-id="text:hero:root:span:greeting"
            className="text-xs sm:text-sm font-black tracking-widest text-[#111111]/70 uppercase"
          >
            {hero.greeting}
          </span>

          <h1
            data-field="hero.name"
            data-cv="profile.name"
            data-node-id="text:hero:root:h1:0"
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wide leading-tight text-[#111111] uppercase max-w-2xl break-words"
            style={{ wordBreak: 'break-word' }}
          >
            {hero.name}
          </h1>

          <div className="inline-flex">
            <span
              data-field="hero.title"
              data-cv="profile.headline"
              data-node-id="text:hero:root:span:title"
              className="bg-[#FFC107] text-[#111111] text-xs sm:text-sm font-black tracking-wider uppercase px-4 py-2 shadow-xs rounded-xs font-bold"
            >
              {hero.title} {hero.highlightedTitle}
            </span>
          </div>

          <p
            data-field="hero.description"
            data-cv="profile.bio"
            data-node-id="text:hero:root:p:desc"
            className="text-sm sm:text-base leading-relaxed text-[#666666] max-w-xl font-normal"
          >
            {hero.description}
          </p>

          {/* Action Buttons with Zero Layout Thrash / Zero Flicker */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href={hero.primaryCtaHref || "#projects"}
              data-field="hero.primaryCtaText"
              data-field-href="hero.primaryCtaHref"
              data-cv="hero.primaryCta"
              data-node-id="button:hero:root:a:primary_cta"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#111111] text-[#FAF9F6] text-xs sm:text-sm font-black tracking-widest uppercase border-2 border-[#111111] hover:bg-[#FFC107] hover:border-[#FFC107] hover:text-[#111111] transition-colors duration-150 shadow-sm rounded-xs cursor-pointer select-none"
            >
              {hero.primaryCtaText || "VIEW MY WORK"}
              <ArrowDownRight className="w-4 h-4 ml-2 stroke-[3]" />
            </a>

            <a
              href={hero.secondaryCtaHref || "#contact"}
              data-field="hero.secondaryCtaText"
              data-field-href="hero.secondaryCtaHref"
              data-cv="hero.secondaryCta"
              data-node-id="button:hero:root:a:secondary_cta"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#111111] text-[#111111] text-xs sm:text-sm font-black tracking-widest uppercase hover:bg-[#111111] hover:text-[#FAF9F6] transition-colors duration-150 rounded-xs cursor-pointer select-none"
            >
              {hero.secondaryCtaText || "GET IN TOUCH"}
              {hero.secondaryCtaText?.toLowerCase().includes("resume") ? (
                <FileText className="w-4 h-4 ml-2 stroke-[2.5]" />
              ) : (
                <MessageSquare className="w-4 h-4 ml-2 stroke-[2.5]" />
              )}
            </a>
          </div>
        </div>

        {/* Right Side: Crisp High-Resolution Layered Ring Layout (No Flickering Animations) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative py-12 lg:py-0 select-none">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            
            {/* Crisp Golden Layered Ring (Static, Crisp, Anti-Aliased) */}
            <div className="absolute -inset-3 rounded-full border-2 border-[#FFC107] pointer-events-none opacity-90" />
            <div className="absolute -inset-1 rounded-full border border-[#111111]/15 pointer-events-none" />

            {/* Back Shadow Offset Circle */}
            <div className="absolute top-3 left-3 w-full h-full rounded-full bg-[#111111]/5 border border-[#111111]/10 pointer-events-none" />

            {/* Floating Star Vector (Static Crisp Accent) */}
            <div className="absolute -top-3 left-4 text-[#FFC107] w-8 h-8 stroke-[2] pointer-events-none drop-shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FFC107">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            </div>

            {/* Floating Mini Dot Matrix Accent */}
            <div className="absolute -right-2 top-8 w-16 h-16 opacity-30 pointer-events-none">
              <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hero-dots-static" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#111111" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-dots-static)" />
              </svg>
            </div>

            {/* Main Picture Frame */}
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#111111] bg-white shadow-xl">
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                data-field="hero.avatarUrl"
                data-cv="profile.avatarUrl"
                data-node-id="image:hero:root:img:0"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none select-none">
        <a
          href="#about"
          className="flex flex-col items-center text-[10px] sm:text-xs font-black tracking-widest text-[#111111]/50 uppercase pointer-events-auto hover:text-[#FFC107] transition-colors"
        >
          <span>SCROLL</span>
          <ArrowDown className="w-4 h-4 mt-1" />
        </a>
      </div>
    </section>
  );
}

