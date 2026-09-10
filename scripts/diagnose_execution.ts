import fs from 'fs';
import path from 'path';
import { getTemplateFilesServer } from '../src/lib/serverTemplateStore';
import * as Babel from '@babel/standalone';

async function main() {
  console.log('==================================================');
  console.log('5. BABEL TRANSPILATION & COMPONENT EXECUTION TEST');
  console.log('==================================================');

  const serverLoaded = getTemplateFilesServer('designer-portfolio');
  if (!serverLoaded) return;

  const files = serverLoaded.files;
  const entryFile = serverLoaded.entryFile || 'src/index.jsx';

  console.log('Testing entry file:', entryFile);
  const entryCode = files[entryFile];
  if (!entryCode) {
    console.error('Entry file code missing in files map!');
    return;
  }

  // Transpile all JSX files in the template
  let transpileErrors = 0;
  const transpiledFiles: Record<string, string> = {};

  for (const [filePath, code] of Object.entries(files)) {
    if (/\.(jsx|tsx|js|ts)$/i.test(filePath) && !filePath.includes('dist/')) {
      try {
        const res = Babel.transform(code, {
          filename: filePath,
          presets: [
            'typescript',
            ['react', { runtime: 'classic' }],
            ['env', { modules: 'commonjs' }]
          ]
        });
        transpiledFiles[filePath] = res.code || '';
      } catch (err: any) {
        console.error(`[TRANSPILE ERROR in ${filePath}]:`, err.message);
        transpileErrors++;
      }
    }
  }

  console.log(`Transpiled ${Object.keys(transpiledFiles).length} JS/JSX files. Errors: ${transpileErrors}`);

  // Test mock execution environment
  const React = require('react');
  const LucideIcons = require('lucide-react');

  const moduleCache: Record<string, any> = {};

  function customRequire(targetPath: string, fromFile: string = entryFile) {
    // Built-in modules
    if (targetPath === 'react') return React;
    if (targetPath === 'lucide-react') return LucideIcons;
    if (targetPath.endsWith('.css')) return {};

    // Relative path resolution
    const fromDir = path.dirname(fromFile);
    let resolved = path.join(fromDir, targetPath).replace(/\\/g, '/');
    if (!resolved.startsWith('src/')) {
      if (files[resolved]) {} // ok
      else if (files[`src/${resolved}`]) resolved = `src/${resolved}`;
    }

    const variations = [
      resolved,
      `${resolved}.jsx`,
      `${resolved}.js`,
      `${resolved}.tsx`,
      `${resolved}.ts`,
      `${resolved}/index.jsx`,
      `${resolved}/index.js`,
      `${resolved}/index.tsx`
    ];

    let foundKey = variations.find(v => transpiledFiles[v]);
    if (!foundKey) {
      foundKey = Object.keys(transpiledFiles).find(k => k === resolved || k.endsWith('/' + resolved) || k.endsWith(resolved));
    }

    if (!foundKey) {
      throw new Error(`Module not found: '${targetPath}' required from '${fromFile}'`);
    }

    if (moduleCache[foundKey]) return moduleCache[foundKey].exports;

    const moduleObj = { exports: {} };
    moduleCache[foundKey] = moduleObj;

    const code = transpiledFiles[foundKey];
    const fn = new Function('require', 'module', 'exports', 'React', code);
    fn((reqPath: string) => customRequire(reqPath, foundKey), moduleObj, moduleObj.exports, React);

    return moduleObj.exports;
  }

  try {
    const entryExports = customRequire('./index.jsx', 'src/main.jsx');
    const Component = entryExports.default || entryExports.Template || entryExports;
    console.log('✓ Successfully executed entry component:', typeof Component);

    // Test rendering component to string with empty data
    const ReactDOMServer = require('react-dom/server');
    const htmlOutput = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, { data: {} }));
    console.log('✓ Successfully rendered component HTML! Length:', htmlOutput.length);
    console.log('Contains hero section:', htmlOutput.includes('id="hero"'));
    console.log('Contains projects section:', htmlOutput.includes('id="projects"'));
    console.log('Contains about section:', htmlOutput.includes('id="about"'));
    console.log('Contains experience section:', htmlOutput.includes('id="experience"'));
    console.log('Contains skills section:', htmlOutput.includes('id="skills"'));
    console.log('Contains contact section:', htmlOutput.includes('id="contact"'));
  } catch (err: any) {
    console.error('Execution / Render Error:', err);
  }
}

main().catch(console.error);
