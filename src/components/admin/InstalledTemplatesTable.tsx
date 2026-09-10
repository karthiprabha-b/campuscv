"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Download, Trash2, Power, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { TemplateRecord } from '../../types/adminTemplate';

interface InstalledTemplatesTableProps {
  templates: TemplateRecord[];
  onPreview: (template: TemplateRecord) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onDownloadZip: (template: TemplateRecord) => void;
}

export default function InstalledTemplatesTable({
  templates,
  onPreview,
  onToggleStatus,
  onDelete,
  onDownloadZip
}: InstalledTemplatesTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white border border-[#E7E9EE] rounded-[16px] overflow-hidden shadow-xs text-left font-sans space-y-4 p-6">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-[#111318] font-bricolage tracking-tight">Installed Templates</h2>
          <p className="text-xs text-[#667085]">Data table of all installed template packages across CampusCV.</p>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500">{templates.length} Packages</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#98A2B3] font-mono border-b border-[#E7E9EE] bg-[#F8F9FB]">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Template</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Category</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Version</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Active Portfolios</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Updated</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {templates.filter(t => t.status !== 'deleted').map((tmpl) => {
              const isActive = tmpl.status === 'active';

              return (
                <tr key={tmpl.id} className="hover:bg-[#FAFAFA] transition-colors h-[60px]">
                  
                  {/* Template Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={tmpl.thumbnail} alt={tmpl.name} className="w-10 h-10 rounded-lg object-cover border border-[#E7E9EE] shrink-0" />
                      <div>
                        <Link 
                          href={`/admin/templates/${tmpl.id}`}
                          className="font-bold text-[#111318] hover:text-purple-600 flex items-center gap-1 transition-colors font-bricolage"
                        >
                          <span>{tmpl.name}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </Link>
                        <p className="text-[10px] font-mono text-slate-400">ID: {tmpl.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-100 font-mono">
                      {tmpl.category}
                    </span>
                  </td>

                  {/* Version */}
                  <td className="py-3 px-4 font-mono text-slate-600 font-semibold">
                    v{tmpl.version}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Active Portfolios */}
                  <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                    {tmpl.usersCount || 1} Portfolios
                  </td>

                  {/* Updated */}
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {tmpl.updatedAt || 'Recent'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreview(tmpl)}
                        className="px-2.5 py-1 bg-white border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => onDownloadZip(tmpl)}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title="Download ZIP"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(tmpl.id)}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
