import React from 'react';
import { ArrowDown, ArrowUpRight, MapPin, User } from 'lucide-react';

export default function Hero({ data = {} }) {
  const personal = data.personal || {};
  const hero = data.hero || {};
  const profile = data.profile || {};

  const name = data.name || data.fullName || personal.name || personal.fullName || profile.name || profile.fullName || hero.name || "";
  const role = data.role || data.headline || data.tagline || personal.role || personal.headline || profile.headline || hero.role || "";
  const location = data.location || hero.location || personal.location || personal.city || profile.location || "";
  
  // Safe availability without falling back to long headline strings
  let rawAvailability = data.availability || hero.availability || personal.availability || "";
  if (!rawAvailability || rawAvailability.length > 50 || rawAvailability === role) {
    rawAvailability = "Available for select projects & full-time roles";
  }
  const availability = rawAvailability;

  const profileImage = data.profileImage || data.avatarUrl || data.avatar || data.photo || data.image || personal.profilePhoto || personal.avatarUrl || personal.photo || profile.profileImage || profile.avatarUrl || profile.photo || profile.image || hero.avatarUrl || hero.profileImage || data.about?.avatarUrl || data.about?.image || data.images?.profileImage || "";

  const title = hero.title || data.heroHeadline || data.headline || data.title || hero.headline || data.tagline || personal.headline || "Designing digital products people actually enjoy using.";
  const subtitle = hero.subtitle || data.heroDescription || hero.description || data.aboutMe || data.summary || personal.summary || data.bio || profile.summary || "Product designer focused on turning complex problems into simple, thoughtful digital experiences.";
  const ctaText = hero.ctaText || hero.primaryButton?.label || data.ctaText || "View Selected Work";

  return (
    <section id="hero" data-cv-section="hero" data-node-id="container:hero:section:0" className="pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-36 border-b border-[#E5E0D8] relative">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Top Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          <div data-node-id="container:hero:availability:0" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EEE9] border border-[#E5E0D8] text-xs font-semibold text-[#111111] max-w-full">
            <span className="w-2 h-2 rounded-full bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] animate-pulse shrink-0"></span>
            <span data-node-id="text:hero:availability:0" data-cv="hero.availability" className="break-normal whitespace-normal hyphens-none">{availability}</span>
          </div>
          {location && (
            <div data-node-id="container:hero:location:0" className="flex items-center gap-2 text-xs font-medium text-[#666666] shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
              <span data-node-id="text:hero:location:0" data-cv="hero.location" className="break-normal whitespace-normal hyphens-none">{location}</span>
            </div>
          )}
        </div>

        {/* Asymmetric Editorial Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Big Headline & Bio */}
          <div className="md:col-span-7 lg:col-span-8 space-y-5 sm:space-y-8 min-w-0 w-full">
            {name && (
              <span data-node-id="text:hero:eyebrow:0" className="text-xs uppercase font-extrabold tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block">
                Portfolio — <span data-node-id="text:hero:name:0" data-cv="hero.name">{name}</span>
              </span>
            )}

            <h1 data-node-id="text:hero:headline:0" data-cv="hero.headline" className="font-heading text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.08] break-normal whitespace-normal hyphens-none max-w-full">
              {title}
            </h1>

            <p data-node-id="text:hero:description:0" data-cv="hero.description" className="text-sm sm:text-base md:text-lg lg:text-xl text-[#555555] font-normal leading-relaxed max-w-2xl break-normal whitespace-normal hyphens-none">
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <a
                href="#projects"
                data-node-id="button:hero:primary:0"
                data-cv="hero.primaryButton"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] text-white text-xs sm:text-sm font-bold tracking-wide hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg shrink-0"
                style={{ backgroundColor: 'var(--campuscv-accent, var(--cv-accent, #FF4500))' }}
              >
                <span data-node-id="text:hero:primary:label:0" className="break-normal whitespace-normal hyphens-none">{ctaText}</span>
                <ArrowDown className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="#about"
                data-node-id="button:hero:secondary:0"
                data-cv="hero.secondaryButton"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-white border border-[#E5E0D8] text-[#111111] text-xs sm:text-sm font-bold tracking-wide hover:border-[#111111] transition-all shrink-0"
              >
                <span data-node-id="text:hero:secondary:label:0">About Me</span>
                <ArrowUpRight className="w-4 h-4 text-[#666666] shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Designer Portrait or Fallback */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end min-w-0 w-full mt-4 md:mt-0">
            <div data-node-id="container:hero:imageWrapper:0" className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-[4/5] rounded-3xl overflow-hidden bg-[#E5E0D8] shadow-2xl border-4 border-white flex items-center justify-center">
              {profileImage ? (
                <img
                  data-node-id="image:hero:profileImage:0"
                  data-cv="hero.profileImage"
                  src={profileImage}
                  alt={name || "Profile"}
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-[#888888]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mb-4 text-[#111111]">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
                  </div>
                  {name && <p className="font-heading font-bold text-base sm:text-lg text-[#111111]">{name}</p>}
                  {role && <p className="text-xs font-semibold text-[#666666] mt-1">{role}</p>}
                </div>
              )}
              {/* Subtle Badge Overlay */}
              {(role || location) && (
                <div data-node-id="container:hero:roleBadge:0" className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/50 shadow-sm">
                  {role && <p data-node-id="text:hero:role:0" data-cv="hero.role" className="text-xs font-bold text-[#111111] uppercase tracking-wider truncate">{role}</p>}
                  {location && <p data-node-id="text:hero:badgeLocation:0" data-cv="hero.location" className="text-[11px] text-[#666666] truncate">{location}</p>}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


