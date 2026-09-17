import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRating, WishlistItem, ViewType } from '../types';
import { storage } from '../services/storage';

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  ratings: UserRating[];
  wishlist: WishlistItem[];
  currentView: ViewType;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  useEffect(() => {
    const storedUser = storage.getUser();
    const authState = storage.getAuthState();
    if (storedUser && authState.isAuthenticated) {
      setUserState(storedUser);
      setIsAuthenticated(true);
    }
    setRatings(storage.getRatings());
    setWishlist(storage.getWishlist());
  }, []);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) storage.saveUser(newUser);
  };

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
    storage.saveAuthState({ isAuthenticated: value, loginMethod: value ? 'google' : null });
  };

  const addRating = (rating: UserRating) => {
    storage.saveRating(rating);
    setRatings(storage.getRatings());
  };

  const removeRating = (movieId: number) => {
    storage.removeRating(movieId);
    setRatings(storage.getRatings());
  };

  const addToWishlist = (item: WishlistItem) => {
    storage.addToWishlist(item);
    setWishlist(storage.getWishlist());
  };

  const removeFromWishlist = (movieId: number) => {
    storage.removeFromWishlist(movieId);
    setWishlist(storage.getWishlist());
  };

  const syncToIMDB = (movieId: number) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.movieId === movieId ? { ...r, syncedToIMDB: true } : r
      )
    );
    const updatedRatings = storage.getRatings().map((r) =>
      r.movieId === movieId ? { ...r, syncedToIMDB: true } : r
    );
    localStorage.setItem('movietracker_ratings', JSON.stringify(updatedRatings));
  };

  const syncToRT = (movieId: number) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.movieId === movieId ? { ...r, syncedToRT: true } : r
      )
    );
    const updatedRatings = storage.getRatings().map((r) =>
      r.movieId === movieId ? { ...r, syncedToRT: true } : r
    );
    localStorage.setItem('movietracker_ratings', JSON.stringify(updatedRatings));
  };

  const logout = () => {
    storage.clearAll();
    setUserState(null);
    setIsAuthenticated(false);
    setRatings([]);
    setWishlist([]);
    setCurrentView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        ratings,
        wishlist,
        currentView,
        setUser,
        setAuthenticated,
        addRating,
        removeRating,
        addToWishlist,
        removeFromWishlist,
        setCurrentView,
        logout,
        syncToIMDB,
        syncToRT,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
