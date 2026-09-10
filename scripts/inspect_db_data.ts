import Database from 'better-sqlite3';

const db = new Database('portfolio.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as any[];
console.log('TABLES:', tables);

for (const t of tables) {
  const rows = db.prepare(`SELECT * FROM ${t.name} LIMIT 5`).all() as any[];
  console.log(`\n=== Table: ${t.name} (${rows.length} sample rows) ===`);
  for (const r of rows) {
    console.log('ID / KEY:', r.id || r.name || r.key);
    const str = JSON.stringify(r);
    if (str.includes('NexusKV') || str.includes('VisionRAG') || str.includes('DevStream') || str.includes('Stanford') || str.includes('3.94') || str.includes('Rust')) {
      console.log('  -> CONTAINS DEMO STRINGS!');
    }
  }
}
