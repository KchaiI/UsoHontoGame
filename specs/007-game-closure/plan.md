# Implementation Plan: Game Closure Management

**Branch**: `007-game-closure` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-game-closure/spec.md`

## Summary

Enable moderators to close active games (出題中 → 締切), prevent new participants from joining closed games, display final results on dashboard, and show closed games on TOP page with status filtering.

**Technical Approach**: Leverage existing `Game.close()` method and `GameStatus` value object. Add CloseGame use case, update repository queries to include closed games, modify dashboard to detect closed state and stop polling, update TOP page with status filter UI.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode), Node.js 20
**Primary Dependencies**: Next.js 16.0.1 (App Router), React 19.2.0, Prisma 6.19.0, Zod 4.1.12, Tailwind CSS v4
**Storage**: SQLite via Prisma (file: `prisma/dev.db`)
**Testing**: Vitest 4.0.7, Playwright 1.56.1, React Testing Library
**Target Platform**: Web (modern browsers)
**Project Type**: Full-stack web application (Next.js App Router)
**Performance Goals**: Game closure < 5 seconds, dashboard polling stops immediately on closure
**Constraints**: Session-based authentication via cookies, clean architecture with domain-driven design
**Scale/Scope**: Party game for small groups (1-100 players per game)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| 0. Git commit and Code Formatting | ✅ Pass | Will run Biome format before each commit |
| I. Clean Architecture | ✅ Pass | Use CloseGame use case in Application Layer |
| II. Component Architecture | ✅ Pass | Status filter in UI layer, game logic in domain components |
| III. Custom Hooks Architecture | ✅ Pass | useGameClosure hook for close action, useStatusFilter for filter |
| IV. Test-Driven Development | ✅ Pass | TDD for use cases, hooks, and components |
| V. Type Safety | ✅ Pass | Strict mode enabled, Zod validation at boundaries |
| VI. Documentation Standards | ✅ Pass | Spec has prioritized user stories with acceptance criteria |
| VII. Server Components First | ✅ Pass | Server actions for mutations, client hooks where needed |

**Gate Result**: PASS - No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/007-game-closure/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/                              # Next.js App Router
│   ├── actions/
│   │   └── game.ts                   # Add closeGame server action
│   ├── games/[id]/
│   │   └── page.tsx                  # Add close button for moderator
│   │   └── answer/
│   │       └── page.tsx              # Handle closed game redirect/error
│   └── page.tsx                      # TOP page with status filter
├── components/
│   ├── domain/
│   │   └── game/
│   │       ├── ActiveGameCard.tsx    # Add status badge, disable answer button
│   │       ├── GameStatusFilter.tsx  # NEW: Status filter component
│   │       └── CloseGameButton.tsx   # NEW: Close game button with confirmation
│   └── pages/
│       ├── TopPage/
│       │   └── hooks/
│       │       └── useStatusFilter.ts  # NEW: Filter state management
│       ├── GameDetailPage/
│       │   └── hooks/
│       │       └── useCloseGame.ts     # NEW: Close game action hook
│       └── ResponseStatusPage/
│           └── hooks/
│               └── useResponseStatus.ts  # Modify to detect closed state
├── server/
│   ├── application/
│   │   └── use-cases/
│   │       └── games/
│   │           └── CloseGame.ts        # NEW: Close game use case
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Game.ts                 # Already has close() method
│   │   └── value-objects/
│   │       └── GameStatus.ts           # Already supports '締切'
│   └── infrastructure/
│       └── repositories/
│           └── PrismaGameRepository.ts # Add findActiveAndClosedGames
└── types/
    └── game.ts                         # Add status filter types

tests/
├── e2e/
│   └── game-closure.spec.ts           # E2E tests for closure flow
└── integration/
    └── game-closure.test.ts           # Integration tests
```

**Structure Decision**: Follows existing Next.js App Router structure with Clean Architecture. New components follow established patterns from 005-top-active-games and 006-results-dashboard features.

## Complexity Tracking

No constitution violations - no complexity tracking needed.
