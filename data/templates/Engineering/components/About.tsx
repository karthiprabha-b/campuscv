'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Cpu, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import SectionHeader from './SectionHeader';

export default function About() {
  const { profile, about, stats } = PORTFOLIO_DATA;

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="ENGINEER PROFILE"
          title="Meet The Systems Architect"
          subtitle="Combining high-level cloud topologies with obsessive attention to low-level runtime efficiency"
        />

        {/* 3 Staggered Stadium / Arch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-stretch pt-4">
          
          {/* Card 1: Deep Indigo Midnight Stadium Card */}
          <div className="bg-gradient-indigo-card text-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-10 shadow-deep-float flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
            <div className="space-y-5 relative z-10">
              {/* Photo Pill */}
              <div className="relative w-full aspect-[4/3] rounded-[32px] sm:rounded-[40px] overflow-hidden border-2 border-white/20 shadow-md">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyber-brightCyan" />
                  {profile.location}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-brightCyan"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-brightCyan">
                    Background
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                  {profile.name}
                </h3>
                <p className="text-xs sm:text-sm text-cyber-200 mt-2 leading-relaxed font-sans">
                  {about.story}
                </p>
              </div>
            </div>

            {/* Glowing Action Button */}
            <div className="pt-5 mt-5 border-t border-cyber-700/60 relative z-10">
              <Link
                href="#experience"
                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs tracking-wider shadow-cyan-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>CAREER CHRONICLES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Electric Cyan/Violet Gradient Stadium Card */}
          <div className="bg-gradient-cyan-card text-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-10 shadow-cyan-glow flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-2 lg:-translate-y-4">
            <div className="space-y-5 relative z-10">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white text-cyber-950 flex items-center justify-center font-bold shadow-sm">
                <Cpu className="w-5 sm:w-6 h-5 sm:h-6 text-cyber-900" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-white"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Philosophy
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white">
                  Engineering Principles
                </h3>
              </div>

              <div className="space-y-2.5">
                {about.philosophy.map((item, idx) => (
                  <div key={idx} className="p-3 sm:p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      {idx + 1}. {item.title}
                    </h4>
                    <p className="text-xs text-white/90 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-5 mt-5 border-t border-white/20 relative z-10">
              <Link
                href="#skills"
                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-cyber-950 text-white font-bold uppercase text-xs tracking-wider shadow-md flex items-center justify-center gap-2 transition-all hover:bg-cyber-900"
              >
                <span>EXPLORE SKILLS MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Crisp White Stadium Card with Deep Drop Shadow */}
          <div className="bg-white text-slate-900 rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-10 shadow-soft-elevation border border-slate-100 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-2">
            <div className="space-y-5 relative z-10">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-cyber-100 text-cyber-700 flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-cyber-600" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-600"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-600">
                    Benchmarks
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                  Production Impact
                </h3>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-cyber-600 block">
                      {stat.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-700 font-sans block mt-0.5">
                      {stat.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">
                      {stat.sublabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Action Button */}
            <div className="pt-5 mt-5 border-t border-slate-100 relative z-10">
              <Link
                href="#contact"
                className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs tracking-wider shadow-cyan-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>CONNECT WITH ALEX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
