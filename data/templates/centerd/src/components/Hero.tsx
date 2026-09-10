'use client';

import React from 'react';
import TextFx from './TextFx';

interface HeroProps {
  data?: any;
  onNavigate?: (sectionId: string) => void;
  onSelectService?: (service: any) => void;
}

export default function Hero({ data = {}, onNavigate = () => {}, onSelectService = () => {} }: HeroProps) {
  const personal = data?.personal || {};
  const hero = data?.hero || {};

  const name =
    data?.name ||
    hero?.name ||
    (personal?.firstName ? `${personal.firstName} ${personal.lastName || ''}`.trim() : '') ||
    personal?.brandName ||
    'Julia Stiles';

  const role =
    hero?.role ||
    hero?.title ||
    personal?.role ||
    data?.role ||
    data?.title ||
    'DESIGNER / DEVELOPER';

  const rawAvatarOverride =
    data?.contentOverrides?.['image:hero:root:img:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:root:img:0'] === 'string' ? data?.contentOverrides?.['image:hero:root:img:0'] : null) ||
    data?.contentOverrides?.['image:hero:avatar:0']?.src ||
    (typeof data?.contentOverrides?.['image:hero:avatar:0'] === 'string' ? data?.contentOverrides?.['image:hero:avatar:0'] : null) ||
    data?.contentOverrides?.['hero.avatarUrl']?.src ||
    (typeof data?.contentOverrides?.['hero.avatarUrl'] === 'string' ? data?.contentOverrides?.['hero.avatarUrl'] : null) ||
    data?.contentOverrides?.['hero.profileImage']?.src ||
    (typeof data?.contentOverrides?.['hero.profileImage'] === 'string' ? data?.contentOverrides?.['hero.profileImage'] : null) ||
    data?.contentOverrides?.['profileImage']?.src ||
    (typeof data?.contentOverrides?.['profileImage'] === 'string' ? data?.contentOverrides?.['profileImage'] : null) ||
    data?.imageOverrides?.['image:hero:root:img:0'] ||
    data?.imageOverrides?.['image:hero:avatar:0'] ||
    data?.imageOverrides?.['hero.avatarUrl'] ||
    data?.imageOverrides?.['hero.profileImage'] ||
    data?.imageOverrides?.['profileImage'];

  const explicitAvatar = typeof rawAvatarOverride === 'object' && rawAvatarOverride !== null
    ? (rawAvatarOverride.src || rawAvatarOverride.value || rawAvatarOverride.url)
    : rawAvatarOverride;

  const avatar =
    explicitAvatar ||
    hero?.avatar ||
    hero?.avatarUrl ||
    hero?.image ||
    hero?.profileImage ||
    personal?.avatar ||
    personal?.profileImage ||
    personal?.image ||
    personal?.photo ||
    data?.profileImage ||
    data?.avatarUrl ||
    data?.avatar ||
    data?.photo ||
    data?.image ||
    data?.profile?.avatar ||
    data?.profile?.photo ||
    data?.basics?.image ||
    data?.basics?.picture ||
    data?.basics?.avatar ||
    '/images/banner-image.png';

  const defaultServices = [
    {
      number: '01',
      title: 'UI/UX Design',
      description: 'At in proin consequat ut cursus venenatis sapien.',
      deliverables: ['Figma Design Systems', 'User Journey Maps', 'Interactive Prototyping', 'Design Audits']
    },
    {
      number: '02',
      title: 'Illustration',
      description: 'At in proin consequat ut cursus venenatis sapien.',
      deliverables: ['Custom Vector Art', 'Icon Systems', 'Editorial Graphics', 'Visual Assets']
    },
    {
      number: '03',
      title: 'Graphic Design',
      description: 'At in proin consequat ut cursus venenatis sapien.',
      deliverables: ['Brand Identity', 'Motion Design', 'Typography Systems', 'Print & Packaging']
    },
  ];

  // If data.services or hero.services is provided and non-empty, use it; otherwise fallback to defaultServices
  const rawServices = (Array.isArray(data?.services) && data.services.length > 0)
    ? data.services
    : ((Array.isArray(hero?.services) && hero.services.length > 0)
      ? hero.services
      : defaultServices);

  const services = (Array.isArray(rawServices) && rawServices.length > 0 ? rawServices : defaultServices).map((svc: any, idx: number) => {
    if (typeof svc === 'string') {
      return {
        number: `0${idx + 1}`,
        title: svc,
        description: 'At in proin consequat ut cursus venenatis sapien.',
        deliverables: []
      };
    }
    return {
      number: svc?.number || `0${idx + 1}`,
      title: svc?.title || svc?.name || 'Service Highlight',
      description: svc?.description || svc?.summary || 'At in proin consequat ut cursus venenatis sapien.',
      deliverables: Array.isArray(svc?.deliverables) ? svc.deliverables : []
    };
  });

  const ctaText = hero?.ctaText || hero?.buttonText || 'VIEW ALL WORK';

  // Check if avatar is the banner-image.png or a custom portrait
  const isCustomHeadshot = !avatar.includes('banner-image');

  return (
    <section
      id="home"
      data-cv-section="hero"
      data-node-id="section:hero:root:section:0"
      className="py-5 bg-text"
      data-text="01"
    >
      <span id="hero" style={{ position: 'relative', top: '-80px', visibility: 'hidden' }} />
      <div className="row align-items-center">
        {/* Banner Image */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="banner-image text-center d-flex justify-content-center align-items-center py-3 my-1">
            <div
              className="hero-diamond-frame"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '375px',
                height: '375px',
                maxWidth: '85%',
                aspectRatio: '1 / 1',
                transform: 'rotate(45deg)',
                borderRadius: '44px',
                background: 'var(--bs-primary, #ff534a)',
                padding: '14px',
                boxShadow: '0 20px 45px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                cursor: 'pointer',
                // Decorative frame — do NOT intercept clicks; let them fall through to <img>
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <img
                  src={avatar}
                  alt={name}
                  data-cv="hero.profileImage"
                  data-cv-image="hero.avatarUrl"
                  data-edit-key="hero.profileImage"
                  data-node-id="image:hero:root:img:0"
                  data-node-type="image"
                  className="img-fluid w-100 h-100 hero-diamond-img"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transform: 'rotate(-45deg) scale(1.42)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banner Content */}
        <div className="col-lg-6">
          <div className="banner-content my-1 pt-1 my-lg-5 pt-lg-5">
            <span
              className="text-muted text-uppercase fw-bold d-block mb-2"
              data-cv="hero.role"
              data-cv-field="hero.role"
              data-edit-key="hero.role"
              data-node-id="text:hero:role:0"
              style={{ letterSpacing: '0.15em', fontSize: '0.85rem' }}
            >
              {role}
            </span>
            <h1
              className="banner-title display-xl lh-1 my-2"
              data-cv="hero.title"
              data-cv-field="hero.name"
              data-edit-key="hero.title"
              data-node-id="text:hero:name:0"
            >
              {name}
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom 3 Services / Icon Boxes + Button */}
      <div className="row pt-5 mt-3 align-items-stretch" data-cv-collection="services">
        {services.slice(0, 3).map((service: any, idx: number) => (
          <div
            key={service.number || idx}
            className={`col-lg-3 col-md-6 mb-4 mb-lg-0 reveal-on-scroll reveal-delay-${idx + 1}`}
            data-cv={`services[${idx}]`}
            data-cv-item={`services[${idx}]`}
            data-node-id={`container:services:card:${idx}`}
          >
            <div
              className="icon-box p-3 h-100 d-flex flex-column justify-content-between"
              onClick={() => onSelectService(service)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <span
                  className="text-muted fw-bold d-block mb-1"
                  data-cv={`services[${idx}].number`}
                  data-edit-key={`services.${idx}.number`}
                  data-node-id={`text:services:number:${idx}`}
                  style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                >
                  {service.number}
                </span>
                <h3
                  className="sub-heading fw-bold fs-4 mb-2 text-dark"
                  data-cv={`services[${idx}].title`}
                  data-edit-key={`services.${idx}.title`}
                  data-node-id={`text:services:title:${idx}`}
                >
                  {service.title}
                </h3>
                <p
                  className="text-muted mb-0"
                  data-cv={`services[${idx}].description`}
                  data-edit-key={`services.${idx}.description`}
                  data-node-id={`text:services:description:${idx}`}
                  style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div
          className="col-lg-3 col-md-6 mb-4 mb-lg-0 d-flex align-items-end reveal-on-scroll reveal-delay-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('projects');
            }}
            className="btn btn-dark text-uppercase py-4 px-4 w-100 text-center text-white text-decoration-none fw-bold d-flex align-items-center justify-content-center"
            data-cv="hero.ctaText"
            data-edit-key="hero.ctaText"
            data-node-id="button:hero:cta:0"
            style={{
              borderRadius: '0',
              letterSpacing: '0.08em',
              fontSize: '0.85rem',
              height: '100%',
              minHeight: '120px'
            }}
          >
            <span data-cv="hero.ctaText" data-edit-key="hero.ctaText">{ctaText}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
