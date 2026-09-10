import React, { useState } from 'react';
import { BookOpen, ExternalLink, Bookmark, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import doctorProfile from '../data/doctorProfile';

export default function Publications({ data = {} }) {
  const doctor = data?.doctor || data?.personal || data || {};
  
  const rawPubs = data?.publications || doctor?.publications || data?.research || doctor?.research || data?.papers || doctor?.papers;
  
  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email ||
    doctor?.name || doctor?.about
  );

  let publications = [];
  if (Array.isArray(rawPubs)) {
    publications = rawPubs;
  } else if (!hasCustomData && Array.isArray(doctorProfile?.publications)) {
    publications = doctorProfile.publications;
  }

  // If no publications data exists, cleanly remove section without showing fake demo data
  if (!publications || publications.length === 0) {
    return null;
  }

  const [copiedDoi, setCopiedDoi] = useState(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(publications.map(p => p.category).filter(Boolean)))];

  const handleCopyDoi = (doi, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(doi);
      setCopiedDoi(id);
      setTimeout(() => setCopiedDoi(null), 2000);
    }
  };

  const toggleAbstract = (id) => {
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPublications = selectedCategory === 'All'
    ? publications
    : publications.filter(p => p.category === selectedCategory);

  return (
    <section
      id="publications"
      data-cv-section="publications"
      className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200">
              Academic Scholarship
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Peer-Reviewed Publications & Clinical Research
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
              Original research contributions and observational cohorts published in peer-reviewed clinical cardiology and internal medicine journals.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="w-full md:w-auto overflow-x-auto pb-1">
              <div className="inline-flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 whitespace-nowrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Papers List */}
        <div className="space-y-5">
          {filteredPublications.map((pub, idx) => {
            const title = pub.title || pub.name || pub.paperTitle || 'Scientific Publication';
            const journal = pub.journal || pub.publisher || pub.conference || '';
            const year = pub.year || pub.date || '';
            const authors = pub.authors || pub.author || '';
            const abstract = pub.abstract || pub.summary || pub.description || '';
            const doi = pub.doi || pub.doiNumber || '';
            const link = pub.link || pub.url || '';
            const category = pub.category || '';
            const citations = pub.citations || pub.citationCount || '';

            return (
              <div
                key={pub.id || idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {year && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                        <BookOpen className="w-3 h-3 text-sky-600" />
                        <span>{year}</span>
                      </span>
                    )}
                    {category && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {category}
                      </span>
                    )}
                  </div>

                  {citations && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <Bookmark className="w-3 h-3 text-emerald-600" />
                      <span>{citations} Citations</span>
                    </span>
                  )}
                </div>

                {/* Title & Journal */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {title}
                  </h3>
                  {journal && (
                    <div className="text-xs text-sky-800 font-semibold mt-1">
                      {journal}
                    </div>
                  )}
                  {authors && (
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">
                      {authors}
                    </div>
                  )}
                </div>

                {/* Abstract Collapsible */}
                {abstract && (
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleAbstract(pub.id || String(idx))}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
                    >
                      <span>{expandedAbstracts[pub.id || String(idx)] ? 'Hide Abstract' : 'View Abstract'}</span>
                      {expandedAbstracts[pub.id || String(idx)] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedAbstracts[pub.id || String(idx)] && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-fadeIn">
                        {abstract}
                      </p>
                    )}
                  </div>
                )}

                {/* DOI and External Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  {doi ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">
                        DOI: {doi}
                      </span>
                      <button
                        onClick={() => handleCopyDoi(doi, pub.id || String(idx))}
                        className="text-slate-500 hover:text-sky-700 p-1 rounded transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="Copy DOI"
                      >
                        {copiedDoi === (pub.id || String(idx)) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ) : <div />}

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-900 transition-colors ml-auto"
                    >
                      <span>Read Publication</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
