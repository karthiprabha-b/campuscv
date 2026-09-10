"use client";

import { useState, useEffect } from 'react';
import { AvatarState } from './lib/avatarController';

export interface ProgressStep {
  label: string;
  completed: boolean;
}

export function useNovaState() {
  const [step, setStep] = useState<number>(0);
  const [state, setState] = useState<AvatarState>('idle');
  const [speechText, setSpeechText] = useState<string>("Welcome to CampusCV! Create your account to start building your future.");
  const [progress, setProgress] = useState<number>(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { label: "Understanding your goals", completed: false },
    { label: "Matching your career path", completed: false },
    { label: "Analyzing your skills", completed: false },
    { label: "Writing your professional bio", completed: false },
    { label: "Choosing your template", completed: false },
    { label: "Building your website", completed: false },
    { label: "Publishing portfolio", completed: false },
  ]);

  // Synchronize Avatar State and speech bubble text based on step
  useEffect(() => {
    let timer: NodeJS.Timeout;

    switch (step) {
      case 0:
        setState('idle');
        setSpeechText("Welcome to CampusCV! Create your account to start building your future.");
        break;
      case 1:
        setState('wave');
        setSpeechText("Hi! I'm Nova. Let's build your professional identity. Who do you want to become?");
        // After wave animation finishes, return to idle
        timer = setTimeout(() => {
          setState('idle');
        }, 2200);
        break;
      case 2:
        setState('think');
        setSpeechText("Where do you dream of working?");
        break;
      case 3:
        setState('listen');
        setSpeechText("Which country are you aiming for?");
        break;
      case 4:
        setState('listen'); // Smile / Look happy looking at the slider
        setSpeechText("Let's set your career goal.");
        break;
      case 5:
        setState('typing');
        setSpeechText("Tell me about yourself.");
        break;
      case 6:
        setState('loading');
        setSpeechText("Perfect. Give me a few seconds.");
        break;
      case 7:
        setState('celebrate');
        setSpeechText("Congratulations! Your portfolio is live.");
        break;
      default:
        setState('idle');
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  // Simulation loader when building CV (Step 6)
  useEffect(() => {
    if (step !== 6) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Auto transition to success template chooser screen 7
        setTimeout(() => {
          setStep(7);
        }, 800);
      }
      setProgress(currentProgress);

      // Mark progress items completed sequentially
      const stepIndex = Math.floor((currentProgress / 100) * progressSteps.length);
      setProgressSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          completed: idx < stepIndex || currentProgress === 100,
        }))
      );
    }, 150);

    return () => clearInterval(interval);
  }, [step, progressSteps.length]);

  return {
    step,
    setStep,
    state,
    setState,
    speechText,
    setSpeechText,
    progress,
    progressSteps,
  };
}
