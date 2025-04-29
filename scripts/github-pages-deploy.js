import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const repoName = 'witherco.github.io'; // Updated repository name
const userName = 'WitherCo';
const email = 'wither@witherco.xyz';
const domain = 'witherco.xyz';

// Validate token
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is not set');
  process.exit(1);
}

try {
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

async function deploy() {
  try {
    const distPath = path.resolve(__dirname, '../dist/public');

    fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

    console.log('Creating 404.html for client-side routing...');
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    fs.writeFileSync(path.join(distPath, '404.html'), indexHtml);

    process.chdir(distPath);

    console.log('Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });

    console.log('Setting up git configuration...');
    execSync(`git config user.name "${userName}"`, { stdio: 'inherit' });
    execSync(`git config user.email "${email}"`, { stdio: 'inherit' });

    console.log('Adding files to git...');
    execSync('git add -A', { stdio: 'inherit' });

    console.log('Committing changes...');
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });

    console.log('Creating main branch...');
    execSync('git branch -m main', { stdio: 'inherit' });

    console.log('Pushing to GitHub...');
    execSync(
      `git push -f https://${token}@github.com/${userName}/${repoName}.git main`,
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