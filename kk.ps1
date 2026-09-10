$ErrorActionPreference = "Stop"

$Repo = "awantikaAsthana/ai-companion"

Write-Host "=== AI Companion Bootstrap ===" -ForegroundColor Cyan

# Check GitHub CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) is not installed."
}

Write-Host "`nChecking GitHub login..." -ForegroundColor Yellow
gh auth status

Write-Host "`nChecking repository..." -ForegroundColor Yellow
gh repo view $Repo

# ------------------------------------------------------------
# Repository structure
# ------------------------------------------------------------

Write-Host "`nCreating directories..." -ForegroundColor Yellow

$dirs = @(
    ".github",
    ".github/ISSUE_TEMPLATE",
    ".github/workflows",
    "docs",
    "docs/ADR",
    "app",
    "components",
    "lib",
    "ai",
    "db",
    "tests"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force $dir | Out-Null
}

# ------------------------------------------------------------
# Files
# ------------------------------------------------------------

@'
# AI Companion

AI companion platform built around customizable characters, conversations, persistent memory, discovery, and creator experiences.

## Status

M0 - Foundation

## Product Loop

Discover
-> Character
-> Chat
-> Streaming AI
-> Save conversation
-> Memory
-> Return
-> Character remembers
-> Create
-> Share
-> Discover

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Redis
- OpenRouter
- Docker
- GitHub Actions

## Development

GitHub is the source of truth for project management.

Slack is used for team communication.

Kilo is used as the coding agent.

## Development Loop

PLAN
-> BUILD ONE FEATURE
-> RUN
-> TEST
-> INSPECT
-> FIX
-> COMMIT
-> NEXT FEATURE
'@ | Set-Content -Encoding utf8 README.md

@'
node_modules/
.next/
out/
dist/
build/
coverage/

.env
.env.local
.env.*.local

.DS_Store
Thumbs.db

.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

.idea/

*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

docker-data/
tmp/
temp/
'@ | Set-Content -Encoding utf8 .gitignore

@'
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_companion

REDIS_URL=redis://localhost:6379

OPENROUTER_API_KEY=

AUTH_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

SENTRY_DSN=
'@ | Set-Content -Encoding utf8 .env.example

@'
# Contributing

## Workflow

1. Pick a GitHub Issue.
2. Create a branch from develop.
3. Implement only the requested scope.
4. Run tests.
5. Open a Pull Request.
6. Get review.
7. Fix review comments.
8. Wait for CI.
9. QA.
10. Merge.

## Branches

main - production
develop - integration/staging

feature/* - features
fix/* - bugs
hotfix/* - urgent production fixes

## Commits

Use:

feat:
fix:
refactor:
docs:
test:
chore:
security:
perf:

## Definition of Done

- Code complete
- Typecheck passes
- Lint passes
- Tests pass
- No secrets committed
- PR reviewed
- CI passes
- QA completed
- Documentation updated when required

Do not mix unrelated changes into one PR.
'@ | Set-Content -Encoding utf8 CONTRIBUTING.md

@'
# Architecture

## Initial Architecture

Start as a modular monolith.

Browser
|
v
Next.js
|
+-- Authentication
+-- Characters
+-- Conversations
+-- Memory
+-- AI Gateway
+-- Billing
|
+-- PostgreSQL
+-- Redis

Do not introduce microservices unless there is a demonstrated need.

## AI Gateway

All AI requests go through an internal abstraction.

Target:

ai/
  router.ts
  models.ts
  prompts.ts
  memory.ts
  summarizer.ts
  token-budget.ts
  fallback.ts

The browser must never receive the OpenRouter API key.

## Context

Do not send the entire conversation history by default.

Use:

1. Character definition
2. Relevant memories
3. Conversation summary
4. Recent messages
5. Current message
'@ | Set-Content -Encoding utf8 docs/ARCHITECTURE.md

@'
# AI Architecture

OpenRouter is the initial model gateway.

Requirements:

- Streaming
- Central model configuration
- Primary model
- Fallback models
- Token usage tracking
- Cost tracking
- Error handling
- Rate limiting
- Timeouts

Application code should not call OpenRouter directly from UI components.

Model IDs must be centralized.

User-generated character content and messages are untrusted input.
'@ | Set-Content -Encoding utf8 docs/AI.md

@'
# Memory

Use three layers.

## L1 - Short Term

Recent messages.

Target roughly 10-20 messages depending on token budget.

## L2 - Conversation Summary

Compact summary of older conversation context.

## L3 - Durable Memory

Important facts that survive conversations.

Examples:

- Preferences
- Relationships
- Interests
- Important events
- Character-specific facts

Durable memories should include:

- content
- category
- importance
- confidence
- timestamps
- source conversation

Memory extraction should run asynchronously where possible.
'@ | Set-Content -Encoding utf8 docs/MEMORY.md

@'
# Database

PostgreSQL is the primary datastore.

Expected core entities:

- users
- characters
- conversations
- messages
- memories
- subscriptions
- usage records

All schema changes must use migrations.

Never manually modify production schema without a migration.
'@ | Set-Content -Encoding utf8 docs/DATABASE.md

@'
# Security

Never commit:

- API keys
- passwords
- authentication secrets
- payment credentials
- cloud credentials

OpenRouter credentials remain server-side.

User-generated content is untrusted.

Protected resources require server-side authorization.

Never log secrets or authentication tokens.

Avoid logging private conversation content unless required and properly protected.
'@ | Set-Content -Encoding utf8 docs/SECURITY.md

@'
# API

Initial domains:

- authentication
- characters
- conversations
- messages
- memory
- discovery
- billing

API handlers should validate:

- authentication
- authorization
- input
- rate limits
- ownership

AI provider details stay behind the internal AI gateway.
'@ | Set-Content -Encoding utf8 docs/API.md

@'
# ADR-0001: Initial Architecture

## Status

Accepted

## Decision

Use a modular monolith with:

- Next.js
- TypeScript
- PostgreSQL
- Redis
- Internal AI gateway

## Reason

The project is an early-stage two-person product.

The architecture should optimize for:

- development speed
- simplicity
- reliability
- low operational overhead

Microservices can be introduced later when justified.
'@ | Set-Content -Encoding utf8 docs/ADR/0001-initial-architecture.md

@'
name: Feature
description: New product or engineering feature
title: "[Feature] "
labels: ["feature"]
body:
  - type: textarea
    id: goal
    attributes:
      label: Goal
    validations:
      required: true

  - type: textarea
    id: requirements
    attributes:
      label: Requirements
    validations:
      required: true

  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance Criteria
      value: |
        - [ ]
        - [ ]
        - [ ]
'@ | Set-Content -Encoding utf8 .github/ISSUE_TEMPLATE/feature.yml

@'
name: Bug
description: Report a reproducible problem
title: "[Bug] "
labels: ["bug"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Reproduction Steps
    validations:
      required: true
'@ | Set-Content -Encoding utf8 .github/ISSUE_TEMPLATE/bug.yml

@'
name: Engineering Task
description: Internal engineering task
title: "[Task] "
labels: ["task"]
body:
  - type: textarea
    id: goal
    attributes:
      label: Goal
    validations:
      required: true

  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance Criteria
      value: |
        - [ ]
        - [ ]
        - [ ]
'@ | Set-Content -Encoding utf8 .github/ISSUE_TEMPLATE/task.yml

@'
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  foundation:
    runs-on: ubuntu-latest
    steps:
      - run: echo "CI foundation ready"
'@ | Set-Content -Encoding utf8 .github/workflows/ci.yml

@'
## Summary

## Related Issue

Closes #

## Changes

-

## Testing

- [ ] Lint
- [ ] Typecheck
- [ ] Tests
- [ ] Manual QA

## Security

- [ ] No secrets added
- [ ] Authorization considered
- [ ] User input validated

## Checklist

- [ ] Scope matches issue
- [ ] No unrelated refactors
- [ ] Documentation updated
- [ ] Ready for review
'@ | Set-Content -Encoding utf8 .github/PULL_REQUEST_TEMPLATE.md

# ------------------------------------------------------------
# Git
# ------------------------------------------------------------

Write-Host "`nCreating initial commit..." -ForegroundColor Yellow

git add .

if (git status --porcelain) {
    git commit -m "chore: initialize repository foundation"
    git push origin main
}
else {
    Write-Host "No changes to commit." -ForegroundColor DarkYellow
}

# ------------------------------------------------------------
# Develop branch
# ------------------------------------------------------------

Write-Host "`nCreating develop branch..." -ForegroundColor Yellow

$develop = git ls-remote --heads origin develop

if (-not $develop) {
    git checkout -b develop
    git push -u origin develop
}
else {
    git checkout develop
}

# ------------------------------------------------------------
# GitHub labels
# ------------------------------------------------------------

Write-Host "`nCreating labels..." -ForegroundColor Yellow

$labels = @(
    @("feature", "1D76DB", "New feature"),
    @("bug", "D73A4A", "Bug"),
    @("task", "5319E7", "Engineering task"),
    @("documentation", "0075CA", "Documentation"),
    @("security", "B60205", "Security"),
    @("infrastructure", "0E8A16", "Infrastructure"),
    @("frontend", "C5DEF5", "Frontend"),
    @("backend", "BFDADC", "Backend"),
    @("ai", "D4C5F9", "AI"),
    @("database", "F9D0C4", "Database"),
    @("testing", "B60205", "Testing"),
    @("P0-critical", "B60205", "Critical"),
    @("P1-high", "D93F0B", "High priority"),
    @("P2-medium", "FBCA04", "Medium priority"),
    @("P3-low", "0E8A16", "Low priority")
)

foreach ($label in $labels) {
    gh label create $label[0] `
        --repo $Repo `
        --color $label[1] `
        --description $label[2] `
        --force 2>$null
}

# ------------------------------------------------------------
# Milestone
# ------------------------------------------------------------

Write-Host "`nCreating M0 milestone..." -ForegroundColor Yellow

$milestones = gh api "repos/$Repo/milestones?state=all" | ConvertFrom-Json
$m0 = $milestones | Where-Object { $_.title -eq "M0 - Foundation" }

if (-not $m0) {
    gh api "repos/$Repo/milestones" `
        --method POST `
        -f title="M0 - Foundation" `
        -f description="Repository, development environment, architecture, database, CI, testing and security foundation."
}

$m0 = (gh api "repos/$Repo/milestones?state=all" | ConvertFrom-Json) |
    Where-Object { $_.title -eq "M0 - Foundation" }

$Milestone = $m0.number

# ------------------------------------------------------------
# Issues
# ------------------------------------------------------------

Write-Host "`nCreating M0 issues..." -ForegroundColor Yellow

$Issues = @(
    @{
        Title = "M0-001 - Repository standards & development workflow"
        Labels = "task,documentation,P0-critical"
        Body = @'
## Goal

Establish the engineering workflow.

## Acceptance Criteria

- [ ] CONTRIBUTING.md exists
- [ ] PR template exists
- [ ] Issue templates exist
- [ ] Branch strategy documented
- [ ] Definition of Done documented

## Owner

Both developers
'@
    },
    @{
        Title = "M0-002 - Docker development environment"
        Labels = "infrastructure,devops,P0-critical"
        Body = @'
## Goal

Create a reproducible local development environment.

## Requirements

- Next.js
- PostgreSQL
- Redis
- Environment configuration

## Acceptance Criteria

- [ ] docker compose up works
- [ ] Application starts
- [ ] PostgreSQL starts
- [ ] Redis starts
- [ ] No secrets committed

## Owner

Backend
'@
    },
    @{
        Title = "M0-003 - Next.js application foundation"
        Labels = "task,frontend,P0-critical"
        Body = @'
## Goal

Create the base Next.js TypeScript application.

## Requirements

- Next.js
- TypeScript
- Tailwind CSS
- Base layout
- Error/loading foundations

## Acceptance Criteria

- [ ] Application starts
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Base route renders

## Owner

Frontend
'@
    },
    @{
        Title = "M0-004 - PostgreSQL database foundation"
        Labels = "database,backend,P0-critical"
        Body = @'
## Goal

Establish the database and migration workflow.

## Initial entities

- users
- characters
- conversations
- messages
- memories
- usage

## Acceptance Criteria

- [ ] Database connection works
- [ ] ORM configured
- [ ] Migrations work
- [ ] Clean database migration works

## Owner

Backend
'@
    },
    @{
        Title = "M0-005 - Testing foundation"
        Labels = "testing,P1-high"
        Body = @'
## Goal

Establish automated testing.

## Acceptance Criteria

- [ ] Test runner configured
- [ ] Example test exists
- [ ] Tests run locally
- [ ] Tests run in CI
- [ ] Test failure fails CI

## Owner

Both developers
'@
    },
    @{
        Title = "M0-006 - GitHub Actions CI"
        Labels = "devops,infrastructure,P0-critical"
        Body = @'
## Goal

Prevent broken code from being merged.

## Required checks

- install
- lint
- typecheck
- tests
- build

## Acceptance Criteria

- [ ] CI runs on PRs
- [ ] CI runs on main/develop
- [ ] Failures are visible

## Owner

Backend
'@
    },
    @{
        Title = "M0-007 - Security and secrets standards"
        Labels = "security,documentation,P0-critical"
        Body = @'
## Goal

Establish baseline security standards.

## Requirements

- Environment variables
- Server-side AI credentials
- Input validation
- Authorization
- Safe logging

## Acceptance Criteria

- [ ] Security documentation exists
- [ ] Secrets are not committed
- [ ] OpenRouter key stays server-side
- [ ] Sensitive logging rules documented

## Owner

Both developers
'@
    },
    @{
        Title = "M0-008 - AI gateway architecture"
        Labels = "ai,backend,P1-high"
        Body = @'
## Goal

Define the internal AI abstraction before chat development.

## Requirements

- OpenRouter boundary
- Streaming
- Primary model
- Fallback models
- Token usage
- Cost tracking
- Error handling

## Acceptance Criteria

- [ ] AI architecture documented
- [ ] Model configuration centralized
- [ ] Fallback strategy documented
- [ ] Token/cost strategy documented

## Owner

Backend
'@
    },
    @{
        Title = "M0-009 - Architecture review and vertical slice"
        Labels = "task,documentation,P1-high"
        Body = @'
## Goal

Review the foundation and define the first end-to-end product slice.

## First vertical slice

Login
-> Character
-> Character profile
-> Chat
-> OpenRouter
-> Streaming
-> Persist message

## Acceptance Criteria

- [ ] Architecture reviewed
- [ ] Vertical slice agreed
- [ ] Dependencies identified
- [ ] Next milestone boundaries understood

## Owner

Both developers
'@
    }
)

foreach ($Issue in $Issues) {

    $existing = gh issue list `
        --repo $Repo `
        --search "$($Issue.Title) in:title" `
        --json title `
        --jq ".[].title"

    if (-not ($existing -contains $Issue.Title)) {

        gh issue create `
            --repo $Repo `
            --title $Issue.Title `
            --body $Issue.Body `
            --label $Issue.Labels `
            --milestone $Milestone
    }
    else {
        Write-Host "Already exists: $($Issue.Title)" -ForegroundColor DarkYellow
    }
}

# ------------------------------------------------------------
# Finish
# ------------------------------------------------------------

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " M0 BOOTSTRAP COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Repository: $Repo"
Write-Host "Milestone: M0 - Foundation"
Write-Host "Branch: develop"
Write-Host ""

Write-Host "Recommended next work:" -ForegroundColor Cyan
Write-Host "  Backend -> M0-002 Docker"
Write-Host "  Frontend -> M0-003 Next.js foundation"
Write-Host ""

Write-Host "Run:"
Write-Host "  gh issue list --repo $Repo"
