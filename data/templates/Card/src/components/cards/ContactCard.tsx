'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import {
  Mail,
  Send,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowUp,
  MessageCircle,
  CalendarCheck,
  ExternalLink
} from 'lucide-react';

const DEFAULT_PROFILE = {
  name: "Alex Sterling",
  email: "alex.sterling.dev@example.com",
  timezone: "America/Los_Angeles",
  location: "San Francisco, CA (Open to Remote)",
  availability: "Available for Q4 Opportunities & Freelance",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

const DEFAULT_CONTACT = {
  email: "alex.sterling.dev@example.com",
  headline: "Let's build something extraordinary together.",
  subheadline: "Whether you have a groundbreaking product idea, an engineering architecture challenge, or an open high-impact role, my inbox is always open."
};

interface ContactCardProps {
  data?: any;
  cardNumber?: number;
  totalCards?: number;
  onScrollToTop?: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = React.memo(({
  data,
  cardNumber = 8,
  totalCards = 8,
  onScrollToTop
}) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const profile = data?.profile || data || {};
  const contactInfo = data?.contact || profile?.contact || {};
  const { accentClass } = useTheme();

  const title =
    contentOverrides['text:contact:root:div:title']?.value ||
    data?.contactTitle ||
    'Get in Touch';

  const email =
    contentOverrides['text:contact:root:a:email']?.value ||
    contentOverrides['text:contact:email']?.value ||
    profile?.email ||
    contactInfo?.email ||
    data?.email ||
    DEFAULT_PROFILE.email;

  const headline =
    contentOverrides['text:contact:root:h2:title']?.value ||
    contentOverrides['text:contact:headline']?.value ||
    contactInfo?.headline ||
    data?.contact?.headline ||
    data?.contactHeadline ||
    DEFAULT_CONTACT.headline;

  const subheadline =
    contentOverrides['text:contact:root:p:desc']?.value ||
    contentOverrides['text:contact:subheadline']?.value ||
    contactInfo?.subheadline ||
    contactInfo?.description ||
    data?.contact?.subheadline ||
    data?.contact?.description ||
    data?.contactDescription ||
    DEFAULT_CONTACT.subheadline;

  const timezone =
    contentOverrides['text:contact:root:span:timezone']?.value ||
    profile?.timezone ||
    data?.timezone ||
    DEFAULT_PROFILE.timezone;

  const location =
    contentOverrides['text:contact:root:span:location']?.value ||
    profile?.location ||
    data?.location ||
    DEFAULT_PROFILE.location;

  const availability =
    contentOverrides['text:contact:root:span:availability']?.value ||
    profile?.availability ||
    profile?.statusText ||
    DEFAULT_PROFILE.availability;

  const socials = profile?.socials || data?.socials || DEFAULT_PROFILE.socials;
  const github = socials?.github || data?.github || DEFAULT_PROFILE.socials.github;
  const linkedin = socials?.linkedin || data?.linkedin || DEFAULT_PROFILE.socials.linkedin;
  const twitter = socials?.twitter || data?.twitter || DEFAULT_PROFILE.socials.twitter;

  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setCurrentTime(timeStr);
      } catch {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      data-section="contact" 
      data-cv-section="contact" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:contact:root:section:0']}
    >
      {/* Background Accent Glow */}
      <div 
        className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 0{cardNumber} / 0{totalCards}</div>
            <h2 
              data-node-id="text:contact:root:div:title"
              data-node-type="text"
              data-cv="contact.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Local Time: {currentTime || '10:42 AM PST'}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6 my-auto" data-cv-section="contact">
        {/* Headline & Availability Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span data-cv="contact.availability">{availability}</span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">Response time: &lt; 24 hrs</span>
            </div>
            <h3 
              data-node-id="text:contact:root:h2:title"
              data-node-type="text"
              data-cv="contact.headline"
              className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
            >
              {headline}
            </h3>
            <p 
              data-node-id="text:contact:root:p:desc"
              data-node-type="text"
              data-cv="contact.subheadline"
              className="text-xs sm:text-sm text-zinc-400 leading-relaxed"
            >
              {subheadline}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href={`mailto:${email}`}
              data-node-id="button:contact:root:btn:email"
              data-node-type="button"
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r ${accentClass.gradient} shadow-lg shadow-black/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer`}
            >
              <Send className="w-4 h-4 pointer-events-none" />
              <span>Email Me</span>
            </a>
          </div>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Direct Email Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Mail className="w-4 h-4 text-violet-400 pointer-events-none" />
                <span>Direct Email</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white transition-all cursor-pointer"
                title="Copy Email"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 pointer-events-none" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <a
                href={`mailto:${email}`}
                data-node-id="text:contact:root:a:email"
                data-node-type="text"
                data-cv="contact.email"
                className="font-mono text-xs sm:text-sm text-white hover:underline break-all cursor-pointer"
              >
                {email}
              </a>
              <p className="text-[11px] text-zinc-400 mt-1">For business, projects, or speaking</p>
            </div>
          </div>

          {/* Location & Timezone Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <MapPin className="w-4 h-4 text-cyan-400 pointer-events-none" />
                <span>Location & Zone</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-mono text-zinc-400">
                Remote Ready
              </span>
            </div>

            <div>
              <div 
                data-node-id="text:contact:root:span:location"
                data-node-type="text"
                data-cv="contact.location"
                className="font-semibold text-sm text-white cursor-text"
              >
                {location}
              </div>
              <p 
                data-node-id="text:contact:root:span:timezone"
                data-node-type="text"
                data-cv="contact.timezone"
                className="text-[11px] text-zinc-400 font-mono mt-0.5 cursor-text"
              >
                {timezone}
              </p>
            </div>
          </div>

          {/* Social Profiles Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Globe className="w-4 h-4 text-emerald-400 pointer-events-none" />
                <span>Connect Online</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-[10px] font-mono text-emerald-400">
                Active
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="button:contact:root:a:github"
                  data-node-type="button"
                  data-cv="socials.github"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Github className="w-3.5 h-3.5 pointer-events-none" />
                  <span>GitHub</span>
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="button:contact:root:a:linkedin"
                  data-node-type="button"
                  data-cv="socials.linkedin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5 pointer-events-none" />
                  <span>LinkedIn</span>
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-node-id="button:contact:root:a:twitter"
                  data-node-type="button"
                  data-cv="socials.twitter"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  <Twitter className="w-3.5 h-3.5 pointer-events-none" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Back to Top */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onScrollToTop}
          className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-mono text-[11px]">Back to First Card</span>
        </button>
      </div>
    </div>
  );
});

ContactCard.displayName = 'ContactCard';
