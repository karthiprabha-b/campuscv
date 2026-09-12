import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zldmcrysbcwfzfhoggtx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZG1jcnlzYmN3ZnpmaG9nZ3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjM5NTIsImV4cCI6MjEwMjE5OTk1Mn0.gmoo5ME8UITh6VdbGzQob9TgdTBIjK3Ageb_x3IgAPQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

import Database from 'better-sqlite3';

async function check() {
  const { data: ports, error } = await supabase
    .from('portfolios')
    .select('*, portfolio_content(*), portfolio_design(*)')
    .in('id', ['port-1786817949015', 'port-1786817949015-published']);

  console.log('Supabase target portfolios:', ports?.length);
  for (const p of (ports || [])) {
    console.log('\nID:', p.id, 'Slug:', p.slug, 'Title:', p.title);
    const c = Array.isArray(p.portfolio_content) ? p.portfolio_content[0] : p.portfolio_content;
    if (c) {
      console.log('Content skills:', JSON.stringify(c.skills));
      console.log('Content certs:', JSON.stringify(c.certifications));
      console.log('Content canonical:', JSON.stringify(c.canonical_profile ? Object.keys(c.canonical_profile) : null));
      if (c.canonical_profile) {
        console.log('Canonical skills count:', c.canonical_profile.skills?.length);
        console.log('Canonical certs count:', c.canonical_profile.certifications?.length);
      }
    }
  }

  try {
    const db = new Database('portfolio.db');
    const cols = db.prepare("PRAGMA table_info(portfolios)").all();
    console.log('SQLite columns:', cols);
    const sqliteRows = (db.prepare('SELECT * FROM portfolios').all() || []) as any[];
    console.log('\nSQLite portfolios count:', sqliteRows.length);
    for (const r of sqliteRows) {
      console.log('\nSQLite row id:', r.id, 'username:', r.username, 'published:', r.published);
      console.log('  Keys on r:', Object.keys(r));
      if (r.data) {
        try {
          const parsed = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
          console.log('  name:', parsed.name);
          console.log('  username:', parsed.username);
          console.log('  skills:', JSON.stringify(parsed.skills)?.substring(0, 200));
          console.log('  canonical skills count:', parsed.canonicalProfile?.skills?.length);
          console.log('  certs:', JSON.stringify(parsed.certifications));
        } catch (e: any) {
          console.log('  error parsing r.data:', e.message);
        }
      }
    }
  } catch (err: any) {
    console.log('SQLite read error:', err.message);
  }
}

check();
