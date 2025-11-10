# Tasks: Simplify Screen Flow

**Input**: Design documents from `/specs/003-simplify-screen-flow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: TDD approach - tests written first, implementation follows

**Organization**: Tasks organized by implementation phases with clear dependencies

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]**: User Story 1 - Simplified Game Creation Flow
- Include exact file paths in descriptions

## Path Conventions

Project uses Next.js App Router structure:
- Routes: `src/app/`
- Components: `src/components/`
- Tests: `tests/`

---

## Phase 1: Setup & Verification

**Purpose**: Verify existing functionality before making changes

- [X] T001 Verify current navigation works (manual test: / → /join → /create → /join)
- [X] T002 Run existing test suite to establish baseline (npm test)
- [X] T003 Document current test coverage metrics for comparison
- [X] T004 Clear Next.js build cache (rm -rf .next)

---

## Phase 2: Test Updates (TDD - Write Tests First)

**Purpose**: Update tests BEFORE making changes - tests should FAIL initially

### E2E Test Updates

- [X] T005 [US1] Update e2e navigation test in tests/e2e/game-flow.spec.ts to expect simplified flow
- [X] T006 [US1] Add e2e test for 404 behavior on removed routes in tests/e2e/game-flow.spec.ts
- [X] T007 [US1] Verify e2e tests FAIL (they reference removed routes) - this is expected

### Component Test Cleanup

- [X] T008 [P] [US1] Delete ResultsPage component tests in tests/component/pages/ResultsPage.test.tsx
- [X] T009 [P] [US1] Delete HostManagementPage component tests in tests/component/pages/HostManagementPage.test.tsx

### Integration Test Updates

- [X] T010 [US1] Update complete-player-journey test in tests/integration/complete-player-journey.test.ts (skip if file doesn't exist)
- [X] T011 [US1] Verify integration tests that reference /game or /results are updated or removed

---

## Phase 3: User Story 1 - Simplified Game Creation Flow (Priority: P1)

**Goal**: Remove unnecessary routes and implement linear navigation: JoinPage → CreatePage → JoinPage

**Independent Test**: Navigate /join → /create → submit form → redirected to /join with sessionId

### Route Removal

- [X] T012 [P] [US1] Delete game play route directory src/app/game/[id]/
- [X] T013 [P] [US1] Delete results route directory src/app/(game)/results/[sessionId]/
- [X] T014 [P] [US1] Delete host management route src/app/(host)/host/[sessionId]/
- [X] T015 [P] [US1] Delete manage route directory src/app/(host)/manage/[sessionId]/

### Component Removal

- [X] T016 [P] [US1] Delete GamePage component directory src/components/pages/GamePage/
- [X] T017 [P] [US1] Delete ResultsPage component directory src/components/pages/ResultsPage/
- [X] T018 [P] [US1] Delete HostManagementPage component directory src/components/pages/HostManagementPage/

### 404 Error Handling

- [X] T019 [US1] Create not-found.tsx at src/app/not-found.tsx with user-friendly 404 page
- [X] T020 [US1] Add "Go to Join Page" link in not-found.tsx pointing to /join
- [X] T021 [US1] Style not-found.tsx to match application design (Tailwind CSS)

### Root Page Update

- [X] T022 [US1] Verify root page src/app/page.tsx redirects or renders JoinPage correctly
- [X] T023 [US1] Update imports if any reference removed components

### Navigation Link Cleanup

- [X] T024 [US1] Search codebase for links to removed routes (grep -r "/game/" src/)
- [X] T025 [US1] Search codebase for links to /results (grep -r "/results" src/)
- [X] T026 [US1] Search codebase for links to /host or /manage (grep -r "/host\|/manage" src/)
- [X] T027 [US1] Remove or update any found links to removed routes

**Checkpoint**: Removed routes should return 404, preserved routes should still work

---

## Phase 4: Build & Test Verification

**Purpose**: Ensure changes don't break existing functionality

- [X] T028 [US1] Clear Next.js cache again (rm -rf .next)
- [X] T029 [US1] Run TypeScript type checking (npx tsc --noEmit)
- [X] T030 [US1] Build production bundle (npm run build)
- [X] T031 [US1] Run full test suite (npm test)
- [X] T032 [US1] Verify test coverage meets or exceeds baseline from T003
- [X] T033 [US1] Run e2e tests (npm run test:e2e)
- [X] T034 [US1] Manual testing: verify JoinPage → CreatePage → JoinPage flow works

---

## Phase 5: Import Cleanup & Code Quality

**Purpose**: Remove dead code and fix any lingering references

- [X] T035 [P] [US1] Search for GamePage imports (grep -r "GamePage" src/)
- [X] T036 [P] [US1] Search for ResultsPage imports (grep -r "ResultsPage" src/)
- [X] T037 [P] [US1] Search for HostManagementPage imports (grep -r "HostManagementPage" src/)
- [X] T038 [US1] Remove unused imports found in T035-T037
- [X] T039 [US1] Run linter to catch any issues (npm run lint)
- [X] T040 [US1] Format code if needed (npm run format or npx biome check --write)

---

## Phase 6: Documentation & Polish

**Purpose**: Update documentation and finalize implementation

- [X] T041 [P] [US1] Update README.md if it references removed routes (if file exists)
- [X] T042 [P] [US1] Update any architecture diagrams showing old navigation flow
- [X] T043 [US1] Add migration notes documenting removed routes and their removal date
- [X] T044 [US1] Final build verification (npm run build)
- [X] T045 [US1] Final test run (npm test && npm run test:e2e)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1: Setup** → Must complete first (baseline establishment)
2. **Phase 2: Test Updates** → Depends on Phase 1 (TDD - tests written first)
3. **Phase 3: Implementation** → Depends on Phase 2 (tests guide implementation)
4. **Phase 4: Verification** → Depends on Phase 3 (validate implementation)
5. **Phase 5: Cleanup** → Depends on Phase 4 (build must pass first)
6. **Phase 6: Documentation** → Depends on Phase 5 (finalization)

### Within Phase 3 (Implementation)

**Sequential dependencies**:
- Route/component removal (T012-T018) must complete before 404 handling (T019-T021)
- 404 handling must complete before navigation cleanup (T024-T027)

**Parallel opportunities**:
- T012-T015: Route deletions can run in parallel (different directories)
- T016-T018: Component deletions can run in parallel (different directories)
- T024-T026: Search tasks can run in parallel (different patterns)
- T035-T037: Import search tasks can run in parallel (different patterns)
- T041-T042: Documentation updates can run in parallel (different files)

### Task File Conflicts (Must Run Sequentially)

- T019, T020, T021: All modify `src/app/not-found.tsx` → must run sequentially
- T022, T023: Both modify `src/app/page.tsx` → must run sequentially

---

## Parallel Example: Route Removal

```bash
# Launch all route deletions together:
Task T012: "Delete src/app/game/[id]/"
Task T013: "Delete src/app/(game)/results/[sessionId]/"
Task T014: "Delete src/app/(host)/host/[sessionId]/"
Task T015: "Delete src/app/(host)/manage/[sessionId]/"

# Then launch all component deletions together:
Task T016: "Delete src/components/pages/GamePage/"
Task T017: "Delete src/components/pages/ResultsPage/"
Task T018: "Delete src/components/pages/HostManagementPage/"
```

---

## Implementation Strategy

### Complete Implementation (All Phases)

1. **Phase 1**: Establish baseline (T001-T004)
2. **Phase 2**: Update tests to expect new behavior (T005-T011)
3. **Phase 3**: Remove routes and components (T012-T027)
4. **Phase 4**: Verify everything works (T028-T034)
5. **Phase 5**: Clean up imports and code (T035-T040)
6. **Phase 6**: Polish documentation (T041-T045)

### Validation Checkpoints

- **After Phase 1**: Baseline metrics captured, existing tests pass
- **After Phase 2**: Tests updated, currently FAILING (expected)
- **After Phase 3**: Tests now PASSING, removed routes return 404
- **After Phase 4**: Build succeeds, all tests pass, no regressions
- **After Phase 5**: Code is clean, no unused imports, linter passes
- **After Phase 6**: Documentation updated, implementation complete

---

## Testing Strategy

### Manual Testing Steps

**Test 1: Navigation Flow**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/`
3. ✅ Should redirect or show JoinPage
4. Click "Create Game" button
5. ✅ Should navigate to `/create`
6. Fill in episode form (at least one episode)
7. Submit form
8. ✅ Should redirect to `/join?sessionId=...`
9. ✅ Session ID should be visible on JoinPage

**Test 2: 404 Behavior**
1. Navigate to `http://localhost:3000/game/ABC123`
2. ✅ Should show 404 page
3. ✅ "Go to Join Page" link should be visible
4. Click link
5. ✅ Should navigate to `/join`

**Test 3: Cookie Persistence**
1. Complete Test 1 (game creation)
2. Open DevTools → Application → Cookies
3. ✅ Should see `game_host_{sessionId}` cookie
4. Refresh page
5. ✅ Cookie should still exist
6. ✅ Host controls should be visible (if implemented)

### Automated Testing

**Unit Tests**: No changes required (hooks and utilities unchanged)

**Integration Tests**: Updated in Phase 2
- API tests remain unchanged (backend untouched)
- User journey tests updated to reflect new flow

**E2E Tests**: Updated in Phase 2
- game-flow.spec.ts updated for simplified navigation
- New test added for 404 behavior

**Coverage Goal**: Maintain ≥ 83% code coverage (current baseline)

---

## Success Criteria

Checklist for implementation completion:

- [X] All 45 tasks completed successfully
- [X] All tests passing (unit, integration, e2e)
- [X] Production build succeeds with no errors
- [X] No TypeScript errors (pre-existing test errors unrelated to changes)
- [X] Linter passes with no critical issues (pre-existing warnings unrelated to changes)
- [X] Test coverage ≥ baseline (83%)
- [X] Manual testing: JoinPage → CreatePage → JoinPage flow works
- [X] Manual testing: Removed routes return 404
- [X] Manual testing: Session state persists across navigation
- [X] No broken imports or references to deleted components
- [X] Documentation updated

---

## Rollback Plan

If implementation fails at any phase:

1. **Git Revert**: Revert to commit before starting this feature
2. **Preserve Research**: Keep planning documents in specs/003-simplify-screen-flow/
3. **Report Issues**: Document what failed and why
4. **Retry**: Address issues and restart from Phase 1

---

## Notes

- **TDD Approach**: Tests updated FIRST (Phase 2), implementation follows (Phase 3)
- **No Backend Changes**: All backend APIs, entities, and use cases unchanged
- **Cookie System**: Existing cookie-based host authentication preserved
- **Zero Data Loss**: In-memory sessions unaffected by route removal
- **Incremental**: Each phase validates before moving to next
- **Reversible**: Git history preserves all deleted code if needed later

---

## Task Summary

**Total Tasks**: 45
**Parallel Tasks**: 13 (marked with [P])
**Sequential Tasks**: 32
**User Stories**: 1 (US1 - Simplified Game Creation Flow)
**Estimated Duration**: 4-6 hours total

**Phase Breakdown**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Test Updates): 7 tasks
- Phase 3 (Implementation): 16 tasks
- Phase 4 (Verification): 7 tasks
- Phase 5 (Cleanup): 6 tasks
- Phase 6 (Documentation): 5 tasks

**MVP Scope**: All phases required (this is a refactoring feature, not incremental)

---

**Generated**: 2025-11-10
**Feature**: 003-simplify-screen-flow
**Related Docs**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)
