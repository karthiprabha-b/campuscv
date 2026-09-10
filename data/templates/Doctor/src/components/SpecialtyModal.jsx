import React from 'react';
import { X, CheckCircle, Stethoscope, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SpecialtyModal({ specialty, onClose }) {
  if (!specialty) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          {specialty.badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
              {specialty.badge}
            </span>
          )}
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {specialty.title}
          </h3>
          <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            {specialty.shortDescription}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Detailed Clinical Methodology */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              Clinical Methodology & Diagnostic Approach
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {specialty.detailedDescription}
            </p>
          </div>

          {/* Conditions Treated */}
          {specialty.conditionsTreated && specialty.conditionsTreated.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Key Conditions Treated
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialty.conditionsTreated.map((condition, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnostics Used */}
          {specialty.diagnosticsUsed && specialty.diagnosticsUsed.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Advanced Diagnostics Employed
              </h4>
              <div className="flex flex-wrap gap-2">
                {specialty.diagnosticsUsed.map((diag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium"
                  >
                    {diag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
          <a
            href="#contact"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Inquire About Treatment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
