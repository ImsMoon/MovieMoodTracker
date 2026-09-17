import { Movie } from '../types';

const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null): string => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
  return `${IMAGE_BASE}/w1280${path}`;
};

export const GENRE_MAP: Record<number, string> = {
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
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    const data = await response.json();
    return data.results.map((movie: any) => ({
      ...movie,
      media_type: 'movie' as const,
      origin_country: movie.origin_country || ['US'],
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const fetchPopularTV = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );
    const data = await response.json();
    return data.results.map((show: any) => ({
      ...show,
      media_type: 'tv' as const,
      title: show.name,
      release_date: show.first_air_date,
      origin_country: show.origin_country || ['US'],
    }));
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results.map((item: any) => ({
      ...item,
      title: item.title || item.name,
      release_date: item.release_date || item.first_air_date,
      origin_country: item.origin_country || ['US'],
    }));
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const fetchTopRated = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results.map((movie: any) => ({
      ...movie,
      media_type: 'movie' as const,
    }));
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return [];
  }
};
