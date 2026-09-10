import React, { useState } from 'react';
import './styles/globals.css';

import Hero from './sections/Hero';
import About from './sections/About';
import Education from './sections/Education';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Button from './components/Button';

export default function Template(props) {
  // Support all CampusCV prop structures (props.data, props.portfolio, props.profile, props.basics, or root props)
  const rawData = props?.data || props?.portfolio || props?.profile || props?.cv || props?.resume || (props?.name || props?.hero || props?.about || props?.projects ? props : {}) || {};
  const data = typeof rawData === 'object' && rawData !== null ? rawData : {};

  // Extract name & initials
  const name = data.name || data.fullName || data.basics?.name || "";
  const nameInitials = name
    ? name
        .trim()
        .split(/\s+/)
        .map(part => part[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : "CV";

  // Resolve Avatar Image URL across CampusCV fields & live editor overrides
  const rawOverride =
    data.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:about:root:img:0'] === 'string' ? data.contentOverrides?.['image:about:root:img:0'] : null) ||
    data.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data.imageOverrides?.['image:about:root:img:0'] ||
    data.imageOverrides?.['image:hero:root:img:0'] ||
    data.imageOverrides?.['about.avatarUrl'];
  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value) : rawOverride;
  const avatarUrl =
    explicitAvatar ||
    data.profileImage ||
    data.avatarUrl ||
    data.avatar ||
    data.photo ||
    data.image ||
    (typeof data.about === 'object' && data.about !== null && (
      data.about.avatarUrl || data.about.avatar || data.about.image || data.about.photo || data.about.picture || data.about.profileImage
    )) || data.basics?.image || data.basics?.avatar || "";

  // Resolve Bio
  const bio = (typeof data.about === 'string' ? data.about : (
    data.about?.bio || data.about?.description || data.about?.text || data.about?.summary
  )) || data.aboutMe || data.bio || data.summary || data.description || data.basics?.summary || "";

  const about = {
    bio,
    avatarUrl,
    title: (typeof data.about === 'object' && data.about !== null ? (data.about.title || data.about.heading) : null) || data.aboutHeading || data.aboutTitle || (name ? `About ${name}` : "About Me"),
    stats: (typeof data.about === 'object' && data.about !== null && Array.isArray(data.about.stats)) ? data.about.stats : (Array.isArray(data.stats) ? data.stats : null)
  };

  const hero = {
    title: data.hero?.title || (name ? `Software Developer & Engineer` : "Engineering Scalable Systems"),
    subtitle: data.hero?.subtitle || data.tagline || data.title || data.role || data.headline || data.basics?.label || "Full-Stack & AI Systems Developer",
    introductionText: data.hero?.introductionText || data.hero?.description || data.introductionText || data.aboutMe || data.bio || data.summary || "",
    name,
    avatarUrl
  };

  const skills = Array.isArray(data.skills) ? data.skills : (Array.isArray(data.skillsList) ? data.skillsList : (Array.isArray(data.techStack) ? data.techStack : (Array.isArray(data.technologies) ? data.technologies : [])));
  const projects = Array.isArray(data.projects) ? data.projects : (Array.isArray(data.portfolioProjects) ? data.portfolioProjects : (Array.isArray(data.works) ? data.works : []));
  const experience = (Array.isArray(data.experience) && data.experience.length > 0) ? data.experience : (Array.isArray(data.workExperience) && data.workExperience.length > 0 ? data.workExperience : (Array.isArray(data.work) && data.work.length > 0 ? data.work : (Array.isArray(data.timeline) ? data.timeline : [])));
  const education = (Array.isArray(data.education) && data.education.length > 0) ? data.education : (Array.isArray(data.academics) && data.academics.length > 0 ? data.academics : (Array.isArray(data.educationList) && data.educationList.length > 0 ? data.educationList : []));
  const certifications = (Array.isArray(data.certifications) && data.certifications.length > 0) ? data.certifications : (Array.isArray(data.certificates) && data.certificates.length > 0 ? data.certificates : (Array.isArray(data.awards) && data.awards.length > 0 ? data.awards : []));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accentColor = data?.theme?.primaryColor || data?.themeColor || data?.accentColor || data?.primaryColor || '';

  const dynamicStyles = {
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    ...(accentColor ? {
      '--primary': accentColor,
      '--primary-hover': accentColor,
      '--campuscv-accent': accentColor,
      '--cv-accent': accentColor
    } : {})
  };

  const isSectionVisible = (sectionName) => {
    const directVal = data[`${sectionName}.visible`];
    if (directVal !== undefined) return Boolean(directVal);
    if (data[sectionName] && typeof data[sectionName] === 'object' && data[sectionName].visible !== undefined) {
      return Boolean(data[sectionName].visible);
    }
    if (data[`${sectionName}Visible`] !== undefined) {
      return Boolean(data[`${sectionName}Visible`]);
    }
    return true;
  };

  const hasAbout = isSectionVisible('about') && Boolean(bio || about.title);
  const hasEducation = isSectionVisible('education') && education.length > 0;
  const hasExperience = isSectionVisible('experience') && experience.length > 0;
  const hasProjects = isSectionVisible('projects') && projects.length > 0;
  const hasSkills = isSectionVisible('skills') && skills.length > 0;
  const hasCertifications = isSectionVisible('certifications') && certifications.length > 0;
  const hasContact = isSectionVisible('contact');

  // Dynamic Navigation Links matching exact required sequence
  const navLinks = [
    { label: "About", href: "#about", show: hasAbout },
    { label: "Education", href: "#education", show: hasEducation },
    { label: "Experience", href: "#experience", show: hasExperience },
    { label: "Projects", href: "#projects", show: hasProjects },
    { label: "Tech Stack", href: "#skills", show: hasSkills },
    { label: "Certifications", href: "#certifications", show: hasCertifications },
    { label: "Contact", href: "#contact", show: hasContact }
  ].filter(link => link.show);

  return (
    <div className="portfolio-root light" data-theme="light" style={dynamicStyles}>
      {/* Background Accent Grid */}
      <div className="bg-grid"></div>

      {/* Navigation Bar */}
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="#" className="logo">
            <div className="logo-badge">{nameInitials}</div>
            <span className="logo-text">{name || "Portfolio"}</span>
          </a>

          {navLinks.length > 0 && (
            <nav className="nav-links">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div className="nav-actions">
            {hasContact && (
              <Button href="#contact" variant="primary" className="nav-btn-desktop" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }}>
                Get in Touch
              </Button>
            )}

            {navLinks.length > 0 && (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}>
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && navLinks.length > 0 && (
        <div className="mobile-drawer open">
          <div className="mobile-drawer-links">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
          {hasContact && (
            <div className="mobile-drawer-actions">
              <Button href="#contact" onClick={() => setMobileMenuOpen(false)} variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get in Touch
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 1. Hero Section */}
      {isSectionVisible('hero') && (
        <Hero 
          data={data}
          hero={hero} 
          name={name}
          education={education}
          skills={skills}
        />
      )}

      {/* 2. About Section */}
      {hasAbout && <About data={data} about={about} avatarUrl={avatarUrl} name={name} />}

      {/* 3. Education Section */}
      {hasEducation && <Education data={data} education={education} />}

      {/* 4. Experience Section */}
      {hasExperience && <Experience data={data} experience={experience} />}

      {/* 5. Projects Section */}
      {hasProjects && <Projects data={data} projects={projects} />}

      {/* 6. Skills Section */}
      {hasSkills && <Skills data={data} skills={skills} />}

      {/* 7. Certifications Section */}
      {hasCertifications && <Certifications data={data} certifications={certifications} />}

      {/* 8. Contact Section */}
      {hasContact && (
        <Contact 
          data={data}
          name={name}
          email={data.profile?.email || data.email || data.ownerEmail || data.basics?.email || (typeof data.contact === 'object' ? data.contact?.email : null) || ''}
          location={data.profile?.location || data.location || data.basics?.location?.city || (typeof data.contact === 'object' ? data.contact?.location : null) || ''}
          socials={data.profile?.socialLinks || data.socials || data.socialLinks || data.social || data.basics?.profiles || []}
          socialLinks={data.profile?.socialLinks || data.socials || data.socialLinks || data.social || data.basics?.profiles || []}
        />
      )}
    </div>
  );
}
