export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type: 'movie' | 'tv';
  name?: string;
  first_air_date?: string;
  original_language: string;
  popularity: number;
  origin_country?: string[];
}

export type Mood = 
  | 'happy'
  | 'sad'
  | 'relaxed'
  | 'anxious'
  | 'energetic'
  | 'bored'
  | 'romantic'
  | 'nostalgic'
  | 'adventurous'
  | 'thoughtful';

export interface MoodInfo {
  id: Mood;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

export const MOODS: MoodInfo[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#fbbf24', bgColor: 'bg-yellow-500/20', description: 'Feeling joyful and positive' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#60a5fa', bgColor: 'bg-blue-500/20', description: 'Feeling down or melancholic' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌', color: '#34d399', bgColor: 'bg-emerald-500/20', description: 'Calm and at ease' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#f87171', bgColor: 'bg-red-500/20', description: 'Feeling stressed or worried' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: '#fb923c', bgColor: 'bg-orange-500/20', description: 'Pumped up and active' },
  { id: 'bored', label: 'Bored', emoji: '😑', color: '#94a3b8', bgColor: 'bg-slate-500/20', description: 'Looking for stimulation' },
  { id: 'romantic', label: 'Romantic', emoji: '🥰', color: '#f472b6', bgColor: 'bg-pink-500/20', description: 'Feeling loving and tender' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '🌅', color: '#c084fc', bgColor: 'bg-purple-500/20', description: 'Missing the past' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🗺️', color: '#2dd4bf', bgColor: 'bg-teal-500/20', description: 'Ready for exploration' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '🤔', color: '#818cf8', bgColor: 'bg-indigo-500/20', description: 'In a reflective mood' },
];

export const getMoodInfo = (mood: Mood): MoodInfo => {
  return MOODS.find(m => m.id === mood) || MOODS[0];
};

export interface UserRating {
  movieId: number;
  rating: number;
  review?: string;
  ratedAt: string;
  syncedToIMDB: boolean;
  syncedToRT: boolean;
  movieData?: Movie;
  watchedAt?: WatchedDate;
  mood?: Mood; // How the user felt while watching
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface WishlistItem {
  movieId: number;
  addedAt: string;
  priority: 'high' | 'medium' | 'low';
  movieData?: Movie;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  imdbConnected: boolean;
  rtConnected: boolean;
  imdbUsername?: string;
  rtUsername?: string;
  country?: string;
  joinedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loginMethod: string | null;
}

export type ViewType = 'dashboard' | 'wishlist' | 'profile' | 'rated' | 'stats' | 'mood-calendar' | 'insights';

export interface WatchedDate {
  year: number;
  month?: number;
  day?: number;
}

// Vendor insight types
export interface MoodPattern {
  mood: Mood;
  topGenres: { genre: string; count: number }[];
  topCountries: { country: string; count: number }[];
  peakMonths: number[];
  peakTimeOfDay: string;
  avgRating: number;
  totalWatched: number;
}

export interface SeasonalInsight {
  season: string;
  dominantMood: Mood;
  topGenre: string;
  watchCount: number;
}
