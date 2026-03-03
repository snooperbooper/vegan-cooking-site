import { createClient } from '@supabase/supabase-js';

// These should be in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  meal_type: string[];
  dietary_tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  nutrition?: NutritionInfo;
  youtube_video_id?: string;
  created_at: string;
  updated_at: string;
  views: number;
  saves: number;
}

export interface Ingredient {
  item: string;
  amount_metric: string;
  amount_imperial: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  user_email: string;
  content: string;
  likes: number;
  dislikes: number;
  parent_id?: string;
  edited_at?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  affiliate_link: string;
  category: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}
