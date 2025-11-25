# Research: Game Closure Management

**Feature**: 007-game-closure
**Date**: 2025-11-25

## Overview

This document captures research findings and decisions for implementing game closure functionality.

## Decision Log

### D1: Leverage Existing Domain Model

**Decision**: Use existing `Game.close()` method and `GameStatus` value object.

**Rationale**:
- `GameStatus` already includes "締切" as a valid status
- `Game.close()` method already implements the status transition with validation
- No database schema changes needed - status field already supports the value

**Alternatives Considered**:
- Adding new `closedAt` timestamp field: Rejected - `updatedAt` is sufficient for tracking when closure occurred
- Creating separate GameClosure entity: Rejected - overcomplicated for simple status change

### D2: Server Action for Closure

**Decision**: Implement `closeGame` as a Next.js Server Action in `src/app/actions/game.ts`.

**Rationale**:
- Follows existing pattern used by `startGame`, `updateGame` server actions
- Server actions provide automatic form handling and optimistic updates
- Clean integration with React's useTransition for loading states

**Alternatives Considered**:
- API route: Rejected - Server actions are preferred for mutations in Next.js 16 App Router
- Direct database call: Rejected - violates clean architecture principles

### D3: Status Filter Implementation

**Decision**: Client-side filtering with URL query parameter.

**Rationale**:
- Simple implementation with React state
- URL parameter enables shareable filtered views
- No backend changes needed - already fetching all relevant games
- Small dataset (party games) doesn't require pagination optimization

**Alternatives Considered**:
- Server-side filtering with new endpoint: Rejected - adds complexity without benefit for small dataset
- Local storage persistence: Rejected - URL params are simpler and shareable

### D4: Dashboard Polling Behavior

**Decision**: Stop polling when `gameStatus === '締切'` is detected in response.

**Rationale**:
- Dashboard already has polling mechanism in `useResponseStatus` hook
- Simply add status check to determine if polling should continue
- No additional API calls needed

**Alternatives Considered**:
- WebSocket notification: Rejected - over-engineered for this use case
- Separate polling status endpoint: Rejected - response status already includes game info

### D5: Confirmation Dialog Pattern

**Decision**: Use browser's native `window.confirm()` for closure confirmation.

**Rationale**:
- Simple and universally understood UX pattern
- No additional UI component library needed
- Matches existing patterns in codebase (delete confirmation)

**Alternatives Considered**:
- Custom modal component: Rejected - adds complexity without significant UX benefit
- Toast with undo: Rejected - one-way status transition makes undo impractical

### D6: Disabled Button Styling

**Decision**: Use Tailwind's `disabled:` variant with opacity and cursor styling.

**Rationale**:
- Consistent with existing Tailwind CSS v4 usage
- Standard `disabled` attribute provides accessibility
- Visual feedback (greyed out) matches clarification answer

**Implementation**:
```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
disabled={game.status === '締切'}
```

## Existing Code Analysis

### GameStatus Value Object
Location: `src/server/domain/value-objects/GameStatus.ts`
- Already has `isClosed()` method returning `this._value === '締切'`
- Static factory `GameStatus.closed()` exists

### Game Entity
Location: `src/server/domain/entities/Game.ts`
- `close()` method validates transition from 出題中 → 締切
- Throws `InvalidStatusTransitionError` for invalid transitions
- Updates `updatedAt` timestamp on status change

### Repository Interface
Location: `src/server/domain/repositories/IGameRepository.ts`
- `findActiveGamesWithPagination` currently filters only "出題中" games
- Need to add method for fetching both active and closed games

### Answer Submission Validation
Location: `src/server/application/use-cases/answers/SubmitAnswers.ts`
- Already validates game status before accepting submission
- Will reject closed games with appropriate error

## No Clarifications Needed

All technical decisions could be made based on:
- Existing codebase patterns
- Feature specification requirements
- Clarification session answers

No external research or additional clarification required.
