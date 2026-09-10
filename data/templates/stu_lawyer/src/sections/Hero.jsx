import React from 'react';
import { ArrowUpRight, Award, ShieldCheck, Sparkles, Mail, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';

export default function Hero(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.hero || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || "Alexander Vance";
  const title = hero?.title || data?.title || "Senior Legal Counsel & Partner";
  const smallLabel = hero?.smallLabel || data?.smallLabel || "WELCOME TO MY EXECUTIVE PORTFOLIO";
  const headline = hero?.headline || data?.headline || "Strategic Legal Counsel.";
  const highlightText = hero?.highlightText || data?.highlightText || "Committed to Excellence.";
  const intro = hero?.intro || data?.intro || hero?.introductionText || data?.bio || "Providing high-stakes corporate counsel, regulatory compliance strategies, and bespoke legal advisory for fortune leaders, startups, and high-net-worth clients.";
  const summary = hero?.summary || data?.summary || "Over 8+ years of expertise in corporate jurisprudence, cross-border M&A negotiations, commercial litigation defense, and intellectual property protection.";
  const avatarUrl = hero?.avatarUrl || data?.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000";
  const badgeYears = hero?.badgeYears || data?.badgeYears || "8+";
  const badgeLabel = hero?.badgeLabel || data?.badgeLabel || "Years Legal Excellence";
  const badgeSatisfaction = hero?.badgeSatisfaction || data?.badgeSatisfaction || "99.4%";
  const socials = hero?.socials || data?.socials || {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    dribbble: "https://dribbble.com",
  };

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-[#FAF8F4]">
      {/* Background Luxury Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C89B3C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#A67D28]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Headline & Bio */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Small Label Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#C89B3C]/40 bg-[#C89B3C]/5 backdrop-blur-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#A67D28]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
                {smallLabel}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A1A] tracking-tight leading-[1.15] mb-6">
              {headline}{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#A67D28]">
                {highlightText}
              </span>
            </h1>

            {/* Short Intro */}
            <p className="text-base sm:text-lg text-[#6B7280] font-sans font-light leading-relaxed mb-4 max-w-2xl">
              {intro}
            </p>

            {/* Professional Summary */}
            <p className="text-xs sm:text-sm text-gray-600 font-sans italic border-l-2 border-[#C89B3C] pl-4 py-1 mb-8 max-w-2xl">
              "{summary}"
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] text-sm font-bold tracking-widest uppercase shadow-gold-glow hover:brightness-105 transition-all border border-[#C89B3C]"
              >
                <span>View Portfolio</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#C89B3C] text-[#A67D28] hover:bg-[#C89B3C]/10 text-sm font-bold tracking-widest uppercase transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-6 border-t border-[#C89B3C]/20 w-full">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 font-sans">
                Connect:
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'LinkedIn', icon: Linkedin, url: socials?.linkedin },
                  { name: 'GitHub', icon: Github, url: socials?.github },
                  { name: 'Twitter', icon: Twitter, url: socials?.twitter },
                  { name: 'Dribbble', icon: Dribbble, url: socials?.dribbble },
                ].map((soc) => {
                  const Icon = soc.icon;
                  return (
                    <a
                      key={soc.name}
                      href={soc.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 border border-[#C89B3C]/30 text-gray-700 hover:text-[#A67D28] hover:border-[#C89B3C] transition-all duration-300 hover:-translate-y-1 bg-white shadow-sm"
                      aria-label={soc.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Luxury Framed Portrait */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Outer Decorative Gold Frame */}
              <div className="absolute -inset-4 border-2 border-[#C89B3C]/40 pointer-events-none" />
              <div className="absolute -inset-2 border border-[#C89B3C]/20 pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden border-2 border-[#C89B3C]/60 shadow-2xl bg-[#111827]">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover object-center filter grayscale-[15%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Caption overlay at bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md border border-[#C89B3C]/30">
                  <p className="font-serif text-lg font-bold text-white">{name}</p>
                  <p className="text-xs text-[#D5B350] font-sans tracking-wide uppercase">{title}</p>
                </div>
              </div>

              {/* Floating Badge 1 - Top Right */}
              <div className="absolute -top-6 -right-6 bg-white p-4 border border-[#C89B3C]/50 shadow-gold-glow hidden sm:flex items-center gap-3 z-20">
                <div className="p-2.5 bg-[#C89B3C]/10 text-[#A67D28]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-xl font-bold text-[#1A1A1A]">
                    {badgeYears}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-sans">
                    {badgeLabel}
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 - Bottom Left */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 border border-[#C89B3C]/50 shadow-gold-glow hidden sm:flex items-center gap-3 z-20">
                <div className="p-2.5 bg-[#C89B3C]/10 text-[#A67D28]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-xl font-bold text-[#1A1A1A]">
                    {badgeSatisfaction}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-sans">
                    Satisfaction Score
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
