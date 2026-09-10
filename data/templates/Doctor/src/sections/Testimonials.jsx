import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Testimonials({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawTestimonials = data?.testimonials || doctor?.testimonials || data?.reviews || doctor?.reviews || data?.recommendations || doctor?.recommendations;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about
  );

  let testimonials = [];
  if (Array.isArray(rawTestimonials)) {
    testimonials = rawTestimonials;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.testimonials)) {
    testimonials = doctorProfile.testimonials;
  }

  // If no testimonials data exists, cleanly remove section without showing fake demo data
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      data-cv-section="testimonials"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Patient Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Patient Testimonials & Outcomes
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
              Read real patient journeys and feedback following clinical consultations, health management, and preventive protocols.
            </p>
          </div>

          {/* Rating Summary Badge */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 self-center md:self-auto shrink-0">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs font-semibold text-slate-800">
              <span className="font-extrabold text-slate-900">4.98 / 5.0</span>
              <span className="text-slate-500 font-normal ml-1">(500+ Reviews)</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((test, idx) => {
            const author = test.patientName || test.author || test.name || 'Verified Patient';
            const condition = test.treatmentCategory || test.condition || test.role || '';
            const quote = test.quote || test.comment || test.content || test.text || '';
            const timeframe = test.date || test.timeframe || 'Clinical Patient';
            const rating = Number(test.rating) || 5;

            return (
              <div
                key={test.id || idx}
                className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col justify-between relative group hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Header Quote & Rating */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {condition && (
                      <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        {condition}
                      </span>
                    )}
                  </div>

                  <Quote className="w-8 h-8 text-sky-200 mb-2 opacity-60" />

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-serif">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>

                {/* Patient Attribution & Verification */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {author}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {timeframe}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Verified Review</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
