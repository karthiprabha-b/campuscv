import React, { useState } from 'react';
import { 
  Sprout, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Leaf, 
  Sparkles,
  Award 
} from 'lucide-react';
import { studentProfile } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', gpa:'3.94', graduationYear:'2026', currentDegree:'B.Sc. Agricultural Sciences', university:'National Agricultural University', tagline:'Precision AgriTech Specialist', aboutSummary:'Dedicated Agricultural Science scholar.', socialLinks:{linkedin:'',github:'',researchgate:'',scholar:'',twitter:''}, stats:[], corePillars:[] };

export default function About({ data = {} }) {
  const [activeTab, setActiveTab] = useState('mission');

  const name = data?.name || data?.fullName || _agriProfile.name;
  const rawBio = data?.about?.description || data?.about?.bio || data?.aboutSummary || data?.bio || data?.summary || _agriProfile.aboutSummary;
  const bio = rawBio;

  const defaultAboutImg = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80';
  const candidateAbout = 
    data?.contentOverrides?.['image:about:card:0']?.src ||
    (typeof data?.contentOverrides?.['image:about:card:0'] === 'string' ? data?.contentOverrides?.['image:about:card:0'] : null) ||
    data?.contentOverrides?.['image:about:card:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:about:card:img:0'] === 'string' ? data?.contentOverrides?.['image:about:card:img:0'] : null) ||
    data?.imageOverrides?.['about.image'] ||
    data?.about?.image || 
    data?.aboutImage;

  const isDemoOrAvatarAbout = (url) => {
    if (!url || typeof url !== 'string') return true;
    
    // Explicit user custom uploads via editor are always valid
    if (
      url.startsWith('blob:') || 
      url.startsWith('data:image') || 
      url.includes('/uploads/') || 
      url.includes('cloudinary') || 
      url.includes('firebase') || 
      url.includes('supabase') || 
      url.includes('s3.amazonaws.com') ||
      url.includes('photo-1592982537447') ||
      url.includes('photo-1500382017468') ||
      url.includes('photo-1625246333195') ||
      url.includes('photo-1586771107445')
    ) {
      return false;
    }
    
    // Check if it matches any user profile avatar field
    if (
      url === data?.avatarUrl ||
      url === data?.profileImage ||
      url === data?.photo ||
      url === data?.image ||
      url === data?.hero?.profileImage ||
      url === data?.hero?.avatarUrl ||
      url === data?.hero?.photo
    ) {
      return true;
    }
    
    // Stock face portrait Unsplash IDs commonly injected in demo portfolios
    const faceIds = [
      'photo-1534528741775',
      'photo-1507003211169',
      'photo-1500648767791',
      'photo-1494790108377',
      'photo-1539571696357',
      'photo-1517841905240',
      'photo-1522075469751',
      'photo-1544005313',
      'photo-1560250097',
      'photo-1573496359142',
      'photo-1580489944761'
    ];
    return faceIds.some(id => url.includes(id));
  };

  const aboutImage = (candidateAbout && !isDemoOrAvatarAbout(candidateAbout)) ? candidateAbout : defaultAboutImg;

  const tabContents = {
    mission: {
      title: "Sustainable Food Security Through Precision Engineering",
      text: "My driving mission is to decouple agricultural productivity from environmental degradation. By implementing localized variable-rate nitrogen delivery, multi-spectral drone health indexing, and closed-loop hydroponics, we can feed growing populations while revitalizing degraded soils and cutting greenhouse emissions.",
      points: [
        "Eliminate non-point source fertilizer runoff into watersheds.",
        "Equip smallholder and commercial farmers with actionable edge-AI analytics.",
        "Pioneer biological soil regeneration to lock carbon into deep humic layers.",
      ],
    },
    philosophy: {
      title: "Data-Informed Agronomy Grounded in Field Reality",
      text: "Technology in agriculture is only as viable as its practicality in muddy boots and harsh weather. My philosophy unites stringent wet-lab analytical chemistry and biostatistics with robust, low-power embedded hardware that withstands extreme field environments.",
      points: [
        "Sensors must be resilient, self-powered, and easily serviceable by growers.",
        "Algorithms must explain root causes, not just provide black-box predictions.",
        "Ecosystem balance precedes chemical interventions in pest and pathogen control.",
      ],
    },
    capabilities: {
      title: "End-to-End Field & Computational Agronomy",
      text: "I operate across both scientific domains: from soil profiling, spectrophotometry, and micro-plot trial design to GIS raster processing, Python modeling, and autonomous UAV flight missions.",
      points: [
        "Sub-2cm ground sampling distance (GSD) drone orthomosaics & NDVI.",
        "Custom LoRa subterranean soil telemetry hardware & firmware deployment.",
        "Statistical trial design (RCBD, Split-Plot) and ANOVA analysis in R.",
      ],
    },
  };

  const pillars = Array.isArray(data?.pillars || data?.corePillars) && (data?.pillars || data?.corePillars).length > 0
    ? (data.pillars || data.corePillars)
    : _agriProfile.corePillars;

  return (
    <section id="about" className="agri-section-padding" style={{ background: '#ffffff', position: 'relative' }}>
      <div className="agri-container">
        {/* Section Header */}
        <div className="agri-section-header">
          <div className="agri-badge-pill">
            <Sprout size={16} />
            <span>ABOUT MY AGRONOMIC VISION</span>
          </div>
          <h2 className="agri-section-title">
            A Good Agriculture For A Better Tomorrow
          </h2>
          <p className="agri-section-description">
            Combining traditional plant physiology with 21st-century precision robotics, multispectral remote sensing, and soil microbiome diagnostics.
          </p>
        </div>

        {/* Main Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'center',
            marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)',
          }}
          className="about-grid"
        >
          {/* Left Column: Visual Showcase Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '16/11',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                minHeight: '260px',
              }}
            >
              <img
                src={aboutImage}
                alt={name}
                data-node-id="image:about:card:img:0"
                data-edit-key="about.image"
                data-cv="about.image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* In-Card Pill Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(8, 32, 21, 0.88)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  color: '#a3e635',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Cpu size={14} />
                <span>Next-Gen Smart Agronomy</span>
              </div>

              {/* Bottom Inset Stat */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sustainability Impact
                  </div>
                  <div style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 800, color: '#082015' }}>
                    35% Chemical Runoff Reduction
                  </div>
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={18} />
                </div>
              </div>
            </div>

            {/* Floating Side Badge */}
            <div
              className="about-floating-badge"
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-10px',
                background: '#082015',
                color: '#ffffff',
                border: '1px solid rgba(163, 230, 53, 0.4)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Award size={20} color="#a3e635" />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#a3e635', fontWeight: 700 }}>Honors & Accolades</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>National Agri Scholar</div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Interactive Tabbed View */}
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: 800,
                color: '#082015',
                marginBottom: '0.9rem',
                lineHeight: 1.25,
              }}
            >
              Bridging Soil Health, Edge Sensors & Drone Photogrammetry
            </h3>

            <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(0.92rem, 1.5vw, 1.02rem)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {bio}
            </p>

            {/* Sub Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid #e1ede6',
                paddingBottom: '0.2rem',
                marginBottom: '1.25rem',
                overflowX: 'auto',
              }}
            >
              {Object.keys(tabContents).map((tabKey) => {
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--primary, #0f3d27)' : '#668a77',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '3px solid var(--primary, #10b981)' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '-0.3rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {tabContents[tabKey].label}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content Card */}
            <div
              style={{
                background: '#f3faf6',
                border: '1px solid #c8e7d7',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015', marginBottom: '0.5rem' }}>
                {tabContents[activeTab].title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#4b6356', lineHeight: 1.6, marginBottom: '0.9rem' }}>
                {tabContents[activeTab].text}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {tabContents[activeTab].points.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.86rem', color: '#164e34', fontWeight: 600 }}>
                    <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary, #10b981)' }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Cards */}
        <div className="agri-grid-4">
          {pillars.map((pillar, index) => {
            const icons = {
              Cpu: <Cpu size={24} style={{ color: 'var(--primary, #10b981)' }} />,
              Sprout: <Sprout size={24} style={{ color: 'var(--primary, #10b981)' }} />,
              Radio: <Radio size={24} style={{ color: 'var(--primary, #10b981)' }} />,
              ShieldCheck: <ShieldCheck size={24} style={{ color: 'var(--primary, #10b981)' }} />,
            };
            return (
              <div
                key={index}
                className="agri-card-white"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {icons[pillar.icon] || <Sparkles size={24} style={{ color: 'var(--primary, #10b981)' }} />}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#082015' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#527363', lineHeight: 1.55 }}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
