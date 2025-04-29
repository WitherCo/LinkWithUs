# Step-by-Step Deployment Guide for witherco.xyz

Follow these exact steps to deploy your website to GitHub Pages:

## 1. Download This Project

- Click on the three dots menu (⋮) in the top-right corner of Replit
- Select "Download as zip"
- Extract the zip file to a folder on your computer

## 2. Create a GitHub Repository

- Go to https://github.com/new
- Repository name: `witherco-website`
- Description: `Link-in-bio website for witherco.xyz`
- Make it Public
- Click "Create repository" (DON'T initialize with README)

## 3. Push the Code to GitHub

Open a terminal/command prompt in the extracted project folder and run:

```bash
# Initialize a Git repository
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit"

# Add the GitHub remote
git remote add origin https://github.com/WitherCo/witherco-website.git

# Push to GitHub
git push -u origin main
```

## 4. Add the GitHub Token as a Secret

- Go to your repository on GitHub
- Navigate to Settings → Secrets and variables → Actions
- Click "New repository secret"
- Name: `GITHUB_TOKEN`
- Value: Paste your GitHub token
- Click "Add secret"

## 5. Enable GitHub Pages with GitHub Actions

- Go to your repository settings
- Navigate to Pages
- Under "Source", select "GitHub Actions"
- The workflow file at `.github/workflows/deploy.yml` will be used

## 6. Set Up Custom Domain

- Go to your repository settings → Pages
- Under "Custom domain", enter: `witherco.xyz`
- Click "Save"
- Check "Enforce HTTPS" after GitHub verifies your domain

## 7. Verify Deployment

- Go to the "Actions" tab in your GitHub repository
- You should see a "Deploy to GitHub Pages" workflow running
- Wait for it to complete
- Your site will be available at `witherco.xyz` once DNS propagation completes

## 8. DNS Configuration

Make sure your DNS settings at Hostinger point to GitHub Pages:

```
A Record: witherco.xyz → 185.199.108.153
A Record: witherco.xyz → 185.199.109.153
A Record: witherco.xyz → 185.199.110.153
A Record: witherco.xyz → 185.199.111.153
```

For www subdomain, add:
```
CNAME Record: www.witherco.xyz → witherco.github.io
```

## Troubleshooting

If you encounter any issues:

1. Check the GitHub Actions logs for error messages
2. Make sure your GitHub token has the correct permissions
3. Verify DNS records are correctly configured
4. Wait for DNS propagation (can take up to 24 hours)

Your website has been fully prepared with:
- Modern, responsive design
- LinkedIn link added to your profile
- Custom domain configuration (witherco.xyz)
- SEO optimization
- GitHub Pages deployment setup