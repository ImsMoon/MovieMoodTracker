import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Clock, Film, Target, Lightbulb, Users, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS, Mood, getMoodInfo, MoodPattern } from '../types';
import { GENRE_MAP } from '../services/tmdb';
import { getCountryName, getCountryFlag } from '../services/countries';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];

const getSeason = (month: number): string => {
  if (month >= 12 || month <= 2) return 'Winter';
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  return 'Fall';
};

const VendorInsights: React.FC = () => {
  const { ratings, user } = useApp();

  // Build mood patterns
  const moodPatterns = useMemo((): MoodPattern[] => {
    const patterns: Record<Mood, { genres: Record<string, number>; countries: Record<string, number>; months: Record<number, number>; times: Record<string, number>; ratings: number[]; count: number }> = {} as any;
    
    MOODS.forEach(m => {
      patterns[m.id] = { genres: {}, countries: {}, months: {}, times: {}, ratings: [], count: 0 };
    });

    ratings.forEach((r) => {
      if (!r.mood) return;
      const p = patterns[r.mood];
      p.count++;
      p.ratings.push(r.rating);

      // Genres
      r.movieData?.genre_ids?.forEach((id) => {
        const genre = GENRE_MAP[id];
        if (genre) p.genres[genre] = (p.genres[genre] || 0) + 1;
      });

      // Countries
      r.movieData?.origin_country?.forEach((code) => {
        p.countries[code] = (p.countries[code] || 0) + 1;
      });

      // Months
      const month = r.watchedAt?.month || new Date(r.ratedAt).getMonth() + 1;
      p.months[month] = (p.months[month] || 0) + 1;

      // Time of day
      if (r.timeOfDay) {
        p.times[r.timeOfDay] = (p.times[r.timeOfDay] || 0) + 1;
      }
    });

    return MOODS.map((mood) => {
      const p = patterns[mood.id];
      const topGenres = Object.entries(p.genres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre, count]) => ({ genre, count }));
      const topCountries = Object.entries(p.countries)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([country, count]) => ({ country, count }));
      const peakMonths = Object.entries(p.months)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([m]) => parseInt(m));
      const peakTime = Object.entries(p.times).sort((a, b) => b[1] - a[1])[0]?.[0] || 'evening';
      const avgRating = p.ratings.length > 0 ? p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length : 0;

      return {
        mood: mood.id,
        topGenres,
        topCountries,
        peakMonths,
        peakTimeOfDay: peakTime,
        avgRating,
        totalWatched: p.count,
      };
    }).filter(p => p.totalWatched > 0).sort((a, b) => b.totalWatched - a.totalWatched);
  }, [ratings]);

  // Seasonal insights
  const seasonalInsights = useMemo(() => {
    const seasonData: Record<string, { moods: Record<Mood, number>; genres: Record<string, number>; count: number }> = {};
    SEASONS.forEach(s => {
      seasonData[s] = { moods: {} as any, genres: {}, count: 0 };
      MOODS.forEach(m => { seasonData[s].moods[m.id] = 0; });
    });

    ratings.forEach((r) => {
      const month = r.watchedAt?.month || new Date(r.ratedAt).getMonth() + 1;
      const season = getSeason(month);
      seasonData[season].count++;
      if (r.mood) seasonData[season].moods[r.mood]++;
      r.movieData?.genre_ids?.forEach((id) => {
        const genre = GENRE_MAP[id];
        if (genre) seasonData[season].genres[genre] = (seasonData[season].genres[genre] || 0) + 1;
      });
    });

    return SEASONS.map((season) => {
      const data = seasonData[season];
      const dominantMood = Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0];
      const topGenre = Object.entries(data.genres).sort((a, b) => b[1] - a[1])[0];
      return {
        season,
        dominantMood: dominantMood ? dominantMood[0] as Mood : 'happy',
        topGenre: topGenre ? topGenre[0] : 'N/A',
        watchCount: data.count,
      };
    });
  }, [ratings]);

  // Generate vendor recommendations
  const vendorRecommendations = useMemo(() => {
    if (moodPatterns.length === 0) return [];
    
    const recommendations = [];
    const topMood = moodPatterns[0];
    
    // Recommendation 1: Content suggestion based on dominant mood
    if (topMood.topGenres.length > 0) {
      recommendations.push({
        vendor: 'Netflix',
        icon: '🎬',
        title: `Prioritize ${topMood.topGenres[0].genre} content`,
        description: `When users feel ${getMoodInfo(topMood.mood).label.toLowerCase()}, they watch ${topMood.topGenres[0].genre} content ${Math.round((topMood.topGenres[0].count / topMood.totalWatched) * 100)}% of the time. Feature more ${topMood.topGenres[0].genre.toLowerCase()} titles during peak ${getMoodInfo(topMood.mood).label.toLowerCase()} hours.`,
        impact: 'High',
        color: 'from-red-500/20 to-red-600/20 border-red-500/20',
      });
    }

    // Recommendation 2: Geographic targeting
    if (topMood.topCountries.length > 0) {
      const topCountry = topMood.topCountries[0];
      recommendations.push({
        vendor: 'Amazon Prime',
        icon: '📦',
        title: `${getCountryFlag(topCountry.country)} License more ${getCountryName(topCountry.country)} content`,
        description: `${getMoodInfo(topMood.mood).label} viewers prefer ${getCountryName(topCountry.country)} content. Consider licensing ${topCountry.count}x more titles from this region for mood-based recommendations.`,
        impact: 'Medium',
        color: 'from-blue-500/20 to-blue-600/20 border-blue-500/20',
      });
    }

    // Recommendation 3: Time-based
    const eveningMoods = moodPatterns.filter(p => p.peakTimeOfDay === 'evening' || p.peakTimeOfDay === 'night');
    if (eveningMoods.length > 0) {
      recommendations.push({
        vendor: 'Disney+',
        icon: '🏰',
        title: 'Evening content strategy',
        description: `${eveningMoods.length} mood patterns peak during evening/night. Push notifications and featured content should be optimized for 7-11 PM viewing window.`,
        impact: 'High',
        color: 'from-purple-500/20 to-purple-600/20 border-purple-500/20',
      });
    }

    // Recommendation 4: Seasonal
    const topSeason = seasonalInsights.sort((a, b) => b.watchCount - a.watchCount)[0];
    if (topSeason) {
      recommendations.push({
        vendor: 'HBO Max',
        icon: '🎭',
        title: `${topSeason.season} content push`,
        description: `Users watch most during ${topSeason.season} (${topSeason.watchCount} titles). Focus on ${getMoodInfo(topSeason.dominantMood).label}-themed ${topSeason.topGenre} campaigns during this period.`,
        impact: 'Medium',
        color: 'from-orange-500/20 to-orange-600/20 border-orange-500/20',
      });
    }

    return recommendations;
  }, [moodPatterns, seasonalInsights]);

  // Revenue potential
  const revenueInsight = useMemo(() => {
    const totalWatched = ratings.length;
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    const engagementScore = Math.min(100, Math.round((totalWatched / 50) * 100));
    
    return {
      totalWatched,
      avgRating: avgRating.toFixed(1),
      engagementScore,
      estimatedValue: `$${(totalWatched * 2.5).toFixed(0)}`,
    };
  }, [ratings]);

  if (ratings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No insights yet</p>
          <p className="text-gray-500 text-sm">Rate movies with your mood to generate vendor insights!</p>
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
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <TrendingUp className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Insights</h1>
            <p className="text-gray-400">What streaming platforms can learn from your data</p>
          </div>
        </div>
      </motion.div>

      {/* Value Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-800/50 border border-white/5 rounded-xl p-4">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{revenueInsight.totalWatched}</p>
          <p className="text-gray-400 text-xs">Data Points</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800/50 border border-white/5 rounded-xl p-4">
          <Target className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">{revenueInsight.engagementScore}%</p>
          <p className="text-gray-400 text-xs">Engagement</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-800/50 border border-white/5 rounded-xl p-4">
          <DollarSign className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">{revenueInsight.estimatedValue}</p>
          <p className="text-gray-400 text-xs">Est. Data Value</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-800/50 border border-white/5 rounded-xl p-4">
          <Lightbulb className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">{vendorRecommendations.length}</p>
          <p className="text-gray-400 text-xs">Recommendations</p>
        </motion.div>
      </div>

      {/* Vendor Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Actionable Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gradient-to-r ${rec.color} border rounded-xl p-5`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{rec.vendor}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      rec.impact === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{rec.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{rec.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mood Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Mood-Based Viewing Patterns
        </h2>
        <div className="space-y-4">
          {moodPatterns.slice(0, 5).map((pattern, index) => {
            const moodInfo = getMoodInfo(pattern.mood);
            return (
              <motion.div
                key={pattern.mood}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white/5 rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{moodInfo.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">{moodInfo.label}</p>
                      <span className="text-gray-400 text-sm">{pattern.totalWatched} titles</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs">Avg rating:</span>
                      <span className="text-yellow-400 text-xs font-bold">{pattern.avgRating.toFixed(1)}/10</span>
                      <span className="text-gray-500 text-xs ml-2">Peak time:</span>
                      <span className="text-blue-400 text-xs font-medium capitalize">{pattern.peakTimeOfDay}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Top Genres */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Top Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.topGenres.map((g) => (
                        <span key={g.genre} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                          {g.genre} ({g.count})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top Countries */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Top Countries</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.topCountries.map((c) => (
                        <span key={c.country} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                          {getCountryFlag(c.country)} {getCountryName(c.country)} ({c.count})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Peak Months */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Peak Months</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.peakMonths.map((m) => (
                        <span key={m} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                          {MONTHS[m - 1]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Seasonal Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          Seasonal Patterns
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {seasonalInsights.map((insight, index) => {
            const moodInfo = getMoodInfo(insight.dominantMood);
            const seasonEmoji = { Winter: '❄️', Spring: '🌸', Summer: '☀️', Fall: '🍂' }[insight.season];
            
            return (
              <motion.div
                key={insight.season}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 rounded-xl p-4 text-center border border-white/5"
              >
                <span className="text-3xl mb-2 block">{seasonEmoji}</span>
                <p className="text-white font-bold mb-2">{insight.season}</p>
                <div className="space-y-1">
                  <p className="text-2xl">{moodInfo.emoji}</p>
                  <p className="text-xs text-gray-400">{moodInfo.label}</p>
                  <p className="text-xs text-gray-500">{insight.topGenre}</p>
                  <p className="text-xs text-gray-500">{insight.watchCount} titles</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default VendorInsights;
