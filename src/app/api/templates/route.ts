export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for large up to 1 GB uploads

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  saveTemplateFilesServer,
  extractAndSaveZipServer,
  getTemplateFilesServer,
  listAllDiskTemplates,
  registerTemplateVersionServer,
  deleteTemplateServer,
  updateTemplateStatusServer,
  updateTemplateMetadataServer
} from '../../../lib/serverTemplateStore';

const DATA_TEMPLATES_DIR = path.join(process.cwd(), 'data', 'templates');
const MAX_ZIP_UPLOAD_SIZE = 1024 * 1024 * 1024; // 1 GB

// GET /api/templates — List templates from server persistent registry
// Default: active templates only
// ?includeDisabled=true: active + disabled templates (for Admin)
// ?includeDeleted=true: all records (active + disabled + deleted)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const includeDisabled = searchParams.get('includeDisabled') === 'true' || searchParams.get('scope') === 'admin' || searchParams.get('all') === 'true';

    const templates = listAllDiskTemplates({ includeDisabled, includeDeleted });
    return NextResponse.json({ success: true, count: templates.length, templates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list templates' }, { status: 500 });
  }
}

// POST /api/templates — Upload and register a new template package dynamically (supports up to 1 GB ZIP)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // 1. RAW BINARY STREAMING ZIP UPLOAD (Recommended for large files up to 1 GB)
    if (
      contentType.includes('application/zip') ||
      contentType.includes('application/x-zip') ||
      contentType.includes('application/octet-stream') ||
      action === 'upload-zip' ||
      searchParams.get('templateId') && !contentType.includes('application/json')
    ) {
      if (!req.body) {
        return NextResponse.json({ error: 'No binary data received in upload request' }, { status: 400 });
      }

      const tempDir = path.join(DATA_TEMPLATES_DIR, '..', 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      const tempPath = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.zip`);

      const fileWriteStream = fs.createWriteStream(tempPath);
      const reader = req.body.getReader();
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          totalBytes += value.length;
          if (totalBytes > MAX_ZIP_UPLOAD_SIZE) {
            fileWriteStream.destroy();
            try { fs.unlinkSync(tempPath); } catch (e) {}
            return NextResponse.json({ error: 'File size exceeds maximum 1 GB limit.' }, { status: 413 });
          }
          fileWriteStream.write(value);
        }
      }

      fileWriteStream.end();
      await new Promise<void>((resolve, reject) => {
        fileWriteStream.on('finish', () => resolve());
        fileWriteStream.on('error', (err) => reject(err));
      });

      const templateId = searchParams.get('templateId') || req.headers.get('x-template-id') || '';
      const name = searchParams.get('name') || (req.headers.get('x-template-name') ? decodeURIComponent(req.headers.get('x-template-name')!) : '');
      const category = searchParams.get('category') || 'Developer';
      const version = searchParams.get('version') || '1.0.0';
      const author = searchParams.get('author') || 'Admin';
      const description = searchParams.get('description') || '';
      const supportsDarkMode = searchParams.get('supportsDarkMode') !== 'false';

      let sections: string[] = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];
      const rawSections = searchParams.get('sections');
      if (rawSections) {
        try {
          const parsed = JSON.parse(rawSections);
          if (Array.isArray(parsed)) sections = parsed;
        } catch (e) {}
      }

      let extraRecord: any = {};
      const rawRecord = searchParams.get('record');
      if (rawRecord) {
        try {
          extraRecord = JSON.parse(rawRecord);
        } catch (e) {}
      }

      const result = await extractAndSaveZipServer(tempPath, {
        templateId: templateId || extraRecord?.id,
        overrideMetadata: {
          ...extraRecord,
          name: name || extraRecord?.name,
          category: category || extraRecord?.category,
          version: version || extraRecord?.version,
          author: author || extraRecord?.author,
          description: description || extraRecord?.description,
          supportsDarkMode: supportsDarkMode ?? extraRecord?.supportsDarkMode,
          sections: sections || extraRecord?.sections
        }
      });

      // Cleanup temp zip
      try { fs.unlinkSync(tempPath); } catch (e) {}

      return NextResponse.json({
        success: true,
        templateId: result.templateId,
        versionId: result.versionId,
        currentVersionId: result.versionId,
        version: result.record.version,
        record: result.record,
        fileCount: result.fileCount,
        message: `Template '${result.templateId}' (v${result.record.version}) uploaded and persisted to disk`
      });
    }

    // 2. MULTIPART FORM-DATA UPLOAD (Fallback)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const fileEntry = formData.get('file') || formData.get('zip') || formData.get('templateZip');

      if (!fileEntry || !(fileEntry instanceof File)) {
        return NextResponse.json({ error: 'No ZIP file provided in form-data payload' }, { status: 400 });
      }

      if (fileEntry.size > MAX_ZIP_UPLOAD_SIZE) {
        const sizeMB = (fileEntry.size / (1024 * 1024)).toFixed(1);
        return NextResponse.json({ error: `File size (${sizeMB} MB) exceeds maximum 1 GB upload limit.` }, { status: 413 });
      }

      const templateId = (formData.get('templateId') as string) || (formData.get('id') as string) || '';
      const name = (formData.get('name') as string) || '';
      const category = (formData.get('category') as string) || 'Developer';
      const version = (formData.get('version') as string) || '1.0.0';
      const author = (formData.get('author') as string) || 'Admin';
      const description = (formData.get('description') as string) || '';
      const supportsDarkMode = formData.get('supportsDarkMode') !== 'false';
      
      let sections: string[] = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];
      const rawSections = formData.get('sections');
      if (rawSections && typeof rawSections === 'string') {
        try {
          const parsed = JSON.parse(rawSections);
          if (Array.isArray(parsed)) sections = parsed;
        } catch (e) {}
      }

      let extraRecord: any = {};
      const rawRecord = formData.get('record');
      if (rawRecord && typeof rawRecord === 'string') {
        try {
          extraRecord = JSON.parse(rawRecord);
        } catch (e) {}
      }

      const arrayBuffer = await fileEntry.arrayBuffer();
      const zipBuffer = Buffer.from(arrayBuffer);

      const result = await extractAndSaveZipServer(zipBuffer, {
        templateId: templateId || extraRecord?.id,
        overrideMetadata: {
          ...extraRecord,
          name: name || extraRecord?.name,
          category: category || extraRecord?.category,
          version: version || extraRecord?.version,
          author: author || extraRecord?.author,
          description: description || extraRecord?.description,
          supportsDarkMode: supportsDarkMode ?? extraRecord?.supportsDarkMode,
          sections: sections || extraRecord?.sections
        }
      });

      return NextResponse.json({
        success: true,
        templateId: result.templateId,
        versionId: result.versionId,
        currentVersionId: result.versionId,
        version: result.record.version,
        record: result.record,
        fileCount: result.fileCount,
        message: `Template '${result.templateId}' (v${result.record.version}) uploaded, extracted, and persisted to disk`
      });
    }

    // 2. JSON PAYLOAD UPLOAD (Fallback)
    const body = await req.json();
    const { templateId, manifest, files, customCSS, templateCode, record } = body;

    const targetId = templateId || record?.id;
    if (!targetId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
      return NextResponse.json({ error: 'No template files provided in upload package' }, { status: 400 });
    }

    const versionId = `tplver_${Date.now()}`;

    // Save template files persistently under data/templates/[targetId]/[versionId]/
    saveTemplateFilesServer(targetId, files, versionId);

    // Save manifest.json in version directory if present
    const versionDir = path.join(DATA_TEMPLATES_DIR, targetId, versionId);
    const manifestPath = path.join(versionDir, 'manifest.json');
    if (manifest && !fs.existsSync(manifestPath)) {
      try {
        fs.writeFileSync(manifestPath, typeof manifest === 'string' ? manifest : JSON.stringify(manifest, null, 2), 'utf-8');
      } catch (e) {}
    }

    // Register persistent template metadata item in data/templates/registry.json
    const templatePayload = record || {
      id: targetId,
      name: manifest?.name || targetId,
      version: manifest?.version || '1.0.0',
      category: manifest?.category || 'Developer',
      description: manifest?.description || 'Uploaded template package',
      supportsDarkMode: manifest?.supportsDarkMode ?? true,
      sections: manifest?.sections || ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'],
      status: 'active'
    };

    if (!templatePayload.status) {
      templatePayload.status = 'active';
    }

    const persistentRecord = registerTemplateVersionServer(templatePayload, versionId);

    return NextResponse.json({
      success: true,
      templateId: targetId,
      versionId,
      currentVersionId: versionId,
      version: persistentRecord.version,
      record: persistentRecord,
      fileCount: Object.keys(files).length,
      message: `Template '${targetId}' (versionId: ${versionId}) registered and persisted to disk`
    });
  } catch (error: any) {
    console.error('[API /api/templates POST Error]', error);
    return NextResponse.json({ error: error.message || 'Template upload processing failed' }, { status: 500 });
  }
}

// PUT /api/templates — Update metadata, toggle status, or rollback template version
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, action, targetVersionId, status, patch } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    // Status update (active / disabled / deleted)
    if (action === 'status' || status) {
      const targetStatus = status || body.targetStatus;
      if (!['active', 'disabled', 'deleted'].includes(targetStatus)) {
        return NextResponse.json({ error: `Invalid status '${targetStatus}'. Must be active, disabled, or deleted.` }, { status: 400 });
      }
      const updated = updateTemplateStatusServer(templateId, targetStatus);
      if (!updated) {
        return NextResponse.json({ error: `Template '${templateId}' not found in registry.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, record: updated, message: `Template '${templateId}' status set to '${targetStatus}'` });
    }

    // Metadata update
    if (action === 'metadata' || patch) {
      const updated = updateTemplateMetadataServer(templateId, patch || body);
      if (!updated) {
        return NextResponse.json({ error: `Template '${templateId}' not found in registry.` }, { status: 404 });
      }
      return NextResponse.json({ success: true, record: updated, message: `Template '${templateId}' metadata updated.` });
    }

    // Version rollback
    if (action === 'rollback' && targetVersionId) {
      const { rollbackTemplateVersionServer } = await import('../../../lib/serverTemplateStore');
      const updated = rollbackTemplateVersionServer(templateId, targetVersionId);
      if (!updated) {
        return NextResponse.json({ error: `Version '${targetVersionId}' not found for template '${templateId}'` }, { status: 404 });
      }
      return NextResponse.json({ success: true, record: updated, message: `Template '${templateId}' rolled back to version '${updated.version}'` });
    }

    return NextResponse.json({ error: 'Invalid PUT action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 });
  }
}

// DELETE /api/templates?templateId=... — Permanently delete template from disk, versions, and server registry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const res = deleteTemplateServer(templateId, true);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete template' }, { status: 500 });
  }
}
