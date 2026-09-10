"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X } from 'lucide-react';
import NovaCharacter from './NovaCharacter';

interface DashboardAssistantProps {
  portfolio: any;
}

const HINTS = [
  "Click any text or image in the preview to edit it instantly!",
  "Toggle sections on/off in the Design > Sections panel.",
  "Try changing color schemes in the Design > Colors tab!",
  "You can adjust the font size of any clicked element using the slider at the top!",
  "Make sure to enter a subdomain tag under Publish to deploy!",
  "Select from our Layout Presets to completely change the page structure."
];

export default function DashboardAssistant({ portfolio }: DashboardAssistantProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'wave' | 'success'>('wave');

  useEffect(() => {
    // Wave on mount, then go to idle
    const t = setTimeout(() => setAvatarState('idle'), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Cycle hints every 15 seconds
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HINTS.length);
      // Trigger a wave when giving a new hint
      setAvatarState('wave');
      setTimeout(() => setAvatarState('idle'), 2500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleInteract = () => {
    // Random hint on click, waves hand
    setHintIndex(Math.floor(Math.random() * HINTS.length));
    setShowTooltip(true);
    setAvatarState('success');
    setTimeout(() => setAvatarState('idle'), 2500);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          setShowTooltip(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-zinc-900 text-white p-3 rounded-full hover:bg-zinc-800 border border-zinc-800 shadow-lg flex items-center justify-center transition-all group scale-95 hover:scale-100"
        title="Open Nova Assistant"
      >
        <Sparkles className="w-5 h-5 text-purple-400 group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none pointer-events-none">
      
      {/* Speech Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            className="mb-3 mr-2 bg-zinc-900 border border-zinc-800 text-white p-3.5 rounded-2xl shadow-xl max-w-[200px] relative pointer-events-auto"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-2.5 h-2.5" />
            </button>
            
            <div className="flex gap-1.5 items-center text-[8px] font-bold text-purple-400 uppercase tracking-wider mb-1 font-mono">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Nova Assistant</span>
            </div>

            <p className="text-[10px] leading-relaxed text-zinc-300 text-left font-sans">
              {HINTS[hintIndex]}
            </p>
            
            <div className="absolute -bottom-1 right-8 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 3D Assistant Widget Container */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        
        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="w-6 h-6 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:scale-105 transition-all opacity-0 hover:opacity-100 focus:opacity-100 cursor-pointer"
          title="Minimize Assistant"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Floating Bubble Canvas wrapper */}
        <div 
          onClick={handleInteract}
          onMouseEnter={() => setShowTooltip(true)}
          className="w-[84px] h-[84px] rounded-full bg-zinc-900 border-2 border-zinc-850 shadow-2xl hover:shadow-purple-650/10 cursor-pointer transition-all hover:scale-105 overflow-hidden flex items-center justify-center relative group"
        >
          <div className="w-[100px] h-[100px] shrink-0 absolute mt-2">
            <NovaCharacter state={avatarState} />
          </div>

          {/* Quick hover badge overlay */}
          <div className="absolute bottom-1 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 py-0.5 pointer-events-none">
            <span className="text-[7px] text-zinc-300 font-extrabold uppercase tracking-widest font-mono">
              CLICK NOVA
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
