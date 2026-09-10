import React from 'react';
import Button from '../components/Button';

export default function Hero({ 
  hero = {}, 
  name = "", 
  education = [], 
  skills = [], 
  data = {} 
}) {
  const displayName = name || data.name || data.fullName || data.basics?.name || "Alex Chen";
  const roleHeadline = data.role || data.headline || hero.subtitle || data.tagline || data.basics?.label || "Software Developer & Engineer";
  const introductionText = hero.introductionText || hero.description || data.bio || data.aboutMe || data.summary || data.description || "Building scalable architectures, intelligent systems, and modern web applications.";

  // Dynamic Terminal Values
  const terminalName = displayName;
  const terminalRole = roleHeadline;
  const terminalLocation = data.location || data.personal?.city || data.basics?.location?.city || "Remote / Global";
  const firstEdu = Array.isArray(education) && education.length > 0 ? education[0] : null;
  const terminalEducation = firstEdu
    ? `${firstEdu.degree ? firstEdu.degree + (firstEdu.school || firstEdu.institution ? ' – ' : '') : ''}${firstEdu.school || firstEdu.institution || ''}`
    : "B.Tech Computer Science / AI";

  const terminalSkills = (Array.isArray(skills) && skills.length > 0
    ? skills.slice(0, 6).map(s => typeof s === 'string' ? s : (s.name || s.title || String(s)))
    : ["Python", "JavaScript", "TypeScript", "React", "Next.js", "SQL"]);

  return (
    <section id="hero" data-cv-section="hero" className="section">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="section-tag" data-cv="hero.role" data-edit-key="hero.subtitle">
              <span className="pulse-dot"></span>
              <span>{roleHeadline}</span>
            </div>
            
            <h1 className="hero-title" data-cv="hero.name" data-edit-key="hero.name">
              <span className="hero-title-accent">{displayName}</span>
            </h1>

            <p className="hero-desc" data-cv="hero.description" data-edit-key="hero.introductionText">
              {introductionText}
            </p>

            <div className="hero-actions">
              <Button href="#projects" variant="primary">
                Explore Projects &rarr;
              </Button>
              <Button href="#contact" variant="outline">
                Contact Me
              </Button>
            </div>
          </div>

          {/* Terminal Widget */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">developer_profile.json</span>
            </div>
            <div className="terminal-body">
              <p><span className="t-kw">const</span> <span className="t-var">developer</span> = &#123;</p>
              <p style={{ paddingLeft: '1.25rem' }}><span className="t-var">name</span>: <span className="t-str">&quot;{terminalName}&quot;</span>,</p>
              <p style={{ paddingLeft: '1.25rem' }}><span className="t-var">role</span>: <span className="t-str">&quot;{terminalRole}&quot;</span>,</p>
              <p style={{ paddingLeft: '1.25rem' }}><span className="t-var">location</span>: <span className="t-str">&quot;{terminalLocation}&quot;</span>,</p>
              <p style={{ paddingLeft: '1.25rem' }}><span className="t-var">education</span>: <span className="t-str">&quot;{terminalEducation}&quot;</span>,</p>
              <p style={{ paddingLeft: '1.25rem' }}>
                <span className="t-var">skills</span>: [{terminalSkills.map((l, idx) => (
                  <React.Fragment key={idx}>
                    <span className="t-str">&quot;{l}&quot;</span>{idx < terminalSkills.length - 1 ? ', ' : ''}
                  </React.Fragment>
                ))}],
              </p>
              <p style={{ paddingLeft: '1.25rem' }}><span className="t-var">status</span>: <span className="t-str">&quot;Available for opportunities&quot;</span></p>
              <p>&#125;;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
