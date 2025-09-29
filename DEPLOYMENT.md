# Deployment Guide

This guide explains how to deploy the MCMC Atlas to GitHub Pages.

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `Rmcmcatlas` (or any name you prefer)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README (we already have one)

### 2. Push Your Code

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: MCMC Atlas"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/Rmcmcatlas.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The GitHub Actions workflow will automatically deploy your site

### 4. Access Your Site

Your site will be available at:
`https://YOUR_USERNAME.github.io/Rmcmcatlas`

## 🔧 GitHub Actions Workflow

The `.github/workflows/deploy.yml` file contains the deployment configuration:

- **Triggers**: Pushes to main/master branch
- **Permissions**: Read contents, write pages, write id-token
- **Steps**:
  1. Checkout code
  2. Setup Pages
  3. Upload artifact
  4. Deploy to GitHub Pages

## 📝 Customization

### Update Repository URLs

In `README.md`, replace `yourusername` with your actual GitHub username:

```markdown
https://yourusername.github.io/Rmcmcatlas
```

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the root directory with your domain
2. Configure DNS settings to point to GitHub Pages
3. Enable custom domain in repository settings

## 🔄 Automatic Deployment

Once set up, the site will automatically deploy whenever you:

- Push changes to the main branch
- Merge pull requests to main branch

## 🐛 Troubleshooting

### Common Issues

1. **Site not updating**: Check GitHub Actions tab for deployment status
2. **404 errors**: Ensure the repository is public and Pages is enabled
3. **Build failures**: Check the Actions logs for specific errors

### Manual Deployment

If automatic deployment fails, you can manually trigger it:

1. Go to **Actions** tab in your repository
2. Select the "Deploy MCMC Atlas to GitHub Pages" workflow
3. Click **Run workflow**

## 📊 Monitoring

- **Deployment status**: Check the Actions tab
- **Site analytics**: Enable GitHub Pages analytics in repository settings
- **Custom 404**: Add a `404.html` file for custom error pages

## 🔒 Security

- The repository should be public for free GitHub Pages
- No sensitive information should be committed to the repository
- Use environment variables for any API keys (if needed)

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Custom Domains on GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
