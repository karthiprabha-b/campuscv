import React from 'react';
import { Sparkles, ShieldCheck, ArrowUp, Phone, MapPin } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Footer({ data = {} }) {
  const beautician = data?.contact || _default.contact || {};
  const name = 
    data?.contentOverrides?.['text:navbar:name']?.value ||
    data?.hero?.name || data?.name || data?.fullName || data?.personal?.name || _default.name || 'Elena Laurent';
  
  const firstName = name.split(' ')[0] || 'Elena';
  
  const location = 
    data?.contentOverrides?.['text:contact:location']?.value ||
    data?.contact?.location ||
    data?.contact?.address ||
    data?.location ||
    data?.address ||
    data?.personal?.location ||
    beautician?.location || '450 Rosemont Promenade, Beverly Hills, CA 90210';

  const phone = 
    data?.contentOverrides?.['text:contact:phone']?.value ||
    data?.contact?.phone ||
    data?.phone ||
    data?.telephone ||
    data?.personal?.phone ||
    beautician?.phone || '+1 (310) 892-4410';

  const phoneClean = (data?.contact?.phoneClean || data?.contact?.whatsapp || phone || '').replace(/\D/g, '');

  const scrollToTop = (e) => {
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
    <footer className="bg-[#140F11] text-white relative overflow-hidden pt-16 pb-12 border-t border-zinc-800">
      {/* Decorative ambient light */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-[#DF7A98]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Signature */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#DF7A98]/20 flex items-center justify-center text-pink-300 border border-pink-400/30">
                <Sparkles className="w-5 h-5 pointer-events-none" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">
                The Beauty Abode
              </span>
            </div>

            <p className="font-script text-2xl text-pink-300 italic">
              {name} • Haute Esthetics
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Premier private beauty atelier specializing in bespoke bridal glamour, clinical skin therapy, and luxury cosmetic architecture.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Medical Grade Sanitation
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-base text-pink-200">
              Sanctuary Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400 font-medium">
              <li>
                <a href="#hero" className="hover:text-pink-300 transition-colors">Home & Story</a>
              </li>
              <li>
                <a href="#about" className="hover:text-pink-300 transition-colors">About {firstName}</a>
              </li>
              <li>
                <a href="#education" className="hover:text-pink-300 transition-colors">Education & Credentials</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-pink-300 transition-colors">Career Journey</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-pink-300 transition-colors">Transformations & Portfolio</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-pink-300 transition-colors">Technical Skills</a>
              </li>
              <li>
                <a href="#certificates" className="hover:text-pink-300 transition-colors">Certifications & Honors</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-pink-300 transition-colors">Contact & Location</a>
              </li>
            </ul>
          </div>

          {/* Concierge Shortcuts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-base text-pink-200">
              Private Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <a href={`tel:${phoneClean || phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="w-full py-3 rounded-full bg-[#DF7A98] hover:bg-[#C95679] text-white font-semibold text-xs shadow-soft-pink transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} The Beauty Abode by {name}. All Rights Reserved.</p>
          
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-pink-300 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
