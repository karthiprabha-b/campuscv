"use client";

import React from "react";

export default function BackgroundDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Structural Vertical Grid Lines */}
      <div className="absolute inset-0 flex justify-between px-4 sm:px-8 md:px-16 lg:px-24 opacity-5">
        <div className="w-[1px] h-full bg-[#111111]" />
        <div className="w-[1px] h-full bg-[#111111] hidden sm:block" />
        <div className="w-[1px] h-full bg-[#111111] hidden md:block" />
        <div className="w-[1px] h-full bg-[#111111] hidden lg:block" />
        <div className="w-[1px] h-full bg-[#111111]" />
      </div>

      {/* Decorative Top-Right Floating Circle */}
      <div
        className="absolute top-[8%] right-[-50px] sm:right-[5%] w-72 h-72 rounded-full border-2 border-[#FFC107]/30 pointer-events-none"
      />

      {/* Grid Pattern Dots */}
      <div className="absolute top-[18%] left-[8%] w-48 h-48 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#111111" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
      </div>

      {/* Floating Outline Triangle/Shape */}
      <div
        className="absolute top-[45%] left-[-50px] sm:left-[2%] w-40 h-40 border border-[#111111]/15 rotate-45 pointer-events-none"
      />

      {/* Another Dot Matrix */}
      <div className="absolute bottom-[20%] right-[4%] w-32 h-64 opacity-25 pointer-events-none">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dots-2" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#FFC107" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots-2)" />
        </svg>
      </div>

      {/* Floating Creative Scribble Circle */}
      <div
        className="absolute bottom-[5%] left-[10%] w-60 h-60 rounded-full border border-[#FFC107]/20 pointer-events-none"
      />
    </div>
  );
}
