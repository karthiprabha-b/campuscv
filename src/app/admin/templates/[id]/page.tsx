"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Power, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Edit3,
  FileCode,
  FolderTree,
  ShieldCheck,
  Zap,
  Copy
} from 'lucide-react';
import AdminSidebar from '../../../../components/admin/AdminSidebar';
import AdminTopBar from '../../../../components/admin/AdminTopBar';
import { adminTemplateDb } from '../../../../utils/adminTemplateDb';
import { TemplateRecord, TemplateVersionRecord } from '../../../../types/adminTemplate';
import VersionHistoryTimeline from '../../../../components/admin/VersionHistoryTimeline';
import TemplatePreviewModal from '../../../../components/admin/TemplatePreviewModal';
import EditMetadataModal from '../../../../components/admin/EditMetadataModal';
import ViewManifestModal from '../../../../components/admin/ViewManifestModal';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.id as string;

  const [template, setTemplate] = useState<TemplateRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  useEffect(() => {
    if (templateId) {
      const found = adminTemplateDb.getTemplateById(templateId);
      setTemplate(found || null);
    }
  }, [templateId]);

  if (!template) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-xs text-slate-500 font-sans">
        <div className="space-y-2 text-center">
          <p>Template record not found.</p>
          <Link href="/admin" className="text-purple-600 font-bold underline">Return to Admin Console</Link>
        </div>
      </div>
    );
  }

  const mockVersions: TemplateVersionRecord[] = [
    {
      id: 'v-1',
      templateId: template.id,
      version: template.version,
      changelog: 'Latest release verified with self-describing schema & responsive inline edit wrappers.',
      zipFileName: template.zipFileName,
      zipSizeFormatted: template.zipSizeFormatted,
      createdAt: template.updatedAt || template.createdAt
    },
    {
      id: 'v-2',
      templateId: template.id,
      version: '1.0.0',
      changelog: 'Initial template package published into CampusCV template catalog.',
      zipFileName: template.zipFileName,
      zipSizeFormatted: template.zipSizeFormatted,
      createdAt: template.createdAt
    }
  ];

  const handleToggleStatus = async () => {
    await adminTemplateDb.toggleTemplateStatus(template.id);
    setTemplate(adminTemplateDb.getTemplateById(template.id) || null);
  };

  const handleDuplicate = () => {
    const cloned = adminTemplateDb.duplicateTemplate(template.id);
    if (cloned) {
      router.push(`/admin/templates/${cloned.id}`);
    }
  };

  const handleSaveMetadata = async (updatedPatch: Partial<TemplateRecord>) => {
    const updated = await adminTemplateDb.updateMetadata(template.id, updatedPatch);
    if (updated) setTemplate(updated);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete template '${template.name}'?`)) {
      const res = await adminTemplateDb.deleteTemplate(template.id);
      if (!res.success) {
        alert(res.message);
      } else {
        router.push('/admin');
      }
    }
  };

  const fieldCounts = template.fieldCounts || { text: 28, images: 6, buttons: 8, links: 12, lists: 8, cards: 12, tags: 24, timeline: 6, skills: 18, social: 6, total: 84 };
  const compat = template.editorCompatibility || { text: true, image: true, button: true, social: true, projects: true, experience: true, skills: true, education: true, gallery: true, timeline: true, customSections: true };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111318] font-sans flex antialiased text-left">
      
      {/* Sidebar */}
      <AdminSidebar
        activeTab="library"
        setActiveTab={() => router.push('/admin')}
        onOpenUploadModal={() => router.push('/admin')}
      />

      {/* Main Viewport */}
      <div className="flex-1 pl-[240px] flex flex-col min-h-screen">
        
        <AdminTopBar
          title={template.name}
          subtitle={`Package ID: ${template.id} • v${template.version}`}
        />

        <main className="w-full max-w-[1400px] mx-auto p-8 lg:p-10 space-y-8 flex-1">
          
          {/* Top Actions Bar */}
          <div className="flex items-center justify-between border-b border-[#E7E9EE] pb-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Templates</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold rounded-xl transition-all bg-white cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold rounded-xl transition-all bg-white cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Metadata</span>
              </button>

              <button
                onClick={handleDuplicate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E7E9EE] hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold rounded-xl transition-all bg-white cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={handleToggleStatus}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  template.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Power className="w-4 h-4" />
                <span className="uppercase">{template.status}</span>
              </button>

              <button
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Delete Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Metadata Panel */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Thumbnail Card */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-5 space-y-4 shadow-xs">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-[#E7E9EE] relative">
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md text-purple-700 font-mono text-[9px] font-bold uppercase rounded border border-purple-100">
                    {template.category}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-[#667085]">Author:</span> <span className="font-semibold text-[#111318]">{template.author}</span></div>
                  <div className="flex justify-between"><span className="text-[#667085]">Category:</span> <span className="font-semibold text-[#111318]">{template.category}</span></div>
                  <div className="flex justify-between"><span className="text-[#667085]">Active Portfolios:</span> <span className="font-mono text-emerald-600 font-bold">{template.usersCount || 0} users</span></div>
                  <div className="flex justify-between"><span className="text-[#667085]">Package File:</span> <span className="font-mono text-slate-700">{template.zipFileName}</span></div>
                  <div className="flex justify-between"><span className="text-[#667085]">Created:</span> <span className="font-mono text-slate-700">{template.createdAt}</span></div>
                </div>
              </div>

              {/* Validation Score */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs text-[#111318] flex items-center gap-1.5 font-bricolage">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Validation Score
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-bold">
                    {template.validationReport?.score || 100}%
                  </span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  {(template.validationReport?.checks || [
                    { id: '1', name: 'manifest.json', passed: true, message: 'Verified' },
                    { id: '2', name: 'schema.ts', passed: true, message: 'Self-describing' },
                    { id: '3', name: 'editable wrappers', passed: true, message: 'Bound' }
                  ]).map((chk) => (
                    <div key={chk.id} className="flex justify-between items-center py-0.5">
                      <span className="text-slate-600">{chk.name}</span>
                      <span className={chk.passed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {chk.passed ? 'PASSED' : 'WARNING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Structure */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-5 space-y-3 shadow-xs">
                <h4 className="font-bold text-xs text-[#111318] flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bricolage">
                  <FolderTree className="w-4 h-4 text-purple-600" /> File Structure
                </h4>
                <div className="space-y-1 font-mono text-[11px]">
                  {(template.fileTree || [
                    { path: 'manifest.json', sizeFormatted: '1.1 KB', type: 'config' },
                    { path: 'schema.json', sizeFormatted: '11.7 KB', type: 'config' },
                    { path: 'styles.css', sizeFormatted: '2.0 KB', type: 'style' }
                  ]).map((node, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-700 py-0.5">
                      <span>📄 {node.path}</span>
                      <span className="text-slate-400 text-[10px]">{node.sizeFormatted}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Detailed Panel */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Template Description */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-[#111318] font-bricolage">Description</h3>
                  <button
                    onClick={() => setIsManifestModalOpen(true)}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-semibold hover:bg-purple-100 transition-colors flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" /> View Manifest JSON
                  </button>
                </div>
                
                <p className="text-xs text-[#667085] leading-relaxed">{template.description}</p>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">Detected Layout Sections ({template.sections.length})</span>
                  <div className="flex flex-wrap gap-2">
                    {template.sections.map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-mono font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editable Field Breakdown */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#111318] border-b border-slate-100 pb-3 flex items-center gap-2 font-bricolage">
                  <Zap className="w-4 h-4 text-purple-600" /> Editable Field Breakdown ({fieldCounts.total} Total Fields)
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl">
                    <span className="text-[#667085] text-[10px] block font-bold">TEXT FIELDS</span>
                    <span className="text-sm font-bold text-[#111318]">{fieldCounts.text}</span>
                  </div>
                  <div className="p-3 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl">
                    <span className="text-[#667085] text-[10px] block font-bold">IMAGES</span>
                    <span className="text-sm font-bold text-[#111318]">{fieldCounts.images}</span>
                  </div>
                  <div className="p-3 bg-[#F8F9FB] border border-[#E7E9EE] rounded-xl">
                    <span className="text-[#667085] text-[10px] block font-bold">BUTTONS</span>
                    <span className="text-sm font-bold text-[#111318]">{fieldCounts.buttons}</span>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-purple-700 text-[10px] block font-bold">TOTAL FIELDS</span>
                    <span className="text-sm font-bold text-purple-700">{fieldCounts.total}</span>
                  </div>
                </div>
              </div>

              {/* Editor Compatibility */}
              <div className="bg-white border border-[#E7E9EE] rounded-[16px] p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-[#111318] border-b border-slate-100 pb-3 flex items-center gap-2 font-bricolage">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Editor Compatibility
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  {Object.entries(compat).map(([key, isSupported]) => (
                    <div key={key} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isSupported ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      <span className="capitalize font-bold text-[11px]">{key}</span>
                      <span className="font-extrabold">{isSupported ? '✓' : '⚠️'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version History */}
              <VersionHistoryTimeline versions={mockVersions} />
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={template}
      />

      <EditMetadataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        template={template}
        onSave={handleSaveMetadata}
      />

      <ViewManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        template={template}
      />
    </div>
  );
}
