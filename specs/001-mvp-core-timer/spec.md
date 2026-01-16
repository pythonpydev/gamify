# Feature Specification: MVP Core Timer

**Feature Branch**: `001-mvp-core-timer`  
**Created**: 2026-01-10  
**Status**: Draft  
**Input**: Phase 1 MVP: Basic authentication, Pomodoro timer sessions, study category logging, and chip earning system for gamified studying

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete a Study Session (Priority: P1)

As a user, I want to start a timed study session, select what I'm studying, and earn chips when I complete it so that I can track my study progress and feel rewarded for focused work.

**Why this priority**: This is the core value proposition—without the ability to run study sessions and earn chips, the app has no purpose. This single story delivers a usable product.

**Independent Test**: Can be fully tested by starting a timer, letting it complete, and verifying chips are awarded. Delivers immediate value as a gamified Pomodoro timer.

**Acceptance Scenarios**:

1. **Given** I am authenticated (or in local dev mode), **When** I select a study category (PhD, Math, Programming, Outschool Content) and start a 25-minute session, **Then** a countdown timer displays and I cannot interact with other app features until completion.

2. **Given** a session is running and the timer reaches zero, **When** I rate my session quality (1-5 stars), **Then** I earn 100 base chips plus 20 bonus chips per quality star.

3. **Given** a session is running, **When** I abandon the session before completion, **Then** I earn no chips and the session is marked as incomplete in my history.

4. **Given** I complete a session, **When** I view my dashboard, **Then** my total chip count is updated and the session appears in my recent activity.

---

### User Story 2 - User Registration and Login (Priority: P2)

As a new user, I want to create an account and log in so that my study progress is saved and I can access it from any device.

**Why this priority**: Authentication is required for data persistence, but a local-only mode could theoretically work for initial testing. Ranked P2 because it enables the core experience but isn't the experience itself.

**Independent Test**: Can be tested by registering a new account, logging out, and logging back in to verify session data persists.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** I enter a valid email and password and submit the registration form, **Then** my account is created and I am redirected to the dashboard.

2. **Given** I have an existing account, **When** I enter my credentials on the login page, **Then** I am authenticated and redirected to my dashboard with my chip count and history intact.

3. **Given** I am logged in, **When** I click logout, **Then** my session ends and I am redirected to the landing page.

4. **Given** I enter an invalid email format, **When** I submit registration, **Then** I see a validation error and the form is not submitted.

---

### User Story 3 - View Dashboard Progress (Priority: P3)

As a user, I want to see my total chips, recent sessions, and current rank so that I can understand my progress at a glance.

**Why this priority**: The dashboard provides feedback and motivation but isn't strictly required to run sessions. Ranked P3 because it enhances the experience without being essential.

**Independent Test**: Can be tested by logging in and verifying the dashboard displays accurate totals based on completed sessions.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I view the dashboard, **Then** I see my current chip total prominently displayed.

2. **Given** I have completed study sessions, **When** I view the dashboard, **Then** I see my last 5 sessions with date, category, duration, quality rating, and chips earned.

3. **Given** I have accumulated chips, **When** I view the dashboard, **Then** I see my current rank based on total chips (Fish, Calling Station, TAG Regular, etc.).

---

### User Story 4 - Manage Study Categories (Priority: P4)

As a user, I want to customize my study categories so that I can track time spent on my specific subjects.

**Why this priority**: Default categories (PhD, Math, Programming, Outschool Content) cover the initial use case. Custom categories are a nice-to-have enhancement.

**Independent Test**: Can be tested by creating a custom category and using it in a session.

**Acceptance Scenarios**:

1. **Given** I am on the settings page, **When** I create a new category with a name and color, **Then** it appears in my category list.

2. **Given** I have custom categories, **When** I start a new session, **Then** my custom categories appear alongside the default categories in the selection.

3. **Given** I have sessions logged to a category, **When** I attempt to delete that category, **Then** I am warned that existing sessions will be preserved with an "Uncategorized" label.

---

### Edge Cases

- **Session timeout during network outage**: Session timer runs locally; chips are awarded locally and synced when connection restores.
- **Browser/tab closure during session**: Session is marked as abandoned; no chips awarded.
- **Multiple sessions in parallel**: Users can only have one active session at a time.
- **Chip calculation edge case**: Zero-star ratings are not allowed; minimum rating is 1 star.
- **Session duration validation**: Sessions under 5 minutes are not eligible for chips (prevents gaming the system).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to register with email and password.
- **FR-002**: System MUST authenticate users and maintain session state across page refreshes.
- **FR-003**: System MUST provide four default study categories: PhD, Math, Programming, Outschool Content.
- **FR-004**: Users MUST be able to start a timed study session by selecting a category and session type.
- **FR-005**: System MUST support three session types: Quick Hand (15 min), Standard Hand (25 min), Deep Stack (50 min).
- **FR-006**: System MUST display a countdown timer during active sessions.
- **FR-007**: System MUST NOT allow navigation away from the timer page during an active session without explicit abandonment.
- **FR-008**: System MUST prompt for quality rating (1-5 stars) upon session completion.
- **FR-009**: System MUST calculate and award chips using formula: `floor(durationMins / 25) * 100` base chips + `qualityRating * 20` bonus chips. Examples: Quick Hand (15 min, 4★) = 60 + 80 = 140 chips; Standard (25 min, 5★) = 100 + 100 = 200 chips; Deep Stack (50 min, 3★) = 200 + 60 = 260 chips.
- **FR-010**: System MUST persist all sessions with timestamp, category, duration, quality, and chips earned.
- **FR-011**: System MUST display current chip total on the dashboard.
- **FR-012**: System MUST display the user's rank based on total chips earned.
- **FR-013**: Users MUST be able to view their session history.
- **FR-014**: Users MUST be able to create, edit, and delete custom study categories.
- **FR-015**: System MUST handle sessions shorter than 5 minutes as ineligible for chip rewards.

### Key Entities

- **User**: Represents a registered user; has email, display name, current chip total, total chips earned, rank, and creation timestamp.
- **StudySession**: Represents a completed or abandoned study session; linked to user and category; has start time, end time, duration, quality rating, chips earned, and completion status.
- **Category**: Represents a study category; can be system-default or user-created; has name, color, and associated user (null for defaults).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can register and start their first study session within 3 minutes of landing on the app.
- **SC-002**: Users complete at least 80% of started sessions (low abandonment rate).
- **SC-003**: Average session quality rating is 3.0 or higher (indicating engaged study, per Constitution Principle I).
- **SC-004**: Users return to the app within 48 hours of their first session (early retention signal).
- **SC-005**: Dashboard loads and displays current stats within 2 seconds of login.
- **SC-006**: Users can complete 5+ sessions in their first week of use.

## Assumptions

- Users have modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions).
- Users have reliable internet for initial login; offline session tracking is out of scope for MVP.
- OAuth providers (Google, GitHub) are deferred to Phase 2; MVP uses email/password only.
- Mobile-responsive design is required but native mobile apps are out of scope.
- Streak multipliers and achievements are deferred to Phase 2 per the roadmap.
- Ambient sounds and themes are deferred to Phase 4.

## Out of Scope

- OAuth authentication (Phase 2)
- Streak tracking and multipliers (Phase 2)
- Achievements system (Phase 2)
- Weekly tournaments (Phase 2)
- Analytics charts and visualizations (Phase 3)
- Themes and ambient sounds (Phase 4)
- Browser extension for distraction blocking (Phase 4)
- Social features and leaderboards (Phase 5)
