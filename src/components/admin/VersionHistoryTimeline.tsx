import React from 'react';
import { GitBranch, Clock, CheckCircle2 } from 'lucide-react';
import { TemplateVersionRecord } from '../../types/adminTemplate';

interface VersionHistoryTimelineProps {
  versions: TemplateVersionRecord[];
}

export default function VersionHistoryTimeline({ versions }: VersionHistoryTimelineProps) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-4 text-left shadow-xs">
      <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-[#7C3AED]" />
          <h3 className="text-sm font-extrabold text-zinc-900">Version History &amp; Changelogs</h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">Semver 2.0 Pipeline</span>
      </div>

      <div className="relative pl-6 border-l-2 border-purple-200 space-y-6 pt-2">
        {versions.map((ver, idx) => (
          <div key={ver.id || idx} className="relative space-y-1">
            {/* Timeline Node dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#7C3AED] border-4 border-white shadow-xs" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-zinc-900">v{ver.version}</span>
                {idx === 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    Latest Active Release
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {ver.createdAt}
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed font-sans">{ver.changelog}</p>

            <div className="text-[10px] font-mono text-zinc-400 pt-1">
              Package: <code className="text-purple-700 font-bold">{ver.zipFileName}</code> ({ver.zipSizeFormatted})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
