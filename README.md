# 🎭 MoodFlix — Your Digital Mood Tracker

> *Track your mood through the movies you watch. Discover patterns. Empower streaming platforms.*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg)](https://tailwindcss.com/)

![MoodFlix Hero](https://image.qwenlm.ai/generated-images/64403090-cb28-4048-b077-5e12c2d8de/_result.png)

---

## 🎯 The Intention

**MoodFlix** was born from a simple observation: *what we watch reflects how we feel, and how we feel shapes what we watch.*

Most movie tracking apps focus on ratings and reviews. MoodFlix goes deeper — it captures the **emotional context** of every viewing experience. By logging not just *what* you watched, but *how you felt* while watching it, we create a rich tapestry of your emotional journey through cinema.

### Why Does This Matter?

#### For You (The User)
- 📅 **Self-awareness**: See how your moods fluctuate across months and seasons
- 🎬 **Better recommendations**: Understand why you gravitate toward certain content
- 🧠 **Emotional patterns**: Discover which genres comfort you when sad, energize you when bored, etc.
- 📊 **Personal analytics**: Your mood map tells a story about your year

#### For Streaming Platforms (The Data Story)
Imagine Netflix knowing:
- *"Users feeling **anxious** in **October evenings** prefer **Korean thrillers** from **South Korea**"*
- *"**Romantic** mood peaks in **February** with **French** content"*
- *"**Nostalgic** viewers rate **80s American** films 2 points higher"*

This is **actionable intelligence** for:
- 🎯 **Content licensing** — What to acquire based on mood-driven demand
- 📈 **Recommendation algorithms** — Mood-aware suggestions
- 💰 **Marketing campaigns** — Seasonal mood-based promotions
- 🌍 **Regional targeting** — Country-specific content for specific moods

---

## ✨ Features

### 🎴 Tinder-Style Discovery
Swipe through movies like you're swiping through profiles. Swipe right to log your mood, swipe left to wishlist.

### 🎭 10 Mood States
| Mood | Emoji | Description |
|------|-------|-------------|
| Happy | 😊 | Feeling joyful and positive |
| Sad | 😢 | Feeling down or melancholic |
| Relaxed | 😌 | Calm and at ease |
| Anxious | 😰 | Feeling stressed or worried |
| Energetic | ⚡ | Pumped up and active |
| Bored | 😑 | Looking for stimulation |
| Romantic | 🥰 | Feeling loving and tender |
| Nostalgic | 🌅 | Missing the past |
| Adventurous | 🗺️ | Ready for exploration |
| Thoughtful | 🤔 | In a reflective mood |

### 📅 Mood Map (Calendar View)
A GitHub-style heatmap showing your emotional journey across the entire year. Filter by mood, see monthly breakdowns, and discover your dominant emotional patterns.

### 📊 Vendor Insights Dashboard
Actionable recommendations for streaming platforms including:
- Mood-based viewing patterns
- Geographic content preferences
- Seasonal trends
- Time-of-day analysis
- Revenue potential metrics

### 🔄 Platform Sync
Connect your IMDB and Rotten Tomatoes accounts to sync ratings across platforms.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **API** | TMDB (The Movie Database) |
| **Build** | Vite |
| **State** | React Context API |
| **Storage** | LocalStorage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/moodflix.git
cd moodflix

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment
No API keys needed! The app uses a public TMDB API key for demo purposes. For production, you'd want to:
1. Get your own TMDB API key at [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Set up a backend proxy to keep the key secure

---

## 📱 App Views

### 1. Discover (Home)
The main Tinder-style interface where you swipe through trending, popular, and top-rated content.

### 2. Rated
View all movies you've rated with mood badges, sync status, and quick actions.

### 3. Wishlist
Movies you want to watch later, displayed in a horizontal slider.

### 4. Mood Map
Your emotional calendar — a year-at-a-glance view of how you felt while watching.

### 5. Stats
Genre preferences, monthly activity, and viewing patterns.

### 6. Insights
What streaming platforms can learn from your data — actionable recommendations with revenue impact.

### 7. Profile
Account management, platform connections, and sync status.

---

## 🏗️ Project Structure

```
moodflix/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main discovery view
│   │   ├── TinderSlider.tsx       # Swipeable card stack
│   │   ├── MoodRatingModal.tsx    # 3-step mood rating flow
│   │   ├── MoodCalendar.tsx       # Year heatmap view
│   │   ├── VendorInsights.tsx     # Platform recommendations
│   │   ├── Stats.tsx              # Genre & monthly analytics
│   │   ├── RatedMovies.tsx        # Rated content slider
│   │   ├── Wishlist.tsx           # Wishlist slider
│   │   ├── Profile.tsx            # User settings
│   │   ├── Navbar.tsx             # Navigation
│   │   └── Login.tsx              # Authentication
│   ├── context/
│   │   └── AppContext.tsx         # Global state management
│   ├── services/
│   │   ├── tmdb.ts               # TMDB API integration
│   │   ├── countries.ts          # Country code utilities
│   │   └── storage.ts            # LocalStorage helpers
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── MOOD_TRACKING.md
│   ├── VENDOR_INSIGHTS.md
│   ├── USER_GUIDE.md
│   ├── TECH_STACK.md
│   ├── DATA_MODEL.md
│   └── FUTURE_ROADMAP.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) folder:

- [Architecture](./docs/ARCHITECTURE.md) — System design and component flow
- [Features](./docs/FEATURES.md) — Complete feature breakdown
- [Mood Tracking](./docs/MOOD_TRACKING.md) — How mood data is captured and analyzed
- [Vendor Insights](./docs/VENDOR_INSIGHTS.md) — How platform recommendations work
- [User Guide](./docs/USER_GUIDE.md) — Step-by-step user walkthrough
- [Tech Stack](./docs/TECH_STACK.md) — Technical decisions and rationale
- [Data Model](./docs/DATA_MODEL.md) — TypeScript types and data structures
- [Future Roadmap](./docs/FUTURE_ROADMAP.md) — Planned features and improvements

---

## 🔮 The Bigger Picture

MoodFlix is more than a movie tracker — it's a **behavioral analytics platform** disguised as a consumer app.

### Current State (MVP)
- Mood capture with movies
- Local data storage
- Simulated vendor insights
- Calendar visualization

### Future Vision
- **Real vendor API integration** — Direct sync with Netflix, Prime, etc.
- **ML-powered predictions** — "You'll probably feel nostalgic this weekend"
- **Social features** — Share mood maps with friends
- **Therapeutic insights** — Partner with mental health professionals
- **Content creator tools** — "Your film made 40% of viewers feel adventurous"

---

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

Please read our [contributing guidelines](./docs/FUTURE_ROADMAP.md) before submitting PRs.

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) — For the movie data API
- [Framer Motion](https://www.framer.com/motion/) — For the smooth animations
- [Lucide](https://lucide.dev/) — For the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) — For the utility-first styling

---

## 💬 Contact

Have questions? Ideas? Want to partner?

- 📧 Email: hello@moodflix.app
- 🐦 Twitter: @moodflix
- 💬 Discord: [Join our community](https://discord.gg/moodflix)

---

<p align="center">
  <strong>Made with 🎭 for movie lovers who feel deeply</strong>
</p>
