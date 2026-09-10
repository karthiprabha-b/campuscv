/**
 * imageUploadStorage — Lightweight Image Upload & Compression Storage Pipeline
 *
 * 1. Instantly creates Blob URL for 0ms live canvas preview.
 * 2. Compresses image to lightweight 600px JPEG/WebP data URL (~30KB) so it persists
 *    persistently across localStorage, IndexedDB, new tabs, and published pages (/p/[username]).
 * 3. Sanitizes giant raw uncompressed base64 data URLs (>250KB) while retaining lightweight compressed images.
 */

// In-memory Blob URL cache
const blobUrlCache = new Map<string, string>();

/**
 * Compress an image file to a lightweight WebP/JPEG Blob (~40KB - 120KB)
 * Drastically reduces file size (by 90%+) and optimizes VPS disk usage.
 */
export function compressImageFileToBlob(
  file: File,
  maxDimension = 1400,
  quality = 0.82
): Promise<{ blob: Blob; fileName: string }> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve({ blob: file, fileName: file?.name || 'upload.bin' });
      return;
    }
    // SVG and animated GIF stay intact
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      resolve({ blob: file, fileName: file.name });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Name base
          const rawBase = file.name.replace(/\.[^/.]+$/, '');
          const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);

          // Try WebP first for optimal compression
          canvas.toBlob((webpBlob) => {
            if (webpBlob && webpBlob.size > 0) {
              resolve({ blob: webpBlob, fileName: `${cleanBase}.webp` });
            } else {
              // Fallback to compressed JPEG
              canvas.toBlob((jpgBlob) => {
                if (jpgBlob) {
                  resolve({ blob: jpgBlob, fileName: `${cleanBase}.jpg` });
                } else {
                  resolve({ blob: file, fileName: file.name });
                }
              }, 'image/jpeg', quality);
            }
          }, 'image/webp', quality);
          return;
        }
        resolve({ blob: file, fileName: file.name });
      };
      img.onerror = () => resolve({ blob: file, fileName: file.name });
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve({ blob: file, fileName: file?.name || 'upload.jpg' });
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to determine current active user ID / username from client state/storage/URL
 */
export function getActiveUsername(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    // 1. Check pathname (e.g., /editor/port-1788074502223 or /p/karthik)
    const pathname = window.location.pathname;
    const portfolioMatch = pathname.match(/\/editor\/([a-zA-Z0-9_-]+)/);
    
    // 2. Check localStorage for Supabase / CampusCV session user
    const storedUser = localStorage.getItem('currentUser') || localStorage.getItem('campuscv_current_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const name = parsed.username || parsed.id || parsed.slug || parsed.email?.split('@')[0];
        if (name) return name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      } catch {}
    }

    // 3. Check Supabase auth token
    const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (sbKey) {
      try {
        const sbData = JSON.parse(localStorage.getItem(sbKey) || '{}');
        const userEmail = sbData?.user?.email;
        const userUid = sbData?.user?.id;
        const u = userEmail ? userEmail.split('@')[0] : userUid;
        if (u) return u.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      } catch {}
    }

    // 4. Check query params or active portfolio
    const urlParams = new URLSearchParams(window.location.search);
    const queryUser = urlParams.get('username') || urlParams.get('user') || urlParams.get('userId');
    if (queryUser) return queryUser.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    if (portfolioMatch && portfolioMatch[1]) {
      return portfolioMatch[1].trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    }
  } catch (e) {}
  return 'guest';
}

/**
 * Upload file to server persistent asset storage (/api/assets/upload) in per-user VPS folder.
 * Automatically compresses raw images into lightweight WebP to save disk & database size!
 * If oldUrl is provided or replace=true, safely removes prior asset from VPS disk.
 */
export async function uploadImageFileServer(
  file: File, 
  options?: { username?: string; userId?: string; category?: string; oldUrl?: string; replace?: boolean }
): Promise<string> {
  if (!file) return '';
  try {
    const targetUser = options?.username || options?.userId || getActiveUsername();
    const targetCategory = options?.category || 'general';
    const oldUrl = options?.oldUrl || '';
    const replace = options?.replace === true;

    // Automatically compress image before sending over the wire
    const { blob, fileName } = await compressImageFileToBlob(file, 1400, 0.82);

    const formData = new FormData();
    formData.append('file', blob, fileName);
    formData.append('username', targetUser);
    formData.append('userId', targetUser);
    formData.append('category', targetCategory);
    if (oldUrl) formData.append('oldUrl', oldUrl);
    if (replace) formData.append('replace', 'true');

    const headers: Record<string, string> = {
      'x-username': targetUser,
      'x-user-id': targetUser,
      'x-category': targetCategory
    };
    if (oldUrl) headers['x-old-url'] = oldUrl;

    const res = await fetch('/api/assets/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      let err: any = {};
      try { err = JSON.parse(errText); } catch (e) {}
      throw new Error(err.error || `Upload failed with status ${res.status}`);
    }

    const text = await res.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch (e) {}

    if (data.url) {
      console.log(`[imageUploadStorage] VPS per-user compressed asset saved (${blob.size} bytes): ${data.url}`);
      return data.url;
    }
    return '';
  } catch (err) {
    console.error('[imageUploadStorage] Server asset upload failed:', err);
    throw err;
  }
}

/**
 * Explicitly delete an old asset from the VPS server disk.
 */
export async function deleteServerAsset(url: string, username?: string): Promise<boolean> {
  if (!url || typeof url !== 'string' || !url.includes('/uploads/users/')) return false;
  try {
    const targetUser = username || getActiveUsername();
    const res = await fetch(`/api/assets/upload?url=${encodeURIComponent(url)}&username=${encodeURIComponent(targetUser)}`, {
      method: 'DELETE'
    });
    const json = await res.json().catch(() => ({}));
    return !!json.success;
  } catch (err) {
    console.warn('[imageUploadStorage] Error deleting asset from VPS:', err);
    return false;
  }
}

/**
 * Compress an image file to a lightweight data URL (~30KB)
 */
export async function compressImageFile(file: File, maxDimension = 800, quality = 0.82): Promise<string> {
  const { blob } = await compressImageFileToBlob(file, maxDimension, quality);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });
}

/**
 * Process image file upload:
 * Instantly creates Blob URL, notifies preview callback, then resolves permanent server asset URL.
 * Automatically replaces & deletes the previous asset from VPS disk if oldUrl is supplied.
 */
export function handleImageUpload(
  file: File,
  onPreview: (blobUrl: string) => void,
  onComplete: (finalUrl: string) => void,
  options?: { username?: string; userId?: string; category?: string; oldUrl?: string; replace?: boolean }
): void {
  if (!file) return;

  // 1. Instant Blob URL for 0ms live canvas preview
  const blobUrl = URL.createObjectURL(file);
  onPreview(blobUrl);

  // 2. Upload file to server persistent per-user asset storage on VPS & remove old asset
  uploadImageFileServer(file, options)
    .then((permanentUrl) => {
      if (permanentUrl) {
        blobUrlCache.set(blobUrl, permanentUrl);
        onComplete(permanentUrl);
      } else {
        compressImageFile(file).then((dataUrl: string) => onComplete(dataUrl || blobUrl));
      }
    })
    .catch((err) => {
      console.warn('[imageUploadStorage] Server asset upload error, using compressed fallback:', err);
      compressImageFile(file).then((dataUrl: string) => onComplete(dataUrl || blobUrl));
    });
}

/**
 * Sanitize object payload by stripping giant raw Base64 data:image/ strings (>250KB)
 * before saving to localStorage, while keeping lightweight compressed images intact.
 */
export function sanitizeBase64FromPayload<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeBase64FromPayload) as any;
  }

  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && val.startsWith('data:image/')) {
      // If it's a huge uncompressed image (>250KB), replace with fallback. Lightweight images (<250KB) stay intact.
      if (val.length > 350000) {
        clean[key] = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      } else {
        clean[key] = val;
      }
    } else if (val && typeof val === 'object') {
      clean[key] = sanitizeBase64FromPayload(val);
    } else {
      clean[key] = val;
    }
  }
  return clean as T;
}

// IndexedDB asset storage helper
async function saveFileToIndexedDB(key: string, file: File): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('CampusCV_Assets_DB', 1);
      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets');
        }
      };
      req.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('assets', 'readwrite');
        tx.objectStore('assets').put(file, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
