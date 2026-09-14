'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { studentProfile } from '@/data/portfolioData';
import ResumeModal from './ResumeModal';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  FileText, 
  Leaf 
} from 'lucide-react';

export default function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(90px, 14vw, 120px)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Full-Size Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <Image
          src="/images/hero-agri.jpg"
          alt="Agriculture Terraces & Smart Farming"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          priority
        />

        {/* Cinematic Vignette Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(4, 19, 12, 0.55) 0%, rgba(4, 19, 12, 0.88) 75%, #04130c 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(4, 19, 12, 0.6) 0%, transparent 40%, rgba(4, 19, 12, 0.95) 90%, #04130c 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Top Badge Pill */}
        <div
          className="badge-pill dark"
          style={{
            margin: '0 auto 1.25rem auto',
            padding: '0.45rem 1.1rem',
            background: 'rgba(8, 32, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(163, 230, 53, 0.4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            maxWidth: '92%',
          }}
        >
          <Leaf size={15} color="#a3e635" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)', letterSpacing: '0.06em', fontWeight: 800, color: '#bef264', textAlign: 'center' }}>
            AGRICULTURAL SCIENCES & PRECISION AGTECH SCHOLAR
          </span>
        </div>

        {/* Mega Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 5.8vw, 4.8rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
            maxWidth: '1000px',
            margin: '0 auto 1rem auto',
          }}
        >
          Agriculture For A{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #a3e635 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline',
            }}
          >
            Sustainable Tomorrow
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.98rem, 2vw, 1.25rem)',
            lineHeight: 1.65,
            color: '#d1fae5',
            maxWidth: '740px',
            margin: '0 auto 1.75rem auto',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
            padding: '0 0.5rem',
          }}
        >
          Hi, I’m <strong>{studentProfile.name}</strong>. Merging plant physiology with multispectral drone remote sensing, subterranean soil LoRa sensors, and predictive AI to cultivate high-yield, climate-smart food ecosystems.
        </p>

        {/* Credential Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '2.25rem',
            fontSize: 'clamp(0.78rem, 1.8vw, 0.88rem)',
            color: '#a7cfba',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <GraduationCap size={16} color="#a3e635" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>B.Sc. (Hons.) Ag Science (2026)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <MapPin size={16} color="#a3e635" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{studentProfile.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <ShieldCheck size={16} color="#a3e635" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>FAA/DGCA Drone Pilot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(163, 230, 53, 0.4)' }}>
            <Sparkles size={16} color="#a3e635" />
            <span style={{ color: '#bef264', fontWeight: 700 }}>GPA: 3.94 / 4.0 (Rank #1)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            alignItems: 'center',
            maxWidth: '650px',
            margin: '0 auto',
          }}
          className="hero-buttons-wrap"
        >
          <a
            href="#projects"
            className="btn btn-lime"
            style={{
              padding: '0.95rem 1.8rem',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <span>Explore Research & Projects</span>
            <ArrowRight size={18} />
          </a>

          <button
            onClick={() => setResumeOpen(true)}
            className="btn btn-glass"
            style={{
              padding: '0.95rem 1.6rem',
              fontSize: '0.98rem',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <FileText size={18} color="#a3e635" />
            <span>Curriculum Vitae</span>
          </button>

          <a
            href="#contact"
            className="btn"
            style={{
              background: 'rgba(16, 185, 129, 0.25)',
              color: '#ffffff',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '0.95rem 1.5rem',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <span>Connect with Aarav</span>
          </a>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 4.5rem)',
            background: 'rgba(8, 32, 21, 0.85)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
          className="hero-stats-bar"
        >
          {studentProfile.stats.map((stat, idx) => (
            <div
              key={idx}
              className="hero-stat-cell"
              style={{
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                  fontWeight: 900,
                  color: '#a3e635',
                  fontFamily: 'var(--font-primary)',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94d3a2', marginTop: '0.15rem' }}>
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      <style jsx>{`
        @media (min-width: 1025px) {
          .hero-stat-cell:not(:last-child) {
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding-right: 1.25rem;
          }
        }
        @media (max-width: 1024px) and (min-width: 641px) {
          .hero-stats-bar {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
            text-align: left;
          }
        }
        @media (max-width: 640px) {
          .hero-stats-bar {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            text-align: center;
          }
          .hero-stat-cell {
            text-align: center !important;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .hero-stat-cell:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .hero-buttons-wrap {
            flex-direction: column;
            width: 100%;
          }
          .hero-buttons-wrap > * {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
