import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Calendar, Film, Award, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GENRE_MAP } from '../services/tmdb';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GENRE_COLORS: Record<string, string> = {
  'Action': '#ef4444',
  'Adventure': '#f97316',
  'Animation': '#eab308',
  'Comedy': '#84cc16',
  'Crime': '#22c55e',
  'Documentary': '#14b8a6',
  'Drama': '#06b6d4',
  'Family': '#3b82f6',
  'Fantasy': '#6366f1',
  'History': '#8b5cf6',
  'Horror': '#a855f7',
  'Music': '#d946ef',
  'Mystery': '#ec4899',
  'Romance': '#f43f5e',
  'Sci-Fi': '#0ea5e9',
  'Thriller': '#64748b',
  'War': '#78716c',
  'Western': '#92400e',
  'TV Movie': '#7c3aed',
  'Action & Adventure': '#dc2626',
  'Sci-Fi & Fantasy': '#2563eb',
  'War & Politics': '#475569',
};

const Stats: React.FC = () => {
  const { ratings } = useApp();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Get available years from ratings
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    ratings.forEach((r) => {
      if (r.watchedAt?.year) {
        years.add(r.watchedAt.year);
      } else {
        years.add(new Date(r.ratedAt).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [ratings]);

  // Filter ratings by selected year
  const filteredRatings = useMemo(() => {
    if (selectedYear === 'all') return ratings;
    return ratings.filter((r) => {
      const year = r.watchedAt?.year || new Date(r.ratedAt).getFullYear();
      return year === selectedYear;
    });
  }, [ratings, selectedYear]);

  // Genre stats
  const genreStats = useMemo(() => {
    const stats: Record<string, { count: number; totalRating: number; movies: number[] }> = {};
    
    filteredRatings.forEach((r) => {
      const genres = r.movieData?.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) || [];
      genres.forEach((genre) => {
        if (!stats[genre]) {
          stats[genre] = { count: 0, totalRating: 0, movies: [] };
        }
        stats[genre].count++;
        stats[genre].totalRating += r.rating;
        stats[genre].movies.push(r.movieId);
      });
    });

    return Object.entries(stats)
      .map(([genre, data]) => ({
        genre,
        count: data.count,
        avgRating: data.totalRating / data.count,
        uniqueMovies: new Set(data.movies).size,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRatings]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const stats: Record<number, { count: number; totalRating: number; topGenre: string }> = {};
    
    filteredRatings.forEach((r) => {
      let month: number;
      if (r.watchedAt?.month) {
        month = r.watchedAt.month;
      } else {
        month = new Date(r.ratedAt).getMonth() + 1;
      }
      
      if (!stats[month]) {
        stats[month] = { count: 0, totalRating: 0, topGenre: '' };
      }
      stats[month].count++;
      stats[month].totalRating += r.rating;
    });

    // Calculate top genre per month
    Object.keys(stats).forEach((monthStr) => {
      const month = parseInt(monthStr);
      const monthRatings = filteredRatings.filter((r) => {
        const rMonth = r.watchedAt?.month || new Date(r.ratedAt).getMonth() + 1;
        return rMonth === month;
      });
      
      const genreCount: Record<string, number> = {};
      monthRatings.forEach((r) => {
        const genres = r.movieData?.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean) || [];
        genres.forEach((genre) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });
      
      const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
      if (topGenre) stats[month].topGenre = topGenre[0];
    });

    return stats;
  }, [filteredRatings]);

  // Overall stats
  const overallStats = useMemo(() => {
    if (filteredRatings.length === 0) return null;
    
    const totalMovies = filteredRatings.length;
    const avgRating = filteredRatings.reduce((sum, r) => sum + r.rating, 0) / totalMovies;
    const topGenre = genreStats[0]?.genre || 'N/A';
    const highestRated = filteredRatings.reduce((max, r) => r.rating > max.rating ? r : max, filteredRatings[0]);
    
    return { totalMovies, avgRating, topGenre, highestRated };
  }, [filteredRatings, genreStats]);

  const maxGenreCount = Math.max(...genreStats.map((g) => g.count), 1);

  if (ratings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No stats yet</p>
          <p className="text-gray-500 text-sm">
            Rate some movies to see your genre preferences!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Your Stats</h1>
              <p className="text-gray-400">Genre preferences & watching patterns</p>
            </div>
          </div>
          
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedYear === 'all'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              All Time
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      {overallStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
          >
            <Film className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{overallStats.totalMovies}</p>
            <p className="text-gray-400 text-xs">Movies Rated</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
          >
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">{overallStats.avgRating.toFixed(1)}</p>
            <p className="text-gray-400 text-xs">Avg Rating</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
          >
            <Award className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-lg font-bold text-white truncate">{overallStats.topGenre}</p>
            <p className="text-gray-400 text-xs">Favorite Genre</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
          >
            <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-lg font-bold text-white truncate">
              {overallStats.highestRated.movieData?.title || 'N/A'}
            </p>
            <p className="text-gray-400 text-xs">Highest Rated ({overallStats.highestRated.rating}/10)</p>
          </motion.div>
        </div>
      )}

      {/* Genre Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Genre Preferences</h2>
        </div>

        {genreStats.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No genre data available</p>
        ) : (
          <div className="space-y-3">
            {genreStats.slice(0, 10).map((stat, index) => (
              <motion.div
                key={stat.genre}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-24 text-sm text-gray-300 truncate">{stat.genre}</div>
                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.count / maxGenreCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className="h-full rounded-lg"
                    style={{ backgroundColor: GENRE_COLORS[stat.genre] || '#6366f1' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-white text-xs font-medium">{stat.count} movies</span>
                    <span className="text-white/80 text-xs">{stat.avgRating.toFixed(1)} avg</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Monthly Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Monthly Activity</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {MONTHS.map((month, index) => {
            const monthNum = index + 1;
            const data = monthlyStats[monthNum];
            const hasData = data && data.count > 0;
            
            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-xl p-3 text-center transition-all ${
                  hasData
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-white/5 border border-white/5'
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${hasData ? 'text-purple-300' : 'text-gray-500'}`}>
                  {month}
                </p>
                <p className={`text-lg font-bold ${hasData ? 'text-white' : 'text-gray-600'}`}>
                  {data?.count || 0}
                </p>
                {hasData && data.topGenre && (
                  <p className="text-xs text-gray-400 truncate mt-1" title={data.topGenre}>
                    {data.topGenre}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Monthly Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500/20 border border-purple-500/30 rounded" />
            <span>Active months</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/5 border border-white/5 rounded" />
            <span>No activity</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;
