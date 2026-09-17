import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Calendar, Clock } from 'lucide-react';
import { Movie, UserRating, Mood, MOODS, WatchedDate } from '../types';
import { getImageUrl } from '../services/tmdb';

interface MoodRatingModalProps {
  movie: Movie;
  onClose: () => void;
  onSubmit: (rating: UserRating) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TIMES: { value: 'morning' | 'afternoon' | 'evening' | 'night'; label: string; emoji: string }[] = [
  { value: 'morning', label: 'Morning', emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { value: 'evening', label: 'Evening', emoji: '🌆' },
  { value: 'night', label: 'Night', emoji: '🌙' },
];

const MoodRatingModal: React.FC<MoodRatingModalProps> = ({ movie, onClose, onSubmit }) => {
  const [step, setStep] = useState<'mood' | 'rating' | 'details'>('mood');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [watchedYear, setWatchedYear] = useState<string>('');
  const [watchedMonth, setWatchedMonth] = useState<string>('');
  const [watchedDay, setWatchedDay] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night' | null>(null);

  const title = movie.title || movie.name || 'Unknown';
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const daysInMonth = watchedYear && watchedMonth 
    ? new Date(parseInt(watchedYear), parseInt(watchedMonth), 0).getDate() 
    : 31;

  const handleSubmit = () => {
    if (!selectedMood || userRating === 0) return;

    const watchedAt: WatchedDate | undefined = watchedYear ? {
      year: parseInt(watchedYear),
      month: watchedMonth ? parseInt(watchedMonth) : undefined,
      day: watchedDay ? parseInt(watchedDay) : undefined,
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
      mood: selectedMood,
      timeOfDay: timeOfDay || undefined,
    };

    onSubmit(rating);
  };

  const canProceed = () => {
    switch (step) {
      case 'mood': return selectedMood !== null;
      case 'rating': return userRating > 0;
      case 'details': return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/5">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <img
              src={getImageUrl(movie.poster_path, 'w200')}
              alt={title}
              className="w-14 h-20 object-cover rounded-lg shadow-lg"
            />
            <div>
              <p className="text-white font-bold text-lg leading-tight">{title}</p>
              <p className="text-gray-400 text-sm">{year} • {movie.media_type === 'tv' ? 'Series' : 'Movie'}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {['mood', 'rating', 'details'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 ${step === s ? 'text-purple-400' : 'text-gray-500'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s ? 'bg-purple-500 text-white' : 
                    ['mood', 'rating', 'details'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {['mood', 'rating', 'details'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">
                    {s === 'mood' ? 'Mood' : s === 'rating' ? 'Rating' : 'Details'}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-white/10" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Mood Selection */}
          {step === 'mood' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-2">How are you feeling?</h3>
              <p className="text-gray-400 text-sm mb-5">
                Select the mood you're in right now or while watching
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      selectedMood === mood.id
                        ? 'border-purple-500 bg-purple-500/20 scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{mood.label}</p>
                      <p className="text-gray-400 text-[10px] leading-tight">{mood.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Rating */}
          {step === 'rating' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="mb-4">
                <span className="text-3xl">{MOODS.find(m => m.id === selectedMood)?.emoji}</span>
                <p className="text-gray-400 text-sm mt-1">Feeling {MOODS.find(m => m.id === selectedMood)?.label}</p>
              </div>
              
              <h3 className="text-white font-bold text-lg mb-2">Rate this {movie.media_type === 'tv' ? 'Series' : 'Movie'}</h3>
              <p className="text-gray-400 text-sm mb-5">How much did you enjoy it?</p>

              <div className="flex items-center justify-center gap-0.5 mb-3">
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
              <p className="text-white text-3xl font-bold">
                {hoverRating || userRating || 0}
                <span className="text-gray-500 text-lg">/10</span>
              </p>

              <textarea
                placeholder="Quick thoughts (optional)..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none h-16 mt-5"
              />
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-white font-bold text-lg mb-2">When did you watch it?</h3>
              <p className="text-gray-400 text-sm mb-5">Optional — helps us understand your patterns</p>

              {/* Date */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <p className="text-white text-sm font-medium">Watched Date</p>
                  <span className="text-gray-500 text-xs">(optional)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={watchedYear}
                    onChange={(e) => setWatchedYear(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
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
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1} className="bg-gray-900">{m}</option>
                    ))}
                  </select>
                  <select
                    value={watchedDay}
                    onChange={(e) => setWatchedDay(e.target.value)}
                    disabled={!watchedMonth}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Day</option>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-gray-900">{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time of Day */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <p className="text-white text-sm font-medium">Time of Day</p>
                  <span className="text-gray-500 text-xs">(optional)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => setTimeOfDay(timeOfDay === time.value ? null : time.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        timeOfDay === time.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{time.emoji}</span>
                      <span className="text-[10px] text-gray-300">{time.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center gap-3">
          {step !== 'mood' && (
            <button
              onClick={() => setStep(step === 'rating' ? 'mood' : 'rating')}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              Back
            </button>
          )}
          {step !== 'details' ? (
            <button
              onClick={() => setStep(step === 'mood' ? 'rating' : 'details')}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all"
            >
              Save & Sync ✨
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodRatingModal;
