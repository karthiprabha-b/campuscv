import React from 'react';

export default function Process({ data = {} }) {
  const stages = Array.isArray(data.process)
    ? data.process
    : (Array.isArray(data.process?.items)
      ? data.process.items
      : (Array.isArray(data.services) ? data.services : []));

  if (!stages || stages.length === 0) {
    return null;
  }

  const eyebrow = data.processEyebrow || data.process?.eyebrow || "03 / Design Methodology";
  const sectionTitle = data.processTitle || data.process?.title || "How I Turn Complexity Into Clarity";

  return (
    <section id="process" data-cv-section="process" data-node-id="section:process:root:section:0" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span
            className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-2"
            data-cv="process.eyebrow"
            data-node-id="text:process:root:eyebrow:0"
          >
            {eyebrow}
          </span>
          <h2
            className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight break-normal whitespace-normal hyphens-none max-w-full"
            data-cv="process.title"
            data-node-id="text:process:root:h2:0"
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" data-cv-collection="process.items">
          {stages.map((stage, idx) => (
            <article
              key={idx}
              data-cv={`process.items[${idx}]`}
              data-node-id={`container:process:card:${idx}:article:0`}
              className="card process-item p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E0D8] shadow-sm hover:border-[#111111] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span
                  className="font-heading text-4xl font-extrabold text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-6 break-normal whitespace-normal hyphens-none"
                  data-cv={`process.items[${idx}].number`}
                  data-node-id={`text:process:card:${idx}:number:0`}
                >
                  {stage.number || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`)}
                </span>
                <h3
                  className="font-heading text-2xl font-bold text-[#111111] mb-3 break-normal whitespace-normal hyphens-none"
                  data-cv={`process.items[${idx}].title`}
                  data-node-id={`text:process:card:${idx}:h3:0`}
                >
                  {stage.title || stage.name}
                </h3>
                {stage.description && (
                  <p
                    className="text-sm text-[#666666] leading-relaxed break-normal whitespace-normal hyphens-none"
                    data-cv={`process.items[${idx}].description`}
                    data-node-id={`text:process:card:${idx}:p:0`}
                  >
                    {stage.description}
                  </p>
                )}
              </div>
              <div className="mt-8 pt-4 border-t border-[#E5E0D8]/60 flex items-center justify-between text-xs font-semibold text-[#111111]">
                <span data-node-id={`text:process:card:${idx}:stage:0`}>Stage {idx + 1} of {stages.length}</span>
                <div data-node-id={`container:process:card:${idx}:dot:0`} className="w-2 h-2 rounded-full bg-[#111111]"></div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
