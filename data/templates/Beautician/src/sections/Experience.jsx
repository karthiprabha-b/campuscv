import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, Sparkles, Building2, Star } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Experience({ data = {} }) {
  const rawExp = Array.isArray(data?.experience) && data.experience.length > 0 ? data.experience : (_default.experience || []);

  const experiences = rawExp.map((exp, idx) => {
    const id = exp?.id || `exp-${idx + 1}`;
    const roleKey = `text:experience:card:${id}:role`;
    const compKey = `text:experience:card:${id}:company`;
    const periodKey = `text:experience:card:${id}:period`;
    const locKey = `text:experience:card:${id}:location`;
    const descKey = `text:experience:card:${id}:description`;

    return {
      id,
      role: data?.contentOverrides?.[roleKey]?.value || (typeof data?.contentOverrides?.[roleKey] === 'string' ? data?.contentOverrides?.[roleKey] : null) || exp?.role || exp?.title || 'Master Aesthetician',
      company: data?.contentOverrides?.[compKey]?.value || (typeof data?.contentOverrides?.[compKey] === 'string' ? data?.contentOverrides?.[compKey] : null) || exp?.company || exp?.organization || 'Luxury Atelier',
      location: data?.contentOverrides?.[locKey]?.value || (typeof data?.contentOverrides?.[locKey] === 'string' ? data?.contentOverrides?.[locKey] : null) || exp?.location || 'Beverly Hills, CA',
      period: data?.contentOverrides?.[periodKey]?.value || (typeof data?.contentOverrides?.[periodKey] === 'string' ? data?.contentOverrides?.[periodKey] : null) || exp?.period || exp?.duration || '2022 - Present',
      isCurrent: exp?.isCurrent || idx === 0,
      description: data?.contentOverrides?.[descKey]?.value || (typeof data?.contentOverrides?.[descKey] === 'string' ? data?.contentOverrides?.[descKey] : null) || exp?.description || 'Delivering high-end skin rejuvenation and bespoke bridal glam.',
      highlights: Array.isArray(exp?.highlights) ? exp.highlights : (Array.isArray(exp?.achievements) ? exp.achievements : []),
      clientsWorkedWith: Array.isArray(exp?.clientsWorkedWith) ? exp.clientsWorkedWith : (Array.isArray(exp?.clients) ? exp.clients : ['Celebrity Weddings', 'Red Carpet Galas']),
      roleKey,
      compKey,
      periodKey,
      locKey,
      descKey
    };
  });

  return (
    <section 
      id="experience" 
      data-cv-section="experience"
      data-node-id="section:experience:root:section:0"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#C59B6D]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-[#FCEEF3] px-4 py-1.5 rounded-full border border-pink-200 inline-block">
            Professional Trajectory
          </span>
          <h2 
            data-node-id="text:experience:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            A Decade of Haute Artistry & Leadership
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            From editorial runway backstages in Paris to luxury Beverly Hills bridal suites.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-pink-200 ml-4 md:ml-32 lg:ml-40 space-y-12 pl-6 md:pl-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group pointer-events-auto" data-node-id={`item:experience:card:${exp.id}`}>
              
              {/* Timeline Pin/Dot */}
              <div
                className={`absolute -left-[33px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full border-4 border-white transition-transform duration-300 group-hover:scale-125 shadow-md flex items-center justify-center ${
                  exp.isCurrent
                    ? 'bg-[#DF7A98] ring-4 ring-pink-200'
                    : 'bg-zinc-800 ring-2 ring-pink-100'
                }`}
              >
                {exp.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              </div>

              {/* Date Indicator on Desktop Left */}
              <div className="hidden md:block absolute -left-48 lg:-left-52 top-1 w-36 text-right">
                <span
                  data-node-id={exp.periodKey}
                  data-node-type="text"
                  className={`text-xs font-bold px-3 py-1 rounded-full inline-block border cursor-text ${
                    exp.isCurrent
                      ? 'bg-[#DF7A98] text-white border-[#C95679]'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                  }`}
                >
                  {exp.period}
                </span>
                <p 
                  data-node-id={exp.locKey}
                  data-node-type="text"
                  className="text-[11px] text-zinc-500 mt-1 font-medium cursor-text"
                >
                  {exp.location}
                </p>
              </div>

              {/* Experience Card */}
              <div className="bg-[#FAF7F5] rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm hover:shadow-luxury hover:bg-white transition-all duration-300">
                {/* Mobile Date indicator */}
                <div className="md:hidden flex items-center justify-between gap-2 mb-3">
                  <span
                    data-node-id={exp.periodKey}
                    data-node-type="text"
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block cursor-text ${
                      exp.isCurrent
                        ? 'bg-[#DF7A98] text-white'
                        : 'bg-zinc-200 text-zinc-800'
                    }`}
                  >
                    {exp.period}
                  </span>
                  <span 
                    data-node-id={exp.locKey}
                    data-node-type="text"
                    className="text-xs text-zinc-600 font-medium flex items-center gap-1 cursor-text"
                  >
                    <MapPin className="w-3 h-3 text-[#DF7A98] pointer-events-none" />
                    <span>{exp.location}</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 
                      data-node-id={exp.roleKey}
                      data-node-type="text"
                      className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors cursor-text"
                    >
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#A83E5D] mt-0.5">
                      <Building2 className="w-4 h-4 pointer-events-none" />
                      <span 
                        data-node-id={exp.compKey}
                        data-node-type="text"
                        className="cursor-text"
                      >
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  {exp.isCurrent && (
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      ● Active Practice
                    </span>
                  )}
                </div>

                <p 
                  data-node-id={exp.descKey}
                  data-node-type="text"
                  className="text-sm text-zinc-600 leading-relaxed font-normal mb-5 cursor-text"
                >
                  {exp.description}
                </p>

                {/* Key Accomplishment Highlights */}
                {exp.highlights.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Key Milestones & Impact:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {exp.highlights.map((h, i) => {
                        const hKey = `text:experience:card:${exp.id}:highlight:${i}`;
                        const hVal = data?.contentOverrides?.[hKey]?.value || (typeof h === 'string' ? h : h?.title || '');
                        return (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                            <div className="w-4 h-4 rounded-full bg-[#FCEEF3] shrink-0 flex items-center justify-center text-[#DF7A98] mt-0.5 pointer-events-none">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                            <span 
                              data-node-id={hKey}
                              data-node-type="text"
                              className="cursor-text"
                            >
                              {hVal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* High Profile Credits */}
                {exp.clientsWorkedWith.length > 0 && (
                  <div className="pt-4 border-t border-pink-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A83E5D] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#DF7A98]" /> Notable Credits:
                    </span>
                    {exp.clientsWorkedWith.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-white border border-pink-200 text-[11px] font-medium text-zinc-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
