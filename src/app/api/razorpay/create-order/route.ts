import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, planId, planName, userEmail } = body;

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API credentials are not configured on server.' },
        { status: 500 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payment amount specified.' },
        { status: 400 }
      );
    }

    // Razorpay requires amount in smallest currency sub-unit (paise for INR, so ₹5 = 500 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const payload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        planId: planId || 'custom',
        planName: planName || 'Subscription',
        userEmail: userEmail || 'unknown',
      },
    };

    // Use native standard fetch with Basic Auth for zero external dependencies
    const authHeader = 'Basic ' + Buffer.from(`${key_id}:${key_secret}`).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.id) {
      console.error('[RAZORPAY_CREATE_ORDER_API_ERROR]', data);
      return NextResponse.json(
        {
          error: data?.error?.description || 'Failed to create Razorpay order',
          details: data?.error,
        },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: key_id,
      receipt: data.receipt,
    });
  } catch (error: any) {
    console.error('[RAZORPAY_CREATE_ORDER_ERROR]', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to create Razorpay order',
      },
      { status: 500 }
    );
  }
}
