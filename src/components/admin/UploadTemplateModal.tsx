"use client";

import React, { useState } from 'react';
import { UploadCloud, FileArchive, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { validateAndExtractTemplateZip, ZipValidationResult } from '../../utils/zipManifestValidator';
import { TemplateRecord } from '../../types/adminTemplate';

interface UploadTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (
    template: TemplateRecord,
    file?: File | null,
    onProgress?: (percent: number, statusText: string) => void
  ) => Promise<{ success: boolean; error?: string } | void> | void;
  existingIds: string[];
}

export default function UploadTemplateModal({
  isOpen,
  onClose,
  onSaveTemplate,
  existingIds
}: UploadTemplateModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ZipValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Editable Fields
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('Designer');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationError(null);
    setValidationResult(null);
    setUploadProgress(null);

    const MAX_ZIP_LIMIT = 1024 * 1024 * 1024; // 1 GB
    if (file.size > MAX_ZIP_LIMIT) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(`File size (${sizeMB} MB) exceeds the maximum allowed template upload limit of 1 GB.`);
      return;
    }

    setIsValidating(true);
    const result = await validateAndExtractTemplateZip(file, existingIds);
    setIsValidating(false);

    if (!result.isValid && result.error) {
      setValidationError(result.error);
    }
    setValidationResult(result);

    if (result.manifest) {
      if (result.manifest.name) setTemplateName(result.manifest.name);
      if (result.manifest.category) setCategory(result.manifest.category);
      if (result.manifest.version) setVersion(result.manifest.version);
      if (result.manifest.description) setDescription(result.manifest.description);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationResult || !validationResult.manifest) return;

    const manifest = validationResult.manifest;
    const zipSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '1.8 MB';
    const fallbackId = templateName
      ? templateName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      : (selectedFile ? selectedFile.name.replace(/\.zip$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '-') : `tpl-${Date.now()}`);
    const resolvedId = (manifest.id && manifest.id !== 'undefined') ? manifest.id : fallbackId;

    const newRecord: TemplateRecord = {
      id: resolvedId,
      name: templateName || manifest.name || resolvedId,
      version: version || manifest.version || '1.0.0',
      author: manifest.author || 'Admin',
      description: description || manifest.description || '',
      category: category || manifest.category || 'Developer',
      tags: manifest.tags || ['portfolio', 'uploaded'],
      supportsDarkMode: manifest.supportsDarkMode ?? true,
      supportsLightMode: manifest.supportsLightMode ?? true,
      sections: Array.isArray(manifest.sections)
        ? manifest.sections.map((sec: any) => typeof sec === 'string' ? sec : (sec?.name || sec?.id || 'Section'))
        : ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact', 'Footer'],
      status: 'active',
      downloadCount: 1,
      usersCount: 0,
      zipFileName: selectedFile ? selectedFile.name : `${resolvedId}.zip`,
      zipSizeFormatted: zipSizeMB,
      thumbnail: validationResult.thumbnailUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      customCSS: validationResult.customCSS,
      templateCode: validationResult.templateCode,
      manifestJson: validationResult.manifestJson,
      schemaCode: validationResult.schemaCode,
      bindingsJson: validationResult.bindingsJson,
      themeConfig: validationResult.themeConfig,
      sectionFiles: validationResult.sectionFiles,
      bindings: validationResult.bindings,
      schema: validationResult.schema,
      assetMap: validationResult.assetMap,
      fieldCounts: validationResult.fieldCounts,
      sectionsCount: validationResult.sectionsCount,
      assetsCount: validationResult.assetsCount,
      validationReport: validationResult.validationReport,
      editorCompatibility: validationResult.editorCompatibility,
      analytics: {
        installCount: 0,
        publishedPortfolios: 0,
        templateViews: 0,
        previewCount: 0,
        usagePercent: 0,
        avgLoadTimeMs: 0,
        validationScore: validationResult.validationReport?.score ?? 100
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setIsPublishing(true);
    setValidationError(null);
    setUploadProgress('Starting upload...');

    try {
      const res = await onSaveTemplate(newRecord, selectedFile, (percent, statusText) => {
        setUploadProgress(statusText);
      });
      if (res && typeof res === 'object' && 'success' in res && !res.success) {
        setValidationError(res.error || 'Failed to persist template on server.');
        setIsPublishing(false);
        setUploadProgress(null);
        return;
      }
      setIsPublishing(false);
      setUploadProgress(null);
      onClose();

      setSelectedFile(null);
      setValidationResult(null);
      setValidationError(null);
    } catch (err: any) {
      setIsPublishing(false);
      setUploadProgress(null);
      setValidationError(err.message || 'Error occurred while saving template.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E7E9EE] text-left relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#111318] font-bricolage tracking-tight">Upload Template</h3>
            <p className="text-xs text-[#667085]">Add a new portfolio template to CampusCV (up to 1 GB).</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-5 text-xs">
          
          {/* ZIP Dropzone */}
          <div className="space-y-1.5">
            <div className="border-2 border-dashed border-[#E7E9EE] hover:border-purple-500 rounded-2xl p-8 text-center bg-[#F8F9FB] hover:bg-purple-50/20 cursor-pointer transition-all relative group">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-105 transition-transform" />
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="font-bold text-[#111318] text-xs font-bricolage">{selectedFile.name}</p>
                  <p className="text-[10px] text-[#667085] font-mono">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-bold text-[#111318] text-sm font-bricolage">Drop ZIP file here</p>
                  <p className="text-xs text-[#667085]">or <span className="text-purple-600 font-semibold underline">Browse Files</span></p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">ZIP up to 1 GB</p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Status */}
          {isValidating && (
            <div className="p-3.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span>Scanning ZIP package and validating manifest...</span>
            </div>
          )}

          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {validationResult && validationResult.manifest && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ZIP verified! {validationResult.sectionsCount} sections and {validationResult.fieldCounts.total} fields detected.</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111318] uppercase tracking-wider font-mono">Template Name</label>
              <input
                type="text"
                placeholder="e.g. Product Designer Portfolio"
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:border-purple-600 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111318] uppercase tracking-wider font-mono">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:border-purple-600 outline-none cursor-pointer"
                >
                  {category && !['Developer & Engineering', 'Developer', 'Designer', 'Student', 'Agriculture', 'Photography', 'Beautician', 'Lawyer', 'Doctor', 'Minimalist', 'Creative', 'Business'].includes(category) && (
                    <option value={category}>{category}</option>
                  )}
                  <option value="Developer & Engineering">Developer &amp; Engineering</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Student">Student</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Photography">Photography</option>
                  <option value="Beautician">Beautician</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Creative">Creative &amp; Agency</option>
                  <option value="Business">Business &amp; Executive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#111318] uppercase tracking-wider font-mono">Version</label>
                <input
                  type="text"
                  placeholder="1.0.0"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:border-purple-600 outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#111318] uppercase tracking-wider font-mono">Description</label>
              <textarea
                rows={3}
                placeholder="Short description of this template layout..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E7E9EE] rounded-xl text-xs text-[#111318] focus:border-purple-600 outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-[#E7E9EE] text-slate-600 font-semibold rounded-xl hover:bg-[#F8F9FB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validationResult || !validationResult.isValid || isValidating || isPublishing}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{uploadProgress || 'Uploading & Persisting...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Upload Template</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
