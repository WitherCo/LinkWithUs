# GitHub Pages Deployment Guide

## Issue Identified

The deployment to GitHub Pages was not working because:
1. The repository name doesn't match the GitHub Pages requirements for organization sites
2. The build process needs to be modified to generate static files properly

## Solution

### 1. Clone the repository properly

First, create a repository named `witherco.github.io` (not LinkWithUs or witherco-website).

```bash
git clone https://github.com/WitherCo/witherco.github.io.git
cd witherco.github.io
```

### 2. Create a deployment script

Create a file named `deploy.js` with the following content:

```javascript
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const userName = 'WitherCo'; // Your GitHub username
const email = 'wither@witherco.xyz'; // Your GitHub email
const domain = 'witherco.xyz'; // Custom domain

// Build the app - static only, no server
try {
  console.log('Building the application...');
  execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Deploy to GitHub Pages
async function deploy() {
  try {
    // Path to the built files (this is what Vite outputs)
    const distPath = path.resolve(__dirname, 'dist');
    
    // Ensure we have a .nojekyll file
    fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
    
    // Create a 404.html file for client-side routing
    console.log('Creating 404.html for client-side routing...');
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    fs.writeFileSync(path.join(distPath, '404.html'), indexHtml);
    
    // Create a CNAME file if it doesn't exist
    console.log('Creating CNAME file for custom domain...');
    fs.writeFileSync(path.join(distPath, 'CNAME'), domain);
    
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
    console.log('Creating main branch...');
    execSync('git branch -m main', { stdio: 'inherit' });
    
    // Push to GitHub
    console.log('Pushing to GitHub...');
    execSync(
      `git push -f git@github.com:${userName}/${userName}.github.io.git main`,
      { stdio: 'inherit' }
    );
    
    console.log('\nDeployment successful! 🎉');
    console.log(`Your site should be available at: https://${domain}/`);
    
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();
```

### 3. Run the deployment

```bash
# Install dependencies
npm install

# Make the deploy script executable
chmod +x deploy.js

# Run the deployment
node deploy.js
```

### 4. Set up GitHub Pages

1. Go to your repository settings (https://github.com/WitherCo/witherco.github.io/settings/pages)
2. Under "Source", select "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Click "Save"
5. Under "Custom domain", enter: `witherco.xyz`
6. Click "Save"
7. Check "Enforce HTTPS" after GitHub verifies your domain

### 5. DNS Configuration

Make sure your DNS records are set up correctly at Hostinger:

```
A Record: @ → 185.199.108.153
A Record: @ → 185.199.109.153
A Record: @ → 185.199.110.153
A Record: @ → 185.199.111.153
CNAME Record: www → witherco.github.io
```

## Important Notes

1. For GitHub user/organization sites, the repository MUST be named `username.github.io`
2. The site will be published at `username.github.io` by default
3. Custom domains require verification and proper DNS setup
4. Changes may take up to 24 hours to propagate through DNS

## Troubleshooting

If you encounter the "This is not the web page you are looking for" 404 GitHub cat error:

1. Make sure your repository name is exactly `witherco.github.io`
2. Ensure you're deploying to the correct branch (main, not gh-pages)
3. Check if GitHub Pages is enabled in repository settings
4. Verify your custom domain configuration is correct
5. Check your DNS settings at Hostinger