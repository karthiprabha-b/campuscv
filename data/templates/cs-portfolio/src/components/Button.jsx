import React from 'react';

export default function Button({ children, variant = 'primary', onClick, href, className = '', style = {}, title, target, rel, type = 'button' }) {
  const baseClass = variant === 'icon' ? 'btn-icon' : variant === 'outline' ? 'btn btn-outline' : 'btn btn-primary';
  const combinedClass = `${baseClass} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClass} style={style} target={target} rel={rel} title={title}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClass} style={style} title={title}>
      {children}
    </button>
  );
}
