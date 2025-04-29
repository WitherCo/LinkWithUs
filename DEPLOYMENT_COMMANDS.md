# Deployment Commands for witherco.xyz

This file contains detailed commands and scripts for deploying your witherco.xyz website to GitHub Pages.

## Quick Start Commands

### Set GitHub Token
```bash
# On macOS/Linux
export GITHUB_TOKEN=your_github_token

# On Windows Command Prompt
set GITHUB_TOKEN=your_github_token

# On Windows PowerShell
$env:GITHUB_TOKEN="your_github_token"
```

### Verify Token
```bash
node scripts/verify-github-token.js
```

### Deploy Manually
```bash
node scripts/github-pages-deploy.js
```

## GitHub Repository Setup

### Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit for witherco.xyz"
```

### Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/witherco-website.git
git push -u origin main
```

## GitHub Actions Workflow

The GitHub Actions workflow is defined in `.github/workflows/deploy.yml` and will:

1. Trigger when you push to the main branch
2. Install dependencies
3. Build the application
4. Create necessary deployment files
5. Deploy to GitHub Pages

### Manually Triggering a Workflow
You can manually trigger the workflow from the GitHub Actions tab in your repository.

## Advanced Deployment Options

### Adding More Example Profiles

To add more example profiles to the static GitHub Pages version:

1. Edit `client/public/data/example-users.json`
2. Add new user objects with links
3. Redeploy the site

### Testing a Build Locally

To test the build process locally without deploying:

```bash
# Build the application
npm run build

# Verify the output in the dist directory
ls -la dist
```

### Forcing HTTPS for Custom Domain

In GitHub repository settings → Pages, check "Enforce HTTPS" to ensure secure connections.

## DNS Configuration Details

### A Records for GitHub Pages
```
# Primary A Record
witherco.xyz.  3600  IN  A  185.199.108.153

# Additional A Records for Redundancy
witherco.xyz.  3600  IN  A  185.199.109.153
witherco.xyz.  3600  IN  A  185.199.110.153
witherco.xyz.  3600  IN  A  185.199.111.153
```

### CNAME Record for www Subdomain
```
www.witherco.xyz.  3600  IN  CNAME  yourusername.github.io.
```

### Verifying DNS Configuration
```bash
# Check A records
dig witherco.xyz +noall +answer

# Check CNAME record
dig www.witherco.xyz +noall +answer
```

## Common Issues and Solutions

### "404 Not Found" After Deployment
- Ensure the `.github/workflows/deploy.yml` file exists in your repository
- Check that the GitHub Pages source is set to "GitHub Actions"
- Verify the build is completing successfully in GitHub Actions

### Custom Domain Not Working
- Verify DNS propagation: `dig witherco.xyz`
- Check that the CNAME file exists in the deployed site
- Ensure GitHub Pages settings have the correct custom domain

### Local Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear cache if needed: `rm -rf node_modules/.cache`
- Check for environment variables needed for the build