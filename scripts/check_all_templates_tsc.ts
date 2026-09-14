import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const TEMPLATES_DIR = path.resolve('data/templates');
const templateDirs = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`Found ${templateDirs.length} template directories.`);

const results: Record<string, { errors: string[], fileCount: number }> = {};

for (const dirName of templateDirs) {
  const dirPath = path.join(TEMPLATES_DIR, dirName);
  results[dirName] = { errors: [], fileCount: 0 };
  
  // Collect all ts, tsx, js, jsx files
  const files: string[] = [];
  function walk(currentDir: string) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const item of items) {
      if (item.name === 'node_modules' || item.name === '.next' || item.name === 'dist' || item.name === 'build') continue;
      const fullPath = path.join(currentDir, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx?|jsx?)$/.test(item.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(dirPath);
  results[dirName].fileCount = files.length;

  // Typecheck with TypeScript Program
  const compilerOptions: ts.CompilerOptions = {
    noEmit: true,
    jsx: ts.JsxEmit.ReactJSX,
    allowJs: true,
    checkJs: false,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    skipLibCheck: true,
    paths: {
      '@/*': [path.join(dirPath, 'src/*'), path.join(dirPath, '*'), path.join(dirPath, 'app/*')]
    },
    baseUrl: dirPath
  };

  const program = ts.createProgram(files, compilerOptions);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  for (const diag of diagnostics) {
    if (diag.file && files.includes(diag.file.fileName)) {
      const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
      const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start || 0);
      const relPath = path.relative(dirPath, diag.file.fileName);
      results[dirName].errors.push(`${relPath} (${line + 1},${character + 1}): ${message}`);
    }
  }
}

console.log('\n--- DIAGNOSTIC RESULTS ---');
let totalErrors = 0;
for (const [dir, res] of Object.entries(results)) {
  console.log(`\nTemplate: [${dir}] (${res.fileCount} source files)`);
  if (res.errors.length === 0) {
    console.log('  ✓ No syntax or type errors found!');
  } else {
    console.log(`  ✗ ${res.errors.length} issues found:`);
    res.errors.slice(0, 15).forEach(e => console.log(`    - ${e}`));
    if (res.errors.length > 15) {
      console.log(`    ... and ${res.errors.length - 15} more`);
    }
    totalErrors += res.errors.length;
  }
}
console.log(`\nTotal issues across all templates: ${totalErrors}`);
