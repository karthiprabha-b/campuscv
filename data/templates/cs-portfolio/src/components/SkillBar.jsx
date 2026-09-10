import React from 'react';

export default function SkillBar({ skill, variant = 'pill' }) {
  const name = typeof skill === 'string' ? skill : skill.name || skill.title || String(skill);

  if (variant === 'tag') {
    return <span className="project-tag">{name}</span>;
  }

  return <span className="tech-pill">{name}</span>;
}
