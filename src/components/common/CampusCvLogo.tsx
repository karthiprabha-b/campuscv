"use client";

import React, { useState } from 'react';

interface CampusCvLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white' | 'word' | 'default';
  src?: string;
  alt?: string;
}

export default function CampusCvLogo({
  className = "",
  variant = 'full',
  src,
  alt = "CampusCV",
}: CampusCvLogoProps) {
  const [iconSrc, setIconSrc] = useState(src || '/assets/Campus%20CV%20Logo.png?v=brand1280');
  const [wordSrc, setWordSrc] = useState('/assets/campus_cv_word.png?v=brand1280');
  const [whiteSrc, setWhiteSrc] = useState(src || '/assets/Campus%20CV%20white.png?v=brand1280');

  if (variant === 'icon') {
    return (
      <img
        src={iconSrc}
        alt={alt}
        onError={() => {
          if (!iconSrc.includes('campus_cv_icon.png')) {
            setIconSrc('/assets/campus_cv_icon.png?v=brand1280');
          }
        }}
        className={`h-7 sm:h-8 w-auto object-contain select-none shrink-0 opacity-100 ${className}`}
      />
    );
  }

  if (variant === 'white') {
    return (
      <img
        src={whiteSrc}
        alt={alt}
        onError={() => {
          if (!whiteSrc.includes('campus_cv_white.png')) {
            setWhiteSrc('/assets/campus_cv_white.png?v=brand1280');
          }
        }}
        className={`h-7 sm:h-8 w-auto object-contain select-none shrink-0 opacity-100 ${className}`}
      />
    );
  }

  if (variant === 'word') {
    return (
      <img
        src={wordSrc}
        alt={alt}
        className={`h-4.5 sm:h-5 w-auto object-contain select-none shrink-0 opacity-100 ${className}`}
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      <img
        src={iconSrc}
        alt="CampusCV Logo"
        onError={() => {
          if (!iconSrc.includes('campus_cv_icon.png')) {
            setIconSrc('/assets/campus_cv_icon.png?v=brand1280');
          }
        }}
        className="h-8 sm:h-9 w-auto object-contain shrink-0 select-none opacity-100 drop-shadow-xs"
      />
      <img
        src={wordSrc}
        alt="CampusCV"
        className="h-4.5 sm:h-5 w-auto object-contain shrink-0 select-none opacity-100 drop-shadow-xs"
      />
    </div>
  );
}
