import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Allowed MIME types for images and documents
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Documents / Resumes
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream'
]);

// Maximum file size: 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Base uploads root directory on VPS disk: public/uploads/users
const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads', 'users');

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizePathComponent(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 50);
}

function safelyDeleteOldAsset(rawUrl: string, targetUser: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    // Clean URL: extract pathname if it is a full URL or relative path
    let urlPath = rawUrl;
    if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
      try {
        const parsed = new URL(urlPath);
        urlPath = parsed.pathname;
      } catch {}
    }

    // Only allow deletion within /uploads/users/
    if (!urlPath.includes('/uploads/users/')) return false;

    // Extract relative path from /uploads/users/
    const relFromUploadsUsers = urlPath.substring(urlPath.indexOf('/uploads/users/') + '/uploads/users/'.length);
    const normalizedRel = path.normalize(relFromUploadsUsers).replace(/^(\.\.[\/\\])+/, '');
    
    const targetFilePath = path.join(UPLOADS_ROOT, normalizedRel);
    const normalizedUploadsRoot = path.normalize(UPLOADS_ROOT);

    // Security check: must reside inside UPLOADS_ROOT
    if (!targetFilePath.startsWith(normalizedUploadsRoot)) {
      console.warn(`[ASSET CLEANUP BLOCKED] Security violation attempted delete path: "${targetFilePath}"`);
      return false;
    }

    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isFile()) {
      fs.unlinkSync(targetFilePath);
      console.log(`[VPS ASSET CLEANUP SUCCESS] Removed old asset from VPS: "${targetFilePath}"`);
      return true;
    }
  } catch (err) {
    console.warn('[ASSET CLEANUP ERROR]', err);
  }
  return false;
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    architecture: 'VPS Per-User Storage with Auto-Cleanup', 
    uploadRoot: UPLOADS_ROOT 
  });
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlToDelete = searchParams.get('url') || '';
    const username = sanitizePathComponent(searchParams.get('username') || searchParams.get('userId') || '');

    if (!urlToDelete) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const deleted = safelyDeleteOldAsset(urlToDelete, username);
    return NextResponse.json({ success: true, deleted, url: urlToDelete });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Header overrides for user / category / oldUrl if supplied
    let headerUser = sanitizePathComponent(
      request.headers.get('x-username') || 
      request.headers.get('x-user-id') || 
      request.headers.get('x-user-slug') || ''
    );
    let headerCategory = sanitizePathComponent(request.headers.get('x-category') || '');
    let headerOldUrl = request.headers.get('x-old-url') || request.headers.get('x-previous-url') || '';

    let fileBuffer: Buffer | null = null;
    let mimeType = '';
    let originalName = 'upload.png';
    let payloadUser = '';
    let payloadCategory = '';
    let payloadOldUrl = '';
    let shouldReplace = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const fileEntry = formData.get('file') || formData.get('image') || formData.get('photo') || formData.get('resume');

      if (!fileEntry || !(fileEntry instanceof File)) {
        return NextResponse.json({ error: 'No file uploaded in form-data payload' }, { status: 400 });
      }

      mimeType = fileEntry.type || 'application/octet-stream';
      originalName = fileEntry.name || 'upload.png';

      payloadUser = sanitizePathComponent(
        (formData.get('username') as string) || 
        (formData.get('userId') as string) || 
        (formData.get('user_id') as string) || ''
      );

      payloadCategory = sanitizePathComponent(
        (formData.get('category') as string) || 
        (formData.get('type') as string) || 
        (formData.get('folder') as string) || ''
      );

      payloadOldUrl = (formData.get('oldUrl') as string) || 
                      (formData.get('previousUrl') as string) || 
                      (formData.get('replaceUrl') as string) || '';

      shouldReplace = formData.get('replace') === 'true';

      if (fileEntry.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File size (${(fileEntry.size / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit` }, { status: 400 });
      }

      const arrayBuffer = await fileEntry.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      const { base64, fileData, type, filename, username, userId, category, oldUrl, previousUrl, replaceUrl, replace } = body;

      payloadUser = sanitizePathComponent(username || userId || '');
      payloadCategory = sanitizePathComponent(category || type || '');
      payloadOldUrl = oldUrl || previousUrl || replaceUrl || '';
      shouldReplace = replace === true;

      const rawData = base64 || fileData;
      if (!rawData || typeof rawData !== 'string') {
        return NextResponse.json({ error: 'Missing base64/fileData payload' }, { status: 400 });
      }

      if (rawData.startsWith('data:')) {
        const matches = rawData.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          fileBuffer = Buffer.from(matches[2], 'base64');
        }
      }

      if (!fileBuffer && type) {
        mimeType = type;
        fileBuffer = Buffer.from(rawData, 'base64');
      }

      if (filename) originalName = filename;
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type header' }, { status: 400 });
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty file buffer' }, { status: 400 });
    }

    // Determine target username & category folder
    const targetUser = payloadUser || headerUser || 'guest';
    
    // Normalize category: avatar, projects, banners, resumes, or general
    let targetCategory = payloadCategory || headerCategory || 'general';
    if (targetCategory === 'profile' || targetCategory === 'photo' || targetCategory === 'avatars') {
      targetCategory = 'avatar';
    } else if (targetCategory === 'project' || targetCategory === 'works') {
      targetCategory = 'projects';
    } else if (targetCategory === 'hero' || targetCategory === 'bg' || targetCategory === 'background') {
      targetCategory = 'banners';
    } else if (targetCategory === 'cv' || targetCategory === 'document' || targetCategory === 'docs') {
      targetCategory = 'resumes';
    }

    // Validate MIME type
    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      console.warn(`[ASSET UPLOAD WARNING] Non-standard MIME type: "${mimeType}" for file: "${originalName}"`);
    }

    // Validate file size limit
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum 50MB limit' }, { status: 400 });
    }

    // Determine extension
    let ext = 'png';
    const lowerMime = mimeType.toLowerCase();
    if (lowerMime.includes('jpeg') || lowerMime.includes('jpg')) ext = 'jpg';
    else if (lowerMime.includes('webp')) ext = 'webp';
    else if (lowerMime.includes('gif')) ext = 'gif';
    else if (lowerMime.includes('svg')) ext = 'svg';
    else if (lowerMime.includes('pdf')) ext = 'pdf';
    else if (lowerMime.includes('word') || lowerMime.includes('docx')) ext = 'docx';
    else if (originalName.includes('.')) ext = sanitizePathComponent(originalName.split('.').pop() || 'png');

    // Generate unique UUID filename
    const uuid = crypto.randomUUID ? crypto.randomUUID().slice(0, 12) : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${targetCategory}_${uuid}.${ext}`;

    // Target User Directory: public/uploads/users/[username]/[category]/
    const userDir = path.join(UPLOADS_ROOT, targetUser, targetCategory);
    ensureDirectoryExists(userDir);

    // Clean up old asset if oldUrl is provided or if replacing avatar/banner/resumes
    const effectiveOldUrl = payloadOldUrl || headerOldUrl;
    if (effectiveOldUrl) {
      safelyDeleteOldAsset(effectiveOldUrl, targetUser);
    } else if (shouldReplace || targetCategory === 'avatar' || targetCategory === 'banners') {
      // If replacing a single-slot category like avatar, clean up previous files in that category directory
      try {
        if (fs.existsSync(userDir)) {
          const existingFiles = fs.readdirSync(userDir);
          for (const oldFile of existingFiles) {
            const oldFilePath = path.join(userDir, oldFile);
            if (fs.statSync(oldFilePath).isFile()) {
              fs.unlinkSync(oldFilePath);
              console.log(`[VPS SLOT REPLACEMENT] Removed prior ${targetCategory} asset: "${oldFilePath}"`);
            }
          }
        }
      } catch (cleanupErr) {
        console.warn(`[VPS SLOT REPLACEMENT WARNING]`, cleanupErr);
      }
    }

    const targetPath = path.join(userDir, fileName);
    fs.writeFileSync(targetPath, fileBuffer);

    // Relative web URL: /uploads/users/[username]/[category]/[filename]
    const relativeUrl = `/uploads/users/${targetUser}/${targetCategory}/${fileName}`;

    console.log(`[VPS USER UPLOAD SUCCESS] User: "${targetUser}" | Category: "${targetCategory}" | File: "${fileName}" (${fileBuffer.length} bytes) -> Saved on VPS: "${targetPath}" | Web URL: "${relativeUrl}"`);

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName,
      username: targetUser,
      category: targetCategory,
      mimeType,
      size: fileBuffer.length
    });
  } catch (err: any) {
    console.error('[ASSET UPLOAD ERROR]', err);
    return NextResponse.json({ error: err.message || 'Server error during asset upload' }, { status: 500 });
  }
}
