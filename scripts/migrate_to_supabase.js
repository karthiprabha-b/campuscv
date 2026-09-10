const Database = require('better-sqlite3');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zldmcrysbcwfzfhoggtx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZG1jcnlzYmN3ZnpmaG9nZ3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjM5NTIsImV4cCI6MjEwMjE5OTk1Mn0.gmoo5ME8UITh6VdbGzQob9TgdTBIjK3Ageb_x3IgAPQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  console.log('=====================================================');
  console.log('🚀 CampusCV -> Supabase Migration Pipeline Starting');
  console.log('=====================================================');
  console.log('Target Supabase URL:', supabaseUrl);

  const dbPath = path.resolve(__dirname, '../portfolio.db');
  const db = new Database(dbPath);

  // 1. Seed Plans
  console.log('\n📦 1. Seeding Subscription Plans...');
  const plans = [
    { id: 'plan-15', name: 'Starter Pack', duration_days: 15, price: 19, currency: 'INR', storage_mb: 25, storage_label: '25 MB', description: 'Ideal for simple portfolio submissions.', is_active: true },
    { id: 'plan-30', name: 'Growth Pack', duration_days: 30, price: 49, currency: 'INR', storage_mb: 100, storage_label: '100 MB', description: 'Standard plan for job hunting.', is_active: true },
    { id: 'plan-90', name: 'Pro Professional', duration_days: 90, price: 99, currency: 'INR', storage_mb: 200, storage_label: '200 MB', description: 'Perfect for active interns & freelancers.', is_active: true },
    { id: 'plan-365', name: 'Developer Unlimited', duration_days: 365, price: 299, currency: 'INR', storage_mb: 500, storage_label: '500 MB', description: 'Premium hosting for graduating students.', is_active: true },
  ];

  for (const plan of plans) {
    const { error } = await supabase.from('plans').upsert(plan, { onConflict: 'id' });
    if (error) console.log(`   [Plans] Table not ready or:`, error.message);
    else console.log(`   ✓ Plan: ${plan.name} (${plan.id})`);
  }

  // 2. Read SQLite Portfolios
  console.log('\n📂 2. Reading SQLite Database (portfolio.db)...');
  const rows = db.prepare('SELECT * FROM portfolios').all();
  console.log(`   Found ${rows.length} records in SQLite portfolios table.`);

  let migratedPortfolios = 0;
  let migratedProfiles = 0;

  for (const row of rows) {
    try {
      const data = JSON.parse(row.data);
      const isPublished = row.published === 1 || Boolean(data.published);
      const slug = data.username || row.username || (data.meta?.slug) || data.id;

      // Extract user info
      const email = data.ownerEmail || data.email || (data.user?.email) || (slug === 'alex' ? 'demo@campuscv.in' : `${slug}@campuscv.user`);
      const name = data.name || data.profile?.fullName || data.profile?.name || data.personal?.fullName || slug;

      console.log(`   - Processing record: ID="${row.id}" | Name="${name}" | Slug="${slug}" | Published=${isPublished}`);

      const portfolioRecord = {
        id: row.id,
        title: data.title || data.meta?.portfolioTitle || `${name}'s Portfolio`,
        slug: slug.toLowerCase(),
        template_id: data.templateId || data.layoutStyle || 'product-designer-portfolio',
        template_version_id: data.templateVersionId || null,
        status: isPublished ? 'published' : 'draft',
        published: isPublished,
        published_at: isPublished ? new Date(row.updatedAt || Date.now()).toISOString() : null,
        custom_domain: data.customDomain || null,
        created_at: new Date(row.createdAt || Date.now()).toISOString(),
        updated_at: new Date(row.updatedAt || Date.now()).toISOString(),
      };

      const contentRecord = {
        portfolio_id: row.id,
        profile: data.profile || data.personal || {},
        about: data.about || { description: data.aboutMe || '' },
        hero: data.hero || { title: data.name || '', subtitle: data.tagline || '', description: data.aboutMe || '' },
        projects: Array.isArray(data.projects) ? data.projects : [],
        experience: Array.isArray(data.experience) ? data.experience : (data.timeline || []),
        education: Array.isArray(data.education) ? data.education : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        social_links: data.socialLinks || data.social || {},
        contact: data.contact || {},
        custom_sections: data.custom_sections || data.addedSections || [],
        canonical_profile: data.canonicalProfile || {},
        raw_data: data,
        created_at: new Date(row.createdAt || Date.now()).toISOString(),
        updated_at: new Date(row.updatedAt || Date.now()).toISOString(),
      };

      const designRecord = {
        portfolio_id: row.id,
        template_id: data.templateId || data.layoutStyle || 'product-designer-portfolio',
        accent_color: data.themeColor || data.theme?.primaryColor || 'violet',
        font_family: data.fontPack || data.typography?.fontFamily || 'sans',
        font_size: String(data.baseFontSize || data.typography?.fontSize || '16'),
        theme_mode: data.isDarkMode ? 'dark' : 'light',
        custom_settings: {
          styleOverrides: data.styleOverrides || {},
          contentOverrides: data.contentOverrides || {},
          imageOverrides: data.imageOverrides || {},
          deletedNodes: data.deletedNodes || {},
          advancedSettings: data.advancedSettings || {},
          spacingPreset: data.spacingPreset,
          sectionGap: data.sectionGap,
          cardBorderRadius: data.cardBorderRadius,
          contentPadding: data.contentPadding,
          animationPreset: data.animationPreset,
          sectionOrder: data.sectionOrder,
        },
        custom_css: data.customCSS || null,
        created_at: new Date(row.createdAt || Date.now()).toISOString(),
        updated_at: new Date(row.updatedAt || Date.now()).toISOString(),
      };

      const { error: pErr } = await supabase.from('portfolios').upsert(portfolioRecord, { onConflict: 'id' });
      if (!pErr) {
        migratedPortfolios++;
        await supabase.from('portfolio_content').upsert(contentRecord, { onConflict: 'portfolio_id' });
        await supabase.from('portfolio_design').upsert(designRecord, { onConflict: 'portfolio_id' });
      }
    } catch (err) {
      console.warn(`   ⚠️ Warning processing row ${row.id}:`, err.message);
    }
  }

  console.log('\n=====================================================');
  console.log(`✅ Migration Complete:`);
  console.log(`   - Portfolios Processed: ${rows.length}`);
  console.log(`   - Successfully Synced to Supabase: ${migratedPortfolios}`);
  console.log('=====================================================');
}

runMigration().catch(console.error);
