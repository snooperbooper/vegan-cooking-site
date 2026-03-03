# Deployment Guide - Vegan Cooking Website

## Prerequisites

1. ✅ Supabase project created
2. ✅ Database schema applied (SUPABASE_SCHEMA.sql)
3. ✅ Environment variables set (.env file)
4. ✅ Admin user created
5. ✅ GitHub repository created

## Quick Deploy to GitHub Pages

### Step 1: Prepare Your Repository

```bash
cd vegan-cooking-site
git init
git add .
git commit -m "Initial commit: Vegan cooking website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 2: Install gh-pages

```bash
npm install -D gh-pages
```

### Step 3: Configure Environment Variables

**For local development:**
Already done! Your `.env` file has your Supabase credentials.

**For production (GitHub Pages):**
Since GitHub Pages serves static files, your `.env` variables are baked into the build. This means:
- ✅ Safe: The `VITE_SUPABASE_ANON_KEY` is meant to be public (it's called "anon" for a reason)
- ✅ Protected: Supabase Row Level Security (RLS) protects your data
- ⚠️ Don't commit `.env` to Git (it's in `.gitignore`)

### Step 4: Build & Test Locally

```bash
npm run build
npm run preview
```

Visit the preview URL to test your production build locally.

### Step 5: Deploy

```bash
npm run deploy
```

This will:
1. Build your site (`npm run build`)
2. Create/update the `gh-pages` branch
3. Push the built files to GitHub

### Step 6: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click Settings → Pages (left sidebar)
3. Under "Source", select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Click Save

### Step 7: Access Your Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

⏱️ First deployment takes 2-5 minutes to go live.

## Custom Domain (Optional)

### Step 1: Add Custom Domain

1. In GitHub Settings → Pages → Custom domain
2. Enter your domain (e.g., `vegandelights.com`)
3. Click Save

### Step 2: Configure DNS

Add these DNS records at your domain provider:

**For apex domain (vegandelights.com):**
```
Type: A
Name: @
Value: 185.199.108.153
```
(Add all 4 GitHub IPs: .108, .109, .110, .111)

**For www subdomain:**
```
Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

### Step 3: Wait for DNS Propagation

Can take up to 24 hours (usually 1-2 hours)

### Step 4: Enable HTTPS

After DNS is set:
1. Go back to GitHub Settings → Pages
2. Check "Enforce HTTPS"

## Environment-Specific Builds

### Production vs Development

The app automatically detects environment:
- `npm run dev` → Development mode (uses `.env`)
- `npm run build` → Production mode (uses `.env` or build-time variables)

### Multiple Environments

If you want staging/production environments:

1. **Create `.env.staging` and `.env.production`**

```bash
# .env.production
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-key
```

2. **Build with specific env:**

```bash
# Production
cp .env.production .env
npm run build

# Staging
cp .env.staging .env
npm run build
```

## Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Create .env file
      run: |
        echo "VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}" > .env
        echo "VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}" >> .env
        
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Then add your secrets in GitHub:
Settings → Secrets and variables → Actions → New repository secret

## Vercel Deployment (Alternative)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts, then add environment variables in Vercel dashboard.

## Netlify Deployment (Alternative)

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deploy

1. Build your site: `npm run build`
2. Drag the `dist` folder to Netlify drop zone
3. Add environment variables in Site settings → Environment variables

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check for TypeScript errors
npm run build
```

### Images Not Loading

- Check image URLs are absolute
- Verify Supabase Storage bucket is public
- Use placeholder images for development

### 404 Errors on Refresh

Already solved! Using HashRouter (URLs like `/#/recipe/123`)

### Environment Variables Not Working

- Verify `.env` exists and has correct format
- Restart dev server after changing `.env`
- Check variable names start with `VITE_`
- For production, verify variables were set during build

### Slow Initial Load

Optimize:
1. Enable lazy loading (already done for images)
2. Code splitting (React Router does this automatically)
3. Compress images before upload
4. Use WebP format for images

## Monitoring & Analytics

### Add Google Analytics

1. Get GA4 tracking ID
2. Add to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Monitor Supabase Usage

- Check Supabase dashboard for:
  - Database size
  - API requests
  - Storage usage
  - Active users

## Maintenance

### Updating Content

Add recipes via admin dashboard - no redeployment needed!

### Code Updates

```bash
# Make changes
git add .
git commit -m "Update: description"
git push origin main

# Deploy
npm run deploy
```

### Supabase Migrations

For schema changes:
1. Update `SUPABASE_SCHEMA.sql`
2. Run new SQL in Supabase SQL Editor
3. Document in migrations folder (best practice)

## Backup Strategy

### Database Backups

Supabase Pro automatically backs up daily.

Free tier:
1. Go to Database → Backups
2. Manually download SQL dump
3. Store safely

### Code Backups

Already done! Git repository is your backup.

---

🎉 Your site is now live! Share it with the world!
