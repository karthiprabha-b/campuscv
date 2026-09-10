import React, { useState } from 'react';
import { Globe, Mail, ChevronDown, ChevronUp, ArrowRight, Sparkles, Quote } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function About({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};

  const name = data?.hero?.name || data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const primaryTitle = data?.hero?.role || data?.role || data?.primaryTitle || data?.headline || data?.title || data?.specialty || doctor?.primaryTitle || doctorProfile?.primaryTitle || 'Consultant Specialist';
  
  const eyebrow = data?.about?.eyebrow || data?.aboutEyebrow || 'About Me';
  const title = data?.about?.title || data?.aboutTitle || `About ${name}`;

  // Format bio whether string or array
  const rawBio = data?.about?.description || data?.about?.bio || data?.fullBio || data?.bio || data?.summary || doctor?.fullBio || doctor?.bio || doctorProfile?.fullBio;
  let fullBio = [];
  if (Array.isArray(rawBio) && rawBio.length > 0) {
    fullBio = rawBio;
  } else if (typeof rawBio === 'string' && rawBio.trim().length > 0) {
    const paragraphs = rawBio.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    fullBio = paragraphs.length > 0 ? paragraphs : [rawBio];
  } else {
    fullBio = doctorProfile?.fullBio || ['Dedicated specialist focusing on rigorous methodology, innovation, and client-centered care.'];
  }

  const medicalPhilosophy = doctor?.medicalPhilosophy || data?.medicalPhilosophy || {
    quote: data?.quote || data?.hero?.quote || doctorProfile?.medicalPhilosophy?.quote || '',
    authorAttribution: name
  };

  const rawLanguages = data?.languages || doctor?.languages || doctorProfile?.languages;
  const languages = (Array.isArray(rawLanguages) && rawLanguages.length > 0)
    ? rawLanguages
    : (doctorProfile?.languages || ['English']);

  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <section
      id="about"
      data-cv-section="about"
      className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 sm:space-y-8">
          
          {/* Eyebrow & Main Headings (Centered) */}
          <div className="space-y-3">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200"
              data-cv="about.eyebrow"
            >
              {eyebrow}
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
              data-cv="about.title"
            >
              {title}
            </h2>
            <p
              className="text-xs sm:text-sm lg:text-base font-semibold text-sky-800"
              data-cv="hero.role"
            >
              {primaryTitle}
            </p>
          </div>

          {/* Bio Narrative (Centered & Max Width for Peak Readability) */}
          <div
            className="max-w-3xl mx-auto space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed"
            data-cv="about.description"
          >
            <p>{fullBio[0] || ''}</p>
            {fullBio[1] && <p>{fullBio[1]}</p>}

            {showFullBio && fullBio[2] && (
              <div className="space-y-4 animate-fadeIn">
                <p>{fullBio[2]}</p>
                {medicalPhilosophy?.quote && (
                  <div className="p-5 rounded-2xl bg-sky-50/90 border border-sky-100 text-slate-800 space-y-2 text-left max-w-2xl mx-auto">
                    <div className="flex items-center gap-1.5 font-bold text-sky-950 text-xs uppercase tracking-wider">
                      <Quote className="w-3.5 h-3.5 text-sky-600" />
                      <span>Philosophy & Values</span>
                    </div>
                    <p className="italic text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                      &ldquo;{medicalPhilosophy.quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            {fullBio[2] && (
              <div className="pt-1">
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{showFullBio ? 'Read Less' : 'Read Full Profile & Philosophy'}</span>
                  {showFullBio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Languages Spoken (Centered) */}
          {languages && languages.length > 0 && (
            <div
              className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-600"
              data-cv="about.languages"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Languages:</span>
              </div>
              <span className="text-slate-600">{languages.join(' • ')}</span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
