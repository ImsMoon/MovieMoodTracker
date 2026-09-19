# 🚀 Deploying to GitHub Pages

This guide will help you deploy MoodFlix to GitHub Pages using GitHub Actions for automatic deployments.

## 🎬 Live Demo

**See MoodFlix in action:** [https://moviemoodtracker.imtiyaz-moon.workers.dev/](https://moviemoodtracker.imtiyaz-moon.workers.dev/)

This is a fully functional deployment of MoodFlix. Try swiping through movies, logging your mood, and exploring the analytics!

## Prerequisites

- GitHub account
- Git installed on your machine
- Node.js 20+ installed

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** button in the top right → **New repository**
3. Name your repository `moodflix` (or any name you prefer)
4. **Important**: If you use a different name, update `vite.config.js`:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```
5. Leave "Add a README" unchecked (we already have one)
6. Click **Create repository**

## Step 2: Initialize Git and Push

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MoodFlix mood tracking app"

# Add GitHub remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/moodflix.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run on every push to `main`

## Step 4: Access Your Deployed Site

After the workflow completes (usually 2-3 minutes):

- Your site will be live at: `https://YOUR_USERNAME.github.io/moodflix/`
- You can find the URL in the **Actions** tab or **Pages** settings

## Automatic Deployments

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
- Builds your project on every push to `main`
- Deploys to GitHub Pages
- Provides deployment status and logs

## Manual Deployment

To manually trigger a deployment:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## Troubleshooting

### Build Fails

Check the **Actions** tab for error logs. Common issues:
- Missing dependencies: Run `npm install` locally and commit `package-lock.json`
- TypeScript errors: Fix type errors before pushing
- Missing environment variables: Add them in **Settings** → **Secrets and variables** → **Actions**

### Page Not Found (404)

- Ensure the `base` path in `vite.config.js` matches your repository name
- Wait 5-10 minutes after first deployment for GitHub Pages to initialize
- Check that GitHub Pages is enabled in repository settings

### Assets Not Loading

- Verify the `base` path is correct in `vite.config.js`
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check browser console for 404 errors

### Workflow Not Running

- Ensure the workflow file is in `.github/workflows/deploy.yml`
- Check that you're pushing to the `main` branch
- Verify GitHub Actions is enabled in repository settings

## Custom Domain (Optional)

To use a custom domain:

1. In repository **Settings** → **Pages**, enter your custom domain
2. Add a `CNAME` file in the `public/` folder with your domain
3. Configure DNS records with your domain provider:
   - For apex domain (example.com): A records pointing to GitHub IPs
   - For subdomain (www.example.com): CNAME to `YOUR_USERNAME.github.io`

## Environment Variables

If your app needs environment variables (like API keys):

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your variables (e.g., `VITE_TMDB_API_KEY`)
4. Access them in code with `import.meta.env.VITE_TMDB_API_KEY`

## Deployment Checklist

Before your first deployment:

- [ ] Update `vite.config.js` base path if needed
- [ ] Test build locally: `npm run build`
- [ ] Commit all changes
- [ ] Push to `main` branch
- [ ] Enable GitHub Pages in settings
- [ ] Wait for workflow to complete
- [ ] Verify site is accessible

## Performance Tips

- Enable branch protection rules for `main`
- Add required status checks before merging
- Use GitHub's built-in caching (already configured in workflow)
- Monitor deployment times in the **Actions** tab

## Support

For deployment issues:
- Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review [GitHub Actions documentation](https://docs.github.com/en/actions)
- Open an issue in the repository

---

**Your MoodFlix app is now live! 🎉**

Share your mood tracking journey with the world at `https://YOUR_USERNAME.github.io/moodflix/`
