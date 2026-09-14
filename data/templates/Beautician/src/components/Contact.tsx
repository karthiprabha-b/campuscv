"use client";

import React from "react";
import { portfolioData } from "@/data/portfolioData";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
  Car,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Contact() {
  const { beautician } = portfolioData;

  return (
    <section id="contact" className="py-24 bg-[#FAF7F5] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blush-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-champagne-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-white px-4 py-1.5 rounded-full border border-blush-200 inline-block shadow-xs">
            Direct Contact & Studio Visits
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            Connect With Elena Laurent
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            For bridal consultations, dermal skin therapy, or studio appointments, reach out directly through our channels below.
          </p>
        </div>

        {/* Main Grid: Direct Channels & Studio Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct Consultation & Inquiries */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Direct Studio Inquiries Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-blush-200 shadow-luxury space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 text-blush-800 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blush-600" />
                  <span>Direct Inquiries & Consultations</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 leading-tight">
                  Reach Out to the Sanctuary
                </h3>

                <p className="text-sm text-charcoal-800/80 leading-relaxed font-normal">
                  For bridal styling, personalized dermal skin therapy, or studio visits, connect with our private concierge team with zero waiting time.
                </p>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${beautician.whatsapp}?text=Hello%20Elena,%20I%20would%20like%20to%20inquire%20about%20your%20beauty%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href={`tel:${beautician.phoneClean}`}
                  className="px-6 py-3.5 rounded-full bg-charcoal-900 hover:bg-blush-600 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blush-300" />
                  <span>Direct Call</span>
                </a>
              </div>
            </div>

            {/* Direct Contact Phone & Email Cards */}
            <div className="bg-white rounded-3xl p-7 border border-blush-200 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-lg text-charcoal-900">
                Direct Contact Methods
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Telephone */}
                <a
                  href={`tel:${beautician.phoneClean}`}
                  className="p-4 rounded-2xl bg-pearl-100/70 hover:bg-blush-50 border border-blush-100 hover:border-blush-300 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-blush-600 group-hover:bg-blush-500 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Telephone</span>
                    <span className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-blush-600 transition-colors">
                      {beautician.phone}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${beautician.email}`}
                  className="p-4 rounded-2xl bg-pearl-100/70 hover:bg-blush-50 border border-blush-100 hover:border-blush-300 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blush-100 flex items-center justify-center text-blush-600 group-hover:bg-blush-500 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-800/60 block">Email Inquiries</span>
                    <span className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-blush-600 transition-colors truncate block max-w-[150px]">
                      {beautician.email}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Hours, Location & Interactive Map Card */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Studio Address & Valet Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-blush-200 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-blush-600 mb-1">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Studio Location</span>
                </div>
                <h4 className="font-serif font-bold text-xl text-charcoal-900">
                  {beautician.location}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-charcoal-800/70">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary Private Parking Available</span>
                </div>
              </div>

              {/* Operating Hours Table */}
              <div className="pt-4 border-t border-blush-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-2">
                  <Clock className="w-4 h-4 text-blush-600" />
                  <span>Studio Hours</span>
                </div>
                {beautician.hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-pearl-100 border border-pearl-200"
                  >
                    <span className="font-medium text-charcoal-800">{h.days}</span>
                    <span className="font-bold text-blush-800">{h.time}</span>
                  </div>
                ))}
              </div>

              {/* Stylized Interactive Map Preview Card */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-blush-200 bg-pearl-200 flex flex-col items-center justify-center text-center p-4">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E896B1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blush-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="font-serif font-bold text-sm text-charcoal-900">Beverly Hills Studio Suite 4B</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white text-charcoal-900 text-xs font-bold border border-blush-300 shadow-sm hover:bg-blush-500 hover:text-white transition-all"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">Follow On Social</span>
                <span className="text-xs text-charcoal-800/70">Instagram & TikTok @elenalaurent.beauty</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-blush-50 text-blush-700 hover:bg-blush-500 hover:text-white font-semibold text-xs border border-blush-200 transition-all flex items-center gap-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
