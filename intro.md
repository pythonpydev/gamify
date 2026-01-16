# Gamify Studying App - "Study Poker"

## Introduction

I have struggled all my life to concentrate on studying properly. I am too easily distracted and found out recently that it may be to do with dopamine. Mobile phones have added to the problem due to social media and other apps.

I enjoy studying, and need to focus on PhD studies, math and programming as well as developing content for Outschool. 

I would like to develop an app that helps me to gamify studying, to make it more fun and rewarding. I use Pomodoro timers and have also previously used Habitica but eventually got bored of that.

My interests are poker, music, and programming so it would be nice to design an app related to those topics, poker in particular.

## Core Concept: Poker Tournament Study System

Instead of a generic RPG-style progression (like Habitica), this app frames studying as a poker tournament where you're competing against yourself and building your "chip stack" through consistent study sessions.

### Why Poker Works as a Metaphor
- **Stakes and Risk**: Each study session is a "hand" where you can build or protect your stack
- **Tournaments**: Weekly/monthly tournaments track consistent progress
- **Bankroll Management**: Teaches discipline (similar to study discipline)
- **Session Tracking**: Like poker session logs, track study sessions
- **Variance**: Some days are harder than others, just like poker

## Detailed Features

### 1. Authentication & User Management
- **Login/Logout**: Email/password or OAuth (Google, GitHub)
- **User Profiles**: Display name, avatar, current "chip stack", rank
- **Privacy**: All data encrypted, optional anonymous mode

### 2. Study Session Management ("Playing Hands")

#### Pomodoro Timer Integration
- **Session Types**: 
  - Quick Hand (15 min)
  - Standard Hand (25 min - classic Pomodoro)
  - Deep Stack (50 min - double session)
  - Tournament (4 hours with breaks)
  
- **Pre-Session Setup**:
  - Select study category (PhD, Math, Programming, Outschool Content)
  - Set specific goal for this session
  - Choose focus level (learning new material vs. review)

- **During Session**:
  - Fullscreen focus mode (optional browser extension to block distractions)
  - Ambient sounds (poker room ambiance, or music selections)
  - Visual timer showing "blinds increasing" as time progresses
  - Cannot pause (penalty for abandoning)

- **Post-Session**:
  - Rate session quality (1-5 stars)
  - Log what was accomplished
  - Earn "chips" based on completion + quality rating

### 3. Chip System (Experience Points)

#### Earning Chips
- **Session Completion**: 100 chips per 25-min Pomodoro
- **Quality Bonus**: +20 chips per quality star rating
- **Streak Multiplier**: 1.2x for 3-day streak, 1.5x for 7-day, 2x for 30-day
- **Daily Challenge**: +200 chips for hitting daily target
- **Perfect Week**: +1000 chips for 5+ quality study days

#### Spending Chips (Optional Gamification Layer)
- **Unlock Themes**: Different poker room designs (Vegas, Monte Carlo, Online)
- **Avatar Items**: Card protectors, dealer buttons, chip designs
- **Power-ups**: "Deep Focus" session (1.5x chips), "Second Chance" (forgive one missed day)

### 4. Tournament System (Long-term Goals)

#### Weekly Tournaments
- Set weekly chip goal (e.g., 2000 chips = 20 quality Pomodoros)
- Track position at "tournament table" (progress bar)
- Finish "in the money" = reward badge and bonus chips
- Miss the goal = small chip penalty but encouragement to rebuy next week

#### Monthly Championships
- Accumulated stats for the month
- Special achievements unlocked
- "Player of the Month" status for meeting all weekly goals

### 5. Progression & Ranks

Instead of generic levels, use poker ranking system:
1. **Fish** (0-1,000 chips)
2. **Calling Station** (1,000-5,000)
3. **TAG Regular** (5,000-15,000)
4. **Semi-Pro** (15,000-50,000)
5. **Pro** (50,000-100,000)
6. **High Roller** (100,000-500,000)
7. **Legend** (500,000+)

Each rank unlocks:
- New themes and customization
- More detailed analytics
- Custom session templates
- Advanced features (AI study suggestions, etc.)

### 6. Achievements ("Trophies")

**Study Consistency**:
- "Royal Flush" - 5 perfect study days in a row
- "Full House" - Complete 3 different study categories in one day
- "Straight" - 5-day study streak
- "The Grinder" - 100 total study sessions
- "Marathon Man" - Complete a 4-hour tournament session

**Study Quality**:
- "All In" - Achieve a perfect 5-star quality rating 10 times
- "Pocket Aces" - 2 consecutive 50-minute deep sessions
- "Set Mining" - Complete 3 sessions of the same subject in one day

**Streaks & Discipline**:
- "Nit" - Never miss a daily target for 7 days
- "Main Event" - 30-day study streak
- "WSOP Bracelet" - 90-day study streak

### 7. Analytics & Progress Tracking ("Session Review")

#### Dashboard Views
- **Daily**: Chips earned today, sessions completed, current streak
- **Weekly**: Tournament progress, best study days, category breakdown
- **Monthly**: Total hours studied, favorite subjects, quality trends
- **All-Time**: Total chips, rank progress, achievements unlocked

#### Charts & Visualizations
- Chip stack graph over time (like a poker bankroll chart)
- Heatmap calendar showing study days
- Category breakdown (pie chart of time spent per subject)
- Quality vs. quantity scatter plot
- Time-of-day productivity chart

#### Insights
- Best study time of day
- Correlation between session length and quality
- Suggested optimal schedule based on past performance
- Predictions for achieving next rank

### 8. Social & Accountability (Optional Future Feature)

- **Study Buddies**: Invite friends, see their progress (anonymized chips)
- **Leaderboards**: Weekly/monthly rankings (opt-in)
- **Challenges**: Head-to-head study challenges
- **Share Achievements**: Post to social media when reaching milestones

### 9. Distraction Prevention

- **Website Blocker**: Optional browser extension during study sessions
- **Phone Mode**: Generate QR code to display on phone encouraging you to put it away
- **Accountability Partner**: Email a friend when you start/complete sessions
- **Commitment Device**: Put chips "at stake" - lose them if you don't complete planned sessions

### 10. Customization

- **Study Categories**: Customize your own categories beyond defaults
- **Timer Lengths**: Adjust Pomodoro lengths to your preference
- **Chip Values**: Adjust how many chips each activity is worth
- **Themes**: Dark mode, different poker room designs, minimalist mode
- **Sounds**: Choose ambient sounds (poker room, rain, silence, lo-fi music)

## Technical Implementation

### Tech Stack Suggestions

#### Frontend
- **Framework**: React with TypeScript (or Next.js for SSR)
- **Styling**: Tailwind CSS for rapid UI development
- **State Management**: Zustand or Redux Toolkit
- **Timer Logic**: Custom React hooks with Web Workers for accuracy
- **Charts**: Recharts or Chart.js for analytics

#### Backend
- **Framework**: Node.js with Express, or Next.js API routes
- **Database**: PostgreSQL (relational data for users, sessions, achievements)
- **ORM**: Prisma (excellent TypeScript support)
- **Authentication**: NextAuth.js or Auth0
- **Caching**: Redis for session data and leaderboards

#### Hosting & Deployment
- **Platform**: Vercel (easy Next.js deployment) or Railway
- **Database Hosting**: Supabase (includes PostgreSQL + auth) or Neon
- **Cost**: Free tier available for initial development

#### Additional Tools
- **Notifications**: Web Push API for study reminders
- **Analytics**: Plausible or Umami (privacy-friendly)
- **Email**: Resend or SendGrid for streak reminders

### Database Schema (Key Tables)

```
Users
- id, email, username, passwordHash
- currentChips, totalChipsEarned, rank
- createdAt, lastLoginAt

StudySessions
- id, userId, categoryId
- startTime, endTime, duration
- qualityRating, notes
- chipsEarned, streakMultiplier

Categories
- id, userId, name, color
- defaultDuration, totalMinutes

Achievements
- id, name, description, chipReward
- unlockedBy (JSON criteria)

UserAchievements
- userId, achievementId, unlockedAt

WeeklyTournaments
- id, userId, weekStart
- targetChips, earnedChips
- completed, bonusAwarded
```

## Development Roadmap

### Phase 1: MVP (2-4 weeks)
- [ ] Basic authentication (login/register)
- [ ] Simple Pomodoro timer (25 min sessions)
- [ ] Study session logging with categories
- [ ] Chip earning system
- [ ] Basic dashboard showing total chips and sessions
- [ ] Deploy to hosting platform

### Phase 2: Core Gamification (2-3 weeks)
- [ ] Quality ratings and bonus chips
- [ ] Streak tracking and multipliers
- [ ] Rank progression system
- [ ] 5-10 core achievements
- [ ] Weekly tournament system
- [ ] Improved UI with poker theme

### Phase 3: Analytics & Insights (1-2 weeks)
- [ ] Session history page
- [ ] Charts and visualizations
- [ ] Calendar heatmap
- [ ] Time-of-day analytics
- [ ] Progress predictions

### Phase 4: Polish & Enhancement (2-3 weeks)
- [ ] Customizable themes
- [ ] Ambient sounds/music
- [ ] Browser extension for distraction blocking
- [ ] Advanced achievements (20+ total)
- [ ] Mobile responsive design
- [ ] Email notifications for streaks

### Phase 5: Social Features (Optional, 2-3 weeks)
- [ ] Study buddy system
- [ ] Optional leaderboards
- [ ] Challenges between users
- [ ] Achievement sharing

## Success Metrics

- **Daily Active Usage**: Goal to study 1+ sessions per day
- **Streak Maintenance**: Average streak length over 7 days
- **Quality Improvement**: Average session rating increasing over time
- **Retention**: Continue using app for 30+ days (where Habitica failed)
- **Subjective**: Feeling more motivated and productive with PhD/studies

## Differentiation from Habitica

1. **Specialized Focus**: Study-specific, not general habits
2. **Poker Theme**: More engaging for personal interest
3. **No Fantasy RPG**: Less childish, more sophisticated
4. **Time-Based**: Emphasizes actual time spent, not just task completion
5. **Analytics**: Deeper insights into study patterns
6. **Quality Over Quantity**: Ratings system encourages effective study, not just logging hours
7. **Tournament Structure**: Weekly goals feel more concrete than endless leveling

## Next Steps

1. Create a design mockup (Figma) for main screens
2. Set up development environment
3. Initialize Next.js project with TypeScript
4. Set up Supabase for database and auth
5. Build basic timer functionality
6. Iterate based on personal usage 