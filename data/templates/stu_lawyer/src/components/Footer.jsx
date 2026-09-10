import React from 'react';
import { Scale, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';

export default function Footer(props = {}) {
  const incoming = props?.data || props?.portfolio || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || "Alexander Vance";
  const title = hero?.title || data?.title || "Senior Legal Counsel & Partner";
  const socials = hero?.socials || data?.socials || {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    dribbble: "https://dribbble.com",
  };

  return (
    <footer className="bg-[#0B0F19] text-white border-t border-[#C89B3C]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#C89B3C]/20">
          
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A67D28] to-[#C89B3C] flex items-center justify-center text-[#0B0F19] shadow-gold-glow">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-white block">
                  {name}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#D5B350] uppercase font-sans">
                  {title}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-sm">
              Providing strategic counsel, corporate jurisprudence, and bespoke advisory designed to safeguard enterprise assets and drive tangible results.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Linkedin, url: socials?.linkedin, name: 'LinkedIn' },
                { icon: Github, url: socials?.github, name: 'GitHub' },
                { icon: Twitter, url: socials?.twitter, name: 'Twitter' },
                { icon: Dribbble, url: socials?.dribbble, name: 'Dribbble' },
              ].map((soc, i) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-[#C89B3C]/30 text-gray-300 hover:text-[#D5B350] hover:border-[#D5B350] transition-colors"
                    aria-label={soc.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D5B350]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#hero" className="hover:text-[#D5B350] transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-[#D5B350] transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-[#D5B350] transition-colors">Skills</a></li>
              <li><a href="#projects" className="hover:text-[#D5B350] transition-colors">Projects</a></li>
              <li><a href="#experience" className="hover:text-[#D5B350] transition-colors">Experience</a></li>
              <li><a href="#contact" className="hover:text-[#D5B350] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Practice Areas */}
          <div className="lg:col-span-4 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D5B350]">
              Expertise & Practice
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>Corporate Governance & M&A</li>
              <li>Commercial Litigation Defense</li>
              <li>Tech & IP Regulation</li>
              <li>Crisis Management & Compliance</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-sans">
          <p>© {new Date().getFullYear()} {name}. All Rights Reserved. Executive Luxury Edition.</p>
          <p className="text-gray-500">CampusCV Executive Portfolio Template</p>
        </div>

      </div>
    </footer>
  );
}
