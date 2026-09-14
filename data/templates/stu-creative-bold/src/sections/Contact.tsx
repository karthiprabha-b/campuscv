"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Instagram, Twitter, Globe } from "lucide-react";
import { ContactData } from "@/data/portfolio";

interface ContactProps {
  data?: any;
  contact?: Partial<ContactData>;
  email?: string;
  phone?: string;
  location?: string;
}

export default function Contact(props: ContactProps = {}) {
  const contact: ContactData = {
    email: props.email || props.contact?.email || props.data?.contact?.email || props.data?.email || props.data?.ownerEmail || props.data?.personal?.email || props.data?.canonicalProfile?.personal?.email || props.data?.profile?.email || "",
    phone: props.phone || props.contact?.phone || props.data?.contact?.phone || props.data?.phone || props.data?.phoneNumber || props.data?.personal?.phone || props.data?.canonicalProfile?.personal?.phone || props.data?.profile?.phone || "",
    location: props.location || props.contact?.location || props.data?.contact?.location || props.data?.location || props.data?.personal?.location || props.data?.canonicalProfile?.personal?.city || props.data?.profile?.location || "",
    socials: props.contact?.socials || props.data?.contact?.socials || props.data?.socials || props.data?.socialLinks || props.data?.canonicalProfile?.social || props.data?.social || {}
  };

  const socials = contact.socials || {};
  const hasSocials = Boolean(
    socials.linkedin || socials.github || socials.instagram || socials.twitter || socials.behance || (socials as any).dribbble || (socials as any).portfolio || (socials as any).website
  );

  return (
    <section
      id="contact"
      data-section="contact"
      data-cv-section="contact"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex flex-col items-center space-y-3 mb-10">
          <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
            Get in Touch
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]"
            style={{ lineHeight: 1.15, letterSpacing: '0.01em' }}
          >
            CONTACT DETAILS
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
        </div>

        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mb-10">
          Have an exciting project idea, a job opportunity, or just want to say hi? Reach out directly via mail or phone.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center w-full max-w-3xl">
          {/* Email */}
          {contact.email && (
            <div className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-300 shadow-sm flex-1 min-w-[240px]">
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <Mail className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Email</h4>
                <a
                  href={`mailto:${contact.email}`}
                  data-field="contact.email"
                  data-cv="contact.email"
                  className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#FFC107] transition-colors break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}

          {/* Phone */}
          {contact.phone && (
            <div className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-300 shadow-sm flex-1 min-w-[240px]">
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <Phone className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Phone</h4>
                <a
                  href={`tel:${contact.phone}`}
                  data-field="contact.phone"
                  data-cv="contact.phone"
                  className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#FFC107] transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {/* Location */}
          {contact.location && (
            <div className="flex items-center space-x-4 p-5 bg-white border border-[#111111]/10 rounded-md hover:border-[#FFC107] transition-colors duration-300 shadow-sm flex-1 min-w-[240px]">
              <div
                className="p-3 rounded-full text-[#111111] shrink-0"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.2)" }}
              >
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#666666] tracking-wider uppercase">Location</h4>
                <span
                  data-field="contact.location"
                  data-cv="contact.location"
                  className="text-xs sm:text-sm font-bold text-[#111111]"
                >
                  {contact.location}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Social Links Row if present */}
        {hasSocials && (
          <div
            data-field="contact.socials"
            data-cv="contact.socials"
            className="flex items-center justify-center space-x-4 mt-8"
          >
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white border border-[#111111]/10 hover:border-[#FFC107] hover:bg-[#FFC107] text-[#111111] rounded-full transition-all duration-200 shadow-sm"
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
                className="p-3 bg-white border border-[#111111]/10 hover:border-[#FFC107] hover:bg-[#FFC107] text-[#111111] rounded-full transition-all duration-200 shadow-sm"
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
                className="p-3 bg-white border border-[#111111]/10 hover:border-[#FFC107] hover:bg-[#FFC107] text-[#111111] rounded-full transition-all duration-200 shadow-sm"
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
                className="p-3 bg-white border border-[#111111]/10 hover:border-[#FFC107] hover:bg-[#FFC107] text-[#111111] rounded-full transition-all duration-200 shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {((socials as any).portfolio || (socials as any).website || (socials as any).dribbble || (socials as any).behance) && (
              <a
                href={(socials as any).portfolio || (socials as any).website || (socials as any).dribbble || (socials as any).behance}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white border border-[#111111]/10 hover:border-[#FFC107] hover:bg-[#FFC107] text-[#111111] rounded-full transition-all duration-200 shadow-sm"
                aria-label="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
