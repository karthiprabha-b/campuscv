'use client';

import React from 'react';

export default function FloatingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Floating Glowing Cyan & Violet Spheres */}
      <div className="absolute top-[15%] left-[6%] w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-cyber-brightCyan to-cyber-500 rounded-full blur-[4px] opacity-60 animate-float-slow transform -rotate-45"></div>
      
      <div className="absolute top-[30%] right-[5%] w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-br from-cyber-neonViolet to-cyber-600 rounded-full blur-[6px] opacity-50 animate-float-reverse transform rotate-30"></div>

      <div className="absolute bottom-[20%] left-[3%] w-24 sm:w-36 h-24 sm:h-36 bg-gradient-to-br from-cyber-neonCyan to-cyber-900 rounded-full blur-[5px] opacity-40 animate-float-slow transform -rotate-15"></div>

      <div className="absolute top-[65%] right-[10%] w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-br from-cyber-electricPurple to-cyber-neonCyan rounded-full blur-[3px] opacity-55 animate-float-reverse transform rotate-45"></div>
    </div>
  );
}
