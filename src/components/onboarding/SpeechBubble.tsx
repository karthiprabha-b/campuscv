"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative bg-white text-zinc-950 p-4 rounded-2xl shadow-md border border-zinc-100 max-w-sm select-none"
    >
      {/* Speech bubble arrow pointer */}
      <div className="absolute bottom-4 -left-2 w-4 h-4 bg-white border-l border-b border-zinc-100 rotate-45" />
      
      <p className="text-xs font-medium leading-relaxed text-left relative z-10">
        {text}
      </p>
    </motion.div>
  );
}
