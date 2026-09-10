import { NextRequest, NextResponse } from 'next/server';
import { normalizeDomain, isValidDomainSyntax, isReservedDomain } from '../../../lib/domainUtils';
import { supabaseDb } from '../../../lib/supabase/dbService';
import { getSupabaseServerClient } from '../../../lib/supabase/server';
import { db } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get('portfolioId');
    const username = searchParams.get('username') || searchParams.get('slug');

    if (!portfolioId && !username) {
      return NextResponse.json({ error: 'portfolioId or username is required.' }, { status: 400 });
    }

    let domainRecord = null;

    if (portfolioId) {
      domainRecord = await supabaseDb.getCustomDomainByPortfolio(portfolioId);
    }

    // Fallback to SQLite if Supabase returns nothing
    if (!domainRecord) {
      try {
        const queryTarget = portfolioId || username;
        const row = db.prepare(`
          SELECT * FROM custom_domains 
          WHERE (portfolio_id = ? OR user_id = ? OR portfolio_id = ?) AND status != 'removed'
          ORDER BY created_at DESC LIMIT 1
        `).get(queryTarget, queryTarget, username || '') as any;
        if (row) domainRecord = row;
      } catch (e) {}
    }

    return NextResponse.json({ success: true, domain: domainRecord || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch domain.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioId, domain, username, userId } = body;

    const targetId = portfolioId || username || userId;
    if (!targetId || !domain) {
      return NextResponse.json({ error: 'portfolioId and domain are required.' }, { status: 400 });
    }

    // 1. Normalize domain
    const normalized = normalizeDomain(domain);
    if (!normalized) {
      return NextResponse.json({ error: 'Please enter a valid domain name.' }, { status: 400 });
    }

    // 2. Syntax validation
    const syntaxCheck = isValidDomainSyntax(normalized);
    if (!syntaxCheck.valid) {
      return NextResponse.json({ error: syntaxCheck.error || 'Invalid domain format.' }, { status: 400 });
    }

    // 3. Reserved domain check
    if (isReservedDomain(normalized)) {
      return NextResponse.json(
        { error: 'This domain is reserved by CampusCV and cannot be used as a custom domain.' },
        { status: 400 }
      );
    }

    // 4. Check if this domain is already registered
    const existing = await supabaseDb.getCustomDomainByNormalized(normalized);
    let existingSqlite: any = null;
    try {
      existingSqlite = db.prepare('SELECT * FROM custom_domains WHERE normalized_domain = ?').get(normalized) as any;
    } catch {}

    const verificationToken = `campuscv-verify-${Math.random().toString(36).substring(2, 12)}`;
    const now = new Date().toISOString();

    let created: any = null;

    // 5. Try Supabase create / update
    try {
      if (existing) {
        await supabaseDb.updateCustomDomain(existing.id, {
          portfolio_id: targetId,
          user_id: userId || null,
          domain: domain.trim(),
          normalized_domain: normalized,
          status: 'pending',
          ssl_status: 'pending',
          verification_token: verificationToken,
          updated_at: now,
        });
        created = { ...existing, portfolio_id: targetId, status: 'pending', ssl_status: 'pending' };
      } else {
        created = await supabaseDb.createCustomDomain({
          portfolio_id: targetId,
          user_id: userId || null,
          domain: domain.trim(),
          normalized_domain: normalized,
          status: 'pending',
          ssl_status: 'pending',
          verification_token: verificationToken,
        });
      }
    } catch {}

    // 6. SQLite Upsert (Handles new domains and reconnecting existing/disconnected domains)
    const sqliteId = existingSqlite?.id || existing?.id || `cd-${Date.now()}`;
    try {
      db.prepare(`
        INSERT INTO custom_domains (id, portfolio_id, user_id, domain, normalized_domain, status, verification_token, ssl_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, 'pending', ?, ?)
        ON CONFLICT(normalized_domain) DO UPDATE SET
          portfolio_id = excluded.portfolio_id,
          user_id = excluded.user_id,
          domain = excluded.domain,
          status = 'pending',
          ssl_status = 'pending',
          verification_token = excluded.verification_token,
          updated_at = excluded.updated_at
      `).run(sqliteId, targetId, userId || null, domain.trim(), normalized, verificationToken, now, now);

      if (!created) {
        created = {
          id: sqliteId,
          portfolio_id: targetId,
          user_id: userId || null,
          domain: domain.trim(),
          normalized_domain: normalized,
          status: 'pending',
          ssl_status: 'pending',
          verification_token: verificationToken,
          created_at: now,
          updated_at: now,
        };
      }
    } catch (e: any) {
      console.error('[SQLite Custom Domain Upsert Error]', e);
    }

    // Also update custom_domain field in portfolios table
    try {
      const client = getSupabaseServerClient() as any;
      await client.from('portfolios').update({ custom_domain: normalized }).eq('id', targetId);
    } catch {}

    if (!created) {
      created = {
        id: sqliteId,
        portfolio_id: targetId,
        user_id: userId || null,
        domain: domain.trim(),
        normalized_domain: normalized,
        status: 'pending',
        ssl_status: 'pending',
        verification_token: verificationToken,
        created_at: now,
        updated_at: now,
      };
    }

    return NextResponse.json({ success: true, domain: created });
  } catch (err: any) {
    console.error('[POST /api/domains Error]', err);
    return NextResponse.json({ error: err.message || 'Failed to add custom domain.' }, { status: 500 });
  }
}
