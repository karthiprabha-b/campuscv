"use client";

import React, { useState } from "react";
import { portfolioData, ProjectItem } from "@/data/portfolioData";
import { Sparkles, Eye, Clock, User, Check, Layers, Sliders, X, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  
  // Interactive Before & After Slider State (0 to 100 percentage)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const categories = [
    { id: "all", label: "All Works" },
    { id: "bridal", label: "Bridal Artistry" },
    { id: "skincare", label: "Clinical Skincare" },
    { id: "lashes-brows", label: "Lashes & Brows" },
    { id: "nails", label: "Luxury Nails" },
    { id: "editorial", label: "Editorial & Runway" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.category === activeCategory);

  // Featured transformation project for the interactive comparison slider
  const featuredTransformation = portfolioData.projects.find((p) => p.isTransformation) || portfolioData.projects[0];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  return (
    <section id="projects" className="py-24 bg-[#FAF7F5] relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blush-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blush-600 bg-white px-4 py-1.5 rounded-full border border-blush-200 inline-block shadow-xs">
            Signature Portfolio & Transformations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight">
            Curated Transformations & Looks
          </h2>
          <p className="text-base sm:text-lg text-charcoal-800/80 font-normal">
            Explore real client transformations, red-carpet editorial styling, and precision dermal treatments.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE */}
        {/* ========================================================================= */}
        <div className="mb-20 bg-white rounded-3xl p-6 sm:p-10 border border-blush-200 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description for Before/After */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush-100 text-blush-800 text-xs font-bold">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Transformation Viewer</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 leading-tight">
                {featuredTransformation.title}
              </h3>

              <p className="text-sm text-charcoal-800/80 leading-relaxed font-normal">
                {featuredTransformation.description} Slide the handle across to see the bare canvas transform into camera-ready luxury radiance.
              </p>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  Products & Techniques Applied:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {featuredTransformation.techniques.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-pearl-100 border border-pearl-200 text-xs font-medium text-charcoal-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-full bg-blush-500 text-white font-semibold text-xs shadow-soft-pink hover:bg-blush-600 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Inquire About This Look</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-xs text-charcoal-800/60 font-medium">
                  {featuredTransformation.duration} Session
                </span>
              </div>
            </div>

            {/* Right: Interactive Before & After Drag Image Container */}
            <div className="lg:col-span-7">
              <div
                className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-blush-200 shadow-md group touch-none"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
                }}
                onTouchStart={(e) => {
                  setIsDragging(true);
                  if (e.touches[0]) {
                    handleSliderMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                  }
                }}
                onTouchEnd={() => setIsDragging(false)}
                onTouchCancel={() => setIsDragging(false)}
                onTouchMove={(e) => {
                  if (!isDragging) return;
                  if (e.touches[0]) {
                    handleSliderMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                  }
                }}
              >
                {/* AFTER IMAGE (Background Full) */}
                <Image
                  src={featuredTransformation.afterImage || featuredTransformation.image}
                  alt="Transformation After Glam"
                  fill
                  className="object-cover object-center"
                />

                {/* AFTER LABEL */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs pointer-events-none">
                  ✨ AFTER (GLAM GLOW)
                </div>

                {/* BEFORE IMAGE (Clipped with width percentage) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="relative h-[320px] sm:h-[420px] w-full pointer-events-none">
                    <Image
                      src={featuredTransformation.beforeImage || featuredTransformation.image}
                      alt="Transformation Before"
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md text-white font-bold text-xs pointer-events-none">
                      BEFORE CANVAS
                    </div>
                  </div>
                </div>

                {/* SLIDER HANDLE LINE & THUMB */}
                <div
                  className="absolute inset-y-0 z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                >
                  <div className="h-full w-0.5 bg-white shadow-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-blush-600 shadow-2xl flex items-center justify-center border-2 border-blush-300">
                    <Sliders className="w-5 h-5 rotate-90" />
                  </div>
                </div>

                {/* Drag instruction */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none">
                  ↔ Click and drag left/right to compare
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-blush-500 text-white shadow-soft-pink scale-105 border border-blush-400"
                  : "bg-white text-charcoal-800 hover:bg-blush-50 hover:text-blush-600 border border-blush-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* PORTFOLIO PROJECT GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-blush-200 shadow-sm hover:shadow-luxury hover:border-blush-400 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Project Image */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer bg-blush-50"
                onClick={() => setSelectedProject(project)}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-blush-700 font-bold text-xs border border-blush-200 shadow-sm">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* View Look Overlay Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-4 py-2 rounded-full bg-white text-charcoal-900 font-bold text-xs shadow-luxury flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-3.5 h-3.5 text-blush-600" />
                    <span>View Look Details</span>
                  </span>
                </div>

                {/* Duration Tag */}
                <div className="absolute bottom-3 right-3 text-white/90 text-[11px] font-medium flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  <Clock className="w-3 h-3" />
                  <span>{project.duration}</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-blush-600 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-charcoal-800/80 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Techniques Tag Chips */}
                <div className="pt-2 border-t border-blush-100">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techniques.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-pearl-100 text-charcoal-800 text-[11px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-3 border-t border-blush-100 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-800/60 font-medium">
                    Client: {project.client}
                  </span>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-bold text-blush-600 hover:text-blush-700 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                  >
                    <span>Inspect</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOOK DETAIL LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-blush-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Banner */}
            <div className="relative h-72 sm:h-80 w-full bg-charcoal-900">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-blush-500 text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedProject.categoryLabel}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-bold text-blush-700 tracking-wider mb-1">
                  Artistic Concept & Execution
                </h4>
                <p className="text-sm text-charcoal-800/80 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Techniques & Formulations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-pearl-100 border border-pearl-200">
                  <h5 className="font-serif font-bold text-sm text-charcoal-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blush-600" />
                    <span>Techniques Used</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedProject.techniques.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-charcoal-800/80">
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-pearl-100 border border-pearl-200">
                  <h5 className="font-serif font-bold text-sm text-charcoal-900 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-champagne-600" />
                    <span>Luxury Products</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedProject.products.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-charcoal-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blush-500 flex-shrink-0"></span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-blush-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-charcoal-800/70">
                  <span>Session Length: <strong>{selectedProject.duration}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Client: <strong>{selectedProject.client}</strong></span>
                </div>
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blush-500 hover:bg-blush-600 text-white text-xs font-semibold shadow-soft-pink transition-all inline-flex items-center justify-center cursor-pointer text-center"
                >
                  Inquire About Treatment
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
