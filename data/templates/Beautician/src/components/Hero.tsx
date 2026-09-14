"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { Sparkles, Calendar, ArrowRight, Award, Star, Heart, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF7F5] via-[#FFFDFB] to-[#FCEEF3]/40"
    >
      {/* Decorative luxury background glow spheres */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blush-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-champagne-300/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Premier Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blush-200 shadow-sm text-xs font-semibold text-blush-700 tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blush-500 animate-spin-slow" />
              <span>Beverly Hills Premier Aesthetician</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blush-400"></span>
              <span className="text-charcoal-800/80 font-medium">CIDESCO Certified</span>
            </div>

            {/* Script Heading matching reference photo */}
            <div className="space-y-2">
              <p className="font-script text-4xl sm:text-5xl lg:text-6xl text-blush-600 font-normal italic tracking-wide">
                The home of beauty
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.15]">
                The Beauty Abode.
                <span className="block text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-normal text-charcoal-800/90 mt-1">
                  A Luxury destination for all beauty seekers.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-charcoal-800/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {portfolioData.beautician.subheadline} From red-carpet bridal contouring to medical-grade dermal facials and precision Russian nail couture.
            </p>

            {/* CTA Buttons matching reference design */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blush-500 text-white font-semibold text-base shadow-soft-pink hover:bg-blush-600 hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 group border border-blush-400 cursor-pointer"
              >
                <span>Get in Touch</span>
              </a>

              <a
                href="#projects"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/80 hover:bg-white text-charcoal-800 font-semibold text-base border border-blush-300 shadow-sm hover:border-blush-400 hover:text-blush-600 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4 text-blush-500 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 border-t border-blush-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">{portfolioData.beautician.experienceYears}+</p>
                <p className="text-xs text-charcoal-800/70 font-medium">Years Experience</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">{portfolioData.beautician.clientsServed}</p>
                <p className="text-xs text-charcoal-800/70 font-medium">Brides & Clients</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">4.9</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs text-charcoal-800/70 font-medium">5-Star Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Visual Collage Column (Matching Reference Design with Overlapping Cards) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Featured Editorial Image */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative h-[380px] sm:h-[440px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                    alt="Luxury Beautician Elena Laurent Studio"
                    fill
                    priority
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent"></div>
                  
                  {/* Floating Overlay Badge on Main Image */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="font-script text-2xl text-blush-200">Signature Artistry</p>
                    <p className="font-serif text-lg font-semibold">Bridal Glow & Skin Perfection</p>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Treatment Cards matching user's reference layout */}
              
              {/* Card 1: Nails Card (Bottom Right overlap) */}
              <div className="absolute -bottom-10 -right-4 sm:-right-6 z-20 w-44 sm:w-52 rounded-2xl overflow-hidden shadow-luxury border-2 border-white bg-white transform hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-28 sm:h-32 w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80"
                    alt="Russian Gel Nails"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-2.5 left-3 text-white font-serif font-medium text-sm">
                    Russian Nails
                  </span>
                </div>
              </div>

              {/* Card 2: Eyelash Treatments Card (Top Left overlap) */}
              <div className="absolute -top-8 -left-4 sm:-left-8 z-20 w-40 sm:w-48 rounded-2xl overflow-hidden shadow-luxury border-2 border-white bg-white transform hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-28 sm:h-32 w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=400&q=80"
                    alt="Lash & Brow Enhancements"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-2.5 left-3 text-white font-serif font-medium text-sm">
                    Lash & Brow Art
                  </span>
                </div>
              </div>

              {/* Floating Verified Trust Pill */}
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-30 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-luxury border border-blush-200">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal-900">100% Sterile Protocol</p>
                  <p className="text-[10px] text-charcoal-800/70">Single-use surgical tools</p>
                </div>
              </div>

              {/* Floating Rating Pill */}
              <div className="absolute -top-4 right-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-luxury border border-blush-200 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-blush-500 fill-blush-500" />
                <span className="text-xs font-bold text-charcoal-900">Voted Best Salon 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Treatment Strip (Matching 2nd reference image) */}
        <div className="mt-20 pt-10 border-t border-blush-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blush-100 hover:border-blush-300 transition-all group">
            <span className="text-xs font-bold text-blush-600 uppercase tracking-widest">01 / Aesthetics</span>
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-1 group-hover:text-blush-600 transition-colors">Beauty Experts</h3>
            <p className="text-xs text-charcoal-800/70 mt-1 leading-relaxed">
              With over a decade of knowledge, offering master treatments and personalized skin diagnostics.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blush-100 hover:border-blush-300 transition-all group">
            <span className="text-xs font-bold text-blush-600 uppercase tracking-widest">02 / Precision</span>
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-1 group-hover:text-blush-600 transition-colors">An Eye For Detail</h3>
            <p className="text-xs text-charcoal-800/70 mt-1 leading-relaxed">
              We cover every microscopic detail so you experience a relaxing, flawless transformation.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blush-100 hover:border-blush-300 transition-all group">
            <span className="text-xs font-bold text-blush-600 uppercase tracking-widest">03 / Care</span>
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-1 group-hover:text-blush-600 transition-colors">Professional & Friendly</h3>
            <p className="text-xs text-charcoal-800/70 mt-1 leading-relaxed">
              Your time in our sanctuary feels homely, tranquil, and stress-free for your valued self-care.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-blush-100 hover:border-blush-300 transition-all group">
            <span className="text-xs font-bold text-blush-600 uppercase tracking-widest">04 / Sanctuary</span>
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-1 group-hover:text-blush-600 transition-colors">A Beautiful Setting</h3>
            <p className="text-xs text-charcoal-800/70 mt-1 leading-relaxed">
              Our bespoke salon is located in prime Beverly Hills with private valet and peaceful garden suites.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
