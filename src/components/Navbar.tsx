import React from 'react';
import { Film, Heart, User, Star, LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';

const Navbar: React.FC = () => {
  const { user, currentView, setCurrentView, logout, ratings, wishlist } = useApp();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Discover', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'rated', label: 'Rated', icon: <Star className="w-5 h-5" />, count: ratings.length },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" />, count: wishlist.length },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">MovieTracker</span>
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-300 hidden lg:block">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
