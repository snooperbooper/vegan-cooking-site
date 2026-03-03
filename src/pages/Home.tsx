import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, TrendingUp, ChefHat } from 'lucide-react';
import { supabase, type Recipe } from '../lib/supabase';

export default function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // Fetch featured (recent) recipes
      const { data: featured } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch popular recipes
      const { data: popular } = await supabase
        .from('recipes')
        .select('*')
        .order('views', { ascending: false })
        .limit(4);

      setFeaturedRecipes(featured || []);
      setPopularRecipes(popular || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              Delicious <span className="text-primary-600">Vegan</span> Recipes
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Plant-based cooking made simple and delicious. Explore hundreds of recipes from quick weeknight dinners to impressive weekend feasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="btn btn-primary text-lg px-8 py-3">
                Explore Recipes
              </Link>
              <a href="#featured" className="btn btn-secondary text-lg px-8 py-3">
                See What's New
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <ChefHat className="h-12 w-12 text-primary-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Vegan Recipes</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Users className="h-12 w-12 text-accent-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">50K+</h3>
              <p className="text-gray-600">Community Members</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900">1M+</h3>
              <p className="text-gray-600">Monthly Views</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
            Latest Recipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
            Most Popular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks', 'Salads', 'Soups'].map((category) => (
              <Link
                key={category}
                to={`/search?meal_type=${category.toLowerCase()}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Recipe Card Component
interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Link to={`/recipe/${recipe.id}`} className="card overflow-hidden group">
      <div className={`relative ${compact ? 'h-40' : 'h-56'} overflow-hidden`}>
        <img
          src={recipe.image_url || 'https://via.placeholder.com/400x300?text=Recipe+Image'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium">
          {recipe.difficulty}
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-base' : 'text-lg'}`}>
          {recipe.title}
        </h3>
        <p className={`text-gray-600 mb-3 ${compact ? 'text-sm' : ''} line-clamp-2`}>
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
