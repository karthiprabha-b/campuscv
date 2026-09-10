"use client";

import React, { useEffect } from "react";
import { X, Award, ExternalLink } from "lucide-react";

interface CertModalProps {
  cert: any;
  onClose: () => void;
}

export default function CertModal({ cert, onClose }: CertModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (cert) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${cert.badgeBg || "bg-amber-50"} ${cert.badgeColor || "text-amber-600"}`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {cert.title}
              </h2>
              <p className="text-xs font-semibold text-brand-600 mt-0.5">
                {cert.issuer}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-5 text-xs space-y-2">
            {cert.issueDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Issued Date:</span>
                <span className="font-semibold text-gray-800">{cert.issueDate}</span>
              </div>
            )}
            {cert.expiryDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Expiration:</span>
                <span className="font-semibold text-gray-800">{cert.expiryDate}</span>
              </div>
            )}
            {cert.credentialId && (
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-500">Credential ID:</span>
                <span className="font-mono font-semibold text-brand-700">{cert.credentialId}</span>
              </div>
            )}
          </div>

          {cert.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {cert.description}
            </p>
          )}

          {cert.verifyUrl ? (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Verify on Official Portal</span>
            </a>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-sm flex items-center justify-center transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
