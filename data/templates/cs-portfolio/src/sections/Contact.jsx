import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Contact({ data = {}, contact = {}, socialLinks = {}, social = {}, collaborate = {}, basics = {}, email: propEmail, location: propLocation }) {
  // Extract handles from arrays or objects
  let github = socialLinks?.github || social?.github || contact?.github || basics?.github || null;
  let linkedin = socialLinks?.linkedin || social?.linkedin || contact?.linkedin || basics?.linkedin || null;

  const profiles = Array.isArray(socialLinks) ? socialLinks : (Array.isArray(social) ? social : (Array.isArray(basics?.profiles) ? basics.profiles : (Array.isArray(data.profile?.socialLinks) ? data.profile.socialLinks : [])));
  if (profiles.length > 0) {
    const gh = profiles.find(s => (s.network || s.name || s.platform || '').toLowerCase().includes('github'));
    const li = profiles.find(s => (s.network || s.name || s.platform || '').toLowerCase().includes('linkedin'));
    if (gh && !github) github = gh.url || gh.link;
    if (li && !linkedin) linkedin = li.url || li.link;
  }

  github = github || "https://github.com/alexchen";
  linkedin = linkedin || "https://linkedin.com/in/alexchen";

  const email = propEmail || data.profile?.email || data.email || contact?.email || socialLinks?.email || social?.email || basics?.email || "alex.chen@stanford.edu";
  const location = propLocation || data.profile?.location || data.location || contact?.location || contact?.address || (basics?.location?.city ? `${basics.location.city}${basics.location.region ? `, ${basics.location.region}` : ''}` : "Stanford, California, USA");
  
  const collaborateTitle = collaborate.heading || collaborate.title || collaborate.text || contact.collaborateHeading || contact.collaborateTitle || "Interested in Collaborating or Hiring?";
  const collaborateDesc = collaborate.text || collaborate.desc || collaborate.description || collaborate.subheading || collaborate.collaborateText || collaborate.collaborateDesc || contact.collaborateSubheading || contact.collaborateDesc || contact.collaborateDescription || contact.collaborateText || "I am actively seeking Software Engineering Internship and Full-Time Roles starting Summer 2027 in Systems, Infrastructure, or AI Engineering.";

  const contactTitle = contact.title || contact.heading || contact.contactHeading || "Let's Connect";
  const contactSub = contact.subtitle || contact.subheading || contact.desc || contact.description || contact.contactSubheading || contact.contactDesc || contact.contactDescription || "Feel free to reach out for inquiries, technical discussions, or engineering opportunities.";

  return (
    <>
      {/* Collaborate Banner */}
      <section data-cv-section="collaborate" className="section">
        <div className="container">
          <Card variant="banner">
            <h2 data-cv="collaborate.heading" data-edit-key="collaborate.heading" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              {collaborateTitle}
            </h2>
            <p data-cv="collaborate.text" data-edit-key="collaborate.text" style={{ color: '#94a3b8', maxWidth: '36rem', margin: '0 auto 2rem auto' }}>
              {collaborateDesc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button href={email ? `mailto:${email}` : '#contact'} variant="primary">Get in Touch</Button>
              {github && (
                <Button href={github} target="_blank" rel="noreferrer" variant="outline" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  GitHub Profile
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" data-cv-section="contact" className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag" data-cv="contact.eyebrow">GET IN TOUCH</span>
            <h2 className="section-heading" data-cv="contact.title" data-edit-key="contact.title">{contactTitle}</h2>
            <p className="section-subheading" data-cv="contact.description" data-edit-key="contact.subtitle">
              {contactSub}
            </p>
          </div>

          <div className="contact-grid">
            <Card variant="contact">
              <div className="contact-icon">&#9993;</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email</div>
                <div data-edit-key="socialLinks.email" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
                </div>
              </div>
            </Card>

            <Card variant="contact">
              <div className="contact-icon">&#128205;</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{location}</div>
              </div>
            </Card>

            <Card variant="contact">
              <div className="contact-icon">&#128187;</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Social Handles</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  <a href={github} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a> &bull; <a href={linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
