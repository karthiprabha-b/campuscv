import React, { useState } from 'react';
import { ExternalLink, Github, BookOpen, Sparkles, Award, X } from 'lucide-react';

export default function Projects(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.projects || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawProjects = Array.isArray(incoming) ? incoming : (Array.isArray(data?.projects) ? data.projects : null);
  const projects = rawProjects && rawProjects.length > 0 ? rawProjects : [
    {
      id: "p1",
      title: "$1.4B Cross-Border Tech Acquisition",
      category: "M&A Structuring",
      description: "Structured multi-jurisdictional buyout agreement for Silicon Valley enterprise SaaS provider expanding into EMEA.",
      longDescription: "Spearheaded regulatory anti-trust clearance across 4 regulatory authorities, drafted IP transfer covenants, and negotiated debt-financing terms protecting client shareholder equity.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      techStack: ["M&A Law", "Antitrust Filings", "Cross-Border Escrow", "IP Assignment"],
      featured: true,
      impactMetrics: ["$1.4B Valuation Finalized", "Zero Regulatory Injunctions", "Approved in 90 Days"],
    },
    {
      id: "p2",
      title: "Global AI Data Compliance Framework",
      category: "Tech & IP Regulation",
      description: "Drafted sovereign privacy architecture and enterprise LLM licensing agreements for Fortune 100 fintech group.",
      longDescription: "Engineered legal compliance pipelines aligning automated generative AI workflows with GDPR, CCPA, and the EU AI Act statutory frameworks.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      techStack: ["EU AI Act", "GDPR Architecture", "SaaS Licensing", "Algorithmic Audit"],
      featured: true,
      impactMetrics: ["100% Privacy Compliance", "Protected 45M User Records", "Implemented in 14 Nations"],
    },
    {
      id: "p3",
      title: "Commercial Appellate Defense Victory",
      category: "Litigation & Arbitration",
      description: "Defended renewable energy conglomerate in $85M breach of contract lawsuit, obtaining complete dismissal.",
      longDescription: "Drafted appellate briefs highlighting contract ambiguity in force majeure clauses, securing summary judgment dismissal with full legal fee reimbursement.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      techStack: ["Commercial Litigation", "Appellate Briefs", "Summary Judgment", "Contract Law"],
      featured: false,
      impactMetrics: ["$85M Liability Dismissed", "100% Legal Cost Recovery", "Precedent Set in 2nd Circuit"],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p?.category || 'General')))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => (p?.category || 'General') === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-white border-y border-[#C89B3C]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
              SELECTED WORK
            </span>
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Featured Projects & Case Studies
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] my-4 rounded-full" />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            A curated showcase of high-stakes corporate deals, landmark litigation cases, and advisory engagements.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 font-sans">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] border-[#C89B3C] shadow-gold-glow scale-105'
                  : 'bg-[#FAF8F4] text-[#1A1A1A] border-[#C89B3C]/30 hover:border-[#C89B3C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj, idx) => (
            <div
              key={proj?.id || idx}
              className="bg-[#FAF8F4] border border-[#C89B3C]/30 hover:border-[#C89B3C] shadow-luxury transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-2"
            >
              <div>
                {/* Image Container with Zoom & Gold Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#111827]">
                  <img
                    src={proj?.imageUrl}
                    alt={proj?.title || "Project"}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md border border-[#C89B3C]/40 text-[10px] font-bold uppercase tracking-widest text-[#D5B350] font-sans">
                    {proj?.category}
                  </span>

                  {/* Featured Badge */}
                  {proj?.featured && (
                    <span className="absolute top-4 right-4 p-1.5 bg-[#C89B3C] text-[#0B0F19] shadow-gold-glow">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#A67D28] transition-colors">
                    {proj?.title}
                  </h3>

                  <p className="text-xs text-[#6B7280] font-sans font-light leading-relaxed mb-6 line-clamp-3">
                    {proj?.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6 font-sans">
                    {(proj?.techStack || []).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-white border border-[#C89B3C]/20 text-[10px] font-semibold text-[#1A1A1A]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#C89B3C]/20 font-sans">
                <button
                  onClick={() => setActiveCaseStudy(proj)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A67D28] hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Case Study</span>
                </button>

                <div className="flex items-center gap-2">
                  {proj?.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-[#C89B3C]/30 text-gray-500 hover:text-[#C89B3C] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj?.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-[#C89B3C]/30 text-gray-500 hover:text-[#C89B3C] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Detail Modal */}
        {activeCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white border border-[#C89B3C]/40 shadow-2xl overflow-hidden z-10 my-8">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#C89B3C]/20 bg-[#FAF8F4]">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
                  {activeCaseStudy?.title}
                </h3>
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-2 text-gray-400 hover:text-[#C89B3C] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto font-sans space-y-6">
                <div className="aspect-[16/9] w-full overflow-hidden border border-[#C89B3C]/40 relative">
                  <img
                    src={activeCaseStudy?.imageUrl}
                    alt={activeCaseStudy?.title || "Case study"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 border border-[#C89B3C]/40 text-xs font-bold text-[#D5B350]">
                    {activeCaseStudy?.category}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67D28] mb-2 font-sans">
                    Project Overview
                  </h4>
                  <p className="text-base text-[#6B7280] leading-relaxed font-sans font-light">
                    {activeCaseStudy?.longDescription}
                  </p>
                </div>

                {/* Key Impact Metrics */}
                {activeCaseStudy?.impactMetrics && activeCaseStudy.impactMetrics.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67D28] mb-3 flex items-center gap-2 font-sans">
                      <Award className="w-4 h-4" />
                      <span>Quantifiable Business Impact</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeCaseStudy.impactMetrics.map((met, i) => (
                        <div key={i} className="p-3 bg-[#C89B3C]/10 border border-[#C89B3C]/30 text-center">
                          <span className="text-xs font-bold text-[#A67D28] block">
                            {met}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="pt-6 border-t border-[#C89B3C]/20 flex justify-end">
                  <button
                    onClick={() => setActiveCaseStudy(null)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] text-[#0B0F19] text-xs font-bold uppercase tracking-wider"
                  >
                    Close Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
