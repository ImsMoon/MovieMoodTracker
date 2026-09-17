import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, XCircle, RefreshCw, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, fetchPopularMovies, fetchPopularTV, fetchTrending } from '../services/tmdb';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RatedMovies: React.FC = () => {
  const { ratings, user, syncToIMDB, syncToRT, removeRating } = useApp();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const ratedMovies = ratings.map((r) => {
    const liveMovie = allMovies.find((m) => m.id === r.movieId);
    return {
      movie: liveMovie || r.movieData || {
        id: r.movieId,
        title: 'Unknown Title',
        overview: '',
        poster_path: null,
        backdrop_path: null,
        release_date: '',
        vote_average: 0,
        vote_count: 0,
        genre_ids: [],
        media_type: 'movie' as const,
        original_language: 'en',
        popularity: 0,
      },
      rating: r,
    };
  });

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, ratedMovies.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleSync = async (movieId: number, platform: 'imdb' | 'rt') => {
    setSyncing(movieId);
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
    <div className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/20">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Ratings</h1>
              <p className="text-gray-400">{ratings.length} movie{ratings.length !== 1 ? 's' : ''} rated</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {ratings.length > 0 && (
              <>
                <button
                  onClick={handleSyncAll}
                  disabled={syncing !== null}
                  className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-colors border border-purple-500/20 disabled:opacity-50 text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing === -1 ? 'animate-spin' : ''}`} />
                  Sync All
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sync Status */}
      {ratings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 lg:mx-8 mb-6 bg-gray-800/50 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${user?.imdbConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                IMDB: {user?.imdbConnected ? `@${user.imdbUsername}` : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${user?.rtConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                RT: {user?.rtConnected ? `@${user.rtUsername}` : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-400">
                {ratings.filter(r => r.syncedToIMDB).length}/{ratings.length} synced
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-[420px] animate-pulse">
              <div className="w-full h-full bg-gray-800 rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && ratings.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No ratings yet</p>
          <p className="text-gray-500 text-sm">Go to Discover and rate movies you've seen!</p>
        </motion.div>
      )}

      {/* Rated Movies Slider */}
      {!loading && ratedMovies.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {ratedMovies.map(({ movie, rating }, index) => {
            const title = movie.title || movie.name || 'Unknown';
            const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] h-[420px] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all relative group"
              >
                {/* Background */}
                <img
                  src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-white font-bold text-sm">{rating.rating}/10</span>
                </div>

                {/* Sync Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {rating.syncedToIMDB && (
                    <div className="flex items-center gap-1 bg-[#F5C518]/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <CheckCircle className="w-3 h-3 text-black" />
                      <span className="text-black text-[10px] font-medium">IMDB</span>
                    </div>
                  )}
                  {rating.syncedToRT && (
                    <div className="flex items-center gap-1 bg-[#FA320A]/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span className="text-white text-[10px] font-medium">RT</span>
                    </div>
                  )}
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">{title}</h3>
                  <p className="text-gray-300 text-xs mb-2">
                    {year} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}
                  </p>
                  
                  {/* Watched Date */}
                  {rating.watchedAt && (
                    <p className="text-purple-300 text-xs mb-2">
                      📅 Watched: {rating.watchedAt.month ? `${MONTHS[rating.watchedAt.month - 1]} ` : ''}{rating.watchedAt.year}
                    </p>
                  )}

                  {/* Review */}
                  {rating.review && (
                    <p className="text-gray-400 text-xs italic line-clamp-2 mb-3">"{rating.review}"</p>
                  )}

                  {/* Rating Bar */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < rating.rating ? 'bg-yellow-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSync(movie.id, 'imdb')}
                      disabled={syncing !== null || rating.syncedToIMDB}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-all ${
                        rating.syncedToIMDB
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-[#F5C518]/20 text-[#F5C518] hover:bg-[#F5C518]/30'
                      }`}
                    >
                      {rating.syncedToIMDB ? <CheckCircle className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                      IMDB
                    </button>
                    <button
                      onClick={() => handleSync(movie.id, 'rt')}
                      disabled={syncing !== null || rating.syncedToRT}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-all ${
                        rating.syncedToRT
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-[#FA320A]/20 text-[#FA320A] hover:bg-[#FA320A]/30'
                      }`}
                    >
                      {rating.syncedToRT ? <CheckCircle className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                      RT
                    </button>
                    <button
                      onClick={() => removeRating(movie.id)}
                      className="flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default RatedMovies;
