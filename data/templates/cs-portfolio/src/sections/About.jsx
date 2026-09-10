import React from 'react';
import Card from '../components/Card';

export default function About(props = {}) {
  const data = props?.data || props || {};
  const about = (typeof data.about === 'object' && data.about !== null) ? data.about : {};
  const personal = (typeof data.personal === 'object' && data.personal !== null) ? data.personal : {};
  const profile = (typeof data.profile === 'object' && data.profile !== null) ? data.profile : {};

  const name = data.name || data.fullName || personal.name || profile.name || props.name || "";

  const rawOverride =
    data.contentOverrides?.['image:about:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:about:root:img:0'] === 'string' ? data.contentOverrides?.['image:about:root:img:0'] : null) ||
    data.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data.contentOverrides?.['about.avatarUrl']?.src ||
    (typeof data.contentOverrides?.['about.avatarUrl'] === 'string' ? data.contentOverrides?.['about.avatarUrl'] : null) ||
    data.contentOverrides?.['about.image']?.src ||
    (typeof data.contentOverrides?.['about.image'] === 'string' ? data.contentOverrides?.['about.image'] : null) ||
    data.contentOverrides?.['profile.image']?.src ||
    (typeof data.contentOverrides?.['profile.image'] === 'string' ? data.contentOverrides?.['profile.image'] : null) ||
    data.contentOverrides?.['profileImage']?.src ||
    (typeof data.contentOverrides?.['profileImage'] === 'string' ? data.contentOverrides?.['profileImage'] : null) ||
    data.imageOverrides?.['image:about:root:img:0'] ||
    data.imageOverrides?.['image:hero:root:img:0'] ||
    data.imageOverrides?.['about.avatarUrl'] ||
    data.imageOverrides?.['about.image'] ||
    data.imageOverrides?.['profile.image'] ||
    data.imageOverrides?.['profileImage'];
  const explicitAvatar = typeof rawOverride === 'object' && rawOverride !== null ? (rawOverride.src || rawOverride.value || rawOverride.url) : rawOverride;

  const avatarUrl =
    explicitAvatar ||
    props.avatarUrl ||
    data.profileImage ||
    data.avatarUrl ||
    data.avatar ||
    data.photo ||
    data.image ||
    props.about?.avatarUrl ||
    props.about?.image ||
    about.avatarUrl ||
    about.image ||
    about.avatar ||
    about.photo ||
    about.picture ||
    about.profileImage ||
    profile.image ||
    profile.avatarUrl ||
    profile.avatar ||
    personal.profileImage ||
    personal.image ||
    personal.avatar ||
    data.basics?.image ||
    data.basics?.picture ||
    data.basics?.avatar ||
    "";

  const bio = (typeof data.about === 'string' ? data.about : null)
    || about.bio
    || about.description
    || about.text
    || data.aboutMe
    || data.bio
    || data.summary
    || data.description
    || personal.summary
    || profile.summary
    || data.basics?.summary
    || "";

  const heading = about.title
    || about.heading
    || data.aboutHeadline
    || data.aboutHeading
    || data.aboutTitle
    || (name ? `About ${name}` : "Professional Background");

  // Dynamic user stats derived from actual user collections (ZERO fake demo data)
  const userProjectsCount = Array.isArray(data.projects) ? data.projects.length : 0;
  const userExperienceCount = Array.isArray(data.experience) ? data.experience.length : 0;
  const userSkillsCount = Array.isArray(data.skills) ? data.skills.length : 0;

  const dynamicStats = [];
  if (userProjectsCount > 0) {
    dynamicStats.push({ value: `${userProjectsCount}`, label: "Projects Built" });
  }
  if (userExperienceCount > 0) {
    dynamicStats.push({ value: `${userExperienceCount}`, label: "Work History" });
  }
  if (userSkillsCount > 0) {
    dynamicStats.push({ value: `${userSkillsCount}+`, label: "Technologies" });
  }

  const stats = Array.isArray(about.stats) && about.stats.length > 0
    ? about.stats
    : (Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : dynamicStats);

  return (
    <section id="about" data-cv-section="about" className="section">
      <div className="container">
        <div className="about-grid">
          {avatarUrl && (
            <div className="avatar-wrapper">
              <img
                src={avatarUrl}
                alt={name || "Profile"}
                className="avatar-img"
                data-cv="about.image"
                data-cv-image="about.avatarUrl"
              />
            </div>
          )}

          <div className="about-content">
            <span className="section-tag" data-cv="about.eyebrow" data-edit-key="aboutTag">ABOUT ME</span>
            <h2 className="section-heading" data-cv="about.title" data-edit-key="aboutTitle">{heading}</h2>

            {bio && (
              <p className="about-bio" data-cv="about.description" data-edit-key="aboutBio">
                {bio}
              </p>
            )}

            {stats.length > 0 && (
              <div className="about-stats-grid" data-cv-collection="about.stats">
                {stats.map((stat, idx) => (
                  <div key={idx} className="stat-card" data-cv-item={`about.stats[${idx}]`}>
                    <div className="stat-value" data-cv={`about.stats[${idx}].value`}>{stat.value}</div>
                    <div className="stat-label" data-cv={`about.stats[${idx}].label`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
