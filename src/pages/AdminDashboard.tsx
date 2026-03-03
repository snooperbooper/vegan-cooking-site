import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Eye, Bookmark, MessageCircle, Plus, Trash2, Edit } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase, type Recipe, type Comment as CommentType } from '../lib/supabase';

interface Props {
  user: User | null;
}

export default function AdminDashboard({ user }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'comments'>('overview');
  
  // Stats
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalViews: 0,
    totalComments: 0,
  });
  
  // Recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // Comments
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'overview') {
        fetchStats();
      } else if (activeTab === 'recipes') {
        fetchRecipes();
      } else if (activeTab === 'comments') {
        fetchComments();
      }
    }
  }, [isAdmin, activeTab]);

  const checkAdminStatus = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user!.id)
        .single();
      
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total recipes
      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Total users
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Total views (sum)
      const { data: viewsData } = await supabase
        .from('recipes')
        .select('views');
      const totalViews = viewsData?.reduce((sum, r) => sum + r.views, 0) || 0;

      // Total comments
      const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalRecipes: recipeCount || 0,
        totalUsers: userCount || 0,
        totalViews: totalViews,
        totalComments: commentCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecipes = async () => {
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    setRecipes(data || []);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, recipes(title)')
      .order('created_at', { ascending: false });
    setComments(data || []);
  };

  const deleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    await supabase.from('recipes').delete().eq('id', id);
    fetchRecipes();
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    await supabase.from('comments').delete().eq('id', id);
    fetchComments();
  };

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your recipes, users, and content</p>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'recipes'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recipes
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'comments'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Comments
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Total Recipes</h3>
                    <MessageCircle className="h-8 w-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalRecipes}</p>
                </div>

                <div className="bg-accent-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Total Users</h3>
                    <Users className="h-8 w-8 text-accent-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Total Views</h3>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">Total Comments</h3>
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalComments}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-primary flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Recipe</span>
                  </button>
                  <button className="btn btn-secondary">
                    Sync YouTube Channel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Recipes ({recipes.length})
                </h2>
                <button className="btn btn-primary flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Recipe</span>
                </button>
              </div>

              <div className="space-y-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={recipe.image_url || 'https://via.placeholder.com/100'}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{recipe.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Bookmark className="h-4 w-4" />
                            <span>{recipe.saves} saves</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-secondary p-2">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRecipe(recipe.id)}
                        className="btn btn-secondary p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                All Comments ({comments.length})
              </h2>

              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-gray-900">{comment.user_email}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          on {comment.recipes?.title || 'Unknown Recipe'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="btn btn-secondary p-2 text-sm">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="btn btn-secondary p-2 text-red-600 hover:bg-red-50 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
