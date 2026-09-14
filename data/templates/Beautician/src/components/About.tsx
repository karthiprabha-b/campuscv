"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { ShieldCheck, Sparkles, Smile, Crown, Check, Heart, Award, Clock } from "lucide-react";
import Image from "next/image";

export default function About() {
  const [activeTab, setActiveTab] = useState<"story" | "philosophy" | "standards">("story");

  const iconsMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-blush-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-blush-600" />,
    Smile: <Smile className="w-6 h-6 text-blush-600" />,
    Crown: <Crown className="w-6 h-6 text-blush-600" />,
  };

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blush-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-blush-50 px-4 py-1.5 rounded-full border border-blush-200 inline-block">
            About The Master Aesthetician
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            Crafting Timeless Radiance & Confidence
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            Where clinical dermatological science meets high-fashion artistic sensibility.
          </p>
        </div>

        {/* 2-Column About Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Decorative Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Outer decorative border */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-blush-200 to-champagne-300 opacity-60 blur-lg"></div>

              {/* Main Portrait */}
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-blush-50">
                <div className="relative h-[480px] sm:h-[540px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                    alt="Elena Laurent Master Beautician"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent"></div>
                  
                  {/* Portrait Floating Signature Tag */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                    <p className="font-script text-3xl text-blush-200">Elena Laurent</p>
                    <p className="text-xs tracking-wider uppercase font-semibold text-white/90">
                      CIDESCO Gold Master Aesthetician
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge: 10 Years */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-luxury border border-blush-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center text-blush-600 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-serif text-base font-bold text-charcoal-900">10+ Years</p>
                  <p className="text-[11px] text-charcoal-800/70">Master Practice</p>
                </div>
              </div>

              {/* Floating Badge: Brides Glitz */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-luxury border border-blush-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-600">
                  <Heart className="w-5 h-5 fill-champagne-600" />
                </div>
                <div>
                  <p className="font-serif text-base font-bold text-charcoal-900">450+ Brides</p>
                  <p className="text-[11px] text-charcoal-800/70">Flawless Weddings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Philosophy & Interactive Tabs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Interactive Tab Switcher */}
            <div className="flex border-b border-blush-100 gap-6">
              <button
                onClick={() => setActiveTab("story")}
                className={`pb-3 text-base font-serif font-bold transition-all relative ${
                  activeTab === "story"
                    ? "text-blush-600 border-b-2 border-blush-500"
                    : "text-charcoal-800/60 hover:text-charcoal-900"
                }`}
              >
                The Journey
              </button>
              <button
                onClick={() => setActiveTab("philosophy")}
                className={`pb-3 text-base font-serif font-bold transition-all relative ${
                  activeTab === "philosophy"
                    ? "text-blush-600 border-b-2 border-blush-500"
                    : "text-charcoal-800/60 hover:text-charcoal-900"
                }`}
              >
                Artistic Philosophy
              </button>
              <button
                onClick={() => setActiveTab("standards")}
                className={`pb-3 text-base font-serif font-bold transition-all relative ${
                  activeTab === "standards"
                    ? "text-blush-600 border-b-2 border-blush-500"
                    : "text-charcoal-800/60 hover:text-charcoal-900"
                }`}
              >
                Sanctuary Standards
              </button>
            </div>

            {/* Tab Content 1: Story */}
            {activeTab === "story" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-base text-charcoal-800/80 leading-relaxed font-normal">
                  {portfolioData.about.story}
                </p>
                <div className="bg-blush-50/70 p-5 rounded-2xl border border-blush-200/70 space-y-2">
                  <p className="font-serif italic text-base text-charcoal-900 font-semibold">
                    &ldquo;{portfolioData.about.philosophy}&rdquo;
                  </p>
                  <p className="text-xs text-blush-700 font-bold uppercase tracking-wider">
                    — Elena Laurent, Lead Aesthetician
                  </p>
                </div>
              </div>
            )}

            {/* Tab Content 2: Philosophy */}
            {activeTab === "philosophy" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-base text-charcoal-800/80 leading-relaxed">
                  I believe in highlighting what makes you uniquely captivating. Instead of masking features with heavy layers, we prep your skin with clinical rejuvenation and sculpt with high-definition lighting techniques.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Zero cakey textures: skin that looks like real, glowing skin in daylight and 8K lenses.",
                    "Skin-first approach: clinical barrier prep ensuring your glow lasts for weeks post-treatment.",
                    "Customized chromatic matching for all skin types and undertones.",
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-800/80">
                      <div className="w-5 h-5 rounded-full bg-blush-100 flex-shrink-0 flex items-center justify-center text-blush-600 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab Content 3: Standards */}
            {activeTab === "standards" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-base text-charcoal-800/80 leading-relaxed">
                  Our private studio operates under strict medical-grade hygiene protocols with 100% autoclave sterilized instruments and individualized treatment suites.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-charcoal-800/80 font-medium">
                  <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-300">✓ Autoclave Medical Sterilization</div>
                  <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-300">✓ HEPA Air Filtration Suites</div>
                  <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-300">✓ 100% Cruelty-Free & Vegan Options</div>
                  <div className="p-3 bg-pearl-100 rounded-xl border border-pearl-300">✓ Single-Use Disposable Files & Needles</div>
                </div>
              </div>
            )}

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {portfolioData.about.keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-pearl-100/60 border border-blush-100 hover:border-blush-300 hover:bg-white transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blush-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {iconsMap[point.icon]}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900 mb-1">{point.title}</h4>
                  <p className="text-xs text-charcoal-800/70 leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-full bg-charcoal-900 hover:bg-blush-600 text-white font-semibold text-sm transition-all duration-300 shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Get in Touch</span>
                <Clock className="w-4 h-4 text-blush-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
