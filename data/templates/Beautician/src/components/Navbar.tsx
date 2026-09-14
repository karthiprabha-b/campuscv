"use client";

import React, { useState, useEffect } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Sparkles, Menu, X, Calendar, Phone, MessageSquare } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["hero", "about", "education", "experience", "projects", "skills", "contact"];
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Education", href: "#education" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact & Location", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-3.5 shadow-sm"
            : "bg-white/90 md:bg-white/80 backdrop-blur-md py-5 border-b border-blush-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo matching reference aesthetic */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center text-blush-600 border border-blush-300 group-hover:bg-blush-500 group-hover:text-white transition-colors duration-300 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl sm:text-2xl tracking-wide text-charcoal-900 font-bold group-hover:text-blush-600 transition-colors">
              The Beauty Abode
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-blush-700 bg-blush-100/80 font-semibold shadow-xs"
                      : "text-charcoal-800/80 hover:text-blush-600 hover:bg-blush-50"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-800 hover:text-blush-600 hover:bg-blush-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6 pt-24 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            <div className="pb-4 border-b border-blush-100">
              <p className="font-serif text-xl font-bold text-charcoal-900">Elena Laurent</p>
              <p className="text-xs text-blush-600 font-medium">Master Aesthetician & Bridal Artist</p>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 text-base font-medium text-charcoal-800 hover:text-blush-600 hover:bg-blush-50 rounded-xl transition-colors"
              >
                <span>{link.name}</span>
                <span className="text-xs text-blush-400">→</span>
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-blush-100 space-y-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-blush-500 text-white font-semibold text-sm shadow-soft-pink hover:bg-blush-600 transition-all flex items-center justify-center gap-2"
            >
              <span>Get in Touch</span>
            </a>
            <a
              href={`https://wa.me/${portfolioData.beautician.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
