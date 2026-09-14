import React from 'react';
import { ArrowRight, Terminal, Shield, Cpu, Sparkles } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import FloatingLeaves from './FloatingLeaves';

export default function Hero({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { profile } = norm;

  const techBadges = [
    { name: "Kubernetes", tag: "CKA Certified" },
    { name: "Go & Rust", tag: "High-Concurrency" },
    { name: "Distributed Systems", tag: "1.2M RPS" },
    { name: "Next.js 14", tag: "Full-Stack" }
  ];

  return (
    <section
      id="home"
      data-cv-section="hero"
      data-node-id="section:hero:root:section:0"
      data-node-type="section"
      className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 bg-gradient-cyber-hero text-white wave-bottom-curve overflow-hidden shadow-2xl"
    >
      {/* Dynamic Background Mesh Depth Elements */}
      <FloatingLeaves />

      <div className="absolute top-1/4 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
              <span className="w-8 sm:w-10 h-[2px] bg-[#38bdf8] rounded-full"></span>
              <span
                data-node-id="text:hero:availability:0"
                data-node-type="text"
                data-cv="profile.availability"
                className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#38bdf8] font-mono"
                style={{ color: '#38bdf8' }}
              >
                {profile.availability || 'AVAILABLE FOR SENIOR ROLES & HIGH-IMPACT CONSULTING'}
              </span>
            </div>

            {/* Main Statement Heading */}
            <div className="space-y-3">
              <h1
                data-node-id="text:hero:headline:0"
                data-node-type="text"
                data-cv="profile.headline"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.08] text-white"
              >
                Resilient{' '}
                <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                  &amp; Cloud Platforms
                </span>
              </h1>
            </div>

            {/* Sub-headline Paragraph */}
            <p
              data-node-id="text:hero:tagline:0"
              data-node-type="text"
              data-cv="profile.tagline"
              className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl font-sans leading-relaxed mx-auto lg:mx-0"
            >
              {profile.tagline || 'Specializing in fault-tolerant event streaming, microservices architectures, and hyper-performant web applications.'}
            </p>

            {/* Tech Badges Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {techBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] sm:text-xs text-slate-200 font-mono shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span className="font-semibold text-white">{badge.name}</span>
                  <span className="text-[10px] text-cyan-300">({badge.tag})</span>
                </div>
              ))}
            </div>

            {/* CTA Button Row */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#projects"
                data-node-id="button:hero:cta:projects:0"
                data-node-type="button"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-cyan-pill text-slate-950 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Stadium / Arch Pill Card Visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            {/* Vertical Arch Pill */}
            <div className="relative w-[260px] sm:w-[340px] md:w-[380px] h-[400px] sm:h-[500px] md:h-[540px] rounded-full overflow-hidden border-4 sm:border-[6px] border-white/20 shadow-deep-float bg-[#0f172a] p-2">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                  alt={profile.name || "Systems Architecture & Cloud Engineering"}
                  data-node-id="image:hero:root:img:0"
                  data-node-type="image"
                  data-cv="profile.photo"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />

                {/* Subtle Overlaid Gradient on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/40 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Floating Decorative Glass Micro-Badges */}
            <div 
              className="absolute -bottom-4 -left-4 sm:left-4 bg-[#030712]/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-3.5 sm:p-4 shadow-cyan-glow space-y-1 animate-float-slow hidden sm:block"
              style={{ backgroundColor: 'rgba(3, 7, 18, 0.95)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Expertise</p>
                  <p className="text-xs font-bold text-white font-mono">Systems Architecture</p>
                </div>
              </div>
            </div>

            <div 
              className="absolute -top-4 right-2 sm:right-6 bg-[#030712]/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-3.5 sm:p-4 shadow-violet-glow space-y-1 animate-float-reverse hidden sm:block"
              style={{ backgroundColor: 'rgba(3, 7, 18, 0.95)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Standard</p>
                  <p className="text-xs font-bold text-white font-mono">99.99% Reliability</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
