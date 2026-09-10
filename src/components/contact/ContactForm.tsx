"use client";

import React, { useState } from 'react';

interface ContactFormProps {
  portfolioOwnerEmail: string;
  portfolioOwnerName?: string;
  portfolioUsername?: string;
  primaryColor?: string;
  /** Optional extra CSS class for the wrapper */
  className?: string;
  /** compact = small inline form, full = full section with heading */
  variant?: 'compact' | 'full';
}

export default function ContactForm({
  portfolioOwnerEmail,
  portfolioOwnerName = '',
  portfolioUsername = '',
  primaryColor = '#6366f1',
  className = '',
  variant = 'full',
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          portfolioOwnerEmail,
          portfolioOwnerName,
          portfolioUsername,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('success');
        setName(''); setEmail(''); setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to send message. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1px solid #e2e8f0', borderRadius: 10,
    fontSize: '0.9rem', color: '#0f172a', background: '#fff',
    outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: '#374151', marginBottom: '0.4rem',
  };

  if (status === 'success') {
    return (
      <div className={className} style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: 16, padding: '2rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', marginBottom: 6 }}>Message Sent!</h3>
        <p style={{ fontSize: '0.875rem', color: '#15803d' }}>
          Thanks for reaching out. {portfolioOwnerName ? `${portfolioOwnerName} will` : 'They\'ll'} get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{ marginTop: 16, fontSize: '0.8rem', color: '#166534', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {variant === 'full' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Get in Touch
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Fill out the form and {portfolioOwnerName || 'the owner'} will reply within 24 hours.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Jane Smith" required style={inputStyle}
              onFocus={e => (e.target.style.borderColor = primaryColor)}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
          <div>
            <label style={labelStyle}>Your Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jane@email.com" required style={inputStyle}
              onFocus={e => (e.target.style.borderColor = primaryColor)}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Message</label>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Hi! I'd love to discuss a project with you..."
            required rows={5}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
            onFocus={e => (e.target.style.borderColor = primaryColor)}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        {errorMsg && (
          <div style={{ fontSize: '0.8rem', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.6rem 0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          style={{
            background: primaryColor, color: '#fff',
            border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem',
            fontSize: '0.9rem', fontWeight: 700, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            opacity: status === 'sending' ? 0.7 : 1,
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8,
            alignSelf: 'flex-start',
          }}
        >
          {status === 'sending' ? (
            <>
              <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Sending…
            </>
          ) : 'Send Message ↗'}
        </button>
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
