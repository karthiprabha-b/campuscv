'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import {
  Sparkles,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Twitter,
  ChevronDown,
  Terminal,
  Code2,
  ExternalLink
} from 'lucide-react';

const DEFAULT_PROFILE = {
  name: "Alex Sterling",
  nickname: "alex",
  title: "Senior Full-Stack & Cloud Engineer",
  roles: [
    "Full-Stack Architect",
    "Next.js & React Specialist",
    "Cloud & Distributed Systems Engineer",
    "AI & GenAI Solutions Builder"
  ],
  availability: "Available for Q4 Opportunities & Freelance",
  statusText: "Building next-gen digital experiences",
  email: "alex.sterling.dev@example.com",
  location: "San Francisco, CA (Open to Remote)",
  yearsOfExperience: 6,
  projectsCompleted: 42,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  bio: "Passionate engineer dedicated to crafting fluid, high-performance web and cloud architectures. I bridge the gap between design aesthetic precision and scalable backend infrastructure.",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

interface HeroCardProps {
  data?: any;
  cardNumber?: number;
  totalCards?: number;
  onScrollToNext?: () => void;
  onScrollToProjects?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = React.memo(({
  data,
  cardNumber = 1,
  totalCards = 8,
  onScrollToNext,
  onScrollToProjects
}) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const profile = data?.profile || data?.hero || data || {};
  const { accentClass } = useTheme();

  // Comprehensive CampusCV field extraction with contentOverrides support
  const name =
    contentOverrides['text:hero:root:h1:name']?.value ||
    contentOverrides['text:hero:name']?.value ||
    data?.name ||
    data?.fullName ||
    profile?.name ||
    data?.basics?.name ||
    DEFAULT_PROFILE.name;

  const nickname =
    profile?.nickname ||
    profile?.username ||
    data?.username ||
    (name ? String(name).split(' ')[0]?.toLowerCase() : DEFAULT_PROFILE.nickname);

  const bio =
    contentOverrides['text:hero:root:p:lead']?.value ||
    contentOverrides['text:hero:root:p:bio']?.value ||
    contentOverrides['text:hero:bio']?.value ||
    data?.hero?.introductionText ||
    data?.hero?.description ||
    data?.introductionText ||
    data?.bio ||
    data?.aboutMe ||
    data?.summary ||
    data?.description ||
    profile?.bio ||
    profile?.summary ||
    DEFAULT_PROFILE.bio;
  
  // Resolve Avatar Image URL across CampusCV fields & live editor overrides
  const rawOverride =
    contentOverrides['image:hero:root:img:0']?.src ||
    (typeof contentOverrides['image:hero:root:img:0'] === 'string' ? contentOverrides['image:hero:root:img:0'] : null) ||
    contentOverrides['image:about:root:img:0']?.src ||
    (typeof contentOverrides['image:about:root:img:0'] === 'string' ? contentOverrides['image:about:root:img:0'] : null) ||
    data?.imageOverrides?.['image:hero:root:img:0'] ||
    data?.imageOverrides?.['image:about:root:img:0'] ||
    data?.imageOverrides?.['hero.avatarUrl'] ||
    data?.imageOverrides?.['hero.avatar'] ||
    data?.imageOverrides?.['hero.image'];
  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value) : rawOverride;
  const cleanExplicitAvatar = typeof explicitAvatar === 'string' && explicitAvatar.trim().length > 0 ? explicitAvatar.trim() : null;

  const avatar =
    cleanExplicitAvatar ||
    (typeof data?.profileImage === 'string' && data.profileImage.trim().length > 0 ? data.profileImage.trim() : null) ||
    (typeof data?.avatarUrl === 'string' && data.avatarUrl.trim().length > 0 ? data.avatarUrl.trim() : null) ||
    (typeof data?.avatar === 'string' && data.avatar.trim().length > 0 ? data.avatar.trim() : null) ||
    (typeof data?.photo === 'string' && data.photo.trim().length > 0 ? data.photo.trim() : null) ||
    (typeof data?.image === 'string' && data.image.trim().length > 0 ? data.image.trim() : null) ||
    (typeof profile?.avatar === 'string' && profile.avatar.trim().length > 0 ? profile.avatar.trim() : null) ||
    (typeof profile?.image === 'string' && profile.image.trim().length > 0 ? profile.image.trim() : null) ||
    (typeof profile?.profileImage === 'string' && profile.profileImage.trim().length > 0 ? profile.profileImage.trim() : null) ||
    (typeof data?.basics?.image === 'string' && data.basics.image.trim().length > 0 ? data.basics.image.trim() : null) ||
    (typeof data?.basics?.avatar === 'string' && data.basics.avatar.trim().length > 0 ? data.basics.avatar.trim() : null) ||
    DEFAULT_PROFILE.avatar;

  const location =
    contentOverrides['text:hero:root:span:location']?.value ||
    profile?.location ||
    data?.location ||
    data?.basics?.location?.city ||
    (data?.basics?.location ? `${data.basics.location.city || ''}, ${data.basics.location.countryCode || ''}` : '') ||
    DEFAULT_PROFILE.location;

  const yearsOfExperience = profile?.yearsOfExperience || profile?.experienceYears || data?.yearsOfExperience || DEFAULT_PROFILE.yearsOfExperience;
  const projectsCompleted = profile?.projectsCompleted || profile?.projectCount || data?.projectsCompleted || (Array.isArray(data?.projects) ? data.projects.length : DEFAULT_PROFILE.projectsCompleted);

  // Directly bind title / role
  const title =
    contentOverrides['text:hero:root:p:role']?.value ||
    contentOverrides['text:hero:role']?.value ||
    data?.hero?.subtitle ||
    data?.hero?.title ||
    data?.title ||
    data?.role ||
    data?.headline ||
    profile?.title ||
    profile?.role ||
    data?.basics?.label ||
    data?.tagline ||
    DEFAULT_PROFILE.title;

  const socials = profile?.socials || data?.socialLinks || DEFAULT_PROFILE.socials;
  const github = socials?.github || data?.github || "https://github.com";
  const linkedin = socials?.linkedin || data?.linkedin || "https://linkedin.com";
  const twitter = socials?.twitter || data?.twitter || "https://twitter.com";

  return (
    <div 
      data-section="hero" 
      data-cv-section="hero" 
      className="relative w-full h-full p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:hero:root:section:0']}
    >
      {/* Background Decorative Glows */}
      <div 
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`} 
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />
      <div 
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" 
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10">
          <Terminal className="w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          <span 
            data-node-id="text:hero:root:span:badge_status"
            data-node-type="text"
            data-cv="hero.availability"
            className="text-xs font-mono text-zinc-300 cursor-text"
          >
            portfolio.init(2025)
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2.5">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="button:hero:root:a:github"
              data-node-type="button"
              data-cv="socials.github"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 pointer-events-none" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="button:hero:root:a:linkedin"
              data-node-type="button"
              data-cv="socials.linkedin"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 pointer-events-none" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="button:hero:root:a:twitter"
              data-node-type="button"
              data-cv="socials.twitter"
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 pointer-events-none" />
            </a>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
        {/* Left Column: Story & CTAs */}
        <div className="lg:col-span-8 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base font-mono text-zinc-400">
              <span 
                data-node-id="text:hero:root:span:greeting"
                data-node-type="text"
                data-cv="hero.greeting"
                className="cursor-text"
              >
                Hello, World! I&apos;m
              </span>
              <span 
                data-node-id="text:hero:root:span:nickname"
                data-node-type="text"
                data-cv="profile.nickname"
                className={`font-semibold ${accentClass.text} cursor-text`}
              >
                @{nickname}
              </span>
            </div>

            <h1 
              data-node-id="text:hero:root:h1:name"
              data-node-type="text"
              data-cv="profile.name" 
              data-edit-key="hero.name"
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight cursor-text"
            >
              {name}
            </h1>

            {/* Hero Role & Headline */}
            <p 
              data-node-id="text:hero:root:p:role"
              data-node-type="text"
              data-cv="profile.headline" 
              data-edit-key="hero.role"
              className="flex items-center gap-2 text-lg sm:text-2xl md:text-3xl font-bold text-zinc-300 min-h-[38px] cursor-text"
            >
              <span className="text-zinc-500 font-mono select-none pointer-events-none">&gt;</span>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {title}
              </span>
              <span className="inline-block w-0.5 h-5 sm:h-7 bg-emerald-400 animate-pulse pointer-events-none" />
            </p>
          </div>

          <p 
            data-node-id="text:hero:root:p:bio"
            data-node-type="text"
            data-cv="hero.description" 
            data-edit-key="hero.bio"
            className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl cursor-text"
          >
            {bio}
          </p>

          {/* Quick Metrics row */}
          <div className="grid grid-cols-3 gap-3 max-w-lg pt-1">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div 
                data-node-id="text:hero:root:div:years_val"
                data-node-type="text"
                data-cv="profile.yearsOfExperience"
                className="text-xl sm:text-2xl font-bold text-white font-mono cursor-text"
              >
                {yearsOfExperience}+
              </div>
              <div 
                data-node-id="text:hero:root:div:years_lbl"
                data-node-type="text"
                data-cv="hero.stats[0].label"
                className="text-[11px] text-zinc-400 font-medium cursor-text"
              >
                Years Exp
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div 
                data-node-id="text:hero:root:div:projects_val"
                data-node-type="text"
                data-cv="profile.projectsCompleted"
                className="text-xl sm:text-2xl font-bold text-white font-mono cursor-text"
              >
                {projectsCompleted}+
              </div>
              <div 
                data-node-id="text:hero:root:div:projects_lbl"
                data-node-type="text"
                data-cv="hero.stats[1].label"
                className="text-[11px] text-zinc-400 font-medium cursor-text"
              >
                Projects Shipped
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div 
                data-node-id="text:hero:root:div:csat_val"
                data-node-type="text"
                data-cv="hero.stats[2].value"
                className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono cursor-text"
              >
                99.8%
              </div>
              <div 
                data-node-id="text:hero:root:div:csat_lbl"
                data-node-type="text"
                data-cv="hero.stats[2].label"
                className="text-[11px] text-zinc-400 font-medium cursor-text"
              >
                Client CSAT
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onScrollToProjects}
              data-node-id="button:hero:root:btn:projects"
              data-node-type="button"
              data-cv="hero.ctaText"
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r ${accentClass.gradient} shadow-xl shadow-black/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer`}
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Right Column: Visual Tech Card Showcase */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] rounded-3xl p-1 bg-gradient-to-br from-white/20 via-white/5 to-white/10 shadow-2xl">
            <div className="relative w-full rounded-[22px] bg-zinc-950/90 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-5 text-center border border-white/10">
              {/* Center Accent Glow */}
              <div 
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${accentClass.bg} opacity-25 blur-3xl pointer-events-none`} 
                style={{ transform: 'translate3d(0,0,0)' }}
              />

              {/* Much Larger Hero Avatar Image */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl bg-zinc-900 group">
                <img
                  src={avatar}
                  alt={name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.hasFallback) {
                      target.dataset.hasFallback = 'true';
                      target.src = DEFAULT_PROFILE.avatar;
                    }
                  }}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  loading="eager"
                  data-node-id="image:hero:root:img:0"
                  data-node-type="image"
                  data-cv="profile.photo"
                  data-cv-image="hero.avatar"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-2xl sm:rounded-3xl" />
                <div 
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/90 border border-white/20 text-[10px] font-mono text-emerald-400 pointer-events-none select-none"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Available</span>
                </div>
              </div>

              <div 
                data-node-id="text:hero:root:div:name_badge"
                data-node-type="text"
                data-cv="profile.name"
                className="mt-3.5 font-bold text-base sm:text-lg text-white cursor-text"
              >
                {name}
              </div>
              {location && (
                <div 
                  data-node-id="text:hero:root:span:location"
                  data-node-type="text"
                  data-cv="profile.location"
                  className="text-xs text-zinc-400 font-mono mt-0.5 cursor-text"
                >
                  {location}
                </div>
              )}

              <div className="mt-3 flex flex-wrap justify-center gap-1.5" data-cv-collection="skills">
                {(Array.isArray(data?.skills) && data.skills.length > 0
                  ? data.skills.map((s: any) => typeof s === 'string' ? s : (s?.name || s?.title || String(s))).slice(0, 5)
                  : (Array.isArray(data?.techStack) ? data.techStack.slice(0, 5) : ['Next.js', 'TypeScript', 'AWS', 'Go', 'AI/LLM'])
                ).map((tech: string, tIdx: number) => (
                  <span
                    key={tech}
                    data-node-id={`text:hero:tech:${tIdx}`}
                    data-node-type="text"
                    data-cv={`skills[${tIdx}]`}
                    data-cv-item="skill"
                    data-cv-index={tIdx}
                    className="px-2.5 py-0.5 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-mono text-zinc-300 cursor-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slide Trigger */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onScrollToNext}
          className="group flex flex-col items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          aria-label="Slide to next card"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider group-hover:text-zinc-300">Slide to About Card</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-white" />
        </button>
      </div>
    </div>
  );
});

HeroCard.displayName = 'HeroCard';
