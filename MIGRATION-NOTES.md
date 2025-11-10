# Migration Notes - Simplify Screen Flow

**Feature**: 003-simplify-screen-flow
**Date**: 2025-11-10
**Branch**: 003-simplify-screen-flow

## Overview

This migration simplifies the application's navigation flow by removing unnecessary page routes and focusing on the core game creation workflow.

## Removed Routes

The following routes have been removed and will now return 404:

| Route | Component | Removal Date | Reason |
|-------|-----------|--------------|---------|
| `/game/[id]` | GamePage | 2025-11-10 | Game play functionality removed |
| `/results/[sessionId]` | ResultsPage | 2025-11-10 | Results display functionality removed |
| `/host/[sessionId]` | HostManagementPage | 2025-11-10 | Host management UI removed |
| `/manage/[sessionId]` | HostManagementPage | 2025-11-10 | Alternative host management UI removed |

## Removed Components

The following React components have been deleted:

- `/src/components/pages/GamePage/`
- `/src/components/pages/ResultsPage/`
- `/src/components/pages/HostManagementPage/`

## Preserved Routes

The following routes remain functional:

- `/` (Root) - Redirects to JoinPage
- `/join` - JoinPage for game creation and joining
- `/create` - CreatePage for setting up game episodes
- All API routes in `/api/**` - Backend unchanged

## New Navigation Flow

**Before:**
```
JoinPage → (Complex flow with multiple pages)
```

**After (Simplified):**
```
JoinPage → CreatePage → JoinPage (with sessionId)
```

### Detailed Flow:

1. User lands on `/` (root) → Renders JoinPage
2. User clicks "Create Game" → Navigates to `/create`
3. User fills in episode form → Submits
4. API creates session → Sets host cookie → Returns sessionId
5. User redirected to `/join?sessionId=ABC123`
6. JoinPage shows session info with host badge

## Breaking Changes

### Navigation

- **Old behavior**: Creating a game navigated to `/game/[id]`
- **New behavior**: Creating a game navigates to `/join?sessionId=[id]`

- **Old behavior**: HostLink pointed to `/host/[sessionId]`
- **New behavior**: HostLink shows a host badge instead (no navigation)

### 404 Page

- **New**: Custom 404 page at `/src/app/not-found.tsx`
- **Behavior**: Shows friendly message with link back to `/join`
- **Status**: Returns HTTP 404 status code

## Updated Components

### HostLink Component

**Location**: `/src/components/domain/host/HostLink/index.tsx`

**Old behavior**: Linked to `/host/[sessionId]` host management page

**New behavior**: Shows a host badge (no link) since host management page is removed

```tsx
// Old
<Link href={`/host/${sessionId}`}>ホスト管理画面へ</Link>

// New
<div className="...">👑 ホスト</div>
```

### useJoinPage Hook

**Location**: `/src/components/pages/JoinPage/hooks/useJoinPage.ts`

**Changed behavior**:
- `handleCreateSession()`: Now navigates to `/create` instead of creating session directly
- `handleJoinSession()`: Stays on join page after joining (no navigation to `/game/`)

## Backend (No Changes)

All backend APIs, entities, use cases, and repositories remain **completely unchanged**:

- ✅ POST `/api/sessions-v2` - Game creation API
- ✅ GET `/api/sessions/[id]/host-access` - Host verification API
- ✅ All other API endpoints preserved
- ✅ In-memory session storage unchanged
- ✅ Cookie-based authentication unchanged

## Testing Updates

### E2E Tests

**File**: `/tests/e2e/game-flow.spec.ts`

**Changes**: Completely rewritten to test simplified navigation flow
- Added tests for 404 behavior on removed routes
- Updated navigation expectations
- Added tests for 404 page link back to join

### Component Tests

**Deleted**:
- `/tests/component/pages/ResultsPage.test.tsx`
- `/tests/component/pages/HostManagementPage.test.tsx`

**Reason**: Components no longer exist

### Integration Tests

**No changes required** - All integration tests focus on backend APIs which remain unchanged

## Migration Checklist for Users

If you have bookmarks or links to old routes:

- [ ] Update bookmarks pointing to `/game/*` → Use `/join` instead
- [ ] Update bookmarks pointing to `/results/*` → Use `/join` instead
- [ ] Update bookmarks pointing to `/host/*` or `/manage/*` → Use `/join` instead
- [ ] Clear browser cache to remove old route data

## Rollback Instructions

If you need to revert this change:

```bash
# Revert to the commit before this feature branch
git revert <commit-hash>

# Or checkout the previous branch
git checkout main
git pull origin main
```

All deleted code is preserved in git history and can be recovered if needed.

## Questions & Support

For questions about this migration:

1. Review the feature specification: `/specs/003-simplify-screen-flow/spec.md`
2. Check the implementation plan: `/specs/003-simplify-screen-flow/plan.md`
3. Open an issue on GitHub if you encounter problems

---

**Generated**: 2025-11-10
**Feature Branch**: 003-simplify-screen-flow
**Related Specs**: `/specs/003-simplify-screen-flow/`
