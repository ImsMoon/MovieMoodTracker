# 💡 Vendor Insights

## Overview

The Vendor Insights module transforms raw mood-tracking data into **actionable business intelligence** for streaming platforms. It answers the question: *"What can Netflix/Prime/Disney+ learn from this user's viewing patterns?"*

---

## The Business Case

### The Problem
Streaming platforms have:
- Millions of content titles
- Limited licensing budgets
- Inaccurate recommendation algorithms
- No emotional context for viewing decisions

### The Solution
MoodFlix provides:
- Mood-tagged viewing data
- Genre + Country + Time correlations
- Seasonal and temporal patterns
- Actionable content recommendations

### The Value
```
Traditional data: "User watched 50 movies"
MoodFlix data:    "User watched 12 Korean thrillers when anxious 
                   in October evenings, rated them 8.5/10 avg"
```

---

## Insight Categories

### 1. Content Strategy Recommendations

#### How It Works
```
For each dominant mood:
  1. Find all movies watched in that mood
  2. Count genres across those movies
  3. Rank by frequency
  4. Generate recommendation
```

#### Example Output
```
┌─────────────────────────────────────────────────────┐
│ 🎬 Netflix                                          │
│                                                     │
│ HIGH IMPACT                                         │
│                                                     │
│ Prioritize Thriller content                         │
│                                                     │
│ When users feel Anxious, they watch Thriller        │
│ content 65% of the time. Feature more thriller      │
│ titles during peak anxious hours (8-11 PM).         │
└─────────────────────────────────────────────────────┘
```

#### Data Points Used
- Mood + Genre correlation
- Watch count per genre per mood
- Time of day patterns
- Rating averages

---

### 2. Geographic Content Acquisition

#### How It Works
```
For each mood:
  1. Find all movies watched in that mood
  2. Extract origin_country from each movie
  3. Count by country
  4. Rank by frequency
  5. Generate licensing recommendation
```

#### Example Output
```
┌─────────────────────────────────────────────────────┐
│ 📦 Amazon Prime                                     │
│                                                     │
│ MEDIUM IMPACT                                       │
│                                                     │
│ 🇰🇷 License more South Korean content                │
│                                                     │
│ Anxious viewers prefer South Korean content.        │
│ Consider licensing 3x more titles from this         │
│ region for mood-based recommendations.              │
└─────────────────────────────────────────────────────┘
```

#### Data Points Used
- Mood + Country correlation
- Country flag emojis for visual clarity
- Watch count per country per mood
- Content gap analysis

---

### 3. Time-Based Optimization

#### How It Works
```
For each mood:
  1. Find all movies watched in that mood
  2. Extract timeOfDay from each
  3. Count by time slot
  4. Find peak time
  5. Generate scheduling recommendation
```

#### Example Output
```
┌─────────────────────────────────────────────────────┐
│ 🏰 Disney+                                          │
│                                                     │
│ HIGH IMPACT                                         │
│                                                     │
│ Evening content strategy                            │
│                                                     │
│ 3 mood patterns peak during evening/night.          │
│ Push notifications and featured content should      │
│ be optimized for 7-11 PM viewing window.            │
└─────────────────────────────────────────────────────┘
```

#### Data Points Used
- Mood + Time of day correlation
- Peak time identification
- Notification timing recommendations

---

### 4. Seasonal Campaign Planning

#### How It Works
```
For each season (Winter/Spring/Summer/Fall):
  1. Find all movies watched in that season
  2. Count moods
  3. Find dominant mood
  4. Find top genre
  5. Generate seasonal recommendation
```

#### Example Output
```
┌─────────────────────────────────────────────────────┐
│ 🎭 HBO Max                                          │
│                                                     │
│ MEDIUM IMPACT                                       │
│                                                     │
│ 🍂 Fall content push                                │
│                                                     │
│ Users watch most during Fall (45 titles).           │
│ Focus on Nostalgic-themed Drama campaigns           │
│ during this period.                                 │
└─────────────────────────────────────────────────────┘
```

#### Season Mapping
```typescript
const getSeason = (month: number): string => {
  if (month >= 12 || month <= 2) return 'Winter';
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  return 'Fall';
};
```

---

## Metrics Dashboard

### Key Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **Data Points** | Total ratings captured | `ratings.length` |
| **Engagement Score** | Activity level (0-100%) | `min(100, (totalWatched / 50) * 100)` |
| **Estimated Data Value** | Monetary value of insights | `$${totalWatched * 2.5}` |
| **Recommendations** | Actionable insights generated | `vendorRecommendations.length` |

### Visual Display
```
┌──────────┬──────────┬──────────┬──────────┐
│ 👥 150   │ 🎯 75%   │ 💰 $375  │ 💡 4     │
│ Data     │ Engage   │ Value    │ Recs     │
│ Points   │ ment     │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

---

## Mood Pattern Analysis

### Per-Mood Breakdown

For each mood with data, we show:

```
┌──────────────────────────────────────────────────────┐
│ 😰 Anxious                              25 titles    │
│ Avg rating: 7.8/10    Peak time: night               │
│                                                      │
│ Top Genres          Top Countries      Peak Months    │
│ ┌──────────────┐   ┌──────────────┐  ┌──────────┐   │
│ │ Thriller (12)│   │ 🇰🇷 S.Korea(8)│  │ Oct (8)  │   │
│ │ Horror (7)   │   │ 🇺🇸 USA (6)   │  │ Nov (5)  │   │
│ │ Drama (4)    │   │ 🇬🇧 UK (4)    │  │ Sep (3)  │   │
│ └──────────────┘   └──────────────┘  └──────────┘   │
└──────────────────────────────────────────────────────┘
```

### Data Extraction
```typescript
const moodPatterns = useMemo((): MoodPattern[] => {
  // Group ratings by mood
  // For each mood, compute:
  //   - topGenres (genre + count)
  //   - topCountries (country + count)
  //   - peakMonths (month numbers)
  //   - peakTimeOfDay (string)
  //   - avgRating (number)
  //   - totalWatched (number)
  
  return MOODS.map(mood => {
    // ... computation
  }).filter(p => p.totalWatched > 0)
    .sort((a, b) => b.totalWatched - a.totalWatched);
}, [ratings]);
```

---

## Revenue Model

### How Platforms Would Pay

#### Tier 1: Basic Insights (Free)
- Mood distribution overview
- Top 3 genres per mood
- Monthly activity summary

#### Tier 2: Advanced Analytics ($5K/month)
- Full mood pattern analysis
- Geographic preferences
- Time-of-day optimization
- Seasonal trends

#### Tier 3: Enterprise Intelligence ($20K+/month)
- Real-time mood data feed
- Custom recommendation engine
- A/B testing framework
- Predictive modeling
- User segmentation

### Data Valuation
```
Estimated value per data point: $2.50
Based on:
  - Industry benchmarks for behavioral data
  - Content licensing decision value
  - Recommendation algorithm improvement ROI
```

---

## Technical Implementation

### Insight Generation Pipeline

```
Raw Ratings
    ↓
Group by Mood
    ↓
For each mood:
  ├── Count genres → Top 3
  ├── Count countries → Top 3
  ├── Count months → Peak 3
  ├── Count time slots → Peak time
  └── Average ratings
    ↓
Generate Recommendations
    ↓
Rank by Impact
    ↓
Display in Dashboard
```

### Code Structure
```typescript
// VendorInsights.tsx

// 1. Mood Patterns
const moodPatterns = useMemo(() => {
  // Complex computation
}, [ratings]);

// 2. Seasonal Insights
const seasonalInsights = useMemo(() => {
  // Season-based computation
}, [ratings]);

// 3. Vendor Recommendations
const vendorRecommendations = useMemo(() => {
  // Generate actionable recommendations
  // Based on moodPatterns and seasonalInsights
}, [moodPatterns, seasonalInsights]);

// 4. Revenue Metrics
const revenueInsight = useMemo(() => {
  // Calculate engagement, value, etc.
}, [ratings]);
```

---

## Future Enhancements

### Phase 2
- **Multi-user aggregation**: Combine insights across users
- **Trend detection**: Identify emerging patterns
- **Predictive modeling**: Forecast future mood-based demand
- **Content gap analysis**: Identify underserved mood-genre combinations

### Phase 3
- **Real-time API**: Live data feed for platforms
- **Custom dashboards**: Platform-specific views
- **A/B testing**: Test recommendations against actual performance
- **ML integration**: Train models on mood-viewing patterns

### Phase 4
- **Content creator insights**: "Your film made 40% of viewers feel adventurous"
- **Marketing optimization**: Mood-based ad targeting
- **Licensing intelligence**: Data-driven acquisition decisions
- **Cross-platform analytics**: Compare patterns across services

---

## Ethical Considerations

### Data Privacy
- Users must explicitly opt-in to share data
- All data is anonymized before aggregation
- Users can delete their data at any time
- No personally identifiable information shared

### Transparency
- Users see exactly what insights are generated
- Clear explanation of how data is used
- Opt-out available at any time
- Regular privacy audits

### Responsible Use
- No manipulative recommendations
- No dark patterns
- Respect user autonomy
- Promote healthy viewing habits

---

**Next**: [User Guide](./USER_GUIDE.md)
