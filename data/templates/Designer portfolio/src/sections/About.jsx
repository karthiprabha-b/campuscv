import React from 'react';
import { User, Compass } from 'lucide-react';

export default function About({ data = {} }) {
  const about = data.about || {};
  const personal = data.personal || {};
  const profile = data.profile || {};

  const name = profile.name || profile.fullName || data.name || data.fullName || personal.name || personal.fullName || "Maya Kapoor";
  const role = data.role || data.headline || data.tagline || personal.role || personal.headline || profile.headline || "Senior Product Designer";
  const location = data.location || data.hero?.location || personal.location || personal.city || profile.location || "Bengaluru, India";
  const avatarUrl = about.avatarUrl || about.image || data.profileImage || data.avatarUrl || data.avatar || data.photo || data.image || personal.profilePhoto || personal.avatarUrl || personal.photo || profile.profileImage || profile.avatarUrl || profile.photo || profile.image || data.hero?.avatarUrl || data.images?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const headline = about.headline || about.title || data.aboutHeadline || data.aboutHeading || data.aboutTitle || "I design at the intersection of people, products and technology.";
  const bio = about.bio || about.description || data.aboutBio || data.aboutMe || data.summary || personal.summary || data.bio || profile.summary || "";

  const defaultStats = [
    { value: "5+", label: "Years Experience" },
    { value: "28", label: "Products Designed" },
    { value: "12M+", label: "Product Users" }
  ];
  const stats = Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : (Array.isArray(about.stats) && about.stats.length > 0 ? about.stats : defaultStats);

  const defaultBioParagraphs = [
    "Over the last 5+ years, I've collaborated with fast-growing tech startups and global teams to transform ambiguous product requirements into clean, delightful digital experiences.",
    "My design approach is anchored in deep user inquiry, robust information architecture, and obsessive visual precision. I believe great product design should feel invisible to the end user while driving real, measurable business impact."
  ];

  return (
    <section id="about" data-cv-section="about" data-node-id="section:about:root:section:0" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Stats */}
          <div className="md:col-span-5 space-y-6 sm:space-y-8 min-w-0 w-full">
            <div data-node-id="container:about:root:portrait:0" className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-none mx-auto aspect-[4/5] rounded-3xl overflow-hidden bg-[#E5E0D8] border-4 border-white shadow-xl flex items-center justify-center">
              {avatarUrl ? (
                <img
                  data-cv="about.image"
                  data-node-id="image:about:root:img:0"
                  src={avatarUrl}
                  alt={name || "About"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-[#888888]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mb-3 text-[#111111]">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
                  </div>
                  {name && <p data-node-id="text:about:root:name:0" className="font-heading font-bold text-base text-[#111111]">{name}</p>}
                </div>
              )}
            </div>

            {/* Editorial Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#E5E0D8]" data-cv-collection="stats.items">
              {stats.map((stat, idx) => (
                <div key={idx} data-node-id={`container:about:card:${idx}:stat:0`} className="space-y-1 p-2 rounded-xl transition-all">
                  <p
                    className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] break-normal whitespace-normal hyphens-none"
                    data-cv={`stats.items[${idx}].value`}
                    data-node-id={`text:about:card:${idx}:value:0`}
                  >
                    {stat.value || stat.number}
                  </p>
                  <p
                    className="text-[11px] sm:text-xs text-[#666666] font-semibold break-normal whitespace-normal hyphens-none"
                    data-cv={`stats.items[${idx}].label`}
                    data-node-id={`text:about:card:${idx}:label:0`}
                  >
                    {stat.label || stat.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Editorial Text & Narrative */}
          <div className="md:col-span-7 space-y-5 sm:space-y-8 min-w-0 w-full">
            <span
              className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block"
              data-cv="about.eyebrow"
              data-node-id="text:about:root:eyebrow:0"
            >
              02 / About Me
            </span>

            <h2
              className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] leading-tight break-normal whitespace-normal hyphens-none max-w-full"
              data-cv="about.title"
              data-node-id="text:about:root:h2:0"
            >
              {headline}
            </h2>

            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg text-[#555555] font-normal leading-relaxed break-normal whitespace-normal hyphens-none" data-cv="about.description">
              {bio ? (
                <p data-node-id="text:about:root:p:0" className="whitespace-pre-line">{bio}</p>
              ) : (
                defaultBioParagraphs.map((p, i) => (
                  <p key={i} data-node-id={`text:about:root:p:${i}`}>{p}</p>
                ))
              )}
            </div>

            {/* Quick Info Badges */}
            {(role || location) && (
              <div className="pt-4 flex flex-wrap gap-4">
                {role && (
                  <div data-node-id="container:about:badge:role:0" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs font-bold text-[#111111]">
                    <User className="w-4 h-4 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
                    <span data-cv="hero.role" data-node-id="text:about:badge:role:0">{role}</span>
                  </div>
                )}
                {location && (
                  <div data-node-id="container:about:badge:location:0" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs font-bold text-[#111111]">
                    <Compass className="w-4 h-4 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
                    <span data-cv="hero.location" data-node-id="text:about:badge:location:0">{location}</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
