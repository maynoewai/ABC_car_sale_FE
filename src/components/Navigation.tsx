import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in via localStorage token
  const accessToken = localStorage.getItem('access_token');
  const isLoggedIn = Boolean(accessToken);

  // Get user role from localStorage (e.g., "admin" or "user")
  const userRole = localStorage.getItem('user_role') || 'user';

  // Determine dashboard route based on user role
  const dashboardRoute = userRole === 'admin' ? '/admin' : '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role'); // also clear the role if stored
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-display font-bold">ABC Cars</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/cars/list" className="text-gray-700 hover:text-primary-600">
              Browse Cars
            </Link>
            <Link to="/sell-car" className="text-gray-700 hover:text-primary-600">
              Sell Your Car
            </Link>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate(dashboardRoute)}
                  className="flex items-center text-gray-700 hover:text-primary-600"
                >
                  <User className="h-6 w-6 mr-1" />
                  Dashboard
                </button>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('md:hidden', isOpen ? 'block' : 'hidden')}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/cars/list"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          >
            Browse Cars
          </Link>
          <Link
            to="/sell-car"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          >
            Sell Your Car
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to={dashboardRoute}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-primary-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-primary-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
