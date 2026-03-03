import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck, Printer, Share2, ThumbsUp, MessageCircle } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase, type Recipe, type Comment as CommentType, type Product } from '../lib/supabase';

interface Props {
  user: User | null;
}

export default function RecipeDetail({ user }: Props) {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [useMetric, setUseMetric] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRecipe();
      fetchComments();
      fetchProducts();
      checkIfSaved();
      incrementViews();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', id)
      .order('created_at', { ascending: false });
    setComments(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('recipe_products')
      .select('products(*)')
      .eq('recipe_id', id);
    setProducts(data?.map((item: any) => item.products).filter(Boolean) || []);
  };

  const checkIfSaved = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user.id)
      .eq('recipe_id', id)
      .single();
    setIsSaved(!!data);
  };

  const incrementViews = async () => {
    await supabase.rpc('increment_views', { recipe_id: id });
  };

  const toggleSave = async () => {
    if (!user) {
      alert('Please sign in to save recipes');
      return;
    }

    if (isSaved) {
      await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', id);
      setIsSaved(false);
    } else {
      await supabase
        .from('saved_recipes')
        .insert({ user_id: user.id, recipe_id: id });
      setIsSaved(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to comment');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await supabase.from('comments').insert({
        recipe_id: id,
        user_id: user.id,
        user_email: user.email,
        content: newComment,
        likes: 0,
        dislikes: 0,
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden no-print">
        <img
          src={recipe.image_url || 'https://via.placeholder.com/1200x600?text=Recipe+Image'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.meal_type.map(type => (
                <span key={type} className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {recipe.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">{recipe.description}</p>
          </div>
        </div>
      </div>

      {/* Recipe Actions */}
      <div className="bg-white border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="h-5 w-5" />
                <span>{totalTime} min</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <ChefHat className="h-5 w-5" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleSave} className="btn btn-secondary">
                {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </button>
              <button onClick={handlePrint} className="btn btn-secondary">
                <Printer className="h-5 w-5" />
              </button>
              <button onClick={handleShare} className="btn btn-secondary">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <section className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-display font-bold text-gray-900">Ingredients</h2>
                <button
                  onClick={() => setUseMetric(!useMetric)}
                  className="btn btn-secondary text-sm"
                >
                  {useMetric ? 'Metric' : 'Imperial'}
                </button>
              </div>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={checkedIngredients.has(index)}
                      onChange={() => {
                        const newChecked = new Set(checkedIngredients);
                        if (newChecked.has(index)) {
                          newChecked.delete(index);
                        } else {
                          newChecked.add(index);
                        }
                        setCheckedIngredients(newChecked);
                      }}
                      className="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className={checkedIngredients.has(index) ? 'line-through text-gray-400' : 'text-gray-700'}>
                      <strong>{useMetric ? ingredient.amount_metric : ingredient.amount_imperial}</strong> {ingredient.item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section className="card p-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={checkedSteps.has(index)}
                      onChange={() => {
                        const newChecked = new Set(checkedSteps);
                        if (newChecked.has(index)) {
                          newChecked.delete(index);
                        } else {
                          newChecked.add(index);
                        }
                        setCheckedSteps(newChecked);
                      }}
                      className="mt-1 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <span className="inline-block w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-center font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className={checkedSteps.has(index) ? 'line-through text-gray-400' : 'text-gray-700'}>
                        {step}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Nutrition */}
            {recipe.nutrition && (
              <section className="card p-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Nutrition (per serving)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-xl font-semibold text-gray-900">{recipe.nutrition.calories}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-semibold text-gray-900">{recipe.nutrition.protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-semibold text-gray-900">{recipe.nutrition.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-xl font-semibold text-gray-900">{recipe.nutrition.fat}g</p>
                  </div>
                </div>
              </section>
            )}

            {/* Comments */}
            <section className="card p-6 no-print">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                <MessageCircle className="inline h-6 w-6 mr-2" />
                Comments ({comments.length})
              </h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={submitComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className="input min-h-[100px]"
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="btn btn-primary mt-2"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    <Link to="/auth" className="text-primary-600 font-medium hover:underline">
                      Sign in
                    </Link>{' '}
                    to leave a comment
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{comment.user_email}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-primary-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* YouTube Video */}
            {recipe.youtube_video_id && (
              <div className="card p-4 no-print">
                <h3 className="font-semibold text-gray-900 mb-3">Watch Video</h3>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${recipe.youtube_video_id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <div className="card p-4 no-print">
                <h3 className="font-semibold text-gray-900 mb-3">Tools & Products Used</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex space-x-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                        <a
                          href={product.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline"
                        >
                          View Product →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
