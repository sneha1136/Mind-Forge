const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');
const rootDir = path.join(__dirname, '..');

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public files to dist and root
const files = fs.readdirSync(publicDir);
files.forEach(file => {
  const src = path.join(publicDir, file);
  const destDist = path.join(distDir, file);
  const destRoot = path.join(rootDir, file);
  
  fs.copyFileSync(src, destDist);
  // Also copy to root (except if file exists as directory)
  if (fs.statSync(src).isFile() && file !== 'package.json' && file !== 'package-lock.json') {
    fs.copyFileSync(src, destRoot);
  }
});

console.log('Build complete: copied public files to dist/ and root /');
