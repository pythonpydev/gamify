# Gamify 🎰

A poker-themed productivity app that transforms study sessions into an engaging game. Built on the proven Pomodoro Technique, Gamify rewards your focus with poker chips, tracks your progress through 12 poker ranks, and makes productivity addictively fun.

## 🎯 Overview

Gamify combines the time-tested Pomodoro Technique with game mechanics to make focused work sessions more engaging and rewarding. Whether you're studying, coding, writing, or working on any focused task, Gamify helps you:

- **Stay focused** with structured timed sessions
- **Track progress** across different categories (subjects, projects, etc.)
- **Earn rewards** based on session completion and quality
- **Climb ranks** from Fish to GOAT as you accumulate lifetime chips
- **Build habits** with visual feedback and gamification

Perfect for students, developers, writers, and anyone who wants to boost their productivity while having fun!

## ✨ Key Features

### 🕐 Pomodoro Timer Sessions

Choose from multiple session types based on your needs:

- **Quick Hand** (15 minutes) - Perfect for short bursts of focus
- **Standard Hand** (25 minutes) - Classic Pomodoro session length
- **Deep Stack** (50 minutes) - Extended focus for deep work
- **Test Hand** (10 seconds) - Quick testing mode for development

Each session includes:
- Visual countdown timer with progress bar
- Pause/resume functionality
- Optional audio alarm when timer completes (with toggle)
- Session abandonment tracking (no chips for abandoned sessions)

### 📂 Categories System

Organize your work into custom categories:

- Create unlimited categories for different subjects, projects, or activities
- Assign custom colors to each category for visual organization
- Track time spent per category
- View category-specific session history
- Delete categories when no longer needed

### 🪙 Chip Reward System

Earn poker chips based on your performance:

**Chip Calculation Formula:**
```
Base Chips = floor((durationMins / 25) * 100)
Quality Bonus = qualityRating * 20
Total Chips = Base Chips + Quality Bonus
```

**Examples:**
- 15 min session, 3-star quality: 60 + 60 = **120 chips**
- 25 min session, 5-star quality: 100 + 100 = **200 chips**
- 50 min session, 3-star quality: 200 + 60 = **260 chips**

**Quality Ratings:**
After each session, rate your focus quality from 1-5 stars:
- ⭐ (1 star) - Poor focus, many distractions
- ⭐⭐ (2 stars) - Below average focus
- ⭐⭐⭐ (3 stars) - Average focus
- ⭐⭐⭐⭐ (4 stars) - Good focus, minimal distractions
- ⭐⭐⭐⭐⭐ (5 stars) - Excellent focus, fully engaged

**Rules:**
- Sessions shorter than 5 minutes earn 0 chips
- Abandoned sessions earn 0 chips
- Chips are awarded only upon session completion
- Total lifetime chips determine your rank (never decreases)

## User Ranks

Gamify uses a poker-themed ranking system where players earn ranks based on their **lifetime chips earned**, not their current balance. This means your rank only goes up - it reflects all the chips you've earned throughout your journey.

### Available Ranks

| Rank | Required Chips | Color | Emoji |
|------|----------------|-------|-------|
| 🐟 **Fish** | 0 | Turquoise | 🐟 |
| 📞 **Calling Station** | 500 | Pink | 📞 |
| 🎯 **ABC** | 1,000 | Light Yellow | 🎯 |
| 🃏 **TAG Regular** | 2,000 | Purple | 🃏 |
| 🎰 **Semi Pro** | 5,000 | Orange | 🎰 |
| ⚙️ **Grinder** | 10,000 | Green | ⚙️ |
| 🦈 **Shark** | 20,000 | Blue | 🦈 |
| 💎 **Pro** | 50,000 | Slate | 💎 |
| 🎲 **High Roller** | 100,000 | Red | 🎲 |
| 🏆 **Champion** | 250,000 | White | 🏆 |
| 👑 **Legend** | 500,000 | Lime | 👑 |
| 🐐 **GOAT** | 1,000,000 | Gold | 🐐 |

**Note:** Ranks are based on total chips earned across all sessions, not your current chip balance. Once you achieve a rank, you keep it forever!

### 📊 Dashboard & Analytics

Track your productivity with comprehensive statistics:

- **Total chips earned** (lifetime earnings)
- **Current rank** with progress to next rank
- **Bankroll tracker chart** - Visual graph showing cumulative chip growth over time
- **Recent sessions** with category breakdown
- **Session history** with filters and sorting
- **Delete sessions** - Remove individual sessions or reset all progress
- Visual rank badge with progress indicator

#### Bankroll Tracker

The dashboard features a bankroll tracker chart that visualizes your chip accumulation over time:

- **Line chart** showing cumulative chips earned (y-axis) vs. dates (x-axis)
- Poker-gold colored line matching the app's theme
- Hover tooltips with detailed date and chip information
- Responsive design that adapts to screen size
- Automatically updates as you complete sessions
- Shows "No chip history yet" message for new users

#### Session Management

Manage your session history with flexible deletion options:

- **Delete Individual Sessions** - Remove specific sessions with a single click
  - Click the trash icon on any session card in the history page
  - Confirmation dialog prevents accidental deletions
  - Automatically subtracts chips from your total and updates your rank
  - UI updates instantly after deletion

- **Reset All Sessions** - Complete fresh start
  - "Reset All Sessions" button in the history page (top-right corner)
  - Deletes all sessions and resets chips to 0
  - Returns you to Fish rank (starting rank)
  - Requires double confirmation to prevent accidental resets
  - Perfect for starting a new semester or challenge

### 🔐 Authentication & User Management

Secure user accounts powered by Supabase:

- Email/password registration and login
- Password reset functionality
- Secure session management
- User profile with display name
- Persistent data across devices

### 🔔 Audio Notifications

Stay informed when your session completes:

- Pleasant three-tone chime (C-E-G major chord)
- Toggle alarm on/off before starting sessions
- Test button to preview the sound
- Enabled by default for better UX
- Browser-friendly Web Audio API implementation

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio notifications

**Backend:**
- [Supabase](https://supabase.com/) - Authentication and backend services
- [Prisma](https://www.prisma.io/) - Type-safe database ORM
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) - Timer background processing

**Testing:**
- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - End-to-end testing

## �️ Dev Environment Setup

### Database Options

You need a PostgreSQL database for development. Choose one of these options:

#### Option 1: Neon (Recommended - No Installation Required) ⭐

**Best for:** Developers without admin privileges or who want quick setup.

1. **Sign up at [Neon.tech](https://neon.tech)** (free account)
   - Sign up with GitHub, Google, or email
   - No credit card required

2. **Create a new project:**
   - Click "Create a project" or "New Project"
   - Name: `gamify` (or your choice)
   - Region: Choose closest to your location
   - PostgreSQL version: 15 or 16

3. **Copy your connection string:**
   - After project creation, find the **Connection Details** section
   - Copy the entire connection string (looks like):
     ```
     postgresql://neondb_owner:xxxxx@ep-xxxx.neon.tech/neondb?sslmode=require
     ```

4. **Update `.env.local`:**
   ```env
   # Supabase Configuration (for auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Neon Database
   DATABASE_URL=<paste-your-neon-connection-string-here>
   DIRECT_URL=<paste-your-neon-connection-string-here>
   ```

5. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

**Neon Benefits:**
- ✅ 3GB storage on free tier
- ✅ Always-on database
- ✅ Automatic backups
- ✅ No installation required
- ✅ Works from any machine

#### Option 2: Docker Desktop (Requires Admin Privileges)

**Best for:** Local development with full control.

1. **Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)**

2. **Start the database:**
   ```bash
   docker compose up -d
   ```

3. **Update `.env.local`:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gamify
   DIRECT_URL=postgresql://postgres:postgres@localhost:5432/gamify
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

#### Option 3: Local PostgreSQL Installation

**Best for:** Those who already have PostgreSQL installed.

1. **Install [PostgreSQL](https://www.postgresql.org/download/)**

2. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE gamify;
   \q
   ```

3. **Update `.env.local`:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/gamify
   DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/gamify
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

#### Other Cloud Database Options

- **[Supabase](https://supabase.com)** - 500MB free tier
- **[Railway](https://railway.app)** - $5 free credit monthly  
- **[ElephantSQL](https://www.elephantsql.com)** - 20MB free tier

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (see [Dev Environment Setup](#%EF%B8%8F-dev-environment-setup) above)
- Supabase account for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gamify
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_postgresql_direct_connection_string
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. Click "Get Started" or "Sign Up"
2. Create an account with email and password
3. Go to "Categories" and create your first category (e.g., "Study", "Work", "Writing")
4. Navigate to "Session" to start your first Pomodoro timer
5. Choose a session type and category, then click "Start Session"
6. When complete, rate your focus quality to earn chips!

## 📖 How to Use

### Starting a Session

1. Navigate to the **Session** page
2. Select a **session type** (Quick Hand, Standard, or Deep Stack)
3. Toggle the **sound alarm** on/off as preferred
4. Choose a **category** for this session
5. Click **Start Session**

### During a Session

- Watch the countdown timer
- **Pause** if you need a brief break (doesn't stop the session)
- **Resume** to continue from where you paused
- **Abandon** if you can't complete the session (no chips awarded)

### Completing a Session

1. When the timer reaches zero, the alarm will sound (if enabled)
2. A modal appears asking you to rate your focus quality (1-5 stars)
3. Optionally add notes about the session
4. Click **Complete Session** to claim your chips
5. See your chip earnings and updated rank!

### Managing Categories

1. Go to **Categories** page
2. Click **Create Category**
3. Enter a name and choose a color
4. Use categories to organize different types of work
5. Delete categories you no longer need (requires confirmation)

### Viewing Progress

- **Dashboard**: See your current rank, total chips, and recent sessions
- **History**: Browse all completed sessions with filtering options
- **Rank Badge**: Track your progress toward the next rank

## 📁 Project Structure

```
gamify/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── auth/           # Auth-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── timer/          # Timer & session components
│   │   └── ui/             # Reusable UI components
│   ├── lib/                # Utilities and libraries
│   │   ├── db/             # Database client
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # State management
│   │   ├── supabase/       # Supabase client
│   │   └── utils/          # Helper functions
│   └── types/              # TypeScript type definitions
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── specs/                 # Feature specifications
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for deployment on Vercel:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Vercel auto-deploys** (if connected to GitHub)
   - Deployments typically complete in 1-2 minutes
   - Preview deployments for pull requests
   - Production deployment on `main` branch

3. **Environment Variables**
   
   Make sure these are set in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`

4. **View your deployment**
   - Production: `https://your-project.vercel.app`
   - Dashboard: `https://vercel.com/dashboard`

### First-Time Deployment

If not yet deployed:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `gamify` repository
5. Vercel auto-detects Next.js configuration
6. Add environment variables
7. Deploy!

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify** - Similar to Vercel
- **Railway** - Includes database hosting
- **Self-hosted** - Use `npm run build` then `npm start`

## 🎮 Game Mechanics Explained

### Why Poker Theme?

The poker theme creates engaging metaphors for productivity:
- **Chips** = Your accumulated productivity currency
- **Hands** = Individual work sessions (like poker hands)
- **Ranks** = Skill progression (from novice to expert)
- **Categories** = Different "tables" or "games" you play

### Rank Progression

Your rank is permanent and based on **lifetime earnings**, not current balance. This means:
- ✅ Your rank never decreases
- ✅ All earned chips count toward rank progression
- ✅ You can see exactly how many chips until the next rank
- ✅ Clear milestone goals to work toward

### Quality Rating Impact

The quality rating system encourages honest self-assessment:
- Higher ratings give bigger bonuses (20 chips per star)
- Creates incentive to minimize distractions
- Helps you track focus improvement over time
- Maximum bonus: 100 chips (5 stars on a 25-min session)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Inspired by the [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique)
