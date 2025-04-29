import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const repoName = 'witherco-website'; // You can change this to your GitHub repository name
const userName = 'WitherCo'; // Your GitHub username
const email = 'wither@witherco.xyz'; // Your GitHub email
const token = process.env.GITHUB_TOKEN;
const domain = 'witherco.xyz'; // Custom domain

// Validate token
if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is not set');
  process.exit(1);
}

// Build the app and prepare the files for GitHub Pages
try {
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Deploy to GitHub Pages
async function deploy() {
  try {
    const distPath = path.resolve(__dirname, '../dist/public');
    
    // Ensure we have a .nojekyll file
    fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
    
    // Create a 404.html file for client-side routing
    console.log('Creating 404.html for client-side routing...');
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    fs.writeFileSync(path.join(distPath, '404.html'), indexHtml);
    
    // Create a CNAME file if it doesn't exist
    if (!fs.existsSync(path.join(distPath, 'CNAME'))) {
      console.log('Creating CNAME file for custom domain...');
      fs.writeFileSync(path.join(distPath, 'CNAME'), domain);
    }
    
    // Navigate to the dist directory
    process.chdir(distPath);
    
    // Initialize a new git repository
    console.log('Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
    
    // Set up git configuration
    console.log('Setting up git configuration...');
    execSync(`git config user.name "${userName}"`, { stdio: 'inherit' });
    execSync(`git config user.email "${email}"`, { stdio: 'inherit' });
    
    // Add all files to git
    console.log('Adding files to git...');
    execSync('git add -A', { stdio: 'inherit' });
    
    // Commit changes
    console.log('Committing changes...');
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
    
    // Create a new branch (gh-pages)
    console.log('Creating gh-pages branch...');
    execSync('git branch -m gh-pages', { stdio: 'inherit' });
    
    // Push to GitHub with the provided token
    console.log('Pushing to GitHub...');
    execSync(
      `git push -f https://${token}@github.com/${userName}/${repoName}.git gh-pages`,
      { stdio: 'inherit' }
    );
    
    console.log('\nDeployment successful! 🎉');
    console.log(`Your site should be available at: https://${domain}/`);
    console.log("Don't forget to set up your custom domain in GitHub repository settings.");
    
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();