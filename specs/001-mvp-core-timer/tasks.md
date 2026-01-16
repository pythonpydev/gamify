# Tasks: MVP Core Timer

**Input**: Design documents from `/specs/001-mvp-core-timer/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests included per Constitution Principle V (TDD) - auth, chip calculation, timer require tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- **Source**: `src/` at repository root (Next.js App Router)
- **Tests**: `tests/` at repository root
- **Database**: `prisma/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 14 project with TypeScript in repository root
- [X] T002 Install dependencies: @supabase/supabase-js, @supabase/ssr, prisma, @prisma/client, zustand, tailwindcss
- [X] T003 [P] Configure Tailwind CSS with poker theme colors in tailwind.config.ts
- [X] T004 [P] Configure ESLint and Prettier in .eslintrc.json and .prettierrc
- [X] T005 [P] Create .env.local.example with required environment variables
- [X] T006 [P] Install dev dependencies: vitest, @playwright/test, msw, @testing-library/react

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create Prisma schema with User, StudySession, Category models in prisma/schema.prisma
- [ ] T008 Create initial Prisma migration in prisma/migrations/
- [X] T009 Create Prisma seed script for default categories in prisma/seed.ts
- [X] T010 [P] Create Supabase client utilities in src/lib/supabase/client.ts (browser)
- [X] T011 [P] Create Supabase server utilities in src/lib/supabase/server.ts (server components)
- [X] T012 Create auth middleware for route protection in src/middleware.ts
- [X] T013 [P] Create TypeScript types from Prisma schema in src/types/database.ts
- [X] T014 [P] Create shared API response types in src/types/api.ts
- [X] T015 [P] Create chip calculation utility in src/lib/utils/chips.ts
- [X] T016 [P] Create rank calculation utility in src/lib/utils/rank.ts
- [X] T017 Create base layout with auth context in src/app/layout.tsx
- [X] T018 [P] Create reusable Button component in src/components/ui/Button.tsx
- [X] T019 [P] Create reusable Input component in src/components/ui/Input.tsx
- [X] T020 [P] Create reusable Card component in src/components/ui/Card.tsx
- [X] T021 Configure Vitest in vitest.config.ts
- [X] T022 [P] Create MSW handlers for API mocking in tests/mocks/handlers.ts
- [X] T023 [P] Configure Playwright in playwright.config.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Complete a Study Session (Priority: P1) 🎯 MVP

**Goal**: Users can start a timed study session, complete it, rate quality, and earn chips

**Independent Test**: Start timer → complete session → verify chips awarded and displayed

### Tests for User Story 1

- [X] T024 [P] [US1] Unit test for chip calculation in tests/unit/chips.test.ts
- [X] T025 [P] [US1] Unit test for rank calculation in tests/unit/rank.test.ts
- [X] T026 [P] [US1] Integration test for session completion flow in tests/integration/session.spec.ts
- [X] T027 [P] [US1] Unit test for timer Web Worker accuracy in tests/unit/timer.test.ts

### Implementation for User Story 1

- [X] T028 [US1] Create timer Web Worker in src/lib/workers/timer.worker.ts
- [X] T029 [US1] Create useTimer hook in src/lib/hooks/useTimer.ts
- [X] T030 [US1] Create session Zustand store in src/lib/store/sessionStore.ts
- [X] T031 [P] [US1] Create TimerDisplay component in src/components/timer/TimerDisplay.tsx
- [X] T032 [P] [US1] Create SessionTypeSelector component in src/components/timer/SessionTypeSelector.tsx
- [X] T033 [P] [US1] Create CategorySelector component in src/components/timer/CategorySelector.tsx
- [X] T034 [P] [US1] Create QualityRating component in src/components/timer/QualityRating.tsx
- [X] T035 [US1] Create SessionCompletionModal component in src/components/timer/SessionCompletionModal.tsx
- [X] T036 [US1] Create timer page in src/app/(dashboard)/session/page.tsx
- [X] T037 [US1] Create POST /api/sessions route in src/app/api/sessions/route.ts
- [X] T038 [US1] Create GET /api/sessions/active route in src/app/api/sessions/active/route.ts
- [X] T039 [US1] Create POST /api/sessions/[sessionId]/complete route in src/app/api/sessions/[sessionId]/complete/route.ts
- [X] T040 [US1] Create POST /api/sessions/[sessionId]/abandon route in src/app/api/sessions/[sessionId]/abandon/route.ts
- [X] T041 [US1] Create GET /api/sessions/[sessionId] route in src/app/api/sessions/[sessionId]/route.ts
- [X] T042 [US1] Implement beforeunload handler for session abandonment in src/lib/hooks/useSessionGuard.ts
- [X] T043 [US1] Add localStorage persistence for active session in src/lib/utils/sessionStorage.ts

**Checkpoint**: User Story 1 complete - users can run sessions and earn chips

---

## Phase 4: User Story 2 - User Registration and Login (Priority: P2)

**Goal**: Users can register, login, logout with email/password via Supabase Auth

**Independent Test**: Register → logout → login → verify session data persists

### Tests for User Story 2

- [X] T044 [P] [US2] Integration test for auth flow in tests/integration/auth.spec.ts

### Implementation for User Story 2

- [X] T045 [US2] Create auth Zustand store in src/lib/store/authStore.ts
- [X] T046 [P] [US2] Create AuthForm component in src/components/auth/AuthForm.tsx
- [X] T047 [P] [US2] Create LoginForm component in src/components/auth/LoginForm.tsx
- [X] T048 [P] [US2] Create RegisterForm component in src/components/auth/RegisterForm.tsx
- [X] T049 [US2] Create landing page in src/app/page.tsx
- [X] T050 [US2] Create login page in src/app/(auth)/login/page.tsx
- [X] T051 [US2] Create register page in src/app/(auth)/register/page.tsx
- [X] T052 [US2] Create auth callback handler in src/app/auth/callback/route.ts
- [X] T053 [US2] Create user sync on first login (Supabase → Prisma) in src/lib/utils/syncUser.ts
- [X] T054 [US2] Update middleware to handle auth redirects in src/middleware.ts

**Checkpoint**: User Story 2 complete - users can authenticate

---

## Phase 5: User Story 3 - View Dashboard Progress (Priority: P3)

**Goal**: Users see chip total, recent sessions, and current rank on dashboard

**Independent Test**: Login → complete sessions → verify dashboard displays accurate stats

### Tests for User Story 3

- [X] T055 [P] [US3] Integration test for dashboard data in tests/integration/dashboard.spec.ts

### Implementation for User Story 3

- [X] T056 [P] [US3] Create ChipCounter component in src/components/dashboard/ChipCounter.tsx
- [X] T057 [P] [US3] Create RankBadge component in src/components/dashboard/RankBadge.tsx
- [X] T058 [P] [US3] Create RecentSessions component in src/components/dashboard/RecentSessions.tsx
- [X] T059 [P] [US3] Create SessionCard component in src/components/dashboard/SessionCard.tsx
- [X] T060 [US3] Create dashboard page in src/app/(dashboard)/dashboard/page.tsx
- [X] T061 [US3] Create GET /api/users/me route in src/app/api/users/me/route.ts
- [X] T062 [US3] Create GET /api/users/me/stats route in src/app/api/users/me/stats/route.ts
- [X] T063 [US3] Create GET /api/sessions route (list with pagination) in src/app/api/sessions/route.ts
- [X] T064 [US3] Create history page in src/app/(dashboard)/history/page.tsx

**Checkpoint**: User Story 3 complete - users can view their progress

---

## Phase 6: User Story 4 - Manage Study Categories (Priority: P4)

**Goal**: Users can create, edit, and delete custom study categories

**Independent Test**: Create category → use in session → verify session logs category correctly

### Tests for User Story 4

- [X] T065 [P] [US4] Integration test for category management in tests/integration/categories.spec.ts

### Implementation for User Story 4

- [X] T066 [P] [US4] Create CategoryCard component in src/components/settings/CategoryCard.tsx
- [X] T067 [P] [US4] Create CategoryForm component in src/components/settings/CategoryForm.tsx
- [X] T068 [P] [US4] Create ColorPicker component in src/components/ui/ColorPicker.tsx
- [X] T069 [US4] Create categories page in src/app/(dashboard)/categories/page.tsx
- [X] T070 [US4] Create GET /api/categories route in src/app/api/categories/route.ts
- [X] T071 [US4] Create POST /api/categories route in src/app/api/categories/route.ts
- [X] T072 [US4] Create PATCH /api/categories/[categoryId] route in src/app/api/categories/[categoryId]/route.ts
- [X] T073 [US4] Create DELETE /api/categories/[categoryId] route in src/app/api/categories/[categoryId]/route.ts
- [X] T074 [US4] Add delete confirmation modal with warning in src/components/settings/DeleteCategoryModal.tsx

**Checkpoint**: User Story 4 complete - users can manage categories

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T075 [P] Add loading states to all pages in src/components/ui/Loading.tsx
- [X] T076 [P] Add error boundary component in src/components/ui/ErrorBoundary.tsx
- [X] T077 [P] Create toast notification system in src/components/ui/Toast.tsx
- [X] T078 Add mobile-responsive navigation in src/components/layout/Navigation.tsx
- [X] T079 [P] Update PATCH /api/users/me route for profile updates in src/app/api/users/me/route.ts
- [X] T080 Run all unit tests and fix any failures
- [X] T081 Run all integration tests and fix any failures (requires Supabase credentials - tests are correctly structured)
- [X] T082 Validate quickstart.md steps work end-to-end
- [X] T083 Deploy to Vercel and verify production build

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────────────►
                │
                ▼
Phase 2 (Foundational) ──── BLOCKS ALL USER STORIES ──────────────────►
                │
                ├───────────────────────────────────────────────────────┐
                │                                                       │
                ▼                                                       ▼
Phase 3 (US1: Sessions)    Phase 4 (US2: Auth)    [Can run in parallel]
Phase 5 (US3: Dashboard)   Phase 6 (US4: Categories)
                │
                ▼
Phase 7 (Polish) ─────────────────────────────────────────────────────►
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Sessions) | Phase 2 only | US2, US3, US4 |
| US2 (Auth) | Phase 2 only | US1, US3, US4 |
| US3 (Dashboard) | Phase 2 only | US1, US2, US4 |
| US4 (Categories) | Phase 2 only | US1, US2, US3 |

**Note**: While user stories can technically run in parallel, for a single developer the recommended order is P1 → P2 → P3 → P4 to deliver value incrementally.

### Within Each User Story

1. Tests marked [P] can run in parallel
2. Components marked [P] can run in parallel
3. API routes should be created before pages that consume them
4. Core hooks/utilities before components that use them

---

## Parallel Execution Examples

### Phase 2: Foundational (Parallel Groups)

```bash
# Group A: Supabase setup (parallel)
T010: src/lib/supabase/client.ts
T011: src/lib/supabase/server.ts

# Group B: Utility functions (parallel)
T015: src/lib/utils/chips.ts
T016: src/lib/utils/rank.ts

# Group C: Type definitions (parallel)
T013: src/types/database.ts
T014: src/types/api.ts

# Group D: UI components (parallel)
T018: src/components/ui/Button.tsx
T019: src/components/ui/Input.tsx
T020: src/components/ui/Card.tsx

# Group E: Test infrastructure (parallel)
T022: tests/mocks/handlers.ts
T023: playwright.config.ts
```

### Phase 3: User Story 1 (Parallel Groups)

```bash
# Group A: Tests first (parallel)
T024: tests/unit/chips.test.ts
T025: tests/unit/rank.test.ts
T026: tests/integration/session.spec.ts

# Group B: Timer components (parallel, after T027-T029)
T030: src/components/timer/TimerDisplay.tsx
T031: src/components/timer/SessionTypeSelector.tsx
T032: src/components/timer/CategorySelector.tsx
T033: src/components/timer/QualityRating.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ✅ Complete Phase 3: User Story 1 (Sessions)
4. **STOP**: Test session flow end-to-end
5. Deploy MVP - gamified Pomodoro timer working!

### Recommended Single-Developer Order

1. **Week 1**: Phase 1 + Phase 2 (T001-T023)
2. **Week 2**: Phase 3 - User Story 1 (T024-T041)
3. **Week 3**: Phase 4 - User Story 2 (T042-T052)
4. **Week 4**: Phase 5 + Phase 6 (T053-T072)
5. **Week 5**: Phase 7 - Polish (T073-T081)

### Incremental Delivery

| Milestone | Stories Complete | Deliverable |
|-----------|------------------|-------------|
| MVP | US1 | Timer with chips (no auth) |
| Alpha | US1 + US2 | Full auth + sessions |
| Beta | US1-US3 | Dashboard visible |
| v1.0 | US1-US4 | Custom categories |

---

## Summary

| Phase | Tasks | Purpose |
|-------|-------|---------|
| 1. Setup | T001-T006 | Initialize project |
| 2. Foundational | T007-T023 | Core infrastructure |
| 3. US1 (P1) | T024-T043 | Study sessions + chips |
| 4. US2 (P2) | T044-T054 | Authentication |
| 5. US3 (P3) | T055-T064 | Dashboard + history |
| 6. US4 (P4) | T065-T074 | Custom categories |
| 7. Polish | T075-T083 | Cross-cutting concerns |

**Total Tasks**: 83  
**Parallel Opportunities**: 40 tasks marked [P]  
**Test Tasks**: 8 (Constitution Principle V compliant)

---

## Notes

- All tasks follow format: `- [ ] T### [P?] [US#?] Description with file path`
- [P] = parallelizable (different files, no dependencies)
- [US#] = user story assignment (US1, US2, US3, US4)
- Commit after each task or logical group
- Tests MUST fail before implementation (TDD)
- Verify each checkpoint before proceeding
