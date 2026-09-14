"use client";

import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in seconds
}

export default function AnimatedCounter({ value, duration = 1.2 }: AnimatedCounterProps) {
  const [count, setCount] = useState<number>(() => (typeof value === "number" && !isNaN(value) ? value : 0));

  useEffect(() => {
    const target = typeof value === "number" && !isNaN(value) ? value : 0;
    if (target === 0) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [value, duration]);

  return <span className="tabular-nums">{count}</span>;
}
