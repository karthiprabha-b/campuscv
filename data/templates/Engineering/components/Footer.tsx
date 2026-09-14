'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Cpu, Github, Linkedin, Twitter } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function Footer() {
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    const homeEl = document.getElementById('home') || document.getElementById('hero') || document.querySelector('header') || document.body;
    if (homeEl && typeof homeEl.scrollIntoView === 'function') {
      homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
      document.body?.scrollTo?.({ top: 0, behavior: 'smooth' });
      try {
        let parent = document.querySelector('footer')?.parentElement;
        while (parent) {
          if (parent.scrollHeight > parent.clientHeight) {
            parent.scrollTo({ top: 0, behavior: 'smooth' });
          }
          parent = parent.parentElement;
        }
      } catch (err) {}
    }
  };

  return (
    <footer className="bg-cyber-950 text-white wave-top-curve pt-16 sm:pt-20 pb-10 sm:pb-12 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Glow Accent */}
      <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-cyber-800">
          {/* Col 1: Brand */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-cyan-pill flex items-center justify-center font-bold text-cyber-950 shadow-cyan-glow">
                <Cpu className="w-4 sm:w-5 h-4 sm:h-5 text-cyber-950" />
              </div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white">
                {PORTFOLIO_DATA.profile.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cyber-300 max-w-md leading-relaxed font-sans">
              Senior Full-Stack &amp; Systems Architect specializing in distributed cloud systems, high-concurrency microservices, and modern web applications.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={PORTFOLIO_DATA.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-cyber-900 hover:bg-gradient-cyan-pill hover:text-cyber-950 rounded-full text-cyber-200 transition-all border border-cyber-700/60"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-cyber-900 hover:bg-gradient-cyan-pill hover:text-cyber-950 rounded-full text-cyber-200 transition-all border border-cyber-700/60"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-cyber-900 hover:bg-gradient-cyan-pill hover:text-cyber-950 rounded-full text-cyber-200 transition-all border border-cyber-700/60"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-brightCyan">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-slate-300">
              <li>
                <Link href="#home" className="hover:text-cyber-brightCyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-cyber-brightCyan transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#education" className="hover:text-cyber-brightCyan transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-cyber-brightCyan transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-cyber-brightCyan transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#skills" className="hover:text-cyber-brightCyan transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="#certificates" className="hover:text-cyber-brightCyan transition-colors">
                  Certificates
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-cyber-brightCyan transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-brightCyan">
              Systems Dispatch
            </h4>
            <p className="text-xs text-cyber-300 leading-relaxed font-sans">
              Subscribe for periodic technical deep-dives on distributed architectures and high-throughput systems.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="developer@company.com"
                className="w-full px-4 py-2.5 bg-cyber-900 border border-cyber-700 rounded-full text-xs text-white placeholder:text-cyber-400 focus:outline-none focus:ring-2 focus:ring-cyber-brightCyan"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to Systems Dispatch!');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs tracking-wider shadow-cyan-glow hover:scale-105 transition-all"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-cyber-400">
          <p>© {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyber-900 hover:bg-gradient-cyan-pill hover:text-cyber-950 text-white border border-cyber-700 transition-all font-mono text-xs uppercase"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
