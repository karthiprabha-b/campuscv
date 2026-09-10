import React from 'react';
import { Award } from 'lucide-react';

export default function Certifications({ data = {} }) {
  const certList = Array.isArray(data.certifications)
    ? data.certifications
    : (Array.isArray(data.certifications?.items)
      ? data.certifications.items
      : (Array.isArray(data.data?.certifications)
        ? data.data.certifications
        : (Array.isArray(data.content?.certifications)
          ? data.content.certifications
          : (Array.isArray(data.resume?.certifications)
            ? data.resume.certifications
            : (Array.isArray(data.awards) ? data.awards : [])))));

  if (!certList || certList.length === 0) {
    return null;
  }

  const eyebrow = data.certificationsEyebrow || data.certifications?.eyebrow || "07 / Recognition";
  const sectionTitle = data.certificationsTitle || data.certifications?.title || "Certifications & Recognition";

  return (
    <section id="certifications" data-cv-section="certifications" data-node-id="container:certifications:section:0" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        
        <div className="max-w-2xl mb-10 sm:mb-12">
          <span data-node-id="text:certifications:eyebrow:0" className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-2" data-cv="certifications.eyebrow">
            {eyebrow}
          </span>
          <h2 data-node-id="text:certifications:title:0" className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] break-normal whitespace-normal hyphens-none leading-[1.1] max-w-full" data-cv="certifications.title">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" data-cv-collection="certifications.items">
          {certList.map((cert, idx) => {
            const title = cert.name || cert.title || cert.award || cert.degree || cert.certificateName || "";
            const issuer = cert.issuer || cert.organization || cert.authority || cert.issuedBy || cert.company || "";
            const year = cert.date || cert.year || cert.period || cert.issueDate || cert.issuedDate || "";

            return (
              <article
                key={cert.id || idx}
                data-cv={`certifications.items[${idx}]`}
                data-node-id={`container:certifications:card:${idx}`}
                className="card cert-item p-6 rounded-2xl bg-white border border-[#E5E0D8] shadow-sm flex items-center justify-between gap-4 hover:border-[#111111] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div data-node-id={`container:certifications:card:${idx}:icon:0`} className="w-10 h-10 rounded-xl bg-[#F2EEE9] flex items-center justify-center text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-heading text-base font-bold text-[#111111] break-normal truncate"
                      data-node-id={`text:certifications:card:${idx}:h3:0`}
                      data-cv={`certifications.items[${idx}].name`}
                    >
                      {title || "Certification"}
                    </h3>
                    {issuer && (
                      <p
                        className="text-xs text-[#666666] font-medium mt-0.5 break-normal truncate"
                        data-node-id={`text:certifications:card:${idx}:p:0`}
                        data-cv={`certifications.items[${idx}].issuer`}
                      >
                        {issuer}
                      </p>
                    )}
                  </div>
                </div>
                {year && (
                  <div data-node-id={`container:certifications:card:${idx}:year:0`} className="shrink-0">
                    <span
                      className="text-xs font-bold text-[#111111] bg-[#F2EEE9] px-3 py-1 rounded-full shrink-0 inline-block break-normal"
                      data-node-id={`text:certifications:card:${idx}:span:0`}
                      data-cv={`certifications.items[${idx}].year`}
                    >
                      {year}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}


