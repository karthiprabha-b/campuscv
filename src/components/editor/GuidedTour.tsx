"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'layers' | 'design' | 'publish' | null) => void;
}

interface TourStep {
  title: string;
  selector: string;
  description: string;
  preferredPosition?: 'right' | 'bottom' | 'inside-top-left' | 'left';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "The Control Center",
    selector: '[data-tour="control-center"]',
    description: "Welcome to the Control Center! This is where you can manage and customize the sections of your portfolio or resume. You can add new sections, remove existing ones, and rearrange them to fit your needs.",
    preferredPosition: 'right'
  },
  {
    title: "The Canvas",
    selector: '[data-tour="canvas-stage"]',
    description: "This is your Canvas, where you can see a live preview of your portfolio or resume as you make changes. Any adjustments you make in the Control Center will be reflected here in real-time.",
    preferredPosition: 'inside-top-left'
  },
  {
    title: "Settings & Customization",
    selector: '[data-tour="design-tab"]',
    description: "Here in the Settings & Customization panel, you can fine-tune the appearance and functionality of your portfolio or resume. Adjust themes, colors, fonts, and other settings to make your document truly your own.",
    preferredPosition: 'right'
  },
  {
    title: "Layers & Section Management",
    selector: '[data-tour="layers-tab"]',
    description: "Inspect and organize your portfolio structure layer by layer. Drag to reorder sections, toggle visibility to hide or show items, or drill down to edit specific cards and elements.",
    preferredPosition: 'right'
  },
  {
    title: "Responsive Device Previews",
    selector: '[data-tour="viewport-switcher"]',
    description: "Preview how your website adapts across Desktop, Tablet, and Mobile screens. Test typography, spacing, and mobile menus before sharing.",
    preferredPosition: 'bottom'
  },
  {
    title: "Real-Time Auto-Save",
    selector: '[data-tour="save-indicator"]',
    description: "Every edit you make is automatically debounced and saved in real time to the SQLite database. You never have to worry about lost progress.",
    preferredPosition: 'bottom'
  },
  {
    title: "Publish & Custom Domain",
    selector: '[data-tour="publish-btn"]',
    description: "When you are ready, publish your portfolio with one click or link your personalized custom domain with free SSL certificate.",
    preferredPosition: 'bottom'
  }
];

export default function GuidedTour({ isOpen, onClose, onNavigateTab }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1440, height: 900 });

  const step = TOUR_STEPS[currentStep];
  const totalSteps = TOUR_STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const updateTargetPosition = useCallback(() => {
    if (!isOpen || typeof window === 'undefined') return;
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const currentSelector = TOUR_STEPS[currentStep]?.selector;
    if (!currentSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    updateTargetPosition();
    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    const interval = setInterval(updateTargetPosition, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      clearInterval(interval);
    };
  }, [updateTargetPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, isLast, isFirst]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      handleDismiss();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('campuscv_editor_tour_dismissed', 'true');
    } catch (e) {}
    onClose();
  };

  // Tooltip positioning logic
  const tooltipWidth = 330;
  const tooltipHeight = 220;
  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10001
  };

  if (targetRect) {
    const pos = step.preferredPosition || 'right';

    if (pos === 'inside-top-left') {
      tooltipStyle.left = Math.max(24, targetRect.left + 32);
      tooltipStyle.top = Math.max(76, targetRect.top + 32);
    } else if (pos === 'bottom') {
      const left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      tooltipStyle.left = Math.max(16, Math.min(left, windowSize.width - tooltipWidth - 16));
      tooltipStyle.top = Math.min(targetRect.bottom + 14, windowSize.height - tooltipHeight - 16);
    } else if (pos === 'right') {
      tooltipStyle.left = Math.min(targetRect.right + 16, windowSize.width - tooltipWidth - 16);
      tooltipStyle.top = Math.max(70, Math.min(targetRect.top + 20, windowSize.height - tooltipHeight - 20));
    } else {
      tooltipStyle.left = Math.max(16, targetRect.left - tooltipWidth - 16);
      tooltipStyle.top = Math.max(70, Math.min(targetRect.top + 20, windowSize.height - tooltipHeight - 20));
    }
  } else {
    // Fallback: center in screen
    tooltipStyle.left = Math.max(20, (windowSize.width - tooltipWidth) / 2);
    tooltipStyle.top = Math.max(80, (windowSize.height - tooltipHeight) / 2);
  }

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden pointer-events-auto select-none">
      {/* Darkened Spotlight Backdrop using SVG Mask */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300"
        style={{ zIndex: 9999 }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%" height="100%"
          fill="rgba(0, 0, 0, 0.62)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Target Element Outline Glow */}
      {targetRect && (
        <motion.div
          key={step.selector}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed pointer-events-none rounded-2xl border-2 border-white/90 shadow-[0_0_24px_rgba(255,255,255,0.4)] z-[10000]"
          style={{
            left: targetRect.left - 6,
            top: targetRect.top - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
        />
      )}

      {/* Click-to-dismiss background trap */}
      <div
        className="fixed inset-0 z-[10000]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleDismiss();
          }
        }}
      />

      {/* Floating Anchored Popover (Pixel-matched to user reference screenshots) */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={tooltipStyle}
        className="w-[330px] bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col z-[10002]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-zinc-100">
          <h3 className="text-[13px] font-bold text-zinc-900 leading-snug">
            {step.title}
          </h3>
          <button
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors cursor-pointer"
            title="Close Tour (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Description Body */}
        <div className="px-5 py-3.5 text-xs text-zinc-600 leading-relaxed font-normal">
          {step.description}
        </div>

        {/* Footer with Step Counter and Prev/Next */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-50/70 border-t border-zinc-100">
          <span className="text-[11px] font-medium text-zinc-400 font-mono">
            {currentStep + 1} of {totalSteps}
          </span>

          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="px-2.5 py-1 text-xs font-semibold text-zinc-600 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-0.5"
              >
                <ChevronLeft className="w-3 h-3" /> Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-0.5"
            >
              {isLast ? (
                <>
                  Done <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
