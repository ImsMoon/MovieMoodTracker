import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Wishlist from './components/Wishlist';
import RatedMovies from './components/RatedMovies';
import Profile from './components/Profile';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentView, setAuthenticated } = useApp();

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'wishlist':
        return <Wishlist />;
      case 'rated':
        return <RatedMovies />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
