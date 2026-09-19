# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue: Site Not Loading / 404 Errors

**Symptoms:**
- `Failed to load resource: the server responded with a status of 404 ()`
- `main.tsx` not found
- Blank white screen

**Solutions:**

#### 1. Font Awesome CDN Blocked
**Problem:** Browser tracking prevention blocks Font Awesome CDN
```
Tracking Prevention blocked access to storage for https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
```

**Fix:** ✅ **Already Fixed!**
- Removed Font Awesome CDN link from `index.html`
- MoodFlix uses Lucide React icons (no external CDN needed)

#### 2. Base Path Mismatch
**Problem:** Assets not loading because base path doesn't match deployment

**For Local Development:**
```bash
npm run dev
# Access at: http://localhost:3000
```

**For GitHub Pages:**
The workflow automatically sets the correct base path (`/moodflix/`) during build.

**Manual Fix:**
If you need to change the base path:
```javascript
// vite.config.js
export default defineConfig({
  base: '/', // or '/your-repo-name/' for GitHub Pages
  // ...
});
```

#### 3. Build Not Deployed
**Problem:** Pushed code but site shows old version

**Solution:**
```bash
# Check if workflow ran
# Go to: https://github.com/YOUR_USERNAME/moodflix/actions

# If no workflow ran:
git add .
git commit -m "Trigger deployment"
git push origin main
```

#### 4. Browser Cache Issues
**Problem:** Seeing old version after deployment

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Try incognito/private window
- Wait 2-3 minutes for CDN to update

---

### Issue: Blank White Screen

**Symptoms:**
- Page loads but nothing displays
- Console shows JavaScript errors

**Solutions:**

#### 1. Check Console Errors
Open browser DevTools (F12) and check the Console tab for errors.

Common errors:
- `Uncaught TypeError: Cannot read property 'useState' of null`
  - **Fix:** Ensure React is properly imported
  - Check `main.tsx` has: `import React from 'react'`

- `Failed to load module script`
  - **Fix:** Base path issue - see "Base Path Mismatch" above

#### 2. Verify Build Output
```bash
npm run build
# Check dist/ folder exists
ls dist/
# Should see: index.html, assets/
```

#### 3. Check Node Modules
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue: Styles Not Loading

**Symptoms:**
- HTML loads but no CSS
- Page looks unstyled

**Solutions:**

#### 1. Tailwind CSS Not Compiling
```bash
# Check if Tailwind is installed
npm list @tailwindcss/vite

# Reinstall if missing
npm install
```

#### 2. CSS File Not in dist/
```bash
npm run build
ls dist/assets/
# Should see: index-*.css
```

#### 3. Check HTML Links
```html
<!-- dist/index.html should have: -->
<link rel="stylesheet" href="/assets/index-*.css">
```

---

### Issue: GitHub Pages Deployment Fails

**Symptoms:**
- Workflow fails in Actions tab
- Site shows 404 after deployment

**Solutions:**

#### 1. Check Workflow Logs
Go to **Actions** tab → Click failed workflow → Check logs

Common errors:
- `npm ci` fails → Delete `package-lock.json` and commit
- `npm run build` fails → Fix build errors locally first
- `upload-pages-artifact` fails → Check `dist/` folder exists

#### 2. GitHub Pages Not Enabled
```
Settings → Pages → Source → GitHub Actions
```

#### 3. Wrong Branch
Ensure you're pushing to `main` branch (not `master`)

#### 4. Repository Name Mismatch
If repo name is not `moodflix`, update workflow:
```yaml
# .github/workflows/deploy.yml
env:
  BASE_PATH: '/your-repo-name/'
```

---

### Issue: Images Not Loading

**Symptoms:**
- Movie posters/backdrops not showing
- Broken image icons

**Solutions:**

#### 1. TMDB API Issues
The app uses TMDB API for images. Check:
- Internet connection
- TMDB API status: https://www.themoviedb.org/api
- Browser console for CORS errors

#### 2. Image URL Format
Images should load from:
```
https://image.tmdb.org/t/p/w500/{poster_path}
```

If not loading:
- Check browser DevTools → Network tab
- Look for failed image requests
- Verify poster_path exists in movie data

---

### Issue: Swipe Gestures Not Working

**Symptoms:**
- Can't swipe cards left/right
- Drag doesn't work on mobile

**Solutions:**

#### 1. Framer Motion Not Loaded
```bash
npm list framer-motion
# If missing:
npm install framer-motion
```

#### 2. Touch Events Blocked
Some browsers block touch events. Try:
- Different browser
- Disable browser extensions
- Check console for errors

#### 3. Z-Index Issues
Cards might be behind other elements. Check:
- Browser DevTools → Elements tab
- Verify card z-index is higher than background

---

### Issue: Data Not Persisting

**Symptoms:**
- Ratings/wishlist disappear on refresh
- Data lost after closing browser

**Solutions:**

#### 1. LocalStorage Disabled
Some browsers block localStorage in private/incognito mode.

**Fix:** Use normal browsing mode

#### 2. LocalStorage Full
LocalStorage has ~5MB limit.

**Fix:**
```javascript
// Check storage usage
console.log(JSON.stringify(localStorage).length);

// Clear old data
localStorage.clear();
```

#### 3. Browser Settings
Some browsers clear storage on exit.

**Fix:** Check browser settings:
- Chrome: Settings → Privacy → Cookies → "Clear on exit" (disable)
- Firefox: Settings → Privacy → "Delete cookies on close" (disable)

---

### Issue: Build Warnings

**Symptoms:**
- Warnings during `npm run build`
- Large bundle size

**Solutions:**

#### 1. TypeScript Warnings
```bash
# Check for type errors
npx tsc --noEmit

# Fix type errors in source files
```

#### 2. Large Bundle Size
```bash
# Analyze bundle
npm run build
# Check dist/assets/ file sizes

# Consider code splitting for large components
```

---

## Debugging Commands

### Check Build Output
```bash
npm run build
ls -la dist/
cat dist/index.html
```

### Check Dependencies
```bash
npm list --depth=0
npm outdated
```

### Clear Cache
```bash
# Node modules
rm -rf node_modules
npm install

# Build output
rm -rf dist
npm run build

# Browser cache
# Ctrl+Shift+R or Cmd+Shift+R
```

### Check Git Status
```bash
git status
git log --oneline -5
git remote -v
```

---

## Getting Help

### 1. Check Documentation
- [README.md](./README.md) - Project overview
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical details

### 2. Check Browser Console
Open DevTools (F12) → Console tab → Look for errors

### 3. Check Network Tab
DevTools → Network tab → Look for failed requests (red)

### 4. Check GitHub Actions
Repository → Actions tab → Check workflow logs

### 5. Open an Issue
GitHub → Issues → New Issue → Describe the problem with:
- Error messages
- Browser and version
- Steps to reproduce
- Screenshots

---

## Quick Fix Checklist

If the site isn't loading, try these in order:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check browser console for errors
- [ ] Verify `npm run build` succeeds locally
- [ ] Check GitHub Actions workflow status
- [ ] Ensure GitHub Pages is enabled
- [ ] Verify repository name matches base path
- [ ] Clear browser cache
- [ ] Try incognito/private window
- [ ] Check internet connection
- [ ] Verify TMDB API is accessible

---

**Still having issues?** Open a GitHub issue with detailed error messages and steps to reproduce.
