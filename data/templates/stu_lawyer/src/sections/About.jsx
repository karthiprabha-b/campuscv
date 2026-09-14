import React from 'react';
import { MapPin, GraduationCap, Clock, Globe2, CheckCircle2, Compass, Award, Shield } from 'lucide-react';

export default function About(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.about || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const about = (data?.about && typeof data.about === 'object') ? data.about : data;

  const story = about?.story || about?.bio || data?.profile?.about || "With a distinguished career rooted in top-tier appellate litigation and corporate strategy, I advise boardrooms on high-velocity transactions, corporate governance, and complex dispute resolution. My practice bridges rigorous statutory legal mastery with modern tech-forward business agility.";
  const mission = about?.mission || "To deliver uncompromising, result-driven legal leadership that safeguards capital, minimizes operational risk, and accelerates enterprise growth.";
  const values = Array.isArray(about?.values) && about.values.length > 0 ? about.values : ["Unwavering Integrity", "Strategic Foresight", "Transparent Advocacy", "Fiduciary Excellence"];
  const educationShort = about?.educationShort || "LL.M. Harvard Law School | J.D. Columbia University";
  const location = about?.location || data?.contact?.location || data?.location || "New York & London";
  const availability = about?.availability || data?.hero?.availability || "Available for Board Advisory & Retainers";
  const languages = Array.isArray(about?.languages) && about.languages.length > 0 ? about.languages : ["English (Native)", "French (Fluent)", "German (Conversational)"];
  const expertise = Array.isArray(about?.expertise) && about.expertise.length > 0 ? about.expertise : ["Corporate M&A", "Commercial Litigation", "Regulatory Compliance", "IP & Tech Law", "Risk Management"];

  return (
    <section id="about" data-cv-section="about" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              WHO I AM
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Executive Profile & Core Principles
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Combining high-level strategic foresight, uncompromising integrity, and a track record of driving tangible results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Story, Mission & Values */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div 
              className="bg-white p-8 border shadow-luxury"
              style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
            >
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
                <Compass className="w-6 h-6" style={{ color: 'var(--campuscv-accent, #C89B3C)' }} />
                <span>Professional Story & Vision</span>
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed font-sans font-light mb-6">
                {story}
              </p>

              <div 
                className="p-4 bg-[#FAF8F4] border-l-4"
                style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
              >
                <h4 
                  className="text-xs font-bold uppercase tracking-wider mb-1 font-sans"
                  style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                >
                  Core Mission
                </h4>
                <p className="text-sm font-serif italic text-[#1A1A1A]">
                  "{mission}"
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div 
              className="bg-white p-8 border shadow-luxury"
              style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
            >
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5" style={{ color: 'var(--campuscv-accent, #C89B3C)' }} />
                <span>Core Values & Operating Philosophy</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-[#FAF8F4] border"
                    style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--campuscv-accent, #C89B3C)' }} />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] font-sans">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Executive Overview Card */}
          <div className="lg:col-span-5">
            <div 
              className="bg-white p-8 border-2 shadow-gold-glow relative"
              style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.45)' }}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
                }}
              />

              <h3 
                className="font-serif text-2xl font-bold text-[#1A1A1A] pb-4 border-b mb-6 flex items-center justify-between"
                style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
              >
                <span>Executive Overview</span>
                <Award className="w-6 h-6" style={{ color: 'var(--campuscv-accent, #C89B3C)' }} />
              </h3>

              <div className="flex flex-col gap-6 font-sans">
                {/* Education */}
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 shrink-0"
                    style={{
                      backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                      color: 'var(--campuscv-accent, #C89B3C)'
                    }}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                      Education & Credentials
                    </span>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {educationShort}
                    </p>
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
                      Primary Practice Location
                    </span>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {location}
                    </p>
                  </div>
                </div>

                {/* Availability */}
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
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Current Availability
                    </span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700">
                        {availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 shrink-0"
                    style={{
                      backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                      color: 'var(--campuscv-accent, #C89B3C)'
                    }}
                  >
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Languages Spoken
                    </span>
                    <p className="text-sm text-[#1A1A1A]">
                      {languages.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Industry Expertise */}
                <div 
                  className="pt-4 border-t"
                  style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
                >
                  <span 
                    className="text-xs font-bold uppercase tracking-wider block mb-3"
                    style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                  >
                    Industry Specializations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#FAF8F4] border text-xs font-medium text-[#1A1A1A]"
                        style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
