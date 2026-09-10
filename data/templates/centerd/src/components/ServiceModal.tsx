'use client';

import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ServiceHighlight {
  number: string;
  title: string;
  description: string;
  deliverables?: string[];
}

interface ServiceModalProps {
  service: ServiceHighlight | null;
  onClose: () => void;
  onContact: () => void;
}

export default function ServiceModal({ service, onClose, onContact }: ServiceModalProps) {
  if (!service) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--accent-yellow)',
            marginBottom: '0.5rem',
          }}
        >
          SERVICE {service.number}
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>
          {service.title}
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {service.description} We work collaboratively through iterative sprints, user testing, and rapid prototyping to ensure your product reaches market faster and with higher fidelity.
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-subtle)',
            marginBottom: '1rem',
          }}
        >
          Key Deliverables & Capabilities
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
          className="deliverables-grid"
        >
          {service.deliverables?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <CheckCircle2 size={16} color="var(--accent-yellow)" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              onClose();
              onContact();
            }}
            className="btn-solid-black"
          >
            <span>Inquire About {service.title}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          .deliverables-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
