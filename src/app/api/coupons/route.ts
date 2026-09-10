import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(COUPONS_FILE)) {
    fs.writeFileSync(COUPONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readCoupons(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(COUPONS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('[COUPONS API] Error reading coupons file:', err);
    return [];
  }
}

function writeCoupons(coupons: any[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2), 'utf-8');
  } catch (err) {
    console.error('[COUPONS API] Error writing coupons file:', err);
  }
}

// GET /api/coupons - List all active coupons, or validate a specific coupon code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codeToValidate = searchParams.get('validate')?.trim().toUpperCase();
    const planId = searchParams.get('planId') || undefined;

    const coupons = readCoupons();

    if (codeToValidate) {
      const now = new Date().toISOString();
      const matched = coupons.find((c: any) =>
        (c.code || '').trim().toUpperCase() === codeToValidate &&
        c.isActive &&
        (!c.expiresAt || c.expiresAt > now) &&
        (c.maxUses === -1 || (c.usedCount || 0) < c.maxUses) &&
        (!c.applicablePlanIds || c.applicablePlanIds.length === 0 || !planId || c.applicablePlanIds.includes(planId))
      );

      if (matched) {
        return NextResponse.json({ success: true, valid: true, coupon: matched });
      } else {
        return NextResponse.json({ success: true, valid: false, message: 'Invalid, expired, or inapplicable coupon code' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, count: coupons.length, coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve coupons' }, { status: 500 });
  }
}

// POST /api/coupons - Create or update a coupon
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupons = readCoupons();
    const cleanCode = body.code.trim().toUpperCase();
    const couponId = body.id || `cpn-${Date.now()}`;

    const newCoupon = {
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
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = coupons.findIndex((c: any) => 
      c.id === newCoupon.id || (c.code || '').trim().toUpperCase() === cleanCode
    );

    if (existingIndex !== -1) {
      coupons[existingIndex] = { ...coupons[existingIndex], ...newCoupon };
    } else {
      coupons.unshift(newCoupon);
    }

    writeCoupons(coupons);
    console.log(`[COUPON PERSISTED SERVER] code="${cleanCode}" discount=${newCoupon.discountValue}% plans=${JSON.stringify(newCoupon.applicablePlanIds)}`);

    return NextResponse.json({ success: true, coupon: newCoupon, count: coupons.length });
  } catch (error: any) {
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

    const coupons = readCoupons();
    const filtered = coupons.filter((c: any) => {
      if (id && c.id === id) return false;
      if (code && (c.code || '').trim().toUpperCase() === code) return false;
      return true;
    });

    writeCoupons(filtered);
    return NextResponse.json({ success: true, count: filtered.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}
