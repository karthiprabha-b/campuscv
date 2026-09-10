import React, { useState } from 'react';
import { HeartPulse, Activity, Stethoscope, ShieldAlert, Sparkles, UserCheck, ArrowRight, Check, Search } from 'lucide-react';
import SpecialtyModal from '../components/SpecialtyModal';
import doctorProfile from '../data/doctorProfile';

export default function Specializations({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawSpecializations = data?.specializations || doctor?.specializations || data?.services || doctor?.services || data?.skills || doctor?.skills;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about
  );

  let specSource = [];
  if (Array.isArray(rawSpecializations)) {
    specSource = rawSpecializations;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.specializations)) {
    specSource = doctorProfile.specializations;
  }

  // If no specializations data exists, cleanly remove section without showing fake demo data
  if (!specSource || specSource.length === 0) {
    return null;
  }

  const specializations = specSource.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `spec-${idx}`,
        title: item,
        badge: 'Core Practice',
        shortDescription: `Dedicated focus on practical application and best practices in ${item}.`,
        detailedDescription: `Advanced methodology adhering to modern evidence-based guidelines and individualized planning for ${item}.`,
        conditionsTreated: [item, 'Consultations & Evaluation', 'Continuous Care'],
        diagnosticsUsed: ['Comprehensive Assessment', 'Targeted Analysis'],
        icon: idx % 2 === 0 ? 'HeartPulse' : 'Stethoscope'
      };
    }
    return {
      id: item.id || `spec-${idx}`,
      title: item.title || item.name || item.skill || 'Specialty Area',
      badge: item.badge || item.category || 'Specialty Care',
      shortDescription: item.shortDescription || item.description || item.summary || 'Comprehensive consultation and professional evaluation.',
      detailedDescription: item.detailedDescription || item.details || item.description || 'Evidence-based approach tailored to individual goals.',
      conditionsTreated: Array.isArray(item.conditionsTreated) ? item.conditionsTreated : (item.conditions ? [item.conditions] : ['Consultations', 'Specialist Review']),
      diagnosticsUsed: Array.isArray(item.diagnosticsUsed) ? item.diagnosticsUsed : ['Comprehensive Diagnostics'],
      icon: item.icon || 'Stethoscope'
    };
  });

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const eyebrow = data?.specializations?.eyebrow || data?.skills?.eyebrow || 'Clinical Expertise';
  const title = data?.specializations?.title || data?.skills?.title || 'Medical Specializations & Clinical Focus';
  const description = data?.specializations?.description || data?.skills?.description || 'Comprehensive medical consultations, preventive health evaluations, and personalized treatment management.';

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-sky-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-teal-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-indigo-600" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-sky-600" />;
    }
  };

  const filtered = specializations.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = item.title?.toLowerCase().includes(q);
    const matchesDesc = item.shortDescription?.toLowerCase().includes(q);
    const matchesCondition = item.conditionsTreated?.some(c => c.toLowerCase().includes(q));
    return matchesTitle || matchesDesc || matchesCondition;
  });

  return (
    <section
      id="specializations"
      data-cv-section="specializations"
      className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200" data-cv="specializations.eyebrow">
              {eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight" data-cv="specializations.title">
              {title}
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed" data-cv="specializations.description">
              {description}
            </p>
          </div>

          {/* Quick Specialty Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conditions or care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300/80 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Specialization Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((spec, idx) => (
            <div
              key={spec.id || idx}
              onClick={() => setSelectedSpecialty(spec)}
              className="medical-card-light rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Card Icon & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-sky-100/60 transition-all">
                    {getIcon(spec.icon)}
                  </div>
                  {spec.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-50 border border-sky-200 text-sky-800" data-cv={`doctor.specializations.${idx}.badge`}>
                      {spec.badge}
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors" data-cv={`doctor.specializations.${idx}.title`}>
                  {spec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3" data-cv={`doctor.specializations.${idx}.shortDescription`}>
                  {spec.shortDescription}
                </p>

                {/* Condition Chips Preview */}
                {spec.conditionsTreated && spec.conditionsTreated.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {spec.conditionsTreated.slice(0, 2).map((cond, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[170px]">{cond}</span>
                      </span>
                    ))}
                    {spec.conditionsTreated.length > 2 && (
                      <span className="text-[10px] text-sky-700 font-semibold self-center ml-1">
                        +{spec.conditionsTreated.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700 group-hover:text-sky-800">
                <span>View Clinical Approach</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Modal */}
      {selectedSpecialty && (
        <SpecialtyModal
          specialty={selectedSpecialty}
          onClose={() => setSelectedSpecialty(null)}
        />
      )}
    </section>
  );
}
