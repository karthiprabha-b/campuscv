"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import CampusCvLogo from '../common/CampusCvLogo';

interface ResumeExtractionLoadingScreenProps {
  onComplete: () => void;
  fileName?: string | null;
}

const EXTRACTION_STEPS = [
  "Reading resume",
  "Detecting sections",
  "Extracting profile",
  "Organizing education",
  "Organizing experience",
  "Extracting projects",
  "Extracting skills",
  "Detecting links",
  "Preparing portfolio"
];

export default function ResumeExtractionLoadingScreen({ onComplete, fileName }: ResumeExtractionLoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Progressively mark checklist items complete
    const interval = setInterval(() => {
      setCompletedSteps(prev => {
        if (prev < EXTRACTION_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsReady(true);
          setTimeout(() => {
            onComplete();
          }, 900);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFC] flex flex-col justify-center items-center px-4 sm:px-6 select-none overflow-hidden antialiased">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute w-72 h-72 bg-purple-200/40 rounded-full filter blur-3xl -z-10 pointer-events-none" />

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-[#E7E7EC] rounded-[24px] shadow-xl shadow-purple-900/[0.04] p-6 sm:p-8 flex flex-col items-center text-center relative"
      >
        {/* CampusCV Logo Header */}
        <div className="mb-5 flex items-center justify-center">
          <CampusCvLogo className="h-9 w-auto" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1.5 mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-bricolage">
            {isReady ? "Your portfolio data is ready." : "Importing your resume..."}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {fileName ? (
              <span className="font-semibold text-purple-700 truncate block">{fileName}</span>
            ) : (
              "Extracting and structuring your information into a clean portfolio."
            )}
          </p>
        </div>

        {/* Checklist Container */}
        <div className="w-full space-y-2.5 bg-slate-50/70 border border-slate-100 rounded-2xl p-4 sm:p-5 text-left mb-6">
          {EXTRACTION_STEPS.map((step, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps && !isReady;

            return (
              <motion.div
                key={step}
                initial={false}
                animate={{ opacity: isDone || isCurrent ? 1 : 0.35 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isDone
                        ? 'bg-purple-600 text-white shadow-xs'
                        : isCurrent
                        ? 'border-2 border-purple-600 bg-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                    ) : null}
                  </div>
                  <span
                    className={`font-semibold ${
                      isDone
                        ? 'text-slate-800'
                        : isCurrent
                        ? 'text-purple-700 font-bold'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {isDone && (
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Done
                  </span>
                )}
                {isCurrent && (
                  <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Status Indicator */}
        <div className="w-full flex items-center justify-center">
          {isReady ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Redirecting to portfolio selection…</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
              <span>Processing resume details…</span>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
