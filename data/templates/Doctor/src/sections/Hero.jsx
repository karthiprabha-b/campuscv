import React from 'react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, Building } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Hero({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  const clinic = data?.clinic || doctor?.clinic || {};

  const name = data?.hero?.name || data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const honorific = data?.honorific || doctor?.honorific || (data?.hero?.name || data?.name || data?.fullName ? '' : (doctorProfile?.honorific || 'MD, FACP, FACC'));
  const primaryTitle = data?.hero?.role || data?.role || data?.primaryTitle || data?.headline || data?.title || data?.specialty || doctor?.primaryTitle || doctorProfile?.primaryTitle || 'Consultant Specialist';
  
  // Safe availability without falling back to long role or headline strings
  let rawAvailability = data?.hero?.availability || data?.availability || clinic?.emergencyNote || doctor?.availability || '';
  if (!rawAvailability || rawAvailability.length > 50 || rawAvailability === primaryTitle) {
    rawAvailability = 'Verified Specialist • Available for Appointments';
  }
  const availability = rawAvailability;

  const headline = data?.hero?.headline || data?.hero?.title || data?.tagline || data?.headline || doctor?.tagline || (primaryTitle ? `${primaryTitle}` : 'Compassionate Care. Expert Medicine.');
  
  const rawBio = data?.hero?.description || data?.hero?.bio || data?.shortBio || data?.bio || data?.summary || data?.description || data?.about?.bio || doctor?.shortBio || doctor?.bio;
  const bio = rawBio 
    ? (typeof rawBio === 'string' ? rawBio : rawBio[0]) 
    : (name ? `Welcome to the professional medical portfolio of ${name}. ${primaryTitle}.` : `Welcome to the medical practice of ${name}. Compassionate, evidence-informed care and personalized clinical consultations.`);
  
  const heroPortrait = data?.hero?.profileImage || data?.hero?.image || data?.heroPortrait || data?.profileImage || data?.image || data?.avatarUrl || data?.photo || doctor?.heroPortrait || doctor?.profileImage || doctorProfile?.heroPortrait || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000';
  
  const rawCreds = Array.isArray(data?.keyCredentials) ? data.keyCredentials : (Array.isArray(data?.credentials) ? data.credentials : (Array.isArray(data?.skills) ? data.skills : (Array.isArray(doctor?.keyCredentials) ? doctor.keyCredentials : null)));
  const keyCredentials = (rawCreds && rawCreds.length > 0)
    ? rawCreds.map(c => typeof c === 'string' ? c : (c.name || c.title || c.skill || 'Specialist'))
    : (doctorProfile?.keyCredentials || ['Board Certified', 'Clinical Specialist']);
    
  const firstExp = Array.isArray(data?.experience) ? data.experience[0] : (Array.isArray(doctor?.experience) ? doctor.experience[0] : null);
  const affiliation = data?.affiliation || firstExp?.institution || firstExp?.organization || firstExp?.company || firstExp?.hospital || doctorProfile?.experience?.[0]?.institution || 'Academic Medical Center';

  const primaryBtnLabel = data?.hero?.primaryButton?.label || data?.primaryButtonText || 'Contact Office';
  const primaryBtnUrl = data?.hero?.primaryButton?.url || '#contact';
  const secondaryBtnLabel = data?.hero?.secondaryButton?.label || data?.secondaryButtonText || 'View Full Profile';
  const secondaryBtnUrl = data?.hero?.secondaryButton?.url || '#about';

  // Format headline into parts if separated by dot or newline for rich styling
  const splitHeadline = () => {
    if (!headline) return { part1: 'Compassionate Care.', part2: 'Expert Medicine.' };
    if (headline.includes('\n')) {
      const parts = headline.split('\n');
      return { part1: parts[0], part2: parts.slice(1).join(' ') };
    }
    if (headline.includes('. ') && headline.split('. ').length === 2) {
      const parts = headline.split('. ');
      return { part1: parts[0] + '.', part2: parts[1] };
    }
    if (headline.includes(' & ') && headline.split(' & ').length === 2) {
      const parts = headline.split(' & ');
      return { part1: parts[0] + ' &', part2: parts[1] };
    }
    return { part1: headline, part2: '' };
  };

  const { part1, part2 } = splitHeadline();

  return (
    <section
      id="hero"
      data-cv-section="hero"
      className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 medical-hero-gradient border-b border-slate-200/80"
    >
      {/* Soft light glow accents */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Sophisticated Portrait & Floating Profile Card */}
          <div className="lg:col-span-5 relative flex justify-center order-2 lg:order-1 px-2 sm:px-4">
            <div className="relative w-full max-w-[290px] xs:max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/5]">
              {/* Decorative light gradient border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-400/20 via-teal-300/20 to-sky-200/40 transform -rotate-1 scale-102 filter blur-sm" />

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                <img
                  src={heroPortrait}
                  alt={`${name} - ${primaryTitle}`}
                  data-cv="hero.profileImage"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Embedded profile badge inside image base */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <div
                      className="text-xs sm:text-sm font-bold text-slate-900 truncate"
                      data-cv="doctor.name"
                    >
                      {name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Intro */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left order-1 lg:order-2">
            {/* Name Eyebrow */}
            <div className="text-xs sm:text-sm uppercase font-extrabold tracking-widest text-sky-700 block">
              <span data-cv="hero.name" className="text-slate-900 font-extrabold">{name}</span>
              {honorific && <span className="text-sky-600 ml-1 font-bold" data-cv="hero.honorific">, {honorific}</span>}
            </div>

            {/* Role & Main Headline */}
            <div className="space-y-2.5 sm:space-y-3">
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] sm:leading-[1.12]"
                data-cv="hero.headline"
              >
                {part1} {part2 && <br className="hidden xs:inline" />}
                {part2 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-teal-700 to-sky-900">
                    {part2}
                  </span>
                ) : null}
              </h1>
              <p
                className="text-sm sm:text-base lg:text-lg font-normal text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                data-cv="hero.description"
              >
                {bio}
              </p>
            </div>

            {/* Quick credentials / skills pill tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 pt-1 text-xs text-slate-700">
              {keyCredentials.slice(0, 4).map((cred, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{cred}</span>
                </span>
              ))}
            </div>

            {/* Key Clinical Affiliation Line */}
            <div className="pt-4 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="text-center sm:text-left">
                  Affiliated with <strong>{affiliation}</strong>
                </span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{data?.availability || 'Accepting New Inquiries & Consultations'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
