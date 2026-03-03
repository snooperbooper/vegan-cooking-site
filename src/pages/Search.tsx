import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, Clock, Users, X } from 'lucide-react';
import { supabase, type Recipe } from '../lib/supabase';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [mealType, setMealType] = useState(searchParams.get('meal_type') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [maxTime, setMaxTime] = useState(searchParams.get('max_time') || '');
  const [dietary, setDietary] = useState(searchParams.get('dietary') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let query = supabase.from('recipes').select('*');

      // Search query
      const searchTerm = searchParams.get('q');
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Filters
      const mealFilter = searchParams.get('meal_type');
      if (mealFilter) {
        query = query.contains('meal_type', [mealFilter]);
      }

      const difficultyFilter = searchParams.get('difficulty');
      if (difficultyFilter) {
        query = query.eq('difficulty', difficultyFilter);
      }

      const dietaryFilter = searchParams.get('dietary');
      if (dietaryFilter) {
        query = query.contains('dietary_tags', [dietaryFilter]);
      }

      const maxTimeFilter = searchParams.get('max_time');
      if (maxTimeFilter) {
        // This would need a computed column or SQL function in production
        query = query.lte('cook_time', parseInt(maxTimeFilter));
      }

      // Sorting
      const sort = searchParams.get('sort') || 'newest';
      switch (sort) {
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'quickest':
          query = query.order('cook_time', { ascending: true });
          break;
        case 'saves':
          query = query.order('saves', { ascending: false });
          break;
        default: // newest
          query = query.order('created_at', { ascending: false });
      }

      const { data } = await query.limit(100);
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (mealType) params.set('meal_type', mealType);
    if (difficulty) params.set('difficulty', difficulty);
    if (maxTime) params.set('max_time', maxTime);
    if (dietary) params.set('dietary', dietary);
    if (sortBy) params.set('sort', sortBy);

    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMealType('');
    setDifficulty('');
    setMaxTime('');
    setDietary('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = [mealType, difficulty, maxTime, dietary].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Search Recipes
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search for recipes..."
                className="input pl-10"
              />
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <button onClick={applyFilters} className="btn btn-primary">
              Search
            </button>
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                const params = new URLSearchParams(searchParams);
                params.set('sort', e.target.value);
                setSearchParams(params);
              }}
              className="input py-2 w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="quickest">Quickest</option>
              <option value="saves">Most Saved</option>
            </select>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="card p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Max Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Cooking Time
                </label>
                <select
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value)}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              {/* Dietary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="high-protein">High Protein</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="raw">Raw</option>
                  <option value="oil-free">Oil-Free</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={applyFilters} className="btn btn-primary">
                Apply Filters
              </button>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No recipes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Recipe Card Component
interface RecipeCardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Link to={`/recipe/${recipe.id}`} className="card overflow-hidden group">
      <div className="relative h-56 overflow-hidden">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {recipe.title}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-2">
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
