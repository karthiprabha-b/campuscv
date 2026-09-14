'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Cpu, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-6xl rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-cyber-950/90 backdrop-blur-xl border border-cyber-700/60 shadow-deep-float py-2.5 sm:py-3 px-4 sm:px-6' 
          : 'bg-cyber-950/70 backdrop-blur-md border border-white/15 py-3 sm:py-3.5 px-4 sm:px-8'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="#home" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-cyan-pill flex items-center justify-center font-bold text-cyber-950 shadow-cyan-glow group-hover:scale-105 transition-transform shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white text-sm sm:text-base md:text-lg tracking-tight truncate max-w-[150px] sm:max-w-none">
                {PORTFOLIO_DATA.profile.name}
              </span>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-cyber-900/80 p-1.5 rounded-full border border-cyber-700/50">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-cyan-pill text-cyber-950 font-bold shadow-cyan-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-cyan-pill text-cyber-950 text-xs font-bold uppercase tracking-wider shadow-cyan-glow hover:scale-105 transition-all shrink-0"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile/Tablet Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="#contact"
              className="sm:hidden px-3 py-1.5 rounded-full bg-gradient-cyan-pill text-cyber-950 text-xs font-bold shadow-sm"
            >
              Connect
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-cyber-700/60 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-full text-xs font-bold text-center transition-colors ${
                      isActive
                        ? 'bg-gradient-cyan-pill text-cyber-950'
                        : 'bg-cyber-900/90 text-white hover:bg-cyber-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
