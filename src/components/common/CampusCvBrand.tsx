"use client";

import React from 'react';

interface CampusCvBrandProps {
  className?: string;
  purpleClass?: string;
  blueClass?: string;
  isAllCaps?: boolean;
}

/**
 * Standard CampusCV Brand Name Typography:
 * - "Campus" in default/inherited color
 * - "C" in vibrant blue (#6699ff)
 * - "V" in royal purple (#7C3AED / text-purple-600)
 */
export default function CampusCvBrand({
  className = "font-extrabold tracking-tight font-bricolage",
  purpleClass = "text-purple-600",
  blueClass = "text-[#6699ff]",
  isAllCaps = false,
}: CampusCvBrandProps) {
  if (isAllCaps) {
    return (
      <span className={className}>
        CAMPUS <span className={blueClass}>C</span><span className={purpleClass}>V</span>
      </span>
    );
  }

  return (
    <span className={className}>
      Campus<span className={blueClass}>C</span><span className={purpleClass}>V</span>
    </span>
  );
}
