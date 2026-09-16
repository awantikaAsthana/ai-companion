# AGENTS.md

## Project Identity

**Product:** Ecstacy  
**Repository:** ai-companion  
**Type:** Premium AI companion web application

Ecstacy is a premium AI companion platform focused on customizable characters, emotional connection, romance, fantasy, conversations, persistent memory, discovery, and creator experiences.

Build Ecstacy like a serious production product: clear architecture, small vertical slices, strong UX, secure APIs, tested code, and disciplined Git workflows.

---

## 1. Role of the Coding Agent

You are a coding agent working as part of the Ecstacy engineering team.

Your responsibilities:
- Understand the existing architecture before changing it.
- Implement the requested task only.
- Preserve existing working functionality.
- Follow project conventions.
- Keep changes small and reviewable.
- Test your changes.
- Report what you changed and any remaining issues.

Do not silently redesign architecture.

Do not introduce major dependencies, frameworks, databases, services, or patterns without explicit approval.

---

## 2. Source of Truth

Use these sources in this order:

1. Existing code
2. `AGENTS.md`
3. Project documentation in `docs/`
4. Git history
5. Current milestone/task requirements

If documentation conflicts with the working implementation, inspect Git history and report the discrepancy rather than guessing.

---

## 3. Before Coding

Always follow:

**INSPECT → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → REPORT**

Before making changes:
1. Read `AGENTS.md`.
2. Inspect relevant existing files.
3. Inspect related components/services.
4. Check existing API contracts.
5. Check database schema if relevant.
6. Check recent Git history if the change affects existing behavior.
7. Identify the smallest safe implementation.

Do not immediately start writing code after receiving a task.

---

## 4. Architecture

Ecstacy uses a modular Next.js monolith.

```text
Next.js Application
├── Frontend
│   ├── React
│   ├── Components
│   ├── Pages
│   └── UI
└── Backend
    ├── API Routes
    ├── Services
    ├── AI Gateway
    └── Database Access
        ├── PostgreSQL
        ├── Redis
        └── OpenRouter
```

Technology:
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where appropriate
- Framer Motion where appropriate
- Lucide icons
- PostgreSQL
- Drizzle ORM
- Redis
- OpenRouter
- Docker
- GitHub Actions
- Zod
- zod-openapi
- Argon2id

Do not create separate frontend/backend applications.

Do not introduce microservices unless explicitly approved.

---

## 5. Frontend Rules

Use:
- React
- Next.js App Router
- TypeScript
- Tailwind CSS
- Existing project components
- Reusable components where they provide real value

Prefer a structure such as:

```text
components/
├── auth/
├── landing/
├── characters/
├── chat/
├── memory/
└── ui/
```

Follow the existing project structure if it differs.

Avoid:
- giant components
- duplicated UI
- unnecessary abstractions
- unnecessary prop drilling
- random utility libraries
- magic values where reusable constants are appropriate

Build responsive interfaces intentionally.

Do not simply shrink desktop layouts for mobile.

---

## 6. Design Direction

Ecstacy is not a generic SaaS product.

The visual language should generally feel:
- premium
- cinematic
- intimate
- mysterious
- elegant
- emotionally immersive

Avoid:
- generic SaaS layouts
- excessive cards
- excessive glassmorphism
- neon cyberpunk
- overly bright colors
- excessive gradients
- cartoon-like UI
- visual clutter

Prioritize:
1. Typography
2. Imagery
3. Composition
4. Atmosphere
5. Emotional storytelling
6. Simplicity

Preserve the established Ecstacy visual language unless the task explicitly asks for a redesign.

---

## 7. Images and Assets

Do not generate, download, or replace product character imagery unless explicitly instructed.

Character assets normally live under:

```text
/public/characters/
```

Example:

```text
/characters/character-01.webp
/characters/character-02.webp
```

Keep character data centralized where practical.

Do not use random external image URLs.

Do not silently replace provided assets.

---

## 8. Authentication

Use the existing authentication system.

Current principles:
- PostgreSQL-backed sessions
- HTTP-only session cookie
- Secure cookie configuration in production
- SameSite protection
- Argon2id password hashing
- Zod validation

Never:
- store authentication tokens in localStorage
- create a second auth system
- expose session secrets
- return password hashes
- log passwords
- bypass protected API authorization

Inspect the existing authentication implementation before changing it.

---

## 9. API Rules

The browser must communicate through the application API:

```text
Frontend
   ↓
Next.js API
   ↓
Services
   ↓
Database / Redis / AI providers
```

Never allow the browser to directly access:
- PostgreSQL
- Redis
- OpenRouter
- private API keys
- internal services

API route handlers should remain thin.

Business logic belongs in reusable services.

Use Zod for request validation.

Keep Zod schemas aligned with OpenAPI.

API documentation:

```text
/api/docs
/api/openapi.json
```

---

## 10. Database Rules

PostgreSQL is the primary database.

Drizzle ORM is used for database access.

Schema:

```text
db/schema.ts
```

Migrations:

```text
db/migrations/
```

Database changes must use migrations.

Do not use `drizzle-kit push` as a replacement for committed migrations in CI or production.

Local development:

```powershell
docker compose up -d
npx drizzle-kit migrate
```

Never manually modify production database structure.

---

## 11. AI Architecture

AI calls must go through the centralized AI layer.

Target architecture:

```text
Chat UI
 ↓
Conversation API
 ↓
AI Gateway
 ↓
Context Builder
 ↓
Memory
 ↓
Character Personality
 ↓
OpenRouter
 ↓
Model
 ↓
Streaming Response
 ↓
Chat UI
```

Do not scatter direct OpenRouter calls throughout UI components or API routes.

Planned AI layer:

```text
lib/ai/
├── router.ts
├── models.ts
├── prompts.ts
├── streaming.ts
├── fallback.ts
└── token-budget.ts
```

Preserve centralized control over models, prompts, streaming, fallbacks, and token budgets.

---

## 12. Memory

Memory is a core Ecstacy feature.

Target model:

### L1 — Recent conversation
Approximately the most recent 10–20 messages.

### L2 — Conversation summary
Generated periodically, approximately every 20–40 messages.

### L3 — Durable memory
Structured facts and relevant long-term information.

Do not implement memory casually inside the chat route.

Memory should have clear retrieval, storage, update, and relevance rules.

---

## 13. Git Workflow

Never directly develop features on `main`.

Branches:

```text
main
develop
feature/*
fix/*
hotfix/*
```

Typical workflow:

```text
PLAN
→ CREATE BRANCH
→ IMPLEMENT
→ RUN
→ TEST
→ INSPECT
→ FIX
→ COMMIT
→ PUSH
→ PR
→ REVIEW
→ MERGE
```

Commit prefixes:

```text
feat:
fix:
refactor:
docs:
test:
chore:
security:
perf:
```

Do not create meaningless commits.

Do not commit:
- secrets
- `.env` files
- generated build caches
- local machine configuration
- unrelated generated files

---

## 14. Testing

Before reporting a normal application task as complete:

```powershell
npm run typecheck
npm test
npm run build
```

For UI changes also verify:
- desktop
- tablet
- mobile
- loading states
- error states
- empty states
- keyboard interaction where relevant
- responsive behavior

Do not claim a test passed unless you actually ran it.

---

## 15. Security

Security is a first-class requirement.

Never:
- commit secrets
- expose API keys
- log passwords
- expose password hashes
- trust client authorization
- bypass server-side permission checks
- expose database credentials
- use insecure authentication shortcuts

Validate user input at API boundaries.

Authorization must be enforced server-side.

Assume client-side code is untrusted.

---

## 16. Error Handling

Errors should be:
- predictable
- safe
- user-friendly
- useful for debugging without leaking sensitive information

Do not expose:
- stack traces to users
- database errors
- provider secrets
- internal infrastructure details
- SQL statements

Use appropriate HTTP status codes.

---

## 17. Performance

Prefer simple, measurable solutions.

Avoid unnecessary:
- client components
- API requests
- animations
- dependencies
- re-renders
- large bundles
- duplicated data fetching

Use server components where appropriate.

Use client components when interactivity requires them.

Animations should enhance the experience without harming performance.

---

## 18. Accessibility

UI must be accessible by default.

Use:
- semantic HTML
- proper labels
- keyboard-accessible controls
- meaningful alt text
- visible focus states
- sufficient contrast
- accessible buttons and links

Respect:

```text
prefers-reduced-motion
```

Do not rely solely on color to communicate state.

---

## 19. Vibe Coding Rules

Vibe coding is allowed.

Uncontrolled vibe coding is not.

### DO
- inspect before coding
- work in small slices
- reuse existing architecture
- keep changes understandable
- run tests
- review your own diff
- report assumptions
- ask when requirements are genuinely ambiguous

### DO NOT
- rewrite the project unnecessarily
- create duplicate systems
- invent architecture
- install libraries without reason
- modify unrelated files
- remove working functionality
- silently change APIs
- silently change database behavior
- claim success without verification

Optimize for:

**Fast + Correct + Maintainable**

not merely fast.

---

## 20. Ponytail Workflow

When available, use the Ponytail-style workflow:

```text
Inspect
 ↓
Plan
 ↓
Implement incrementally
 ↓
Run
 ↓
Test
 ↓
Review
 ↓
Fix
```

Do not attempt to build an entire milestone in one uncontrolled generation.

Prefer small vertical slices.

---

## 21. Agent Memory

The repository is persistent project memory.

Use:

### AGENTS.md
For:
- permanent engineering rules
- architecture constraints
- coding conventions
- product identity

### docs/
For:
- architecture
- API contracts
- database decisions
- product decisions
- development workflow

### Git
For:
- what changed
- when it changed
- why it changed
- historical context

### Code structure
For:
- where functionality lives
- how modules relate
- reusable patterns

Never rely on conversation memory alone.

Before modifying an existing system, inspect its implementation and Git history.

---

## 22. Product Loop

Ecstacy's core loop is:

```text
Discover Character
      ↓
Character Profile
      ↓
Start Chat
      ↓
Streaming AI
      ↓
Save Conversation
      ↓
Memory
      ↓
Return
      ↓
Character Remembers
      ↓
Create / Customize
      ↓
Share
      ↓
Discover
```

Protect this core loop when making product decisions.

---

## 23. Milestones

```text
M0 — Foundation
M1 — Authentication
M2 — Characters
M3 — Chat
M4 — Memory
M5 — Discovery
M6 — Monetization
M7 — Beta / Production
```

Follow the active milestone defined by project documentation.

Do not jump ahead and implement future systems unless explicitly requested.

---

## 24. Definition of Done

A task is done when:
- requested functionality works
- existing functionality still works
- implementation follows project architecture
- relevant validation exists
- relevant tests pass
- typecheck passes
- build passes
- UI is responsive where applicable
- security requirements are satisfied
- no unnecessary files or changes remain
- Git diff has been reviewed
- remaining limitations are reported

---

## 25. Final Agent Report

At the end of implementation, report:

```text
## Changes
- ...

## Files
- ...

## Architecture
- ...

## Tests
- npm run typecheck: PASS/FAIL
- npm test: PASS/FAIL
- npm run build: PASS/FAIL

## Manual QA
- Desktop: PASS/FAIL
- Mobile: PASS/FAIL

## Remaining Issues
- ...

## Notes / Assumptions
- ...
```

Never hide known issues.

---

# FINAL RULE

**Inspect first. Change the smallest thing necessary. Preserve the architecture. Test everything.**

Build Ecstacy like a real product, not a disposable prototype.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
