import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      amount,
      userEmail,
    } = body;

    if (!razorpay_payment_id || !razorpay_signature || (!razorpay_order_id && !razorpay_subscription_id)) {
      return NextResponse.json(
        { error: 'Missing required Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { error: 'Razorpay Key Secret is not configured on server.' },
        { status: 500 }
      );
    }

    // Verify HMAC SHA256 signature
    const hmac = crypto.createHmac('sha256', key_secret);
    if (razorpay_subscription_id) {
      // Subscriptions signature payload: payment_id|subscription_id
      hmac.update(`${razorpay_payment_id}|${razorpay_subscription_id}`);
    } else {
      // Orders signature payload: order_id|payment_id
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    }
    const generatedSignature = hmac.digest('hex');

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      planId,
      amount,
      userEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_PAYMENT_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
