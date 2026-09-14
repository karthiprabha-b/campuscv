import React from 'react';

export default function SectionHeader({ eyebrow, title, subtitle, dark = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
      {/* Eyebrow Pill */}
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-900/90 border border-cyber-700/60 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyber-brightCyan animate-pulse"></span>
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-cyber-brightCyan">
            {eyebrow}
          </span>
        </div>
      )}

      {/* Main Display Title */}
      <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight ${
        dark ? 'text-white' : 'text-slate-950'
      }`}>
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans ${
          dark ? 'text-cyber-200' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
