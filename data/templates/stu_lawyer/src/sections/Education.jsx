import React from 'react';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';

export default function Education(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.education || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawEdu = Array.isArray(incoming) ? incoming : (Array.isArray(data?.education) ? data.education : null);
  const education = rawEdu && rawEdu.length > 0 ? rawEdu : [
    {
      id: "edu1",
      institution: "Harvard Law School",
      degree: "Master of Laws (LL.M.) in Corporate Finance & Governance",
      duration: "2015 - 2016",
      location: "Cambridge, MA",
      description: "Focused on international financial transactions, antitrust regulation, and boardroom fiduciary dynamics.",
      honors: "Dean's Scholar Prize in Corporate Governance",
    },
    {
      id: "edu2",
      institution: "Columbia Law School",
      degree: "Juris Doctor (J.D.)",
      duration: "2012 - 2015",
      location: "New York, NY",
      description: "Senior Editor, Columbia Law Review. Concentrated in Securities Regulation and Appellate Litigation.",
      honors: "James Kent Scholar (Top 2% of Class)",
    },
    {
      id: "edu3",
      institution: "Yale University",
      degree: "Bachelor of Arts (B.A.) in Economics & Ethics",
      duration: "2008 - 2012",
      location: "New Haven, CT",
      description: "Summa Cum Laude, Phi Beta Kappa honors. President of the Yale Political Union.",
      honors: "Summa Cum Laude • Phi Beta Kappa",
    },
  ];

  return (
    <section 
      id="education" 
      data-cv-section="education" 
      className="py-24 bg-white border-y"
      style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              ACADEMIC BACKGROUND
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Education & Credentials
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Rigorous academic training from top-tier institutions worldwide, paired with continuous professional certifications.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Central Line */}
          <div 
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] sm:-translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />

          <div className="space-y-12">
            {education.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item?.id || index}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Dot */}
                  <div 
                    className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 shadow-gold-glow flex items-center justify-center z-10"
                    style={{
                      borderColor: 'var(--campuscv-accent, #C89B3C)',
                      color: 'var(--campuscv-accent, #C89B3C)'
                    }}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>

                  {/* Card Content Box */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8 w-full">
                    <div 
                      className="bg-[#FAF8F4] p-6 sm:p-8 border shadow-luxury transition-all duration-300 relative group"
                      style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
                    >
                      {/* Corner Highlight */}
                      <div 
                        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
                        style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
                      />
                      <div 
                        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
                        style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span 
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold"
                          style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {item?.duration || item?.year}
                        </span>
                        {item?.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-sans">
                            <MapPin className="w-3 h-3" />
                            {item?.location}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">
                        {item?.institution || item?.school}
                      </h3>

                      <p 
                        className="text-sm font-semibold mb-3 font-sans"
                        style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                      >
                        {item?.degree || item?.qualification || item?.title}
                      </p>

                      <p className="text-xs text-[#6B7280] font-sans font-light leading-relaxed mb-4">
                        {item?.description}
                      </p>

                      {item?.honors && (
                        <div 
                          className="inline-flex items-center gap-2 px-3 py-1 border text-xs font-bold font-sans"
                          style={{
                            backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                            borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)',
                            color: 'var(--campuscv-accent, #C89B3C)'
                          }}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{item?.honors}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
