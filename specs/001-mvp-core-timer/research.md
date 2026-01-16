# Research: MVP Core Timer

**Feature**: 001-mvp-core-timer  
**Created**: 2026-01-10  
**Purpose**: Resolve technical decisions and best practices for implementation

## Research Tasks

### 1. Timer Accuracy with Web Workers

**Question**: How to ensure accurate timer countdown that works even when the browser tab is inactive?

**Decision**: Use Web Workers for timer logic with `performance.now()` for drift correction.

**Rationale**:
- `setInterval` in main thread can drift and is throttled when tab is inactive
- Web Workers continue running at full speed in background tabs
- `performance.now()` provides high-resolution timestamps for drift correction

**Alternatives Considered**:
- `setTimeout` recursion: Same throttling issues as setInterval
- Server-side timer: Adds latency and complexity; client-side is sufficient for MVP

**Implementation Notes**:
```typescript
// Timer worker pattern:
// 1. Main thread sends start time and duration
// 2. Worker calculates remaining time using actual elapsed time
// 3. Worker posts updates every second
// 4. Main thread renders countdown; worker ensures accuracy
```

---

### 2. Supabase Auth + Prisma Coexistence

**Question**: How do Supabase Auth and Prisma work together without conflicts?

**Decision**: Supabase Auth for authentication; Prisma for all other database operations. Use Supabase Auth user ID as foreign key in Prisma models.

**Rationale**:
- Supabase Auth manages `auth.users` table automatically
- Prisma manages application tables (User, StudySession, Category)
- Link via UUID stored in Prisma `User.authId` field

**Alternatives Considered**:
- Prisma-only with custom auth: More work; Supabase provides free hosted auth
- Supabase client for everything: Loses Prisma's type-safe queries and migrations

**Implementation Notes**:
```prisma
model User {
  id         String   @id @default(cuid())
  authId     String   @unique  // Supabase auth.users.id
  email      String   @unique
  // ... other fields
}
```

---

### 3. Chip Calculation Formula

**Question**: What is the exact chip calculation logic including edge cases?

**Decision**: Base chips scale with session duration; quality bonus is flat per star.

**Formula**:
```
baseChips = (durationMinutes / 25) * 100
qualityBonus = qualityRating * 20
totalChips = floor(baseChips + qualityBonus)
```

**Examples**:
| Session | Duration | Quality | Base | Bonus | Total |
|---------|----------|---------|------|-------|-------|
| Quick Hand | 15 min | 3 stars | 60 | 60 | 120 |
| Standard | 25 min | 4 stars | 100 | 80 | 180 |
| Standard | 25 min | 5 stars | 100 | 100 | 200 |
| Deep Stack | 50 min | 3 stars | 200 | 60 | 260 |
| Deep Stack | 50 min | 5 stars | 200 | 100 | 300 |

**Edge Cases**:
- Sessions < 5 min: 0 chips (per FR-015)
- Abandoned sessions: 0 chips regardless of time
- Quality rating is required (1-5); 0 is not allowed

---

### 4. Rank Thresholds

**Question**: What are the exact chip thresholds for each poker rank?

**Decision**: Use thresholds from intro.md, stored as configuration.

| Rank | Min Chips | Max Chips |
|------|-----------|-----------|
| Fish | 0 | 999 |
| Calling Station | 1,000 | 4,999 |
| TAG Regular | 5,000 | 14,999 |
| Semi-Pro | 15,000 | 49,999 |
| Pro | 50,000 | 99,999 |
| High Roller | 100,000 | 499,999 |
| Legend | 500,000 | ∞ |

**Implementation Notes**:
```typescript
const RANKS = [
  { name: 'Fish', minChips: 0 },
  { name: 'Calling Station', minChips: 1000 },
  { name: 'TAG Regular', minChips: 5000 },
  { name: 'Semi-Pro', minChips: 15000 },
  { name: 'Pro', minChips: 50000 },
  { name: 'High Roller', minChips: 100000 },
  { name: 'Legend', minChips: 500000 },
];

function getRank(totalChips: number): string {
  return [...RANKS].reverse().find(r => totalChips >= r.minChips)?.name ?? 'Fish';
}
```

---

### 5. Session State Management

**Question**: How to handle session state across page reloads and tab closures?

**Decision**: Persist active session to localStorage; sync to database on completion.

**Rationale**:
- localStorage survives page refresh
- Tab close (beforeunload) marks session as abandoned
- On app load, check for orphaned sessions and prompt user

**State Flow**:
1. Start session → Save to localStorage + create DB record with status "active"
2. Timer running → Update localStorage timestamp periodically
3. Complete → Rate quality → Calculate chips → Update DB → Clear localStorage
4. Tab close during session → beforeunload handler marks DB record as "abandoned"
5. On next load → Check for active session; if timer expired, treat as abandoned

**Alternatives Considered**:
- Server-side timer: Adds latency; not needed for single-user MVP
- IndexedDB: More complex; localStorage sufficient for single active session

---

### 6. Next.js App Router Patterns

**Question**: Best practices for Next.js 14 App Router with Supabase?

**Decision**: Follow Supabase's official Next.js App Router guide.

**Key Patterns**:
- Server Components by default for data fetching
- Client Components (`'use client'`) for interactive elements (timer, forms)
- Route handlers (`app/api/`) for mutations
- Middleware for auth protection (`middleware.ts`)
- Server Actions for form submissions (optional; API routes simpler for MVP)

**Auth Middleware Pattern**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## Resolved Clarifications

All technical context items from plan.md are resolved. No NEEDS CLARIFICATION markers remain.

## Dependencies for Phase 1

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.0.0 | Framework |
| @supabase/supabase-js | ^2.39.0 | Auth + DB client |
| @supabase/ssr | ^0.1.0 | SSR helpers for Next.js |
| prisma | ^5.8.0 | ORM + migrations |
| @prisma/client | ^5.8.0 | Type-safe queries |
| zustand | ^4.4.0 | Client state |
| tailwindcss | ^3.4.0 | Styling |
| vitest | ^1.2.0 | Unit testing |
| @playwright/test | ^1.41.0 | E2E testing |
| msw | ^2.1.0 | API mocking |
