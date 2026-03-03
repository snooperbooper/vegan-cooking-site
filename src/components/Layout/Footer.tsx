import { ChefHat, Instagram, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-display font-bold text-white">
                We Cook Vegan
              </span>
            </div>
            <p className="text-sm">
              Delicious plant-based recipes for everyone. From quick weeknight dinners to impressive weekend feasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary-400">All Recipes</Link>
              </li>
              <li>
                <Link to="/search?meal_type=breakfast" className="hover:text-primary-400">Breakfast</Link>
              </li>
              <li>
                <Link to="/search?meal_type=lunch" className="hover:text-primary-400">Lunch</Link>
              </li>
              <li>
                <Link to="/search?meal_type=dinner" className="hover:text-primary-400">Dinner</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search?dietary=gluten-free" className="hover:text-primary-400">Gluten-Free</Link>
              </li>
              <li>
                <Link to="/search?dietary=high-protein" className="hover:text-primary-400">High Protein</Link>
              </li>
              <li>
                <Link to="/search?dietary=raw" className="hover:text-primary-400">Raw Vegan</Link>
              </li>
              <li>
                <Link to="/search?difficulty=Easy" className="hover:text-primary-400">Quick & Easy</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400" aria-label="YouTube">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-400" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-primary-400" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-4 text-sm">
              Subscribe to our newsletter for weekly recipes delivered to your inbox!
            </p>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Your email"
                className="input text-sm"
              />
              <button className="btn btn-primary w-full mt-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} We Cook Vegan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
