import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Globe } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66Z" />
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" {...props}>
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export default function Footer({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  const clinic = data?.clinic || doctor?.clinic || {};

  const doctorName = data?.profile?.name || data?.hero?.name || data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const primaryTitle = data?.profile?.headline || data?.hero?.role || data?.role || data?.primaryTitle || data?.headline || data?.title || data?.specialty || doctor?.primaryTitle || doctorProfile?.primaryTitle || 'Consultant Specialist';
  const shortBio = data?.profile?.summary || data?.hero?.description || data?.shortBio || data?.bio || data?.summary || doctor?.shortBio || doctor?.bio || doctorProfile?.shortBio || '';
  
  const rawSocial = data?.profile?.socialLinks || data?.socialLinks || doctor?.socialLinks || data?.socials || doctor?.socials || data?.links;
  
  let linkedinUrl = '';
  let githubUrl = '';

  if (Array.isArray(rawSocial)) {
    for (const item of rawSocial) {
      const p = (typeof item === 'string' ? item : (item?.platform || item?.name || '')).toLowerCase();
      const u = typeof item === 'string' ? item : (item?.url || item?.link || '');
      if (p.includes('linkedin') || u.toLowerCase().includes('linkedin')) {
        linkedinUrl = u;
      } else if (p.includes('github') || u.toLowerCase().includes('github')) {
        githubUrl = u;
      }
    }
  } else if (typeof rawSocial === 'object' && rawSocial !== null) {
    linkedinUrl = rawSocial.linkedin || rawSocial.LinkedIn || rawSocial.linkedIn || '';
    githubUrl = rawSocial.github || rawSocial.Github || rawSocial.gitHub || rawSocial.GitHub || '';
  }

  if (!linkedinUrl) {
    linkedinUrl = data?.linkedin || doctor?.linkedin || data?.linkedIn || doctorProfile?.socialLinks?.find(s => s.platform?.toLowerCase() === 'linkedin')?.url || 'https://linkedin.com';
  }
  if (!githubUrl) {
    githubUrl = data?.github || doctor?.github || data?.gitHub || 'https://github.com';
  }

  const socialLinks = [
    { platform: 'LinkedIn', url: linkedinUrl, key: 'linkedin', Icon: LinkedInIcon },
    { platform: 'GitHub', url: githubUrl, key: 'github', Icon: GitHubIcon }
  ];

  const phone = data?.profile?.phone || data?.phone || clinic?.phone || doctor?.phone || doctorProfile?.clinic?.phone || '';
  const email = data?.profile?.email || data?.email || clinic?.email || doctor?.email || doctorProfile?.clinic?.email || '';
  const address = data?.profile?.location || clinic?.address || clinic?.addressLine1 || data?.location || data?.address || '';

  const initials = doctorName ? doctorName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DR';

  const scrollToTop = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const topEl = document.getElementById('hero') || document.querySelector('header') || document.getElementById('template-root') || document.body;
        if (topEl && typeof topEl.scrollIntoView === 'function') {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      try { window.scrollTo(0, 0); } catch (_) {}
    }
  };

  return (
    <footer
      id="footer"
      data-cv-section="footer"
      className="bg-slate-950 text-slate-300 pt-10 pb-8 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Clean 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-slate-800/80">
          {/* Col 1: Brand, Name & Bio */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {initials}
              </div>
              <div>
                <div
                  className="font-bold text-white text-lg tracking-tight"
                  data-cv="hero.name"
                >
                  {doctorName}
                </div>
                <div className="text-xs text-sky-400 font-medium" data-cv="hero.role">
                  {primaryTitle}
                </div>
              </div>
            </div>

            {shortBio && (
              <p
                className="text-xs text-slate-400 leading-relaxed max-w-md"
                data-cv="hero.description"
              >
                {shortBio}
              </p>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-sky-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-sky-400 transition-colors">About</a></li>
              <li><a href="#education" className="hover:text-sky-400 transition-colors">Education</a></li>
              <li><a href="#experience" className="hover:text-sky-400 transition-colors">Experience</a></li>
              <li><a href="#projects" className="hover:text-sky-400 transition-colors">Projects</a></li>
              <li><a href="#skills" className="hover:text-sky-400 transition-colors">Skills</a></li>
              <li><a href="#certifications" className="hover:text-sky-400 transition-colors">Certifications</a></li>
              <li><a href="#contact" className="hover:text-sky-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & Social Links */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Connect
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span data-cv="contact.location">{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white transition-colors"
                    data-cv="contact.phone"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition-colors break-all"
                    data-cv="contact.email"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>

            {/* Social & Web Links (LinkedIn & GitHub only) */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s, idx) => {
                    const IconComponent = s.Icon;
                    return (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors inline-flex items-center gap-1.5"
                        data-cv={`socialLinks.${s.key}`}
                        data-node-id={`link:social:${s.key}`}
                      >
                        <IconComponent className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{s.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clean Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <span data-cv="hero.name">{doctorName}</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
