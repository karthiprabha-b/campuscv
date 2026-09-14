'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import SocialIcons from './SocialIcons';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  data?: any;
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ data, onNavigate }: FooterProps) {
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

  const dynamicSections = Array.isArray(data?.sections) && data.sections.length > 0
    ? data.sections
    : (Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
      ? data.sectionOrder
      : ['Hero', 'About', 'Experience', 'Education', 'Projects', 'Skills', 'Certificates', 'Contact']);

  const navLinks = dynamicSections
    .filter((sec: any) => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const lower = sName.toLowerCase().trim();
      return lower && lower !== 'header' && lower !== 'footer' && lower !== 'sidebar' && lower !== 'navbar';
    })
    .map((sec: any) => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      let id = sName.toLowerCase().replace(/\s+/g, '-');
      if (id === 'home' || id === 'intro') id = 'hero';
      if (id === 'works' || id === 'portfolio') id = 'projects';
      if (id === 'certifications') id = 'certificates';
      return { id, label: cleanName === 'Hero' ? 'Home' : cleanName };
    });

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '4rem 0 2.5rem 0',
        position: 'relative',
      }}
    >
      <div className="site-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand & tagline */}
          <div style={{ maxWidth: '360px' }}>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.04em',
                marginBottom: '0.75rem',
                color: 'var(--text-main)',
              }}
            >
              <span>{portfolioData.personal.firstName}</span>
              <span style={{ color: 'var(--accent-yellow)' }}>.</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {portfolioData.personal.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', maxWidth: '480px' }}>
            {navLinks.map((item: { id: string; label: string }) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-yellow)';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-main)';
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ArrowUp size={20} />
          </button>
        </div>

        {/* Bottom copyright and socials */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div>
            © {new Date().getFullYear()} {portfolioData.personal.firstName} {portfolioData.personal.lastName}. All Rights Reserved.
          </div>
          <SocialIcons size={16} gap="1rem" />
        </div>
      </div>
    </footer>
  );
}
