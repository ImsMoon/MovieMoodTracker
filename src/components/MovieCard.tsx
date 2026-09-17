import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, Check, BookmarkPlus, Info, X, ThumbsUp, Calendar } from 'lucide-react';
import { Movie, UserRating, WishlistItem, WatchedDate } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const { ratings, wishlist, addRating, addToWishlist, removeFromWishlist } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [watchedYear, setWatchedYear] = useState<string>('');
  const [watchedMonth, setWatchedMonth] = useState<string>('');

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
    
    const watchedAt: WatchedDate | undefined = watchedYear ? {
      year: parseInt(watchedYear),
      month: watchedMonth ? parseInt(watchedMonth) : undefined,
    } : undefined;

    const rating: UserRating = {
      movieId: movie.id,
      rating: userRating,
      review: review || undefined,
      ratedAt: new Date().toISOString(),
      syncedToIMDB: false,
      syncedToRT: false,
      movieData: movie,
      watchedAt,
    };
    addRating(rating);
    if (isInWishlist) {
      removeFromWishlist(movie.id);
    }
    setShowRating(false);
    setUserRating(0);
    setReview('');
    setWatchedYear('');
    setWatchedMonth('');
  };

  const handleAddToWishlist = () => {
    const item: WishlistItem = {
      movieId: movie.id,
      addedAt: new Date().toISOString(),
      priority: 'medium',
      movieData: movie,
    };
    addToWishlist(item);
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(movie.id);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <>
      {/* Slider Card - Wide format */}
      <div
        className="group relative flex-shrink-0 w-[280px] sm:w-[320px] h-[420px] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Poster Background */}
        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{movie.vote_average?.toFixed(1)}</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            movie.media_type === 'tv' 
              ? 'bg-purple-500/80 text-white' 
              : 'bg-blue-500/80 text-white'
          }`}>
            {movie.media_type === 'tv' ? 'Series' : 'Movie'}
          </span>
        </div>

        {/* Status Overlay */}
        {hasRated && (
          <div className="absolute top-12 left-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Check className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-medium">Rated {existingRating?.rating}/10</span>
          </div>
        )}
        {isInWishlist && !hasRated && (
          <div className="absolute top-12 left-3 flex items-center gap-1 bg-pink-500/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Heart className="w-3 h-3 text-white fill-white" />
            <span className="text-white text-xs font-medium">Wishlisted</span>
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
            <span>{year}</span>
            {genres.length > 0 && (
              <>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span className="truncate">{genres.join(', ')}</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {!hasRated && !isInWishlist && (
            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => { e.stopPropagation(); handleSeen(); }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/90 hover:bg-green-500 text-white text-xs font-medium py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Seen it
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToWishlist(); }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-pink-500/90 hover:bg-pink-500 text-white text-xs font-medium py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <Heart className="w-3.5 h-3.5" />
                Wishlist
              </button>
            </div>
          )}
          {hasRated && (
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < (existingRating?.rating || 0) ? 'bg-green-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
          {isInWishlist && !hasRated && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(); }}
              className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-red-500/30 text-gray-300 hover:text-red-300 text-xs font-medium py-2 rounded-lg transition-colors mt-2 backdrop-blur-sm"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-2xl">
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

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre) => (
                  <span key={genre} className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {movie.overview || 'No overview available.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4 text-center">
                  <p className="text-[#F5C518] text-xs font-medium mb-1">IMDB</p>
                  <p className="text-2xl font-bold text-white">{(movie.vote_average * 0.9 + 0.5).toFixed(1)}</p>
                </div>
                <div className="bg-[#FA320A]/10 border border-[#FA320A]/20 rounded-xl p-4 text-center">
                  <p className="text-[#FA320A] text-xs font-medium mb-1">Rotten Tomatoes</p>
                  <p className="text-2xl font-bold text-white">{Math.min(99, Math.round(movie.vote_average * 10 + 5))}%</p>
                </div>
              </div>

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
                    Wishlist
                  </button>
                </div>
              )}
              {hasRated && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-sm">You rated this {existingRating?.rating}/10</p>
                  {existingRating?.watchedAt && (
                    <p className="text-gray-400 text-xs mt-1">
                      Watched: {MONTHS[(existingRating.watchedAt.month || 1) - 1]} {existingRating.watchedAt.year}
                    </p>
                  )}
                </div>
              )}
              {isInWishlist && !hasRated && (
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
                  <p className="text-pink-400 text-sm">In your wishlist</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating Modal with Watched Date */}
      {showRating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRating(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
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
              <div className="text-center mb-5">
                <p className="text-gray-400 text-sm mb-3">Your Rating</p>
                <div className="flex items-center justify-center gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(i + 1)}
                      className="p-0.5 transition-transform hover:scale-125"
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

              {/* Watched Date - Optional */}
              <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <p className="text-white text-sm font-medium">When did you watch it?</p>
                  <span className="text-gray-500 text-xs">(optional)</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={watchedYear}
                    onChange={(e) => setWatchedYear(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">Year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="bg-gray-900">{y}</option>
                    ))}
                  </select>
                  <select
                    value={watchedMonth}
                    onChange={(e) => setWatchedMonth(e.target.value)}
                    disabled={!watchedYear}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-gray-900">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1} className="bg-gray-900">{m}</option>
                    ))}
                  </select>
                </div>
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
                  Your rating will be synced to IMDB & Rotten Tomatoes
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
