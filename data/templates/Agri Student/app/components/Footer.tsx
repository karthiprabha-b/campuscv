'use client';

import React from 'react';
import { studentProfile } from '@/data/portfolioData';
import { Sprout, ArrowUp, Leaf } from 'lucide-react';

export default function Footer() {
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const topEl = document.getElementById('hero') || document.querySelector('header') || document.getElementById('template-root') || document.body;
        if (topEl && typeof topEl.scrollIntoView === 'function') {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      try { window.scrollTo(0, 0); } catch (_) {}
    }
  };

  return (
    <footer
      style={{
        background: '#04130c',
        color: '#ffffff',
        padding: 'clamp(3rem, 5vw, 4.5rem) 0 2rem 0',
        borderTop: '1px solid rgba(52, 211, 153, 0.15)',
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 0.85fr 0.85fr',
            gap: 'clamp(1.75rem, 3vw, 3rem)',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Sprout size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-primary)' }}>
                {studentProfile.name}
              </span>
            </div>

            <p style={{ color: '#94d3a2', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '420px', marginBottom: '1.25rem' }}>
              Agricultural Sciences & Precision Agritech Scholar committed to data-backed crop scouting, low-power IoT telemetry, and biological soil regeneration.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a3e635', fontSize: '0.82rem', fontWeight: 600 }}>
              <Leaf size={15} style={{ flexShrink: 0 }} />
              <span>Dedicated to Climate-Resilient Global Food Security</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {['About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'].map((item: string) => {
                const id = item.toLowerCase();
                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    style={{
                      color: '#a7cfba',
                      fontSize: '0.86rem',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Academic & Research Column */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Academic Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <a
                href={studentProfile.socialLinks.scholar}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#a7cfba', fontSize: '0.86rem' }}
              >
                Google Scholar
              </a>
              <a
                href={studentProfile.socialLinks.researchgate}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#a7cfba', fontSize: '0.86rem' }}
              >
                ResearchGate Publications
              </a>
              <a
                href={studentProfile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#a7cfba', fontSize: '0.86rem' }}
              >
                LinkedIn Professional
              </a>
              <a
                href={studentProfile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#a7cfba', fontSize: '0.86rem' }}
              >
                GitHub Open Agri-Tools
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: '#708c7f',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} {studentProfile.name}. Precision Agronomy Portfolio.
          </div>

          <button
            onClick={scrollToTop}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minHeight: '34px',
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
