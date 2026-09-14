import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export default function Testimonials(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.testimonials || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawTestimonials = Array.isArray(incoming)
    ? incoming
    : (Array.isArray(data?.testimonials)
      ? data.testimonials
      : (Array.isArray(data?.reviews) ? data.reviews : null));

  if (rawTestimonials !== null && rawTestimonials.length === 0) {
    return null;
  }

  const testimonials = (rawTestimonials && rawTestimonials.length > 0) ? rawTestimonials : [
    {
      id: "t1",
      name: "Marcus Sterling",
      role: "Managing Director & General Partner",
      organization: "Sterling Peak Capital",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      review: "Alexander's ability to navigate cutthroat antitrust obstacles while preserving deal momentum was instrumental in closing our $1.4B buyout ahead of schedule. Truly an elite corporate strategist.",
      rating: 5,
      type: "Client",
    },
    {
      id: "t2",
      name: "Elena Rostova",
      role: "Chief Legal Officer",
      organization: "Vanguard Biotech Inc.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      review: "In high-stakes federal litigation, having Alexander in our corner gave the executive board total confidence. Unrivaled courtroom presence and razor-sharp brief writing.",
      rating: 5,
      type: "Client",
    },
    {
      id: "t3",
      name: "Dean Arthur Pendelton",
      role: "Professor of Jurisprudence",
      organization: "Columbia Law School",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      review: "Alexander was among the most brilliant legal minds to graduate our chambers in a generation. His ethical clarity and fiduciary discipline set the gold standard.",
      rating: 5,
      type: "Mentor",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section 
      id="testimonials" 
      data-cv-section="testimonials" 
      className="py-24 bg-[#FAF8F4] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              TESTIMONIALS & REVIEWS
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            What Leaders & Clients Say
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
            }}
          />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Endorsements from executive mentors, venture founders, department chairs, and Fortune partners.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div 
            className="bg-white p-8 sm:p-12 border-2 shadow-gold-glow relative"
            style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.4)' }}
          >
            {/* Background Quote Icon */}
            <Quote 
              className="absolute top-6 right-6 w-20 h-20 pointer-events-none"
              style={{ color: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.12)' }}
            />

            {/* Star Rating */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: current?.rating || 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5" 
                  style={{
                    color: 'var(--campuscv-accent, #C89B3C)',
                    fill: 'var(--campuscv-accent, #C89B3C)'
                  }}
                />
              ))}
            </div>

            {/* Review Quote */}
            <blockquote className="font-serif text-xl sm:text-2xl text-[#1A1A1A] italic leading-relaxed mb-8 relative z-10">
              "{current?.review || current?.content || current?.feedback}"
            </blockquote>

            {/* User Bio Footer */}
            <div 
              className="flex items-center justify-between pt-6 border-t font-sans"
              style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
            >
              <div className="flex items-center gap-4">
                {current?.photoUrl && (
                  <img
                    src={current.photoUrl}
                    alt={current?.name || "Testimonial"}
                    className="w-14 h-14 rounded-full object-cover border-2 shadow-md"
                    style={{ borderColor: 'var(--campuscv-accent, #C89B3C)' }}
                  />
                )}
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    {current?.name || current?.author}
                  </h4>
                  <p 
                    className="text-xs font-sans tracking-wide uppercase font-semibold"
                    style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                  >
                    {[current?.role, current?.organization || current?.company].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Badge Type */}
              {current?.type && (
                <span 
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1 border text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.1)',
                    borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)',
                    color: 'var(--campuscv-accent, #C89B3C)'
                  }}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{current.type}</span>
                </span>
              )}
            </div>
          </div>

          {/* Carousel Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="p-3 bg-white border text-[#1A1A1A] hover:text-[var(--campuscv-accent,#C89B3C)] hover:border-[var(--campuscv-accent,#C89B3C)] transition-colors shadow-sm cursor-pointer"
                style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.35)' }}
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                    style={currentIndex === idx ? {
                      width: '2rem',
                      backgroundColor: 'var(--campuscv-accent, #C89B3C)'
                    } : {
                      width: '0.5rem',
                      backgroundColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)'
                    }}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="p-3 bg-white border text-[#1A1A1A] hover:text-[var(--campuscv-accent,#C89B3C)] hover:border-[var(--campuscv-accent,#C89B3C)] transition-colors shadow-sm cursor-pointer"
                style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.35)' }}
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
