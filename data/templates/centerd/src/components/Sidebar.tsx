'use client';

import React from 'react';

interface SidebarProps {
  data?: any;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onCloseMobileMenu?: () => void;
  visibleSections?: string[];
  isSectionVisible?: (sectionId: string) => boolean;
}

export default function Sidebar({
  data = {},
  activeSection = 'home',
  onNavigate = () => {},
  onCloseMobileMenu = () => {},
  visibleSections,
  isSectionVisible
}: SidebarProps) {
  const personal = data?.personal || {};
  const brandName = personal?.brandName || data?.name || personal?.firstName || 'Julia';
  const displayBrand = brandName.endsWith('.') ? brandName : `${brandName}.`;
  const email = data?.email || personal?.email || data?.contact?.email || 'contact@yoursite.com';

  const defaultNavItems = [
    { id: 'home', label: 'Hero', sectionKey: 'hero' },
    { id: 'about', label: 'About', sectionKey: 'about' },
    { id: 'education', label: 'Education', sectionKey: 'education' },
    { id: 'experience', label: 'Experience', sectionKey: 'experience' },
    { id: 'projects', label: 'Projects', sectionKey: 'projects' },
    { id: 'skills', label: 'Skills', sectionKey: 'skills' },
    { id: 'certificates', label: 'Certificates', sectionKey: 'certificates' },
    { id: 'contact', label: 'Contact', sectionKey: 'contact' },
  ];

  const orderList = Array.isArray(data?.sectionOrder) && data.sectionOrder.length > 0 
    ? data.sectionOrder 
    : (Array.isArray(data?.sections) && data.sections.length > 0 ? data.sections : null);

  let sortedNavItems = [...defaultNavItems];
  if (orderList) {
    const norm = (s: any) => {
      const val = typeof s === 'object' && s !== null ? (s.id || s.name || '') : s;
      return String(val || '').toLowerCase().trim().replace(/^home$|^intro$/, 'hero').replace(/^certificates$|^awards$/, 'certifications').replace(/^timeline$|^work$/, 'experience').replace(/^academics$/, 'education').replace(/^portfolio$/, 'projects').replace(/^tech$/, 'skills');
    };
    const orderMap = new Map(orderList.map((id: any, idx: number) => [norm(id), idx]));
    
    sortedNavItems.sort((a, b) => {
      const aNorm = norm(a.sectionKey);
      const bNorm = norm(b.sectionKey);
      const aIdx = orderMap.has(aNorm) ? orderMap.get(aNorm)! : 999;
      const bIdx = orderMap.has(bNorm) ? orderMap.get(bNorm)! : 999;
      return aIdx - bIdx;
    });
  }

  const navItems = sortedNavItems.filter(item => {
    if (typeof isSectionVisible === 'function') {
      return isSectionVisible(item.sectionKey) || isSectionVisible(item.id);
    }
    if (visibleSections) {
      return visibleSections.includes(item.sectionKey) || visibleSections.includes(item.id);
    }
    return true;
  });

  const handleNav = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(id);
    onCloseMobileMenu();
    const cleanId = id === 'home' ? 'hero' : id;
    const el = document.getElementById(id) || document.getElementById(cleanId) || document.querySelector(`[data-cv-section="${cleanId}"]`) || document.querySelector(`[data-cv-section="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside id="header-nav" data-cv-ignore="true" className="col-lg-2 bg-white">
      <div className="header-wrap d-flex flex-column justify-content-between h-100">
        <div className="navigation">
          {/* Logo / Brand Name */}
          <div className="site-logo mb-2 mb-xl-3">
            <a
              href="#home"
              onClick={(e) => handleNav('home', e)}
              className="text-dark text-decoration-none d-inline-block"
            >
              <h1
                className="fw-bold m-0"
                style={{
                  fontFamily: 'var(--heading-font)',
                  fontSize: 'clamp(1.6rem, 2vw, 2.1rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.1,
                  color: 'var(--bs-dark)',
                }}
              >
                {displayBrand}
              </h1>
            </a>
          </div>

          {/* Nav list */}
          <nav id="one-page-menu" className="vertical-menu my-1">
            <ul className="menu-list list-unstyled m-0 p-0">
              {navItems.map((item) => {
                const isActive = activeSection === item.id || (item.id === 'projects' && activeSection === 'portfolio');
                return (
                  <li key={item.id} className="menu-item">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNav(item.id, e)}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Contacts & Socials */}
        <div className="sidebar-footer pt-2">
          <div className="email-links mb-1">
            <a
              href={`mailto:${email}`}
              className="py-1 border-bottom d-block text-dark text-decoration-none text-truncate"
              style={{ fontSize: '0.8rem', color: '#333333', fontWeight: 500 }}
            >
              {email}
            </a>
          </div>

          <ul className="list-unstyled d-flex justify-content-start flex-wrap gap-2 gap-xl-3 mb-1 py-1">
            {/* LinkedIn */}
            <li>
              <a
                href={
                  data?.linkedin ||
                  personal?.linkedin ||
                  data?.contact?.linkedin ||
                  (Array.isArray(data?.socialLinks) ? data.socialLinks.find((s: any) => (s?.platform || s?.name || '').toLowerCase().includes('linkedin'))?.url : '') ||
                  'https://linkedin.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-social-link text-dark"
                aria-label="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.49 1.49 0 0 0 1.49-1.49 1.49 1.49 0 0 0-1.49-1.49 1.49 1.49 0 0 0-1.49 1.49c0 .82.67 1.49 1.49 1.49m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                </svg>
              </a>
            </li>

            {/* X (Twitter) */}
            <li>
              <a
                href={
                  data?.twitter ||
                  data?.x ||
                  personal?.twitter ||
                  personal?.x ||
                  data?.contact?.twitter ||
                  (Array.isArray(data?.socialLinks) ? data.socialLinks.find((s: any) => (s?.platform || s?.name || '').toLowerCase().includes('twitter') || (s?.platform || s?.name || '').toLowerCase() === 'x')?.url : '') ||
                  'https://x.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-social-link text-dark"
                aria-label="X (Twitter)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </li>

            {/* GitHub */}
            <li>
              <a
                href={
                  data?.github ||
                  personal?.github ||
                  data?.contact?.github ||
                  (Array.isArray(data?.socialLinks) ? data.socialLinks.find((s: any) => (s?.platform || s?.name || '').toLowerCase().includes('github'))?.url : '') ||
                  'https://github.com'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-social-link text-dark"
                aria-label="GitHub"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
