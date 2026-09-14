import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  dark = false,
  align = 'center',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 sm:mb-14 md:mb-16 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl px-2 sm:px-0`}>
      {eyebrow && (
        <div className={`flex items-center gap-2 mb-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className={`w-8 h-[2px] rounded-full ${dark ? 'bg-cyber-brightCyan' : 'bg-cyber-500'}`}></span>
          <span className={`text-xs sm:text-sm font-bold tracking-widest uppercase font-mono ${
            dark ? 'text-cyber-brightCyan' : 'text-cyber-600'
          }`}>
            {eyebrow}
          </span>
        </div>
      )}

      <h2
        className={`text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-tight ${
          dark ? 'text-white' : 'text-slate-950'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base leading-relaxed font-sans ${
            dark ? 'text-cyber-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
