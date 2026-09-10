import React from 'react';

export default function Card({ children, className = '', style = {}, variant = 'default' }) {
  const variantClass = variant === 'stat' ? 'stat-card' : variant === 'specialty' ? 'specialty-card' : variant === 'contact' ? 'contact-card' : variant === 'banner' ? 'banner-card' : 'specialty-card';
  
  return (
    <div className={`${variantClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
