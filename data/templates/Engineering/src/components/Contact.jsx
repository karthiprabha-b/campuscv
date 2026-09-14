import React, { useState } from 'react';
import { Mail, Check, Copy, MapPin, Calendar, Clock, Sparkles, ArrowRight, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Contact({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { contact, profile } = norm;
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (contact.email && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const directChannels = [
    { label: 'GitHub Profile', value: 'github.com', href: profile.github, icon: Github, tag: 'Code Repo' },
    { label: 'LinkedIn Network', value: 'linkedin.com', href: profile.linkedin, icon: Linkedin, tag: 'Connect' },
    { label: 'Telegram Direct', value: contact.telegram || '@dev', href: 'https://t.me', icon: MessageCircle, tag: 'Instant Msg' },
    { label: 'Twitter / X', value: '@developer', href: profile.twitter, icon: Twitter, tag: 'Follow' },
  ];

  return (
    <section
      id="contact"
      data-node-id="section:contact:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="DIRECT ENGAGEMENT"
          title="Start A Collaboration"
          subtitle="Whether you have an ambitious greenfield system to architect, a key staff engineering role, or high-throughput cloud infrastructure to scale, reach out directly"
        />

        {/* Direct Connection Hub Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: 1-Click Email Card */}
          <div className="lg:col-span-6 bg-gradient-indigo-card text-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-12 shadow-deep-float flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-brightCyan"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-brightCyan">
                    Direct Electronic Mail
                  </span>
                </div>
                <h3
                  data-node-id="text:contact:title:0"
                  data-node-type="text"
                  className="text-2xl sm:text-3xl font-black font-display text-white"
                >
                  Drop A Direct Line
                </h3>
                <p
                  data-node-id="text:contact:subheading:0"
                  data-node-type="text"
                  className="text-xs sm:text-sm text-cyber-200 mt-2 leading-relaxed font-sans"
                >
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
                    <p
                      data-node-id="text:contact:email:0"
                      data-node-type="text"
                      data-cv="profile.email"
                      className="text-xs sm:text-base font-bold text-white truncate"
                    >
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
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase text-cyber-300">Base Station</p>
                    <p className="text-xs font-bold text-white truncate">{contact.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Mailto Action */}
            <div className="pt-4 border-t border-cyber-700/60">
              <a
                href={`mailto:${contact.email}`}
                className="w-full py-3 sm:py-4 px-6 rounded-full bg-gradient-cyan-pill text-cyber-950 font-bold uppercase text-xs sm:text-sm tracking-wider shadow-cyan-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <span>OPEN EMAIL CLIENT</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Direct Network & Social Channels */}
          <div className="lg:col-span-6 bg-slate-50 rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 lg:p-12 shadow-soft-elevation border border-slate-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-cyber-600"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-600">
                    Direct Network
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-950">
                  Online Footprint &amp; Socials
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-sans">
                  Connect across technical platforms, follow architecture soundbites, or review verified source repositories.
                </p>
              </div>

              {/* Channel Tiles List */}
              <div className="space-y-3">
                {directChannels.map((ch, idx) => {
                  const Icon = ch.icon;
                  return (
                    <a
                      key={idx}
                      href={ch.href || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-cyber-400 hover:shadow-soft-elevation transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-cyber-950 text-cyber-brightCyan group-hover:bg-gradient-cyan-pill group-hover:text-cyber-950 flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyber-600 transition-colors truncate">
                            {ch.label}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {ch.value}
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-slate-100 group-hover:bg-cyber-50 text-slate-700 group-hover:text-cyber-800 text-[10px] sm:text-[11px] font-mono font-bold uppercase shrink-0 transition-colors">
                        {ch.tag}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600 font-mono">
              <Sparkles className="w-4 h-4 text-cyber-600 shrink-0" />
              <span>Available for Staff Systems Roles &amp; High-Impact Technical Consulting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
