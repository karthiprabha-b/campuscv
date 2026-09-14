import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Leaf,
  FileText
} from 'lucide-react';
import { studentProfile } from '../data/agriDefaults.js';
const _agriProfile = (typeof studentProfile !== 'undefined' && studentProfile) || { name:'Aarav Sharma', title:'Agronomist & AgriTech Specialist', location:'New Delhi', email:'aarav.agriscience@gmail.com', phone:'+1 (555) 382-7492', gpa:'3.94', graduationYear:'2026', currentDegree:'B.Sc. Agricultural Sciences', university:'National Agricultural University', tagline:'Precision AgriTech Specialist', aboutSummary:'Dedicated Agricultural Science scholar.', socialLinks:{linkedin:'',github:'',researchgate:'',scholar:'',twitter:''}, stats:[], corePillars:[] };
import ResumeModal from '../components/ResumeModal';

export default function Hero({ data = {} }) {
  const [resumeOpen, setResumeOpen] = useState(false);

  const name = data?.hero?.name || data?.name || data?.fullName || _agriProfile.name;
  const role = data?.hero?.role || data?.role || data?.headline || data?.title || _agriProfile.title;
  const headline = data?.hero?.headline || 'Agriculture For A Sustainable Tomorrow';
  
  const rawBio = data?.hero?.description || data?.hero?.bio || data?.bio || data?.summary || data?.aboutSummary;
  const bio = rawBio || `Hi, I’m ${name}. Merging plant physiology with multispectral drone remote sensing, subterranean soil LoRa sensors, and predictive AI to cultivate high-yield, climate-smart food ecosystems.`;
  
  const location = data?.hero?.location || data?.location || data?.contact?.location || _agriProfile.location;
  
  // First degree or major
  const firstEdu = Array.isArray(data?.education) && data.education.length > 0 ? data.education[0] : null;
  const degreeStr = data?.hero?.degree || (firstEdu ? `${firstEdu.degree || ''} ${firstEdu.major ? `(${firstEdu.major})` : ''}`.trim() : null) || _agriProfile.currentDegree;
  
  const gpa = String(data?.hero?.gpa || data?.gpa || _agriProfile?.gpa || '3.94 / 4.0');
  
  // Breathtaking Golden Sunlit Agriculture Farmland Landscape Background
  const defaultAgriBg = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80';
  
  // Custom image from editor image overrides, contentOverrides or explicit hero cover setting
  const candidateCover = 
    data?.contentOverrides?.['image:hero:cover:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:cover:0'] === 'string' ? data?.contentOverrides?.['image:hero:cover:0'] : null) ||
    data?.contentOverrides?.['image:hero:background:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:background:img:0'] === 'string' ? data?.contentOverrides?.['image:hero:background:img:0'] : null) ||
    data?.imageOverrides?.['hero.coverImage'] ||
    data?.imageOverrides?.['hero.backgroundImage'] ||
    data?.imageOverrides?.['coverImage'] ||
    data?.hero?.coverImage ||
    data?.hero?.backgroundImage;

  // Filter out any face portraits or demo avatars so they never hijack the full-screen agriculture landscape
  const isDemoOrAvatarUrl = (url) => {
    if (!url || typeof url !== 'string') return true;
    
    // Explicit user custom uploads via editor are always valid
    if (
      url.startsWith('blob:') || 
      url.startsWith('data:image') || 
      url.includes('/uploads/') || 
      url.includes('cloudinary') || 
      url.includes('firebase') || 
      url.includes('supabase') || 
      url.includes('s3.amazonaws.com')
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
      'photo-1580489944761',
      'photo-1531746020798',
      'photo-1566492031773'
    ];
    return faceIds.some(id => url.includes(id));
  };

  const heroImage = (candidateCover && !isDemoOrAvatarUrl(candidateCover)) ? candidateCover : defaultAgriBg;

  // Stats
  const stats = Array.isArray(data?.stats) && data.stats.length > 0 
    ? data.stats 
    : [
        { label: "Academic Standing", value: gpa.includes('/') ? gpa.split('/')[0].replace(/[^0-9.]/g, '') : gpa, subtext: "Top Distinction List" },
        { label: "Field Trials Executed", value: "320+", subtext: "Across Agro-Climatic Zones" },
        { label: "AgriTech Projects", value: Array.isArray(data?.projects) && data.projects.length > 0 ? `${data.projects.length}+` : "14+", subtext: "IoT, Drone, AI & Soil Science" },
        { label: "Drone Scouting Hours", value: "185 hrs", subtext: "Multispectral & RGB Mapping" },
      ];

  return (
    <section
      id="hero"
      data-cv-section="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(90px, 14vw, 120px)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Full-Size Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <img
          src={heroImage}
          alt={name}
          data-node-id="image:hero:cover:0"
          data-edit-key="hero.coverImage"
          data-cv="hero.coverImage"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', cursor: 'pointer' }}
        />

        {/* Cinematic Vignette Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 30%, rgba(4, 19, 12, 0.55) 0%, rgba(4, 19, 12, 0.88) 75%, #04130c 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(4, 19, 12, 0.6) 0%, transparent 40%, rgba(4, 19, 12, 0.95) 90%, #04130c 100%)',
          }}
        />
      </div>

      <div className="agri-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* Top Badge Pill */}
        <div
          className="agri-badge-pill dark"
          style={{
            margin: '0 auto 1.25rem auto',
            padding: '0.45rem 1.1rem',
            background: 'rgba(8, 32, 21, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(163, 230, 53, 0.4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            maxWidth: '92%',
          }}
        >
          <Leaf size={15} color="#a3e635" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)', letterSpacing: '0.06em', fontWeight: 800, color: '#bef264', textAlign: 'center' }} data-cv="hero.role">
            {role.toUpperCase()}
          </span>
        </div>

        {/* Mega Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.1rem, 5.8vw, 4.8rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
            maxWidth: '1000px',
            margin: '0 auto 1rem auto',
          }}
        >
          {headline.includes('Sustainable') ? (
            <>
              {headline.split('Sustainable')[0]}
              <span
                style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #a3e635 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline',
                }}
              >
                Sustainable {headline.split('Sustainable')[1] || 'Tomorrow'}
              </span>
            </>
          ) : (
            <span
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #a3e635 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline',
              }}
            >
              {headline}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.98rem, 2vw, 1.25rem)',
            lineHeight: 1.65,
            color: '#d1fae5',
            maxWidth: '740px',
            margin: '0 auto 1.75rem auto',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
            padding: '0 0.5rem',
          }}
        >
          {bio}
        </p>

        {/* Credential Badges */}
        <div
          className="hero-cred-row"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '2.25rem',
            fontSize: 'clamp(0.78rem, 1.8vw, 0.88rem)',
            color: '#a7cfba',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <GraduationCap size={16} color="#a3e635" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{degreeStr}</span>
          </div>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <MapPin size={16} color="#a3e635" />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{location}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <ShieldCheck size={16} color="#a3e635" />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Verified Researcher</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(8, 32, 21, 0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1px solid rgba(163, 230, 53, 0.4)' }}>
            <Sparkles size={16} color="#a3e635" />
            <span style={{ color: '#bef264', fontWeight: 700 }}>{gpa}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            alignItems: 'center',
            maxWidth: '650px',
            margin: '0 auto',
          }}
          className="hero-buttons-wrap"
        >
          <a
            href="#projects"
            className="agri-btn agri-btn-lime"
            style={{
              padding: '0.95rem 1.8rem',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <span>Explore Research & Projects</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="#contact"
            className="agri-btn"
            style={{
              background: 'rgba(16, 185, 129, 0.25)',
              color: '#ffffff',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '0.95rem 1.5rem',
              fontSize: '0.98rem',
              borderRadius: '12px',
            }}
          >
            <span>Connect with {name.split(' ')[0]}</span>
          </a>
        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 4.5rem)',
            background: 'rgba(8, 32, 21, 0.85)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: '24px',
            padding: 'clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2.5rem)',
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
          className="hero-stats-bar"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="hero-stat-cell"
              style={{
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                  fontWeight: 900,
                  color: '#a3e635',
                  fontFamily: 'var(--font-primary)',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94d3a2', marginTop: '0.15rem' }}>
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        data={data}
      />
    </section>
  );
}
