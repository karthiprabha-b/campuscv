import React from 'react';

export default function Testimonial({ data = {} }) {
  const testimonials = Array.isArray(data.testimonials)
    ? data.testimonials
    : (Array.isArray(data.testimonials?.items)
      ? data.testimonials.items
      : (data.testimonial && (data.testimonial.quote || data.testimonial.content) ? [data.testimonial] : []));

  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  const eyebrow = data.testimonialEyebrow || data.testimonial?.eyebrow || "Client Endorsement";

  return (
    <section id="testimonial" data-cv-section="testimonial" data-node-id="section:testimonial:root:section:0" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8] bg-[#111111] text-white">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 md:px-10 text-center space-y-6 sm:space-y-10">
        <span
          className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block"
          data-cv="testimonial.eyebrow"
          data-node-id="text:testimonial:root:eyebrow:0"
        >
          {eyebrow}
        </span>

        {testimonials.map((item, idx) => {
          const quoteText = item.quote || item.content || "";
          const clientName = item.clientName || item.name || item.author || "";
          const clientRole = item.clientRole || item.role || item.company || "";

          return (
            <div key={idx} data-node-id={`container:testimonial:card:${idx}:div:0`} className="space-y-6 sm:space-y-8 p-4 rounded-3xl">
              {quoteText && (
                <blockquote
                  className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl mx-auto break-normal whitespace-normal hyphens-none"
                  data-cv="testimonial.quote"
                  data-node-id={`text:testimonial:card:${idx}:quote:0`}
                >
                  "{quoteText}"
                </blockquote>
              )}

              {(clientName || clientRole) && (
                <div className="pt-4 space-y-1">
                  {clientName && (
                    <p
                      className="font-heading font-bold text-xl text-white break-normal whitespace-normal hyphens-none"
                      data-cv="testimonial.name"
                      data-node-id={`text:testimonial:card:${idx}:name:0`}
                    >
                      {clientName}
                    </p>
                  )}
                  {clientRole && (
                    <p
                      className="text-sm text-[#888888] break-normal whitespace-normal hyphens-none"
                      data-cv="testimonial.role"
                      data-node-id={`text:testimonial:card:${idx}:role:0`}
                    >
                      {clientRole}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
