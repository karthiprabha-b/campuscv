"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import CampusCvLogo from '../common/CampusCvLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  "Understanding your goals...",
  "Matching your career path...",
  "Analyzing your skills...",
  "Writing your professional bio...",
  "Choosing the perfect template...",
  "Building your website...",
  "Optimizing for recruiters...",
  "Publishing your portfolio..."
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // 0 to 100 percentage animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1200); // give it a moment to show success pulse
          return 100;
        }
        return prev + 1;
      });
    }, 45); // Takes about 4.5 seconds

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Increment check items step index based on progress
    const stepRatio = 100 / STEPS.length;
    const nextStepIndex = Math.min(
      Math.floor(progress / stepRatio),
      STEPS.length - 1
    );
    if (nextStepIndex !== currentStepIndex) {
      setCurrentStepIndex(nextStepIndex);
    }
  }, [progress, currentStepIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center px-6 select-none overflow-hidden">
      
      {/* Glowing Logo Icon */}
      <div className="relative mb-10 flex flex-col items-center">
        {/* Animated Background Aura glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-28 h-28 bg-purple-200/60 rounded-full filter blur-xl -z-10"
        />

        {/* Pulsing CV Emblem Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 flex items-center justify-center select-none"
        >
          <CampusCvLogo variant="icon" className="w-16 h-16 object-contain" />
        </motion.div>
      </div>

      {/* Checklist items list */}
      <div className="w-full max-w-sm space-y-3 mb-10 text-left bg-zinc-50 border border-zinc-150 p-6 rounded-2xl shadow-xs">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || progress === 100;
          const isActive = idx === currentStepIndex && progress < 100;
          
          return (
            <div 
              key={step} 
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isDone || isActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors border ${
                  isDone 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : isActive 
                      ? 'bg-white border-[#7C3AED] text-[#7C3AED]' 
                      : 'border-zinc-300 bg-white text-transparent'
                }`}
              >
                {isDone ? (
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                ) : null}
              </div>
              <span 
                className={`text-[11px] font-semibold leading-none ${
                  isDone 
                    ? 'text-zinc-650 font-semibold' 
                    : isActive 
                      ? 'text-[#7C3AED] font-extrabold' 
                      : 'text-zinc-400 font-light'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Percentage Indicator */}
      <div className="space-y-2 w-full max-w-xs text-center">
        <div className="text-3xl font-black font-mono text-zinc-900 leading-none">
          {progress}%
        </div>
        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#7C3AED] rounded-full" 
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">
          Finalizing configuration
        </span>
      </div>

    </div>
  );
}
