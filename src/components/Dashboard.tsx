import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Film, Tv, Sparkles, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { fetchPopularMovies, fetchPopularTV, fetchTrending, fetchTopRated } from '../services/tmdb';
import MovieCard from './MovieCard';

// Infinite horizontal slider component
const InfiniteSlider: React.FC<{
  movies: Movie[];
  loading: boolean;
  onLoadMore: () => void;
  title: string;
  icon: React.ReactNode;
  accentColor: string;
}> = ({ movies, loading, onLoadMore, title, icon, accentColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll - load more when sentinel is visible
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, onLoadMore]);

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
  }, [checkScroll, movies.length]);

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
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${accentColor}`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-gray-500 text-sm">{movies.length}+</span>
        </div>
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
      </div>

      {/* Slider */}
      <div className="relative group/slider">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Loading skeleton */}
          {loading && movies.length === 0 && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] h-[420px] animate-pulse">
                  <div className="w-full h-full bg-gray-800 rounded-2xl" />
                </div>
              ))}
            </>
          )}

          {/* Movie Cards */}
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="flex-shrink-0 w-4 flex items-center justify-center">
            {loading && movies.length > 0 && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-xs">Loading more...</span>
              </div>
            )}
          </div>
        </div>

        {/* Hide scrollbar CSS */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [moviesPage, setMoviesPage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTV, setLoadingTV] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      const [t, m, tv, tr] = await Promise.all([
        fetchTrending(),
        fetchPopularMovies(1),
        fetchPopularTV(1),
        fetchTopRated(),
      ]);
      setTrending(t);
      setPopularMovies(m);
      setPopularTV(tv);
      setTopRated(tr);
      setLoadingTrending(false);
      setLoadingMovies(false);
      setLoadingTV(false);
      setLoadingTopRated(false);
    };
    loadInitial();
  }, []);

  // Infinite load functions
  const loadMoreTrending = useCallback(async () => {
    if (loadingTrending) return;
    setLoadingTrending(true);
    const nextPage = trendingPage + 1;
    // TMDB trending only has limited pages, so we cycle
    const page = ((nextPage - 1) % 5) + 1;
    const data = await fetchTrending();
    setTrending((prev) => [...prev, ...data.map(m => ({ ...m, id: m.id + page * 100000 }))]);
    setTrendingPage(nextPage);
    setLoadingTrending(false);
  }, [trendingPage, loadingTrending]);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMovies) return;
    setLoadingMovies(true);
    const nextPage = moviesPage + 1;
    const data = await fetchPopularMovies(nextPage);
    if (data.length > 0) {
      setPopularMovies((prev) => [...prev, ...data]);
      setMoviesPage(nextPage);
    }
    setLoadingMovies(false);
  }, [moviesPage, loadingMovies]);

  const loadMoreTV = useCallback(async () => {
    if (loadingTV) return;
    setLoadingTV(true);
    const nextPage = tvPage + 1;
    const data = await fetchPopularTV(nextPage);
    if (data.length > 0) {
      setPopularTV((prev) => [...prev, ...data]);
      setTvPage(nextPage);
    }
    setLoadingTV(false);
  }, [tvPage, loadingTV]);

  const loadMoreTopRated = useCallback(async () => {
    if (loadingTopRated) return;
    setLoadingTopRated(true);
    const nextPage = topRatedPage + 1;
    const data = await fetchTopRated();
    if (data.length > 0) {
      setTopRated((prev) => [...prev, ...data.map(m => ({ ...m, id: m.id + nextPage * 100000 }))]);
      setTopRatedPage(nextPage);
    }
    setLoadingTopRated(false);
  }, [topRatedPage, loadingTopRated]);

  return (
    <div className="py-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8 mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Discover</h1>
        <p className="text-gray-400">
          Swipe through popular movies & series. Mark what you've seen or add to wishlist.
        </p>
      </motion.div>

      {/* Sliders */}
      <InfiniteSlider
        movies={trending}
        loading={loadingTrending}
        onLoadMore={loadMoreTrending}
        title="Trending Now"
        icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
        accentColor="bg-orange-500/20"
      />

      <InfiniteSlider
        movies={popularMovies}
        loading={loadingMovies}
        onLoadMore={loadMoreMovies}
        title="Popular Movies"
        icon={<Film className="w-5 h-5 text-blue-400" />}
        accentColor="bg-blue-500/20"
      />

      <InfiniteSlider
        movies={popularTV}
        loading={loadingTV}
        onLoadMore={loadMoreTV}
        title="Popular Series"
        icon={<Tv className="w-5 h-5 text-purple-400" />}
        accentColor="bg-purple-500/20"
      />

      <InfiniteSlider
        movies={topRated}
        loading={loadingTopRated}
        onLoadMore={loadMoreTopRated}
        title="Top Rated"
        icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
        accentColor="bg-yellow-500/20"
      />
    </div>
  );
};

export default Dashboard;
