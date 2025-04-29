const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the application
console.log('Building the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
const distPath = path.resolve(__dirname, '../dist');
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

// Create a copy of index.html as 404.html for client-side routing
console.log('Creating 404.html for client-side routing...');
const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
fs.writeFileSync(path.join(distPath, '404.html'), indexHtml);

console.log('GitHub Pages deployment files prepared successfully!');
console.log('Now you can push your code to GitHub and enable GitHub Pages in your repository settings.');