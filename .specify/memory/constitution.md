<!--
╔════════════════════════════════════════════════════════════════════════════╗
║                         SYNC IMPACT REPORT                                  ║
╠════════════════════════════════════════════════════════════════════════════╣
║ Version change: N/A → 1.0.0 (Initial ratification)                         ║
║                                                                            ║
║ Added Principles:                                                          ║
║   - I. Quality Over Quantity                                               ║
║   - II. User Experience First                                              ║
║   - III. Gamification with Purpose                                         ║
║   - IV. Progressive Enhancement                                            ║
║   - V. Test-Driven Development                                             ║
║   - VI. Simplicity & YAGNI                                                 ║
║                                                                            ║
║ Added Sections:                                                            ║
║   - Technology Stack                                                       ║
║   - Development Workflow                                                   ║
║   - Governance                                                             ║
║                                                                            ║
║ Templates Alignment:                                                       ║
║   ✅ .specify/templates/plan-template.md - Constitution Check section      ║
║      references principles                                                 ║
║   ✅ .specify/templates/spec-template.md - User story prioritization       ║
║      aligns with Quality Over Quantity principle                           ║
║   ✅ .specify/templates/tasks-template.md - Phase structure aligns with    ║
║      Progressive Enhancement principle                                     ║
║                                                                            ║
║ Deferred Items: None                                                       ║
╚════════════════════════════════════════════════════════════════════════════╝
-->

# Study Poker Constitution

## Core Principles

### I. Quality Over Quantity

Study effectiveness is measured by quality ratings and meaningful engagement, not merely time logged.

- Features MUST encourage quality study sessions over raw hour accumulation
- The chip system MUST include quality multipliers that reward effective study
- Analytics MUST surface quality trends and correlations, not just volume metrics
- Session completion without quality assessment provides minimal reward

**Rationale**: The app exists to fix the user's concentration problem, not to gamify
time-wasting. Habitica failed because it rewarded check-box completion regardless
of actual engagement.

### II. User Experience First

The studying experience MUST be frictionless; gamification elements MUST enhance
rather than interrupt focus.

- Timer sessions MUST NOT require interaction once started (no mid-session popups)
- The poker theme MUST feel sophisticated, not childish or cartoonish
- UI elements MUST support focus mode with minimal visual distraction
- Mobile responsiveness is REQUIRED; this is a personal productivity tool

**Rationale**: A study app that distracts the user defeats its own purpose.
Poker rooms are quiet and focused; the theme should reinforce that environment.

### III. Gamification with Purpose

Every game mechanic MUST serve a clear behavioral objective tied to study
discipline.

- Chip rewards MUST incentivize consistency (streaks) and quality (ratings)
- Tournaments MUST create accountability cycles (weekly goals, monthly reviews)
- Achievements MUST celebrate meaningful milestones, not trivial actions
- Power-ups and spending MUST NOT undermine core discipline mechanics

**Rationale**: Gamification is a means to an end—building study habits for PhD,
math, programming, and content creation. Game elements that don't serve this goal
dilute the experience.

### IV. Progressive Enhancement

Features MUST be delivered in vertical slices that provide value from day one.

- MVP (Phase 1) MUST be usable as a standalone Pomodoro tracker with chips
- Each subsequent phase MUST extend functionality without breaking prior features
- Social features (Phase 5) are OPTIONAL and MUST NOT be prerequisites
- Database schema MUST support feature expansion without breaking migrations

**Rationale**: The user needs to start benefiting immediately to build habit
momentum. A 3-month wait for a "complete" app guarantees abandonment.

### V. Test-Driven Development

Critical paths MUST be tested; tests MUST be written before implementation when
specified.

- Authentication and session persistence MUST have integration tests
- Chip calculation logic MUST have unit tests with edge case coverage
- Timer accuracy MUST be verified with Web Worker isolation tests
- API endpoints MUST have contract tests documenting expected behavior

**Rationale**: A buggy study timer that loses sessions or miscalculates chips
destroys user trust. The app tracks personal progress—data integrity is
non-negotiable.

### VI. Simplicity & YAGNI

Start simple; add complexity only when validated by actual usage.

- Defer features not in the current phase until prior phases are stable
- Prefer configuration over code for customizable elements (timers, chip values)
- Avoid premature optimization—performance goals are Phase 4+ concerns
- No framework churn: commit to Next.js + Supabase stack per the tech spec

**Rationale**: The differentiation from Habitica includes simplicity. The user
got bored of Habitica—overengineering this app risks the same fate.

## Technology Stack

The following technology choices are RATIFIED based on the initial specification:

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Next.js + TypeScript | SSR capability, API routes, strong typing |
| Styling | Tailwind CSS | Rapid UI development, poker theme support |
| State | Zustand | Simple, lightweight, no boilerplate |
| Backend | Next.js API Routes | Single deployment, co-located with frontend |
| Database | PostgreSQL via Supabase | Relational data, built-in auth, free tier |
| ORM | Prisma | TypeScript support, migration management |
| Auth | Supabase Auth | Integrated with database, OAuth support |
| Hosting | Vercel | Native Next.js support, free tier |

Stack changes require constitution amendment with migration justification.

## Development Workflow

### Phase-Gated Delivery

Development follows the roadmap phases defined in intro.md:

1. **Phase 1 (MVP)**: Basic auth, Pomodoro timer, session logging, chip earning
2. **Phase 2**: Quality ratings, streaks, ranks, achievements, tournaments
3. **Phase 3**: Analytics, visualizations, insights
4. **Phase 4**: Polish, themes, sounds, browser extension
5. **Phase 5**: Social features (optional)

Each phase MUST be deployed and validated before the next phase begins.

### Quality Gates

- All code MUST pass TypeScript strict mode compilation
- All code MUST pass ESLint/Prettier formatting checks
- Critical paths (auth, sessions, chips) MUST have test coverage
- Database migrations MUST be reversible
- Each feature MUST be documented in its specification before implementation

## Governance

This constitution supersedes all ad-hoc decisions and represents the foundational
rules for Study Poker development.

### Amendment Procedure

1. Proposed changes MUST be documented with rationale
2. Breaking changes (principle removal/redefinition) require MAJOR version bump
3. Additions or expansions require MINOR version bump
4. Clarifications and typo fixes require PATCH version bump
5. All amendments MUST update the `Last Amended` date

### Compliance

- All feature specifications MUST reference applicable principles
- Implementation plans MUST include a Constitution Check section
- Code reviews SHOULD verify alignment with stated principles
- Deviations MUST be justified in writing and tracked

**Version**: 1.0.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-10
