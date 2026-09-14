import React from 'react';
import { ArrowUpRight, Award, ShieldCheck, Sparkles, Mail, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';

export default function Hero(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.hero || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || data?.personalInfo?.name || "Alexander Vance";
  const title = hero?.title || data?.title || data?.personalInfo?.title || "Senior Legal Counsel & Partner";
  const smallLabel = hero?.smallLabel || data?.smallLabel || "WELCOME TO MY EXECUTIVE PORTFOLIO";
  const headline = hero?.headline || data?.headline || "Strategic Legal Counsel.";
  const highlightText = typeof hero?.highlightText === 'string' ? hero.highlightText : (typeof data?.highlightText === 'string' ? data.highlightText : '');
  const intro = hero?.intro || data?.intro || hero?.introductionText || data?.bio || data?.profile?.about || "Providing high-stakes corporate counsel, regulatory compliance strategies, and bespoke legal advisory for fortune leaders, startups, and high-net-worth clients.";
  const summary = typeof hero?.summary === 'string' ? hero.summary : (typeof data?.summary === 'string' ? data.summary : '');
  const avatarUrl = hero?.avatarUrl || data?.avatarUrl || data?.personalInfo?.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000";
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
    <section id="hero" data-cv-section="hero" className="relative py-16 sm:py-20 lg:py-24 flex items-center overflow-hidden bg-[#FAF8F4]">
      {/* Background Subtle Ambient Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.15) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Headline & Bio */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Small Label Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border mb-6 bg-white/80 backdrop-blur-sm"
              style={{
                borderColor: 'var(--campuscv-accent, #C89B3C)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--campuscv-accent, #C89B3C)' }} />
              <span 
                className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
                style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
              >
                {smallLabel}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-[1.2] mb-5 break-words">
              {headline}
              {highlightText && highlightText.trim() && highlightText !== headline ? (
                <span 
                  className="block mt-1"
                  style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                >
                  {highlightText}
                </span>
              ) : null}
            </h1>

            {/* Short Intro */}
            {intro ? (
              <p className="text-base sm:text-lg text-[#6B7280] font-sans font-light leading-relaxed mb-4 max-w-2xl">
                {intro}
              </p>
            ) : null}

            {/* Professional Summary */}
            {summary && summary.trim() && summary !== intro ? (
              <p 
                className="text-xs sm:text-sm text-gray-700 font-sans italic border-l-2 pl-4 py-1 mb-8 max-w-2xl"
                style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
              >
                "{summary}"
              </p>
            ) : null}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase shadow-md hover:brightness-105 transition-colors border"
                style={{
                  backgroundColor: 'var(--campuscv-accent, #C89B3C)',
                  color: 'var(--primary-foreground, #FFFFFF)',
                  borderColor: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <span>View Portfolio</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 bg-white text-sm font-bold tracking-widest uppercase transition-colors hover:bg-stone-50"
                style={{
                  borderColor: 'var(--campuscv-accent, #C89B3C)',
                  color: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Social Links */}
            <div 
              className="flex items-center gap-4 pt-6 border-t border-stone-200 w-full"
            >
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
                      className="p-2.5 border border-stone-200 text-gray-700 hover:text-[var(--campuscv-accent,#C89B3C)] hover:border-[var(--campuscv-accent,#C89B3C)] transition-colors duration-200 bg-white shadow-sm"
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
              {/* Outer Decorative Frame */}
              <div 
                className="absolute -inset-4 border-2 pointer-events-none"
                style={{ borderColor: 'var(--campuscv-accent, #C89B3C)', opacity: 0.4 }}
              />
              <div 
                className="absolute -inset-2 border pointer-events-none"
                style={{ borderColor: 'var(--campuscv-accent, #C89B3C)', opacity: 0.2 }}
              />

              {/* Main Image Container */}
              <div 
                className="relative aspect-[4/5] overflow-hidden border-2 shadow-2xl bg-[#111827]"
                style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
              >
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover object-center filter grayscale-[10%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Caption overlay at bottom of image */}
                <div 
                  className="absolute bottom-4 left-4 right-4 p-4 bg-[#0B0F19]/90 backdrop-blur-md border border-stone-800 pointer-events-none text-white"
                >
                  <p className="font-serif text-lg font-bold text-white">{name}</p>
                  <p 
                    className="text-xs font-sans tracking-wide uppercase"
                    style={{ color: 'var(--campuscv-accent-light, #D5B350)' }}
                  >
                    {title}
                  </p>
                </div>
              </div>

              {/* Floating Badge 1 - Top Right */}
              <div 
                className="absolute -top-6 -right-6 bg-white p-4 border border-stone-200 shadow-luxury hidden sm:flex items-center gap-3 z-20"
              >
                <div 
                  className="p-2.5 bg-stone-50 border border-stone-200"
                  style={{
                    color: 'var(--campuscv-accent, #C89B3C)'
                  }}
                >
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
              <div 
                className="absolute -bottom-6 -left-6 bg-white p-4 border border-stone-200 shadow-luxury hidden sm:flex items-center gap-3 z-20"
              >
                <div 
                  className="p-2.5 bg-stone-50 border border-stone-200"
                  style={{
                    color: 'var(--campuscv-accent, #C89B3C)'
                  }}
                >
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
