"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JSZip from 'jszip';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import AdminStatsOverview from '../../components/admin/AdminStatsOverview';
import TemplateLibraryGrid from '../../components/admin/TemplateLibraryGrid';
import InstalledTemplatesTable from '../../components/admin/InstalledTemplatesTable';
import UploadTemplateModal from '../../components/admin/UploadTemplateModal';
import TemplatePreviewModal from '../../components/admin/TemplatePreviewModal';
import EditMetadataModal from '../../components/admin/EditMetadataModal';
import ViewManifestModal from '../../components/admin/ViewManifestModal';
import AdminLogsViewer from '../../components/admin/AdminLogsViewer';
import PlanManager from '../../components/admin/PlanManager';
import CouponManager from '../../components/admin/CouponManager';
import UsersLedger from '../../components/admin/UsersLedger';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { TemplateRecord, TemplateInstallLogRecord } from '../../types/adminTemplate';
import { initializeMockDb } from '../../utils/mockDb';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard', subtitle: 'Overview of your CampusCV platform.' },
  library: { title: 'Templates', subtitle: 'Manage and publish portfolio templates.' },
  installed: { title: 'Installed Templates', subtitle: 'Catalog of active and installed template packages.' },
  plans: { title: 'Plans & Coupons', subtitle: 'Manage subscription plans and promotional coupon codes.' },
  users: { title: 'Users & Ledger', subtitle: 'Registered student accounts, subscriptions, and transactions.' },
  logs: { title: 'Audit Logs', subtitle: 'Track administrative changes across CampusCV.' },
  settings: { title: 'Settings', subtitle: 'Configure platform parameters and admin console preferences.' },
};

export default function AdminPage() {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [logs, setLogs] = useState<TemplateInstallLogRecord[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<TemplateRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [manifestTemplate, setManifestTemplate] = useState<TemplateRecord | null>(null);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Admin Security Check
    const adminSession = typeof window !== 'undefined' ? sessionStorage.getItem('campuscv_admin_session') : null;
    if (!adminSession) {
      router.replace('/admin/login');
      return;
    }
    setIsAdminAuthenticated(true);
    initializeMockDb();
    refreshData();
  }, [router]);

  const refreshData = () => {
    adminTemplateDb.syncWithServerRegistryAsync().then(list => {
      setTemplates(list);
    });
    setLogs(adminTemplateDb.getLogs());
  };

  const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 6000);
  };

  const handleSaveTemplate = async (
    record: TemplateRecord,
    file?: File | null,
    onProgress?: (percent: number, statusText: string) => void
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (file && file instanceof File) {
        const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB per chunk (well under Cloudflare / Traefik / Nginx limits)
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = `upl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        let finalRecord = record;

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(file.size, start + CHUNK_SIZE);
          const chunkBlob = file.slice(start, end);
          const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);

          if (onProgress) {
            onProgress(percent, `Uploading chunk ${chunkIndex + 1}/${totalChunks} (${percent}%)...`);
          }

          const params = new URLSearchParams();
          params.set('uploadId', uploadId);
          params.set('chunkIndex', String(chunkIndex));
          params.set('totalChunks', String(totalChunks));

          if (chunkIndex === totalChunks - 1) {
            const cleanId = (record.id && record.id !== 'undefined')
              ? record.id
              : (record.name ? record.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : `tpl-${Date.now()}`);
            params.set('templateId', cleanId);
            params.set('name', record.name || cleanId);
            params.set('version', record.version || '1.0.0');
            params.set('category', record.category || 'Developer');
            params.set('author', record.author || 'Admin');
            params.set('description', record.description || '');
            params.set('supportsDarkMode', String(record.supportsDarkMode ?? true));
            if (Array.isArray(record.sections) && record.sections.length > 0) {
              const cleanSections = record.sections.map((s: any) => typeof s === 'string' ? s : (s?.name || s?.id || String(s)));
              params.set('sections', JSON.stringify(cleanSections));
            }
          }

          const res = await fetch(`/api/templates/upload-chunk?${params.toString()}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'x-upload-id': uploadId,
              'x-chunk-index': String(chunkIndex),
              'x-total-chunks': String(totalChunks)
            },
            body: chunkBlob
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            const errMsg = errJson.error || `Server chunk error (${res.status}): ${res.statusText}`;
            console.error('[ADMIN UPLOAD CHUNK ERROR]', errMsg);
            showNotification(`Upload failed: ${errMsg}`, 'error');
            return { success: false, error: errMsg };
          }

          const json = await res.json();
          if (json.isComplete && json.record) {
            finalRecord = json.record;
          }
        }

        adminTemplateDb.saveTemplate(finalRecord);
        await refreshData();
        showNotification(`Template package '${record.name}' (v${record.version}) uploaded & persisted!`, 'success');
        return { success: true };
      }

      // Metadata-only fallback update
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: record.id,
          manifest: {
            name: record.name,
            version: record.version,
            author: record.author,
            category: record.category,
            description: record.description,
            sections: record.sections,
            supportsDarkMode: record.supportsDarkMode
          },
          files: record.sectionFiles || {},
          customCSS: record.customCSS,
          templateCode: record.templateCode,
          record
        })
      });

      if (res.ok) {
        const json = await res.json();
        const persistentRecord = json.record || record;
        if (json.currentVersionId) {
          persistentRecord.currentVersionId = json.currentVersionId;
        }
        adminTemplateDb.saveTemplate(persistentRecord);
        await refreshData();
        showNotification(`Template package '${record.name}' (v${record.version}) uploaded & persisted!`, 'success');
        return { success: true };
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error || `Server returned error (${res.status}): ${res.statusText}`;
        console.error('[ADMIN UPLOAD SERVER ERROR]', errMsg);
        showNotification(`Upload failed: ${errMsg}`, 'error');
        return { success: false, error: errMsg };
      }
    } catch (e: any) {
      console.error('[ADMIN UPLOAD PERSIST ERROR]', e);
      const errMsg = e?.message || 'Network error or payload exceeded maximum allowable size.';
      showNotification(`Upload failed: ${errMsg}`, 'error');
      return { success: false, error: errMsg };
    }
  };

  const handleToggleStatus = async (id: string) => {
    await adminTemplateDb.toggleTemplateStatus(id);
    await refreshData();
    showNotification('Template status toggled successfully.', 'info');
  };

  const handleDuplicateTemplate = async (id: string) => {
    const cloned = adminTemplateDb.duplicateTemplate(id);
    if (cloned) {
      await refreshData();
      showNotification(`Duplicated template package '${cloned.name}'.`, 'success');
    }
  };

  const handleEditMetadata = (template: TemplateRecord) => {
    setEditTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleSaveMetadataPatch = async (patch: Partial<TemplateRecord>) => {
    if (!editTemplate) return;
    await adminTemplateDb.updateMetadata(editTemplate.id, patch);
    await refreshData();
    showNotification(`Updated metadata for '${editTemplate.name}'.`, 'success');
  };

  const handleViewManifest = (template: TemplateRecord) => {
    setManifestTemplate(template);
    setIsManifestModalOpen(true);
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete template '${name}'? This action is persistent across server restarts.`)) {
      const res = await adminTemplateDb.deleteTemplate(id);
      await refreshData();
      showNotification(res.message, 'info');
    }
  };

  const handleDownloadZip = async (template: TemplateRecord) => {
    try {
      const zip = new JSZip();
      const manifestObj = {
        id: template.id,
        name: template.name,
        version: template.version,
        author: template.author,
        description: template.description,
        category: template.category,
        supportsDarkMode: template.supportsDarkMode,
        sections: template.sections,
        fieldCounts: template.fieldCounts,
        editorCompatibility: template.editorCompatibility
      };

      zip.file('manifest.json', JSON.stringify(manifestObj, null, 2));
      zip.file('schema.json', template.schemaCode || JSON.stringify(template.sections, null, 2));
      zip.file('theme.json', JSON.stringify({ primaryColor: '#7C3AED', fontFamily: 'Inter' }, null, 2));
      zip.file('styles.css', template.customCSS || `/* Custom CSS for ${template.name} */\n`);
      zip.file('README.md', `# ${template.name}\n\nCampusCV Template Package v${template.version}`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.id}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Could not generate ZIP package download.');
    }
  };

  const handleOpenPreview = (template: TemplateRecord) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const pageInfo = TAB_TITLES[activeTab] || { title: 'Admin Console', subtitle: '' };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#111318] flex antialiased">
      
      {/* 240px Fixed Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main Viewport Offset by 240px Sidebar Width */}
      <div className="flex-1 pl-[240px] flex flex-col min-h-screen">
        
        {/* Sticky Top Bar (Height: 64px) */}
        <AdminTopBar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        {/* Notification Toast Banner with Orange/Emerald/Rose Accents */}
        {toast && (
          <div className={`px-6 py-3.5 text-xs font-bold flex items-center justify-between shadow-md sticky top-[68px] z-30 animate-fadeIn ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-b border-rose-700'
              : toast.type === 'success'
              ? 'bg-emerald-600 text-white border-b border-emerald-700'
              : 'bg-gradient-to-r from-orange-500 to-purple-600 text-white border-b border-orange-600'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm">
                {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-white hover:opacity-80 font-bold ml-4 p-1 cursor-pointer">✕</button>
          </div>
        )}

        {/* Content Container (Max Width: 1400px, Padding: 32px 40px) */}
        <main className="w-full max-w-[1400px] mx-auto p-8 lg:p-10 space-y-8 flex-1">
          
          {/* TAB 1: Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <AdminStatsOverview
                templates={templates}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 font-bricolage">Featured Templates</h3>
                  <button onClick={() => setActiveTab('library')} className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors cursor-pointer">
                    View all templates →
                  </button>
                </div>
                <TemplateLibraryGrid
                  templates={templates}
                  onPreview={handleOpenPreview}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteTemplate}
                  onDownloadZip={handleDownloadZip}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                  onEditMetadata={handleEditMetadata}
                  onDuplicate={handleDuplicateTemplate}
                  onViewManifest={handleViewManifest}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Templates Library */}
          {activeTab === 'library' && (
            <div className="animate-fadeIn">
              <TemplateLibraryGrid
                templates={templates}
                onPreview={handleOpenPreview}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTemplate}
                onDownloadZip={handleDownloadZip}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onEditMetadata={handleEditMetadata}
                onDuplicate={handleDuplicateTemplate}
                onViewManifest={handleViewManifest}
              />
            </div>
          )}

          {/* TAB 3: Installed Templates Table */}
          {activeTab === 'installed' && (
            <div className="animate-fadeIn">
              <InstalledTemplatesTable
                templates={templates}
                onPreview={handleOpenPreview}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTemplate}
                onDownloadZip={handleDownloadZip}
              />
            </div>
          )}

          {/* TAB 4: Plans & Coupons */}
          {activeTab === 'plans' && (
            <div className="space-y-8 animate-fadeIn">
              <PlanManager onUpdate={refreshData} />
              <CouponManager onUpdate={refreshData} />
            </div>
          )}

          {/* TAB 5: Users & Ledger */}
          {activeTab === 'users' && (
            <div className="animate-fadeIn">
              <UsersLedger />
            </div>
          )}

          {/* TAB 6: Audit Logs */}
          {activeTab === 'logs' && (
            <div className="animate-fadeIn">
              <AdminLogsViewer logs={logs} />
            </div>
          )}

          {/* TAB 7: Settings Placeholder */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-8 space-y-6 text-left shadow-xs animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-[#111318] font-bricolage tracking-tight">Platform Settings</h2>
                <p className="text-xs text-[#667085]">Global configuration and administrative preferences.</p>
              </div>
              <div className="space-y-4 max-w-xl text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#111318] uppercase tracking-wider font-mono">Platform Name</label>
                  <input type="text" defaultValue="CampusCV" className="w-full px-3.5 py-2.5 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-[#111318] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#111318] uppercase tracking-wider font-mono">Official Support / Contact Email</label>
                  <input type="email" defaultValue="support@campuscv.com" className="w-full px-3.5 py-2.5 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl text-xs text-[#111318] outline-none" />
                </div>
                <div className="pt-2">
                  <button className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-xs">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <UploadTemplateModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveTemplate={handleSaveTemplate}
        existingIds={templates.map((t) => t.id)}
      />

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={previewTemplate}
      />

      <EditMetadataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        template={editTemplate}
        onSave={handleSaveMetadataPatch}
      />

      <ViewManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        template={manifestTemplate}
      />
    </div>
  );
}
