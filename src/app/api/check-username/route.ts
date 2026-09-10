import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { normalizeUsername } from '../../../utils/urlHelper';

export const dynamic = 'force-dynamic';

const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'auth', 'dashboard', 'editor', 'preview', 'login', 'onboarding',
  'pricing', 'privacy', 'security', 'terms', 'help', 'faq', 'guide', 'grants',
  'templates', 'template-files', 'template-assets', 'assets', 'static', 'public',
  'p', 'cv', 'app', 'settings', 'null', 'undefined'
]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUsername = searchParams.get('username') || '';
    const currentPortfolioId = searchParams.get('portfolioId') || '';

    const username = normalizeUsername(rawUsername);

    if (!username || username.length < 3) {
      return NextResponse.json({
        available: false,
        username,
        reason: 'Username must be at least 3 characters long.'
      });
    }

    if (username.length > 40) {
      return NextResponse.json({
        available: false,
        username,
        reason: 'Username cannot exceed 40 characters.'
      });
    }

    if (RESERVED_USERNAMES.has(username)) {
      return NextResponse.json({
        available: false,
        username,
        reason: 'This username is reserved by CampusCV.'
      });
    }

    // 1. Check against SQLite published rows
    const query = `
      SELECT id, username FROM portfolios 
      WHERE LOWER(username) = ? AND published = 1
    `;
    const existing = db.prepare(query).get(username.toLowerCase()) as any;

    if (existing) {
      const isSamePortfolio = currentPortfolioId && (
        existing.id === currentPortfolioId || 
        existing.id === `${currentPortfolioId}-published`
      );

      if (isSamePortfolio) {
        return NextResponse.json({
          available: true,
          username,
          isCurrent: true,
          message: 'Current username.'
        });
      }

      return NextResponse.json({
        available: false,
        username,
        reason: 'Username is already taken.'
      });
    }

    // 2. Check against Supabase published rows
    try {
      const { supabaseDb } = await import('../../../lib/supabase/dbService');
      const suPublished = await supabaseDb.loadPublishedPortfolio(username);
      if (suPublished) {
        const isSame = currentPortfolioId && (
          suPublished.id === currentPortfolioId || 
          suPublished.id === `${currentPortfolioId}-published`
        );
        if (isSame) {
          return NextResponse.json({
            available: true,
            username,
            isCurrent: true,
            message: 'Current username.'
          });
        }
        return NextResponse.json({
          available: false,
          username,
          reason: 'Username is already taken.'
        });
      }
    } catch (e) {
      console.warn('[check-username] Supabase check error:', e);
    }

    return NextResponse.json({
      available: true,
      username,
      message: 'Username is available.'
    });
  } catch (err: any) {
    console.error('[API /api/check-username ERROR]', err);
    return NextResponse.json({
      available: false,
      reason: 'Server error checking username availability.'
    }, { status: 500 });
  }
}
