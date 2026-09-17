import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, XCircle, RefreshCw, ExternalLink, Film, Tv, Award } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP, fetchPopularMovies, fetchPopularTV, fetchTrending } from '../services/tmdb';

const RatedMovies: React.FC = () => {
  const { ratings, user, syncToIMDB, syncToRT, removeRating } = useApp();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    const loadAllMovies = async () => {
      setLoading(true);
      const [movies, tv, trending] = await Promise.all([
        fetchPopularMovies(1),
        fetchPopularTV(1),
        fetchTrending(),
      ]);
      setAllMovies([...movies, ...tv, ...trending]);
      setLoading(false);
    };
    loadAllMovies();
  }, []);

  const ratedMovies = allMovies.filter((m) =>
    ratings.some((r) => r.movieId === m.id)
  );

  const handleSync = async (movieId: number, platform: 'imdb' | 'rt') => {
    setSyncing(movieId);
    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (platform === 'imdb') {
      syncToIMDB(movieId);
    } else {
      syncToRT(movieId);
    }
    setSyncing(null);
  };

  const handleSyncAll = async () => {
    setSyncing(-1);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    ratings.forEach((r) => {
      if (!r.syncedToIMDB) syncToIMDB(r.movieId);
      if (!r.syncedToRT) syncToRT(r.movieId);
    });
    setSyncing(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Ratings</h1>
              <p className="text-gray-400">
                {ratings.length} movie{ratings.length !== 1 ? 's' : ''} rated
              </p>
            </div>
          </div>
          {ratings.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={syncing !== null}
              className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-colors border border-purple-500/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing === -1 ? 'animate-spin' : ''}`} />
              Sync All to IMDB & RT
            </button>
          )}
        </div>
      </motion.div>

      {/* Sync Status Banner */}
      {ratings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-white/10 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${user?.imdbConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                IMDB: {user?.imdbConnected ? `Connected as @${user.imdbUsername}` : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${user?.rtConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                Rotten Tomatoes: {user?.rtConnected ? `Connected as @${user.rtUsername}` : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-400">
                {ratings.filter(r => r.syncedToIMDB).length}/{ratings.length} synced to IMDB
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">
                {ratings.filter(r => r.syncedToRT).length}/{ratings.length} synced to RT
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading your ratings...</p>
        </div>
      )}

      {!loading && ratings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No ratings yet</p>
          <p className="text-gray-500 text-sm">
            Go to Discover and rate movies you've seen!
          </p>
        </motion.div>
      )}

      {/* Rated Movies List */}
      {!loading && ratedMovies.length > 0 && (
        <div className="space-y-4">
          {ratedMovies.map((movie, index) => {
            const rating = ratings.find((r) => r.movieId === movie.id)!;
            const title = movie.title || movie.name || 'Unknown';
            const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Poster */}
                  <img
                    src={getImageUrl(movie.poster_path, 'w200')}
                    alt={title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-white font-semibold truncate">{title}</h3>
                        <p className="text-gray-400 text-sm">
                          {year} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 font-bold">{rating.rating}</span>
                        <span className="text-yellow-400/60 text-sm">/10</span>
                      </div>
                    </div>

                    {/* Review */}
                    {rating.review && (
                      <p className="text-gray-400 text-sm mt-2 italic">"{rating.review}"</p>
                    )}

                    {/* Sync Status */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleSync(movie.id, 'imdb')}
                        disabled={syncing !== null}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          rating.syncedToIMDB
                            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                            : 'bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 hover:bg-[#F5C518]/20'
                        }`}
                      >
                        {rating.syncedToIMDB ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Synced to IMDB
                          </>
                        ) : (
                          <>
                            <RefreshCw className={`w-3.5 h-3.5 ${syncing === movie.id ? 'animate-spin' : ''}`} />
                            Sync to IMDB
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSync(movie.id, 'rt')}
                        disabled={syncing !== null}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          rating.syncedToRT
                            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                            : 'bg-[#FA320A]/10 text-[#FA320A] border border-[#FA320A]/20 hover:bg-[#FA320A]/20'
                        }`}
                      >
                        {rating.syncedToRT ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Synced to RT
                          </>
                        ) : (
                          <>
                            <RefreshCw className={`w-3.5 h-3.5 ${syncing === movie.id ? 'animate-spin' : ''}`} />
                            Sync to RT
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => removeRating(movie.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all ml-auto"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatedMovies;
