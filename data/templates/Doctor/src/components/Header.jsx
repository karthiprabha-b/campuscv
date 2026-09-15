import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ShieldCheck, Mail } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Header(props = {}) {
  const data = props?.data || props || {};
  const doctor = data?.doctor || data?.personal || data || {};
  const clinic = data?.clinic || doctor?.clinic || {};

  const phone = data?.contact?.phone || data?.phone || clinic?.phone || doctor?.phone || doctorProfile?.clinic?.phone || '+1 (617) 555-0194';
  const doctorName = data?.hero?.name || data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const honorific = data?.honorific || doctor?.honorific || (data?.hero?.name || data?.name || data?.fullName ? '' : (doctorProfile?.honorific || 'MD, FACP, FACC'));
  const primaryTitle = data?.hero?.role || data?.role || data?.primaryTitle || data?.headline || data?.title || data?.specialty || doctor?.primaryTitle || doctorProfile?.primaryTitle || 'Consultant Specialist';
  const availability = data?.hero?.availability || data?.availability || clinic?.emergencyNote || 'Verified Professional Practice • Available for Appointments';
  const primaryBtnLabel = data?.hero?.primaryButton?.label || data?.primaryButtonText || 'Contact Me';

  const initials = doctorName ? doctorName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DR';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const defaultOrder = ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Contact'];
  const dynamicSections = Array.isArray(props?.visibleSections) && props.visibleSections.length > 0
    ? props.visibleSections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : defaultOrder);

  const hasCerts = Array.isArray(data?.certifications) ? data.certifications.length > 0 : (Array.isArray(data?.certificates) && data.certificates.length > 0);
  const hasEdu = Array.isArray(data?.education) ? data.education.length > 0 : (data.education !== undefined ? false : true);
  const hasExp = Array.isArray(data?.experience) ? data.experience.length > 0 : (data.experience !== undefined ? false : true);
  const hasProj = Array.isArray(data?.projects) ? data.projects.length > 0 : (data.projects !== undefined ? false : true);
  const hasSkills = Array.isArray(data?.skills) ? data.skills.length > 0 : (data.skills !== undefined ? false : true);

  const navLinks = dynamicSections
    .filter(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const sLower = sName.toLowerCase().trim();
      if (sLower === 'header' || sLower === 'footer' || sLower === 'navbar' || !sLower) return false;
      if (props?.visibleSections) return true;
      if (sLower === 'certifications' || sLower === 'certificates') return hasCerts;
      if (sLower === 'education') return hasEdu;
      if (sLower === 'experience') return hasExp;
      if (sLower === 'projects') return hasProj;
      if (sLower === 'skills') return hasSkills;
      return true;
    })
    .map(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      const id = sName.toLowerCase().replace(/\s+/g, '-');
      const href = id === 'home' || id === 'hero' ? '#hero' : `#${id}`;
      return {
        label: cleanName === 'Hero' ? 'Home' : cleanName,
        href,
        id: id === 'home' ? 'hero' : id
      };
    });

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      setIsScrolled(window.scrollY > 15);

      const sectionIds = navLinks.map(l => l.id);

      for (const section of sectionIds) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navLinks]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/50'
      }`}
    >
      {/* Top Announcement Strip */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium text-slate-300 truncate" data-cv="hero.availability">
              {availability}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-sky-300 transition-colors font-medium text-slate-200 shrink-0"
              data-cv="contact.phone"
            >
              <Phone className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="whitespace-nowrap">{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Doctor Title */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-teal-700 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5 leading-tight">
                <span data-cv="hero.name">{doctorName}</span>
                {honorific && (
                  <span className="text-xs font-semibold text-sky-700 hidden xs:inline" data-cv="hero.honorific">
                    {honorific}
                  </span>
                )}
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
            {navLinks.map(link => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contact"
              data-cv="hero.primaryButton"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{primaryBtnLabel}</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'text-sky-700 bg-sky-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 text-white font-bold text-sm shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>{primaryBtnLabel}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
