import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const rootAssetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');

console.log('--- Post-build sync starting ---');

// 1. Ensure dist/index.html exists (handle index.dev.html if created)
const devHtmlInDist = path.join(distDir, 'index.dev.html');
const distIndexHtml = path.join(distDir, 'index.html');
if (fs.existsSync(devHtmlInDist)) {
  fs.copyFileSync(devHtmlInDist, distIndexHtml);
  console.log('Copied dist/index.dev.html -> dist/index.html');
}

// 2. Copy dist/index.html to root ./index.html
if (fs.existsSync(distIndexHtml)) {
  fs.copyFileSync(distIndexHtml, path.join(rootDir, 'index.html'));
  console.log('Copied dist/index.html -> ./index.html (ready for GitHub Pages main/root)');
}

// 3. Copy dist/assets to root ./assets
if (fs.existsSync(distAssetsDir)) {
  if (fs.existsSync(rootAssetsDir)) {
    fs.rmSync(rootAssetsDir, { recursive: true, force: true });
  }
  fs.cpSync(distAssetsDir, rootAssetsDir, { recursive: true });
  console.log('Copied dist/assets -> ./assets/ (recursive)');
}

// 4. Ensure .nojekyll in root and dist
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Ensured .nojekyll in root and dist');

// 5. Ensure 404.html in root and dist
const notFoundHtml = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/My-website/" />
    <script>
      window.location.replace("/My-website/");
    </script>
    <title>Reindirizzamento...</title>
  </head>
  <body>
    <p>Reindirizzamento in corso a <a href="/My-website/">Curriculum Vitae</a>...</p>
  </body>
</html>
`;
fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml);
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);
console.log('Ensured 404.html in root and dist');

// 6. Ensure Media in dist
const distMediaDir = path.join(distDir, 'Media');
const rootMediaDir = path.join(rootDir, 'Media');
if (fs.existsSync(rootMediaDir) && !fs.existsSync(distMediaDir)) {
  fs.cpSync(rootMediaDir, distMediaDir, { recursive: true });
  console.log('Copied Media -> dist/Media');
}

console.log('--- Post-build sync completed successfully! ---');
