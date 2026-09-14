'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Menu, X, Send } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certificates', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Certificates', href: '#certificates', id: 'certificates' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100vw',
        zIndex: 900,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(6, 26, 18, 0.94)'
          : 'rgba(4, 19, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.2)',
        boxShadow: isScrolled ? '0 8px 30px rgba(0, 0, 0, 0.35)' : 'none',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              flexShrink: 0,
            }}
          >
            <Sprout size={20} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: '#ffffff',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Aarav Sharma
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#a3e635',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              AgriTech & Agronomy
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                style={{
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#a3e635' : '#e2f4ea',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  padding: '0.3rem 0',
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#a3e635',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <a
            href="#contact"
            className="btn btn-lime desktop-cta-btn"
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.84rem',
              borderRadius: '9999px',
              minHeight: '38px',
            }}
          >
            <Send size={14} />
            <span>Connect</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.45rem',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(6, 26, 18, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(52, 211, 153, 0.25)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#e2f4ea',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '0.45rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'block',
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: '0.5rem' }}>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-lime"
              style={{ width: '100%', padding: '0.75rem', minHeight: '44px' }}
            >
              <Send size={16} />
              <span>Connect with Aarav</span>
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 980px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .desktop-cta-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
