import React from 'react';
import { Send, Mail, Phone, MapPin, Linkedin, Github, BookOpen, Globe2, Sparkles, ArrowUpRight } from 'lucide-react';
import { studentProfile } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', gpa:'3.94', graduationYear:'2026', currentDegree:'B.Sc. Agricultural Sciences', university:'National Agricultural University', tagline:'Precision AgriTech Specialist', aboutSummary:'Dedicated Agricultural Science scholar.', socialLinks:{linkedin:'',github:'',researchgate:'',scholar:'',twitter:''}, stats:[], corePillars:[] };

export default function Contact({ data = {} }) {
  const name = data?.name || data?.fullName || _agriProfile.name;
  const email = data?.contact?.email || data?.email || _agriProfile.email;
  const phone = data?.contact?.phone || data?.phone || _agriProfile.phone;
  const location = data?.contact?.location || data?.location || _agriProfile.location;
  const university = data?.contact?.university || data?.university || _agriProfile.university;
  
  const social = data?.socialLinks || data?.socials || data?.social || _agriProfile?.socialLinks;
  const linkedin = social?.linkedin || _agriProfile?.socialLinks?.linkedin || '';
  const github = social?.github || _agriProfile?.socialLinks?.github || '';
  const scholar = social?.scholar || social?.googleScholar || _agriProfile?.socialLinks?.scholar || '';
  const researchgate = social?.researchgate || _agriProfile?.socialLinks?.researchgate || '';

  return (
    <section 
      id="contact" 
      data-cv-section="contact" 
      data-node-id="section:contact:root:section:0"
      className="agri-section-padding" 
      style={{ background: '#ffffff', position: 'relative' }}
    >
      <div className="agri-container">
        {/* Section Header */}
        <div className="agri-section-header">
          <div className="agri-badge-pill">
            <Send size={16} />
            <span>CONNECT & COLLABORATE</span>
          </div>
          <h2 className="agri-section-title" data-cv="contact.title">
            Let’s Connect & Cultivate Innovations
          </h2>
          <p className="agri-section-description" data-cv="contact.description">
            Open for graduate research fellowships, precision agriculture ventures, field trial consulting, and sustainable agronomy opportunities.
          </p>
        </div>

        {/* Direct Channels 3-Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem',
            marginBottom: '2.75rem',
          }}
          className="contact-cards-grid"
        >
          {/* 1. Email Card */}
          <div
            className="agri-card-white"
            data-node-id="container:contact:card:email"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '22px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(8, 32, 21, 0.05)',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #a7f3d0',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                }}
              >
                <Mail size={24} />
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Academic & Work Email
              </div>
              <div
                data-cv="contact.email"
                data-node-id="text:contact:email"
                style={{
                  fontSize: 'clamp(0.92rem, 1.6vw, 1.05rem)',
                  fontWeight: 800,
                  color: '#082015',
                  wordBreak: 'break-all',
                  lineHeight: 1.3,
                  marginBottom: '0.35rem',
                }}
              >
                {email}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#527363', margin: '0 0 1rem 0' }}>
                Response time: Within 24 business hours
              </p>
            </div>

            <a
              href={`mailto:${email}`}
              className="agri-btn agri-btn-primary"
              data-node-id="button:contact:email:send"
              style={{
                width: '100%',
                padding: '0.65rem 1.25rem',
                fontSize: '0.88rem',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Mail size={16} />
              <span>Send Email</span>
            </a>
          </div>

          {/* 2. Phone / WhatsApp Card */}
          <div
            className="agri-card-white"
            data-node-id="container:contact:card:phone"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '22px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(8, 32, 21, 0.05)',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)',
                  color: '#65a30d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #bef264',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(101, 163, 13, 0.15)',
                }}
              >
                <Phone size={24} />
              </div>
              <div style={{ fontSize: '0.74rem', color: '#65a30d', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Direct Phone / Hotline
              </div>
              <div
                data-cv="contact.phone"
                data-node-id="text:contact:phone"
                style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                  fontWeight: 800,
                  color: '#082015',
                  lineHeight: 1.3,
                  marginBottom: '0.35rem',
                }}
              >
                {phone}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#527363', margin: '0 0 1rem 0' }}>
                Available for Project & Trial Consultations
              </p>
            </div>

            <a
              href={`tel:${phone}`}
              className="agri-btn agri-btn-lime"
              data-node-id="button:contact:phone:call"
              style={{
                width: '100%',
                padding: '0.65rem 1.25rem',
                fontSize: '0.88rem',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={16} />
              <span>Call / WhatsApp</span>
            </a>
          </div>

          {/* 3. Campus & Research Hub Card */}
          <div
            className="agri-card-white"
            data-node-id="container:contact:card:location"
            style={{
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '22px',
              border: '1px solid #d4e8dc',
              textAlign: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(8, 32, 21, 0.05)',
              justifyContent: 'space-between',
              minHeight: '260px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #a7f3d0',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                }}
              >
                <MapPin size={24} />
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Campus & Research Hub
              </div>
              <div
                style={{
                  fontSize: 'clamp(0.92rem, 1.5vw, 1rem)',
                  fontWeight: 800,
                  color: '#082015',
                  lineHeight: 1.3,
                  marginBottom: '0.25rem',
                }}
              >
                {university}
              </div>
              <div
                data-cv="contact.location"
                data-node-id="text:contact:location"
                style={{
                  fontSize: '0.84rem',
                  color: '#527363',
                  fontWeight: 600,
                  margin: '0 0 1rem 0',
                }}
              >
                {location}
              </div>
            </div>

            <div
              style={{
                width: '100%',
                padding: '0.55rem 1rem',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              🌱 Lab & Field Trials Welcome
            </div>
          </div>
        </div>

        {/* Academic & Professional Networks Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #04130c 0%, #082015 100%)',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            color: '#ffffff',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            boxShadow: '0 16px 40px rgba(4, 19, 12, 0.25)',
          }}
          data-node-id="container:contact:socials:banner"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a3e635', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Sparkles size={15} />
                <span>Verified Academic & Research Networks</span>
              </div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', fontWeight: 800, color: '#ffffff' }}>
                Connect Across Scholar & Developer Profiles
              </h3>
            </div>
            <p style={{ color: '#94d3a2', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.5 }}>
              Access published preprints, trial datasets, open-source GIS tools, and professional updates.
            </p>
          </div>

          {/* Social Buttons Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {scholar && (
              <a
                href={scholar}
                target="_blank"
                rel="noreferrer"
                data-node-id="button:social:scholar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Google Scholar</div>
                    <div style={{ fontSize: '0.72rem', color: '#94d3a2' }}>Citations & Papers</div>
                  </div>
                </div>
                <ArrowUpRight size={16} color="#a3e635" />
              </a>
            )}

            {researchgate && (
              <a
                href={researchgate}
                target="_blank"
                rel="noreferrer"
                data-node-id="button:social:researchgate"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <Globe2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>ResearchGate</div>
                    <div style={{ fontSize: '0.72rem', color: '#94d3a2' }}>Lab Data & RG Score</div>
                  </div>
                </div>
                <ArrowUpRight size={16} color="#a3e635" />
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                data-node-id="button:social:linkedin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <Linkedin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>LinkedIn</div>
                    <div style={{ fontSize: '0.72rem', color: '#94d3a2' }}>Professional Network</div>
                  </div>
                </div>
                <ArrowUpRight size={16} color="#a3e635" />
              </a>
            )}

            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                data-node-id="button:social:github"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <Github size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>GitHub</div>
                    <div style={{ fontSize: '0.72rem', color: '#94d3a2' }}>Open Agri Repos</div>
                  </div>
                </div>
                <ArrowUpRight size={16} color="#a3e635" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
