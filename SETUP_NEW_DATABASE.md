# 🗄️ Setup New Supabase Database

Your site is redeployed with the new Supabase project!

**Live at:** https://snooperbooper.github.io/vegan-cooking-site/

---

## Step 1: Run Database Schema

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/hfuojohbdeqlbubhiwvn/sql/new

2. **Copy & Paste** the entire contents of:
   `/root/.openclaw/workspace/vegan-cooking-site/SUPABASE_SCHEMA.sql`

3. **Click "Run"** (green button or Ctrl/Cmd + Enter)

✅ You should see: "Success. No rows returned"

---

## Step 2: Create Your Account

1. Visit: **https://snooperbooper.github.io/vegan-cooking-site/**
2. Click **"Sign In"** → **"Sign up"**
3. Enter your email & password
4. Check your email for verification (if required)

---

## Step 3: Make Yourself Admin

Back in Supabase SQL Editor, run this (replace with YOUR email):

```sql
UPDATE user_profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';
```

---

## 🎉 You're All Set!

Now you can:
- ✅ Access admin dashboard at `/admin`
- ✅ Add recipes with images
- ✅ Manage comments
- ✅ View site analytics
- ✅ Upload YouTube videos

The schema includes 1 sample recipe to test with!

---

**New Supabase Project:** https://supabase.com/dashboard/project/hfuojohbdeqlbubhiwvn

**Configured with:**
- URL: https://hfuojohbdeqlbubhiwvn.supabase.co
- Public key: sb_publishable_t5xK7FPSTiaaXAmEV_mnKQ_t_kr-8os ✅

Everything is ready to go! 🦞
