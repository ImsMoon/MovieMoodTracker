import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Tv, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { fetchPopularMovies, fetchPopularTV, fetchTrending, fetchTopRated } from '../services/tmdb';
import TinderSlider from './TinderSlider';

type Category = 'trending' | 'popular-movies' | 'popular-tv' | 'top-rated';

const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<Category>('trending');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      let data: Movie[] = [];
      switch (category) {
        case 'trending':
          data = await fetchTrending();
          break;
        case 'popular-movies':
          data = await fetchPopularMovies(1);
          break;
        case 'popular-tv':
          data = await fetchPopularTV(1);
          break;
        case 'top-rated':
          data = await fetchTopRated();
          break;
      }
      setMovies(data);
      setPage(1);
      setLoading(false);
    };
    loadInitial();
  }, [category]);

  // Load more for infinite scroll
  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;
    let data: Movie[] = [];
    
    switch (category) {
      case 'trending':
        data = await fetchTrending();
        // Add offset to avoid duplicate keys
        data = data.map(m => ({ ...m, id: m.id + nextPage * 100000 }));
        break;
      case 'popular-movies':
        data = await fetchPopularMovies(nextPage);
        break;
      case 'popular-tv':
        data = await fetchPopularTV(nextPage);
        break;
      case 'top-rated':
        data = await fetchTopRated();
        data = data.map(m => ({ ...m, id: m.id + nextPage * 100000 }));
        break;
    }
    
    if (data.length > 0) {
      setMovies((prev) => [...prev, ...data]);
      setPage(nextPage);
    }
    setLoading(false);
  }, [page, category, loading]);

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'popular-movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'popular-tv', label: 'Series', icon: <Tv className="w-4 h-4" /> },
    { id: 'top-rated', label: 'Top Rated', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8 mb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Discover</h1>
        <p className="text-gray-400">
          Swipe right to rate, swipe left to wishlist
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 px-4 sm:px-6 lg:px-8 overflow-x-auto">
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
      </div>

      {/* Tinder Slider */}
      <div className="px-4 sm:px-6 lg:px-8">
        <TinderSlider
          movies={movies}
          loading={loading}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
};

export default Dashboard;
