import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Calendar, Phone, MessageSquare } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Navbar({ data = {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const name = 
    data?.contentOverrides?.['text:navbar:name']?.value ||
    data?.hero?.name || data?.name || data?.fullName || _default.name || 'Elena Laurent';

  const brandTitle = 
    data?.contentOverrides?.['text:navbar:brand']?.value ||
    'The Beauty Abode';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 200;

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

  const defaultOrder = ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];
  const dynamicSections = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
    ? data.sectionOrder
    : defaultOrder;

  const navLinks = dynamicSections
    .filter(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      return sName.toLowerCase() !== 'header' && sName.toLowerCase() !== 'footer' && sName.toLowerCase() !== 'navbar';
    })
    .map(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      const id = sName.toLowerCase().replace(/\s+/g, '-');
      const href = id === 'home' || id === 'hero' ? '#hero' : `#${id}`;
      return {
        name: cleanName === 'Hero' ? 'Home' : cleanName,
        href
      };
    });

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 shadow-sm bg-white/95 backdrop-blur-md'
            : 'bg-white/90 md:bg-white/80 backdrop-blur-md py-5 border-b border-pink-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FCEEF3] flex items-center justify-center text-[#DF7A98] border border-pink-300 group-hover:bg-[#DF7A98] group-hover:text-white transition-colors duration-300 shadow-sm">
              <Sparkles className="w-5 h-5 pointer-events-none" />
            </div>
            <span 
              data-node-id="text:navbar:brand"
              data-node-type="text"
              className="font-serif text-xl sm:text-2xl tracking-wide text-zinc-900 font-bold group-hover:text-[#DF7A98] transition-colors cursor-text"
            >
              {brandTitle}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-[#84354D] bg-[#F8D7E3] font-semibold shadow-xs'
                      : 'text-zinc-700 hover:text-[#DF7A98] hover:bg-pink-50'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Contact Direct Link on Nav */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-full bg-[#DF7A98] hover:bg-[#C95679] text-white font-semibold text-xs shadow-soft-pink transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-800 hover:text-[#DF7A98] hover:bg-pink-50 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#1E1B1D]/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6 pt-24 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            <div className="pb-4 border-b border-pink-100">
              <p className="font-serif text-xl font-bold text-zinc-900">{name}</p>
              <p className="text-xs text-[#DF7A98] font-medium">Master Aesthetician & Bridal Artist</p>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 text-base font-medium text-zinc-800 hover:text-[#DF7A98] hover:bg-pink-50 rounded-xl transition-colors"
              >
                <span>{link.name}</span>
                <span className="text-xs text-pink-400">→</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-pink-100 space-y-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#DF7A98] text-white font-semibold text-sm shadow-soft-pink hover:bg-[#C95679] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
