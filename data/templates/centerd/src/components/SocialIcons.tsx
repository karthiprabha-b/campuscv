'use client';

import React from 'react';

interface SocialIconsProps {
  size?: number;
  gap?: string;
  color?: string;
}

export default function SocialIcons({ size = 18, gap = '1.25rem', color }: SocialIconsProps) {
  const socials = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      ),
    },
    {
      name: 'Dribbble',
      href: 'https://dribbble.com',
      svg: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.312c-.44-.092-2.38-.466-4.67-.123-.09-.2-.18-.41-.28-.62-.77-1.63-1.68-3.08-1.74-3.17 2.38-.85 4.31-1.32 4.76-1.399zm-6.28-2.486c.06.09.95 1.51 1.71 3.1.08.17.16.34.23.51-2.92.83-5.74.85-6.52.85-.02-.07-.03-.13-.03-.19.01-1.92.81-3.66 2.09-4.91.75-.41 1.62-.65 2.52-.65.01.09.01.19 0 .29zm-6.09 6.01c.78 0 3.32-.01 6.04-.77.1.2.19.41.27.61-1.99.64-4.8 1.95-6.17 5.09a8.472 8.472 0 0 1-1.57-4.44c0-.17.02-.33.03-.49h1.4zm2.14 6.07c1.19-2.73 3.69-3.92 5.56-4.52.8 2.16 1.13 4.29 1.25 5.23a8.56 8.56 0 0 1-6.81-.71zm8.39.29c-.11-.83-.41-2.75-1.15-4.78 2.08-.34 3.79.03 4.19.12a8.543 8.543 0 0 1-3.04 4.66z"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap' }}>
      {socials.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          style={{
            color: color || 'var(--text-main)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: 0.85,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-yellow)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = color || 'var(--text-main)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '0.85';
          }}
        >
          {item.svg}
        </a>
      ))}
    </div>
  );
}
