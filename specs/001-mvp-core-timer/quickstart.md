# Quickstart: MVP Core Timer

**Feature**: 001-mvp-core-timer  
**Created**: 2026-01-10  
**Purpose**: Development environment setup and getting started guide

## Prerequisites

- **Node.js**: 20.x LTS ([download](https://nodejs.org/))
- **npm**: Included with Node.js
- **Git**: For version control
- **Supabase Account**: Free tier at [supabase.com](https://supabase.com)
- **Vercel Account**: Free tier at [vercel.com](https://vercel.com) (for deployment)

## Initial Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd study-poker
npm install
```

### 2. Supabase Project Setup

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Note your project URL and anon key from Settings → API
3. Enable Email/Password auth in Authentication → Providers

### 3. Environment Configuration

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (from Supabase Settings → Database → Connection string)
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed default categories
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright integration tests |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Create and apply migrations |

## Project Structure Overview

```
study-poker/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities, hooks, stores
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration history
│   └── seed.ts              # Default category seeding
├── tests/
│   ├── unit/                # Vitest tests
│   └── integration/         # Playwright tests
└── specs/                   # Feature specifications
```

## Key Files to Start With

1. **Authentication**: `src/lib/supabase/` - Supabase client setup
2. **Database**: `prisma/schema.prisma` - Data models
3. **Timer Logic**: `src/lib/hooks/useTimer.ts` - Timer with Web Worker
4. **Chip Calculation**: `src/lib/utils/chips.ts` - Chip and rank logic
5. **API Routes**: `src/app/api/` - Backend endpoints

## Testing Strategy

### Unit Tests (Vitest)

Located in `tests/unit/`. Focus on:
- Chip calculation logic
- Rank determination
- Timer drift correction

```bash
npm test               # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### Integration Tests (Playwright)

Located in `tests/integration/`. Focus on:
- User registration and login flow
- Complete study session flow
- Dashboard data display

**Note**: Integration tests require Supabase credentials configured in `.env.local`.

```bash
npm run test:e2e           # Run all
npm run test:e2e:ui        # Interactive UI mode
```

## Database Migrations

### Create a Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name descriptive_name
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy from main branch

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |

## Common Issues

### Timer Drift

If timer shows incorrect remaining time:
- Ensure Web Worker is properly initialized
- Check that `performance.now()` is being used for drift correction

### Auth Session Expiry

If users are logged out unexpectedly:
- Check Supabase session refresh logic in middleware
- Verify cookie settings for session persistence

### Database Connection Errors

If Prisma can't connect:
- Verify `DATABASE_URL` uses `?pgbouncer=true` parameter
- Use `DIRECT_URL` for migrations (not pooled connection)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
