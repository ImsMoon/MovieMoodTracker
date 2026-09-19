# 🛠️ Tech Stack

## Overview

MoodFlix is built with modern web technologies focused on performance, developer experience, and beautiful UI.

---

## Core Technologies

### React 18
**Why React?**
- Component-based architecture for reusable UI
- Virtual DOM for efficient updates
- Massive ecosystem and community
- Hooks for clean state management

**Key Features Used:**
- `useState` — Local component state
- `useEffect` — Side effects and data fetching
- `useMemo` — Expensive computation caching
- `useCallback` — Function memoization
- `useRef` — DOM references
- `useContext` — Global state access

**Version:** 18.2.0

---

### TypeScript
**Why TypeScript?**
- Static type checking catches bugs early
- Better IDE support and autocomplete
- Self-documenting code
- Safer refactoring

**Key Features Used:**
- Interfaces for data models
- Type unions for mood states
- Generic types for flexibility
- Strict mode enabled

**Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx"
  }
}
```

---

### Tailwind CSS 4
**Why Tailwind?**
- Utility-first approach for rapid styling
- No context switching between CSS and JS
- Consistent design system
- Tiny production bundle (purged unused styles)

**Key Features Used:**
- Responsive design (`sm:`, `md:`, `lg:`)
- Dark mode support
- Custom color palette
- Gradient utilities
- Backdrop blur effects
- Animation utilities

**Custom Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom brand colors
      },
      animation: {
        // Custom animations
      }
    }
  }
}
```

---

### Framer Motion
**Why Framer Motion?**
- Declarative animations
- Physics-based spring animations
- Gesture support (drag, tap, hover)
- Layout animations
- Exit animations

**Key Features Used:**
- `motion.div` — Animated components
- `useMotionValue` — Reactive values
- `useTransform` — Value interpolation
- `AnimatePresence` — Exit animations
- `drag` — Swipe gestures
- `whileTap` — Tap feedback
- `initial` / `animate` / `exit` — Animation states

**Example:**
```typescript
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  style={{ x, rotate }}
  whileTap={{ scale: 1.02 }}
>
  {/* Card content */}
</motion.div>
```

---

### Vite
**Why Vite?**
- Lightning-fast dev server (native ES modules)
- Instant hot module replacement (HMR)
- Optimized production builds (Rollup)
- TypeScript support out of the box

**Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

**Build Output:**
- HTML: ~3 KB
- CSS: ~58 KB (gzipped: ~9 KB)
- JS: ~378 KB (gzipped: ~109 KB)

---

## State Management

### React Context API
**Why Context?**
- Built into React (no extra dependencies)
- Simple for small-to-medium apps
- Type-safe with TypeScript
- No boilerplate

**Implementation:**
```typescript
// AppContext.tsx
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  // ... more state
  
  return (
    <AppContext.Provider value={{ user, ratings, /* ... */ }}>
      {children}
    </AppContext.Provider>
  );
};

// Usage
const { user, ratings } = useApp();
```

**Why Not Redux/Zustand?**
- App complexity doesn't require external state library
- Context is sufficient for current feature set
- Simpler mental model
- Less boilerplate

---

## Data Persistence

### LocalStorage
**Why LocalStorage?**
- No backend required for MVP
- Instant persistence
- Works offline
- Simple API

**Implementation:**
```typescript
// storage.ts
export const storage = {
  getRatings: (): UserRating[] => {
    const data = localStorage.getItem('movietracker_ratings');
    return data ? JSON.parse(data) : [];
  },
  
  saveRating: (rating: UserRating): void => {
    const ratings = storage.getRatings();
    ratings.push(rating);
    localStorage.setItem('movietracker_ratings', JSON.stringify(ratings));
  }
};
```

**Limitations:**
- ~5MB storage limit
- Synchronous API (can block main thread)
- No query capabilities
- Single device only

**Future Migration Path:**
1. IndexedDB for larger storage
2. Backend API for cloud sync
3. PostgreSQL/MongoDB for server-side persistence

---

## API Integration

### TMDB (The Movie Database)
**Why TMDB?**
- Free API for non-commercial use
- Comprehensive movie/TV database
- High-quality images
- Well-documented REST API

**Endpoints Used:**
```typescript
// Trending
GET /3/trending/all/week?api_key=XXX

// Popular Movies
GET /3/movie/popular?api_key=XXX&page=1

// Popular TV
GET /3/tv/popular?api_key=XXX&page=1

// Top Rated
GET /3/movie/top_rated?api_key=XXX&page=1
```

**Image CDN:**
```
https://image.tmdb.org/t/p/{size}{path}

Sizes: w200, w500, w780, original
```

**Rate Limits:**
- 40 requests per 10 seconds
- Handled with pagination and caching

---

## Icons

### Lucide React
**Why Lucide?**
- Beautiful, consistent icon set
- Tree-shakeable (only import what you use)
- TypeScript support
- MIT licensed

**Usage:**
```typescript
import { Star, Heart, Calendar } from 'lucide-react';

<Star className="w-5 h-5 text-yellow-400" />
```

---

## Development Tools

### ESLint
- Code quality enforcement
- React-specific rules
- TypeScript integration

### Prettier
- Consistent code formatting
- Auto-format on save

### Git
- Version control
- Branch-based workflow
- Commit hooks (future)

---

## Production Considerations

### Performance Optimizations

#### 1. Code Splitting (Future)
```typescript
// Lazy load heavy components
const VendorInsights = lazy(() => import('./components/VendorInsights'));
```

#### 2. Image Optimization
- Lazy loading for non-critical images
- Responsive image sizes from TMDB CDN
- WebP format support (future)

#### 3. Memoization
```typescript
// Expensive computations
const moodPatterns = useMemo(() => {
  // Complex analysis
}, [ratings]);
```

#### 4. Debouncing
```typescript
// Scroll handlers
const handleScroll = useCallback(
  debounce(() => {
    // Check if should load more
  }, 200),
  []
);
```

### Bundle Analysis
```
Total: ~436 KB (uncompressed)
Gzipped: ~118 KB

Breakdown:
- React: ~40 KB
- Framer Motion: ~80 KB
- App code: ~250 KB
- CSS: ~58 KB
```

### Caching Strategy
- **Images**: Browser cache + CDN
- **API responses**: In-memory cache
- **User data**: LocalStorage
- **Static assets**: Immutable filenames

---

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- None required (modern browsers only)
- ES2020 features used
- CSS Grid and Flexbox

### Mobile Support
- iOS Safari 14+
- Android Chrome 90+
- Touch gestures optimized
- Responsive breakpoints

---

## Security

### Current State
- No backend (client-side only)
- TMDB API key exposed (demo only)
- LocalStorage for user data
- No authentication backend

### Production Recommendations
1. **API Key Security**
   - Move to backend proxy
   - Use environment variables
   - Implement rate limiting

2. **Authentication**
   - OAuth 2.0 for social login
   - JWT for session management
   - Secure cookie storage

3. **Data Protection**
   - HTTPS everywhere
   - Input sanitization
   - CSP headers
   - XSS prevention

4. **Privacy**
   - GDPR compliance
   - Data export functionality
   - Account deletion
   - Privacy policy

---

## Monitoring & Analytics (Future)

### Error Tracking
- Sentry for error monitoring
- Source maps for debugging
- User context in error reports

### Performance Monitoring
- Web Vitals (LCP, FID, CLS)
- Real User Monitoring (RUM)
- Lighthouse CI in deployment

### Analytics
- Privacy-first analytics (Plausible/Fathom)
- Feature usage tracking
- User journey mapping

---

## Deployment

### Current Setup
- Static site hosting (Vercel/Netlify)
- Automatic builds on push
- Preview deployments for PRs

### Production Architecture (Future)
```
┌─────────────┐
│   CDN       │ ← Static assets
│ (Cloudflare)│
└─────────────┘
      │
      ▼
┌─────────────┐
│   Frontend  │ ← React SPA
│   (Vercel)  │
└─────────────┘
      │
      ▼
┌─────────────┐
│   Backend   │ ← API proxy
│   (Railway) │
└─────────────┘
      │
      ▼
┌─────────────┐
│  Database   │ ← PostgreSQL
│  (Supabase) │
└─────────────┘
```

---

**Next**: [Data Model](./DATA_MODEL.md)
