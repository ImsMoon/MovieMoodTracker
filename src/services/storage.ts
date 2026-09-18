import { UserRating, WishlistItem, UserProfile } from '../types';

const RATINGS_KEY = 'movietracker_ratings';
const WISHLIST_KEY = 'movietracker_wishlist';
const USER_KEY = 'movietracker_user';
const AUTH_KEY = 'movietracker_auth';

export const storage = {
  // Ratings
  getRatings: (): UserRating[] => {
    const data = localStorage.getItem(RATINGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRating: (rating: UserRating): void => {
    const ratings = storage.getRatings();
    const existing = ratings.findIndex((r) => r.movieId === rating.movieId);
    if (existing >= 0) {
      ratings[existing] = rating;
    } else {
      ratings.push(rating);
    }
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  },

  removeRating: (movieId: number): void => {
    const ratings = storage.getRatings().filter((r) => r.movieId !== movieId);
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  },

  hasRated: (movieId: number): boolean => {
    return storage.getRatings().some((r) => r.movieId === movieId);
  },

  // Wishlist
  getWishlist: (): WishlistItem[] => {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToWishlist: (item: WishlistItem): void => {
    const wishlist = storage.getWishlist();
    const existing = wishlist.findIndex((w) => w.movieId === item.movieId);
    if (existing < 0) {
      wishlist.push(item);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  },

  removeFromWishlist: (movieId: number): void => {
    const wishlist = storage.getWishlist().filter((w) => w.movieId !== movieId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  },

  isInWishlist: (movieId: number): boolean => {
    return storage.getWishlist().some((w) => w.movieId === movieId);
  },

  // User
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: UserProfile): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Auth
  getAuthState: (): { isAuthenticated: boolean; loginMethod: string | null } => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : { isAuthenticated: false, loginMethod: null };
  },

  saveAuthState: (state: { isAuthenticated: boolean; loginMethod: string | null }): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
  },

  clearAll: (): void => {
    localStorage.removeItem(RATINGS_KEY);
    localStorage.removeItem(WISHLIST_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_KEY);
  },
};
