'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { studentProfile } from '@/data/portfolioData';
import { 
  Sprout, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Leaf, 
  Sparkles,
  Award 
} from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState<'mission' | 'philosophy' | 'capabilities'>('mission');

  const tabContents = {
    mission: {
      title: "Sustainable Food Security Through Precision Engineering",
      text: "My driving mission is to decouple agricultural productivity from environmental degradation. By implementing localized variable-rate nitrogen delivery, multi-spectral drone health indexing, and closed-loop hydroponics, we can feed growing populations while revitalizing degraded soils and cutting greenhouse emissions.",
      points: [
        "Eliminate non-point source fertilizer runoff into watersheds.",
        "Equip smallholder and commercial farmers with actionable edge-AI analytics.",
        "Pioneer biological soil regeneration to lock carbon into deep humic layers.",
      ],
    },
    philosophy: {
      title: "Data-Informed Agronomy Grounded in Field Reality",
      text: "Technology in agriculture is only as viable as its practicality in muddy boots and harsh weather. My philosophy unites stringent wet-lab analytical chemistry and biostatistics with robust, low-power embedded hardware that withstands extreme field environments.",
      points: [
        "Sensors must be resilient, self-powered, and easily serviceable by growers.",
        "Algorithms must explain root causes, not just provide black-box predictions.",
        "Ecosystem balance precedes chemical interventions in pest and pathogen control.",
      ],
    },
    capabilities: {
      title: "End-to-End Field & Computational Agronomy",
      text: "I operate across both scientific domains: from soil profiling, spectrophotometry, and micro-plot trial design to GIS raster processing, Python modeling, and autonomous UAV flight missions.",
      points: [
        "Sub-2cm ground sampling distance (GSD) drone orthomosaics & NDVI.",
        "Custom LoRa subterranean soil telemetry hardware & firmware deployment.",
        "Statistical trial design (RCBD, Split-Plot) and ANOVA analysis in R.",
      ],
    },
  };

  return (
    <section id="about" className="section-padding" style={{ background: '#ffffff', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <Sprout size={16} />
            <span>ABOUT MY AGRONOMIC VISION</span>
          </div>
          <h2 className="section-title">
            A Good Agriculture For A Better Tomorrow
          </h2>
          <p className="section-description">
            Combining traditional plant physiology with 21st-century precision robotics, multispectral remote sensing, and soil microbiome diagnostics.
          </p>
        </div>

        {/* Main Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
            marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)',
          }}
          className="about-grid"
        >
          {/* Left Column: Visual Showcase Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '16/11',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                minHeight: '260px',
              }}
            >
              <Image
                src="/images/smart-robot.jpg"
                alt="High-End Agri With Modern Technology"
                fill
                style={{ objectFit: 'cover' }}
              />

              {/* In-Card Pill Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(8, 32, 21, 0.88)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  color: '#a3e635',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Cpu size={14} />
                <span>Next-Gen Smart Agronomy</span>
              </div>

              {/* Bottom Inset Stat */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sustainability Impact
                  </div>
                  <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 800, color: '#082015' }}>
                    35% Chemical Runoff Reduction
                  </div>
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={18} />
                </div>
              </div>
            </div>

            {/* Floating Side Badge */}
            <div
              className="about-floating-badge animate-float"
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-10px',
                background: '#082015',
                color: '#ffffff',
                border: '1px solid rgba(163, 230, 53, 0.4)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Award size={20} color="#a3e635" />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#a3e635', fontWeight: 700 }}>ICAR Young Scholar</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>National Honoree</div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Interactive Tabbed View */}
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: 800,
                color: '#082015',
                marginBottom: '0.9rem',
                lineHeight: 1.25,
              }}
            >
              Bridging Soil Health, Edge Sensors & Drone Photogrammetry
            </h3>

            <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.92rem, 1.5vw, 1.02rem)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {studentProfile.aboutSummary}
            </p>

            {/* Tab Selector Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.4rem',
                background: '#f0f7f3',
                padding: '0.35rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              {(['mission', 'philosophy', 'capabilities'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: '1 1 auto',
                    minWidth: '100px',
                    padding: '0.65rem 0.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab ? '#082015' : 'transparent',
                    color: activeTab === tab ? '#a3e635' : '#334e40',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'mission' ? 'Core Mission' : tab === 'philosophy' ? 'My Philosophy' : 'Field Capabilities'}
                </button>
              ))}
            </div>

            {/* Active Tab Panel */}
            <div
              style={{
                background: '#f8faf9',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015', marginBottom: '0.5rem' }}>
                {tabContents[activeTab].title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#4b6356', lineHeight: 1.6, marginBottom: '0.9rem' }}>
                {tabContents[activeTab].text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {tabContents[activeTab].points.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.86rem', color: '#164e34', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Cards */}
        <div className="grid-4">
          {studentProfile.corePillars.map((pillar, index) => {
            const icons = {
              Cpu: <Cpu size={24} color="#10b981" />,
              Sprout: <Sprout size={24} color="#10b981" />,
              Radio: <Radio size={24} color="#10b981" />,
              ShieldCheck: <ShieldCheck size={24} color="#10b981" />,
            };
            return (
              <div
                key={index}
                className="card-white"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icons[pillar.icon as keyof typeof icons] || <Sparkles size={24} color="#10b981" />}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#527363', lineHeight: 1.55 }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 500px) {
          .about-floating-badge {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
