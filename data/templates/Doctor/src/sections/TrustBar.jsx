import React from 'react';
import { Award, Users, HeartPulse, BookOpen, ShieldCheck } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function TrustBar({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawStats = data?.stats || doctor?.stats || data?.metrics || doctor?.metrics;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about
  );

  let stats = [];
  if (Array.isArray(rawStats)) {
    stats = rawStats;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.stats)) {
    stats = doctorProfile.stats;
  }

  // If no stats data exists, cleanly remove section without showing fake demo data
  if (!stats || stats.length === 0) {
    return null;
  }

  const statIcons = [
    <Award key="exp" className="w-5 h-5 text-sky-600" />,
    <Users key="pat" className="w-5 h-5 text-teal-600" />,
    <HeartPulse key="sat" className="w-5 h-5 text-emerald-600" />,
    <BookOpen key="res" className="w-5 h-5 text-indigo-600" />
  ];

  return (
    <section
      id="trust"
      data-cv-section="trust"
      className="bg-white border-y border-slate-200/80 shadow-xs relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all hover:bg-white hover:border-sky-200 hover:shadow-xs"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                {statIcons[idx % statIcons.length]}
              </div>
              <div className="min-w-0">
                <div
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none"
                  data-cv={`doctor.stats.${idx}.value`}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-bold text-slate-800 mt-1 truncate"
                  data-cv={`doctor.stats.${idx}.label`}
                >
                  {stat.label}
                </div>
                <div
                  className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5"
                  data-cv={`doctor.stats.${idx}.subtext`}
                >
                  {stat.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credential Seals Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-xs text-slate-500 text-center">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] w-full sm:w-auto">
            Affiliated & Certified By:
          </span>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>American Board of Internal Medicine</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>American College of Physicians</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>National Medical Licensure Board</span>
          </div>
        </div>
      </div>
    </section>
  );
}
