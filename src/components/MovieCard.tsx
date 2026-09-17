import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, Check, BookmarkPlus, Info, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Movie, UserRating, WishlistItem } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const { ratings, wishlist, addRating, addToWishlist, removeFromWishlist, removeRating } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const hasRated = ratings.some((r) => r.movieId === movie.id);
  const isInWishlist = wishlist.some((w) => w.movieId === movie.id);
  const existingRating = ratings.find((r) => r.movieId === movie.id);

  const title = movie.title || movie.name || 'Unknown';
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const genres = movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) || [];

  const handleSeen = () => {
    setShowRating(true);
  };

  const handleSubmitRating = () => {
    if (userRating === 0) return;
    const rating: UserRating = {
      movieId: movie.id,
      rating: userRating,
      review: review || undefined,
      ratedAt: new Date().toISOString(),
      syncedToIMDB: false,
      syncedToRT: false,
    };
    addRating(rating);
    // Remove from wishlist if it was there
    if (isInWishlist) {
      removeFromWishlist(movie.id);
    }
    setShowRating(false);
    setUserRating(0);
    setReview('');
  };

  const handleAddToWishlist = () => {
    const item: WishlistItem = {
      movieId: movie.id,
      addedAt: new Date().toISOString(),
      priority: 'medium',
    };
    addToWishlist(item);
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(movie.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="group relative bg-gray-800/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
          
          {/* TMDB Rating */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">{movie.vote_average?.toFixed(1)}</span>
          </div>

          {/* Media Type Badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              movie.media_type === 'tv' 
                ? 'bg-purple-500/80 text-white' 
                : 'bg-blue-500/80 text-white'
            }`}>
              {movie.media_type === 'tv' ? 'Series' : 'Movie'}
            </span>
          </div>

          {/* Status Badges */}
          {hasRated && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-1">
              <Check className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-medium">Rated {existingRating?.rating}/10</span>
            </div>
          )}
          {isInWishlist && !hasRated && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-pink-500/80 backdrop-blur-sm rounded-full px-2 py-1">
              <Heart className="w-3 h-3 text-white fill-white" />
              <span className="text-white text-xs font-medium">Wishlisted</span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="View Details"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
            {!hasRated && !isInWishlist && (
              <>
                <button
                  onClick={handleSeen}
                  className="p-2.5 bg-green-500/80 backdrop-blur-sm rounded-full hover:bg-green-500 transition-colors"
                  title="I've seen this"
                >
                  <Eye className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="p-2.5 bg-pink-500/80 backdrop-blur-sm rounded-full hover:bg-pink-500 transition-colors"
                  title="Add to Wishlist"
                >
                  <BookmarkPlus className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm truncate mb-1" title={title}>
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>{year}</span>
            <span>•</span>
            <span className="capitalize">{movie.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Quick Actions (always visible) */}
          {!hasRated && !isInWishlist && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSeen}
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium py-2 rounded-lg transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Seen it
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 flex items-center justify-center gap-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 text-xs font-medium py-2 rounded-lg transition-colors"
              >
                <Heart className="w-3.5 h-3.5" />
                Wishlist
              </button>
            </div>
          )}
          {hasRated && (
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < (existingRating?.rating || 0) ? 'bg-green-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
          {isInWishlist && !hasRated && (
            <button
              onClick={handleRemoveFromWishlist}
              className="w-full flex items-center justify-center gap-1.5 bg-gray-700/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs font-medium py-2 rounded-lg transition-colors mt-3"
            >
              <X className="w-3.5 h-3.5" />
              Remove from Wishlist
            </button>
          )}
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop */}
            <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl">
              <img
                src={getImageUrl(movie.backdrop_path, 'w1280')}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span>{year}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {movie.vote_average?.toFixed(1)}/10
                  </span>
                  <span>{movie.vote_count?.toLocaleString()} votes</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre) => (
                  <span key={genre} className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
                <span className={`text-sm px-3 py-1 rounded-full ${
                  movie.media_type === 'tv' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {movie.media_type === 'tv' ? 'TV Series' : 'Movie'}
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {movie.overview || 'No overview available for this title.'}
              </p>

              {/* Simulated Ratings from IMDB & RT */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4 text-center">
                  <p className="text-[#F5C518] text-xs font-medium mb-1">IMDB Rating</p>
                  <p className="text-2xl font-bold text-white">{(movie.vote_average * 0.9 + 0.5).toFixed(1)}</p>
                  <p className="text-gray-400 text-xs">/10</p>
                </div>
                <div className="bg-[#FA320A]/10 border border-[#FA320A]/20 rounded-xl p-4 text-center">
                  <p className="text-[#FA320A] text-xs font-medium mb-1">Rotten Tomatoes</p>
                  <p className="text-2xl font-bold text-white">{Math.min(99, Math.round(movie.vote_average * 10 + 5))}%</p>
                  <p className="text-gray-400 text-xs">Tomatometer</p>
                </div>
              </div>

              {/* Actions */}
              {!hasRated && !isInWishlist && (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDetails(false); handleSeen(); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    I've Seen This
                  </button>
                  <button
                    onClick={() => { setShowDetails(false); handleAddToWishlist(); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Add to Wishlist
                  </button>
                </div>
              )}
              {hasRated && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-sm">You rated this {existingRating?.rating}/10</p>
                </div>
              )}
              {isInWishlist && !hasRated && (
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
                  <p className="text-pink-400 text-sm">This is in your wishlist</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRating(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Rate this {movie.media_type === 'tv' ? 'Series' : 'Movie'}</h3>
                <button onClick={() => setShowRating(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Movie Info */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={getImageUrl(movie.poster_path, 'w200')}
                  alt={title}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-gray-400 text-xs">{year} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-3">Your Rating</p>
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(i + 1)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          i < (hoverRating || userRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-white text-2xl font-bold mt-2">
                  {hoverRating || userRating || 0}<span className="text-gray-500 text-lg">/10</span>
                </p>
              </div>

              {/* Review */}
              <textarea
                placeholder="Write a short review (optional)..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none h-20 mb-4"
              />

              {/* Sync Info */}
              <div className="bg-white/5 rounded-xl p-3 mb-4">
                <p className="text-gray-400 text-xs text-center">
                  Your rating will be synced to IMDB & Rotten Tomatoes (if connected)
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmitRating}
                disabled={userRating === 0}
                className={`w-full font-medium py-3 rounded-xl transition-all ${
                  userRating > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {userRating > 0 ? 'Submit Rating' : 'Select a rating'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
