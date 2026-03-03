# YouTube Integration Guide

## Option 1: Quick Setup (Use the Script)

I've created a script to automatically fetch and add all videos from the We Cook Vegan channel.

### Step 1: Get YouTube API Key (Free)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project (if needed)
3. Click "Create Credentials" → "API Key"
4. Enable "YouTube Data API v3"
5. Copy your API key

### Step 2: Run the Script

```bash
cd /root/.openclaw/workspace/vegan-cooking-site
npm install node-fetch
node add-youtube-recipes.js YOUR_YOUTUBE_API_KEY
```

This will:
- ✅ Fetch all videos from @WeCookVegan
- ✅ Add them as recipes with thumbnails
- ✅ Link YouTube video IDs
- ✅ Skip duplicates

**Quota:** 10,000 API calls/day (plenty for daily sync)

---

## Option 2: Manual Add (Quick Test)

Add videos one at a time via admin dashboard:

1. Go to: https://snooperbooper.github.io/vegan-cooking-site/admin
2. Click "Add Recipe"
3. Fill in details
4. Add YouTube video ID (from URL: `youtube.com/watch?v=VIDEO_ID`)

---

## Option 3: Auto-Sync (Advanced)

Set up a cron job to auto-fetch new videos daily:

```bash
# Add to crontab
0 6 * * * cd /root/.openclaw/workspace/vegan-cooking-site && node add-youtube-recipes.js YOUR_API_KEY >> logs/youtube-sync.log 2>&1
```

Or use GitHub Actions for automated updates!

---

## Channel Info

**Channel:** We Cook Vegan
**URL:** https://www.youtube.com/@WeCookVegan
**Handle:** @WeCookVegan

---

## Next Steps

1. Get YouTube API key (5 minutes)
2. Run the script
3. Watch your site populate with recipes! 🎉

All recipes will have:
- ✅ Video thumbnails
- ✅ YouTube video embedded
- ✅ Title & description
- ✅ Default cooking times (can edit manually)
