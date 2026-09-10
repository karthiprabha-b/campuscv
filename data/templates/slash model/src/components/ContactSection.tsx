'use client';

import React, { useState } from 'react';

interface ContactSectionProps {
  data?: any;
}

export default function ContactSection({ data = {} }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:contact:root:div:title']?.value ||
    data?.contactTitle ||
    'Contact Me';

  const heading = contentOverrides['text:contact:root:h3:heading']?.value ||
    data?.contact?.heading ||
    data?.collaborate?.heading ||
    "LET'S BUILD SOMETHING EXCEPTIONAL";

  const pitch = contentOverrides['text:contact:root:p:pitch']?.value ||
    data?.contact?.text ||
    data?.collaborate?.text ||
    'Whether you need modern frontend architecture, design system engineering, or full-scale web applications, I am ready to bring precision and craft to your team.';

  const email = contentOverrides['text:contact:root:a:email']?.value ||
    data?.profile?.email ||
    data?.email ||
    data?.contact?.email ||
    data?.personal?.email ||
    'tomasz.gajda@example.com';

  const location = contentOverrides['text:contact:root:div:location']?.value ||
    data?.profile?.location ||
    data?.location ||
    data?.contact?.location ||
    data?.contact?.city ||
    data?.personal?.city ||
    data?.personal?.location ||
    'Warsaw, Poland / Remote';

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section 
      id="contact" 
      data-section="contact"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:contact:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            data-node-id="text:contact:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:contact:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-800 mt-4 font-normal leading-relaxed">
            Have a project in mind, an engineering challenge, or want to collaborate? Get in touch directly through any channel below.
          </p>
        </div>

        {/* Contact Showcase Card */}
        <div 
          data-node-id="card:contact:root:container"
          data-node-type="card"
          className="max-w-4xl mx-auto bg-white border-4 border-black p-8 sm:p-12 lg:p-16 shadow-solid-lg text-center text-black"
          style={styleOverrides['card:contact:root:container']}
        >
          
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2.5 bg-neutral-100 border-2 border-black px-5 py-2 rounded-full text-xs sm:text-sm font-black text-black mb-8 shadow-solid-sm select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary,#10B981)] animate-pulse" />
            <span>Available for Freelance & Full-time Roles</span>
          </div>

          <h3 
            data-node-id="text:contact:root:h3:heading"
            data-node-type="text"
            className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-black uppercase tracking-tight mb-4"
            style={styleOverrides['text:contact:root:h3:heading']}
          >
            {heading}
          </h3>

          <p 
            data-node-id="text:contact:root:p:pitch"
            data-node-type="text"
            className="text-sm sm:text-base text-neutral-700 max-w-2xl mx-auto mb-12 leading-relaxed font-normal"
            style={styleOverrides['text:contact:root:p:pitch']}
          >
            {pitch}
          </p>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
            
            {/* Email Card */}
            <div className="border-3 border-black p-6 bg-neutral-50 flex items-center gap-4 shadow-solid-sm min-w-0">
              <div className="w-12 h-12 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-0.5">
                  Direct Email
                </div>
                <a 
                  href={`mailto:${email}`} 
                  data-node-id="text:contact:root:a:email"
                  data-node-type="text"
                  className="font-heading font-black text-sm sm:text-base text-black hover:underline block truncate no-underline"
                  title={email}
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="border-3 border-black p-6 bg-neutral-50 flex items-center gap-4 shadow-solid-sm min-w-0">
              <div className="w-12 h-12 bg-[var(--primary,#000000)] text-[var(--primary-foreground,#FFFFFF)] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase mb-0.5">
                  Location
                </div>
                <div 
                  data-node-id="text:contact:root:div:location"
                  data-node-type="text"
                  className="font-heading font-black text-sm sm:text-base text-black truncate"
                >
                  {location}
                </div>
              </div>
            </div>

          </div>

          {/* Symmetrical High-Impact Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={handleCopyEmail}
              data-node-id="button:contact:root:copy"
              data-node-type="button"
              className="btn-box w-full sm:w-auto py-4 px-9 text-xs sm:text-sm font-black tracking-widest shadow-solid-sm cursor-pointer"
            >
              {copied ? '✓ COPIED TO CLIPBOARD!' : '| COPY EMAIL ADDRESS |'}
            </button>
            <a
              href={`mailto:${email}`}
              data-node-id="button:contact:root:send"
              data-node-type="button"
              className="btn-box-outline w-full sm:w-auto py-4 px-9 text-xs sm:text-sm font-black tracking-widest no-underline"
            >
              | SEND DIRECT EMAIL |
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
