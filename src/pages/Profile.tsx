import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Bookmark, Settings } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase, type Recipe } from '../lib/supabase';

interface Props {
  user: User | null;
}

export default function Profile({ user }: Props) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    try {
      const { data } = await supabase
        .from('saved_recipes')
        .select('recipes(*)')
        .eq('user_id', user!.id);

      setSavedRecipes(data?.map((item: any) => item.recipes) || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button className="btn btn-secondary">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Saved Recipes */}
        <div className="card p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Bookmark className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Saved Recipes ({savedRecipes.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : savedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't saved any recipes yet</p>
              <Link to="/search" className="btn btn-primary">
                Browse Recipes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  className="card overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.image_url || 'https://via.placeholder.com/400x300?text=Recipe+Image'}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
