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
}

export interface UserRating {
  movieId: number;
  rating: number;
  review?: string;
  ratedAt: string;
  syncedToIMDB: boolean;
  syncedToRT: boolean;
}

export interface WishlistItem {
  movieId: number;
  addedAt: string;
  priority: 'high' | 'medium' | 'low';
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
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loginMethod: string | null;
}

export type ViewType = 'dashboard' | 'wishlist' | 'profile' | 'rated';
