# Deployment Guide

## Quick Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dental-graph.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main`

### Option 2: Manual Deployment

1. **Install gh-pages:**
   ```bash
   pnpm add -D gh-pages
   ```

2. **Build and deploy:**
   ```bash
   pnpm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **gh-pages** branch
   - Your site will be available at: `https://YOUR_USERNAME.github.io/dental-graph/`

## Important Notes

- The base path is set to `/dental-graph/` in `vite.config.js`
- If your repository name is different, update the `base` path in `vite.config.js`
- The site will be available at: `https://YOUR_USERNAME.github.io/dental-graph/`
