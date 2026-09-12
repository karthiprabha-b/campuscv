"use client";

import React from "react";
import { Linkedin, Github, Instagram, Twitter, ArrowUp, Mail, Phone, MapPin } from "lucide-react";
import { NavLink, ContactData } from "@/data/portfolio";

interface FooterProps {
  data?: any;
  contact?: Partial<ContactData>;
  navLinks?: NavLink[];
  name?: string;
}

export default function Footer(props: FooterProps = {}) {
  const contact = props.contact || props.data?.contact || {};
  const email = contact.email || props.data?.email || props.data?.profile?.email || props.data?.personalInfo?.email || props.data?.personal?.email || props.data?.basics?.email || "";
  const phone = contact.phone || props.data?.phone || props.data?.profile?.phone || props.data?.personalInfo?.phone || props.data?.personal?.phone || props.data?.basics?.phone || "";
  const location =
    contact.location ||
    props.data?.location ||
    props.data?.profile?.location ||
    props.data?.personalInfo?.location ||
    props.data?.personal?.location ||
    props.data?.basics?.location?.city ||
    props.data?.basics?.location?.address ||
    props.data?.basics?.location ||
    props.data?.city ||
    props.data?.address ||
    "";
  const socials = contact.socials || props.data?.socials || props.data?.socialLinks || {};

  const rawHeroName = props.data?.hero?.name;
  const isPlaceholderName = rawHeroName && (rawHeroName.includes('ANUSHKA') || rawHeroName.includes('Anushka') || rawHeroName === 'Portfolio' || rawHeroName === 'PORTFOLIO');
  const resolvedName = (!isPlaceholderName && rawHeroName) || props.name || props.data?.name || props.data?.fullName || props.data?.profile?.fullName || props.data?.profile?.name || props.data?.personalInfo?.name || props.data?.personal?.name || props.data?.basics?.name || "Portfolio";
  const brandName = resolvedName.toUpperCase();

  const rawTitle = props.data?.hero?.title || props.data?.title || props.data?.headline || props.data?.role || props.data?.profile?.headline || props.data?.personalInfo?.headline || props.data?.basics?.label || "Software Developer";
  const cleanTitle = rawTitle.replace(/\s*&\s*$/, '').trim();

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
    : defaultLinks;

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      style={{ backgroundColor: "#111111", color: "#ffffff" }}
      className="bg-[#111111] text-white border-t border-white/10 py-16 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h3
            data-field="name"
            data-cv="profile.name"
            data-node-id="text:footer:root:h3:brand"
            data-node-type="text"
            className="text-2xl font-black tracking-tight text-[#FFC107] uppercase"
          >
            {brandName}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
            {cleanTitle} — crafting robust, high-performance digital applications.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-[#FFC107] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-[#FFC107] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-[#FFC107] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 hover:bg-[#FFC107] hover:text-[#111111] rounded-full transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black tracking-wider uppercase text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {links.map((link: NavLink) => (
              <li key={link.label}>
                <a href={link.href} className="text-gray-300 hover:text-[#FFC107] text-xs sm:text-sm font-semibold transition-colors duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black tracking-wider uppercase text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-gray-300 font-medium">
            {email && (
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC107] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#FFC107] transition-colors">{email}</a>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC107] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-[#FFC107] transition-colors">{phone}</a>
              </li>
            )}
            {location && (
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC107] shrink-0" />
                <span>{location}</span>
              </li>
            )}
            {!email && !phone && !location && (
              <li className="text-gray-400">Reach out via the contact section.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} {resolvedName}. All rights reserved.</p>
        <button
          onClick={handleScrollToTop}
          className="mt-4 sm:mt-0 flex items-center space-x-1.5 text-gray-300 hover:text-[#FFC107] transition-colors duration-200 cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
