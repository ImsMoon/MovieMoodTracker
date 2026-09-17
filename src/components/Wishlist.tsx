import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Eye, Film } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP, fetchPopularMovies, fetchPopularTV, fetchTrending } from '../services/tmdb';
import MovieCard from './MovieCard';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useApp();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

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

  const wishlistMovies = allMovies.filter((m) =>
    wishlist.some((w) => w.movieId === m.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-pink-400" />
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
        </div>
        <p className="text-gray-400">
          Movies and series you want to watch. {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your list.
        </p>
      </motion.div>

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading your wishlist...</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
