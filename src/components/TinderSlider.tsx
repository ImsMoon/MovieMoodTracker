import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Star, Heart, Eye, Info, X, ThumbsUp, BookmarkPlus, Film, Check, Calendar } from 'lucide-react';
import { Movie, UserRating, WishlistItem, WatchedDate } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP } from '../services/tmdb';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface TinderCardProps {
  movie: Movie;
  isTop: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowDetails: () => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ movie, isTop, onSwipeLeft, onSwipeRight, onShowDetails }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.5, 0.8, 1, 0.8, 0.5]);
  const scale = useTransform(x, [-300, 0, 300], [0.9, 1, 0.9]);
  
  const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const nopeOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const title = movie.title || movie.name || 'Unknown';
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const genres = movie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) || [];

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 150;
    
    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      style={{ 
        x, 
        rotate: isTop ? rotate : 0,
        scale: isTop ? scale : 0.95,
        opacity: isTop ? opacity : 0.7,
      }}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing ${!isTop && 'pointer-events-none'}`}
      whileTap={{ scale: isTop ? 1.02 : 0.95 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Background Image */}
        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        {/* Swipe Indicators */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 right-8 border-4 border-green-400 rounded-xl px-4 py-2 rotate-12"
            >
              <span className="text-green-400 text-3xl font-black">SEEN IT</span>
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 left-8 border-4 border-pink-400 rounded-xl px-4 py-2 -rotate-12"
            >
              <span className="text-pink-400 text-3xl font-black">WISHLIST</span>
            </motion.div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-bold">{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              movie.media_type === 'tv' 
                ? 'bg-purple-500/80 text-white' 
                : 'bg-blue-500/80 text-white'
            }`}>
              {movie.media_type === 'tv' ? 'Series' : 'Movie'}
            </span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h2 className="text-white text-4xl sm:text-5xl font-black mb-3 leading-tight drop-shadow-2xl line-clamp-2">
            {title}
          </h2>
          
          <div className="flex items-center gap-3 text-gray-200 mb-4">
            <span className="text-lg">{year}</span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <span className="text-lg">{movie.vote_count?.toLocaleString()} votes</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <span
                key={genre}
                className="text-sm bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 mb-6 drop-shadow-lg">
            {movie.overview || 'No overview available.'}
          </p>

          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails();
            }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">More Info</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface TinderSliderProps {
  movies: Movie[];
  loading: boolean;
  onLoadMore: () => void;
}

const TinderSlider: React.FC<TinderSliderProps> = ({ movies, loading, onLoadMore }) => {
  const { addRating, addToWishlist, removeFromWishlist, ratings, wishlist } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [watchedYear, setWatchedYear] = useState<string>('');
  const [watchedMonth, setWatchedMonth] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const visibleCards = movies.slice(currentIndex, currentIndex + 3);

  const handleSwipeRight = (movie: Movie) => {
    setCurrentMovie(movie);
    setShowRating(true);
  };

  const handleSwipeLeft = (movie: Movie) => {
    const isInWishlist = wishlist.some((w) => w.movieId === movie.id);
    if (!isInWishlist) {
      const item: WishlistItem = {
        movieId: movie.id,
        addedAt: new Date().toISOString(),
        priority: 'medium',
        movieData: movie,
      };
      addToWishlist(item);
    }
    setCurrentIndex((prev) => prev + 1);
    
    // Load more when approaching end
    if (currentIndex + 5 >= movies.length) {
      onLoadMore();
    }
  };

  const handleSubmitRating = () => {
    if (!currentMovie || userRating === 0) return;
    
    const watchedAt: WatchedDate | undefined = watchedYear ? {
      year: parseInt(watchedYear),
      month: watchedMonth ? parseInt(watchedMonth) : undefined,
    } : undefined;

    const rating: UserRating = {
      movieId: currentMovie.id,
      rating: userRating,
      review: review || undefined,
      ratedAt: new Date().toISOString(),
      syncedToIMDB: false,
      syncedToRT: false,
      movieData: currentMovie,
      watchedAt,
    };
    addRating(rating);
    
    // Remove from wishlist if it was there
    const isInWishlist = wishlist.some((w) => w.movieId === currentMovie.id);
    if (isInWishlist) {
      removeFromWishlist(currentMovie.id);
    }

    setShowRating(false);
    setCurrentMovie(null);
    setUserRating(0);
    setReview('');
    setWatchedYear('');
    setWatchedMonth('');
    setCurrentIndex((prev) => prev + 1);
    
    // Load more when approaching end
    if (currentIndex + 5 >= movies.length) {
      onLoadMore();
    }
  };

  const handleAction = (action: 'left' | 'right') => {
    const movie = movies[currentIndex];
    if (!movie) return;
    
    if (action === 'right') {
      handleSwipeRight(movie);
    } else {
      handleSwipeLeft(movie);
    }
  };

  if (loading && movies.length === 0) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No movies available</p>
        </div>
      </div>
    );
  }

  const movie = movies[currentIndex];
  const hasRated = movie && ratings.some((r) => r.movieId === movie.id);
  const isInWishlist = movie && wishlist.some((w) => w.movieId === movie.id);

  return (
    <>
      {/* Card Stack */}
      <div className="relative w-full h-[600px] sm:h-[700px] max-w-2xl mx-auto">
        {/* Background stacked cards for depth */}
        {visibleCards.length > 1 && (
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden border border-white/5 shadow-xl"
            style={{
              transform: 'translateY(16px) scale(0.92)',
              opacity: 0.4,
            }}
          >
            <img
              src={getImageUrl(visibleCards[1]?.backdrop_path || visibleCards[1]?.poster_path, 'w780')}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        {visibleCards.length > 2 && (
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden border border-white/5 shadow-lg"
            style={{
              transform: 'translateY(32px) scale(0.86)',
              opacity: 0.2,
            }}
          >
            <img
              src={getImageUrl(visibleCards[2]?.backdrop_path || visibleCards[2]?.poster_path, 'w780')}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}

        <AnimatePresence>
          {visibleCards.map((movie, index) => (
            <TinderCard
              key={`${movie.id}-${currentIndex + index}`}
              movie={movie}
              isTop={index === 0}
              onSwipeLeft={() => handleSwipeLeft(movie)}
              onSwipeRight={() => handleSwipeRight(movie)}
              onShowDetails={() => {
                setCurrentMovie(movie);
                setShowDetails(true);
              }}
            />
          ))}
        </AnimatePresence>

        {/* Status Badge + Skip */}
        {movie && (hasRated || isInWishlist) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            {hasRated && (
              <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Already Rated</span>
              </div>
            )}
            {isInWishlist && !hasRated && (
              <div className="flex items-center gap-2 bg-pink-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                <Heart className="w-4 h-4 text-white fill-white" />
                <span className="text-white text-sm font-medium">In Wishlist</span>
              </div>
            )}
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs px-4 py-1.5 rounded-full transition-colors"
            >
              Skip →
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleAction('left')}
            className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-pink-500/20 hover:bg-pink-500/30 border-2 border-pink-500/50 rounded-full transition-all hover:scale-110 active:scale-95"
            title="Add to Wishlist"
          >
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-pink-400 text-xs font-medium">Wishlist</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => {
              if (movie) {
                setCurrentMovie(movie);
                setShowDetails(true);
              }
            }}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/50 rounded-full transition-all hover:scale-110 active:scale-95"
            title="More Info"
          >
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-blue-400 text-xs font-medium">Info</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleAction('right')}
            className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/50 rounded-full transition-all hover:scale-110 active:scale-95"
            title="I've Seen This"
          >
            <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-green-400 text-xs font-medium">Seen it</span>
        </div>
      </div>

      {/* Counter & Hint */}
      <div className="text-center mt-4 space-y-1">
        <span className="text-gray-500 text-sm">
          {currentIndex + 1} / {movies.length}+
        </span>
        <p className="text-gray-600 text-xs">
          ← Swipe left for wishlist • Swipe right to rate →
        </p>
      </div>

      {/* Rating Modal */}
      {showRating && currentMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRating(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Rate this {currentMovie.media_type === 'tv' ? 'Series' : 'Movie'}</h3>
                <button onClick={() => setShowRating(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Movie Info */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={getImageUrl(currentMovie.poster_path, 'w200')}
                  alt={currentMovie.title || currentMovie.name}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="text-white font-medium text-sm">{currentMovie.title || currentMovie.name}</p>
                  <p className="text-gray-400 text-xs">
                    {(currentMovie.release_date || currentMovie.first_air_date || '').split('-')[0]} • {currentMovie.media_type === 'tv' ? 'Series' : 'Movie'}
                  </p>
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

              {/* Watched Date */}
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer disabled:opacity-40"
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

      {/* Details Modal */}
      {showDetails && currentMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
              <img
                src={getImageUrl(currentMovie.backdrop_path, 'original')}
                alt={currentMovie.title || currentMovie.name}
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
                <h2 className="text-3xl font-bold text-white mb-2">{currentMovie.title || currentMovie.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span>{(currentMovie.release_date || currentMovie.first_air_date || '').split('-')[0]}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {currentMovie.vote_average?.toFixed(1)}/10
                  </span>
                  <span>{currentMovie.vote_count?.toLocaleString()} votes</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {currentMovie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).map((genre) => (
                  <span key={genre} className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {currentMovie.overview || 'No overview available.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl p-4 text-center">
                  <p className="text-[#F5C518] text-xs font-medium mb-1">IMDB</p>
                  <p className="text-2xl font-bold text-white">{(currentMovie.vote_average * 0.9 + 0.5).toFixed(1)}</p>
                </div>
                <div className="bg-[#FA320A]/10 border border-[#FA320A]/20 rounded-xl p-4 text-center">
                  <p className="text-[#FA320A] text-xs font-medium mb-1">Rotten Tomatoes</p>
                  <p className="text-2xl font-bold text-white">{Math.min(99, Math.round(currentMovie.vote_average * 10 + 5))}%</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleSwipeRight(currentMovie);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  I've Seen This
                </button>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleSwipeLeft(currentMovie);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TinderSlider;
