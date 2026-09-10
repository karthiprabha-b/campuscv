"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TemplateInstallLogRecord } from '../../types/adminTemplate';

interface AdminLogsViewerProps {
  logs: TemplateInstallLogRecord[];
}

export default function AdminLogsViewer({ logs }: AdminLogsViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const action = log.action.toLowerCase();
    const name = (log.templateName || '').toLowerCase();
    const by = (log.performedBy || '').toLowerCase();
    const details = (log.details || '').toLowerCase();

    const matchesSearch = name.includes(q) || by.includes(q) || details.includes(q) || action.includes(q);
    const matchesFilter = 
      filterAction === 'All' ||
      (filterAction === 'Uploads' && (action.includes('upload') || action.includes('create'))) ||
      (filterAction === 'Updates' && (action.includes('enable') || action.includes('disable') || action.includes('update'))) ||
      (filterAction === 'Deletes' && (action.includes('delete') || action.includes('remove')));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-6 shadow-xs text-left font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111318] font-bricolage tracking-tight">Audit Logs</h2>
        <p className="text-xs text-[#667085]">Track administrative changes across CampusCV.</p>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:bg-white focus:border-purple-600 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          {['All', 'Uploads', 'Updates', 'Deletes'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterAction(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterAction === f
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-[#667085] hover:text-[#111318] hover:bg-[#F8F9FB] border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#98A2B3] font-mono border-b border-[#E7E9EE] bg-[#F8F9FB]">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Action</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Resource</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Admin</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Date</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  No audit log entries matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => {
                const isUpload = log.action.includes('UPLOAD') || log.action.includes('CREATE');
                const isDelete = log.action.includes('DELETE') || log.action.includes('REMOVE');
                
                const actionBadgeClass = isUpload
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : isDelete
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200';

                return (
                  <tr key={log.id ? `${log.id}-${idx}` : `log-${idx}`} className="hover:bg-[#FAFAFA] transition-colors h-[54px]">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${actionBadgeClass}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#111318] font-bricolage">{log.templateName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{log.performedBy}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px] leading-relaxed max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
