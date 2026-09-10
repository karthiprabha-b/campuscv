/**
 * templateStorage.ts — IndexedDB & Resilient Storage Engine for CampusCV Templates
 *
 * Prevents QuotaExceededError when storing large portfolio template ZIPs,
 * section files, and custom CSS. Uses IndexedDB as primary storage with
 * in-memory caching and safe fallback for localStorage.
 */

const DB_NAME = 'CampusCV_Templates_DB';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

// In-memory cache for fast synchronous access
const memoryTemplateCache: Map<string, any> = new Map();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const templateStorage = {
  // Save template into IndexedDB and Memory Cache (and optionally Server Disk if flagged)
  saveTemplateAsync: async (template: any, persistToDisk: boolean = false): Promise<void> => {
    if (!template || !template.id) return;
    memoryTemplateCache.set(template.id, template);

    // Persist template package files to server disk only when explicitly requested (e.g. custom template upload)
    if (persistToDisk && typeof window !== 'undefined') {
      const filesToSave = template.sectionFiles || template.files;
      if (filesToSave && typeof filesToSave === 'object') {
        try {
          fetch('/api/template-files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              templateId: template.id,
              files: filesToSave,
            }),
          }).catch((err) => console.error('[templateStorage] Failed to persist template files to server disk:', err));
        } catch (err) {}
      }
    }

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(template);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[templateStorage] IndexedDB save warning (using memory cache):', err);
    }
  },

  // Load template by ID from Memory Cache or IndexedDB
  getTemplateAsync: async (id: string): Promise<any | null> => {
    if (memoryTemplateCache.has(id)) {
      return memoryTemplateCache.get(id);
    }
    try {
      const db = await openDB();
      const template = await new Promise<any>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      if (template) {
        memoryTemplateCache.set(id, template);
      }
      return template;
    } catch (err) {
      console.warn('[templateStorage] IndexedDB read warning:', err);
      return memoryTemplateCache.get(id) || null;
    }
  },

  // Sync get from memory cache
  getTemplateSync: (id: string): any | null => {
    return memoryTemplateCache.get(id) || null;
  },

  // Cache template in memory synchronously
  cacheInMemory: (template: any): void => {
    if (template && template.id) {
      memoryTemplateCache.set(template.id, template);
    }
  },

  // Delete template from Memory Cache and IndexedDB
  deleteTemplate: (id: string): void => {
    if (!id) return;
    memoryTemplateCache.delete(id);
    if (typeof window !== 'undefined') {
      openDB().then(db => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.delete(id);
        } catch (e) {}
      }).catch(() => {});
    }
  },

  // Async delete template from Memory Cache and IndexedDB
  deleteTemplateAsync: async (id: string): Promise<void> => {
    if (!id) return;
    memoryTemplateCache.delete(id);
    if (typeof window !== 'undefined') {
      try {
        const db = await openDB();
        await new Promise<void>((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
        });
      } catch (e) {}
    }
  },

  // Safe localStorage setItem wrapper with quota auto-recovery
  safeSetLocalStorage: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err: any) {
      if (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014) {
        console.warn(`[templateStorage] localStorage quota exceeded for key "${key}". Auto-recovering space...`);
        try {
          // Clear non-critical heavy storage keys
          localStorage.removeItem('portly_custom_templates');
          localStorage.removeItem('campuscv_admin_logs');
          localStorage.setItem(key, value);
          return true;
        } catch {
          return false;
        }
      }
      console.error(`[templateStorage] localStorage error:`, err);
      return false;
    }
  }
};
