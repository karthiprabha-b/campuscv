import React from 'react';
import { Briefcase, Award, Building2, ShieldCheck, Code2, Laptop, Zap, CheckCircle2, Palette, Layers, Sparkles, Heart, GraduationCap, BookOpen, Trophy } from 'lucide-react';

const ICON_MAP = {
  Briefcase,
  Award,
  Building2,
  ShieldCheck,
  Code2,
  Laptop,
  Zap,
  CheckCircle2,
  Palette,
  Layers,
  Sparkles,
  Heart,
  GraduationCap,
  BookOpen,
  Trophy,
};

export default function Achievements(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.metrics || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawMetrics = Array.isArray(incoming) ? incoming : (Array.isArray(data?.metrics) ? data.metrics : null);
  const metrics = rawMetrics && rawMetrics.length > 0 ? rawMetrics : [
    { id: "1", number: 8, suffix: "+", label: "Years Experience", description: "In top-tier corporate litigation and legal advisory.", iconName: "Briefcase" },
    { id: "2", number: 180, suffix: "+", label: "Cases & Deals Closed", description: "Cross-border mergers, tech IPOs, and commercial disputes.", iconName: "Award" },
    { id: "3", number: 45, suffix: "+", label: "Corporate Clients", description: "From Fortune 500 enterprises to high-growth scaleups.", iconName: "Building2" },
    { id: "4", number: 99, suffix: "%", label: "Success Rate", description: "Uncompromising dedication to client outcome and ethics.", iconName: "ShieldCheck" },
  ];

  return (
    <section 
      id="achievements" 
      data-cv-section="achievements" 
      className="relative py-16 bg-white border-y"
      style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.2)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((m, index) => {
            const Icon = ICON_MAP[m?.iconName] || Award;
            return (
              <div
                key={m?.id || index}
                className="relative p-6 bg-[#FAF8F4] border shadow-sm hover:shadow-gold-glow transition-all duration-300 group"
                style={{ borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)' }}
              >
                {/* Top Border Highlight */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(to right, var(--campuscv-accent-dark, #A67D28), var(--campuscv-accent, #C89B3C), var(--campuscv-accent-light, #D5B350))'
                  }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-3 bg-white border group-hover:scale-110 transition-transform duration-300"
                    style={{
                      borderColor: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.3)',
                      color: 'var(--campuscv-accent, #C89B3C)'
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span 
                    className="text-xs font-mono font-bold uppercase"
                    style={{ color: 'rgba(var(--campuscv-accent-rgb, 200, 155, 60), 0.7)' }}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-2 flex items-baseline">
                  <span>{m?.number}</span>
                  <span className="ml-0.5" style={{ color: 'var(--campuscv-accent, #C89B3C)' }}>{m?.suffix}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#1A1A1A] mb-1">
                  {m?.label}
                </h3>

                <p className="text-xs text-[#6B7280] font-sans font-light leading-relaxed">
                  {m?.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
