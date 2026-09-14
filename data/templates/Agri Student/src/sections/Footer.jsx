import React from 'react';
import { Sprout, ArrowUp, Leaf } from 'lucide-react';
import { studentProfile } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', gpa:'3.94', graduationYear:'2026', currentDegree:'B.Sc. Agricultural Sciences', university:'National Agricultural University', tagline:'Precision AgriTech Specialist', aboutSummary:'Dedicated Agricultural Science scholar.', socialLinks:{linkedin:'',github:'',researchgate:'',scholar:'',twitter:''}, stats:[], corePillars:[] };

export default function Footer({ data = {} }) {
  const name = data?.name || data?.fullName || _agriProfile.name;
  const social = data?.socialLinks || data?.socials || data?.social || _agriProfile.socialLinks;

  const scrollToTop = (e) => {
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
    : ['Hero', 'About', 'Education', 'Experience', 'Projects', 'Skills', 'Certificates', 'Contact'];

  const navItems = dynamicSections
    .filter(sec => {
      const sName = typeof sec === 'string' ? sec : (sec?.name || sec?.id || '');
      return sName.toLowerCase() !== 'header' && sName.toLowerCase() !== 'footer' && sName.toLowerCase() !== 'navbar';
    })
    .map(sec => typeof sec === 'string' ? sec : (sec?.name || sec?.id || ''));

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
      <div className="agri-container">
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
                  background: 'var(--primary, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-foreground, #ffffff)',
                  flexShrink: 0,
                }}
              >
                <Sprout size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-primary)' }}>
                {name}
              </span>
            </div>

            <p style={{ color: '#94d3a2', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '420px', marginBottom: '1.25rem' }}>
              Agricultural Sciences & Precision Agritech Scholar committed to data-backed crop scouting, low-power IoT telemetry, and biological soil regeneration.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary, #a3e635)', fontSize: '0.82rem', fontWeight: 600 }}>
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
              {navItems.map((item) => {
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
              {social?.scholar && (
                <a
                  href={social.scholar}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#a7cfba', fontSize: '0.86rem' }}
                >
                  Google Scholar
                </a>
              )}
              {social?.researchgate && (
                <a
                  href={social.researchgate}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#a7cfba', fontSize: '0.86rem' }}
                >
                  ResearchGate Publications
                </a>
              )}
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#a7cfba', fontSize: '0.86rem' }}
                >
                  LinkedIn Professional
                </a>
              )}
              {social?.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#a7cfba', fontSize: '0.86rem' }}
                >
                  GitHub Open Agri-Tools
                </a>
              )}
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
            © {new Date().getFullYear()} {name}. Precision Agronomy Portfolio.
          </div>

          <button
            onClick={scrollToTop}
            className="agri-btn"
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
    </footer>
  );
}
