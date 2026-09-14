import React from 'react';

export default function FloatingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Cyan & Indigo Floating Depth Particles */}
      <div className="absolute top-[12%] left-[8%] w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-cyan-500/20 border border-cyan-400/30 animate-float-slow shadow-cyan-glow"></div>
      <div className="absolute top-[45%] right-[6%] w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-purple-500/20 border border-purple-400/25 animate-float-reverse shadow-violet-glow"></div>
      <div className="absolute bottom-[18%] left-[15%] w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-cyan-400/20 border border-white/20 animate-float-slow"></div>
    </div>
  );
}
