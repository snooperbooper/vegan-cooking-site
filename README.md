# Vegan Cooking Website 🌱

A modern, full-featured vegan cooking website with recipes, search, comments, and admin dashboard.

## Features

### 🍳 Recipe Display
- Beautiful, responsive recipe cards with hero images
- Metric/Imperial conversion toggle
- Interactive ingredient checklist
- Step-by-step instructions with checkboxes
- Nutritional information display
- Print-friendly recipe view
- Save recipes to favorites
- Share recipes via social media

### 🔍 Search & Discovery
- Powerful search with instant results
- Filter by:
  - Meal type (breakfast, lunch, dinner, snacks, desserts)
  - Cooking time
  - Difficulty level
  - Dietary preferences (gluten-free, high-protein, raw, etc.)
- Sort by: newest, popular, quickest, most saved
- Category browsing

### 💬 Comments System
- Authentication-required commenting
- Like/dislike comments
- Nested replies support
- Edit own comments (with edit timestamp)
- Delete own comments
- Timestamp display

### 🛠️ "Tools & Products" Section
- Display kitchen tools/products used in videos
- Affiliate marketing links integration
- Product images and descriptions

### 🔐 Authentication
- Sign up / Sign in with Supabase Auth
- Email verification
- Password reset
- User profile pages
- Saved recipes list

### 👑 Admin Dashboard
- Protected admin routes
- Site metrics overview (users, views, engagement)
- Recipe management (create, edit, delete, upload images)
- Comment moderation (edit/remove any comment)
- User metrics display
- YouTube integration settings
- Manual recipe posting

### 📺 YouTube Integration
- Auto-fetch new videos from YouTube channel
- Parse video description for recipe data
- Embed videos in recipe pages
- Manual override option

### 🎨 Design
- Modern, colorful UI inspired by BBC Good Food & RecipeTin Eats
- Mobile-first responsive design
- Professional yet approachable feel
- Smooth animations and transitions
- Green/plant-based color scheme

### ⚡ Performance & SEO
- Recipe schema markup (JSON-LD) for Google
- Open Graph meta tags
- Lazy loading images
- Optimized bundle size
- Fast page loads
- GitHub Pages compatible

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Routing**: React Router v6
- **Hosting**: GitHub Pages

## Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd vegan-cooking-site
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get your credentials
3. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

1. Open Supabase SQL Editor
2. Copy the contents of `SUPABASE_SCHEMA.sql`
3. Run the SQL to create all tables, policies, and functions

### 4. Make Yourself Admin

After signing up on your site, run this in Supabase SQL Editor (replace with your email):

```sql
UPDATE user_profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
```

### 5. Enable Supabase Storage (Optional)

If you want image uploads:

1. Go to Supabase Storage
2. Create a bucket called `recipe-images`
3. Set it to public
4. Add upload policies for authenticated users

### 6. Development

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment to GitHub Pages

### 1. Update Vite Config

The `vite.config.ts` is already configured for GitHub Pages with HashRouter.

### 2. Update Package.json

Add your GitHub repo URL:

```json
{
  "homepage": "https://your-username.github.io/your-repo-name"
}
```

### 3. Build & Deploy

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy scripts to package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### 4. Configure GitHub Pages

1. Go to your GitHub repo
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

Your site will be live at `https://your-username.github.io/your-repo-name`

## Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For GitHub Pages deployment, you can use GitHub Secrets:
1. Go to repo Settings → Secrets and variables → Actions
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Use in GitHub Actions workflow (optional)

## YouTube Integration Setup

### Option 1: Manual Posting
Use the admin dashboard to manually add recipes with YouTube video IDs.

### Option 2: YouTube API (Future Enhancement)
1. Get YouTube Data API key from Google Cloud Console
2. Create a serverless function (Supabase Edge Functions or Vercel)
3. Set up webhook or cron job to check for new videos
4. Parse video description and auto-create recipe entries

## Features Roadmap

- [ ] Recipe of the Day
- [ ] Newsletter integration
- [ ] Shopping list generator
- [ ] Cooking timer
- [ ] Recipe rating system
- [ ] User-uploaded recipes
- [ ] Social login (Google, Facebook)
- [ ] Recipe collections/meal plans
- [ ] Nutrition calculator
- [ ] Print multiple recipes at once

## Customization

### Branding
- Update site name in:
  - `src/components/Layout/Header.tsx`
  - `src/components/Layout/Footer.tsx`
  - `src/pages/Auth.tsx`
  - `index.html` (title tag)
- Replace color scheme in `tailwind.config.js`

### Add Sample Data
Run the sample INSERT queries in `SUPABASE_SCHEMA.sql` or create your own recipes via the admin dashboard.

## Troubleshooting

### Images not loading
- Check Supabase Storage is set up
- Verify image URLs are accessible
- Use placeholder images during development

### Auth issues
- Verify Supabase credentials in `.env`
- Check Supabase Auth is enabled
- Confirm email templates are set up

### GitHub Pages 404 errors
- Ensure you're using HashRouter (already configured)
- Check `base` in `vite.config.ts` matches your repo name
- Verify `gh-pages` branch exists

## License

MIT License - feel free to use for your own projects!

## Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for plant-based food lovers everywhere 🌱
