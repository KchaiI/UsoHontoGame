# Implementation Plan: Simplify Screen Flow

**Branch**: `003-simplify-screen-flow` | **Date**: 2025-11-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-simplify-screen-flow/spec.md`

## Summary

This feature simplifies the application's navigation by removing all existing page routes except JoinPage and GameCreatePage, implementing a focused linear workflow: **JoinPage → GameCreatePage → JoinPage**. This refactoring reduces cognitive load and creates a streamlined game creation experience.

**Technical Approach**: Remove unnecessary page routes and components while preserving the core game creation workflow. Implement proper redirects for removed routes and ensure session state management works across the simplified navigation flow.

## Technical Context

**Language/Version**: TypeScript 5 with strict mode
**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS v4
**Storage**: In-memory (existing session storage, no changes required)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web application (Next.js SSR + CSR)
**Project Type**: Web application (Next.js monorepo structure)
**Performance Goals**: Page navigation < 200ms, no degradation from current baseline
**Constraints**: Must not break existing game creation functionality, zero data loss during transition
**Scale/Scope**: Remove 5 page routes, preserve 2 page routes + all backend APIs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Clean Architecture Compliance ✅
- **Status**: PASS
- **Rationale**: This is a presentation layer refactoring. Backend Clean Architecture (Domain, Application, Infrastructure layers) remains unchanged.
- **Action**: Remove frontend routes only. Preserve all use cases, entities, and repositories.

### Component Architecture Compliance ✅
- **Status**: PASS
- **Rationale**: Follows three-layer hierarchy. Removing unused Pages layer components while preserving JoinPage and CreatePage.
- **Action**: Delete unused page components. Preserve domain and UI components that may be reused.

### Custom Hooks Architecture Compliance ✅
- **Status**: PASS
- **Rationale**: Existing hooks (useGameCreation, useHostAccess, useToast) remain unchanged. No new hooks required.
- **Action**: Verify hooks still function correctly after route removal.

### Test-Driven Development Compliance ✅
- **Status**: PASS
- **Rationale**: Follow TDD approach for new redirect handling and error boundaries.
- **Action**:
  1. Write tests for redirect behavior (removed routes → JoinPage)
  2. Write tests for navigation flow (Join → Create → Join)
  3. Update existing tests that reference removed routes

### Type Safety Compliance ✅
- **Status**: PASS
- **Rationale**: TypeScript strict mode enabled. No new types required, existing types remain valid.
- **Action**: Verify type safety after route removal. Update route type definitions if needed.

### Documentation Standards Compliance ✅
- **Status**: PASS
- **Rationale**: Feature specification created in `specs/003-simplify-screen-flow/`. Implementation plan follows constitution.
- **Action**: Document which routes are removed and why in this plan.

### Server Components First Compliance ✅
- **Status**: PASS
- **Rationale**: JoinPage and CreatePage already follow Server Components pattern appropriately.
- **Action**: No changes to server/client component boundaries required.

**Overall Status**: ✅ **ALL GATES PASSED** - No violations. Feature aligns with all constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/003-simplify-screen-flow/
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
├── app/                           # Next.js App Router
│   ├── (pages)/
│   │   ├── page.tsx              # Root page (KEEP - redirects to /join)
│   │   └── join/
│   │       └── page.tsx          # ✅ KEEP - JoinPage route
│   ├── (host)/
│   │   ├── create/
│   │   │   └── page.tsx          # ✅ KEEP - GameCreatePage route
│   │   ├── host/[sessionId]/     # ❌ REMOVE - host management
│   │   └── manage/[sessionId]/   # ❌ REMOVE - host management
│   ├── (game)/
│   │   ├── game/[id]/            # ❌ REMOVE - game play page
│   │   └── results/[sessionId]/  # ❌ REMOVE - results page
│   ├── api/                       # ✅ KEEP ALL - Backend APIs unchanged
│   └── not-found.tsx              # ✅ KEEP - 404 handling
├── components/
│   ├── pages/
│   │   ├── JoinPage/             # ✅ KEEP
│   │   ├── CreatePage/           # ✅ KEEP
│   │   ├── GamePage/             # ❌ REMOVE
│   │   ├── HostManagementPage/   # ❌ REMOVE
│   │   └── ResultsPage/          # ❌ REMOVE
│   ├── domain/                    # ✅ KEEP ALL - may be reused
│   └── ui/                        # ✅ KEEP ALL - reusable components
├── hooks/                         # ✅ KEEP ALL - logic remains valid
├── server/                        # ✅ KEEP ALL - backend unchanged
└── types/                         # ✅ KEEP ALL - types remain valid

tests/
├── unit/
│   ├── hooks/                     # ✅ UPDATE - verify hooks still work
│   └── components/                # ✅ UPDATE - remove tests for deleted pages
├── integration/
│   └── api/                       # ✅ KEEP ALL - backend unchanged
└── e2e/                           # ✅ UPDATE - update navigation flows
```

**Structure Decision**: Web application structure using Next.js App Router. This is a refactoring task focusing on the presentation layer (routes and page components). All backend code (API routes, use cases, entities, repositories) remains unchanged. Only frontend routes and page components are modified.

## Complexity Tracking

> No violations of constitution principles. This section is not applicable.

## Phase 0: Research & Technical Decisions

### Research Tasks

1. **Next.js Route Removal Best Practices**
   - How to properly remove App Router routes
   - How to handle dynamic routes cleanup
   - How to prevent broken links and 404 errors

2. **Redirect Strategy**
   - Best approach for redirecting removed routes to JoinPage
   - Client-side vs server-side redirect performance
   - SEO implications of redirects

3. **Session State Preservation**
   - Verify session state persists across route changes
   - Confirm useGameCreation hook works after simplification
   - Test cookie-based host auth still functions

4. **Test Migration Strategy**
   - Identify all tests that reference removed routes
   - Determine which tests can be deleted vs updated
   - Ensure test coverage doesn't drop below current baseline

**Output**: `research.md` with decisions on redirect approach, cleanup strategy, and test migration plan.

## Phase 1: Design Artifacts

### Data Model
**File**: `data-model.md`

No new entities required. Document that existing entities remain unchanged:
- GameSession (from backend)
- Navigation State (implicit, managed by Next.js router)

### API Contracts
**Directory**: `contracts/`

No API changes required. Document that all existing API endpoints remain functional:
- POST /api/sessions-v2 (game creation)
- GET /api/sessions/[id]/host-access (host verification)
- All other existing endpoints preserved

### Quick Start Guide
**File**: `quickstart.md`

Document the new simplified user flow:
1. User lands on JoinPage (/)
2. User clicks "Create Game" → navigates to /create
3. User fills form and submits → returns to JoinPage with session ID
4. User can now join the game they created

Include navigation diagram and key components involved.

## Implementation Phases

### Phase 1: Route Removal & Cleanup
**Priority**: P1 - Foundation
**Duration**: 1-2 hours

**Tasks**:
1. Remove unused page routes:
   - Delete `/app/(game)/game/[id]/page.tsx`
   - Delete `/app/(game)/results/[sessionId]/page.tsx`
   - Delete `/app/(host)/host/[sessionId]/page.tsx`
   - Delete `/app/(host)/manage/[sessionId]/page.tsx`

2. Remove unused page components:
   - Delete `/components/pages/GamePage/`
   - Delete `/components/pages/ResultsPage/`
   - Delete `/components/pages/HostManagementPage/`

3. Update root page to redirect to /join

**Tests**:
- Verify removed routes return 404 or redirect
- Verify JoinPage and CreatePage still accessible
- Verify no broken imports or type errors

### Phase 2: Redirect Implementation
**Priority**: P1 - Core functionality
**Duration**: 1 hour

**Tasks**:
1. Implement catch-all redirect for removed routes
2. Add not-found.tsx with redirect to JoinPage
3. Update navigation links to remove references to deleted pages

**Tests**:
- Test direct navigation to removed URLs → redirects to /join
- Test navigation flow: Join → Create → Join works correctly
- Test session state persists across redirects

### Phase 3: Test Updates
**Priority**: P1 - Quality assurance
**Duration**: 1-2 hours

**Tasks**:
1. Remove tests for deleted page components
2. Update e2e tests to reflect new navigation flow
3. Verify all remaining tests pass
4. Run full test suite to ensure no regressions

**Tests**:
- All unit tests pass (hooks, components)
- All integration tests pass (API endpoints)
- All e2e tests pass (updated navigation flows)
- Test coverage ≥ current baseline

### Phase 4: Documentation & Cleanup
**Priority**: P2 - Polish
**Duration**: 30 minutes

**Tasks**:
1. Update README if it references removed pages
2. Update any documentation that shows navigation flows
3. Clean up unused imports and dependencies
4. Verify build succeeds with no warnings

**Tests**:
- Production build succeeds
- No TypeScript errors
- No unused imports or dependencies
