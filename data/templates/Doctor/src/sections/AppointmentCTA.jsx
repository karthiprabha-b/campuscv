import React from 'react';
import { Phone, Mail, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function AppointmentCTA({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  const clinic = data?.clinic || doctor?.clinic || {};

  const doctorName = data?.name || data?.fullName || doctor?.name || doctorProfile?.name || 'Dr. Elena Vance';
  const phone = data?.phone || clinic?.phone || doctor?.phone || doctorProfile?.clinic?.phone || '+1 (617) 555-0194';

  return (
    <section
      id="cta"
      data-cv-section="cta"
      className="py-14 sm:py-18 lg:py-20 bg-gradient-to-br from-sky-50 via-teal-50/40 to-slate-50 border-b border-slate-200/80 relative overflow-hidden"
    >
      {/* Decorative light glows */}
      <div className="absolute top-0 right-0 w-72 sm:w-80 h-72 sm:h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-80 h-72 sm:h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>Patient-Centered Clinical Excellence</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Your Health Deserves Dedicated, Personal Attention.
        </h2>

        <p className="text-xs sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Comprehensive consultations, medical risk assessments, and second opinions with <span data-cv="doctor.name">{doctorName}</span>.
        </p>

        {/* Benefits bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 lg:gap-8 pt-1 sm:pt-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px] sm:text-xs">
            <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 shrink-0" />
            <span>Thorough Consultations</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px] sm:text-xs">
            <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 shrink-0" />
            <span>Evidence-Informed Care</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px] sm:text-xs">
            <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 shrink-0" />
            <span>Inpatient Coordination</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs sm:text-sm lg:text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Phone className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:scale-110" />
            <span>Call Practice: <span data-cv="clinic.phone">{phone}</span></span>
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm lg:text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 group"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>View Practice Details</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
