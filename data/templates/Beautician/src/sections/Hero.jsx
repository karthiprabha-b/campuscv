import React from 'react';
import { Sparkles, Calendar, ArrowRight, Star, Heart, CheckCircle, Award } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Hero({ data = {} }) {
  const name = 
    data?.contentOverrides?.['text:hero:name']?.value ||
    (typeof data?.contentOverrides?.['text:hero:name'] === 'string' ? data?.contentOverrides?.['text:hero:name'] : null) ||
    data?.hero?.name || data?.name || data?.fullName || _default.name || 'Elena Laurent';

  const badgeText = 
    data?.contentOverrides?.['text:hero:badge']?.value ||
    (typeof data?.contentOverrides?.['text:hero:badge'] === 'string' ? data?.contentOverrides?.['text:hero:badge'] : null) ||
    data?.hero?.badge || data?.heroBadge || _default.heroBadge || 'Beverly Hills Premier Aesthetician • CIDESCO Certified';

  const scriptTagline = 
    data?.contentOverrides?.['text:hero:script']?.value ||
    (typeof data?.contentOverrides?.['text:hero:script'] === 'string' ? data?.contentOverrides?.['text:hero:script'] : null) ||
    'The home of beauty';

  const headline = 
    data?.contentOverrides?.['text:hero:headline']?.value ||
    (typeof data?.contentOverrides?.['text:hero:headline'] === 'string' ? data?.contentOverrides?.['text:hero:headline'] : null) ||
    data?.hero?.headline || data?.heroHeadline || data?.headline || _default.headline || 'The Beauty Abode. A Luxury destination for all beauty seekers.';

  const rawBio = 
    data?.contentOverrides?.['text:hero:bio']?.value ||
    (typeof data?.contentOverrides?.['text:hero:bio'] === 'string' ? data?.contentOverrides?.['text:hero:bio'] : null) ||
    data?.contentOverrides?.['text:hero:description']?.value ||
    (typeof data?.contentOverrides?.['text:hero:description'] === 'string' ? data?.contentOverrides?.['text:hero:description'] : null) ||
    data?.hero?.description || data?.hero?.bio || data?.heroSubheadline || data?.bio || data?.summary || data?.aboutSummary;
  const bio = rawBio || _default.subheadline || 'Crafting bespoke bridal transformations, clinical dermal rejuvenation, and high-fashion editorial artistry with uncompromising luxury.';

  // Derive Trust Stats dynamically from user data or defaults
  const userStats = Array.isArray(data?.stats) && data.stats.length > 0
    ? data.stats
    : (Array.isArray(data?.hero?.stats) && data.hero.stats.length > 0 ? data.hero.stats : null);

  const expYears = data?.experienceYears || (Array.isArray(data?.experience) && data.experience.length > 0 ? `${data.experience.length}+` : null);
  const projCount = (Array.isArray(data?.projects) && data.projects.length > 0) ? `${data.projects.length}+` : null;
  const skillsCount = (Array.isArray(data?.skills) && data.skills.length > 0) ? `${data.skills.length}+` : (Array.isArray(data?.skillsList) ? `${data.skillsList.length}+` : null);

  const stat1Val = data?.contentOverrides?.['text:hero:stat1:val']?.value || userStats?.[0]?.value || (expYears ? `${expYears}` : '3+');
  const stat1Lbl = data?.contentOverrides?.['text:hero:stat1:lbl']?.value || userStats?.[0]?.label || 'Years Experience';

  const stat2Val = data?.contentOverrides?.['text:hero:stat2:val']?.value || userStats?.[1]?.value || (projCount ? `${projCount}` : (data?.clientsServed || '25+'));
  const stat2Lbl = data?.contentOverrides?.['text:hero:stat2:lbl']?.value || userStats?.[1]?.label || (projCount ? 'Projects Built' : 'Projects & Works');

  const stat3Val = data?.contentOverrides?.['text:hero:stat3:val']?.value || userStats?.[2]?.value || (skillsCount ? `${skillsCount}` : '100%');
  const stat3Lbl = data?.contentOverrides?.['text:hero:stat3:lbl']?.value || userStats?.[2]?.label || (skillsCount ? 'Skills & Tools' : 'Verified Mastery');

  // Floating Overlay Badges
  const heroTag1 = data?.contentOverrides?.['text:hero:tag1']?.value || 'Signature Artistry • Bridal Glow';
  const heroTag2 = data?.contentOverrides?.['text:hero:tag2']?.value || 'Russian Nails';
  const heroTag3 = data?.contentOverrides?.['text:hero:tag3']?.value || 'Lash & Brow Art';
  const heroTag4 = data?.contentOverrides?.['text:hero:tag4']?.value || '100% Sterile Protocol';

  // Hero Editorial Cover Image
  const defaultCover = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80';
  const heroImage = 
    data?.contentOverrides?.['image:hero:cover:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:cover:0'] === 'string' ? data?.contentOverrides?.['image:hero:cover:0'] : null) ||
    data?.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data?.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data?.imageOverrides?.['hero.coverImage'] ||
    data?.imageOverrides?.['coverImage'] ||
    data?.imageOverrides?.['heroImage'] ||
    data?.hero?.coverImage ||
    data?.profileImage ||
    data?.avatarUrl ||
    defaultCover;

  const nailCardImg = data?.contentOverrides?.['image:hero:nail:0']?.src || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80';
  const lashCardImg = data?.contentOverrides?.['image:hero:lash:0']?.src || 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=400&q=80';

  return (
    <section
      id="hero"
      data-cv-section="hero"
      data-node-id="section:hero:root:section:0"
      className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF7F5] via-[#FFFDFB] to-[#FCEEF3]/40"
    >
      {/* Decorative ambient glow spheres */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#F8D7E3]/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C59B6D]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Premier Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 shadow-sm text-xs font-semibold text-[#A83E5D] tracking-wider uppercase backdrop-blur-md pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#DF7A98] pointer-events-none" />
              <span
                data-node-id="text:hero:badge"
                data-node-type="text"
                data-cv="hero.badge"
                className="cursor-text pointer-events-auto"
              >
                {badgeText}
              </span>
            </div>

            {/* Script Heading */}
            <div className="space-y-2 pointer-events-auto">
              <p 
                data-node-id="text:hero:script"
                data-node-type="text"
                className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#DF7A98] font-normal italic tracking-wide cursor-text pointer-events-auto"
              >
                {scriptTagline}
              </p>
              <h1 
                data-node-id="text:hero:headline"
                data-node-type="text"
                data-cv="hero.headline"
                className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.15] cursor-text pointer-events-auto"
              >
                {headline}
              </h1>
            </div>

            {/* Subtitle / Bio */}
            <p 
              data-node-id="text:hero:bio"
              data-node-type="text"
              data-cv="hero.description"
              className="text-base sm:text-lg text-zinc-700 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 cursor-text pointer-events-auto"
            >
              {bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 pointer-events-auto">
              <a
                href="#contact"
                data-node-id="button:hero:contact"
                data-node-type="button"
                data-cv="hero.contactButton"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#DF7A98] text-white font-semibold text-base shadow-soft-pink hover:bg-[#C95679] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-pink-300"
              >
                <span>Get in Touch</span>
              </a>

              <a
                href="#projects"
                data-node-id="button:hero:projects"
                data-node-type="button"
                data-cv="hero.projectsButton"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-zinc-800 font-semibold text-base border border-pink-200 shadow-sm hover:border-pink-400 hover:text-[#DF7A98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4 text-[#DF7A98] group-hover:translate-x-1 transition-transform pointer-events-none" />
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-pink-200/60 grid grid-cols-3 gap-4 text-center lg:text-left pointer-events-auto">
              <div>
                <p 
                  data-node-id="text:hero:stat1:val"
                  data-node-type="text"
                  className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 cursor-text"
                >
                  {stat1Val}
                </p>
                <p 
                  data-node-id="text:hero:stat1:lbl"
                  data-node-type="text"
                  className="text-xs text-zinc-500 font-medium cursor-text"
                >
                  {stat1Lbl}
                </p>
              </div>
              <div>
                <p 
                  data-node-id="text:hero:stat2:val"
                  data-node-type="text"
                  className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 cursor-text"
                >
                  {stat2Val}
                </p>
                <p 
                  data-node-id="text:hero:stat2:lbl"
                  data-node-type="text"
                  className="text-xs text-zinc-500 font-medium cursor-text"
                >
                  {stat2Lbl}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <span 
                    data-node-id="text:hero:stat3:val"
                    data-node-type="text"
                    className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 cursor-text"
                  >
                    {stat3Val}
                  </span>
                </div>
                <p 
                  data-node-id="text:hero:stat3:lbl"
                  data-node-type="text"
                  className="text-xs text-zinc-500 font-medium cursor-text"
                >
                  {stat3Lbl}
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Collage Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Featured Editorial Image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative h-[380px] sm:h-[440px] w-full">
                  <img
                    src={heroImage}
                    data-node-id="image:hero:cover:0"
                    data-node-type="image"
                    data-cv="hero.coverImage"
                    alt="Luxury Beautician Studio"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 cursor-pointer pointer-events-auto"
                  />
                  {/* Dark gradient overlay with pointer-events-none */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Overlay Badge on Main Image */}
                  <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-auto z-20">
                    <p 
                      data-node-id="text:hero:tag1"
                      data-node-type="text"
                      className="font-script text-2xl text-pink-200 cursor-text"
                    >
                      {heroTag1}
                    </p>
                    <p className="font-serif text-lg font-semibold pointer-events-none">
                      Aesthetic Skin Perfection
                    </p>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Treatment Cards */}
              
              {/* Card 1: Nails Card (Bottom Right overlap) */}
              <div className="absolute -bottom-10 -right-4 sm:-right-6 z-20 w-44 sm:w-52 rounded-2xl overflow-hidden shadow-luxury border-2 border-white bg-white transform hover:-translate-y-1 transition-all duration-300 pointer-events-auto">
                <div className="relative h-28 sm:h-32 w-full">
                  <img
                    src={nailCardImg}
                    data-node-id="image:hero:nail:0"
                    data-node-type="image"
                    alt="Russian Gel Nails"
                    className="w-full h-full object-cover cursor-pointer pointer-events-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <span 
                    data-node-id="text:hero:tag2"
                    data-node-type="text"
                    className="absolute bottom-2.5 left-3 text-white font-serif font-medium text-sm cursor-text pointer-events-auto z-20"
                  >
                    {heroTag2}
                  </span>
                </div>
              </div>

              {/* Card 2: Eyelash Treatments Card (Top Left overlap) */}
              <div className="absolute -top-8 -left-4 sm:-left-8 z-20 w-40 sm:w-48 rounded-2xl overflow-hidden shadow-luxury border-2 border-white bg-white transform hover:-translate-y-1 transition-all duration-300 pointer-events-auto">
                <div className="relative h-28 sm:h-32 w-full">
                  <img
                    src={lashCardImg}
                    data-node-id="image:hero:lash:0"
                    data-node-type="image"
                    alt="Lash & Brow Enhancements"
                    className="w-full h-full object-cover cursor-pointer pointer-events-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <span 
                    data-node-id="text:hero:tag3"
                    data-node-type="text"
                    className="absolute bottom-2.5 left-3 text-white font-serif font-medium text-sm cursor-text pointer-events-auto z-20"
                  >
                    {heroTag3}
                  </span>
                </div>
              </div>

              {/* Floating Verified Trust Pill */}
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-30 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-luxury border border-pink-200 pointer-events-auto">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 pointer-events-none">
                  <CheckCircle className="w-5 h-5 pointer-events-none" />
                </div>
                <div className="pointer-events-auto">
                  <p 
                    data-node-id="text:hero:tag4"
                    data-node-type="text"
                    className="text-xs font-bold text-zinc-900 cursor-text"
                  >
                    {heroTag4}
                  </p>
                  <p className="text-[10px] text-zinc-500 pointer-events-none">Single-use surgical implements</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Highlight Treatment / Core Competencies Strip */}
        <div className="mt-20 pt-10 border-t border-pink-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pointer-events-auto">
          {[
            {
              tag: '01 / TECHNICAL',
              title: 'Engineering & Mastery',
              desc: 'Dedicated to high performance, scalable architectures, and clean maintainable code.'
            },
            {
              tag: '02 / PRECISION',
              title: 'Detail & Architecture',
              desc: 'Rigorous attention to system design, optimization, and seamless user experience.'
            },
            {
              tag: '03 / INNOVATION',
              title: 'Problem Solving',
              desc: 'Turning complex real-world requirements into intuitive, reliable digital solutions.'
            },
            {
              tag: '04 / EXCELLENCE',
              title: 'Continuous Growth',
              desc: 'Constantly advancing with modern technologies, frameworks, and best practices.'
            }
          ].map((pillar, pIdx) => {
            const pTag = data?.contentOverrides?.[`text:hero:pillar:${pIdx}:tag`]?.value || pillar.tag;
            const pTitle = data?.contentOverrides?.[`text:hero:pillar:${pIdx}:title`]?.value || pillar.title;
            const pDesc = data?.contentOverrides?.[`text:hero:pillar:${pIdx}:desc`]?.value || pillar.desc;

            return (
              <div
                key={pIdx}
                data-node-id={`container:hero:pillar:${pIdx}`}
                className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-pink-100 hover:border-pink-300 transition-all group"
              >
                <span 
                  data-node-id={`text:hero:pillar:${pIdx}:tag`}
                  data-node-type="text"
                  className="text-xs font-bold text-[#DF7A98] uppercase tracking-widest block cursor-text"
                >
                  {pTag}
                </span>
                <h3 
                  data-node-id={`text:hero:pillar:${pIdx}:title`}
                  data-node-type="text"
                  className="font-serif text-lg font-bold text-zinc-900 mt-1 group-hover:text-[#DF7A98] transition-colors cursor-text"
                >
                  {pTitle}
                </h3>
                <p 
                  data-node-id={`text:hero:pillar:${pIdx}:desc`}
                  data-node-type="text"
                  className="text-xs text-zinc-600 mt-1 leading-relaxed cursor-text"
                >
                  {pDesc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
