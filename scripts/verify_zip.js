const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const psScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path 'data/templates/Agri Student.zip').Path)
$entry = $zip.GetEntry('src/sections/Hero.jsx')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
Write-Output "--- Verification Success ---"
Write-Output $content.Substring(1100, 700)
`;

const tempPs = path.resolve(__dirname, 'temp_verify.ps1');
fs.writeFileSync(tempPs, psScript, 'utf8');

try {
  const res = execSync(`powershell -ExecutionPolicy Bypass -File "${tempPs}"`, { encoding: 'utf8' });
  console.log(res);
} finally {
  if (fs.existsSync(tempPs)) fs.unlinkSync(tempPs);
}
