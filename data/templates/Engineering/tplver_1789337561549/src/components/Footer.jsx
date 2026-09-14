import React from 'react';
import { Cpu, ArrowUp, Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';

export default function Footer({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { profile } = norm;

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      data-node-id="section:footer:root:section:0"
      data-node-type="section"
      className="bg-[#030712] text-white pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 wave-top-curve relative overflow-hidden"
      style={{ backgroundColor: '#030712', color: '#ffffff' }}
    >
      {/* Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* Top Dispatch Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-gradient-cyan-pill flex items-center justify-center font-bold text-slate-950 shadow-cyan-glow shrink-0">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span
                data-node-id="text:footer:brand:name:0"
                data-node-type="text"
                data-cv="profile.name"
                className="font-display font-black text-xl sm:text-2xl text-white tracking-tight"
              >
                {profile.name}
              </span>
              <p
                data-node-id="text:footer:brand:title:0"
                data-node-type="text"
                data-cv="profile.title"
                className="text-xs text-cyan-300 font-mono mt-0.5"
              >
                {profile.title || 'Senior Full-Stack & Systems Architect'}
              </p>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors border border-slate-800"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Back to Top Floating Button */}
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-slate-900 hover:bg-gradient-cyan-pill hover:text-slate-950 text-white border border-slate-700/60 shadow-md flex items-center justify-center transition-all hover:scale-105 shrink-0"
            aria-label="Back to Top"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Metadata & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono text-center sm:text-left">
          <p className="text-slate-400">
            © {new Date().getFullYear()} {profile.name}. All systems operational.
          </p>

          <div className="flex items-center gap-4">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
