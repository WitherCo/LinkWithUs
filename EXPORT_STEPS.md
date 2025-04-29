# Export and Deployment Steps

## Step 1: Export your project from Replit

1. Click on the three dots (...) in the top right corner of Replit
2. Select "Download as zip" 
3. Save the zip file to your computer

## Step 2: Create the GitHub repository

1. Go to GitHub.com and login to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Set repository name to: `witherco.github.io` (this exact name is important)
4. Set visibility to Public
5. Do NOT initialize the repository with a README
6. Click "Create repository"

## Step 3: Upload your code to GitHub

Option 1: Using GitHub Desktop
1. Install GitHub Desktop if you don't have it
2. Extract the downloaded zip file to a folder
3. Open GitHub Desktop and clone the new repository
4. Copy all files from the extracted folder to the repository folder
5. Commit the changes and push to GitHub

Option 2: Using Git command line
1. Extract the downloaded zip file
2. Open terminal or command prompt in the extracted folder
3. Run these commands:

```bash
# Initialize git repository
git init

# Configure Git (replace with your information)
git config user.name "WitherCo"
git config user.email "wither@witherco.xyz"

# Add all files to staging
git add .

# Commit the files
git commit -m "Initial commit"

# Add remote repository (use your personal access token)
git remote add origin https://[YOUR_TOKEN]@github.com/WitherCo/witherco.github.io.git

# Push to GitHub
git push -u origin main
```

## Step 4: Configure GitHub Pages

1. Go to your repository on GitHub (github.com/WitherCo/witherco.github.io)
2. Click on "Settings" tab
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"
7. Under "Custom domain", enter: `witherco.xyz`
8. Click "Save"
9. Wait for DNS verification (may take a few minutes)
10. Once verified, check "Enforce HTTPS"

## Step 5: Setup DNS records at Hostinger

Configure these exact DNS records:

A Records (for root domain):
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
TTL: 3600 (or default)
```

```
Type: A
Name: @ (or leave blank)
Value: 185.199.109.153
TTL: 3600 (or default)
```

```
Type: A
Name: @ (or leave blank)
Value: 185.199.110.153
TTL: 3600 (or default)
```

```
Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
TTL: 3600 (or default)
```

CNAME Record (for www subdomain):
```
Type: CNAME
Name: www
Value: witherco.github.io
TTL: 3600 (or default)
```

## Step 6: Wait for propagation

1. DNS changes can take up to 24 hours to propagate
2. GitHub Pages deployment can take a few minutes
3. Check site availability at both:
   - https://witherco.xyz
   - https://witherco.github.io

## Troubleshooting

If you see the 404 GitHub cat page:
1. Make sure the repository is named exactly `witherco.github.io`
2. Ensure there's an index.html file in the root of the repository
3. Check that GitHub Pages is properly configured in repository settings
4. Verify that your DNS records are correctly set up

If you want to make changes:
1. Make changes locally
2. Commit and push changes to GitHub
3. Wait for GitHub Pages to redeploy (usually a few minutes)