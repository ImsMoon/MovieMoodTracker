import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Tv, Star, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { setUser, setAuthenticated, user } = useApp();
  const [showIMDBModal, setShowIMDBModal] = useState(false);
  const [showRTModal, setShowRTModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const createDefaultUser = (): UserProfile => ({
    id: `user_${Date.now()}`,
    name: 'Movie Buff',
    email: 'moviebuff@gmail.com',
    avatar: undefined,
    imdbConnected: false,
    rtConnected: false,
    joinedAt: new Date().toISOString(),
  });

  const handleSocialLogin = (provider: string) => {
    // Platform connection flows
    if (provider.startsWith('imdb-')) {
      const currentUser = user || createDefaultUser();
      const updatedUser: UserProfile = {
        ...currentUser,
        imdbConnected: true,
        imdbUsername: credentials.email ? credentials.email.split('@')[0] : 'imdb_user',
      };
      setUser(updatedUser);
      if (!user) {
        setAuthenticated(true);
        onLoginSuccess();
      }
      setShowIMDBModal(false);
      setCredentials({ email: '', password: '' });
      return;
    }

    if (provider.startsWith('rt-')) {
      const currentUser = user || createDefaultUser();
      const updatedUser: UserProfile = {
        ...currentUser,
        rtConnected: true,
        rtUsername: credentials.email ? credentials.email.split('@')[0] : 'rt_user',
      };
      setUser(updatedUser);
      if (!user) {
        setAuthenticated(true);
        onLoginSuccess();
      }
      setShowRTModal(false);
      setCredentials({ email: '', password: '' });
      return;
    }

    // Regular social login
    const nameMap: Record<string, string> = {
      google: 'Movie Buff',
      apple: 'Cinema Lover',
      facebook: 'Film Fan',
      demo: 'Demo User',
    };

    const mockUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: nameMap[provider] || 'User',
      email: `${provider}@example.com`,
      avatar: undefined,
      imdbConnected: false,
      rtConnected: false,
      joinedAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setAuthenticated(true);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg"
          >
            <Film className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">MoodFlix</h1>
          <p className="text-gray-300">Track your mood through the movies you watch</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Sign in to get started
          </h2>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-gray-400 text-sm">or connect platforms</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Platform Connect Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowIMDBModal(true)}
              className="w-full flex items-center justify-center gap-3 bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Star className="w-5 h-5" />
              Connect IMDB Account
            </button>

            <button
              onClick={() => setShowRTModal(true)}
              className="w-full flex items-center justify-center gap-3 bg-[#FA320A] hover:bg-[#e62d08] text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="w-5 h-5" />
              Connect Rotten Tomatoes
            </button>
          </div>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => handleSocialLogin('demo')}
              className="w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
            >
              Skip → Continue as Demo User
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="text-gray-300">
            <span className="text-2xl block mb-1">🎭</span>
            <p className="text-xs">Track Moods</p>
          </div>
          <div className="text-gray-300">
            <span className="text-2xl block mb-1">📅</span>
            <p className="text-xs">Mood Calendar</p>
          </div>
          <div className="text-gray-300">
            <span className="text-2xl block mb-1">📊</span>
            <p className="text-xs">Vendor Insights</p>
          </div>
        </motion.div>
      </motion.div>

      {/* IMDB Login Modal */}
      {showIMDBModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#F5C518]">Connect IMDB</h3>
              <button onClick={() => setShowIMDBModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Sign in with your IMDB account to sync ratings. We support social login via Amazon, Google, or Facebook.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleSocialLogin('imdb-amazon')}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#e68a00] text-black font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Amazon (IMDB)
                </button>
                <button
                  onClick={() => handleSocialLogin('imdb-google')}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Google
                </button>
                <button
                  onClick={() => handleSocialLogin('imdb-facebook')}
                  className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Facebook
                </button>
              </div>
              <div className="text-center">
                <span className="text-gray-500 text-xs">or use email</span>
              </div>
              <input
                type="email"
                placeholder="IMDB Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C518]"
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#F5C518]"
              />
              <button
                onClick={() => handleSocialLogin('imdb-email')}
                className="w-full bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium py-2.5 rounded-lg transition-all"
              >
                Connect IMDB
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rotten Tomatoes Login Modal */}
      {showRTModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#FA320A]">Connect Rotten Tomatoes</h3>
              <button onClick={() => setShowRTModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Sign in with your Rotten Tomatoes account to sync ratings. We support social login via Google, Facebook, or Apple.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleSocialLogin('rt-google')}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Google
                </button>
                <button
                  onClick={() => handleSocialLogin('rt-facebook')}
                  className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Facebook
                </button>
                <button
                  onClick={() => handleSocialLogin('rt-apple')}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                >
                  Sign in with Apple
                </button>
              </div>
              <div className="text-center">
                <span className="text-gray-500 text-xs">or use email</span>
              </div>
              <input
                type="email"
                placeholder="Rotten Tomatoes Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#FA320A]"
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#FA320A]"
              />
              <button
                onClick={() => handleSocialLogin('rt-email')}
                className="w-full bg-[#FA320A] hover:bg-[#e62d08] text-white font-medium py-2.5 rounded-lg transition-all"
              >
                Connect Rotten Tomatoes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
