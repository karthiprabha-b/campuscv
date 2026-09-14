import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Eye, Clock, User, Check, Layers, Sliders, X, ArrowRight } from 'lucide-react';
import { beauticianProfile } from '../data/beauticianDefaults.js';

const _default = beauticianProfile || {};

export default function Projects({ data = {} }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const rawProjects = Array.isArray(data?.projects) && data.projects.length > 0 ? data.projects : (_default.projects || []);

  const projects = rawProjects.map((p, idx) => {
    const id = p?.id || `proj-${idx + 1}`;
    const rawImg = p?.imageUrl || p?.image || p?.thumbnail || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80';
    
    const overrideImg = 
      data?.contentOverrides?.[`image:projects:card:${id}:img:0`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:card:${id}:img:0`] === 'string' ? data?.contentOverrides?.[`image:projects:card:${id}:img:0`] : null) ||
      data?.contentOverrides?.[`image:projects:${id}:0`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:${id}:0`] === 'string' ? data?.contentOverrides?.[`image:projects:${id}:0`] : null) ||
      data?.imageOverrides?.[`projects.${idx}.image`] ||
      data?.imageOverrides?.[`projects[${idx}].image`] ||
      rawImg;

    const beforeImgOverride = 
      data?.contentOverrides?.[`image:projects:transformation:before`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:transformation:before`] === 'string' ? data?.contentOverrides?.[`image:projects:transformation:before`] : null) ||
      data?.contentOverrides?.[`image:projects:card:${id}:before`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:card:${id}:before`] === 'string' ? data?.contentOverrides?.[`image:projects:card:${id}:before`] : null) ||
      data?.imageOverrides?.[`projects.${idx}.beforeImage`] ||
      data?.imageOverrides?.[`projects[${idx}].beforeImage`] ||
      data?.imageOverrides?.[`projects.${idx}.beforeImageUrl`] ||
      p?.beforeImageUrl || p?.beforeImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80';

    const afterImgOverride = 
      data?.contentOverrides?.[`image:projects:transformation:after`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:transformation:after`] === 'string' ? data?.contentOverrides?.[`image:projects:transformation:after`] : null) ||
      data?.contentOverrides?.[`image:projects:card:${id}:after`]?.src ||
      (typeof data?.contentOverrides?.[`image:projects:card:${id}:after`] === 'string' ? data?.contentOverrides?.[`image:projects:card:${id}:after`] : null) ||
      data?.imageOverrides?.[`projects.${idx}.afterImage`] ||
      data?.imageOverrides?.[`projects[${idx}].afterImage`] ||
      data?.imageOverrides?.[`projects.${idx}.afterImageUrl`] ||
      p?.afterImageUrl || p?.afterImage || overrideImg;

    const titleKey = `text:projects:card:${id}:title`;
    const descKey = `text:projects:card:${id}:desc`;
    const clientKey = `text:projects:card:${id}:client`;
    const catKey = `text:projects:card:${id}:cat`;

    return {
      id,
      title: data?.contentOverrides?.[titleKey]?.value || (typeof data?.contentOverrides?.[titleKey] === 'string' ? data?.contentOverrides?.[titleKey] : null) || p?.title || p?.name || 'Curated Beauty Transformation',
      category: data?.contentOverrides?.[catKey]?.value || (typeof data?.contentOverrides?.[catKey] === 'string' ? data?.contentOverrides?.[catKey] : null) || p?.category || 'Bridal',
      categoryLabel: p?.categoryLabel || p?.category || 'Bridal Artistry',
      description: data?.contentOverrides?.[descKey]?.value || (typeof data?.contentOverrides?.[descKey] === 'string' ? data?.contentOverrides?.[descKey] : null) || p?.description || p?.desc || 'Luxury bespoke aesthetic session with high-definition longevity.',
      imageUrl: overrideImg,
      beforeImageUrl: beforeImgOverride,
      afterImageUrl: afterImgOverride,
      isTransformation: Boolean(p?.isTransformation || p?.beforeImageUrl || p?.beforeImage),
      client: data?.contentOverrides?.[clientKey]?.value || (typeof data?.contentOverrides?.[clientKey] === 'string' ? data?.contentOverrides?.[clientKey] : null) || p?.client || 'Private Client',
      techniques: Array.isArray(p?.techniques) ? p.techniques : ['Airbrush Complexion', 'Skin Prep', 'Custom Lashes'],
      products: Array.isArray(p?.products) ? p.products : ['Dior Backstage', 'Charlotte Tilbury', 'SkinCeuticals'],
      duration: p?.duration || '90 Minutes',
      featured: p?.featured,
      titleKey,
      descKey,
      clientKey,
      catKey
    };
  });

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const featuredTransformation = projects.find((p) => p.isTransformation) || projects[0];

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pos);
    };

    const onMouseMove = (e) => handlePointerMove(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
    };
    const onEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  return (
    <section 
      id="projects" 
      data-cv-section="projects"
      data-node-id="section:projects:root:section:0"
      className="py-24 bg-[#FAF7F5] relative overflow-hidden"
    >
      {/* Decorative backdrop */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#F8D7E3]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DF7A98] bg-white px-4 py-1.5 rounded-full border border-pink-200 inline-block shadow-xs">
            Signature Portfolio & Transformations
          </span>
          <h2 
            data-node-id="text:projects:heading"
            data-node-type="text"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight cursor-text"
          >
            Curated Transformations & Looks
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-normal">
            Explore real client transformations, red-carpet editorial styling, and precision dermal treatments.
          </p>
        </div>

        {/* INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE */}
        {featuredTransformation && (
          <div className="mb-20 bg-white rounded-3xl p-6 sm:p-10 border border-pink-200 shadow-luxury pointer-events-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Description for Before/After */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCEEF3] text-[#84354D] text-xs font-bold">
                  <Sliders className="w-3.5 h-3.5 text-[#DF7A98]" />
                  <span>Interactive Transformation Viewer</span>
                </div>

                <h3 
                  data-node-id={`text:projects:card:${featuredTransformation.id}:title`}
                  data-node-type="text"
                  className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight cursor-text"
                >
                  {featuredTransformation.title}
                </h3>

                <p 
                  data-node-id={`text:projects:card:${featuredTransformation.id}:desc`}
                  data-node-type="text"
                  className="text-sm text-zinc-600 leading-relaxed font-normal cursor-text"
                >
                  {featuredTransformation.description} Slide the handle across to compare the bare canvas with our camera-ready luxury finish.
                </p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Products & Techniques Applied:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredTransformation.techniques.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <a
                    href="#contact"
                    className="px-6 py-3 rounded-full bg-[#DF7A98] text-white font-semibold text-xs shadow-soft-pink hover:bg-[#C95679] transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Inquire About This Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-zinc-500 font-medium">
                    {featuredTransformation.duration} Session
                  </span>
                </div>
              </div>

              {/* Right: Interactive Drag Slider */}
              <div className="lg:col-span-7">
                <div
                  ref={containerRef}
                  className="relative h-[320px] sm:h-[420px] w-full rounded-2xl overflow-hidden select-none border-2 border-pink-200 shadow-md group touch-none"
                >
                  {/* AFTER IMAGE (Background Full) */}
                  <img
                    src={featuredTransformation.afterImageUrl}
                    data-node-id="image:projects:transformation:after"
                    data-node-type="image"
                    data-cv="projects.items[0].afterImage"
                    alt="Transformation After Glam"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-auto cursor-pointer"
                  />

                  {/* AFTER LABEL */}
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs pointer-events-none">
                    ✨ AFTER GLAM
                  </div>

                  {/* BEFORE IMAGE (Full-size with clipPath - No Zoom Distortion!) */}
                  <img
                    src={featuredTransformation.beforeImageUrl}
                    data-node-id="image:projects:transformation:before"
                    data-node-type="image"
                    data-cv="projects.items[0].beforeImage"
                    alt="Transformation Before Canvas"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-auto cursor-pointer border-r-2 border-white"
                  />

                  {/* BEFORE LABEL */}
                  <div 
                    className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-white font-bold text-xs pointer-events-none transition-opacity duration-200"
                    style={{ opacity: sliderPosition > 12 ? 1 : 0 }}
                  >
                    BEFORE CANVAS
                  </div>

                  {/* SLIDER HANDLE LINE & THUMB */}
                  <div
                    className="absolute inset-y-0 z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="h-full w-0.5 bg-white shadow-lg pointer-events-none" />
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#DF7A98] shadow-2xl flex items-center justify-center border-2 border-pink-300 pointer-events-auto cursor-ew-resize active:scale-110 transition-transform"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                    >
                      <Sliders className="w-5 h-5 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Drag instruction */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none">
                    ↔ Drag handle to compare
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#DF7A98] text-white shadow-soft-pink scale-105 border border-pink-400'
                  : 'bg-white text-zinc-800 hover:bg-pink-50 hover:text-[#DF7A98] border border-pink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PORTFOLIO PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              data-node-id={`item:projects:card:${project.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-pink-200 shadow-sm hover:shadow-luxury hover:border-pink-400 transition-all duration-300 group flex flex-col justify-between pointer-events-auto"
            >
              {/* Project Image */}
              <div
                className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer bg-[#FCEEF3]"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.imageUrl}
                  data-node-id={`image:projects:card:${project.id}:img:0`}
                  data-node-type="image"
                  data-cv={`projects.items[${idx}].image`}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 pointer-events-auto z-20">
                  <span 
                    data-node-id={project.catKey}
                    data-node-type="text"
                    className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#84354D] font-bold text-xs border border-pink-200 shadow-sm cursor-text"
                  >
                    {project.category}
                  </span>
                </div>

                {/* View Look Overlay Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="px-4 py-2 rounded-full bg-white text-zinc-900 font-bold text-xs shadow-luxury flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-3.5 h-3.5 text-[#DF7A98]" />
                    <span>View Look Details</span>
                  </span>
                </div>

                {/* Duration Tag */}
                <div className="absolute bottom-3 right-3 text-white/90 text-[11px] font-medium flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs pointer-events-none">
                  <Clock className="w-3 h-3" />
                  <span>{project.duration}</span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3
                    data-node-id={project.titleKey}
                    data-node-type="text"
                    data-cv={`projects.items[${idx}].title`}
                    onClick={() => setSelectedProject(project)}
                    className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#DF7A98] transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p 
                    data-node-id={project.descKey}
                    data-node-type="text"
                    data-cv={`projects.items[${idx}].description`}
                    className="text-xs text-zinc-600 leading-relaxed line-clamp-2 cursor-text"
                  >
                    {project.description}
                  </p>
                </div>

                {/* Techniques Tag Chips */}
                <div className="pt-2 border-t border-pink-100">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techniques.slice(0, 3).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-800 text-[11px] font-medium border border-zinc-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                  <span 
                    data-node-id={project.clientKey}
                    data-node-type="text"
                    className="text-[11px] text-zinc-500 font-medium cursor-text"
                  >
                    Client: {project.client}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-bold text-[#DF7A98] hover:text-[#C95679] flex items-center gap-1 group-hover:translate-x-1 transition-all cursor-pointer"
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

      {/* LOOK DETAIL LIGHTBOX MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-[#1E1B1D]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Banner */}
            <div className="relative h-72 sm:h-80 w-full bg-zinc-900">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-[#DF7A98] text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedProject.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {selectedProject.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-bold text-[#A83E5D] tracking-wider mb-1">
                  Artistic Concept & Execution
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Techniques & Formulations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h5 className="font-serif font-bold text-sm text-zinc-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#DF7A98]" />
                    <span>Techniques Used</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedProject.techniques.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-700">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <h5 className="font-serif font-bold text-sm text-zinc-900 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#C59B6D]" />
                    <span>Luxury Products</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedProject.products.map((p, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF7A98] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500">
                  <span>Session Length: <strong>{selectedProject.duration}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Client: <strong>{selectedProject.client}</strong></span>
                </div>
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#DF7A98] hover:bg-[#C95679] text-white text-xs font-semibold shadow-soft-pink transition-all inline-flex items-center justify-center cursor-pointer text-center"
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
