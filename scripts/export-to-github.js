// Export the source code to GitHub
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration - adjust these values
const repoName = 'LinkWithUs'; // GitHub repository name
const userName = 'WitherCo'; // Your GitHub username
const token = process.env.GITHUB_TOKEN;

// Validate token
if (!token) {
  console.error('Error: GITHUB_TOKEN environment variable is not set');
  process.exit(1);
}

async function exportToGitHub() {
  try {
    // Create a temporary directory for the export
    const exportDir = path.join(rootDir, 'export-temp');
    if (fs.existsSync(exportDir)) {
      fs.rmSync(exportDir, { recursive: true });
    }
    fs.mkdirSync(exportDir);
    
    console.log('Preparing files for export...');
    
    // Copy all files from the current project to the export directory
    // Using Node.js native functions instead of rsync
    console.log('Copying files...');
    
    function copyDirectory(source, destination, exclude = []) {
      // Create the destination directory if it doesn't exist
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      // Get all files in the source directory
      const files = fs.readdirSync(source);
      
      // Copy each file/directory
      for (const file of files) {
        // Skip excluded directories
        if (exclude.includes(file)) continue;
        
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        // Check if it's a directory or file
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
          // Recursive copy for directories
          copyDirectory(sourcePath, destPath, exclude);
        } else {
          // Copy file
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }
    
    // Copy files, excluding node_modules, .git, and other directories
    copyDirectory(rootDir, exportDir, ['node_modules', '.git', 'export-temp', 'dist']);
    
    // Navigate to the export directory
    process.chdir(exportDir);
    
    // Initialize a new git repository
    console.log('Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
    
    // Add all files to git
    console.log('Adding files to git...');
    execSync('git add -A', { stdio: 'inherit' });
    
    // Commit changes
    console.log('Committing changes...');
    execSync('git commit -m "Initial commit - exported from WitherCoDev"', { stdio: 'inherit' });
    
    // Push to GitHub with the provided token
    console.log('Pushing to GitHub...');
    execSync(
      `git push -f https://${token}@github.com/${userName}/${repoName}.git main:main`,
      { stdio: 'inherit' }
    );
    
    console.log('\nExport successful! 🎉');
    console.log(`Your code has been exported to: https://github.com/${userName}/${repoName}`);
    console.log('\nNext steps:');
    console.log('1. Go to your repository settings: https://github.com/WitherCo/LinkWithUs/settings/pages');
    console.log('2. Set up GitHub Pages with your custom domain');
    console.log('3. Make sure your DNS records are configured correctly');
    
    // Clean up
    process.chdir(rootDir);
    fs.rmSync(exportDir, { recursive: true });
    
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportToGitHub();