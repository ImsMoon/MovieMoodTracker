import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Star, Heart, Eye, Info, X, ThumbsUp, BookmarkPlus, Film, Check, Calendar } from 'lucide-react';
import { Movie, UserRating, WishlistItem, WatchedDate, getMoodInfo } from '../types';
import { useApp } from '../context/AppContext';
import { getImageUrl, GENRE_MAP } from '../services/tmdb';
import MoodRatingModal from './MoodRatingModal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface TinderCardProps {
  movie: Movie;
  isTop: boolean;
  stackIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowDetails: () => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ movie, isTop, stackIndex, onSwipeLeft, onSwipeRight, onShowDetails }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.85, 0.95, 1, 0.95, 0.85]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);
  
  const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.7, 1]);
  const nopeOpacity = useTransform(x, [-200, -100, 0], [1, 0.7, 0]);

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

  // Calculate stack positioning
  const stackScale = isTop ? 1 : 1 - (stackIndex * 0.05);
  const stackTranslateY = stackIndex * 12;
  const stackOpacity = isTop ? 1 : Math.max(0.4, 1 - (stackIndex * 0.25));
  const stackZIndex = 100 - stackIndex;

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0,
        scale: isTop ? scale : stackScale,
        opacity: isTop ? opacity : stackOpacity,
        y: stackTranslateY,
        zIndex: stackZIndex,
      }}
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      whileTap={isTop ? { scale: 1.02 } : {}}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-900">
        {/* Background Image */}
        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
          draggable={false}
          loading="eager"
        />
        
        {/* Gradient Overlays - more opaque for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

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
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20">
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
                className="text-sm bg-white/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-medium border border-white/20"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-100 text-sm leading-relaxed line-clamp-3 mb-6 drop-shadow-lg">
            {movie.overview || 'No overview available.'}
          </p>

          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails();
            }}
            className="flex items-center gap-2 bg-white/30 backdrop-blur-md hover:bg-white/40 text-white px-4 py-2 rounded-full transition-colors border border-white/20"
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
        <AnimatePresence mode="popLayout">
          {visibleCards.map((movie, index) => (
            <TinderCard
              key={`${movie.id}-${currentIndex + index}`}
              movie={movie}
              isTop={index === 0}
              stackIndex={index}
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
                <span className="text-white text-sm font-medium">
                  Rated {ratings.find(r => r.movieId === movie.id)?.rating}/10
                  {ratings.find(r => r.movieId === movie.id)?.mood && ` • ${getMoodInfo(ratings.find(r => r.movieId === movie.id)!.mood!).emoji} ${getMoodInfo(ratings.find(r => r.movieId === movie.id)!.mood!).label}`}
                </span>
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

      {/* Mood Rating Modal */}
      {showRating && currentMovie && (
        <MoodRatingModal
          movie={currentMovie}
          onClose={() => {
            setShowRating(false);
            setCurrentMovie(null);
          }}
          onSubmit={(rating) => {
            addRating(rating);
            const isInWishlist = wishlist.some((w) => w.movieId === currentMovie.id);
            if (isInWishlist) {
              removeFromWishlist(currentMovie.id);
            }
            setShowRating(false);
            setCurrentMovie(null);
            setCurrentIndex((prev) => prev + 1);
            if (currentIndex + 5 >= movies.length) {
              onLoadMore();
            }
          }}
        />
      )}

      {/* Details Modal */}
      {showDetails && currentMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={() => setShowDetails(false)}>
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
