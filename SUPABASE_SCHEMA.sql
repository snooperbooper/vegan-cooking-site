-- Vegan Cooking Website Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Recipes Table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER NOT NULL, -- in minutes
  cook_time INTEGER NOT NULL, -- in minutes
  servings INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  meal_type TEXT[] DEFAULT '{}', -- breakfast, lunch, dinner, snack, dessert
  dietary_tags TEXT[] DEFAULT '{}', -- gluten-free, high-protein, etc.
  ingredients JSONB NOT NULL DEFAULT '[]', -- [{item, amount_metric, amount_imperial}]
  steps TEXT[] NOT NULL DEFAULT '{}',
  nutrition JSONB, -- {calories, protein, carbs, fat, fiber}
  youtube_video_id TEXT,
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Recipes policies (public read, admin write)
CREATE POLICY "Anyone can view recipes" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert recipes" ON recipes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update recipes" ON recipes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete recipes" ON recipes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Comments Table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested replies
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments OR admins can delete any" ON comments
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Products Table (for affiliate marketing)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  affiliate_link TEXT NOT NULL,
  category TEXT, -- knives, dishes, appliances, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Recipe-Products Junction Table
CREATE TABLE recipe_products (
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, product_id)
);

-- Enable RLS on recipe_products
ALTER TABLE recipe_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recipe products" ON recipe_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage recipe products" ON recipe_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Saved Recipes Table
CREATE TABLE saved_recipes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Enable RLS on saved_recipes
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved recipes" ON saved_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes" ON saved_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave recipes" ON saved_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Function to increment recipe views
CREATE OR REPLACE FUNCTION increment_views(recipe_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE recipes
  SET views = views + 1
  WHERE id = recipe_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update recipe updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert some sample data (optional - remove if not needed)
-- Sample Recipe
INSERT INTO recipes (
  title,
  description,
  image_url,
  prep_time,
  cook_time,
  servings,
  difficulty,
  meal_type,
  dietary_tags,
  ingredients,
  steps,
  nutrition
) VALUES (
  'Creamy Vegan Pasta',
  'A delicious and creamy vegan pasta dish made with cashew cream sauce.',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  10,
  15,
  4,
  'Easy',
  ARRAY['dinner', 'lunch'],
  ARRAY['high-protein', 'gluten-free-option'],
  '[
    {"item": "pasta", "amount_metric": "400g", "amount_imperial": "14 oz"},
    {"item": "cashews (soaked)", "amount_metric": "1 cup", "amount_imperial": "1 cup"},
    {"item": "garlic cloves", "amount_metric": "3", "amount_imperial": "3"},
    {"item": "nutritional yeast", "amount_metric": "2 tbsp", "amount_imperial": "2 tbsp"},
    {"item": "lemon juice", "amount_metric": "2 tbsp", "amount_imperial": "2 tbsp"}
  ]'::jsonb,
  ARRAY[
    'Cook pasta according to package instructions.',
    'Blend soaked cashews, garlic, nutritional yeast, lemon juice, and 1 cup of water until smooth.',
    'Drain pasta and return to pot.',
    'Pour sauce over pasta and stir to coat.',
    'Serve hot with fresh herbs and black pepper.'
  ],
  '{"calories": 450, "protein": 15, "carbs": 65, "fat": 18}'::jsonb
);

-- Create an admin user (replace with your email)
-- After signup, run this to make yourself admin:
-- UPDATE user_profiles SET is_admin = TRUE WHERE email = 'your-email@example.com';
