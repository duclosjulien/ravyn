AGENTS.md

Project: Ravyn

Ravyn is a Spring Boot + PostgreSQL + TypeScript private messaging app.

It is both:

1. A real private messaging app intended to become usable by the maintainer and his fiancée.
2. A learning project for professional backend/full-stack engineering practices.

Agents must treat the project as a serious application, not a throwaway prototype.
Ravyn is primarily a backend/full-stack learning project. The maintainer does not currently intend to deeply learn mobile development. Mobile UI work may be implemented mostly by agents, as long as it stays presentation-only until backend integration is explicitly planned. Backend integration, authentication, persistence, security, and API design decisions must remain human-reviewed and issue-scoped.

⸻

Current Stack

* Spring Boot backend
* PostgreSQL database
* TypeScript frontend
* Static frontend served by Spring Boot
* SockJS/STOMP WebSockets
* Session-cookie authentication
* Flyway migrations

⸻

Source of Truth

Before making changes, inspect the current repository state.

The Ravyn checkpoint / project context is the architectural source of truth for current decisions, roadmap, and workflow.

Do not assume older project state if the checkpoint or current code says otherwise.

When in doubt:

* Prefer the current codebase.
* Prefer existing architectural direction.
* Ask for clarification instead of redesigning.

⸻

Engineering Style

Keep changes professional, focused, and reviewable.

Prefer:

* Thin controllers
* Service-layer business logic
* DTOs at API boundaries
* Repositories only for persistence access
* Clear naming
* Small pull requests
* Minimal but meaningful tests where appropriate

Avoid:

* Large rewrites
* Overengineering
* Mixing unrelated concerns
* Changing public API contracts without being asked
* Introducing new frameworks unless explicitly requested
* Moving files around just for style preferences

⸻

Branch and PR Rules

Default workflow:

One Linear issue = one branch = one PR.

Exceptions are allowed only when two issues are tightly coupled and cannot be meaningfully tested apart.

Keep PRs small and easy to review.

Do not mix unrelated changes.

Examples:

* Do not mix Flyway migration work with frontend logout cleanup.
* Do not mix mobile prototype work with backend security changes.
* Do not mix UI styling cleanup with authentication redesign.

Use focused branch names, for example:

* feature/persist-login-refresh
* feature/logout
* feature/flyway-migrations
* prototype/mobile-ui

Do not use git add . blindly if unrelated local edits exist.

⸻

Authentication Rules

Ravyn currently uses session-cookie authentication.

Current auth endpoints:

* POST /auth/login
* POST /auth/register
* GET /auth/me
* POST /auth/logout

Do not switch Ravyn to JWT or token auth unless a specific issue explicitly asks for that redesign.

For now:

* Session auth is acceptable for the web app.
* Mobile token auth may be considered later as a separate project.
* Do not mix mobile-auth redesign into current backend work.

⸻

Frontend Bootstrapping Rules

Ravyn has four main frontend UI states:

* boot/loading
* login
* register
* chat

Startup flow:

1. Show boot page.
2. Call /auth/me.
3. If unauthenticated, show login and stop.
4. If authenticated, call enterApp().
5. If app bootstrap fails, show boot error, not login.

Important distinction:

* /auth/me failure means “not logged in.”
* enterApp() failure means “logged in, but app failed to load.”

Do not collapse these into the same error path.

⸻

Database and Flyway Rules

Flyway should own schema creation and schema changes.

Hibernate should validate mappings.

Target configuration:

spring.jpa.hibernate.ddl-auto=validate

Do not rely on Hibernate ddl-auto=update for schema evolution.

Expected schema direction:

* chat_user
* conversation
* message
* flyway_schema_history

Conversation participant columns may use canonical names:

* participant_low_id
* participant_high_id

Database constraints should enforce important invariants where appropriate:

* participant_low_id < participant_high_id
* unique pair on (participant_low_id, participant_high_id)
* foreign keys to users
* message foreign keys
* message content length
* not-null constraints

Do not rename schema objects casually. Schema changes should be intentional and migration-backed.

⸻

Backend Architecture Rules

Controllers should be thin.

Services should contain business rules.

Repositories should only be used by the appropriate service layer.

Do not put persistence logic directly into controllers.

Do not expose entities as API responses unless explicitly approved.

Use DTOs for request and response boundaries.

Security-sensitive values must come from the authenticated server-side principal/session, not from client-provided fields.

Examples:

* Do not trust frontend senderId.
* Do not allow users to fetch conversations or messages unless membership is validated.
* Do not create conversations for arbitrary users without checking the authenticated user.

⸻

WebSocket Rules

Ravyn uses SockJS/STOMP WebSockets.

Do not redesign the WebSocket stack unless explicitly asked.

For chat messages:

* The backend should derive sender identity from the authenticated principal.
* The frontend should not be trusted to provide senderId.
* Message delivery and persistence should remain consistent with REST history loading.

⸻

UI and Brand Rules

Preserve Ravyn’s visual identity:

* calm
* private
* warm
* elegant
* minimal
* natural
* slightly literary

Avoid making the app feel:

* corporate
* noisy
* gothic
* magical
* security-company-like
* generic dashboard-like

Use the existing web UI, CSS variables, colors, and assets as the design source of truth.

⸻

Mobile Prototype Rules

Mobile work lives under:

/mobile

Preferred stack:

* Expo
* React Native
* TypeScript

The first mobile phase is prototype-only.

Mobile prototype rules:

* Use mock data only.
* Do not wire backend APIs.
* Do not implement real authentication.
* Do not implement real WebSocket logic.
* Do not change the Spring Boot backend.
* Do not change the existing web frontend unless explicitly requested.
* Use the current Ravyn web UI, colors, assets, and screen flows as the design reference.

The goal of the mobile prototype is to explore presentation layer and UX, not backend integration.

⸻

Agent Scope Discipline

Before editing, identify the scope of the issue.

Stay inside that scope.

If the issue is about backend deployment readiness, do not change mobile UI.

If the issue is about mobile UI prototype, do not change backend authentication.

If the issue is about Flyway, do not redesign DTOs.

If a useful improvement is discovered outside the issue scope, mention it separately instead of implementing it.

⸻

CodeRabbit Review Rules

CodeRabbit comments should be reviewed critically.

Do not blindly accept every suggestion.

For each comment, decide whether it should be:

* accepted now
* rejected with reasoning
* deferred to a separate issue
* clarified with the maintainer

Prefer correctness, security, maintainability, and focused PR scope over satisfying every automated comment.

⸻

Expected Agent Behavior

When working on an issue:

1. Inspect relevant files first.
2. Summarize the current state briefly.
3. Make a focused change.
4. Avoid unrelated cleanup.
5. Preserve existing behavior unless the issue says otherwise.
6. Run relevant tests or type checks when possible.
7. Explain what changed and what was intentionally not changed.
8. Suggest follow-up issues only when useful.

Do not dump large rewrites.

Do not silently change architecture.

Do not introduce new dependencies unless necessary and justified.

Do not make mobile/backend/auth strategy decisions without explicit approval.