import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Plus, Home, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-wellness-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧘</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Wellness Platform</span>
          </Link>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 hover:text-gray-900">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 transition-colors">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/my-sessions" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 transition-colors">
                  <BookOpen size={18} />
                  <span>My Sessions</span>
                </Link>
                <Link to="/session/new" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 transition-colors">
                  <Plus size={18} />
                  <span>Create Session</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 border-t pt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 px-2 py-1">
              <div className="flex items-center space-x-2">
                <Home size={18} />
                <span>Dashboard</span>
              </div>
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/my-sessions" onClick={() => setMenuOpen(false)} className="block text-gray-700 px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={18} />
                    <span>My Sessions</span>
                  </div>
                </Link>
                <Link to="/session/new" onClick={() => setMenuOpen(false)} className="block text-gray-700 px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Create Session</span>
                  </div>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-2 py-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 px-2 py-1">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-gray-700 px-2 py-1">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
