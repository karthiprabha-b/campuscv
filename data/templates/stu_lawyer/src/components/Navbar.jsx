import React, { useState, useEffect } from 'react';
import { Scale, Briefcase, Menu, X } from 'lucide-react';

export default function Navbar(props = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const incoming = props?.data || props?.portfolio || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : data;

  const name = hero?.name || data?.name || data?.personalInfo?.name || "Alexander Vance";
  const rawTitle = hero?.title || data?.title || data?.personalInfo?.title || "Executive Legal Counsel";
  const title = String(rawTitle || "Executive Legal Counsel");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-luxury py-3 border-b border-[#C89B3C]/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Branding & Logo */}
        <a href="#hero" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-[#A67D28] to-[#C89B3C] flex items-center justify-center text-white shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#A67D28] transition-colors">
              {name}
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#A67D28] uppercase font-sans">
              {title.split('&')[0]}
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest font-semibold text-[#1A1A1A]/80 hover:text-[#A67D28] transition-colors duration-200 relative py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:brightness-105 transition-all border border-[#C89B3C]"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#C89B3C]/40 text-[#1A1A1A]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#C89B3C]/30 px-6 py-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-[#1A1A1A] hover:text-[#A67D28] py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#C89B3C]/20">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] text-xs font-bold uppercase tracking-wider"
              >
                <Briefcase className="w-4 h-4" />
                <span>Hire Me</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
