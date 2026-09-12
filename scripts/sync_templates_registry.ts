import { walkTemplateDir, loadRegistryServer, saveRegistryServer } from '../src/lib/serverTemplateStore';
import path from 'path';
import fs from 'fs';

const DATA_TEMPLATES_DIR = path.join(process.cwd(), 'data', 'templates');
const registry = loadRegistryServer();

const templateMapping: Record<string, string> = {
  'cs-portfolio': 'cs-portfolio',
  'designer-portfolio': 'Designer portfolio',
  'Designer portfolio': 'Designer portfolio',
  'stu-creative-bold': 'stu-creative-bold',
  'student-portfolio': 'stu-creative-bold',
  'doctor-portfolio': 'Doctor',
  'Doctor': 'Doctor',
  'slash-model': 'slash model',
  'slash model': 'slash model',
  'static-panel': 'Static Panel',
  'Static Panel': 'Static Panel',
  'centerd': 'centerd',
  'Centered': 'centerd',
  'card': 'Card',
  'Card': 'Card',
  'stu_lawyer': 'stu_lawyer',
  'stu-lawyer': 'stu_lawyer',
  'executive-lawyer-portfolio': 'stu_lawyer'
};

for (const [regKey, dirName] of Object.entries(templateMapping)) {
  const dirPath = path.join(DATA_TEMPLATES_DIR, dirName);
  if (fs.existsSync(dirPath)) {
    const files = walkTemplateDir(dirPath);
    console.log(`Updating ${regKey} from ${dirName} with ${Object.keys(files).length} files...`);
    if (!registry[regKey]) {
      let manifest: any = {};
      try {
        const mf = files['manifest.json'] || files['src/manifest.json'];
        if (mf) manifest = JSON.parse(mf);
      } catch (e) {}
      registry[regKey] = {
        id: regKey,
        name: manifest.name || dirName,
        category: manifest.category || 'Professional',
        version: manifest.version || '1.0.0',
        currentVersionId: 'v1',
        status: 'active',
        thumbnail: manifest.thumbnail || 'thumbnail.png',
        preview: manifest.preview || 'preview.png',
        description: manifest.description || 'Portfolio template',
        sections: ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [{ versionId: 'v1', version: manifest.version || '1.0.0', sourcePath: `data/templates/${dirName}`, createdAt: new Date().toISOString() }],
        sectionFiles: files,
        templateCode: files['src/template.jsx'] || files['template.jsx'] || files['src/index.jsx'] || files['src/App.tsx'] || files['src/app/page.tsx'] || '',
        customCSS: files['src/styles/styles.css'] || files['src/styles/globals.css'] || files['src/index.css'] || files['src/globals.css'] || ''
      };
    } else {
      registry[regKey].sectionFiles = files;
      registry[regKey].templateCode = files['src/template.jsx'] || files['template.jsx'] || files['src/index.jsx'] || files['src/App.tsx'] || files['src/app/page.tsx'] || '';
      registry[regKey].customCSS = files['src/styles/styles.css'] || files['src/styles/globals.css'] || files['src/index.css'] || files['src/globals.css'] || '';
      registry[regKey].updatedAt = new Date().toISOString();
    }
  }
}

saveRegistryServer(registry);
console.log('Template registry updated successfully!');
