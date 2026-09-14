import React, { useState, useEffect } from 'react';
import { Sprout, Menu, X, Send } from 'lucide-react';
import { studentProfile } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', gpa:'3.94', graduationYear:'2026', currentDegree:'B.Sc. Agricultural Sciences', university:'National Agricultural University', tagline:'Precision AgriTech Specialist', aboutSummary:'Dedicated Agricultural Science scholar.', socialLinks:{linkedin:'',github:'',researchgate:'',scholar:'',twitter:''}, stats:[], corePillars:[] };

export default function Navbar({ data = {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const name = data?.name || data?.fullName || data?.hero?.name || _agriProfile.name;
  const role = data?.role || data?.headline || data?.title || data?.hero?.role || 'AgriTech & Agronomy';

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
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

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const defaultOrder = ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];
  const dynamicSections = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0
    ? data.sectionOrder
    : defaultOrder;

  const navLinks = dynamicSections
    .filter(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      return sName.toLowerCase() !== 'header' && sName.toLowerCase() !== 'footer' && sName.toLowerCase() !== 'navbar';
    })
    .map(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      const cleanName = sName.charAt(0).toUpperCase() + sName.slice(1);
      const id = sName.toLowerCase().replace(/\s+/g, '-');
      const href = id === 'home' || id === 'hero' ? '#hero' : `#${id}`;
      return {
        label: cleanName === 'Hero' ? 'Home' : cleanName,
        href,
        id: id === 'home' ? 'hero' : id
      };
    });

  return (
    <header
      style={{
        position: 'sticky',
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
        className="agri-container"
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
              background: 'var(--primary, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-foreground, #ffffff)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
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
              {name}
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav
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
                  color: isActive ? 'var(--primary, #a3e635)' : '#e2f4ea',
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
                      background: 'var(--primary, #a3e635)',
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
            className="agri-btn agri-btn-lime desktop-cta-btn"
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
              className="agri-btn agri-btn-lime"
              style={{ width: '100%', padding: '0.75rem', minHeight: '44px' }}
            >
              <Send size={16} />
              <span>Connect with {name.split(' ')[0]}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
