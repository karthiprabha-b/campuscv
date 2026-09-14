'use client';

import React from 'react';
import { studentProfile } from '@/data/portfolioData';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  BookOpen, 
  Globe2, 
  Sparkles 
} from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="section-padding" style={{ background: '#ffffff', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill">
            <Send size={16} />
            <span>CONNECT & COLLABORATE</span>
          </div>
          <h2 className="section-title">
            Let’s Connect & Cultivate Innovations
          </h2>
          <p className="section-description">
            Open for graduate research fellowships, precision agriculture ventures, field trial consulting, and sustainable agronomy opportunities.
          </p>
        </div>

        {/* Direct Channels 3-Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
          className="contact-cards-grid"
        >
          {/* Email Card */}
          <a
            href={`mailto:${studentProfile.email}`}
            className="card-white"
            style={{
              padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              borderRadius: '20px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a7f3d0',
              }}
            >
              <Mail size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Academic & Work Email
              </div>
              <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 800, color: '#082015', wordBreak: 'break-all' }}>
                {studentProfile.email}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#527363', marginTop: '0.3rem' }}>
                Response time: Within 24 business hours
              </p>
            </div>
            <span
              className="btn btn-primary"
              style={{
                marginTop: 'auto',
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                width: '100%',
                minHeight: '40px',
              }}
            >
              <Mail size={15} />
              <span>Send Email</span>
            </span>
          </a>

          {/* Phone / WhatsApp Card */}
          <a
            href={`tel:${studentProfile.phone}`}
            className="card-white"
            style={{
              padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              borderRadius: '20px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a7f3d0',
              }}
            >
              <Phone size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Direct Phone / WhatsApp
              </div>
              <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 800, color: '#082015' }}>
                {studentProfile.phone}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#527363', marginTop: '0.3rem' }}>
                Mon - Fri, 9:00 AM - 6:00 PM IST / PST
              </p>
            </div>
            <span
              className="btn btn-lime"
              style={{
                marginTop: 'auto',
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                width: '100%',
                minHeight: '40px',
              }}
            >
              <Phone size={15} />
              <span>Call / WhatsApp</span>
            </span>
          </a>

          {/* Campus & Research Base Card */}
          <div
            className="card-white"
            style={{
              padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              borderRadius: '20px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a7f3d0',
              }}
            >
              <MapPin size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                Campus & Research Hub
              </div>
              <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 800, color: '#082015' }}>
                {studentProfile.university}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#527363', marginTop: '0.3rem' }}>
                {studentProfile.location}
              </p>
            </div>
            <div
              style={{
                marginTop: 'auto',
                padding: '0.55rem 1rem',
                fontSize: '0.8rem',
                borderRadius: '9999px',
                background: '#f0fdf4',
                color: '#166534',
                fontWeight: 700,
                width: '100%',
                border: '1px solid #bbf7d0',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Lab & Field Visiting Available
            </div>
          </div>
        </div>

        {/* Academic Profiles & Social Grid Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #082015 0%, #04130c 100%)',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Sparkles size={15} /> Verified Academic & Research Networks
              </div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
                Connect Across Scholar & Developer Profiles
              </h3>
            </div>
            <p style={{ color: '#a7cfba', fontSize: '0.88rem', maxWidth: '440px', margin: 0 }}>
              Access published preprints, trial datasets, open-source GIS tools, and professional updates.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
            }}
            className="academic-profiles-grid"
          >
            <a
              href={studentProfile.socialLinks.scholar}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>Scholar</div>
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Citations</div>
              </div>
            </a>

            <a
              href={studentProfile.socialLinks.researchgate}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#00ccbb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Globe2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>ResearchGate</div>
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Preprints</div>
              </div>
            </a>

            <a
              href={studentProfile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Linkedin size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>LinkedIn</div>
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Network</div>
              </div>
            </a>

            <a
              href={studentProfile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#ffffff',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Github size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>GitHub</div>
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Agri-Code</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .contact-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .academic-profiles-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .academic-profiles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
