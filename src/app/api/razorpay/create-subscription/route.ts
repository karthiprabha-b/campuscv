import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpayPlanId, planId, planName, userEmail } = body;

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured on server.' },
        { status: 500 }
      );
    }

    if (!razorpayPlanId) {
      return NextResponse.json(
        { error: 'Razorpay recurring plan ID is required.' },
        { status: 400 }
      );
    }

    // Razorpay Subscriptions API payload
    const payload = {
      plan_id: razorpayPlanId,
      total_count: 60, // 60 cycles (5 years)
      quantity: 1,
      customer_notify: 1,
      notes: {
        planId: planId || 'custom',
        planName: planName || 'Recurring Subscription',
        userEmail: userEmail || 'unknown',
      },
    };

    const authHeader = 'Basic ' + Buffer.from(`${key_id}:${key_secret}`).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.id) {
      console.error('[RAZORPAY_CREATE_SUBSCRIPTION_API_ERROR]', data);
      return NextResponse.json(
        {
          error: data?.error?.description || 'Failed to create Razorpay recurring subscription',
          details: data?.error,
        },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({
      subscriptionId: data.id,
      planId: razorpayPlanId,
      status: data.status,
      shortUrl: data.short_url,
      keyId: key_id,
    });
  } catch (error: any) {
    console.error('[RAZORPAY_CREATE_SUBSCRIPTION_INTERNAL_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while initiating recurring subscription.' },
      { status: 500 }
    );
  }
}
