import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');

const DEFAULT_SERVER_PLANS = [
  {
    id: 'plan-test-5',
    duration: 30,
    name: '1 Month Trial',
    price: 30,
    storage: '500 MB',
    storageMB: 500,
    desc: '',
    features: [
      '1 Month Access',
      'Portfolio Website',
      '3 Templates',
      'QR Code & Custom URL',
    ],
    buttonText: 'START TRIAL FOR ₹ 30',
    isActive: true,
  },
  {
    id: 'plan-monthly',
    duration: 30,
    name: 'Monthly',
    price: 175,
    storage: '500 MB',
    storageMB: 500,
    desc: 'Perfect for getting started',
    features: [
      'Portfolio website',
      '3 Template selection',
      'QR code',
      'Mobile responsive',
      'Profile updates',
    ],
    buttonText: 'START FOR ₹ 175',
    isActive: true,
    razorpayPlanId: 'plan_TZ2SXEPIncd4pq',
  },
  {
    id: 'plan-quarterly',
    duration: 90,
    name: 'Quarterly',
    price: 450,
    storage: '1 GB',
    storageMB: 1024,
    desc: '90 Days Access',
    features: [
      'Everything in Monthly',
      'Personal URL',
      '6 Template selection',
      'Template switching',
    ],
    buttonText: 'CHOOSE QUARTERLY',
    isActive: true,
    razorpayPlanId: 'plan_TZ2TfhcN0WL6eE',
  },
  {
    id: 'plan-yearly',
    duration: 365,
    name: 'Yearly',
    price: 1200,
    storage: '2 GB',
    storageMB: 2048,
    desc: 'Best Value',
    subBadge: 'Just ₹100 per month',
    isPopular: true,
    features: [
      'Everything in Quarterly',
      '12 Template selection',
      'Unlimited updates',
    ],
    buttonText: 'GET YEARLY PLAN',
    isActive: true,
    razorpayPlanId: 'plan_TZ2Ui2Jy2k0Oa2',
  },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PLANS_FILE)) {
    fs.writeFileSync(PLANS_FILE, JSON.stringify(DEFAULT_SERVER_PLANS, null, 2), 'utf-8');
  }
}

function readPlans(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(PLANS_FILE, 'utf-8');
    const parsed = JSON.parse(content || '[]');
    return parsed && parsed.length > 0 ? parsed : DEFAULT_SERVER_PLANS;
  } catch (err) {
    console.error('[PLANS API] Error reading plans file:', err);
    return DEFAULT_SERVER_PLANS;
  }
}

function writePlans(plans: any[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(PLANS_FILE, JSON.stringify(plans, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PLANS API] Error writing plans file:', err);
  }
}

// GET /api/plans - List all plans
export async function GET() {
  try {
    const plans = readPlans();
    return NextResponse.json({ success: true, count: plans.length, plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve plans' }, { status: 500 });
  }
}

// POST /api/plans - Create or update a plan
export async function POST(req: NextRequest) {
  try {
    const plan = await req.json();
    if (!plan || !plan.id) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const plans = readPlans();
    const idx = plans.findIndex((p: any) => p.id === plan.id);
    if (idx !== -1) {
      plans[idx] = { ...plans[idx], ...plan };
    } else {
      plans.push(plan);
    }

    writePlans(plans);
    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save plan' }, { status: 500 });
  }
}

// DELETE /api/plans?id=xxx - Delete a plan
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Plan id is required' }, { status: 400 });
    }

    const plans = readPlans();
    const filtered = plans.filter((p: any) => p.id !== id);
    writePlans(filtered);
    return NextResponse.json({ success: true, count: filtered.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete plan' }, { status: 500 });
  }
}
