# ✨ Features

## Overview

MoodFlix combines movie discovery with emotional tracking to create a unique behavioral analytics platform. This document details every feature and how it works.

### 🎬 See Features in Action

**Live Demo:** [https://moviemoodtracker.imtiyaz-moon.workers.dev/](https://moviemoodtracker.imtiyaz-moon.workers.dev/)

---

## 🎴 Tinder-Style Discovery

### Description
A swipeable card interface inspired by Tinder, where users browse movies and make quick decisions.

### How It Works
1. **Card Stack**: Shows 3 cards stacked with depth effect
2. **Swipe Right**: Opens mood rating flow (marks as "seen")
3. **Swipe Left**: Adds to wishlist
4. **Info Button**: Opens detailed movie information
5. **Action Buttons**: Three circular buttons at bottom for explicit actions

### Technical Details
- Built with Framer Motion for smooth animations
- Drag constraints prevent cards from going too far
- Rotation follows drag direction (up to ±25°)
- Cards scale and fade as they're dragged
- Stack depth: top card (100% scale), second (95%), third (90%)

### Visual Feedback
- **"SEEN IT"** stamp appears when swiping right
- **"WISHLIST"** stamp appears when swiping left
- Stamps rotate and fade based on drag distance
- Smooth spring animations on release

### Infinite Scroll
- Automatically loads more movies as user swipes
- Fetches next page from TMDB API
- Shows loading spinner at end of stack
- No hard limit on content

---

## 🎭 Mood Tracking System

### 10 Mood States

| Mood | Emoji | Color | Description | Use Case |
|------|-------|-------|-------------|----------|
| Happy | 😊 | Yellow | Joyful, positive | Feel-good movies, comedies |
| Sad | 😢 | Blue | Melancholic, down | Dramas, tearjerkers |
| Relaxed | 😌 | Green | Calm, at ease | Light content, nature docs |
| Anxious | 😰 | Red | Stressed, worried | Thrillers, horror |
| Energetic | ⚡ | Orange | Pumped, active | Action, sports films |
| Bored | 😑 | Gray | Seeking stimulation | Anything new, blockbusters |
| Romantic | 🥰 | Pink | Loving, tender | Romance, rom-coms |
| Nostalgic | 🌅 | Purple | Missing the past | Classics, period pieces |
| Adventurous | 🗺️ | Teal | Ready to explore | Travel, fantasy, sci-fi |
| Thoughtful | 🤔 | Indigo | Reflective | Documentaries, indie films |

### 3-Step Rating Flow

#### Step 1: Mood Selection
- Grid of 10 mood buttons with emojis
- Each shows mood name and description
- Selection highlights with purple border
- Required to proceed

#### Step 2: Rating
- 10-star rating system (0-10)
- Hover preview shows what rating will be
- Large number display of current rating
- Optional review text area
- Required to proceed

#### Step 3: Details (Optional)
- **Watched Date**: Year, month, day dropdowns
  - Year required to enable month
  - Month required to enable day
  - Smart day count based on month/year
- **Time of Day**: Morning, Afternoon, Evening, Night
  - Emoji icons for visual clarity
  - Optional selection
- All fields are optional

### Data Captured
```typescript
{
  movieId: number,
  rating: number,           // 0-10
  mood: Mood,               // One of 10 moods
  review?: string,          // Optional text
  watchedAt?: {
    year: number,
    month?: number,         // 1-12
    day?: number            // 1-31
  },
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night',
  ratedAt: string,          // ISO timestamp
  movieData: Movie,         // Full movie object
  syncedToIMDB: boolean,
  syncedToRT: boolean
}
```

---

## 📅 Mood Map (Calendar View)

### Description
A GitHub-style heatmap showing your emotional journey across the entire year.

### Features

#### Year-at-a-Glance Heatmap
- 52 weeks × 7 days grid
- Each cell colored by mood
- Intensity based on number of movies watched
- Hover tooltip shows date and mood

#### Monthly Breakdown
- 12-month grid showing dominant mood per month
- Watch count per month
- Mood emoji for quick visual

#### Filters
- **Year Filter**: Switch between years or view all-time
- **Mood Filter**: Highlight specific mood across the year
- Shows count per mood in filter buttons

#### Statistics Cards
- Total movies watched
- Dominant mood for the year
- Number of different moods experienced
- Number of active days

### Use Cases
- Track emotional patterns across seasons
- Identify which months you watch most
- See how your mood preferences change over time
- Share your "year in review" mood map

---

## 📊 Stats & Analytics

### Genre Preferences
- Top 10 genres by watch count
- Animated horizontal bar chart
- Shows average rating per genre
- Color-coded by genre

### Monthly Activity
- 12-month grid
- Watch count per month
- Top genre per month
- Visual indicators for active/inactive months

### Overview Cards
- Total movies rated
- Average rating across all movies
- Favorite genre (most watched)
- Highest rated movie

### Year Filter
- View stats for specific year
- Compare year-over-year trends
- All-time aggregate view

---

## 💡 Vendor Insights

### Description
Actionable recommendations for streaming platforms based on user mood data.

### Recommendation Types

#### 1. Content Strategy
- **Example**: "Prioritize Korean thrillers for anxious viewers in October"
- **Data**: Mood + Genre + Month correlation
- **Impact**: High/Medium/Low rating

#### 2. Geographic Targeting
- **Example**: "License more French content for romantic mood viewers"
- **Data**: Mood + Country preference
- **Impact**: Regional content acquisition

#### 3. Time-Based Optimization
- **Example**: "Push notifications for energetic content at 7-11 PM"
- **Data**: Mood + Time of day patterns
- **Impact**: Engagement optimization

#### 4. Seasonal Campaigns
- **Example**: "Winter nostalgia campaign with 80s classics"
- **Data**: Season + Mood + Genre trends
- **Impact**: Seasonal marketing

### Metrics Dashboard
- **Data Points**: Total ratings captured
- **Engagement Score**: 0-100% based on activity
- **Estimated Data Value**: Dollar value of insights
- **Recommendation Count**: Number of actionable insights

### Mood Pattern Analysis
For each mood, shows:
- Top 3 genres watched
- Top 3 countries of origin
- Peak months for that mood
- Peak time of day
- Average rating
- Total titles watched

### Seasonal Insights
- 4 seasons (Winter, Spring, Summer, Fall)
- Dominant mood per season
- Top genre per season
- Watch count per season

---

## 🔄 Platform Sync

### IMDB Integration
- Connect via Amazon, Google, or Facebook
- Simulated sync of ratings
- Visual sync status (synced/not synced)
- Per-movie sync button
- Bulk sync all ratings

### Rotten Tomatoes Integration
- Connect via Google, Facebook, or Apple
- Simulated sync of ratings
- Visual sync status
- Per-movie sync button
- Bulk sync all ratings

### Sync Status Display
- Green checkmark for synced ratings
- Yellow/orange for pending sync
- Progress bars showing sync completion
- Platform connection status in profile

---

## 👤 User Profile

### Account Management
- User name and email display
- Avatar with initial
- Sign out button

### Platform Connections
- IMDB connection status
- Rotten Tomatoes connection status
- Connect/disconnect buttons
- Username display when connected

### Sync Statistics
- Total syncs to IMDB
- Total syncs to Rotten Tomatoes
- Progress bars for each platform

### Recent Activity
- Last 5 rated movies
- Mood emoji and rating
- Watched date if available
- Quick visual summary

---

## 🔐 Authentication

### Social Login Options
- Google
- Apple
- Facebook
- Demo mode (skip login)

### Platform Connection
- IMDB (via Amazon/Google/Facebook)
- Rotten Tomatoes (via Google/Facebook/Apple)
- Email/password fallback

### Session Management
- LocalStorage for persistence
- Auto-login on return visit
- Clear all data on logout

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (single column, stacked UI)
- **Tablet**: 640px - 1024px (2-column grids)
- **Desktop**: > 1024px (full layout)

### Adaptations
- Navigation collapses to icons on mobile
- Card stack scales to fit screen
- Modals become full-screen on mobile
- Grid layouts adjust column count
- Touch-friendly button sizes

---

## 🎨 UI/UX Details

### Animations
- Page transitions (fade + slide)
- Card swipe physics (rotation, scale, opacity)
- Modal entrance (scale + fade)
- Button hover states (scale + color)
- Loading spinners
- Progress bar animations

### Color System
- **Primary**: Purple/Pink gradient
- **Secondary**: Blue/Teal
- **Success**: Green
- **Warning**: Yellow/Orange
- **Error**: Red
- **Background**: Dark gray gradient

### Typography
- **Headings**: Bold, large, white
- **Body**: Regular, gray-300
- **Captions**: Small, gray-400
- **Font**: System font stack

### Accessibility
- Keyboard navigation support
- Focus indicators (purple outline)
- ARIA labels on buttons
- Color contrast compliance
- Screen reader friendly

---

## 🚀 Performance Features

### Lazy Loading
- Images load on demand
- Non-critical components lazy-loaded
- Infinite scroll for content

### Caching
- LocalStorage for user data
- Browser cache for images
- Memoized computations

### Optimization
- Minimal re-renders
- Efficient state updates
- Debounced scroll handlers

---

**Next**: [Mood Tracking Deep Dive](./MOOD_TRACKING.md)
