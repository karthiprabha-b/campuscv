import { NextRequest, NextResponse } from 'next/server';
import { verifyDomainDns } from '../../../../../lib/dnsService';
import { supabaseDb } from '../../../../../lib/supabase/dbService';
import { getSupabaseServerClient } from '../../../../../lib/supabase/server';
import { db } from '../../../../../lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Domain ID is required.' }, { status: 400 });
    }

    // 1. Fetch domain record from Supabase or SQLite
    const client = getSupabaseServerClient() as any;
    let { data: domainRecord, error } = await client
      .from('custom_domains')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!domainRecord) {
      try {
        const row = db.prepare('SELECT * FROM custom_domains WHERE id = ?').get(id) as any;
        if (row) domainRecord = row;
      } catch (e) {}
    }

    if (!domainRecord) {
      return NextResponse.json({ error: 'Domain record not found.' }, { status: 404 });
    }

    let forceActivate = false;
    try {
      const body = await req.json().catch(() => ({}));
      if (body?.force) forceActivate = true;
    } catch {}

    const { searchParams } = new URL(req.url);
    if (searchParams.get('force') === 'true') forceActivate = true;

    // 2. Perform independent server-side DNS verification
    const dnsResult = await verifyDomainDns(domainRecord.normalized_domain);

    const now = new Date().toISOString();

    if (dnsResult.verified || forceActivate) {
      // 3. DNS passed or Force Activated -> Update status to active and ssl_status to active
      await supabaseDb.updateCustomDomain(id, {
        status: 'active',
        verified_at: now,
        ssl_status: 'active',
      });

      // Update SQLite fallback cache
      try {
        db.prepare(`
          UPDATE custom_domains 
          SET status = 'active', verified_at = ?, ssl_status = 'active', updated_at = ? 
          WHERE id = ?
        `).run(now, now, id);
      } catch (e) {}

      // Also ensure custom_domain field in portfolios table is active
      if (domainRecord.portfolio_id) {
        try {
          await client.from('portfolios').update({ custom_domain: domainRecord.normalized_domain }).eq('id', domainRecord.portfolio_id);
        } catch {}
      }

      return NextResponse.json({
        verified: true,
        status: 'active',
        sslStatus: 'active',
        message: forceActivate && !dnsResult.verified
          ? '✓ Domain activated successfully! Traefik is now routing your domain.'
          : '✓ DNS and custom domain verified successfully! Your portfolio is now live on your domain.',
        dns: dnsResult,
      });
    } else {
      // DNS verification pending / failed
      return NextResponse.json({
        verified: false,
        status: 'pending',
        sslStatus: 'pending',
        message: dnsResult.message,
        dns: dnsResult,
      });
    }
  } catch (err: any) {
    console.error('[POST /api/domains/[id]/verify Error]', err);
    return NextResponse.json({ error: err.message || 'DNS verification failed.' }, { status: 500 });
  }
}
