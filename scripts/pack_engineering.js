const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.resolve(__dirname, '../data/templates/Engineering');
const targets = [
  path.resolve(__dirname, '../data/templates/Engineering.zip'),
  path.resolve(__dirname, '../data/templates/engineering-build.zip'),
  path.resolve(__dirname, '../public/templates/engineering.zip'),
  path.resolve(__dirname, '../public/templates/engineering-template.zip'),
];

targets.forEach(t => {
  if (fs.existsSync(t)) {
    try { fs.unlinkSync(t); } catch (e) {}
  }
});

const mainZip = targets[0];

const psScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = '${mainZip.replace(/\\/g, '/')}'
$sourcePath = '${sourceDir.replace(/\\/g, '/')}'

$mode = [System.IO.Compression.ZipArchiveMode]::Create
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, $mode)

Get-ChildItem -Path $sourcePath -Recurse | Where-Object { 
  $_.FullName -notmatch '[\\\\/](node_modules|\\.next|\\.git)($|[\\\\/])' -and
  $_.Name -notmatch '\\.zip$'
} | ForEach-Object {
  if (-not $_.PSIsContainer) {
    $relPath = $_.FullName.Substring($sourcePath.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal)
  }
}
$zip.Dispose()
`;

const psPath = path.resolve(__dirname, 'pack_eng.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

try {
  execSync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, { stdio: 'inherit' });
  const stat = fs.statSync(mainZip);
  console.log(`ZIP_SUCCESS: Size = ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

  for (let i = 1; i < targets.length; i++) {
    fs.copyFileSync(mainZip, targets[i]);
    console.log(`Copied to: ${targets[i]}`);
  }
} finally {
  if (fs.existsSync(psPath)) fs.unlinkSync(psPath);
}
