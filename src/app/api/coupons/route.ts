import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { couponDb, DbCoupon } from '@/lib/db';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function writeJsonBackup(coupons: DbCoupon[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[COUPONS API] Warning writing backup coupons file:', err);
  }
}

function getMergedCoupons(): DbCoupon[] {
  let dbCoupons = couponDb.getAllCoupons();

  // If DB is empty, try reading from backup JSON file
  if (dbCoupons.length === 0) {
    try {
      if (fs.existsSync(COUPONS_FILE)) {
        const fileContent = fs.readFileSync(COUPONS_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((c: any) => {
            if (c.code) couponDb.upsertCoupon(c);
          });
          dbCoupons = couponDb.getAllCoupons();
        }
      }
    } catch (e) {
      console.warn('[COUPONS API] Error reading backup coupons file:', e);
    }
  } else {
    // Keep backup file synchronized with SQLite
    writeJsonBackup(dbCoupons);
  }

  return dbCoupons;
}

// GET /api/coupons - List all active coupons, or validate a specific coupon code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codeToValidate = searchParams.get('validate')?.trim().toUpperCase();
    const planId = searchParams.get('planId') || undefined;

    const coupons = getMergedCoupons();

    if (codeToValidate) {
      const now = new Date().toISOString();
      const matched = coupons.find((c) => (c.code || '').trim().toUpperCase() === codeToValidate);

      if (!matched) {
        return NextResponse.json({
          success: true,
          valid: false,
          reason: 'not_found',
          message: 'Invalid coupon code'
        }, { status: 200 });
      }

      if (!matched.isActive) {
        return NextResponse.json({
          success: true,
          valid: false,
          reason: 'inactive',
          message: 'This coupon code is currently disabled'
        }, { status: 200 });
      }

      if (matched.expiresAt && new Date(matched.expiresAt).getTime() < Date.now()) {
        return NextResponse.json({
          success: true,
          valid: false,
          reason: 'expired',
          message: 'This coupon code has expired'
        }, { status: 200 });
      }

      if (matched.maxUses !== -1 && (matched.usedCount || 0) >= matched.maxUses) {
        return NextResponse.json({
          success: true,
          valid: false,
          reason: 'limit_reached',
          message: 'This coupon has reached its maximum redemption limit'
        }, { status: 200 });
      }

      if (planId && matched.applicablePlanIds && matched.applicablePlanIds.length > 0 && !matched.applicablePlanIds.includes(planId)) {
        return NextResponse.json({
          success: true,
          valid: false,
          reason: 'inapplicable_plan',
          message: 'This coupon is not valid for the selected plan',
          coupon: matched
        }, { status: 200 });
      }

      return NextResponse.json({
        success: true,
        valid: true,
        coupon: matched,
        message: 'Coupon code applied successfully!'
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, count: coupons.length, coupons });
  } catch (error: any) {
    console.error('[COUPONS GET API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve coupons' }, { status: 500 });
  }
}

// POST /api/coupons - Create, update, or redeem a coupon
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    // Handle atomic redemption
    if (body.action === 'redeem') {
      const target = body.code || body.id;
      if (!target) {
        return NextResponse.json({ error: 'Coupon code or id is required to redeem' }, { status: 400 });
      }
      const redeemRes = couponDb.redeemCoupon(target);
      const all = couponDb.getAllCoupons();
      writeJsonBackup(all);
      return NextResponse.json(redeemRes);
    }

    if (!body.code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const cleanCode = body.code.trim().toUpperCase();
    const couponId = body.id || `cpn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const savedCoupon = couponDb.upsertCoupon({
      id: couponId,
      code: cleanCode,
      discountType: body.discountType || 'percent',
      discountValue: Number(body.discountValue) || 0,
      discountPercent: body.discountType === 'fixed' ? undefined : (Number(body.discountPercent) || Number(body.discountValue) || 0),
      maxUses: body.maxUses !== undefined ? Number(body.maxUses) : -1,
      usedCount: Number(body.usedCount) || 0,
      expiresAt: body.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      applicablePlanIds: Array.isArray(body.applicablePlanIds) ? body.applicablePlanIds : [],
      createdAt: body.createdAt || new Date().toISOString(),
    });

    const all = couponDb.getAllCoupons();
    writeJsonBackup(all);

    console.log(`[COUPON PERSISTED SERVER] code="${cleanCode}" discount=${savedCoupon.discountValue}% (${savedCoupon.discountType}) plans=${JSON.stringify(savedCoupon.applicablePlanIds)}`);

    return NextResponse.json({ success: true, coupon: savedCoupon, count: all.length });
  } catch (error: any) {
    console.error('[COUPONS POST API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save coupon' }, { status: 500 });
  }
}

// DELETE /api/coupons?id=xxx - Delete a coupon
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!id && !code) {
      return NextResponse.json({ error: 'Coupon id or code is required' }, { status: 400 });
    }

    if (id) couponDb.deleteCoupon(id);
    if (code) couponDb.deleteCoupon(code);

    const remaining = couponDb.getAllCoupons();
    writeJsonBackup(remaining);

    return NextResponse.json({ success: true, count: remaining.length, coupons: remaining });
  } catch (error: any) {
    console.error('[COUPONS DELETE API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}

