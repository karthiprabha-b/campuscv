export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'portfolio.db');

function getDb() {
  const db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id TEXT NOT NULL,
      username TEXT,
      visitor_ip TEXT,
      country TEXT,
      device TEXT,
      referrer TEXT,
      viewed_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE INDEX IF NOT EXISTS idx_pv_portfolio ON portfolio_views(portfolio_id);
    CREATE INDEX IF NOT EXISTS idx_pv_viewed_at ON portfolio_views(viewed_at);
  `);
  return db;
}

// POST /api/analytics — record a portfolio view
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { portfolioId, username } = body;
    if (!portfolioId) {
      return NextResponse.json({ error: 'portfolioId required' }, { status: 400 });
    }

    // Detect device type from User-Agent
    const ua = req.headers.get('user-agent') || '';
    const device = /mobile|android|iphone|ipad/i.test(ua) ? 'mobile' : 'desktop';

    // Get referrer
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || '';
    const referrerHost = referrer ? (() => { try { return new URL(referrer).hostname; } catch { return referrer; } })() : 'direct';

    // Get IP (respects x-forwarded-for from proxies)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    const db = getDb();
    db.prepare(`
      INSERT INTO portfolio_views (portfolio_id, username, visitor_ip, device, referrer, viewed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(portfolioId, username || null, ip, device, referrerHost, Date.now());
    db.close();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/analytics?portfolioId=xxx&username=yyy — get view stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolioId = searchParams.get('portfolioId');
    const username = searchParams.get('username');
    if (!portfolioId && !username) {
      return NextResponse.json({ error: 'portfolioId or username required' }, { status: 400 });
    }

    const db = getDb();

    // Match either portfolio_id or username
    const queryWhere = portfolioId && username
      ? '(portfolio_id = ? OR (username IS NOT NULL AND username = ?))'
      : portfolioId
      ? 'portfolio_id = ?'
      : '(username IS NOT NULL AND username = ?)';
    const queryParams = portfolioId && username ? [portfolioId, username] : [portfolioId || username];

    const totalViews = (db.prepare(
      `SELECT COUNT(*) as count FROM portfolio_views WHERE ${queryWhere}`
    ).get(...queryParams) as any)?.count ?? 0;

    const uniqueVisitors = (db.prepare(
      `SELECT COUNT(DISTINCT visitor_ip) as count FROM portfolio_views WHERE ${queryWhere}`
    ).get(...queryParams) as any)?.count ?? 0;

    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayViews = (db.prepare(
      `SELECT COUNT(*) as count FROM portfolio_views WHERE ${queryWhere} AND viewed_at >= ?`
    ).get(...queryParams, todayStart.getTime()) as any)?.count ?? 0;

    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0,0,0,0);
    const weekViews = (db.prepare(
      `SELECT COUNT(*) as count FROM portfolio_views WHERE ${queryWhere} AND viewed_at >= ?`
    ).get(...queryParams, weekStart.getTime()) as any)?.count ?? 0;

    const deviceBreakdown = db.prepare(
      `SELECT device, COUNT(*) as count FROM portfolio_views WHERE ${queryWhere} GROUP BY device`
    ).all(...queryParams) as any[];

    const topReferrers = db.prepare(
      `SELECT referrer, COUNT(*) as count FROM portfolio_views WHERE ${queryWhere} GROUP BY referrer ORDER BY count DESC LIMIT 5`
    ).all(...queryParams) as any[];

    // Last 7 days daily breakdown with zero-filling
    const rawDaily = db.prepare(`
      SELECT
        date(viewed_at / 1000, 'unixepoch') as date,
        COUNT(*) as count
      FROM portfolio_views
      WHERE ${queryWhere} AND viewed_at >= ?
      GROUP BY date ORDER BY date ASC
    `).all(...queryParams, weekStart.getTime()) as any[];

    // Build complete 7-day array
    const dateMap = new Map<string, number>();
    rawDaily.forEach((r: any) => dateMap.set(r.date, r.count));

    const dailyViews: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyViews.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
      });
    }

    db.close();

    return NextResponse.json({
      portfolioId: portfolioId || '',
      username: username || '',
      totalViews,
      uniqueVisitors,
      todayViews,
      weekViews,
      deviceBreakdown,
      topReferrers,
      dailyViews,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
