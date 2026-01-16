# Implementation Plan: MVP Core Timer

**Branch**: `001-mvp-core-timer` | **Date**: 2026-01-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-mvp-core-timer/spec.md`

## Summary

Implement the Phase 1 MVP of Study Poker: a gamified Pomodoro timer application with user authentication, study session tracking, quality ratings, and a chip-based reward system. Users register, start timed study sessions by category, rate their focus quality upon completion, and earn chips that determine their rank progression through poker-themed tiers.

**Technical Approach**: Full-stack Next.js application with Supabase for authentication and PostgreSQL database, deployed to Vercel. Timer logic uses Web Workers for accuracy. Zustand manages client state. Tailwind CSS provides styling with a sophisticated poker room aesthetic.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20.x LTS  
**Primary Dependencies**: Next.js 14, Supabase JS Client, Zustand, Tailwind CSS, Prisma  
**Storage**: PostgreSQL via Supabase (managed)  
**Testing**: Vitest (unit), Playwright (integration), MSW (API mocking)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), mobile-responsive  
**Project Type**: Web application (Next.js monolith with API routes)  
**Performance Goals**: Dashboard loads < 2 seconds, timer accuracy ± 1 second over 50 minutes  
**Constraints**: Free tier hosting (Vercel + Supabase), single developer, no offline mode in MVP  
**Scale/Scope**: Single user initially, schema supports multi-user for future phases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check (Phase 0 Gate)

| Principle | Gate Criteria | Status |
|-----------|---------------|--------|
| **I. Quality Over Quantity** | Chip rewards include quality multipliers (20 chips per star) | ✅ Pass |
| **II. UX First** | Timer prevents navigation during sessions; no mid-session popups | ✅ Pass |
| **III. Gamification with Purpose** | Chips tied to session completion + quality rating | ✅ Pass |
| **IV. Progressive Enhancement** | MVP delivers standalone value; Phase 2+ deferred | ✅ Pass |
| **V. Test-Driven Development** | Auth, chip calculation, timer require tests | 🔶 Pending |
| **VI. Simplicity & YAGNI** | Stack matches constitution; OAuth/social deferred | ✅ Pass |

**Gate Result**: PASS - Proceed to Phase 0 research.

### Post-Design Check (Phase 1 Gate)

| Principle | Design Artifact | Verification | Status |
|-----------|-----------------|--------------|--------|
| **I. Quality Over Quantity** | [data-model.md](data-model.md) | `qualityRating` field (1-5), chip formula includes quality bonus | ✅ Pass |
| **II. UX First** | [contracts/api.yaml](contracts/api.yaml) | No mid-session API calls; single completion endpoint | ✅ Pass |
| **III. Gamification with Purpose** | [research.md](research.md) | Chip formula and rank thresholds documented | ✅ Pass |
| **IV. Progressive Enhancement** | [plan.md](plan.md) | Project structure supports incremental phases | ✅ Pass |
| **V. Test-Driven Development** | [quickstart.md](quickstart.md) | Test strategy defined; tests/ folder in structure | ✅ Pass |
| **VI. Simplicity & YAGNI** | [research.md](research.md) | Stack matches constitution; no over-engineering | ✅ Pass |

**Gate Result**: PASS - All principles verified in design artifacts. Ready for Phase 2 (tasks).

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-core-timer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected routes
│   │   ├── page.tsx         # Dashboard
│   │   ├── session/         # Timer page
│   │   ├── history/         # Session history
│   │   └── settings/        # Categories management
│   ├── api/                 # API routes
│   │   ├── sessions/
│   │   ├── categories/
│   │   └── users/
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── timer/               # Timer-specific components
│   └── dashboard/           # Dashboard widgets
├── lib/
│   ├── supabase/            # Supabase client setup
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions (chip calc, rank)
│   └── store/               # Zustand stores
├── types/                   # TypeScript types
└── styles/                  # Global styles

prisma/
├── schema.prisma            # Database schema
└── migrations/              # Migration files

tests/
├── unit/                    # Vitest unit tests
│   ├── chip-calculator.test.ts
│   └── rank-calculator.test.ts
├── integration/             # Playwright tests
│   ├── auth.spec.ts
│   └── session.spec.ts
└── mocks/                   # MSW handlers
```

**Structure Decision**: Next.js App Router monolith with co-located API routes. Single `src/` directory follows Next.js conventions while keeping tests in a dedicated top-level `tests/` folder per Constitution Principle V (TDD).

## Complexity Tracking

> No constitution violations requiring justification.
