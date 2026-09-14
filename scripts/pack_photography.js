const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.resolve(__dirname, '../data/templates/photography');
const zipFile = path.resolve(__dirname, '../data/templates/photography.zip');

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// Write a powershell script file to execute cleanly
const psScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = '${zipFile.replace(/\\/g, '/')}'
$sourcePath = '${sourceDir.replace(/\\/g, '/')}'

$mode = [System.IO.Compression.ZipArchiveMode]::Create
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, $mode)

Get-ChildItem -Path $sourcePath -Recurse | Where-Object { 
  $_.FullName -notmatch '[\\\\/](node_modules|\\.next|\\.git)($|[\\\\/])' 
} | ForEach-Object {
  if (-not $_.PSIsContainer) {
    $relPath = $_.FullName.Substring($sourcePath.Length + 1).Replace('\\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal)
  }
}
$zip.Dispose()
`;

const psPath = path.resolve(__dirname, 'pack_photo.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

try {
  execSync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, { stdio: 'inherit' });
  const stat = fs.statSync(zipFile);
  console.log(`ZIP_SUCCESS: Size = ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

  // Copy to public/templates
  const publicDir = path.resolve(__dirname, '../public/templates');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.copyFileSync(zipFile, path.join(publicDir, 'photography.zip'));
  fs.copyFileSync(zipFile, path.join(publicDir, 'photography-template.zip'));
  fs.copyFileSync(zipFile, path.join(publicDir, 'photography-portfolio.zip'));
  console.log('Copied to public/templates successfully!');
} finally {
  if (fs.existsSync(psPath)) fs.unlinkSync(psPath);
}
