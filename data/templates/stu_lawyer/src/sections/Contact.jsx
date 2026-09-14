import React from 'react';
import { Mail, Phone, MapPin, Clock, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';

export default function Contact(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.contact || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const hero = (data?.hero && typeof data.hero === 'object') ? data.hero : {};
  const about = (data?.about && typeof data.about === 'object') ? data.about : {};
  const contact = (data?.contact && typeof data.contact === 'object') ? data.contact : data;

  const name = hero?.name || data?.name || "Alexander Vance";
  const location = about?.location || contact?.location || data?.location || "New York & London";
  const socials = hero?.socials || data?.socials || {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    dribbble: "https://dribbble.com",
  };
  const email = contact?.email || data?.email || `contact@${String(name).toLowerCase().replace(/[^a-z0-9]/g, '') || 'vance'}.com`;
  const phone = contact?.phone || data?.phone || "+1 (212) 555-0198";

  return (
    <section id="contact" data-cv-section="contact" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              GET IN TOUCH
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Direct Contact Details
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Direct communications suite. Reach out via email, executive telephone line, or professional networks.
          </p>
        </div>

        <div 
          className="bg-white p-8 sm:p-12 border-2 shadow-gold-glow relative"
          style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.4)' }}
        >
          <div 
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b font-sans"
            style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
          >
            {/* Email */}
            <div className="flex items-start gap-4">
              <div 
                className="p-3 shrink-0"
                style={{
                  backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                  color: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Email Address
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-base font-semibold text-[#1A1A1A] hover:underline transition-colors"
                  style={{ color: '#1A1A1A' }}
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div 
                className="p-3 shrink-0"
                style={{
                  backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                  color: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Executive Telephone
                </span>
                <a
                  href={`tel:${phone}`}
                  className="text-base font-semibold text-[#1A1A1A] hover:underline transition-colors"
                  style={{ color: '#1A1A1A' }}
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div 
                className="p-3 shrink-0"
                style={{
                  backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                  color: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Primary Office Location
                </span>
                <p className="text-base font-semibold text-[#1A1A1A]">
                  {location}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div 
                className="p-3 shrink-0"
                style={{
                  backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                  color: 'var(--campuscv-accent, #C89B3C)'
                }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Response Window
                </span>
                <p className="text-base font-semibold text-[#1A1A1A]">
                  Mon - Fri | 09:00 AM - 07:00 PM EST
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
            <span 
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              Social Profiles & Portfolio Networks:
            </span>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, url: socials?.linkedin, name: 'LinkedIn' },
                { icon: Github, url: socials?.github, name: 'GitHub' },
                { icon: Twitter, url: socials?.twitter, name: 'Twitter' },
                { icon: Dribbble, url: socials?.dribbble, name: 'Dribbble' },
              ].map((soc, i) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border text-gray-600 hover:text-[var(--campuscv-accent,#C89B3C)] hover:border-[var(--campuscv-accent,#C89B3C)] transition-colors"
                    style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
                    aria-label={soc.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
