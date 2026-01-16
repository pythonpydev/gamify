# Data Model: MVP Core Timer

**Feature**: 001-mvp-core-timer  
**Created**: 2026-01-10  
**Source**: Extracted from [spec.md](spec.md) Key Entities

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           User                                   │
├─────────────────────────────────────────────────────────────────┤
│ id            : String (CUID, PK)                               │
│ authId        : String (Supabase auth.users.id, unique)         │
│ email         : String (unique)                                  │
│ displayName   : String (nullable)                                │
│ currentChips  : Int (default: 0)                                 │
│ totalChipsEarned : Int (default: 0)                              │
│ createdAt     : DateTime                                         │
│ updatedAt     : DateTime                                         │
├─────────────────────────────────────────────────────────────────┤
│ COMPUTED: rank (derived from totalChipsEarned)                   │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        StudySession                              │
├─────────────────────────────────────────────────────────────────┤
│ id            : String (CUID, PK)                               │
│ userId        : String (FK → User.id)                           │
│ categoryId    : String (FK → Category.id)                       │
│ sessionType   : SessionType (enum)                               │
│ startTime     : DateTime                                         │
│ endTime       : DateTime (nullable)                              │
│ durationMins  : Int (actual duration in minutes)                 │
│ qualityRating : Int (1-5, nullable until completed)              │
│ chipsEarned   : Int (calculated on completion)                   │
│ status        : SessionStatus (enum)                             │
│ notes         : String (optional, nullable)                      │
│ createdAt     : DateTime                                         │
│ updatedAt     : DateTime                                         │
└─────────────────────────────────────────────────────────────────┘
         │
         │ N:1
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Category                                 │
├─────────────────────────────────────────────────────────────────┤
│ id            : String (CUID, PK)                               │
│ userId        : String (FK → User.id, nullable for defaults)    │
│ name          : String                                           │
│ color         : String (hex color code)                          │
│ isDefault     : Boolean (true for system categories)             │
│ createdAt     : DateTime                                         │
│ updatedAt     : DateTime                                         │
├─────────────────────────────────────────────────────────────────┤
│ UNIQUE: (userId, name) - user can't have duplicate category     │
│         names; defaults have userId = null                       │
└─────────────────────────────────────────────────────────────────┘
```

## Enums

### SessionType

| Value | Duration (minutes) | Display Name |
|-------|-------------------|--------------|
| `QUICK_HAND` | 15 | Quick Hand |
| `STANDARD` | 25 | Standard Hand |
| `DEEP_STACK` | 50 | Deep Stack |

### SessionStatus

| Value | Description |
|-------|-------------|
| `ACTIVE` | Session in progress |
| `COMPLETED` | Session finished with quality rating |
| `ABANDONED` | Session ended without completion |

## Field Constraints

### User

| Field | Constraint | Rationale |
|-------|------------|-----------|
| email | Valid email format | Supabase Auth validates |
| displayName | Max 50 chars | UI display limit |
| currentChips | >= 0 | Cannot go negative |
| totalChipsEarned | >= 0 | Monotonically increasing |

### StudySession

| Field | Constraint | Rationale |
|-------|------------|-----------|
| durationMins | > 0 | Must have positive duration |
| qualityRating | 1-5 | Per spec FR-008 |
| chipsEarned | >= 0 | Sessions < 5 min earn 0 |

### Category

| Field | Constraint | Rationale |
|-------|------------|-----------|
| name | 1-50 chars | UI display limit |
| color | 7 chars (hex #RRGGBB) | Standard hex format |

## Default Categories

Seeded on first deploy per spec FR-003:

| Name | Color | isDefault |
|------|-------|-----------|
| PhD | #4F46E5 (indigo) | true |
| Math | #059669 (emerald) | true |
| Programming | #EA580C (orange) | true |
| Outschool Content | #7C3AED (violet) | true |

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id               String         @id @default(cuid())
  authId           String         @unique
  email            String         @unique
  displayName      String?
  currentChips     Int            @default(0)
  totalChipsEarned Int            @default(0)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  sessions         StudySession[]
  categories       Category[]

  @@map("users")
}

model StudySession {
  id            String        @id @default(cuid())
  userId        String
  categoryId    String
  sessionType   SessionType
  startTime     DateTime
  endTime       DateTime?
  durationMins  Int
  qualityRating Int?
  chipsEarned   Int           @default(0)
  status        SessionStatus @default(ACTIVE)
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category      @relation(fields: [categoryId], references: [id])

  @@index([userId])
  @@index([categoryId])
  @@index([startTime])
  @@map("study_sessions")
}

model Category {
  id        String   @id @default(cuid())
  userId    String?
  name      String
  color     String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User?          @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions  StudySession[]

  @@unique([userId, name])
  @@index([userId])
  @@map("categories")
}

enum SessionType {
  QUICK_HAND
  STANDARD
  DEEP_STACK
}

enum SessionStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}
```

## Computed Properties

These are calculated in application logic, not stored in database:

### User.rank

```typescript
function getRank(totalChipsEarned: number): string {
  const ranks = [
    { name: 'Legend', minChips: 500000 },
    { name: 'High Roller', minChips: 100000 },
    { name: 'Pro', minChips: 50000 },
    { name: 'Semi-Pro', minChips: 15000 },
    { name: 'TAG Regular', minChips: 5000 },
    { name: 'Calling Station', minChips: 1000 },
    { name: 'Fish', minChips: 0 },
  ];
  return ranks.find(r => totalChipsEarned >= r.minChips)?.name ?? 'Fish';
}
```

### StudySession.chipsEarned (calculation)

```typescript
function calculateChips(durationMins: number, qualityRating: number): number {
  if (durationMins < 5) return 0;
  const baseChips = Math.floor((durationMins / 25) * 100);
  const qualityBonus = qualityRating * 20;
  return baseChips + qualityBonus;
}
```

## State Transitions

### StudySession.status

```
                    ┌─────────────┐
                    │   ACTIVE    │
                    └──────┬──────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
    ┌───────────────┐            ┌───────────────┐
    │   COMPLETED   │            │   ABANDONED   │
    └───────────────┘            └───────────────┘

Transitions:
- ACTIVE → COMPLETED: User completes timer + submits quality rating
- ACTIVE → ABANDONED: User closes tab, navigates away, or explicitly abandons
```

## Migration Considerations

- Default categories are seeded via Prisma seed script, not migrations
- `totalChipsEarned` is monotonic; never decreases even if sessions are deleted
- `currentChips` may be used for future "spending" features but equals `totalChipsEarned` in MVP
