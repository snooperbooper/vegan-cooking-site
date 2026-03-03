# Quick Deploy Guide 🚀

## ✅ What's Ready
- **Location:** `/root/.openclaw/workspace/vegan-cooking-site/`
- **Built:** Production build in `dist/` folder
- **Configured:** Supabase credentials already set
- **Tested:** Build successful (450 KB)

## Option 1: GitHub Pages (Recommended)

### Step 1: Create GitHub Personal Access Token with Push Permissions
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Vegan Cooking Site Deploy"
4. Select scopes:
   - ✅ `repo` (all permissions)
   - ✅ `workflow`
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Deploy from Server
```bash
cd /root/.openclaw/workspace/vegan-cooking-site

# Set up git credentials (replace YOUR_NEW_TOKEN)
git remote set-url origin https://snooperbooper:YOUR_NEW_TOKEN@github.com/snooperbooper/vegan-cooking-site.git

# Install gh-pages if not already
npm install -D gh-pages

# Deploy!
npm run deploy
```

### Step 3: Enable GitHub Pages
1. Go to https://github.com/snooperbooper/vegan-cooking-site/settings/pages
2. Source: `gh-pages` branch, `/ (root)`
3. Save

**Your site will be live at:** `https://snooperbooper.github.io/vegan-cooking-site/`

---

## Option 2: Manual Upload to GitHub

If you prefer not to use tokens:

### From Your Computer:
1. Download the entire folder: `/root/.openclaw/workspace/vegan-cooking-site/`
2. On your computer:
```bash
cd path/to/vegan-cooking-site
git remote set-url origin https://github.com/snooperbooper/vegan-cooking-site.git
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

---

## Option 3: Quick Demo Server (Test Locally First)

Start a local server to preview:

```bash
cd /root/.openclaw/workspace/vegan-cooking-site/dist
python3 -m http.server 8080
```

Then visit: `http://SERVER_IP:8080`

---

## Supabase Setup

### Step 1: Set Up Database

1. Go to https://supabase.com/dashboard/project/sbgjifbshdiezvvlerfs
2. SQL Editor → New Query
3. Copy contents of `SUPABASE_SCHEMA.sql`
4. Run it

### Step 2: Make Yourself Admin

After signing up on the site, run in SQL Editor:

```sql
UPDATE user_profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';
```

---

## What's Already Configured

✅ Supabase Project: https://sbgjifbshdiezvvlerfs.supabase.co
✅ Environment variables set in `.env`
✅ GitHub repo created: https://github.com/snooperbooper/vegan-cooking-site
✅ Production build ready in `dist/`
✅ All dependencies installed

---

## Quick Test Before Deploy

```bash
cd /root/.openclaw/workspace/vegan-cooking-site
npm run preview
```

Access the preview URL shown (usually http://localhost:4173)

---

## Troubleshooting

### Can't push to GitHub?
- Make sure your PAT has `repo` scope
- Try: `git config credential.helper store`

### Site shows errors?
- Database schema needs to be run in Supabase first
- Check console for specific errors

### Need help?
Just ask! I'm here. 🦞

---

**Total time to deploy: ~10 minutes**
