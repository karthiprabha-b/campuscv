import React from 'react';
import { Award, Mic, Trophy, Sparkles } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Achievements({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawAchievements = data?.achievements || doctor?.achievements || data?.awards || doctor?.awards || data?.honors || doctor?.honors;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about
  );

  let achievements = [];
  if (Array.isArray(rawAchievements)) {
    achievements = rawAchievements;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.achievements)) {
    achievements = doctorProfile.achievements;
  }

  // If no achievements data exists, cleanly remove section without showing fake demo data
  if (!achievements || achievements.length === 0) {
    return null;
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Award':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Leadership':
        return <Mic className="w-5 h-5 text-sky-500" />;
      case 'Recognition':
        return <Award className="w-5 h-5 text-teal-500" />;
      case 'Research':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      default:
        return <Award className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <section
      id="achievements"
      data-cv-section="achievements"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Honors & Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Distinctions, Grants & Medical Awards
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
              Recognitions by national medical academies, peer societies, and university departments for clinical and academic excellence.
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach, idx) => {
            const title = ach.title || ach.name || ach.award || 'Medical Recognition';
            const organization = ach.organization || ach.issuer || ach.conferringBody || ach.institution || '';
            const year = ach.year || ach.date || ach.period || '';
            const category = ach.category || 'Award';
            const description = ach.description || ach.summary || ach.details || '';

            return (
              <div
                key={ach.id || idx}
                className="bg-slate-50/70 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-300 flex items-start gap-4 sm:gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getCategoryIcon(category)}
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                      {category}
                    </span>
                    {year && (
                      <span className="text-xs font-semibold text-slate-500">
                        {year}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {title}
                  </h3>

                  {organization && (
                    <div className="text-xs font-semibold text-slate-600">
                      Presented by: {organization}
                    </div>
                  )}

                  {description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
