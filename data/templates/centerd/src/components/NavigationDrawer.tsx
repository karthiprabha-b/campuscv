'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { X, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
}: NavigationDrawerProps) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'hero', label: 'Home', num: '01' },
    { id: 'about', label: 'About', num: '02' },
    { id: 'experience', label: 'Experience', num: '03' },
    { id: 'education', label: 'Education', num: '04' },
    { id: 'projects', label: 'Works', num: '05' },
    { id: 'skills', label: 'Skills', num: '06' },
    { id: 'certificates', label: 'Certificates', num: '07' },
    { id: 'contact', label: 'Contact', num: '08' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          marginLeft: 'auto',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: 'var(--bg-main)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem 2.5rem',
          overflowY: 'auto',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Top bar with close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '1.75rem', fontWeight: 900 }}>
            <span>{portfolioData.personal.firstName}</span>
            <span style={{ color: 'var(--accent-yellow)' }}>.</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav style={{ margin: '2.5rem 0' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.85rem',
                      fontWeight: isActive ? 900 : 700,
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      transition: 'all 0.2s ease',
                      padding: '4px 0',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-main)';
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: isActive ? 'var(--accent-yellow)' : 'var(--text-subtle)',
                        }}
                      >
                        {item.num}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive ? (
                      <ArrowRight size={20} color="var(--accent-yellow)" />
                    ) : (
                      <span style={{ width: '20px' }} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Contact Details */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="var(--accent-yellow)" />
              <a href={`mailto:${portfolioData.personal.email}`} style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {portfolioData.personal.email}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="var(--accent-yellow)" />
              <span>{portfolioData.personal.location}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
