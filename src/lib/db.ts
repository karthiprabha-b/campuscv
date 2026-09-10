import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'portfolio.db');

let db: Database.Database;

if (process.env.NODE_ENV === 'production') {
  db = new Database(dbPath);
} else {
  if (!(global as any)._sqliteDb) {
    (global as any)._sqliteDb = new Database(dbPath);
  }
  db = (global as any)._sqliteDb;
}

// Initialize SQLite schema
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    data TEXT,
    published INTEGER DEFAULT 0,
    createdAt INTEGER,
    updatedAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS custom_domains (
    id TEXT PRIMARY KEY,
    portfolio_id TEXT NOT NULL,
    user_id TEXT,
    domain TEXT NOT NULL,
    normalized_domain TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    verification_token TEXT,
    verified_at TEXT,
    ssl_status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT,
    updated_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_cd_normalized ON custom_domains(normalized_domain);
  CREATE INDEX IF NOT EXISTS idx_cd_portfolio ON custom_domains(portfolio_id);
`);

export { db };
