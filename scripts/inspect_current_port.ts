import Database from 'better-sqlite3';

const db = new Database('portfolio.db');
const row = db.prepare("SELECT * FROM portfolios WHERE id = 'port-1788074502223'").get() as any;

if (row) {
  console.log('Row ID:', row.id);
  const data = JSON.parse(row.data);
  console.log('Template ID:', data.templateId);
  console.log('Skills count in data:', Array.isArray(data.skills) ? data.skills.length : typeof data.skills);
  console.log('Skills sample:', JSON.stringify(data.skills).substring(0, 400));
  console.log('Certifications in data:', JSON.stringify(data.certifications));
  console.log('CanonicalProfile in data:', data.canonicalProfile ? {
    skillsCount: data.canonicalProfile.skills?.length,
    certsCount: data.canonicalProfile.certifications?.length,
    certs: data.canonicalProfile.certifications
  } : 'none');
} else {
  console.log('port-1788074502223 not found in SQLite, searching by pattern:');
  const rows = db.prepare("SELECT id FROM portfolios WHERE id LIKE '%1788074502223%'").all() as any[];
  console.log('Matches:', rows);
}
