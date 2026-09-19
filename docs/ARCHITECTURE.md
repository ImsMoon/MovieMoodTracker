# 🏗️ Architecture

## System Overview

MoodFlix is a single-page application (SPA) built with React and TypeScript, designed to capture emotional context alongside movie viewing habits.

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
├─────────────────────────────────────────────────────────────┤
│  Dashboard  │  Mood Map  │  Stats  │  Insights  │  Profile  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Context Layer                        │
│                   (AppContext.tsx)                           │
│  • User State  • Ratings  • Wishlist  • Navigation         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
├──────────────┬──────────────┬───────────────────────────────┤
│  TMDB API    │   Storage    │      Countries                │
│  (tmdb.ts)   │ (storage.ts) │    (countries.ts)             │
└──────────────┴──────────────┴───────────────────────────────┘
```

## Component Architecture

### Core Components

#### 1. App.tsx
- Root component with ErrorBoundary
- Manages authentication state
- Routes between views

#### 2. AppContext.tsx
- Global state management using React Context
- Stores: user, ratings, wishlist, navigation
- Provides methods for state mutations
- Persists to LocalStorage

#### 3. Dashboard.tsx
- Main discovery interface
- Category tabs (Trending, Movies, Series, Top Rated)
- Integrates TinderSlider component
- Handles infinite scroll pagination

#### 4. TinderSlider.tsx
- Tinder-style card stack
- Manages card state and swipe gestures
- Coordinates with MoodRatingModal
- Handles stack depth and z-indexing

#### 5. MoodRatingModal.tsx
- 3-step rating flow (Mood → Rating → Details)
- Captures mood, rating, date, time of day
- Submits to AppContext

#### 6. MoodCalendar.tsx
- GitHub-style heatmap visualization
- Monthly mood breakdown
- Year filter and mood filter
- Computes dominant moods

#### 7. VendorInsights.tsx
- Analyzes mood patterns
- Generates actionable recommendations
- Shows seasonal insights
- Displays revenue metrics

## Data Flow

### Rating Flow
```
User swipes right
    ↓
TinderSlider opens MoodRatingModal
    ↓
User selects mood (Step 1)
    ↓
User rates movie (Step 2)
    ↓
User adds date/time (Step 3)
    ↓
Modal calls onSubmit(rating)
    ↓
TinderSlider calls addRating()
    ↓
AppContext saves to LocalStorage
    ↓
Card advances to next
```

### Data Persistence
```
AppContext
    ↓
storage.saveRating()
    ↓
localStorage.setItem('movietracker_ratings', JSON.stringify(ratings))
```

## State Management

### Global State (AppContext)
```typescript
{
  user: UserProfile | null,
  isAuthenticated: boolean,
  ratings: UserRating[],
  wishlist: WishlistItem[],
  currentView: ViewType
}
```

### Local State (Components)
- TinderSlider: currentIndex, showRating, showDetails, currentMovie
- MoodRatingModal: step, selectedMood, userRating, review, watchedDate
- MoodCalendar: selectedYear, filterMood

## API Integration

### TMDB API
- **Base URL**: `https://api.themoviedb.org/3`
- **Endpoints Used**:
  - `/trending/all/week` — Trending content
  - `/movie/popular` — Popular movies
  - `/tv/popular` — Popular TV shows
  - `/movie/top_rated` — Top rated movies
- **Image CDN**: `https://image.tmdb.org/t/p/`
- **Sizes**: w200, w500, w780, original

### Data Enrichment
- Country codes from `origin_country` field
- Genre mapping from `genre_ids` to names
- Mood data added by user (not from API)

## Performance Considerations

### Optimizations
1. **Lazy Loading**: Images use `loading="lazy"` for non-critical images
2. **Infinite Scroll**: Load more content as user swipes
3. **Memoization**: `useMemo` for expensive computations (mood patterns, calendar data)
4. **Code Splitting**: Components are lazy-loaded (future enhancement)

### Memory Management
- Card stack limited to 3 visible cards
- Old cards are unmounted when swiped
- LocalStorage has ~5MB limit (monitored)

## Security

### Current State
- TMDB API key exposed in frontend (demo only)
- LocalStorage for user data (no backend)
- No authentication backend

### Production Recommendations
1. Move API key to backend proxy
2. Implement proper authentication (OAuth, JWT)
3. Add backend database (PostgreSQL, MongoDB)
4. Implement rate limiting
5. Add input validation and sanitization
6. Use HTTPS everywhere
7. Implement CSP headers

## Scalability

### Current Limitations
- LocalStorage only (single device)
- No real-time sync
- No user accounts
- No social features

### Scaling Path
1. Add backend API (Node.js/Express or Next.js)
2. Migrate to cloud database
3. Implement user authentication
4. Add real-time features (WebSockets)
5. Implement CDN for images
6. Add analytics and monitoring

## Testing Strategy (Future)

### Unit Tests
- Component tests (React Testing Library)
- Service tests (Jest)
- Utility function tests

### Integration Tests
- API integration tests
- State management tests
- User flow tests

### E2E Tests
- Cypress or Playwright
- Critical user journeys
- Cross-browser testing

---

**Next**: [Features Documentation](./FEATURES.md)
