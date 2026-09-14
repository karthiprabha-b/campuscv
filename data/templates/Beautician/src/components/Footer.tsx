"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import { Sparkles, Heart, ShieldCheck, ArrowUp, Phone, MapPin } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const topEl = document.getElementById('hero') || document.querySelector('header') || document.getElementById('template-root') || document.body;
        if (topEl && typeof topEl.scrollIntoView === 'function') {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      try { window.scrollTo(0, 0); } catch (_) {}
    }
  };

  return (
    <footer className="bg-charcoal-950 text-white relative overflow-hidden pt-16 pb-12 border-t border-charcoal-800">
      {/* Decorative subtle ambient light */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-blush-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-charcoal-800/80">
          {/* Brand Signature */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blush-500/20 flex items-center justify-center text-blush-400 border border-blush-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">
                The Beauty Abode
              </span>
            </div>

            <p className="font-script text-2xl text-blush-300 italic">
              Elena Laurent • Haute Esthetics
            </p>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              Beverly Hills premier private beauty atelier specializing in bespoke bridal glamour, clinical skin therapy, and Russian volume architecture.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Medical Grade Sanitation
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-blush-200">
              Sanctuary Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300 font-medium">
              <li>
                <a href="#hero" className="hover:text-blush-400 transition-colors">Home & Story</a>
              </li>
              <li>
                <a href="#about" className="hover:text-blush-400 transition-colors">About Elena</a>
              </li>
              <li>
                <a href="#education" className="hover:text-blush-400 transition-colors">Education & Credentials</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-blush-400 transition-colors">Career Journey</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-blush-400 transition-colors">Transformations & Portfolio</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-blush-400 transition-colors">Technical Skills</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blush-400 transition-colors">Contact & Location</a>
              </li>
            </ul>
          </div>

          {/* Concierge Shortcuts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-base text-blush-200">
              Private Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blush-400 flex-shrink-0" />
                <span>{portfolioData.beautician.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blush-400 flex-shrink-0" />
                <a href={`tel:${portfolioData.beautician.phoneClean}`} className="hover:text-white transition-colors">
                  {portfolioData.beautician.phone}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="w-full py-3 rounded-full bg-blush-500 hover:bg-blush-600 text-white font-semibold text-xs shadow-soft-pink transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} The Beauty Abode by Elena Laurent. All Rights Reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-blush-300 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
