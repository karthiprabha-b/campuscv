import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Smile, Crown, Check, Heart, Award, Clock } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function About({ data = {} }) {
  const [activeTab, setActiveTab] = useState('story');

  const name = 
    data?.contentOverrides?.['text:about:name']?.value ||
    data?.hero?.name || data?.name || data?.fullName || _default.name || 'Elena Laurent';

  const roleTitle = 
    data?.role || data?.title || data?.headline || 'Certified Specialist';

  const expYears = data?.experienceYears || (Array.isArray(data?.experience) && data.experience.length > 0 ? `${data.experience.length}+` : null);
  const projCount = (Array.isArray(data?.projects) && data.projects.length > 0) ? `${data.projects.length}+` : null;

  const headline = 
    data?.contentOverrides?.['text:about:headline']?.value ||
    data?.about?.headline || data?.headline || _default.about?.philosophy || 'Crafting Timeless Radiance & Confidence';

  const story = 
    data?.contentOverrides?.['text:about:story']?.value ||
    data?.about?.story || data?.bio || data?.summary || _default.about?.story || 'With over a decade of dedicated practice, cultivating a signature approach that blends technical precision with modern creativity.';

  const quote = 
    data?.contentOverrides?.['text:about:quote']?.value ||
    data?.about?.philosophy || data?.tagline || _default.about?.philosophy || 'Every project tells a story; my craft is to ensure it is built with enduring quality, precision, and effortless sophistication.';

  const tagYears = 
    data?.contentOverrides?.['text:about:tagYears']?.value || 
    (expYears ? `${expYears} Years Practice` : (data?.graduationYear ? `Class of ${data.graduationYear}` : '10+ Years Practice'));

  const tagYearsSub = data?.role ? 'Specialist' : 'Master Practice';

  const tagBrides = 
    data?.contentOverrides?.['text:about:tagBrides']?.value || 
    (projCount ? `${projCount} Projects Built` : (data?.clientsServed ? `${data.clientsServed} Completed` : '450+ Works Delivered'));

  const tagBridesSub = projCount ? 'Featured Portfolio' : 'Verified Artistry';

  const aboutImage = 
    data?.contentOverrides?.['image:about:photo:0']?.src ||
    (typeof data?.contentOverrides?.['image:about:photo:0'] === 'string' ? data?.contentOverrides?.['image:about:photo:0'] : null) ||
    data?.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:about:root:img:0'] === 'string' ? data?.contentOverrides?.['image:about:root:img:0'] : null) ||
    data?.imageOverrides?.['about.image'] ||
    data?.imageOverrides?.['aboutImage'] ||
    data?.about?.image ||
    data?.avatarUrl ||
    data?.profileImage ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80';

  const iconsMap = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#DF7A98]" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#DF7A98]" />,
    Smile: <Smile className="w-6 h-6 text-[#DF7A98]" />,
    Crown: <Crown className="w-6 h-6 text-[#DF7A98]" />,
  };

  const keyPoints = Array.isArray(data?.about?.keyPoints) && data.about.keyPoints.length > 0
    ? data.about.keyPoints
    : [
        {
          title: 'High-Standard Precision',
          desc: 'Applying rigorous industry standards, clean methodologies, and detail-oriented execution across every deliverable.',
          icon: 'ShieldCheck'
        },
        {
          title: 'Modern Craftsmanship',
          desc: 'Utilizing modern tools, cutting-edge frameworks, and creative problem-solving tailored to unique requirements.',
          icon: 'Sparkles'
        },
        {
          title: 'User-Centric Architecture',
          desc: 'Designing intuitive experiences and scalable systems that emphasize long-term usability and clarity.',
          icon: 'Smile'
        },
        {
          title: 'Dedicated Professionalism',
          desc: 'Uncompromising commitment to continuous growth, clear communication, and reliable delivery.',
          icon: 'Crown'
        }
      ];

  return (
    <section 
      id="about" 
      data-cv-section="about"
      data-node-id="section:about:root:section:0"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#FCEEF3]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-[#FCEEF3] px-4 py-1.5 rounded-full border border-pink-200 inline-block">
            About The Professional
          </span>
          <h2 
            data-node-id="text:about:headline"
            data-node-type="text"
            data-cv="about.headline"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text pointer-events-auto"
          >
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            Where technical precision meets creative vision and dedicated execution.
          </p>
        </div>

        {/* 2-Column About Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait & Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Outer decorative border */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#F8D7E3] to-[#C59B6D]/30 opacity-60 blur-lg" />

              {/* Main Portrait */}
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-[#FCEEF3]">
                <div className="relative h-[480px] sm:h-[540px] w-full">
                  <img
                    src={aboutImage}
                    data-node-id="image:about:photo:0"
                    data-node-type="image"
                    data-cv="about.image"
                    alt="Professional Portrait"
                    className="w-full h-full object-cover object-top cursor-pointer pointer-events-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Portrait Floating Signature Tag */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-center pointer-events-auto z-20">
                    <p 
                      data-node-id="text:about:name"
                      data-node-type="text"
                      className="font-script text-3xl text-pink-200 cursor-text"
                    >
                      {name}
                    </p>
                    <p className="text-xs tracking-wider uppercase font-semibold text-white/90 pointer-events-none truncate max-w-xs mx-auto">
                      {roleTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge: Years Experience */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-luxury border border-pink-200 flex items-center gap-3 pointer-events-auto z-20">
                <div className="w-10 h-10 rounded-full bg-[#FCEEF3] flex items-center justify-center text-[#DF7A98] font-bold pointer-events-none">
                  <Award className="w-5 h-5" />
                </div>
                <div className="pointer-events-auto">
                  <p 
                    data-node-id="text:about:tagYears"
                    data-node-type="text"
                    className="font-serif text-base font-bold text-zinc-900 cursor-text"
                  >
                    {tagYears}
                  </p>
                  <p className="text-[11px] text-zinc-500 pointer-events-none">{tagYearsSub}</p>
                </div>
              </div>

              {/* Floating Badge: Projects Completed */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-luxury border border-pink-200 flex items-center gap-3 pointer-events-auto z-20">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 pointer-events-none">
                  <Heart className="w-5 h-5 fill-amber-500" />
                </div>
                <div className="pointer-events-auto">
                  <p 
                    data-node-id="text:about:tagBrides"
                    data-node-type="text"
                    className="font-serif text-base font-bold text-zinc-900 cursor-text"
                  >
                    {tagBrides}
                  </p>
                  <p className="text-[11px] text-zinc-500 pointer-events-none">{tagBridesSub}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Philosophy & Interactive Tabs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Interactive Tab Switcher */}
            <div className="flex border-b border-pink-100 gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`pb-3 text-base font-serif font-bold transition-all relative cursor-pointer ${
                  activeTab === 'story'
                    ? 'text-[#DF7A98] border-b-2 border-[#DF7A98]'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                The Journey
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('philosophy')}
                className={`pb-3 text-base font-serif font-bold transition-all relative cursor-pointer ${
                  activeTab === 'philosophy'
                    ? 'text-[#DF7A98] border-b-2 border-[#DF7A98]'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Core Philosophy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('standards')}
                className={`pb-3 text-base font-serif font-bold transition-all relative cursor-pointer ${
                  activeTab === 'standards'
                    ? 'text-[#DF7A98] border-b-2 border-[#DF7A98]'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                Quality Standards
              </button>
            </div>

            {/* Tab Content 1: Story */}
            {activeTab === 'story' && (
              <div className="space-y-4 animate-fadeIn">
                <p 
                  data-node-id="text:about:story"
                  data-node-type="text"
                  data-cv="about.story"
                  className="text-base text-zinc-700 leading-relaxed font-normal cursor-text pointer-events-auto"
                >
                  {story}
                </p>
                <div className="bg-[#FCEEF3] p-5 rounded-2xl border border-pink-200/70 space-y-2 pointer-events-auto">
                  <p 
                    data-node-id="text:about:quote"
                    data-node-type="text"
                    className="font-serif italic text-base text-zinc-900 font-semibold cursor-text"
                  >
                    &ldquo;{quote}&rdquo;
                  </p>
                  <p className="text-xs text-[#A83E5D] font-bold uppercase tracking-wider">
                    — {name}, Professional Practice
                  </p>
                </div>
              </div>
            )}

            {/* Tab Content 2: Philosophy */}
            {activeTab === 'philosophy' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-base text-zinc-700 leading-relaxed">
                  I believe in engineering solutions that balance robust architectural foundations with intuitive, delightful execution. Every project is approached with curiosity, precision, and a relentless focus on creating tangible value.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Architecture-first approach: scalable, maintainable, and clean code built for long-term growth.',
                    'User-centered design: intuitive and responsive experiences crafted with attention to detail.',
                    'Continuous refinement: incorporating feedback and modern best practices at every stage.'
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-700">
                      <div className="w-5 h-5 rounded-full bg-[#FCEEF3] shrink-0 flex items-center justify-center text-[#DF7A98] mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab Content 3: Standards */}
            {activeTab === 'standards' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-base text-zinc-700 leading-relaxed">
                  Dedicated to rigorous development standards, comprehensive testing, clear documentation, and seamless collaboration.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-zinc-700 font-medium">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">✓ Modern Engineering Best Practices</div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">✓ Robust Architecture & Clean Logic</div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">✓ Continuous Testing & Optimization</div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">✓ Transparent & Agile Communication</div>
                </div>
              </div>
            )}

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {keyPoints.map((point, index) => (
                <div
                  key={index}
                  data-node-id={`container:about:pillar:${index}`}
                  className="p-4 rounded-2xl bg-zinc-50/70 border border-pink-100 hover:border-pink-300 hover:bg-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FCEEF3] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {iconsMap[point.icon] || <Sparkles className="w-5 h-5 text-[#DF7A98]" />}
                  </div>
                  <h4 
                    data-node-id={`text:about:pillar:${index}:title`}
                    data-node-type="text"
                    className="font-serif font-bold text-sm text-zinc-900 mb-1 cursor-text"
                  >
                    {point.title}
                  </h4>
                  <p 
                    data-node-id={`text:about:pillar:${index}:desc`}
                    data-node-type="text"
                    className="text-xs text-zinc-600 leading-relaxed cursor-text"
                  >
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <a
                href="#contact"
                data-node-id="button:about:contact"
                data-node-type="button"
                data-cv="about.contactButton"
                className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-[#DF7A98] text-white font-semibold text-sm transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer pointer-events-auto"
              >
                <span>Get in Touch</span>
                <Clock className="w-4 h-4 text-pink-300 pointer-events-none" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
