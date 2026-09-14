'use client';

import React, { useState, useEffect } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Moon, Sun, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  data?: any;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Header({
  data,
  activeSection,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const defaultOrder = ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];
  const dynamicSections = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
    ? data.sectionOrder
    : defaultOrder;

  const navItems = dynamicSections
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
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        backgroundColor: scrolled ? 'var(--bg-main)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Brand Logo */}
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('hero');
        }}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.04em',
          color: 'var(--text-main)',
        }}
      >
        <span>{portfolioData.personal.firstName}</span>
        <span style={{ color: 'var(--accent-yellow)', fontSize: '2.4rem', lineHeight: 0 }}>.</span>
      </a>

      {/* Right Controls & Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Availability Pill */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
          className="desktop-pill"
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          Available for Q3/Q4 Projects
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Mode"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Quick Contact CTA */}
        <button
          onClick={() => onNavigate('contact')}
          className="btn-solid-black"
          style={{
            display: 'none',
            padding: '10px 20px',
            fontSize: '0.72rem',
          }}
          id="header-cta-btn"
        >
          <span>Get in Touch</span>
          <ArrowUpRight size={14} />
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
          }}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-pill {
            display: flex !important;
          }
          #header-cta-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
