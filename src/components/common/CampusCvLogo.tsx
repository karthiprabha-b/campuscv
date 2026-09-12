"use client";

import React from 'react';

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
  if (variant === 'icon') {
    return (
      <img
        src={src || '/assets/campus_cv_icon.png?v=brand1280'}
        alt={alt}
        className={`h-7 sm:h-8 w-auto object-contain select-none shrink-0 drop-shadow-xs ${className}`}
      />
    );
  }

  if (variant === 'white') {
    return (
      <img
        src={src || '/assets/campus_cv_logo_white.png?v=brand1280'}
        alt={alt}
        className={`h-7 sm:h-8 w-auto object-contain select-none shrink-0 drop-shadow-xs ${className}`}
      />
    );
  }

  if (variant === 'word') {
    return (
      <img
        src={src || '/assets/campus_cv_word.png?v=brand1280'}
        alt={alt}
        className={`h-4.5 sm:h-5 w-auto object-contain select-none shrink-0 drop-shadow-xs ${className}`}
      />
    );
  }

  return (
    <img
      src={src || '/assets/campus_cv_logo.png?v=brand1280'}
      alt={alt}
      className={`h-7 sm:h-8 w-auto max-w-[135px] sm:max-w-[165px] object-contain select-none shrink-0 drop-shadow-xs ${className}`}
    />
  );
}
