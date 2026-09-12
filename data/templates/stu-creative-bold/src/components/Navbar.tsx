"use client";

import React, { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NavLink } from "@/data/portfolio";

interface NavbarProps {
  data?: any;
  navLinks?: NavLink[];
  name?: string;
}

export default function Navbar(props: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const rawName = props.data?.hero?.name || props.name || props.data?.name || props.data?.fullName || "PORTFOLIO";

  const defaultLinks: NavLink[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" }
  ];

  const links: NavLink[] = Array.isArray(props.navLinks) && props.navLinks.length > 0
    ? props.navLinks.filter(l => !l.label.toLowerCase().includes('service') && !l.label.toLowerCase().includes('tool'))
    : (Array.isArray(props.data?.navLinks) && props.data.navLinks.length > 0
      ? props.data.navLinks.filter((l: any) => !l.label.toLowerCase().includes('service') && !l.label.toLowerCase().includes('tool'))
      : defaultLinks);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#111111]/10 py-4 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#home"
          data-node-id="text:navbar:root:a:brand"
          className="text-xl md:text-2xl font-black tracking-tight text-[#111111] hover:text-[#FFC107] transition-colors duration-150 uppercase"
        >
          <span
            data-field="name"
            data-cv="profile.name"
            data-node-id="text:navbar:root:span:brand"
            data-node-type="text"
          >
            {rawName}
          </span>
        </a>

        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link: NavLink, idx: number) => (
            <a
              key={link.label || idx}
              href={link.href}
              className="relative text-base font-bold tracking-wide text-[#111111] hover:text-[#FFC107] transition-colors duration-150 group select-none"
            >
              {link.label}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-[#FFC107] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 bg-[#111111] text-[#FAF9F6] text-xs font-black tracking-wider uppercase border-2 border-[#111111] hover:bg-[#FFC107] hover:border-[#FFC107] hover:text-[#111111] transition-colors duration-150 shadow-sm rounded-xs cursor-pointer select-none"
          >
            {"Let's Talk"}
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 stroke-[3]" />
          </a>
        </div>

        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full text-[#111111] hover:bg-[#111111]/5 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FAF9F6] border-b border-[#111111]/10 shadow-xl px-6 py-8 flex flex-col space-y-6 md:hidden z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-4">
            {links.map((link: NavLink, idx: number) => (
              <a
                key={link.label || idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-[#111111] hover:text-[#FFC107] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#111111]/10">
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="w-full justify-center inline-flex items-center px-6 py-3 bg-[#111111] text-[#FAF9F6] text-sm font-black tracking-wider uppercase border border-[#111111] hover:bg-[#FFC107] hover:text-[#111111] transition-colors rounded-xs cursor-pointer"
            >
              {"Let's Talk"}
              <ArrowUpRight className="w-4.5 h-4.5 ml-2 stroke-[3]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
