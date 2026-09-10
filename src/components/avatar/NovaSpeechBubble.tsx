"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NovaSpeechBubbleProps {
  text: string;
}

export default function NovaSpeechBubble({ text }: NovaSpeechBubbleProps) {
  return (
    <div className="absolute top-[-30px] md:top-[8%] left-[2%] md:left-[6%] z-20 w-[60%] sm:w-auto max-w-[200px] md:max-w-[320px] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-3 py-2.5 md:px-5 md:py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-purple-100/50 text-slate-800 text-[11px] md:text-[14px] font-medium leading-relaxed tracking-wide select-none"
        >
          {/* Nova Label */}
          <div className="flex items-center gap-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-purple-600">Nova</span>
          </div>

          <p>{text}</p>

          {/* Speech bubble arrow/triangle */}
          <div className="absolute -bottom-2.5 left-[70%] md:left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[11px] border-t-white/90 filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.03)]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
