"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { TestimonialItem } from "@/data/portfolio";

interface TestimonialCarouselProps {
  data?: any;
  testimonials?: TestimonialItem[];
}

export default function TestimonialCarousel(props: TestimonialCarouselProps = {}) {
  const rawList = (Array.isArray(props.testimonials) && props.testimonials.length > 0)
    ? props.testimonials
    : ((Array.isArray(props.data?.testimonials) && props.data.testimonials.length > 0)
      ? props.data.testimonials
      : ((Array.isArray(props.data?.feedback) && props.data.feedback.length > 0)
        ? props.data.feedback
        : ((Array.isArray(props.data?.reviews) && props.data.reviews.length > 0)
          ? props.data.reviews
          : [])));

  const [index, setIndex] = useState(0);

  const testimonialsList: TestimonialItem[] = (rawList || []).map((t: any) => ({
    quote: t.quote || t.content || t.message || t.feedback || "",
    author: t.author || t.name || "Colleague",
    role: t.role || t.title || t.designation || "",
    avatar: t.avatar || t.avatarUrl || t.image || ""
  })).filter((t: TestimonialItem) => Boolean(t.quote && t.quote.trim() !== ""));

  useEffect(() => {
    if (testimonialsList.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonialsList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonialsList.length]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % testimonialsList.length);
  };

  if (!testimonialsList || testimonialsList.length === 0) return null;

  const current = testimonialsList[index % testimonialsList.length];

  return (
    <div
      data-cv={`testimonials[${index % testimonialsList.length}]`}
      data-cv-item
      className="relative w-full max-w-4xl mx-auto overflow-hidden px-4 md:px-8 py-6"
    >
      {/* Testimonial Panel */}
      <div className="relative min-h-[160px] flex items-center justify-center">
        <div
          key={index}
          className="w-full text-center flex flex-col items-center transition-opacity duration-300"
        >
          <Quote className="w-10 h-10 text-[#FFC107]/50 mb-4 stroke-[1.5]" />
          <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl text-[#111111] italic">
            &ldquo;{current.quote}&rdquo;
          </p>

          {/* Author Metadata */}
          <div className="flex items-center space-x-3 mt-6">
            {current.avatar && (
              <img
                src={current.avatar}
                alt={current.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#FFC107] shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="text-left">
              <h5 className="text-xs sm:text-sm font-bold text-[#111111] leading-none">
                {current.author}
              </h5>
              {current.role && (
                <span className="text-[10px] sm:text-xs text-[#666666]">
                  {current.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Arrow Controls & Indicator Dots */}
      {testimonialsList.length > 1 && (
        <div className="flex items-center justify-between mt-8 max-w-xs mx-auto">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full border-2 border-[#111111]/15 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-[#111111] transition-all duration-200 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="flex space-x-2">
            {testimonialsList.map((_: TestimonialItem, i: number) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === (index % testimonialsList.length)
                    ? "bg-[#FFC107] w-6"
                    : "bg-[#111111]/15 w-2.5 hover:bg-[#111111]/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full border-2 border-[#111111]/15 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-[#111111] transition-all duration-200 cursor-pointer"
            aria-label="Next Slide"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
