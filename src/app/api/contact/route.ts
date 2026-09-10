export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/contact — send a contact message to the portfolio owner
// Uses Resend (free tier: 100 emails/day). Set RESEND_API_KEY in .env.local
// Falls back to console.log in development if no API key is set.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, portfolioOwnerEmail, portfolioOwnerName, portfolioUsername } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 });
    }
    if (!portfolioOwnerEmail) {
      return NextResponse.json({ error: 'portfolioOwnerEmail is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 });
    }

    const subject = `New message from ${name} via CampusCV`;
    const htmlBody = `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
        <div style="background: #6366f1; padding: 24px 32px;">
          <h1 style="color: white; margin: 0; font-size: 1.25rem;">📬 New Portfolio Message</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 0.85rem;">
            Someone reached out through your CampusCV portfolio
          </p>
        </div>
        <div style="padding: 32px; background: white;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 0.85rem; width: 100px; vertical-align: top;">From</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111827;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 0.85rem; vertical-align: top;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 0.85rem; vertical-align: top;">Portfolio</td>
                <td style="padding: 8px 0; color: #374151;">${portfolioUsername ? `campuscv.app/p/${portfolioUsername}` : '—'}</td></tr>
          </table>
          <div style="background: #f9fafb; border-left: 3px solid #6366f1; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="color: #6b7280; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Message</p>
            <p style="color: #111827; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message.trim()}</p>
          </div>
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
             style="display: inline-block; background: #6366f1; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.875rem;">
            Reply to ${name}
          </a>
        </div>
        <div style="padding: 16px 32px; text-align: center; font-size: 0.75rem; color: #9ca3af;">
          Sent via CampusCV Portfolio · <a href="#" style="color: #6366f1;">campuscv.app</a>
        </div>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      // Send via Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CampusCV <noreply@campuscv.app>',
          to: [portfolioOwnerEmail],
          reply_to: email,
          subject,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[Contact API] Resend error:', err);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
      }
    } else {
      // Dev fallback — log to console
      console.log('[Contact API] DEV MODE — would send email:');
      console.log('  To:', portfolioOwnerEmail);
      console.log('  From:', email, `(${name})`);
      console.log('  Message:', message);
      console.log('  Set RESEND_API_KEY in .env.local to enable real emails');
    }

    // Also store the message in the DB for the owner's inbox
    try {
      const Database = (await import('better-sqlite3')).default;
      const path = (await import('path')).default;
      const db = new Database(path.join(process.cwd(), 'portfolio.db'));
      db.exec(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          portfolio_username TEXT,
          sender_name TEXT NOT NULL,
          sender_email TEXT NOT NULL,
          message TEXT NOT NULL,
          read INTEGER DEFAULT 0,
          received_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
        );
      `);
      db.prepare(`
        INSERT INTO contact_messages (portfolio_username, sender_name, sender_email, message, received_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(portfolioUsername || null, name, email, message.trim(), Date.now());
      db.close();
    } catch (dbErr) {
      // Non-fatal — email was still sent
      console.warn('[Contact API] Could not save to DB:', dbErr);
    }

    return NextResponse.json({ ok: true, message: 'Message sent successfully' });
  } catch (e: any) {
    console.error('[Contact API] Error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

// GET /api/contact?username=xxx — get all messages for a portfolio owner
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

    const Database = (await import('better-sqlite3')).default;
    const path = (await import('path')).default;
    const db = new Database(path.join(process.cwd(), 'portfolio.db'));

    db.exec(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_username TEXT,
        sender_name TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        received_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
      );
    `);

    const messages = db.prepare(
      'SELECT * FROM contact_messages WHERE portfolio_username = ? ORDER BY received_at DESC LIMIT 50'
    ).all(username);
    db.close();

    return NextResponse.json({ messages });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
