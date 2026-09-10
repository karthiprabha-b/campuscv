import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseDb } from '../../../../lib/supabase/dbService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('[RAZORPAY_WEBHOOK] Invalid webhook signature received');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    console.log('[RAZORPAY_WEBHOOK] Received event:', event?.event);

    const payload = event?.payload;

    if (event?.event === 'subscription.charged' || event?.event === 'payment.captured') {
      const paymentEntity = payload?.payment?.entity;
      const subscriptionEntity = payload?.subscription?.entity;

      const userEmail = paymentEntity?.notes?.userEmail || subscriptionEntity?.notes?.userEmail || paymentEntity?.email;
      const planId = paymentEntity?.notes?.planId || subscriptionEntity?.notes?.planId;
      const planName = paymentEntity?.notes?.planName || subscriptionEntity?.notes?.planName || 'Subscription Plan';
      const amount = (paymentEntity?.amount ? paymentEntity.amount / 100 : 0);

      // Determine duration days
      let durationDays = 30;
      if (planId === 'plan-yearly' || (amount >= 1000)) {
        durationDays = 365;
      } else if (planId === 'plan-quarterly' || (amount >= 400)) {
        durationDays = 90;
      }

      if (userEmail) {
        console.log(`[RAZORPAY_WEBHOOK] Auto-extending subscription for ${userEmail} by ${durationDays} days`);

        // Find user by email in Supabase profiles
        const allUsers = await supabaseDb.getAllUsers().catch(() => []);
        const targetUser = allUsers.find((u: any) => u.email?.toLowerCase() === userEmail?.toLowerCase());

        if (targetUser) {
          const now = Date.now();
          const existingExpiry = targetUser.subscriptionExpires ? new Date(targetUser.subscriptionExpires).getTime() : 0;
          const baseTime = existingExpiry > now ? existingExpiry : now;
          const newExpiresAt = new Date(baseTime + durationDays * 24 * 60 * 60 * 1000).toISOString();

          await supabaseDb.upsertProfile({
            id: targetUser.id,
            email: targetUser.email,
            is_pro: true,
            plan_type: durationDays >= 365 ? '365-days' : durationDays >= 90 ? '90-days' : '30-days',
          }).catch((err: any) => console.error('[Webhook update profile err]', err));
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('[RAZORPAY_WEBHOOK_ERROR]', error);
    return NextResponse.json({ error: error?.message || 'Webhook processing error' }, { status: 500 });
  }
}
