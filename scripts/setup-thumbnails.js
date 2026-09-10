const fs = require('fs');
const path = require('path');

// 1. Ensure public directories exist
const dirs = [
  'public/templates/designer',
  'public/templates/designer-portfolio',
  'public/templates/product-designer-portfolio',
  'public/templates/cs',
  'public/templates/cs-portfolio',
  'public/templates/student',
  'public/templates/student-portfolio',
  'public/templates/default'
];
dirs.forEach(d => {
  const p = path.join(process.cwd(), d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// 2. Product Designer Portfolio Thumbnail (distinct Swiss UI/UX image from source)
const designerThumbSource = path.join('A:\\Office\\Template\\Designer portfolio', 'thumbnail.png');
if (fs.existsSync(designerThumbSource)) {
  const buf = fs.readFileSync(designerThumbSource);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/designer/thumbnail.png'), buf);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/designer/preview.png'), buf);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/designer-portfolio/thumbnail.png'), buf);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/product-designer-portfolio/thumbnail.png'), buf);
  console.log('Product Designer thumbnail written (bytes:', buf.length, ')');
}

// 3. Student Portfolio Thumbnail (distinct Student website image from source)
const studentThumbSource = path.join('A:\\Office\\Template\\Student\\student-portfolio', 'thumbnail.png');
if (fs.existsSync(studentThumbSource)) {
  const buf = fs.readFileSync(studentThumbSource);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/student/thumbnail.png'), buf);
  fs.writeFileSync(path.join(process.cwd(), 'public/templates/student-portfolio/thumbnail.png'), buf);
  console.log('Student Portfolio thumbnail written (bytes:', buf.length, ')');
}

// 4. CS & Software Engineer Portfolio Distinct Developer Dark-Mode Terminal SVG
const csSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" fill="none">
  <!-- Dark Background -->
  <rect width="1200" height="800" fill="#090D16"/>
  
  <!-- Glow effects -->
  <circle cx="300" cy="250" r="250" fill="#3B82F6" opacity="0.15"/>
  <circle cx="900" cy="550" r="200" fill="#10B981" opacity="0.12"/>

  <!-- Top Nav Bar -->
  <rect x="60" y="40" width="1080" height="64" rx="16" fill="#111827" stroke="#1F2937"/>
  <circle cx="100" cy="72" r="12" fill="#3B82F6"/>
  <text x="100" y="77" font-family="ui-monospace, monospace" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">&gt;_</text>
  <text x="130" y="77" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#F3F4F6">Alex Morgan</text>
  <rect x="250" y="60" width="160" height="24" rx="12" fill="#1F2937"/>
  <text x="330" y="76" font-family="ui-monospace, monospace" font-weight="600" font-size="11" fill="#10B981" text-anchor="middle">&#9679; AVAILABLE FOR HIRE</text>

  <!-- Left: Hero Developer Info -->
  <rect x="60" y="160" width="200" height="28" rx="14" fill="#1E3A8A" opacity="0.5"/>
  <text x="160" y="179" font-family="ui-monospace, monospace" font-weight="700" font-size="12" fill="#60A5FA" text-anchor="middle">CS &amp; SOFTWARE ENGINEER</text>
  
  <text x="60" y="250" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#F9FAFB" letter-spacing="-1.5">Building high-scale</text>
  <text x="60" y="315" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#3B82F6" letter-spacing="-1.5">distributed systems.</text>
  
  <text x="60" y="375" font-family="system-ui, sans-serif" font-weight="400" font-size="17" fill="#9CA3AF">Full-stack &amp; systems engineer specializing in React, Next.js, Go &amp; Kubernetes.</text>

  <!-- Tech Badges -->
  <rect x="60" y="420" width="85" height="36" rx="8" fill="#111827" stroke="#1F2937"/>
  <text x="102" y="443" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="#60A5FA" text-anchor="middle">React</text>

  <rect x="155" y="420" width="100" height="36" rx="8" fill="#111827" stroke="#1F2937"/>
  <text x="205" y="443" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="#34D399" text-anchor="middle">TypeScript</text>

  <rect x="265" y="420" width="75" height="36" rx="8" fill="#111827" stroke="#1F2937"/>
  <text x="302" y="443" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="#F472B6" text-anchor="middle">Go</text>

  <rect x="350" y="420" width="105" height="36" rx="8" fill="#111827" stroke="#1F2937"/>
  <text x="402" y="443" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="#FBBF24" text-anchor="middle">Docker/K8s</text>

  <!-- Left: CTAs -->
  <rect x="60" y="490" width="180" height="52" rx="26" fill="#3B82F6"/>
  <text x="150" y="522" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">View Repositories &#8594;</text>
  
  <rect x="255" y="490" width="140" height="52" rx="26" fill="#111827" stroke="#374151"/>
  <text x="325" y="522" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#E5E7EB" text-anchor="middle">Contact Me</text>

  <!-- Right: Code Terminal Window -->
  <rect x="640" y="160" width="500" height="380" rx="20" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
  
  <!-- Terminal Header -->
  <rect x="640" y="160" width="500" height="44" rx="20" fill="#1E293B"/>
  <rect x="640" y="184" width="500" height="20" fill="#1E293B"/>
  <circle cx="670" cy="182" r="6" fill="#EF4444"/>
  <circle cx="690" cy="182" r="6" fill="#F59E0B"/>
  <circle cx="710" cy="182" r="6" fill="#10B981"/>
  <text x="890" y="187" font-family="ui-monospace, monospace" font-size="12" fill="#94A3B8" text-anchor="middle">~/developer/portfolio.ts</text>

  <!-- Terminal Code Content -->
  <text x="670" y="240" font-family="ui-monospace, monospace" font-size="14" fill="#F472B6">const</text>
  <text x="725" y="240" font-family="ui-monospace, monospace" font-size="14" fill="#60A5FA">developer</text>
  <text x="815" y="240" font-family="ui-monospace, monospace" font-size="14" fill="#E2E8F0">= {</text>

  <text x="695" y="270" font-family="ui-monospace, monospace" font-size="14" fill="#94A3B8">name:</text>
  <text x="755" y="270" font-family="ui-monospace, monospace" font-size="14" fill="#34D399">'Alex Morgan'</text><text x="875" y="270" font-family="ui-monospace, monospace" font-size="14" fill="#E2E8F0">,</text>

  <text x="695" y="300" font-family="ui-monospace, monospace" font-size="14" fill="#94A3B8">role:</text>
  <text x="755" y="300" font-family="ui-monospace, monospace" font-size="14" fill="#34D399">'Software Engineer'</text><text x="930" y="300" font-family="ui-monospace, monospace" font-size="14" fill="#E2E8F0">,</text>

  <text x="695" y="330" font-family="ui-monospace, monospace" font-size="14" fill="#94A3B8">repos:</text>
  <text x="755" y="330" font-family="ui-monospace, monospace" font-size="14" fill="#FBBF24">42</text><text x="775" y="330" font-family="ui-monospace, monospace" font-size="14" fill="#E2E8F0">,</text>

  <text x="695" y="360" font-family="ui-monospace, monospace" font-size="14" fill="#94A3B8">status:</text>
  <text x="770" y="360" font-family="ui-monospace, monospace" font-size="14" fill="#34D399">'Ready to build'</text>

  <text x="670" y="395" font-family="ui-monospace, monospace" font-size="14" fill="#E2E8F0">};</text>

  <rect x="670" y="430" width="440" height="75" rx="10" fill="#020617" stroke="#1E293B"/>
  <text x="690" y="460" font-family="ui-monospace, monospace" font-size="12" fill="#34D399">$ git status</text>
  <text x="690" y="485" font-family="ui-monospace, monospace" font-size="12" fill="#94A3B8">On branch main. All systems operational.</text>

  <!-- Bottom Projects Row -->
  <rect x="60" y="590" width="340" height="160" rx="16" fill="#111827" stroke="#1F2937"/>
  <text x="90" y="630" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#F9FAFB">Distributed Key-Value DB</text>
  <text x="90" y="660" font-family="system-ui, sans-serif" font-size="13" fill="#9CA3AF">Raft consensus engine built in Go.</text>
  <text x="90" y="715" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="#60A5FA">&#9733; 2.4k GitHub Stars</text>

  <rect x="430" y="590" width="340" height="160" rx="16" fill="#111827" stroke="#1F2937"/>
  <text x="460" y="630" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#F9FAFB">Cloud Native IDE</text>
  <text x="460" y="660" font-family="system-ui, sans-serif" font-size="13" fill="#9CA3AF">Browser code editor in Rust &amp; WASM.</text>
  <text x="460" y="715" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="#34D399">&#9733; 1.8k GitHub Stars</text>

  <rect x="800" y="590" width="340" height="160" rx="16" fill="#111827" stroke="#1F2937"/>
  <text x="830" y="630" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#F9FAFB">AI Query Engine</text>
  <text x="830" y="660" font-family="system-ui, sans-serif" font-size="13" fill="#9CA3AF">Real-time vector search pipeline.</text>
  <text x="830" y="715" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="#F472B6">&#9733; 950 GitHub Stars</text>
</svg>`;

const csDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(csSvg);

fs.writeFileSync(path.join(process.cwd(), 'public/templates/cs/thumbnail.png'), Buffer.from(csSvg));
fs.writeFileSync(path.join(process.cwd(), 'public/templates/cs/preview.png'), Buffer.from(csSvg));
fs.writeFileSync(path.join(process.cwd(), 'public/templates/cs-portfolio/thumbnail.png'), Buffer.from(csSvg));
console.log('CS & Software Engineer distinct thumbnail written');

// 5. Update data/templates/registry.json so each template has its own unique thumbnail
const regPath = path.join(process.cwd(), 'data', 'templates', 'registry.json');
if (fs.existsSync(regPath)) {
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  
  if (reg['designer-portfolio']) {
    reg['designer-portfolio'].thumbnail = '/templates/designer/thumbnail.png';
    reg['designer-portfolio'].preview = '/templates/designer/preview.png';
  }
  if (reg['product-designer-portfolio']) {
    reg['product-designer-portfolio'].thumbnail = '/templates/designer/thumbnail.png';
    reg['product-designer-portfolio'].preview = '/templates/designer/preview.png';
  }
  if (reg['student-portfolio']) {
    reg['student-portfolio'].thumbnail = '/templates/student/thumbnail.png';
    reg['student-portfolio'].preview = '/templates/student/preview.png';
  }
  if (reg['cs-portfolio']) {
    reg['cs-portfolio'].thumbnail = '/templates/cs/thumbnail.png';
    reg['cs-portfolio'].preview = '/templates/cs/preview.png';
  }
  
  fs.writeFileSync(regPath, JSON.stringify(reg, null, 2), 'utf8');
  console.log('registry.json thumbnails mapped to own individual static assets');
}
