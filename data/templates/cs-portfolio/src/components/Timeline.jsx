import React from 'react';

export default function Timeline({ role, company, duration, bullets = [], gpa, status, school, index = 0, isEducation = false }) {
  // Clean role string if previously concatenated by inline editing
  const cleanRole = typeof role === 'string' ? role.split('@')[0].trim() : role;
  const prefix = isEducation ? `education[${index}]` : `experience[${index}]`;

  return (
    <div className="timeline-item">
      <div className="timeline-header">
        <h3 className="timeline-role-heading" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
          <span className="timeline-role-title" data-edit-key={isEducation ? `${prefix}.degree` : `${prefix}.role`}>{cleanRole}</span>
          {company && <span className="timeline-company" data-edit-key={`${prefix}.company`}> @ {company}</span>}
          {school && !company && <span className="timeline-company" data-edit-key={`${prefix}.school`}> @ {school}</span>}
        </h3>
        {duration && <span className="timeline-date" data-edit-key={`${prefix}.duration`}>{duration}</span>}
      </div>

      {gpa && (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Cumulative GPA: <strong data-edit-key={`${prefix}.gpa`}>{gpa}</strong> {status && <>&bull; Status: <em data-edit-key={`${prefix}.status`}>{status}</em></>}
        </p>
      )}

      {bullets && bullets.length > 0 && (
        <ul className="timeline-bullets">
          {bullets.map((b, idx) => (
            <li key={idx} data-edit-key={`${prefix}.desc`}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
