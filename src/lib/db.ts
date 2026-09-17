import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'portfolio.db');

let db: Database.Database;

if (process.env.NODE_ENV === 'production') {
  db = new Database(dbPath);
} else {
  if (!(global as any)._sqliteDb) {
    (global as any)._sqliteDb = new Database(dbPath);
  }
  db = (global as any)._sqliteDb;
}

// Initialize SQLite schema
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    data TEXT,
    published INTEGER DEFAULT 0,
    createdAt INTEGER,
    updatedAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS custom_domains (
    id TEXT PRIMARY KEY,
    portfolio_id TEXT NOT NULL,
    user_id TEXT,
    domain TEXT NOT NULL,
    normalized_domain TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    verification_token TEXT,
    verified_at TEXT,
    ssl_status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT,
    updated_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_cd_normalized ON custom_domains(normalized_domain);
  CREATE INDEX IF NOT EXISTS idx_cd_portfolio ON custom_domains(portfolio_id);

  CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'percent',
    discount_value REAL NOT NULL DEFAULT 0,
    discount_percent REAL,
    max_uses INTEGER NOT NULL DEFAULT -1,
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    applicable_plan_ids TEXT DEFAULT '[]',
    created_at TEXT,
    updated_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
`);

export interface DbCoupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountPercent?: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  applicablePlanIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

function mapRowToCoupon(row: any): DbCoupon {
  let plans: string[] = [];
  try {
    plans = row.applicable_plan_ids ? JSON.parse(row.applicable_plan_ids) : [];
  } catch {
    plans = [];
  }
  return {
    id: row.id,
    code: (row.code || '').toUpperCase().trim(),
    discountType: row.discount_type === 'fixed' ? 'fixed' : 'percent',
    discountValue: Number(row.discount_value) || 0,
    discountPercent: row.discount_type === 'fixed' ? undefined : (Number(row.discount_percent) || Number(row.discount_value) || 0),
    maxUses: Number(row.max_uses) ?? -1,
    usedCount: Number(row.used_count) || 0,
    expiresAt: row.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: Boolean(row.is_active),
    applicablePlanIds: Array.isArray(plans) ? plans : [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export const couponDb = {
  getAllCoupons: (): DbCoupon[] => {
    try {
      const stmt = db.prepare(`SELECT * FROM coupons ORDER BY datetime(created_at) DESC, rowid DESC`);
      const rows = stmt.all();
      return rows.map(mapRowToCoupon);
    } catch (err) {
      console.error('[COUPON_DB] Error getting all coupons:', err);
      return [];
    }
  },

  getCouponByCode: (code: string): DbCoupon | null => {
    if (!code) return null;
    try {
      const clean = code.trim().toUpperCase();
      const stmt = db.prepare(`SELECT * FROM coupons WHERE UPPER(TRIM(code)) = UPPER(TRIM(?)) LIMIT 1`);
      const row = stmt.get(clean);
      return row ? mapRowToCoupon(row) : null;
    } catch (err) {
      console.error('[COUPON_DB] Error getting coupon by code:', err);
      return null;
    }
  },

  getCouponById: (id: string): DbCoupon | null => {
    if (!id) return null;
    try {
      const stmt = db.prepare(`SELECT * FROM coupons WHERE id = ? LIMIT 1`);
      const row = stmt.get(id);
      return row ? mapRowToCoupon(row) : null;
    } catch (err) {
      console.error('[COUPON_DB] Error getting coupon by id:', err);
      return null;
    }
  },

  upsertCoupon: (coupon: Partial<DbCoupon> & { code: string }): DbCoupon => {
    const cleanCode = coupon.code.trim().toUpperCase();
    const existing = couponDb.getCouponByCode(cleanCode) || (coupon.id ? couponDb.getCouponById(coupon.id) : null);
    const id = coupon.id || existing?.id || `cpn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const discountType = coupon.discountType || existing?.discountType || 'percent';
    const discountValue = Number(coupon.discountValue !== undefined ? coupon.discountValue : (existing?.discountValue ?? 0));
    const discountPercent = discountType === 'fixed' ? null : Number(coupon.discountPercent ?? coupon.discountValue ?? existing?.discountPercent ?? 0);
    const maxUses = Number(coupon.maxUses !== undefined ? coupon.maxUses : (existing?.maxUses ?? -1));
    const usedCount = Number(coupon.usedCount !== undefined ? coupon.usedCount : (existing?.usedCount ?? 0));
    const expiresAt = coupon.expiresAt || existing?.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const isActive = coupon.isActive !== undefined ? (coupon.isActive ? 1 : 0) : (existing ? (existing.isActive ? 1 : 0) : 1);
    const applicablePlans = Array.isArray(coupon.applicablePlanIds) ? JSON.stringify(coupon.applicablePlanIds) : (existing ? JSON.stringify(existing.applicablePlanIds) : '[]');
    const now = new Date().toISOString();
    const createdAt = coupon.createdAt || existing?.createdAt || now;
    const updatedAt = now;

    const stmt = db.prepare(`
      INSERT INTO coupons (id, code, discount_type, discount_value, discount_percent, max_uses, used_count, expires_at, is_active, applicable_plan_ids, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        discount_type = excluded.discount_type,
        discount_value = excluded.discount_value,
        discount_percent = excluded.discount_percent,
        max_uses = excluded.max_uses,
        used_count = excluded.used_count,
        expires_at = excluded.expires_at,
        is_active = excluded.is_active,
        applicable_plan_ids = excluded.applicable_plan_ids,
        updated_at = excluded.updated_at
    `);

    stmt.run(id, cleanCode, discountType, discountValue, discountPercent, maxUses, usedCount, expiresAt, isActive, applicablePlans, createdAt, updatedAt);
    return couponDb.getCouponByCode(cleanCode)!;
  },

  redeemCoupon: (codeOrId: string): { success: boolean; message: string; coupon?: DbCoupon } => {
    if (!codeOrId) return { success: false, message: 'Coupon code or ID is required' };
    try {
      const clean = codeOrId.trim().toUpperCase();
      const existing = couponDb.getCouponByCode(clean) || couponDb.getCouponById(codeOrId);
      if (!existing) {
        return { success: false, message: 'Coupon code not found' };
      }
      if (!existing.isActive) {
        return { success: false, message: 'This coupon is no longer active' };
      }
      if (existing.expiresAt && new Date(existing.expiresAt).getTime() < Date.now()) {
        return { success: false, message: 'This coupon has expired' };
      }
      if (existing.maxUses !== -1 && existing.usedCount >= existing.maxUses) {
        return { success: false, message: 'This coupon has reached its maximum redemption limit' };
      }

      const stmt = db.prepare(`
        UPDATE coupons 
        SET used_count = used_count + 1, updated_at = ? 
        WHERE (id = ? OR UPPER(TRIM(code)) = UPPER(TRIM(?))) AND (max_uses = -1 OR used_count < max_uses)
      `);
      const res = stmt.run(new Date().toISOString(), existing.id, existing.code);
      if (res.changes > 0) {
        const updated = couponDb.getCouponById(existing.id);
        return { success: true, message: 'Coupon redeemed successfully', coupon: updated || undefined };
      } else {
        return { success: false, message: 'Coupon usage limit reached during redemption' };
      }
    } catch (err: any) {
      console.error('[COUPON_DB] Error redeeming coupon:', err);
      return { success: false, message: err.message || 'Failed to redeem coupon' };
    }
  },

  deleteCoupon: (idOrCode: string): boolean => {
    if (!idOrCode) return false;
    try {
      const clean = idOrCode.trim();
      const stmt = db.prepare(`DELETE FROM coupons WHERE id = ? OR UPPER(TRIM(code)) = UPPER(TRIM(?))`);
      const res = stmt.run(clean, clean);
      return res.changes > 0;
    } catch (err) {
      console.error('[COUPON_DB] Error deleting coupon:', err);
      return false;
    }
  }
};

export { db };
