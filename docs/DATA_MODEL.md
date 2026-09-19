# 📊 Data Model

## Overview

This document defines all TypeScript types and data structures used throughout MoodFlix. Understanding the data model is essential for contributing to the project.

---

## Core Types

### Movie

Represents a movie or TV show from TMDB.

```typescript
interface Movie {
  id: number;                    // TMDB unique identifier
  title: string;                 // Movie title (or TV show name)
  overview: string;              // Plot summary
  poster_path: string | null;    // Relative path to poster image
  backdrop_path: string | null;  // Relative path to backdrop image
  release_date: string;          // Release date (YYYY-MM-DD)
  vote_average: number;          // TMDB rating (0-10)
  vote_count: number;            // Number of votes
  genre_ids: number[];           // Array of genre IDs
  media_type: 'movie' | 'tv';   // Content type
  name?: string;                 // TV show name (alternative to title)
  first_air_date?: string;       // TV show first air date
  original_language: string;     // Original language code (e.g., 'en')
  popularity: number;            // Popularity score
  origin_country?: string[];     // Country codes (e.g., ['US', 'GB'])
}
```

**Example:**
```typescript
{
  id: 550,
  title: "Fight Club",
  overview: "A ticking-Loss insomniac...",
  poster_path: "/fight_club_poster.jpg",
  backdrop_path: "/fight_club_backdrop.jpg",
  release_date: "1999-10-15",
  vote_average: 8.4,
  vote_count: 25000,
  genre_ids: [18, 53, 35],  // Drama, Thriller, Comedy
  media_type: 'movie',
  original_language: 'en',
  popularity: 61.2,
  origin_country: ['US', 'DE']
}
```

---

### Mood

Union type representing the 10 possible mood states.

```typescript
type Mood = 
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
```

---

### MoodInfo

Metadata for each mood state.

```typescript
interface MoodInfo {
  id: Mood;              // Mood identifier
  label: string;         // Display name (e.g., "Happy")
  emoji: string;         // Emoji representation (e.g., "😊")
  color: string;         // Hex color code (e.g., "#fbbf24")
  bgColor: string;       // Tailwind class (e.g., "bg-yellow-500/20")
  description: string;   // Short description
}
```

**Example:**
```typescript
{
  id: 'happy',
  label: 'Happy',
  emoji: '😊',
  color: '#fbbf24',
  bgColor: 'bg-yellow-500/20',
  description: 'Feeling joyful and positive'
}
```

---

### WatchedDate

Optional date when the user watched the movie.

```typescript
interface WatchedDate {
  year: number;          // Required (e.g., 2024)
  month?: number;        // Optional (1-12)
  day?: number;          // Optional (1-31)
}
```

**Examples:**
```typescript
// Full date
{ year: 2024, month: 10, day: 15 }

// Year and month only
{ year: 2024, month: 10 }

// Year only
{ year: 2024 }
```

---

### UserRating

A complete rating entry with all captured data.

```typescript
interface UserRating {
  movieId: number;                    // TMDB movie ID
  rating: number;                     // User rating (0-10)
  review?: string;                    // Optional text review
  ratedAt: string;                    // ISO timestamp when rated
  syncedToIMDB: boolean;              // Sync status
  syncedToRT: boolean;                // Sync status
  movieData?: Movie;                  // Full movie object (for offline access)
  watchedAt?: WatchedDate;            // When user watched it
  mood?: Mood;                        // User's mood while watching
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}
```

**Example:**
```typescript
{
  movieId: 550,
  rating: 9,
  review: "Mind-bending masterpiece",
  ratedAt: "2024-10-15T20:30:00.000Z",
  syncedToIMDB: true,
  syncedToRT: false,
  movieData: { /* full Movie object */ },
  watchedAt: { year: 2024, month: 10, day: 14 },
  mood: 'thoughtful',
  timeOfDay: 'evening'
}
```

---

### WishlistItem

A movie added to the user's wishlist.

```typescript
interface WishlistItem {
  movieId: number;                    // TMDB movie ID
  addedAt: string;                    // ISO timestamp
  priority: 'high' | 'medium' | 'low'; // User-defined priority
  movieData?: Movie;                  // Full movie object
}
```

**Example:**
```typescript
{
  movieId: 680,
  addedAt: "2024-10-15T20:30:00.000Z",
  priority: 'high',
  movieData: { /* full Movie object */ }
}
```

---

### UserProfile

Authenticated user information.

```typescript
interface UserProfile {
  id: string;                         // Unique user ID
  name: string;                       // Display name
  email: string;                      // Email address
  avatar?: string;                    // Avatar URL
  imdbConnected: boolean;             // IMDB sync status
  rtConnected: boolean;               // Rotten Tomatoes sync status
  imdbUsername?: string;              // IMDB username
  rtUsername?: string;                // RT username
  country?: string;                   // User's country code
  joinedAt: string;                   // Account creation timestamp
}
```

**Example:**
```typescript
{
  id: "user_1697400000000",
  name: "Movie Buff",
  email: "moviebuff@gmail.com",
  avatar: undefined,
  imdbConnected: true,
  rtConnected: false,
  imdbUsername: "movie_buff",
  rtUsername: undefined,
  country: "US",
  joinedAt: "2024-10-15T20:30:00.000Z"
}
```

---

## View Types

### ViewType

Navigation state for the app.

```typescript
type ViewType = 
  | 'dashboard'      // Main discovery view
  | 'wishlist'       // Wishlist slider
  | 'profile'        // User profile
  | 'rated'          // Rated movies slider
  | 'stats'          // Genre & monthly analytics
  | 'mood-calendar'  // Year heatmap
  | 'insights';      // Vendor recommendations
```

---

## Analytics Types

### MoodPattern

Aggregated data for a specific mood.

```typescript
interface MoodPattern {
  mood: Mood;                           // The mood
  topGenres: { genre: string; count: number }[];  // Top 3 genres
  topCountries: { country: string; count: number }[]; // Top 3 countries
  peakMonths: number[];                 // Peak months (1-12)
  peakTimeOfDay: string;                // Peak time slot
  avgRating: number;                    // Average rating
  totalWatched: number;                 // Total movies watched
}
```

**Example:**
```typescript
{
  mood: 'anxious',
  topGenres: [
    { genre: 'Thriller', count: 12 },
    { genre: 'Horror', count: 7 },
    { genre: 'Drama', count: 4 }
  ],
  topCountries: [
    { country: 'KR', count: 8 },
    { country: 'US', count: 6 },
    { country: 'GB', count: 4 }
  ],
  peakMonths: [10, 11, 9],
  peakTimeOfDay: 'night',
  avgRating: 7.8,
  totalWatched: 25
}
```

---

### SeasonalInsight

Aggregated data for a season.

```typescript
interface SeasonalInsight {
  season: string;           // "Winter" | "Spring" | "Summer" | "Fall"
  dominantMood: Mood;       // Most common mood
  topGenre: string;         // Most watched genre
  watchCount: number;       // Total movies watched
}
```

**Example:**
```typescript
{
  season: 'Fall',
  dominantMood: 'nostalgic',
  topGenre: 'Drama',
  watchCount: 45
}
```

---

## Context Types

### AppContextType

The shape of the global app context.

```typescript
interface AppContextType {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  ratings: UserRating[];
  wishlist: WishlistItem[];
  currentView: ViewType;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (value: boolean) => void;
  addRating: (rating: UserRating) => void;
  removeRating: (movieId: number) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (movieId: number) => void;
  setCurrentView: (view: ViewType) => void;
  logout: () => void;
  syncToIMDB: (movieId: number) => void;
  syncToRT: (movieId: number) => void;
}
```

---

## Storage Keys

LocalStorage keys used for persistence.

```typescript
const STORAGE_KEYS = {
  RATINGS: 'movietracker_ratings',
  WISHLIST: 'movietracker_wishlist',
  USER: 'movietracker_user',
  AUTH: 'movietracker_auth'
} as const;
```

---

## API Response Types

### TMDB Movie Response

```typescript
interface TMDBMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
```

### TMDB Trending Response

```typescript
interface TMDBTrendingResponse {
  page: number;
  results: (Movie & { media_type: 'movie' | 'tv' })[];
  total_pages: number;
  total_results: number;
}
```

---

## Utility Types

### Genre Map

Maps genre IDs to names.

```typescript
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // ... TV-specific genres
};
```

### Country Map

Maps country codes to names.

```typescript
const COUNTRY_NAMES: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'FR': 'France',
  'DE': 'Germany',
  'JP': 'Japan',
  'KR': 'South Korea',
  // ... 50+ countries
};
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    TMDB API                              │
│  /trending/all/week  /movie/popular  /tv/popular        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 tmdb.ts Service                          │
│  fetchTrending()  fetchPopularMovies()  fetchTopRated() │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Dashboard / TinderSlider                    │
│  Displays Movie[]  Handles swipe gestures               │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              MoodRatingModal                             │
│  Captures: mood, rating, watchedAt, timeOfDay           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              AppContext.addRating()                      │
│  Creates UserRating object                              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              storage.saveRating()                        │
│  Persists to LocalStorage                               │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         MoodCalendar / VendorInsights                    │
│  Reads ratings, computes patterns, displays insights    │
└─────────────────────────────────────────────────────────┘
```

---

## Type Safety Examples

### Mood Validation
```typescript
const isValidMood = (mood: string): mood is Mood => {
  return MOODS.some(m => m.id === mood);
};
```

### Rating Validation
```typescript
const isValidRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 10;
};
```

### Date Validation
```typescript
const isValidWatchedDate = (date: WatchedDate): boolean => {
  if (date.year < 1900 || date.year > new Date().getFullYear()) return false;
  if (date.month && (date.month < 1 || date.month > 12)) return false;
  if (date.day && (date.day < 1 || date.day > 31)) return false;
  return true;
};
```

---

**Next**: [Future Roadmap](./FUTURE_ROADMAP.md)
