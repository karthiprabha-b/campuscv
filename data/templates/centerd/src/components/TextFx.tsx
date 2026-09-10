'use client';

import React from 'react';

interface TextFxProps {
  text?: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export default function TextFx({
  text = '',
  className = '',
}: TextFxProps) {
  const safeText = typeof text === 'string' ? text : String(text || '');

  if (!safeText) return null;

  return (
    <span className={`txt-fx ${className}`.trim()} style={{ display: 'inline' }}>
      {safeText}
    </span>
  );
}
