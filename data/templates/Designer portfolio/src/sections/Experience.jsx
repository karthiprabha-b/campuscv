import React from 'react';

export default function Experience({ data = {} }) {
  const experienceList = Array.isArray(data.experience)
    ? data.experience
    : (Array.isArray(data.experience?.items)
      ? data.experience.items
      : (Array.isArray(data.timeline)
        ? data.timeline
        : []));

  if (!experienceList || experienceList.length === 0) {
    return null;
  }

  const eyebrow = data.experienceEyebrow || data.experience?.eyebrow || "04 / Career Timeline";
  const sectionTitle = data.experienceTitle || data.experience?.title || "Work Experience";
  const sectionDesc = data.experienceDescription || data.experience?.description || "Career progression, roles, and impactful contributions across product teams.";

  return (
    <section id="experience" data-cv-section="experience" data-node-id="container:experience:section:0" className="py-20 sm:py-28 md:py-36 border-b border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-14 md:gap-16 lg:gap-20 xl:gap-24">
          
          {/* Left Title Sticky Column */}
          <div className="md:col-span-4 min-w-0 w-full">
            <div className="md:sticky md:top-28 space-y-4 sm:space-y-5 pr-0 md:pr-4">
              <span data-node-id="text:experience:eyebrow:0" className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block" data-cv="experience.eyebrow">
                {eyebrow}
              </span>
              <h2 data-node-id="text:experience:title:0" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight break-normal whitespace-normal hyphens-none leading-[1.15] max-w-full" data-cv="experience.title">
                {sectionTitle}
              </h2>
              <p data-node-id="text:experience:description:0" className="text-sm sm:text-base text-[#666666] leading-relaxed break-normal whitespace-normal font-medium" data-cv="experience.description">
                {sectionDesc}
              </p>
            </div>
          </div>

          {/* Right Vertical Timeline Column */}
          <div className="md:col-span-8 space-y-8 sm:space-y-12 md:space-y-14 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-[#E5E0D8] min-w-0 w-full" data-cv-collection="experience.items">
            {experienceList.map((item, idx) => {
              const dates = item.period || (item.startDate && item.endDate ? `${item.startDate} – ${item.endDate}` : item.startDate ? `${item.startDate} – Present` : item.dates || item.year || item.years || "");
              const roleTitle = item.role || item.position || item.title || item.jobTitle || item.name || "";
              const companyName = item.company || item.organization || item.employer || item.subtitle || "";
              const itemDesc = item.description || item.desc || item.summary || item.details || "";

              return (
                <article
                  key={item.id || idx}
                  data-cv={`experience.items[${idx}]`}
                  data-node-id={`container:experience:card:${idx}`}
                  className="card experience-item relative pl-10 sm:pl-14 md:pl-16 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2.5 sm:left-3.5 top-6 w-3.5 h-3.5 rounded-full bg-[#111111] group-hover:bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-colors ring-4 ring-[#FAF8F5]"></div>

                  {/* Timeline Card */}
                  <div data-node-id={`container:experience:cardInner:${idx}`} className="p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E0D8] shadow-sm group-hover:border-[#111111] hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      {dates && (
                        <div data-node-id={`container:experience:card:${idx}:date:0`}>
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] break-normal" data-node-id={`text:experience:card:${idx}:span:0`} data-cv={`experience.items[${idx}].period`}>
                            {dates}
                          </span>
                        </div>
                      )}
                      {companyName && (
                        <div data-node-id={`container:experience:card:${idx}:company:0`}>
                          <span className="text-xs font-semibold text-[#555555] px-3.5 py-1 rounded-full bg-[#F2EEE9] break-normal inline-block" data-node-id={`text:experience:card:${idx}:span:1`} data-cv={`experience.items[${idx}].company`}>
                            {companyName}
                          </span>
                        </div>
                      )}
                    </div>

                    {roleTitle && (
                      <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#111111] mb-3 break-normal whitespace-normal hyphens-none leading-snug max-w-full" data-node-id={`text:experience:card:${idx}:h3:0`} data-cv={`experience.items[${idx}].role`}>
                        {roleTitle}
                      </h3>
                    )}

                    {itemDesc && (
                      <p className="text-sm sm:text-[15px] text-[#555555] leading-relaxed sm:leading-[1.8] break-normal whitespace-normal font-normal" data-node-id={`text:experience:card:${idx}:p:0`} data-cv={`experience.items[${idx}].description`}>
                        {itemDesc}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
