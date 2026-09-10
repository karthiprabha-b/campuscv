'use client';

import React from 'react';
import { useTheme } from '../ThemeContext';
import {
  User,
  Zap,
  Shield,
  Heart,
  Globe,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_ABOUT = {
  story: "Passionate software engineer dedicated to crafting fluid, high-performance web and cloud architectures. I bridge the gap between design aesthetic precision and scalable backend infrastructure.",
  location: "San Francisco, CA (Open to Remote)",
  coffeeCups: "2.4k",
  coreValues: [
    { title: "Speed & Fluidity", desc: "60fps interactions, sub-100ms response times, zero visual clutter." },
    { title: "Resilient Architecture", desc: "Fault-tolerant, auto-scaling, and clean modular codebases." },
    { title: "Empathetic Design", desc: "Software crafted to delight users and solve genuine business needs." }
  ],
  hobbies: [
    { name: "Open Source Contributor" },
    { name: "System Architecture" },
    { name: "Continuous Learning" },
    { name: "Tech Innovation" }
  ]
};

interface AboutCardProps {
  data?: any;
  cardNumber?: number;
  totalCards?: number;
}

export const AboutCard: React.FC<AboutCardProps> = React.memo(({
  data,
  cardNumber = 2,
  totalCards = 8
}) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const profile = data?.profile || data?.about || data || {};
  const { accentClass } = useTheme();

  // Section title should be About & Philosophy unless explicitly overridden in text editor
  const title =
    contentOverrides['text:about:root:div:title']?.value ||
    contentOverrides['text:about:title']?.value ||
    'About & Philosophy';

  const story =
    contentOverrides['text:about:root:p:lead']?.value ||
    contentOverrides['text:about:root:p:story']?.value ||
    contentOverrides['text:about:story']?.value ||
    contentOverrides['text:about:description']?.value ||
    data?.about?.bio ||
    data?.about?.story ||
    data?.about?.description ||
    data?.about?.text ||
    data?.aboutMe ||
    data?.bio ||
    data?.summary ||
    data?.description ||
    profile?.story ||
    profile?.bio ||
    profile?.summary ||
    DEFAULT_ABOUT.story;

  const location =
    contentOverrides['text:about:root:span:location']?.value ||
    profile?.location ||
    data?.location ||
    data?.basics?.location?.city ||
    (data?.basics?.location ? `${data.basics.location.city || ''}, ${data.basics.location.countryCode || ''}` : '') ||
    DEFAULT_ABOUT.location;

  const coffeeCups =
    contentOverrides['text:about:root:span:coffee']?.value ||
    profile?.coffeeCups ||
    data?.coffeeCups ||
    DEFAULT_ABOUT.coffeeCups;

  // Primary Domain: concise role (never an entire 150-character resume summary)
  let rawDomain =
    contentOverrides['text:about:root:span:domain']?.value ||
    data?.domain ||
    data?.role ||
    data?.basics?.label ||
    data?.hero?.subtitle ||
    data?.headline ||
    profile?.role ||
    profile?.headline ||
    "Professional";

  if (typeof rawDomain === 'string' && rawDomain.length > 50) {
    rawDomain = rawDomain.split(/[,•|&]/)[0].trim() || "Professional";
  }
  const primaryDomain = rawDomain;

  const extractSkillName = (s: any): string => {
    if (!s) return '';
    if (typeof s === 'string') return s.trim();
    if (typeof s === 'object') {
      return s.name || s.title || s.skill || s.label || s.value || '';
    }
    return String(s);
  };

  const rawSkillsList = Array.isArray(data?.skills) && data.skills.length > 0
    ? data.skills
    : (Array.isArray(data?.techStack) ? data.techStack : (Array.isArray(profile?.skills) ? profile.skills : []));

  const rawCoreStackOverride = contentOverrides['text:about:root:span:core_stack']?.value;
  const validCoreStack = typeof rawCoreStackOverride === 'string' && !rawCoreStackOverride.includes('[object Object]') ? rawCoreStackOverride : null;

  const coreStackString = (
    validCoreStack ||
    (rawSkillsList.length > 0
      ? rawSkillsList.map(extractSkillName).filter(Boolean).slice(0, 4).join(' · ')
      : 'Engineering · Strategy · Problem Solving')
  );

  let rawStatus =
    contentOverrides['text:about:root:span:status']?.value ||
    data?.availability ||
    data?.personal?.availability ||
    profile?.statusText ||
    profile?.availability ||
    "Available for Opportunities";
  if (typeof rawStatus === 'string' && rawStatus.length > 45) {
    rawStatus = "Available for Opportunities";
  }
  const statusText = rawStatus;

  // Core values or highlights - dynamically bound from AI engine principles & coreValues
  const rawCoreValues = data?.principles || data?.coreValues || data?.about?.principles || data?.about?.coreValues || profile?.coreValues || profile?.principles;
  let coreValues = DEFAULT_ABOUT.coreValues;
  if (Array.isArray(rawCoreValues) && rawCoreValues.length > 0) {
    const valid = rawCoreValues.filter((v: any) => {
      const s = typeof v === 'string' ? v : (v?.title || v?.name || v?.label || '');
      return s && s.length < 50;
    });
    if (valid.length > 0) {
      coreValues = valid.map((v: any, idx: number) => {
        if (typeof v === 'string') {
          return { title: `Principle 0${idx + 1}`, desc: v };
        }
        return { 
          title: v.title || v.name || v.label || `Principle 0${idx + 1}`, 
          desc: v.desc || v.description || v.text || v.value || '' 
        };
      });
    }
  }

  const rawHobbies = data?.interests || data?.hobbies || data?.about?.hobbies || profile?.hobbies;
  let hobbies = DEFAULT_ABOUT.hobbies;
  if (Array.isArray(rawHobbies) && rawHobbies.length > 0) {
    const validH = rawHobbies.filter((h: any) => {
      const s = typeof h === 'string' ? h : (h?.name || h?.title || '');
      return s && s.length < 40;
    });
    if (validH.length > 0) {
      hobbies = validH.map((h: any) => typeof h === 'string' ? { name: h } : { name: h.name || h.title || String(h) });
    }
  }

  return (
    <div 
      data-section="about" 
      data-cv-section="about" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:about:root:section:0']}
    >
      {/* Background Glow */}
      <div 
        className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 0{cardNumber} / 0{totalCards}</div>
            <h2 
              data-node-id="text:about:root:div:title"
              data-node-type="text"
              data-cv="about.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        {location && (
          <div 
            data-node-id="text:about:root:span:location"
            data-node-type="text"
            data-cv="about.location"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 font-mono"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-auto">
        {/* Left Story Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2.5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Engineering Journey</span>
            </h3>
            <p 
              data-node-id="text:about:root:p:lead"
              data-node-type="text"
              data-cv="about.story"
              data-edit-key="about.story"
              className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
            >
              {story}
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-2 pt-1" data-cv="about.coreValues">
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Core Principles I Build By
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {coreValues.map((val: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all duration-200"
                >
                  <div className={`p-1.5 rounded-xl w-fit mb-1.5 ${accentClass.bg}/15 ${accentClass.text}`}>
                    {idx === 0 ? <Zap className="w-3.5 h-3.5" /> : idx === 1 ? <Shield className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                  </div>
                  <div 
                    data-node-id={`text:about:values:title:${idx}`}
                    data-node-type="text"
                    data-cv="about.value.title"
                    className="font-semibold text-xs text-white"
                  >
                    {val.title || val.name}
                  </div>
                  {val.desc && (
                    <div 
                      data-node-id={`text:about:values:desc:${idx}`}
                      data-node-type="text"
                      data-cv="about.value.desc"
                      className="text-[10px] text-zinc-400 mt-0.5 leading-snug"
                    >
                      {val.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Highlights Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Metrics */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>At A Glance</span>
            </h3>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400 pointer-events-none select-none">Primary Domain</span>
                <span 
                  data-node-id="text:about:root:span:domain"
                  data-node-type="text"
                  data-cv="about.domain"
                  className="font-medium text-white truncate max-w-[180px] text-right cursor-text"
                >
                  {primaryDomain}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400 pointer-events-none select-none">Core Stack</span>
                <span 
                  data-node-id="text:about:root:span:core_stack"
                  data-node-type="text"
                  data-cv="skills"
                  className="font-mono text-emerald-400 truncate max-w-[180px] text-right cursor-text"
                >
                  {coreStackString}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400 pointer-events-none select-none">Coffee Consumed</span>
                <span 
                  data-node-id="text:about:root:span:coffee"
                  data-node-type="text"
                  data-cv="about.coffee"
                  className="font-mono text-amber-400 cursor-text"
                >
                  {coffeeCups} Cups
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400 pointer-events-none select-none">Status</span>
                <span 
                  data-node-id="text:about:root:span:status"
                  data-node-type="text"
                  data-cv="about.status"
                  className="text-emerald-300 font-medium truncate max-w-[180px] text-right cursor-text"
                >
                  {statusText}
                </span>
              </div>
            </div>
          </div>

          {/* Passions / Hobbies */}
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2.5" data-cv="about.hobbies">
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 pointer-events-none select-none">
              Beyond The Terminal
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {hobbies.map((hobby: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 pointer-events-none" />
                  <span 
                    data-node-id={`text:about:hobby:${idx}`}
                    data-node-type="text"
                    data-cv="about.hobby"
                    className="truncate cursor-text"
                  >
                    {typeof hobby === 'string' ? hobby : (hobby?.name || hobby?.title || String(hobby))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutCard.displayName = 'AboutCard';
