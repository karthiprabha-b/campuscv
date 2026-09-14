"use client";

import React from "react";
import { Linkedin, Github, Instagram, Twitter, ArrowUp, Mail, Phone, MapPin, Globe } from "lucide-react";
import { NavLink, ContactData } from "@/data/portfolio";

interface FooterProps {
  data?: any;
  contact?: Partial<ContactData>;
  navLinks?: NavLink[];
  name?: string;
}

export default function Footer(props: FooterProps = {}) {
  const contact = props.contact || props.data?.contact || {};
  const email = contact.email || props.data?.email || props.data?.ownerEmail || props.data?.personal?.email || props.data?.canonicalProfile?.personal?.email || props.data?.profile?.email || "";
  const phone = contact.phone || props.data?.phone || props.data?.phoneNumber || props.data?.personal?.phone || props.data?.canonicalProfile?.personal?.phone || props.data?.profile?.phone || "";
  const location = contact.location || props.data?.location || props.data?.personal?.location || props.data?.canonicalProfile?.personal?.city || props.data?.profile?.location || "";
  const socials = contact.socials || props.data?.socials || props.data?.socialLinks || props.data?.canonicalProfile?.social || props.data?.social || {};

  const rawName = props.name || props.data?.name || props.data?.fullName || props.data?.hero?.name || props.data?.personal?.fullName || props.data?.canonicalProfile?.personal?.fullName || "Portfolio";
  const brandName = rawName.toUpperCase().endsWith('.') ? rawName.toUpperCase() : `${rawName.toUpperCase().split(' ')[0]}.`;
  const professionTitle = props.data?.title || props.data?.hero?.title || props.data?.headline || props.data?.personal?.headline || props.data?.canonicalProfile?.personal?.headline || "Software Developer & Engineer";

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

  const hasSocials = Boolean(
    socials.linkedin || socials.github || socials.instagram || socials.twitter || socials.behance || (socials as any).website || (socials as any).dribbble
  );

  return (
    <footer
      style={{ backgroundColor: "#111111", color: "#ffffff" }}
      className="bg-[#111111] text-white border-t border-white/10 py-16 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight text-[#FFC107]">{brandName}</h3>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
            {professionTitle} crafting robust, high-performance digital applications.
          </p>
          {hasSocials && (
            <div
              data-field="contact.socials"
              data-cv="contact.socials"
              className="flex items-center space-x-3 pt-2"
            >
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
              {((socials as any).website || (socials as any).url) && (
                <a
                  href={(socials as any).website || (socials as any).url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/10 hover:bg-[#FFC107] hover:text-[#111111] rounded-full transition-all duration-200"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
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
                <a href={`mailto:${email}`} className="hover:text-[#FFC107] transition-colors break-all">{email}</a>
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
              <li className="text-gray-400 text-xs">Reach out via the contact section.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} {rawName}. All rights reserved.</p>
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
