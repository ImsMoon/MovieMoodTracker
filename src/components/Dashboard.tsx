import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Tv, Sparkles, RefreshCw } from 'lucide-react';
import { Movie } from '../types';
import { fetchPopularMovies, fetchPopularTV, fetchTrending, fetchTopRated } from '../services/tmdb';
import MovieCard from './MovieCard';

type Category = 'trending' | 'popular-movies' | 'popular-tv' | 'top-rated';

const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<Category>('trending');
  const [loading, setLoading] = useState(true);

  const loadMovies = async (cat: Category) => {
    setLoading(true);
    let data: Movie[] = [];
    switch (cat) {
      case 'trending':
        data = await fetchTrending();
        break;
      case 'popular-movies':
        data = await fetchPopularMovies();
        break;
      case 'popular-tv':
        data = await fetchPopularTV();
        break;
      case 'top-rated':
        data = await fetchTopRated();
        break;
    }
    setMovies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMovies(category);
  }, [category]);

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'popular-movies', label: 'Popular Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'popular-tv', label: 'Popular Series', icon: <Tv className="w-4 h-4" /> },
    { id: 'top-rated', label: 'Top Rated', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Discover</h1>
        <p className="text-gray-400">
          Explore popular movies and series. Mark what you've seen or add to your wishlist.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              category === cat.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => loadMovies(category)}
          className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-800 rounded-2xl mb-3" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Movie Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-20">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No movies found. Try refreshing!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
