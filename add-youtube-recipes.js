#!/usr/bin/env node
/**
 * Fetch videos from We Cook Vegan YouTube channel and add to database
 * 
 * Requirements:
 * - YouTube Data API key (get from: https://console.cloud.google.com)
 * - npm install node-fetch
 * 
 * Usage:
 * node add-youtube-recipes.js YOUR_YOUTUBE_API_KEY
 */

const CHANNEL_HANDLE = '@WeCookVegan';
const SUPABASE_URL = 'https://hfuojohbdeqlbubhiwvn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdW9qb2hiZGVxbGJ1Ymhpd3ZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU1Njc5NywiZXhwIjoyMDg4MTMyNzk3fQ.JDte5ZvzVYWpNCcQWwZolfEnhnWSRuZRXZY3KbJ0K-I';

async function main() {
  const apiKey = process.argv[2];
  
  if (!apiKey) {
    console.error('❌ YouTube API key required!');
    console.error('');
    console.error('Get one at: https://console.cloud.google.com/apis/credentials');
    console.error('Enable: YouTube Data API v3');
    console.error('');
    console.error('Usage: node add-youtube-recipes.js YOUR_API_KEY');
    process.exit(1);
  }

  console.log('🔍 Fetching We Cook Vegan channel...');
  
  // Step 1: Get channel ID from handle
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${CHANNEL_HANDLE}&type=channel&key=${apiKey}`
  );
  const searchData = await searchRes.json();
  
  if (!searchData.items || searchData.items.length === 0) {
    console.error('❌ Channel not found!');
    process.exit(1);
  }
  
  const channelId = searchData.items[0].id.channelId;
  console.log(`✅ Found channel: ${channelId}`);
  
  // Step 2: Get recent videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${apiKey}`
  );
  const videosData = await videosRes.json();
  
  console.log(`📹 Found ${videosData.items.length} videos`);
  
  // Step 3: Add each video as a recipe
  let added = 0;
  let skipped = 0;
  
  for (const video of videosData.items) {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const description = video.snippet.description;
    const thumbnail = video.snippet.thumbnails.high.url;
    
    // Skip if already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/recipes?youtube_video_id=eq.${videoId}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = await checkRes.json();
    
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    
    // Create recipe from video
    const recipe = {
      title: title,
      description: description.substring(0, 500) || 'Delicious vegan recipe from We Cook Vegan',
      image_url: thumbnail,
      prep_time: 15, // Default, can be updated manually
      cook_time: 30, // Default, can be updated manually
      servings: 4,
      difficulty: 'Medium',
      meal_type: ['dinner'],
      dietary_tags: ['vegan'],
      ingredients: [
        { item: 'See video for ingredients', amount_metric: '', amount_imperial: '' }
      ],
      steps: ['Watch the video for detailed instructions'],
      youtube_video_id: videoId,
      views: 0,
      saves: 0
    };
    
    const addRes = await fetch(
      `${SUPABASE_URL}/rest/v1/recipes`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(recipe)
      }
    );
    
    if (addRes.ok) {
      console.log(`✅ Added: ${title}`);
      added++;
    } else {
      console.error(`❌ Failed: ${title}`, await addRes.text());
    }
  }
  
  console.log('');
  console.log('🎉 Done!');
  console.log(`✅ Added: ${added} recipes`);
  console.log(`⏭️  Skipped: ${skipped} (already exist)`);
  console.log('');
  console.log('Visit: https://snooperbooper.github.io/vegan-cooking-site/');
}

main().catch(console.error);
