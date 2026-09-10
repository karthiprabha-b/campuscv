"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  title: string;
  selected: boolean;
  onClick: () => void;
  subtitle?: string;
}

export default function QuestionCard({ title, selected, onClick, subtitle }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 select-none flex justify-between items-center relative group ${
        selected
          ? 'border-[#7C3AED] bg-purple-50/20 text-[#7C3AED] shadow-sm font-semibold'
          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50/50'
      }`}
    >
      <div className="space-y-0.5 pr-4">
        <span className="block text-xs font-bold transition-colors group-hover:text-zinc-950 group-data-[selected=true]:text-[#7C3AED]">
          {title}
        </span>
        {subtitle && (
          <span className="block text-[10px] text-zinc-400 font-light font-sans">
            {subtitle}
          </span>
        )}
      </div>

      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
          selected
            ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
            : 'border-zinc-300 bg-white group-hover:border-zinc-400'
        }`}
      >
        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
}
