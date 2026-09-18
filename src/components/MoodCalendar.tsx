import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS, Mood, getMoodInfo } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MoodCalendar: React.FC = () => {
  const { ratings } = useApp();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [filterMood, setFilterMood] = useState<Mood | 'all'>('all');

  // Get available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    ratings.forEach((r) => {
      if (r.watchedAt?.year) years.add(r.watchedAt.year);
      else years.add(new Date(r.ratedAt).getFullYear());
    });
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [ratings]);

  // Build calendar data - map each day to a mood
  const calendarData = useMemo(() => {
    const data: Record<string, { mood: Mood; rating: number; title: string }[]> = {};
    
    const filteredRatings = ratings.filter((r) => {
      if (filterMood !== 'all' && r.mood !== filterMood) return false;
      const year = r.watchedAt?.year || new Date(r.ratedAt).getFullYear();
      return year === selectedYear;
    });

    filteredRatings.forEach((r) => {
      if (!r.mood) return;
      
      let dateKey: string;
      if (r.watchedAt?.year && r.watchedAt?.month && r.watchedAt?.day) {
        dateKey = `${r.watchedAt.year}-${String(r.watchedAt.month).padStart(2, '0')}-${String(r.watchedAt.day).padStart(2, '0')}`;
      } else if (r.watchedAt?.year && r.watchedAt?.month) {
        // Random day in that month for display
        const day = Math.floor(Math.random() * 28) + 1;
        dateKey = `${r.watchedAt.year}-${String(r.watchedAt.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else {
        const d = new Date(r.ratedAt);
        dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      if (!data[dateKey]) data[dateKey] = [];
      data[dateKey].push({
        mood: r.mood,
        rating: r.rating,
        title: r.movieData?.title || r.movieData?.name || 'Unknown',
      });
    });

    return data;
  }, [ratings, selectedYear, filterMood]);

  // Monthly mood summary
  const monthlySummary = useMemo(() => {
    const summary: Record<number, Record<Mood, number>> = {} as any;
    
    for (let m = 1; m <= 12; m++) {
      summary[m] = {} as Record<Mood, number>;
      MOODS.forEach(mood => { summary[m][mood.id] = 0; });
    }

    ratings.forEach((r) => {
      if (!r.mood) return;
      const year = r.watchedAt?.year || new Date(r.ratedAt).getFullYear();
      if (year !== selectedYear) return;
      
      const month = r.watchedAt?.month || new Date(r.ratedAt).getMonth() + 1;
      if (summary[month]) {
        summary[month][r.mood]++;
      }
    });

    return summary;
  }, [ratings, selectedYear]);

  // Generate calendar grid for the year
  const generateYearGrid = () => {
    const weeks: { date: string; mood?: Mood; count: number }[][] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    // Start from the Sunday of the first week
    const current = new Date(startDate);
    current.setDate(current.getDate() - current.getDay());
    
    let currentWeek: { date: string; mood?: Mood; count: number }[] = [];
    
    while (current <= endDate || currentWeek.length > 0) {
      const dateStr = current.toISOString().split('T')[0];
      const inYear = current.getFullYear() === selectedYear;
      const dayData = calendarData[dateStr];
      
      currentWeek.push({
        date: dateStr,
        mood: inYear && dayData ? dayData[0].mood : undefined,
        count: inYear && dayData ? dayData.length : 0,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      current.setDate(current.getDate() + 1);
      if (current > endDate && currentWeek.length === 0) break;
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const yearGrid = generateYearGrid();
  const totalWatched = Object.values(calendarData).reduce((sum, arr) => sum + arr.length, 0);

  // Dominant mood for the year
  const moodCounts = useMemo(() => {
    const counts: Record<Mood, number> = {} as any;
    MOODS.forEach(m => { counts[m.id] = 0; });
    
    Object.values(calendarData).forEach(entries => {
      entries.forEach(e => {
        counts[e.mood]++;
      });
    });
    
    return counts;
  }, [calendarData]);

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

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
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Calendar className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mood Map</h1>
              <p className="text-gray-400">Your emotional journey through the year</p>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
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

      {/* Year Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs mb-1">Total Watched</p>
          <p className="text-2xl font-bold text-white">{totalWatched}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs mb-1">Dominant Mood</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dominantMood ? getMoodInfo(dominantMood[0] as Mood).emoji : '—'}</span>
            <span className="text-lg font-bold text-white">{dominantMood ? getMoodInfo(dominantMood[0] as Mood).label : '—'}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs mb-1">Moods Experienced</p>
          <p className="text-2xl font-bold text-white">
            {Object.values(moodCounts).filter(c => c > 0).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-white/5 rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs mb-1">Active Days</p>
          <p className="text-2xl font-bold text-white">{Object.keys(calendarData).length}</p>
        </motion.div>
      </div>

      {/* Mood Filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => setFilterMood('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            filterMood === 'all'
              ? 'bg-white/20 text-white border border-white/20'
              : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
          }`}
        >
          All Moods
        </button>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setFilterMood(mood.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterMood === mood.id
                ? `${mood.bgColor} text-white border border-white/20`
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
            {moodCounts[mood.id] > 0 && (
              <span className="ml-1 text-gray-500">({moodCounts[mood.id]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6 mb-8 overflow-x-auto"
      >
        <h2 className="text-lg font-semibold text-white mb-4">{selectedYear} Mood Calendar</h2>
        
        <div className="flex gap-1 min-w-[800px]">
          {/* Month labels */}
          <div className="flex flex-col gap-1 mr-2 flex-shrink-0">
            <div className="h-3" /> {/* spacer for day labels */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="h-3 flex items-center text-[10px] text-gray-500">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {yearGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              <div className="h-3" /> {/* spacer */}
              {week.map((day, dayIndex) => {
                const moodInfo = day.mood ? getMoodInfo(day.mood) : null;
                const isFiltered = filterMood !== 'all' && day.mood !== filterMood;
                
                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm transition-all ${
                      moodInfo && !isFiltered
                        ? ''
                        : 'bg-white/5'
                    }`}
                    style={{
                      backgroundColor: moodInfo && !isFiltered ? moodInfo.color : undefined,
                      opacity: moodInfo && !isFiltered ? 0.8 : 1,
                    }}
                    title={moodInfo ? `${day.date}: ${moodInfo.label}` : day.date}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <span className="text-gray-500 text-xs">Less</span>
          {MOODS.slice(0, 5).map((mood) => (
            <div key={mood.id} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: mood.color, opacity: 0.8 }} />
              <span className="text-[10px] text-gray-400">{mood.emoji}</span>
            </div>
          ))}
          <span className="text-gray-500 text-xs">More</span>
        </div>
      </motion.div>

      {/* Monthly Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-white/5 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Monthly Mood Breakdown</h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {MONTHS.map((month, index) => {
            const monthNum = index + 1;
            const data = monthlySummary[monthNum];
            const totalForMonth = Object.values(data).reduce((sum, c) => sum + c, 0);
            const topMood = Object.entries(data).sort((a, b) => b[1] - a[1])[0];
            const hasData = totalForMonth > 0;
            
            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-xl p-3 text-center transition-all ${
                  hasData ? 'bg-white/5 border border-white/10' : 'bg-white/[0.02] border border-white/5'
                }`}
              >
                <p className={`text-xs font-medium mb-2 ${hasData ? 'text-white' : 'text-gray-600'}`}>
                  {month}
                </p>
                {hasData ? (
                  <>
                    <p className="text-2xl mb-1">{getMoodInfo(topMood[0] as Mood).emoji}</p>
                    <p className="text-[10px] text-gray-400">{totalForMonth} watched</p>
                    <p className="text-[10px] text-gray-500 truncate">{getMoodInfo(topMood[0] as Mood).label}</p>
                  </>
                ) : (
                  <p className="text-gray-700 text-2xl mb-1">—</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodCalendar;
