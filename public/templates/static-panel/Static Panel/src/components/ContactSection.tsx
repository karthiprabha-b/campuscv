"use client";

import React from "react";
import { Mail, Phone, MapPin, Copy, Calendar, Github, Linkedin, Twitter, Globe, ArrowUpRight } from "lucide-react";

interface ContactSectionProps {
  data?: any;
  onShowToast: (message: string) => void;
}

export default function ContactSection({ data = {}, onShowToast }: ContactSectionProps) {
  const email = data?.email || data?.ownerEmail || data?.contact?.email || data?.profile?.email || data?.basics?.email || "alex.rivera.cs@berkeley.edu";
  const phone = data?.phone || data?.contact?.phone || data?.profile?.phone || data?.basics?.phone || "+1 (510) 847-2931";
  const location = data?.location || data?.personal?.city || data?.basics?.location?.city || data?.contact?.location || "San Francisco, CA";

  const github = data?.socialLinks?.github || data?.socials?.github || data?.github || "https://github.com";
  const linkedin = data?.socialLinks?.linkedin || data?.socials?.linkedin || data?.linkedin || "https://linkedin.com";
  const twitter = data?.socialLinks?.twitter || data?.socialLinks?.x || data?.socials?.twitter || data?.twitter || "https://twitter.com";
  const website = data?.website || data?.portfolioUrl || data?.socialLinks?.website || "";

  const copyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (onShowToast) {
      onShowToast(`${label} copied to clipboard!`);
    }
  };

  return (
    <section id="contact" data-cv-section="contact" className="py-12 sm:py-16 scroll-mt-8">
      <div className="mb-8">
        <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2" data-cv="contact.eyebrow">
          Get In Touch & Connect
        </h2>
        <p className="text-base text-gray-600" data-cv="contact.description">
          Feel free to reach out directly via email, phone, or connect across professional networks.
        </p>
      </div>

      {/* Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Email Card */}
        {email && (
          <div
            onClick={() => copyText(email, "Email")}
            className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Direct Email</span>
              <span 
                className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-brand-600 transition-colors break-all"
                data-cv="contact.email"
              >
                {email}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-600 font-bold mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Response guaranteed within 24h</span>
            </p>
          </div>
        )}

        {/* Phone Card */}
        {phone && (
          <div
            onClick={() => copyText(phone, "Phone number")}
            className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Phone & Contact</span>
              <span 
                className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors"
                data-cv="contact.phone"
              >
                {phone}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-5 pt-4 border-t border-gray-100">
              Direct line & messages
            </p>
          </div>
        )}

        {/* Location & Availability */}
        {location && (
          <div className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Open to Remote & Hybrid
                </span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Location Base</span>
              <span 
                className="text-base sm:text-lg font-extrabold text-gray-900 block"
                data-cv="contact.location"
              >
                {location}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-5 pt-4 border-t border-gray-100">
              Open to opportunities & collaborations
            </p>
          </div>
        )}
      </div>

      {/* Social & Professional Network Links */}
      {(github || linkedin || twitter || website) && (
        <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-gray-200 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-2xs">
              <Calendar className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900">Professional Profiles</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Connect, inspect code repositories, or chat</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                data-cv="contact.github"
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cv="contact.linkedin"
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                data-cv="contact.twitter"
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Twitter className="w-4 h-4 text-sky-500" />
                <span>Twitter / X</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                data-cv="contact.website"
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Website</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
