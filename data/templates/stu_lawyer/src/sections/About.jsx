import React from 'react';
import { MapPin, GraduationCap, Clock, Globe2, CheckCircle2, Compass, Award, Shield } from 'lucide-react';

export default function About(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.about || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const about = (data?.about && typeof data.about === 'object') ? data.about : data;

  const story = about?.story || about?.bio || "With a distinguished career rooted in top-tier appellate litigation and corporate strategy, I advise boardrooms on high-velocity transactions, corporate governance, and complex dispute resolution. My practice bridges rigorous statutory legal mastery with modern tech-forward business agility.";
  const mission = about?.mission || "To deliver uncompromising, result-driven legal leadership that safeguards capital, minimizes operational risk, and accelerates enterprise growth.";
  const values = Array.isArray(about?.values) && about.values.length > 0 ? about.values : ["Unwavering Integrity", "Strategic Foresight", "Transparent Advocacy", "Fiduciary Excellence"];
  const educationShort = about?.educationShort || "LL.M. Harvard Law School | J.D. Columbia University";
  const location = about?.location || "New York & London";
  const availability = about?.availability || "Available for Board Advisory & Retainers";
  const languages = Array.isArray(about?.languages) && about.languages.length > 0 ? about.languages : ["English (Native)", "French (Fluent)", "German (Conversational)"];
  const expertise = Array.isArray(about?.expertise) && about.expertise.length > 0 ? about.expertise : ["Corporate M&A", "Commercial Litigation", "Regulatory Compliance", "IP & Tech Law", "Risk Management"];

  return (
    <section id="about" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
              WHO I AM
            </span>
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Executive Profile & Core Principles
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] my-4 rounded-full" />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Combining high-level strategic foresight, uncompromising integrity, and a track record of driving tangible results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Story, Mission & Values */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-white p-8 border border-[#C89B3C]/30 shadow-luxury">
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
                <Compass className="w-6 h-6 text-[#C89B3C]" />
                <span>Professional Story & Vision</span>
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed font-sans font-light mb-6">
                {story}
              </p>

              <div className="p-4 bg-[#FAF8F4] border-l-4 border-[#C89B3C]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67D28] mb-1 font-sans">
                  Core Mission
                </h4>
                <p className="text-sm font-serif italic text-[#1A1A1A]">
                  "{mission}"
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="bg-white p-8 border border-[#C89B3C]/30 shadow-luxury">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#C89B3C]" />
                <span>Core Values & Operating Philosophy</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-[#FAF8F4] border border-[#C89B3C]/20"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0" />
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
            <div className="bg-white p-8 border-2 border-[#C89B3C]/50 shadow-gold-glow relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350]" />

              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] pb-4 border-b border-[#C89B3C]/20 mb-6 flex items-center justify-between">
                <span>Executive Overview</span>
                <Award className="w-6 h-6 text-[#C89B3C]" />
              </h3>

              <div className="flex flex-col gap-6 font-sans">
                {/* Education */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C89B3C]/10 text-[#A67D28] shrink-0">
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
                  <div className="p-3 bg-[#C89B3C]/10 text-[#A67D28] shrink-0">
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
                  <div className="p-3 bg-[#C89B3C]/10 text-[#A67D28] shrink-0">
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
                  <div className="p-3 bg-[#C89B3C]/10 text-[#A67D28] shrink-0">
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
                <div className="pt-4 border-t border-[#C89B3C]/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A67D28] block mb-3">
                    Industry Specializations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#FAF8F4] border border-[#C89B3C]/30 text-xs font-medium text-[#1A1A1A]"
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
