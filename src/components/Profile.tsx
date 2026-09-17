import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Heart, CheckCircle, XCircle, Link2, Unlink, Shield, LogOut, Settings, Film, Tv, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { user, ratings, wishlist, logout, setUser } = useApp();
  const [showConnectIMDB, setShowConnectIMDB] = useState(false);
  const [showConnectRT, setShowConnectRT] = useState(false);

  const handleConnectIMDB = () => {
    if (user) {
      setUser({
        ...user,
        imdbConnected: true,
        imdbUsername: user.imdbUsername || 'movie_buff',
      });
    }
    setShowConnectIMDB(false);
  };

  const handleDisconnectIMDB = () => {
    if (user) {
      setUser({
        ...user,
        imdbConnected: false,
        imdbUsername: undefined,
      });
    }
  };

  const handleConnectRT = () => {
    if (user) {
      setUser({
        ...user,
        rtConnected: true,
        rtUsername: user.rtUsername || 'cinephile',
      });
    }
    setShowConnectRT(false);
  };

  const handleDisconnectRT = () => {
    if (user) {
      setUser({
        ...user,
        rtConnected: false,
        rtUsername: undefined,
      });
    }
  };

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0';

  const syncedIMDB = ratings.filter(r => r.syncedToIMDB).length;
  const syncedRT = ratings.filter(r => r.syncedToRT).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
            <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4 text-center"
        >
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{ratings.length}</p>
          <p className="text-gray-400 text-xs">Movies Rated</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4 text-center"
        >
          <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{wishlist.length}</p>
          <p className="text-gray-400 text-xs">In Wishlist</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4 text-center"
        >
          <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{avgRating}</p>
          <p className="text-gray-400 text-xs">Avg Rating</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4 text-center"
        >
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{syncedIMDB + syncedRT}</p>
          <p className="text-gray-400 text-xs">Total Syncs</p>
        </motion.div>
      </div>

      {/* Connected Platforms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-purple-400" />
          Connected Platforms
        </h2>

        <div className="space-y-4">
          {/* IMDB */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5C518] rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-white font-medium">IMDB</p>
                <p className="text-gray-400 text-sm">
                  {user?.imdbConnected
                    ? `Connected as @${user.imdbUsername}`
                    : 'Not connected'}
                </p>
              </div>
            </div>
            {user?.imdbConnected ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
                <button
                  onClick={handleDisconnectIMDB}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Disconnect"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectIMDB}
                className="flex items-center gap-2 bg-[#F5C518]/20 hover:bg-[#F5C518]/30 text-[#F5C518] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Link2 className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>

          {/* Rotten Tomatoes */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FA320A] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Rotten Tomatoes</p>
                <p className="text-gray-400 text-sm">
                  {user?.rtConnected
                    ? `Connected as @${user.rtUsername}`
                    : 'Not connected'}
                </p>
              </div>
            </div>
            {user?.rtConnected ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
                <button
                  onClick={handleDisconnectRT}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Disconnect"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectRT}
                className="flex items-center gap-2 bg-[#FA320A]/20 hover:bg-[#FA320A]/30 text-[#FA320A] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Link2 className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Sync Info */}
        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <p className="text-blue-300 text-sm flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              When connected, your ratings will be automatically synced to IMDB and Rotten Tomatoes. 
              We support social login (Google, Facebook, Apple) for both platforms. 
              Your data is stored locally and synced securely.
            </span>
          </p>
        </div>
      </motion.div>

      {/* Sync History */}
      {ratings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Sync Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F5C518]/5 border border-[#F5C518]/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#F5C518] text-sm font-medium">IMDB Sync</span>
                <span className="text-white font-bold">{syncedIMDB}/{ratings.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#F5C518] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${ratings.length > 0 ? (syncedIMDB / ratings.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="bg-[#FA320A]/5 border border-[#FA320A]/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#FA320A] text-sm font-medium">RT Sync</span>
                <span className="text-white font-bold">{syncedRT}/{ratings.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#FA320A] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${ratings.length > 0 ? (syncedRT / ratings.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      {ratings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-400" />
            Recent Ratings
          </h2>
          <div className="space-y-3">
            {ratings.slice(-5).reverse().map((r) => {
              const movieTitle = r.movieData?.title || r.movieData?.name || 'Unknown';
              const watchedLabel = r.watchedAt
                ? `${r.watchedAt.month ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][r.watchedAt.month - 1] + ' ' : ''}${r.watchedAt.year}`
                : null;
              return (
                <div key={r.movieId} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <img
                    src={r.movieData?.poster_path ? `https://image.tmdb.org/t/p/w200${r.movieData.poster_path}` : ''}
                    alt={movieTitle}
                    className="w-10 h-14 object-cover rounded-lg bg-gray-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{movieTitle}</p>
                    <p className="text-gray-400 text-xs">
                      Rated {r.rating}/10
                      {watchedLabel && ` • Watched ${watchedLabel}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-300 text-sm font-bold">{r.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={logout}
          className="flex items-center gap-2 mx-auto text-red-400 hover:text-red-300 hover:bg-red-500/10 px-6 py-3 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
