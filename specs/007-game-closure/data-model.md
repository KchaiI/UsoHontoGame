# Data Model: Game Closure Management

**Feature**: 007-game-closure
**Date**: 2025-11-25

## Overview

This feature does not require database schema changes. The existing `Game` model already supports the "締切" status. This document describes how existing entities are used and extended for game closure functionality.

## Existing Entities (No Changes Required)

### Game Entity

**Location**: `src/server/domain/entities/Game.ts`

| Field | Type | Description |
|-------|------|-------------|
| id | GameId | Unique identifier (UUID) |
| name | string \| null | Game display name |
| status | GameStatus | Current status: "準備中" \| "出題中" \| "締切" |
| maxPlayers | number | Maximum player limit (1-100) |
| currentPlayers | number | Current player count |
| creatorId | string | Session ID of moderator |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp (serves as closedAt) |

**Status Transitions**:
```
準備中 (Preparation) → 出題中 (Accepting) → 締切 (Closed)
```

**Relevant Methods**:
- `close()`: Transitions from 出題中 to 締切
- `isClosed()`: Returns true if status is 締切 (via GameStatus)
- `isAcceptingResponses()`: Returns true if status is 出題中

### GameStatus Value Object

**Location**: `src/server/domain/value-objects/GameStatus.ts`

| Value | Japanese | Description |
|-------|----------|-------------|
| 準備中 | Preparation | Game setup phase, can edit settings |
| 出題中 | Accepting | Game active, accepting answers |
| 締切 | Closed | Game ended, no more answers accepted |

**Type Definition**:
```typescript
type GameStatusValue = '準備中' | '出題中' | '締切';
```

### Prisma Schema (No Changes)

**Location**: `prisma/schema.prisma`

```prisma
model Game {
  id              String          @id @default(uuid())
  name            String?
  creatorId       String
  maxPlayers      Int
  currentPlayers  Int             @default(0)
  status          String          @default("準備中") // Already supports 締切
  presenters      Presenter[]
  answers         Answer[]
  participations  Participation[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt  // Used as closedAt

  @@index([creatorId])
  @@index([status])  // Index supports filtering by status
}
```

## New Types (TypeScript Only)

### Status Filter Type

**Location**: `src/types/game.ts`

```typescript
/**
 * Status filter options for TOP page
 * Feature: 007-game-closure
 */
export type GameStatusFilter = '出題中' | '締切' | 'すべて';

/**
 * Game list item with status information
 * Extended from ActiveGameListItem
 */
export interface GameListItemWithStatus extends ActiveGameListItem {
  /** Current game status */
  status: '出題中' | '締切';
}
```

### Close Game Response

**Location**: `src/server/application/use-cases/games/CloseGame.ts`

```typescript
/**
 * Result of closing a game
 */
export interface CloseGameResult {
  success: boolean;
  error?: string;
  game?: {
    id: string;
    status: string;
    closedAt: string; // ISO timestamp from updatedAt
  };
}
```

## Repository Changes

### IGameRepository Interface

**Location**: `src/server/domain/repositories/IGameRepository.ts`

Add new method:

```typescript
/**
 * Find active and closed games with pagination
 * @param params Pagination and filter parameters
 * @returns Games matching filter with pagination metadata
 */
findGamesWithStatusFilter(params: {
  limit: number;
  skip: number;
  statusFilter: '出題中' | '締切' | 'すべて';
}): Promise<{
  games: Array<{
    id: string;
    title: string;
    createdAt: Date;
    playerCount: number;
    playerLimit: number | null;
    creatorId: string;
    status: '出題中' | '締切';
  }>;
  total: number;
}>;
```

### PrismaGameRepository Implementation

**Location**: `src/server/infrastructure/repositories/PrismaGameRepository.ts`

```typescript
async findGamesWithStatusFilter(params: {
  limit: number;
  skip: number;
  statusFilter: '出題中' | '締切' | 'すべて';
}): Promise<{
  games: Array<{
    id: string;
    title: string;
    createdAt: Date;
    playerCount: number;
    playerLimit: number | null;
    creatorId: string;
    status: '出題中' | '締切';
  }>;
  total: number;
}> {
  const statusCondition = params.statusFilter === 'すべて'
    ? { status: { in: ['出題中', '締切'] } }
    : { status: params.statusFilter };

  const games = await this.prisma.game.findMany({
    where: statusCondition,
    orderBy: { createdAt: 'desc' },
    take: params.limit,
    skip: params.skip,
    include: {
      _count: {
        select: { participations: true },
      },
    },
  });

  const total = await this.prisma.game.count({
    where: statusCondition,
  });

  return {
    games: games.map((game) => ({
      id: game.id,
      title: game.name || 'Untitled Game',
      createdAt: game.createdAt,
      playerCount: game._count.participations,
      playerLimit: game.maxPlayers,
      creatorId: game.creatorId,
      status: game.status as '出題中' | '締切',
    })),
    total,
  };
}
```

## State Diagram

```
┌──────────┐     startAccepting()    ┌──────────┐      close()      ┌──────────┐
│  準備中   │ ─────────────────────> │   出題中  │ ───────────────> │   締切    │
│(Preparing)│                        │(Accepting)│                  │ (Closed) │
└──────────┘                         └──────────┘                   └──────────┘
     │                                    │                              │
     │ Can edit settings                  │ Accepts answers              │ Read-only
     │ Can add presenters                 │ Shows on TOP page            │ Shows on TOP page
     │ Not on TOP page                    │ Dashboard shows progress     │ Dashboard shows final results
     └────────────────────────────────────┴──────────────────────────────┘

                        One-way transitions only
```

## Validation Rules

### Close Game Validation

1. **Status Check**: Game must be in "出題中" status
2. **Authorization**: Only game creator (creatorId === sessionId) can close
3. **No Participant Minimum**: Games can be closed with 0 participants (shows warning)

### Answer Submission Validation (Existing)

Already enforced in `SubmitAnswers` use case:
- Game status must be "出題中" to accept submissions
- Closed games return error: "このゲームは締め切られています"

## Impact Analysis

| Component | Impact | Change Type |
|-----------|--------|-------------|
| Prisma Schema | None | No change |
| Game Entity | None | Already has close() method |
| GameStatus | None | Already supports 締切 |
| IGameRepository | Minor | Add findGamesWithStatusFilter |
| PrismaGameRepository | Minor | Implement findGamesWithStatusFilter |
| Type definitions | Minor | Add GameStatusFilter type |
