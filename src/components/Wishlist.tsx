import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';
import { fetchPopularMovies, fetchPopularTV, fetchTrending } from '../services/tmdb';
import MovieCard from './MovieCard';

const Wishlist: React.FC = () => {
  const { wishlist } = useApp();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
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

  const wishlistMovies: Movie[] = wishlist.map((w) => {
    const liveMovie = allMovies.find((m) => m.id === w.movieId);
    return liveMovie || w.movieData || {
      id: w.movieId,
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
  }, [checkScroll, wishlistMovies.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
              <p className="text-gray-400">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} waiting to be watched
              </p>
            </div>
          </div>
          {wishlistMovies.length > 0 && (
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
          )}
        </div>
      </motion.div>

      {loading && (
        <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-[420px] animate-pulse">
              <div className="w-full h-full bg-gray-800 rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && wishlistMovies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Your wishlist is empty</p>
          <p className="text-gray-500 text-sm">
            Go to Discover and add movies you want to watch later!
          </p>
        </motion.div>
      )}

      {!loading && wishlistMovies.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {wishlistMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Wishlist;
