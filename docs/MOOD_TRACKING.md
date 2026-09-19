# 🎭 Mood Tracking — Deep Dive

## Overview

Mood tracking is the core differentiator of MoodFlix. Unlike traditional movie trackers that only capture ratings, we capture the **emotional context** of every viewing experience. This document explains how mood data is collected, stored, analyzed, and visualized.

---

## The Psychology Behind Mood Tracking

### Why Moods Matter

Research in media psychology shows that:
1. **Mood-congruent selection**: People choose content that matches or complements their current mood
2. **Mood repair**: People use media to regulate emotions (sad → uplifting, anxious → calming)
3. **Mood reinforcement**: Certain content amplifies existing moods
4. **Seasonal patterns**: Moods shift with seasons, affecting content preferences

### What We Capture

| Data Point | Purpose | Example |
|-----------|---------|---------|
| Mood state | Emotional context | "I felt nostalgic" |
| Rating | Quality assessment | "8/10" |
| Watch date | Temporal pattern | "October 15, 2024" |
| Time of day | Circadian pattern | "Evening" |
| Genre | Content type | "Drama" |
| Country | Cultural preference | "South Korea" |
| Review | Qualitative context | "Reminded me of college" |

---

## Mood Selection System

### The 10 Mood Model

We use a circumplex model of affect, mapping moods on two axes:
- **Valence** (pleasant vs. unpleasant)
- **Arousal** (high energy vs. low energy)

```
         High Arousal
              │
   Energetic ⚡ │ 😰 Anxious
              │
              │
  ────────────┼────────────
              │
   Happy 😊   │   Sad 😢
              │
              │
   Adventurous 🗺️ │ 😌 Relaxed
              │
         Low Arousal
  
  (Left = Unpleasant, Right = Pleasant)
```

### Mood Descriptions

Each mood includes:
- **Emoji**: Visual representation
- **Label**: Short name
- **Description**: 4-5 word explanation
- **Color**: Unique hex color for visualization
- **Background**: Tailwind class for UI

### Selection UX

```
┌─────────────────────────────────────┐
│  How are you feeling?               │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 😊 Happy │  │ 😢 Sad   │        │
│  │ Feeling  │  │ Feeling  │        │
│  │ joyful   │  │ down     │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 😌 Relax │  │ 😰 Anxious│       │
│  │ Calm and │  │ Stressed │        │
│  │ at ease  │  │ worried  │        │
│  └──────────┘  └──────────┘        │
│  ...                                │
└─────────────────────────────────────┘
```

---

## Data Collection Flow

### Step 1: Mood Selection
```
User swipes right on movie card
    ↓
MoodRatingModal opens at Step 1
    ↓
User sees 10 mood options in 2×5 grid
    ↓
User taps a mood → highlighted with purple border
    ↓
"Continue" button becomes active
    ↓
User taps Continue → moves to Step 2
```

### Step 2: Rating
```
User sees 10-star rating interface
    ↓
User hovers → stars fill with yellow
    ↓
User clicks → rating is set
    ↓
Large number shows current rating
    ↓
Optional: User writes review text
    ↓
User taps Continue → moves to Step 3
```

### Step 3: Details (Optional)
```
User sees date picker
    ↓
Optional: Select year → enables month dropdown
    ↓
Optional: Select month → enables day dropdown
    ↓
Optional: Select time of day (morning/afternoon/evening/night)
    ↓
User taps "Save & Sync" → rating is submitted
```

### Data Structure
```typescript
interface UserRating {
  movieId: number;
  rating: number;                    // 0-10
  mood: Mood;                        // 'happy' | 'sad' | ...
  review?: string;                   // Optional text
  ratedAt: string;                   // ISO timestamp
  watchedAt?: {
    year: number;
    month?: number;                  // 1-12
    day?: number;                    // 1-31
  };
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  movieData: Movie;                  // Full TMDB movie object
  syncedToIMDB: boolean;
  syncedToRT: boolean;
}
```

---

## Mood Analysis

### Pattern Detection

#### Mood-Genre Correlation
```
For each mood:
  Count genres across all movies watched in that mood
  Rank by frequency
  Identify top 3 genres
```

**Example Output:**
```
When feeling SAD:
  1. Drama (45% of the time)
  2. Romance (25%)
  3. Documentary (15%)
```

#### Mood-Country Correlation
```
For each mood:
  Count countries of origin
  Rank by frequency
  Identify top 3 countries
```

**Example Output:**
```
When feeling NOSTALGIC:
  1. 🇺🇸 United States (60%)
  2. 🇬🇧 United Kingdom (20%)
  3. 🇫🇷 France (10%)
```

#### Mood-Season Correlation
```
For each season:
  Count moods
  Find dominant mood
  Find top genre
```

**Example Output:**
```
Winter: Dominant mood = Nostalgic, Top genre = Drama
Spring: Dominant mood = Adventurous, Top genre = Action
Summer: Dominant mood = Energetic, Top genre = Comedy
Fall: Dominant mood = Thoughtful, Top genre = Thriller
```

#### Mood-Time Correlation
```
For each mood:
  Count time of day
  Find peak time
```

**Example Output:**
```
Anxious mood peaks at: Night (70% of anxious viewings)
Happy mood peaks at: Evening (55% of happy viewings)
```

---

## Visualization

### Mood Map (Calendar Heatmap)

#### Layout
```
     Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
Sun  □    □    □    □    □    □    □    □    □    □    □    □
Mon  □    □    □    □    □    □    □    □    □    □    □    □
Tue  □    □    □    □    □    □    □    □    □    □    □    □
Wed  □    □    □    □    □    □    □    □    □    □    □    □
Thu  □    □    □    □    □    □    □    □    □    □    □    □
Fri  □    □    □    □    □    □    □    □    □    □    □    □
Sat  □    □    □    □    □    □    □    □    □    □    □    □
```

Each □ is colored by the mood watched that day:
- 😊 Happy → Yellow (#fbbf24)
- 😢 Sad → Blue (#60a5fa)
- 😌 Relaxed → Green (#34d399)
- etc.

#### Filtering
- **By Year**: Toggle between years
- **By Mood**: Highlight only specific mood
- Shows count per mood in filter buttons

### Monthly Breakdown

```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ Jan  │ Feb  │ Mar  │ Apr  │ May  │ Jun  │
│  😌  │  😊  │  😢  │  ⚡  │  🥰  │  🗺️  │
│  5   │  8   │  3   │  6   │  12  │  4   │
│Relax │Happy │ Sad  │Energe│Roman │Adven │
├──────┼──────┼──────┼──────┼──────┼──────┤
│ Jul  │ Aug  │ Sep  │ Oct  │ Nov  │ Dec  │
│  🤔  │  😰  │  😊  │  🌅  │  😌  │  🥰  │
│  7   │  2   │  9   │  15  │  6   │  11  │
│Think │Anxio │Happy │Nostal│Relax │Roman │
└──────┴──────┴──────┴──────┴──────┴──────┘
```

---

## Insights Generation

### For Users
- "You watched 40% more romantic content in February"
- "Your dominant mood this year: Relaxed (35% of viewings)"
- "You tend to watch thrillers when anxious, mostly at night"
- "Your happiest movie-watching month: July"

### For Vendors
- "Users feeling anxious in October prefer Korean thrillers"
- "Romantic mood peaks in February with French content"
- "Nostalgic viewers rate 80s American films 2 points higher"
- "Evening viewers in relaxed mood prefer documentaries"

---

## Data Privacy

### Current State
- All data stored locally in browser
- No data sent to external servers
- No user accounts or personal information collected
- TMDB API calls are read-only

### Future Considerations
- End-to-end encryption for cloud sync
- GDPR compliance for EU users
- Data export functionality
- Account deletion with full data purge
- Anonymized aggregate data for research

---

## Technical Implementation

### State Management
```typescript
// AppContext.tsx
const addRating = (rating: UserRating) => {
  storage.saveRating(rating);
  setRatings(storage.getRatings());
};
```

### Storage
```typescript
// storage.ts
saveRating: (rating: UserRating): void => {
  const ratings = storage.getRatings();
  const existing = ratings.findIndex((r) => r.movieId === rating.movieId);
  if (existing >= 0) {
    ratings[existing] = rating;
  } else {
    ratings.push(rating);
  }
  localStorage.setItem('movietracker_ratings', JSON.stringify(ratings));
}
```

### Computation
```typescript
// MoodCalendar.tsx
const moodCounts = useMemo(() => {
  const counts: Record<Mood, number> = {} as any;
  MOODS.forEach(m => { counts[m.id] = 0; });
  
  Object.values(calendarData).forEach(entries => {
    entries.forEach(e => {
      counts[e.mood]++;
    });
  });
  
  return counts;
}, [calendarData]);
```

---

**Next**: [Vendor Insights](./VENDOR_INSIGHTS.md)
