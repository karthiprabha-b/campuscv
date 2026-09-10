"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  placeholderHeight?: string;
}

export default function LazySection({ children, placeholderHeight = "400px" }: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px 0px' } // Load 100px before scrolling into view
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {isVisible ? (
        children
      ) : (
        <div style={{ minHeight: placeholderHeight }} className="w-full bg-transparent" />
      )}
    </div>
  );
}
