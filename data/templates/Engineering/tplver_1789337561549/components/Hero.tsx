'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, ArrowRight, Download, Cpu, Layers, Sparkles, Shield } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import FloatingLeaves from './FloatingLeaves';

export default function Hero() {
  const { profile } = PORTFOLIO_DATA;

  const techBadges = [
    { label: 'Kubernetes', tag: 'CKA Certified' },
    { label: 'Go & Rust', tag: 'High-Concurrency' },
    { label: 'Distributed Systems', tag: '1.2M RPS' },
    { label: 'Next.js 14', tag: 'Full-Stack' },
  ];

  return (
    <section id="home" className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 bg-gradient-cyber-hero text-white wave-bottom-curve overflow-hidden shadow-2xl">
      {/* Ambient Floating Depth Spheres */}
      <FloatingLeaves />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyber-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyber-neonCyan/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Eyebrow & Glowing Pill Actions */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            {/* Eyebrow Line Accent */}
            <div className="flex items-center gap-2">
              <span className="w-8 sm:w-10 h-[2px] bg-cyber-brightCyan rounded-full"></span>
              <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-cyber-brightCyan font-mono">
                {profile.availability}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.12]">
              Resilient <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-brightCyan via-cyber-electricPurple to-cyber-neonViolet">
                Distributed Systems
              </span> <br />
              &amp; Cloud Platforms
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-cyber-300 max-w-xl font-sans leading-relaxed">
              {profile.tagline}. Specializing in fault-tolerant event streaming, microservices architectures, and hyper-performant web applications.
            </p>

            {/* Tech Badges Pill Row */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {techBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyber-900/80 border border-cyber-700/70 text-[11px] sm:text-xs text-cyber-200 font-mono shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-brightCyan"></span>
                  <span className="font-bold text-white">{badge.label}</span>
                  <span className="text-[10px] text-cyber-300">({badge.tag})</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
              <Link
                href="#projects"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-cyan-glow hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#contact"
                className="px-5 sm:px-6 py-3 sm:py-4 rounded-full bg-cyber-900/90 hover:bg-cyber-800 border border-cyber-700 text-white font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-cyber-brightCyan" />
                <span>RESUME CV</span>
              </a>
            </div>
          </div>

          {/* Right Column: Stadium / Arch Pill Card Visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            {/* Vertical Arch Pill */}
            <div className="relative w-[260px] sm:w-[340px] md:w-[380px] h-[400px] sm:h-[500px] md:h-[540px] rounded-full overflow-hidden border-4 sm:border-[6px] border-white/20 shadow-deep-float bg-cyber-900 p-2">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                  alt="System Architecture & Cloud Engineering"
                  fill
                  className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                  priority
                />
                
                {/* Midnight Indigo Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/40 to-transparent"></div>

                {/* Overlaid Stadium Card Content */}
                <div className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-6 sm:right-6 text-center text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-brightCyan text-cyber-950 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-cyber-950" />
                    Production Ready
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-2xl text-white">
                    {profile.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-cyber-300 font-mono mt-0.5">
                    {profile.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Highlight Pill Over Arch */}
            <div className="absolute -bottom-3 -left-2 sm:left-4 bg-white text-cyber-950 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-full shadow-deep-float border border-slate-100 flex items-center gap-2.5 sm:gap-3 animate-float-slow">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-cyan-pill flex items-center justify-center font-bold text-cyber-950 shadow-cyan-glow shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-950" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase font-bold">Uptime SLA</p>
                <p className="text-xs sm:text-sm font-black font-display text-cyber-950">99.99% Availability</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
