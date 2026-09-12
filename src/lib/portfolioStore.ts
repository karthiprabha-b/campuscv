'use server';

import { db } from './db';
import { initialPortfolios, mockAuth } from '../utils/mockDb';
import { loadRegistryServer } from './serverTemplateStore';
import { supabaseDb } from './supabase/dbService';
import { supabase } from './supabase/client';
import { normalizeUsername } from '../utils/urlHelper';

// ─────────────────────────────────────────────────────────────────────────────
// Single Source of Truth — Portfolio Store (SQLite)
//
// ARCHITECTURE:
//   loadPortfolio          → Read raw JSON from SQLite by ID/username. Return as-is.
//   savePortfolio          → Write raw JSON to SQLite draft row. No merging.
//   publishPortfolio       → Save draft to SQLite → Write published row to SQLite.
//   loadPublishedPortfolio → Read published row from SQLite by username.
// ─────────────────────────────────────────────────────────────────────────────

export async function loadPortfolio(idOrUsername: string): Promise<any | null> {
  try {
    if (!idOrUsername) return null;

    // 1. Try loading from Supabase as source of truth
    try {
      const suPort = await supabaseDb.loadPortfolio(idOrUsername);
      if (suPort) {
        return suPort;
      }
      const suPub = await supabaseDb.loadPublishedPortfolio(idOrUsername);
      if (suPub) {
        return suPub;
      }
    } catch (e) {
      console.warn('[Supabase loadPortfolio failed, trying SQLite fallback]', e);
    }

    // 2. Try exact ID match on draft row (published = 0) in SQLite
    let row = db.prepare('SELECT * FROM portfolios WHERE id = ? AND published = 0').get(idOrUsername) as any;

    if (!row) {
      // 3. Try exact ID match on any row
      row = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(idOrUsername) as any;
    }

    if (!row) {
      // 4. Try username match on draft rows
      row = db.prepare('SELECT * FROM portfolios WHERE LOWER(username) = ? AND published = 0')
        .get(idOrUsername.toLowerCase()) as any;
    }

    if (!row) {
      // 5. Try username match on published rows and load its corresponding draft
      const pubRow = db.prepare('SELECT * FROM portfolios WHERE LOWER(username) = ? AND published = 1')
        .get(idOrUsername.toLowerCase()) as any;
      if (pubRow) {
        try {
          const pubData = JSON.parse(pubRow.data);
          const draftId = pubData.originalDraftId || pubData.id.replace(/-published$/, '');
          row = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(draftId) as any;
        } catch { }
        if (!row) row = pubRow;
      }
    }

    if (row) {
      const parsed = JSON.parse(row.data);

      console.log('[CV DEBUG][DRAFT RAW PARSED JSON]', {
        stage: 'DATABASE / API RESPONSE (loadPortfolio RAW)',
        portfolioId: parsed.id,
        username: parsed.username,
        topLevelKeys: Object.keys(parsed || {}),
        profileKeys: Object.keys(parsed?.profile || {}),
        personalKeys: Object.keys(parsed?.personal || {}),
        canonicalPersonalKeys: Object.keys(parsed?.canonicalProfile?.personal || {}),
        mediaKeys: Object.keys(parsed?.media || {}),
        userKeys: Object.keys(parsed?.user || {}),
        imageCandidates: {
          profileImage: parsed?.profileImage,
          profile_image: parsed?.profile_image,
          avatar: parsed?.avatar,
          avatarUrl: parsed?.avatarUrl,
          avatar_url: parsed?.avatar_url,
          photo: parsed?.photo,
          photoUrl: parsed?.photoUrl,
          photo_url: parsed?.photo_url,
          image: parsed?.image,
          imageUrl: parsed?.imageUrl,
          image_url: parsed?.image_url,
          profilePhoto: parsed?.profilePhoto,
          personalProfilePhoto: parsed?.personal?.profilePhoto,
          canonicalPersonalProfilePhoto: parsed?.canonicalProfile?.personal?.profilePhoto,
          aboutAvatarUrl: parsed?.about?.avatarUrl,
          heroAvatarUrl: parsed?.hero?.avatarUrl,
          portrait: parsed?.portrait,
          portraitUrl: parsed?.portraitUrl
        },
        projectsCandidateCount: Array.isArray(parsed?.projects) ? parsed.projects.length : (parsed?.projects === undefined ? 'undefined' : 'not-array'),
        dataProjectsCount: Array.isArray(parsed?.data?.projects) ? parsed.data.projects.length : (parsed?.data?.projects === undefined ? 'undefined' : 'not-array'),
        contentProjectsCount: Array.isArray(parsed?.content?.projects) ? parsed.content.projects.length : (parsed?.content?.projects === undefined ? 'undefined' : 'not-array'),
        skillsCount: Array.isArray(parsed?.skills) ? parsed.skills.length : undefined
      });

      if (!parsed.templateVersionId) {
        const registry = loadRegistryServer();
        const regTmpl = registry[parsed.templateId || parsed.layoutStyle];
        if (regTmpl && regTmpl.currentVersionId) {
          parsed.templateVersionId = regTmpl.currentVersionId;
        }
      }

      // Auto-populate top-level collection arrays from canonicalProfile or latest user profile
      let cp = parsed.canonicalProfile && typeof parsed.canonicalProfile === 'object' && Object.keys(parsed.canonicalProfile).length > 0 ? parsed.canonicalProfile : null;
      if (!cp || !Array.isArray(cp.skills) || cp.skills.length === 0) {
        try {
          const profileRow = db.prepare("SELECT data FROM portfolios WHERE published = -1 ORDER BY updatedAt DESC LIMIT 1").get() as any;
          if (profileRow) {
            const prof = JSON.parse(profileRow.data);
            cp = prof.canonicalProfile || prof;
            parsed.canonicalProfile = cp;
          }
        } catch (e) {}
      }

      if (cp) {
        const isDemoSkillList = (arr: any[]) => {
          if (!Array.isArray(arr) || arr.length === 0) return true;
          const demoKeywords = ['react / next.js', 'typescript', 'html5 & css3', 'tailwind css', 'node.js & express', 'sql & mongodb', 'rest apis'];
          let flat: string[] = [];
          arr.forEach(item => {
            if (typeof item === 'string') flat.push(item.toLowerCase());
            else if (item && typeof item === 'object') {
              if (Array.isArray(item.items)) item.items.forEach((it: any) => flat.push((it.name || it || '').toLowerCase()));
              else flat.push((item.name || item.title || item.skill || '').toLowerCase());
            }
          });
          if (flat.length === 0) return true;
          return flat.every(s => demoKeywords.some(d => s.includes(d) || d.includes(s)));
        };

        if ((!parsed.experience || !Array.isArray(parsed.experience) || parsed.experience.length === 0) && Array.isArray(cp.experience) && cp.experience.length > 0) {
          parsed.experience = cp.experience;
        }
        if ((!parsed.education || !Array.isArray(parsed.education) || parsed.education.length === 0) && Array.isArray(cp.education) && cp.education.length > 0) {
          parsed.education = cp.education;
        }
        if ((!parsed.projects || !Array.isArray(parsed.projects) || parsed.projects.length === 0) && Array.isArray(cp.projects) && cp.projects.length > 0) {
          parsed.projects = cp.projects;
        }
        if ((!parsed.skills || !Array.isArray(parsed.skills) || parsed.skills.length === 0 || isDemoSkillList(parsed.skills)) && Array.isArray(cp.skills) && cp.skills.length > 0 && !isDemoSkillList(cp.skills)) {
          parsed.skills = cp.skills;
        }
        if ((!parsed.certifications || !Array.isArray(parsed.certifications) || parsed.certifications.length === 0) && Array.isArray(cp.certifications) && cp.certifications.length > 0) {
          parsed.certifications = cp.certifications;
        }
        if (!parsed.name && cp.personal?.fullName) parsed.name = cp.personal.fullName;
        if (!parsed.tagline && cp.personal?.headline) parsed.tagline = cp.personal.headline;
        if (!parsed.headline && cp.personal?.headline) parsed.headline = cp.personal.headline;
        if (!parsed.aboutMe && cp.personal?.summary) parsed.aboutMe = cp.personal.summary;
        if (!parsed.profileImage && cp.personal?.profilePhoto) parsed.profileImage = cp.personal.profilePhoto;
        if (!parsed.email && cp.personal?.email) parsed.email = cp.personal.email;
        if (!parsed.phone && cp.personal?.phone) parsed.phone = cp.personal.phone;
        const loc = [cp.personal?.city, cp.personal?.state, cp.personal?.country].filter(Boolean).join(', ');
        if (!parsed.location && loc) parsed.location = loc;
      }

      // Ensure projects array is ALWAYS an Array, never undefined
      parsed.projects = Array.isArray(parsed.projects)
        ? parsed.projects
        : (Array.isArray(parsed.data?.projects)
          ? parsed.data.projects
          : (Array.isArray(parsed.content?.projects)
            ? parsed.content.projects
            : (Array.isArray(parsed.resume?.projects)
              ? parsed.resume.projects
              : (Array.isArray(parsed.canonicalProfile?.projects)
                ? parsed.canonicalProfile.projects
                : []))));

      // Normalize top-level profileImage field
      const resolvedProfileImg =
        parsed.profileImage ||
        parsed.avatarUrl ||
        parsed.personal?.profilePhoto ||
        parsed.canonicalProfile?.personal?.profilePhoto ||
        parsed.profile?.profileImage ||
        parsed.about?.avatarUrl ||
        parsed.images?.profileImage ||
        '';
      if (resolvedProfileImg) {
        parsed.profileImage = resolvedProfileImg;
      }

      console.log('[CV DEBUG][STAGE A: DB LOAD]', {
        stage: 'DATABASE / API RESPONSE (loadPortfolio)',
        portfolioId: parsed.id,
        templateId: parsed.templateId,
        mode: parsed.renderMode || 'draft',
        name: parsed.name || parsed.personal?.fullName,
        profileImage: parsed.profileImage,
        email: parsed.email || parsed.personal?.email,
        linkedin: parsed.socials?.linkedin || parsed.socialLinks?.linkedin || parsed.canonicalProfile?.social?.linkedin,
        experienceCount: Array.isArray(parsed.experience) ? parsed.experience.length : undefined,
        educationCount: Array.isArray(parsed.education) ? parsed.education.length : undefined,
        projectsCount: Array.isArray(parsed.projects) ? parsed.projects.length : (parsed.projects === undefined ? 'undefined' : 0),
        timestamp: new Date().toISOString()
      });

      console.log(`[CampusCV Editor] portfolio.id: "${parsed.id}"`);
      console.log(`[CampusCV Editor] Requested template ID: "${parsed.templateId}"`);
      console.log(`[CampusCV Editor] Resolved template package: "${parsed.templateId}"`);
      return parsed;
    }

    // 4. Auto-seed if it's one of the initial portfolios (first time only)
    const initial = initialPortfolios.find(
      p => p.id === idOrUsername || (p.username && p.username.toLowerCase() === idOrUsername.toLowerCase())
    );
    if (initial) {
      const now = Date.now();
      const seedData = { ...initial, lastSaved: now, _lastUpdated: now };
      const dataStr = JSON.stringify(seedData);

      db.prepare(`
        INSERT INTO portfolios (id, username, data, published, createdAt, updatedAt)
        VALUES (?, NULL, ?, 0, ?, ?)
      `).run(seedData.id, dataStr, now, now);

      db.prepare(`
        INSERT OR REPLACE INTO portfolios (id, username, data, published, createdAt, updatedAt)
        VALUES (?, ?, ?, 1, ?, ?)
      `).run(`${seedData.id}-published`, seedData.username || null, dataStr, now, now);

      console.log(`[LOAD INITIAL SEED] portfolio.id: "${seedData.id}" | templateId: "${seedData.templateId}"`);
      return seedData;
    }

    // 5. Dynamic Auto-Seed for new portfolio IDs (prevents 404 for unseeded portfolio IDs)
    const now = Date.now();
    const registry = loadRegistryServer();
    const activeList = Object.values(registry).filter(t => (t.status || 'active') === 'active');
    const firstActiveTmpl = activeList[0]?.id || Object.keys(registry)[0] || '';
    const regTmpl = firstActiveTmpl ? registry[firstActiveTmpl] : undefined;

    const newPortfolio: any = {
      id: idOrUsername,
      title: 'Portfolio',
      name: '',
      tagline: '',
      profileImage: '',
      projectThumbnail: '',
      themeColor: '#8b5cf6',
      fontPack: 'sans',
      isDarkMode: false,
      templateId: firstActiveTmpl,
      templateVersionId: regTmpl?.currentVersionId || 'v1',
      sections: ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
      published: false,
      seo: { title: 'Portfolio', description: '', keywords: '' },
      stats: [],
      skills: [],
      certifications: [],
      timeline: [],
      experience: [],
      education: [],
      projects: [],
      category: 'General',
      lastSaved: now,
      _lastUpdated: now
    };

    const dataStr = JSON.stringify(newPortfolio);
    db.prepare(`
      INSERT INTO portfolios (id, username, data, published, createdAt, updatedAt)
      VALUES (?, NULL, ?, 0, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data
    `).run(idOrUsername, dataStr, now, now);

    console.log(`[LOAD DYNAMIC SEED] Auto-created portfolio for ID: "${idOrUsername}"`);
    return newPortfolio;
  } catch (err) {
    console.error('[LOAD ERROR] loadPortfolio error for:', idOrUsername, err);
    throw err;
  }
}

/**
 * Loads the PUBLISHED version of a portfolio by username from Supabase & SQLite.
 */
export async function loadPublishedPortfolio(username: string): Promise<any | null> {
  try {
    if (!username) return null;
    const cleanUsername = normalizeUsername(username);
    const rawLower = username.toLowerCase().trim();
    const hyphenVariant = cleanUsername.replace(/_/g, '-');
    const underscoreVariant = cleanUsername.replace(/-/g, '_');

    // 1. Try loading from Supabase as authoritative source of truth
    try {
      const candidates = Array.from(new Set([cleanUsername, rawLower, hyphenVariant, underscoreVariant]));
      for (const cand of candidates) {
        const suPub = await supabaseDb.loadPublishedPortfolio(cand);
        if (suPub && (suPub.templateId || suPub.name || suPub.username)) {
          console.log(`[PUBLIC LOAD SUPABASE] found for candidate: "${cand}" | portfolio.id: "${suPub.id}" | templateId: "${suPub.templateId}"`);
          suPub.renderMode = 'published';
          suPub.mode = 'published';
          return suPub;
        }
      }
      for (const cand of candidates) {
        const suPort = await supabaseDb.loadPortfolio(cand);
        if (suPort && (suPort.published || suPort.status === 'published' || suPort.templateId)) {
          console.log(`[PUBLIC LOAD SUPABASE BY ID] id: "${cand}" | portfolio.id: "${suPort.id}" | templateId: "${suPort.templateId}"`);
          suPort.renderMode = 'published';
          suPort.mode = 'published';
          return suPort;
        }
      }
    } catch (e) {
      console.warn('[Supabase loadPublishedPortfolio failed, trying SQLite fallback]', e);
    }

    // 2. Try published row by username (published = 1) in SQLite across all variants
    let row: any = null;
    const queryCandidates = Array.from(new Set([cleanUsername, rawLower, hyphenVariant, underscoreVariant]));
    for (const cand of queryCandidates) {
      row = db.prepare('SELECT * FROM portfolios WHERE LOWER(username) = ? AND published = 1').get(cand) as any;
      if (row) break;
    }

    if (!row) {
      // 3. Try published row by ID `${cand}-published`
      for (const cand of queryCandidates) {
        row = db.prepare('SELECT * FROM portfolios WHERE (LOWER(id) = ? OR id = ?) AND published = 1')
          .get(`${cand}-published`, `${cand}-published`) as any;
        if (row) break;
      }
    }

    if (!row) {
      // 4. Try resolving draft row to find its corresponding published record
      for (const cand of queryCandidates) {
        const draftRow = db.prepare('SELECT * FROM portfolios WHERE LOWER(username) = ?').get(cand) as any;
        if (draftRow) {
          row = db.prepare('SELECT * FROM portfolios WHERE id = ? AND published = 1').get(`${draftRow.id}-published`) as any;
          if (row) break;
        }
      }
    }

    if (!row) {
      // 5. Direct ID match for published record only
      for (const cand of queryCandidates) {
        row = db.prepare('SELECT * FROM portfolios WHERE (LOWER(id) = ? OR id = ?) AND published = 1').get(cand, cand) as any;
        if (row) break;
      }
    }

    if (row) {
      // Strict verification: Ensure row is marked published
      if (row.published !== 1 && row.published !== true) {
        console.warn(`[PUBLIC LOAD BLOCKED] Record found for "${cleanUsername}" but published !== 1`);
        return null;
      }

      const parsed = JSON.parse(row.data);
      parsed.templateId = parsed.templateId || parsed.layoutStyle || parsed.template_id || '';
      parsed.layoutStyle = parsed.templateId || parsed.layoutStyle || '';

      if (!parsed.templateVersionId) {
        const registry = loadRegistryServer();
        const regTmpl = registry[parsed.templateId || parsed.layoutStyle];
        if (regTmpl && regTmpl.currentVersionId) {
          parsed.templateVersionId = regTmpl.currentVersionId;
        }
      }
      parsed.renderMode = 'published';
      parsed.mode = 'published';

      console.log(`[PUBLIC LOAD] username="${cleanUsername}" portfolioId="${parsed.id}" published=1 templateId="${parsed.templateId}" renderMode=published`);
      return parsed;
    }

    // 6. Fallback for initial seeded portfolios
    const initial = initialPortfolios.find(
      p => p.id === username || (p.username && p.username.toLowerCase() === username.toLowerCase())
    );
    if (initial) {
      return { ...initial, renderMode: 'published', mode: 'published' };
    }

    console.warn(`[PUBLIC LOAD FAILED] No published portfolio found for username: "${username}"`);
    return null;
  } catch (err) {
    console.error('[PUBLIC LOAD ERROR] loadPublishedPortfolio error for username:', username, err);
    throw err;
  }
}

/**
 * Saves the whole portfolio object to Supabase & SQLite.
 * Writes the exact object passed — preserves arbitrary unknown fields, templateId, and templateType.
 */
export async function savePortfolio(portfolio: any): Promise<any> {
  if (!portfolio?.id) throw new Error('savePortfolio: portfolio.id is required');

  const now = Date.now();
  let currentUid = portfolio.userId || portfolio.user_id;
  let currentEmail = portfolio.userEmail || portfolio.email;

  let localSubscriptionExpires: string | undefined = undefined;
  let localIsPro: boolean | undefined = undefined;

  if (!currentUid || !currentEmail) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        currentUid = currentUid || user.id;
        currentEmail = currentEmail || user.email;
        localSubscriptionExpires = (user.user_metadata as any)?.subscription_expires;
      }
    } catch { }
    if (!currentUid || !currentEmail) {
      const localUser = mockAuth.getCurrentUser();
      if (localUser) {
        currentUid = currentUid || (localUser as any)?.id || localUser.email;
        currentEmail = currentEmail || localUser.email;
        localSubscriptionExpires = localSubscriptionExpires || localUser.subscriptionExpires;
        localIsPro = localUser.isPro;
      }
    }
  } else {
    const localUser = mockAuth.getCurrentUser();
    if (localUser) {
      localSubscriptionExpires = localUser.subscriptionExpires;
      localIsPro = localUser.isPro;
    }
  }

  const cleanToSave = { ...portfolio };
  if (cleanToSave.templateId && cleanToSave.templateId !== 'custom') {
    delete cleanToSave.sectionFiles;
  }

  const savedPortfolio = {
    ...cleanToSave,
    userId: currentUid,
    user_id: currentUid,
    userEmail: currentEmail,
    subscriptionExpires: portfolio.subscriptionExpires || localSubscriptionExpires,
    isPro: portfolio.isPro !== undefined ? portfolio.isPro : localIsPro,
    lastSaved: now,
    _lastUpdated: now,
  };

  const dataStr = JSON.stringify(savedPortfolio);

  console.log(`[SAVE REQUEST] portfolio.id: "${portfolio.id}" | userId: "${currentUid}" | templateId: "${portfolio.templateId}" | username: "${portfolio.username || ''}"`);

  try {
    // 1. Save to local SQLite cache
    db.prepare(`
      INSERT INTO portfolios (id, username, data, published, createdAt, updatedAt)
      VALUES (?, NULL, ?, 0, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updatedAt = excluded.updatedAt
    `).run(portfolio.id, dataStr, now, now);

    // 2. Persist to Supabase as authoritative source
    await supabaseDb.savePortfolio(savedPortfolio).catch(err => {
      console.warn('[Supabase save warning]', err);
    });

    console.log(`[SAVE SUCCESS] portfolio.id: "${portfolio.id}" | updatedAt: ${now}`);

    return savedPortfolio;
  } catch (err) {
    console.error('[SAVE ERROR] savePortfolio failed for ID:', portfolio.id, err);
    throw err;
  }
}

/**
 * Autosave — calls savePortfolio.
 */
export async function autoSavePortfolio(portfolio: any): Promise<any> {
  return await savePortfolio(portfolio);
}

export async function publishPortfolio(input: any): Promise<any | null> {
  const id = typeof input === 'object' && input ? (input.id || input.portfolioId) : input;
  try {
    let draft: any = null;
    if (typeof input === 'object' && input && (input.templateId || input.name || input.username)) {
      draft = input;
    }

    if (!draft) {
      let draftRow = db.prepare('SELECT data FROM portfolios WHERE id = ? AND published = 0').get(id) as any;
      if (!draftRow) {
        draftRow = db.prepare('SELECT data FROM portfolios WHERE id = ?').get(id) as any;
      }

      if (draftRow) {
        draft = JSON.parse(draftRow.data);
      } else {
        draft = await supabaseDb.loadPortfolio(id);
      }
    }

    if (!draft) {
      console.error('[PUBLISH ERROR] Draft portfolio not found for ID:', id);
      throw new Error(`Draft portfolio not found for ID: ${id}`);
    }

    const now = Date.now();
    const localUser = mockAuth.getCurrentUser();

    const username = (draft.username || draft.subdomain || draft.slug || draft.id || `user-${now}`)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');

    const publishedId = `${id}-published`;
    const publishedData = {
      ...draft,
      id: publishedId,
      originalDraftId: id,
      username,
      slug: username,
      subscriptionExpires: draft.subscriptionExpires || localUser?.subscriptionExpires,
      isPro: draft.isPro !== undefined ? draft.isPro : localUser?.isPro,
      published: true,
      publishedAt: now,
      lastSaved: now,
      _lastUpdated: now,
    };

    // 1. Insert or update the published row in SQLite
    db.prepare(`
      INSERT INTO portfolios (id, username, data, published, createdAt, updatedAt)
      VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        data = excluded.data,
        published = 1,
        updatedAt = excluded.updatedAt
    `).run(publishedId, username, JSON.stringify(publishedData), now, now);

    // 2. Update the draft row in SQLite
    const updatedDraft = {
      ...draft,
      username,
      lastSaved: now,
      _lastUpdated: now,
      lastPublished: now,
    };
    db.prepare(`
      UPDATE portfolios 
      SET username = NULL, data = ?, published = 0, updatedAt = ?
      WHERE id = ?
    `).run(JSON.stringify(updatedDraft), now, id);

    // 3. Persist published record to Supabase
    await supabaseDb.savePortfolio(publishedData).catch(err => {
      console.warn('[Supabase async publish warning]', err);
    });
    await supabaseDb.publishPortfolio(publishedId).catch(() => { });
    await supabaseDb.publishPortfolio(id).catch(() => { });

    console.log(`[PUBLISH SUCCESS] portfolio.id: "${id}" | publishedId: "${publishedId}" | username: "${username}" | templateId: "${draft.templateId}"`);

    return publishedData;
  } catch (err) {
    console.error('[PUBLISH ERROR] publishPortfolio failed for ID:', id, err);
    throw err;
  }
}

export async function deletePortfolio(id: string): Promise<void> {
  try {
    db.prepare('DELETE FROM portfolios WHERE id = ?').run(id);
    db.prepare('DELETE FROM portfolios WHERE id = ?').run(`${id}-published`);
    await supabaseDb.deletePortfolio(id).catch(() => { });
    await supabaseDb.deletePortfolio(`${id}-published`).catch(() => { });
    console.log(`[DELETE SUCCESS] Deleted portfolio rows for ID: ${id}`);
  } catch (err) {
    console.error('deletePortfolio error:', id, err);
    throw err;
  }
}

export async function getPortfolios(targetUserId?: string): Promise<any[]> {
  try {
    let currentUid = targetUserId;
    let currentEmail = '';

    if (!currentUid) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          currentUid = user.id;
          currentEmail = (user.email || '').toLowerCase();
        }
      } catch { }
    }

    if (!currentUid) {
      const localUser = mockAuth.getCurrentUser();
      if (localUser) {
        currentUid = (localUser as any)?.id || localUser.email;
        currentEmail = (localUser.email || '').toLowerCase();
      }
    }

    // If no user is authenticated, return empty list
    if (!currentUid && !currentEmail) {
      return [];
    }

    // 1. Fetch from Supabase as authoritative source
    if (currentUid) {
      const supabaseList = await supabaseDb.getPortfolios(currentUid).catch(() => []);
      if (supabaseList && supabaseList.length > 0) {
        return supabaseList;
      }
    }

    // 2. Local fallback: scan SQLite rows matching user ID or email
    const rows = db.prepare("SELECT * FROM portfolios WHERE published = 0 AND id NOT LIKE 'profile-%'").all() as any[];
    const map = new Map<string, any>();
    for (const r of rows) {
      try {
        const parsed = JSON.parse(r.data);
        if (parsed?.id && !map.has(parsed.id)) {
          const ownerUid = parsed.userId || parsed.user_id;
          const ownerEmail = (parsed.userEmail || parsed.email || '').toLowerCase();

          if (
            (currentUid && ownerUid && ownerUid === currentUid) ||
            (currentEmail && ownerEmail && ownerEmail === currentEmail)
          ) {
            map.set(parsed.id, parsed);
          }
        }
      } catch { }
    }
    return Array.from(map.values());
  } catch (err) {
    console.error('getPortfolios error:', err);
    return [];
  }
}

export async function loadLocalTemplateFiles(templateId?: string): Promise<Record<string, string>> {
  const fs = require('fs');
  const path = require('path');
  const files: Record<string, string> = {};
  const registry = loadRegistryServer();
  const activeList = Object.values(registry).filter(t => (t.status || 'active') === 'active');
  const resolvedId = templateId || activeList[0]?.id || Object.keys(registry)[0];
  if (!resolvedId) return files;
  const baseDir = path.join(process.cwd(), 'data', 'templates', resolvedId);

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (['node_modules', '.git', '.next', 'dist'].includes(file)) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx|jsx|ts|js|json|css|html)$/i.test(file)) {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        files[relPath] = fs.readFileSync(fullPath, 'utf-8');
      }
    }
  }

  try {
    if (fs.existsSync(baseDir)) walk(baseDir);
  } catch (err) {
    console.error('loadLocalTemplateFiles error:', err);
  }
  return files;
}

export async function saveCanonicalProfile(profile: any): Promise<any> {
  if (!profile?.id) throw new Error('saveCanonicalProfile: profile.id is required');
  const now = Date.now();
  const savedProfile = { ...profile, updatedAt: now };

  // Store inside SQLite portfolios table under special profile row or portfolio object
  const dataStr = JSON.stringify({
    id: profile.id,
    canonicalProfile: savedProfile,
    personal: savedProfile.personal,
    education: savedProfile.education,
    experience: savedProfile.experience,
    projects: savedProfile.projects,
    skills: savedProfile.skills,
    certifications: savedProfile.certifications,
    socialLinks: savedProfile.social,
    _lastUpdated: now
  });

  try {
    db.prepare(`
      INSERT INTO portfolios (id, username, data, published, createdAt, updatedAt)
      VALUES (?, NULL, ?, -1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updatedAt = excluded.updatedAt
    `).run(`profile-${profile.id}`, dataStr, now, now);
    return savedProfile;
  } catch (err) {
    console.error('[SAVE PROFILE ERROR]', err);
    throw err;
  }
}

export async function loadCanonicalProfile(profileId: string): Promise<any | null> {
  try {
    const row = db.prepare('SELECT data FROM portfolios WHERE id = ?').get(`profile-${profileId}`) as any;
    if (row) {
      const parsed = JSON.parse(row.data);
      return parsed.canonicalProfile || parsed;
    }
    return null;
  } catch (err) {
    console.error('[LOAD PROFILE ERROR]', err);
    return null;
  }
}
