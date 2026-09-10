import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '../../../../lib/supabase/dbService';
import { getSupabaseServerClient } from '../../../../lib/supabase/server';
import { db } from '../../../../lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Domain ID is required.' }, { status: 400 });
    }

    // 1. Fetch domain record first to find portfolio_id
    const client = getSupabaseServerClient() as any;
    const { data: domainRecord } = await client
      .from('custom_domains')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // 2. Mark removed in Supabase
    await supabaseDb.removeCustomDomain(id);

    // 3. Update SQLite cache
    try {
      db.prepare(`UPDATE custom_domains SET status = 'removed', updated_at = ? WHERE id = ?`)
        .run(new Date().toISOString(), id);
    } catch (e) {}

    // 4. Clear custom_domain field in portfolios table without deleting portfolio
    if (domainRecord?.portfolio_id) {
      await client
        .from('portfolios')
        .update({ custom_domain: null })
        .eq('id', domainRecord.portfolio_id);
    }

    return NextResponse.json({ success: true, message: 'Custom domain disconnected successfully.' });
  } catch (err: any) {
    console.error('[DELETE /api/domains/[id] Error]', err);
    return NextResponse.json({ error: err.message || 'Failed to remove domain.' }, { status: 500 });
  }
}
