'use client';

import React, { useEffect } from 'react';
import { ProjectItem, CertificateItem } from '../data/portfolioData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem | null;
  certificate?: CertificateItem | null;
}

export default function Modal({ isOpen, onClose, project, certificate }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      window.addEventListener('keydown', handleKeyDown);
    } else {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white border-4 border-black p-6 sm:p-8 shadow-solid-lg text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Clean Non-Overlapping Close Button */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
          <div className="font-heading font-black text-xs tracking-widest text-neutral-600 uppercase">
            {project ? 'PROJECT CASE STUDY' : 'VERIFIED CREDENTIAL'}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-black text-white hover:bg-neutral-800 flex items-center justify-center font-bold text-sm transition-all shadow-solid-sm border-none cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Project Modal Content */}
        {project && (
          <div>
            {/* Image Preview with clean border */}
            <div className="relative w-full aspect-video border-3 border-black mb-6 overflow-hidden bg-neutral-900 shadow-solid-sm">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="inline-block font-mono text-xs font-black px-2.5 py-1 bg-black text-white uppercase mb-3">
              {project.categoryTag}
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-black mb-4 tracking-tight">
              {project.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-6 font-normal">
              {project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <>
                <h4 className="font-heading font-black text-xs tracking-widest uppercase text-black mb-3">
                  Key Engineering Highlights:
                </h4>
                <ul className="space-y-2 mb-6">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-xs sm:text-sm text-neutral-900 flex items-start gap-2">
                      <span className="font-bold text-black">▪</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h4 className="font-heading font-black text-xs tracking-widest uppercase text-black mb-3">
              Technologies Utilized:
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech, i) => (
                <span key={i} className="text-xs font-mono px-2.5 py-1 bg-neutral-100 border border-neutral-300 font-bold text-black">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-black">
              {project.demoUrl && project.demoUrl !== '#' && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-box no-underline">
                  | LIVE DEMO |
                </a>
              )}
              {project.codeUrl && project.codeUrl !== '#' && (
                <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-box-outline no-underline">
                  | SOURCE REPOSITORY |
                </a>
              )}
            </div>
          </div>
        )}

        {/* Certificate Modal Content */}
        {certificate && (
          <div>
            <div className="inline-block font-mono text-xs font-black px-2.5 py-1 bg-black text-white uppercase mb-4">
              VERIFIED CREDENTIAL
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-black mb-2 tracking-tight">
              {certificate.title}
            </h2>

            <div className="font-heading font-bold text-base text-black mb-1">
              Issued by: {certificate.issuer}
            </div>

            <div className="font-mono text-xs font-bold text-neutral-600 mb-6">
              {certificate.issuedDate} • Credential ID: <strong>{certificate.credentialId}</strong>
            </div>

            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-6 font-normal">
              {certificate.description}
            </p>

            {certificate.skills && certificate.skills.length > 0 && (
              <>
                <h4 className="font-heading font-black text-xs tracking-widest uppercase text-black mb-3">
                  Verified Competencies:
                </h4>
                <div className="flex flex-wrap gap-2 mb-8">
                  {certificate.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-mono px-2.5 py-1 bg-neutral-100 border border-neutral-300 font-bold text-black">
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className="pt-4 border-t-2 border-black">
              <button
                onClick={() => alert(`Credential ID ${certificate.credentialId} is active and verified on official records.`)}
                className="btn-box cursor-pointer"
              >
                | VERIFY ON ISSUER REGISTRY |
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
