'use client';

import React from 'react';
import TextFx from './TextFx';

interface ContactProps {
  data?: any;
}

export default function Contact({ data = {} }: ContactProps) {
  const contact = (typeof data?.contact === 'object' && data.contact !== null) ? data.contact : {};
  const personal = (typeof data?.personal === 'object' && data.personal !== null) ? data.personal : {};

  const eyebrow = contact?.eyebrow || 'PERSONAL INFO & INQUIRIES';
  const title = contact?.title || 'Contact Me';
  const description = contact?.description || 'I am currently open to new design projects, full-time engineering opportunities, and creative collaborations. Feel free to connect via any of the channels below.';
  const availabilityStatus = contact?.availabilityStatus || personal?.availability || data?.availability || 'Available for New Projects & Opportunities';

  const email = (typeof data?.profile?.email === 'string' ? data.profile.email : (typeof contact?.email === 'string' ? contact.email : (typeof personal?.email === 'string' ? personal.email : (typeof data?.email === 'string' ? data.email : 'contact@yoursite.com'))));
  const phone = (typeof data?.profile?.phone === 'string' ? data.profile.phone : (typeof contact?.phone === 'string' ? contact.phone : (typeof personal?.phone === 'string' ? personal.phone : (typeof data?.phone === 'string' ? data.phone : '+1 (555) 389-2910'))));
  const location = (typeof data?.profile?.location === 'string' ? data.profile.location : (typeof contact?.location === 'string' ? contact.location : (typeof personal?.location === 'string' ? personal.location : (typeof data?.location === 'string' ? data.location : 'San Francisco, CA & Remote'))));
  const hours = contact?.hours || 'Mon – Fri: 9 AM – 6 PM EST';

  const contactMethods = [
    {
      title: 'Email Address',
      value: email,
      link: `mailto:${email}`,
      actionText: 'Send an Email',
      cvField: 'contact.email',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      title: 'Phone Number',
      value: phone,
      link: `tel:${phone.replace(/[^0-9+]/g, '')}`,
      actionText: 'Call Directly',
      cvField: 'contact.phone',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: 'Location',
      value: location,
      link: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      actionText: 'Open in Maps',
      cvField: 'contact.location',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      title: 'Working Hours',
      value: hours,
      link: '',
      actionText: 'Response within 24 hours',
      cvField: 'contact.hours',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="contact"
      data-cv-section="contact"
      data-node-id="section:contact:root:section:0"
      className="my-5 py-5 bg-text"
      data-text="08"
    >
      <div className="container p-0">
        {/* Centered Header Row */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 reveal-on-scroll">
            <span
              className="text-muted text-uppercase fw-bold d-block mb-1"
              data-cv="contact.eyebrow"
              data-edit-key="contact.eyebrow"
              data-node-id="text:contact:eyebrow:0"
              data-node-type="text"
              style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
            >
              {eyebrow}
            </span>
            <h2
              className="display-1 my-2"
              data-cv="contact.title"
              data-edit-key="contact.title"
              data-node-id="text:contact:title:0"
              data-node-type="text"
            >
              <TextFx text={title} />
            </h2>
            <p
              className="text-muted"
              data-cv="contact.description"
              data-edit-key="contact.description"
              data-node-id="text:contact:description:0"
              data-node-type="text"
              style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
            >
              {description}
            </p>

            {/* Status Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-light border mt-2">
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  display: 'inline-block',
                }}
              />
              <span
                className="fw-bold text-dark"
                data-cv="contact.status"
                data-edit-key="contact.status"
                data-node-id="text:contact:status:0"
                data-node-type="text"
                style={{ fontSize: '0.85rem' }}
              >
                {availabilityStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="row g-4 justify-content-center">
          {contactMethods.map((method, idx) => (
            <div
              key={method.title}
              className={`col-lg-6 reveal-on-scroll reveal-delay-${(idx % 2) + 1}`}
              data-node-id={`container:contact:card:${idx}`}
              data-node-type="container"
            >
              <div className="p-4 p-xl-5 bg-white border h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="text-dark mb-3">
                    {method.icon}
                  </div>
                  <span
                    className="text-muted text-uppercase d-block mb-1"
                    style={{ fontSize: '0.78rem', letterSpacing: '0.08em', fontWeight: 600 }}
                  >
                    {method.title}
                  </span>
                  <h3
                    className="fs-4 fw-bold mb-2 text-dark"
                    data-cv={method.cvField}
                    data-edit-key={method.cvField}
                    data-node-id={`text:contact:card:${idx}:val:0`}
                    data-node-type="text"
                  >
                    {method.value}
                  </h3>
                </div>

                <div className="pt-3 mt-3 border-top">
                  {method.link ? (
                    <a
                      href={method.link}
                      target={method.link.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-dark fw-bold text-decoration-none d-inline-flex align-items-center gap-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <span>{method.actionText}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {method.actionText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
