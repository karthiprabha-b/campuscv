'use client';

import React, { useState } from 'react';
import { Mail, Check, Copy, MapPin, Calendar, Clock, Sparkles, ArrowRight, Github, Linkedin, Twitter, MessageCircle, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import SectionHeader from './SectionHeader';

export default function Contact() {
  const { contact, profile } = PORTFOLIO_DATA;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const directChannels = [
    { label: 'GitHub Profile', value: 'github.com', href: profile.github, icon: Github, tag: '5.2k+ Stars' },
    { label: 'LinkedIn Network', value: 'linkedin.com/in', href: profile.linkedin, icon: Linkedin, tag: 'Connect' },
    { label: 'Telegram Direct', value: contact.telegram, href: 'https://t.me', icon: MessageCircle, tag: 'Instant Msg' },
    { label: 'Twitter / X', value: '@alexmercer_dev', href: profile.twitter, icon: Twitter, tag: 'Follow' },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="DIRECT ENGAGEMENT"
          title="Start A Collaboration"
          subtitle="Whether you have an ambitious greenfield system to architect, a key staff engineering role, or high-throughput cloud infrastructure to scale, reach out directly"
        />

        {/* Direct Connection Hub Cards Grid (Message Box Removed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: 1-Click Email Card & Calendly Call Booking */}
          <div className="lg:col-span-6 bg-gradient-indigo-card text-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-12 shadow-deep-float flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-brightCyan"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-brightCyan">
                    Direct Electronic Mail
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Drop A Direct Line
                </h3>
                <p className="text-xs sm:text-sm text-cyber-200 mt-2 leading-relaxed font-sans">
                  {contact.subheading}
                </p>
              </div>

              {/* 1-Click Copy Email Pill */}
              <div className="p-4 sm:p-5 rounded-3xl bg-cyber-900/90 border border-cyber-700/60 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-cyan-pill flex items-center justify-center font-bold text-cyber-950 shrink-0 shadow-cyan-glow">
                    <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-cyber-950" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase text-cyber-300">Email Address</p>
                    <p className="text-xs sm:text-base font-bold text-white truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-cyber-800 hover:bg-cyber-700 text-white rounded-full transition-all text-xs font-mono font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-sm"
                  title="Copy Email to Clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-cyber-brightCyan" />
                      <span className="text-cyber-brightCyan">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Response SLA & Location Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-3xl bg-cyber-900/80 border border-cyber-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyber-800 text-cyber-brightCyan flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-cyber-300">Response SLA</p>
                    <p className="text-xs font-bold text-white">{contact.responseTime}</p>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-cyber-900/80 border border-cyber-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyber-800 text-cyber-brightCyan flex items-center justify-center font-bold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-cyber-300">Location</p>
                    <p className="text-xs font-bold text-white truncate">{contact.location.split('&')[0]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct 30-min Technical Call Booking */}
            <div className="pt-6 border-t border-cyber-700/60">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-cyan-glow flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK 30-MIN TECHNICAL CALL</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Engineering Channels & Availability Console */}
          <div className="lg:col-span-6 bg-slate-50 rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-12 border border-slate-200/80 shadow-soft-elevation flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-600"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-600">
                    Real-Time Channels
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  Connect Across Platforms
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-sans">
                  Connect directly on code repositories, professional networks, or instant messaging channels.
                </p>
              </div>

              {/* Channels List */}
              <div className="space-y-3">
                {directChannels.map((chan) => {
                  const Icon = chan.icon;
                  return (
                    <a
                      key={chan.label}
                      href={chan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-3xl bg-white hover:bg-cyber-50/70 border border-slate-200/80 hover:border-cyber-300 transition-all flex items-center justify-between gap-3 shadow-sm group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-gradient-cyan-pill group-hover:text-cyber-950 text-slate-700 flex items-center justify-center font-bold transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyber-600 transition-colors">
                            {chan.label}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {chan.value}
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold uppercase group-hover:bg-cyber-100 group-hover:text-cyber-800 transition-colors">
                        {chan.tag}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Direct Note */}
            <div className="p-4 rounded-3xl bg-cyber-50 border border-cyber-100 text-center">
              <p className="text-xs text-cyber-800 font-sans">
                Open to Contract Consulting, Advisory, and Senior Technical Staff Roles worldwide.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
