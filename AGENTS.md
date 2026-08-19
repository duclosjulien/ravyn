# AGENTS.md

Project: Ravyn

Ravyn is a Spring Boot + PostgreSQL + TypeScript messaging app.

Agents must treat the project as a serious application, not a throwaway prototype.

Ravyn is primarily a backend/full-stack learning project. The maintainer does not currently intend to deeply learn mobile development. Mobile UI work may be implemented mostly by agents, but backend integration, authentication, persistence, security, API design, and other architectural decisions must remain human-reviewed and issue-scoped.

---

## Current Stack

- Spring Boot backend
- PostgreSQL database
- TypeScript web frontend
- Static frontend served by Spring Boot
- SockJS/STOMP WebSockets
- Session-cookie authentication
- Flyway migrations
- Expo SDK 57
- React Native
- React
- Expo Router
- TypeScript mobile client under `/mobile`

---

## Source of Truth

Before making changes, inspect the current repository state.

The current codebase and approved project decisions are the source of truth for architecture, behavior, roadmap, and workflow.

Do not assume older project state if the current code or an approved issue/plan says otherwise.

When in doubt:

- Prefer the current codebase.
- Prefer existing architectural direction.
- Ask for clarification instead of redesigning.
- Do not silently introduce new architectural patterns.

---

## Engineering Style

Keep changes professional, focused, and reviewable.

Prefer:

- Thin controllers
- Service-layer business logic
- DTOs at API boundaries
- Repositories only for persistence access
- Clear naming
- Small pull requests
- Minimal but meaningful tests where appropriate

Avoid:

- Large rewrites
- Overengineering
- Mixing unrelated concerns
- Changing public API contracts without being asked
- Introducing new frameworks unless explicitly requested
- Moving files around only for style preferences
- Opportunistic cleanup unrelated to the current issue

---

## Branch and PR Rules

Default workflow:

One Linear issue = one branch = one PR.

Exceptions are allowed only when two issues are tightly coupled and cannot be meaningfully tested apart.

Keep PRs small and easy to review.

Do not mix unrelated changes.

Examples:

- Do not mix Flyway migration work with frontend logout cleanup.
- Do not mix mobile UI work with backend security changes.
- Do not mix UI styling cleanup with authentication redesign.

Use focused branch names, for example:

- `feat/connection-resolution`
- `feat/mobile-app-shell`
- `feat/mobile-auth`
- `feat/mobile-messaging`
- `chore/upgrade-mobile-expo`
- `fix/auth-session-handling`

Do not use `git add .` blindly if unrelated local edits exist.

Agents may create commits, push branches, and open draft pull requests when explicitly authorized.

Agents must not merge pull requests unless explicitly instructed.

---

## Authentication Rules

Ravyn currently uses session-cookie authentication.

Current auth endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`

Do not switch Ravyn to JWT or token authentication unless a specific issue explicitly asks for that redesign.

For now:

- Session authentication is acceptable for the web app.
- Mobile authentication strategy must be designed separately before backend integration.
- Do not mix mobile authentication redesign into unrelated backend or UI work.
- Authentication and session behavior remain security-sensitive and must be human-reviewed.

---

## Frontend Bootstrapping Rules

Ravyn has four main web frontend UI states:

- boot/loading
- login
- register
- chat

Startup flow:

1. Show boot page.
2. Call `/auth/me`.
3. If unauthenticated, show login and stop.
4. If authenticated, call `enterApp()`.
5. If app bootstrap fails, show boot error, not login.

Important distinction:

- `/auth/me` failure means “not logged in.”
- `enterApp()` failure means “logged in, but app failed to load.”

Do not collapse these into the same error path.

---

## Database and Flyway Rules

Flyway should own schema creation and schema changes.

Hibernate should validate mappings.

Target configuration:

`spring.jpa.hibernate.ddl-auto=validate`

Do not rely on Hibernate `ddl-auto=update` for schema evolution.

Current domain/schema includes:

- `chat_user`
- `conversation`
- `message`
- `connection`
- `flyway_schema_history`

Conversation participant columns may use canonical names:

- `participant_low_id`
- `participant_high_id`

Database constraints should enforce important invariants where appropriate:

- `participant_low_id < participant_high_id`
- unique pair on `(participant_low_id, participant_high_id)`
- foreign keys to users
- message foreign keys
- message content length
- connection pair uniqueness
- connection state invariants
- not-null constraints

Do not rename schema objects casually.

Schema changes must be intentional and migration-backed.

---

## Backend Architecture Rules

Controllers should be thin.

Services should contain business rules.

Repositories should only be used by the appropriate service layer.

Do not put persistence logic directly into controllers.

Do not expose entities as API responses unless explicitly approved.

Use DTOs for request and response boundaries.

Security-sensitive values must come from the authenticated server-side principal/session, not from client-provided fields.

Examples:

- Do not trust frontend `senderId`.
- Do not allow users to fetch conversations or messages unless membership is validated.
- Do not create conversations for arbitrary users without checking the authenticated user.
- Do not trust client-provided identity when the server can derive it from authentication state.

---

## WebSocket Rules

Ravyn uses SockJS/STOMP WebSockets.

Do not redesign the WebSocket stack unless explicitly asked.

For chat messages:

- The backend should derive sender identity from the authenticated principal.
- The frontend should not be trusted to provide `senderId`.
- Message delivery and persistence should remain consistent with REST history loading.

Mobile WebSocket integration must be planned separately before implementation.

---

## UI and Brand Rules

Preserve Ravyn’s visual identity:

- calm
- private
- warm
- elegant
- minimal
- natural
- slightly literary

Avoid making the app feel:

- corporate
- noisy
- gothic
- magical
- security-company-like
- generic dashboard-like

Use the existing Ravyn colors, assets, branding, and approved design direction as the visual source of truth.

Do not invent unrelated visual systems without approval.

---

## Mobile Client Rules

Mobile work lives under:

`/mobile`

Current stack:

- Expo SDK 57
- React Native
- React
- TypeScript
- Expo Router

The mobile client is intended to become a real Ravyn client, but development must happen in explicit phases.

The current phase is presentation-focused.

Until backend integration is explicitly planned:

- Use mock data only.
- Do not wire backend APIs.
- Do not implement real authentication.
- Do not implement real WebSocket logic.
- Do not modify the Spring Boot backend for mobile needs.
- Do not modify the existing web frontend unless explicitly requested.
- Preserve the approved mobile product structure and Ravyn visual identity.

Current approved top-level mobile navigation:

- Chats
- Connections
- You

Mobile UI implementation may be heavily agent-assisted.

Backend integration, authentication, notification persistence, WebSockets, security, and API contract changes require separate planning and human approval.

Do not make mobile/backend/auth strategy decisions implicitly while implementing UI.

---

## Agent Workflow

For substantial work, use a staged workflow rather than immediately implementing the feature.

### 1. Research

Inspect the relevant repository files and current behavior.

During a research-only request:

- Do not modify files.
- Identify relevant components, services, DTOs, routes, tests, and dependencies.
- Summarize the current implementation briefly.
- Identify constraints and unanswered questions.

### 2. Plan

Produce a focused implementation plan.

The plan should describe:

- intended behavior
- files likely to change
- component/service responsibilities
- relevant API or data contracts
- edge cases
- testing/validation approach
- risks or architectural questions

Planning requests are read-only unless explicitly stated otherwise.

### 3. Comment Scaffold

For substantial or unfamiliar features, especially when requested by the maintainer, create a comment-only scaffold before implementation.

The scaffold should:

- establish the proposed file/component structure
- place concise implementation comments where logic will eventually live
- explain component responsibilities and data flow
- avoid implementing the actual feature

Stop after the scaffold and wait for approval.

Do not use comment scaffolding for trivial changes where it adds no value.

### 4. Human Review

Do not proceed from planning or comment scaffolding into implementation unless approval has been given.

Architectural, authentication, persistence, security, API, and cross-client decisions require explicit human approval.

### 5. Implementation

Implement only the approved plan.

During implementation:

- stay inside issue scope
- avoid unrelated cleanup
- preserve existing behavior unless intentionally changed
- do not silently expand the architecture
- do not introduce dependencies without justification

### 6. Self-Review

Before committing, review the diff critically.

When asked for a review-only pass:

- Do not modify files.
- Identify correctness issues.
- Identify unnecessary complexity.
- Identify missed edge cases.
- Identify security or data-integrity concerns.
- Identify deviations from the approved plan.
- Identify missing tests or validation.

Present findings before fixing them unless explicitly told to fix automatically.

### 7. Fix Approved Findings

Implement only the findings that have been approved or clearly fall within the issue scope.

Do not turn review feedback into unrelated refactoring.

### 8. Validation

Run the relevant validation for the change.

Examples include:

- backend unit tests
- integration tests
- TypeScript type checking
- Expo Doctor
- Expo dependency checks
- build/bundle validation
- linting where configured
- `git diff --check`

Report what was run and whether it passed.

### 9. Draft Pull Request

When authorized:

- create a focused commit
- push the feature branch
- open a draft PR against `dev`
- summarize what changed
- explain why
- list validation performed
- state what was intentionally not changed

### 10. External Review

CodeRabbit or other automated review feedback should be evaluated critically.

Do not blindly implement every suggestion.

For each finding, decide whether it should be:

- accepted now
- rejected with reasoning
- deferred to a separate issue
- clarified with the maintainer

Prefer correctness, security, maintainability, and focused PR scope over satisfying every automated comment.

### 11. Human Merge

The maintainer owns final merge approval.

Agents must not merge unless explicitly instructed.

---

## Agent Scope Discipline

Before editing, identify the scope of the issue.

Stay inside that scope.

If the issue is about backend deployment readiness, do not change mobile UI.

If the issue is about mobile UI, do not change backend authentication.

If the issue is about Flyway, do not redesign DTOs.

If the issue is presentation-only mobile work, do not introduce backend integration.

If a useful improvement is discovered outside the issue scope, mention it separately instead of implementing it.

---

## Expected Agent Behavior

When working on an issue:

1. Inspect relevant files first.
2. Understand the current implementation before proposing changes.
3. Respect read-only research, planning, and review phases.
4. Follow the approved plan.
5. Make focused changes.
6. Avoid unrelated cleanup.
7. Preserve existing behavior unless the issue says otherwise.
8. Run relevant tests or type checks when possible.
9. Explain what changed.
10. Explain what was intentionally not changed.
11. Suggest follow-up issues only when useful.

Do not dump large rewrites.

Do not silently change architecture.

Do not introduce new dependencies unless necessary and justified.

Do not make mobile/backend/auth/security/API strategy decisions without explicit approval.

When asked to stop after research, planning, scaffolding, or review, stop at that phase.