# Quick Start Guide: Simplify Screen Flow

**Feature**: 003-simplify-screen-flow
**Date**: 2025-11-10
**Status**: Planning Complete

## Overview

This guide provides a quick reference for understanding and implementing the simplified navigation flow. After this feature, the application will have **only 2 user-facing pages**: JoinPage and CreatePage.

---

## Navigation Flow

### Simplified User Journey

```
┌─────────────┐
│  JoinPage   │ ← Entry point (/)
│  (/join)    │
└──────┬──────┘
       │
       │ Click "Create Game"
       ↓
┌─────────────┐
│ CreatePage  │
│  (/create)  │
└──────┬──────┘
       │
       │ Submit form
       │ ↓ POST /api/sessions-v2
       │ ← Cookie set + sessionId returned
       │
       ↓ Redirect
┌─────────────┐
│  JoinPage   │
│ (/join?     │ ← Returns here with session
│ sessionId=  │
│   ABC123)   │
└─────────────┘
```

###  Key Points

1. **Start**: User lands on `/join`
2. **Create**: Click button → navigate to `/create`
3. **Submit**: Fill form → API creates session + sets cookie
4. **Return**: Auto-redirect to `/join?sessionId=ABC123`
5. **Result**: User sees their created game, ready to invite others

---

## Pages Reference

### JoinPage (`/join`)

**Purpose**: Primary entry point for joining or creating games

**Location**: `/src/app/join/page.tsx` → renders `/src/components/pages/JoinPage`

**Features**:
- Join existing game by entering session ID
- "Create Game" button navigates to CreatePage
- Shows session info if `?sessionId` query param present
- Displays host controls if user is the host (via cookie check)

**API Calls**:
- `GET /api/sessions/[id]/host-access` - Check if user is host

**Navigation**:
- FROM: Root `/`, removed routes (404 redirect)
- TO: `/create` (when "Create Game" clicked)

---

### CreatePage (`/create`)

**Purpose**: Game creation with episode management

**Location**: `/src/app/(host)/create/page.tsx` → renders `/src/components/pages/CreatePage`

**Features**:
- Form to add 1-20 episodes
- Episode content validation
- Submit button to create game
- Loading state during creation

**API Calls**:
- `POST /api/sessions-v2` - Create game session

**Navigation**:
- FROM: `/join` (when "Create Game" clicked)
- TO: `/join?sessionId=ABC123` (after successful creation)

**State Management**:
- `useGameCreation` hook handles form state
- Episodes array managed client-side
- Validation before API call

---

## Removed Pages

The following pages have been **removed** and will return 404:

| Route | Component | Status |
|-------|-----------|--------|
| `/game/[id]` | GamePage | ❌ REMOVED |
| `/results/[sessionId]` | ResultsPage | ❌ REMOVED |
| `/host/[sessionId]` | HostManagementPage | ❌ REMOVED |
| `/manage/[sessionId]` | HostManagementPage | ❌ REMOVED |

**Behavior**: Navigating to these URLs shows custom 404 page with link back to `/join`

---

## API Endpoints (Unchanged)

### POST /api/sessions-v2

**Purpose**: Create new game session

**Request**:
```json
{
  "episodes": [
    { "content": "I've visited 30 countries" },
    { "content": "I can speak 3 languages" }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "ABC1234567",
    "message": "Game session created successfully. Session ID: ABC1234567"
  }
}
```

**Side Effects**:
- Creates GameSession in repository
- Sets cookie: `game_host_ABC1234567={hostId}`
- Cookie expires in 24 hours

---

### GET /api/sessions/[id]/host-access

**Purpose**: Check if requester is the host

**Request**: Includes cookie in header

**Response**:
```json
{
  "success": true,
  "data": {
    "isHost": true,
    "sessionId": "ABC1234567"
  }
}
```

**Usage**: JoinPage calls this to show/hide host controls

---

## Component Architecture

### Page Components

```
src/components/pages/
├── JoinPage/
│   ├── index.tsx           # Page component (presentational)
│   └── hooks/
│       └── useJoinPage.ts  # Logic hook (stateful)
└── CreatePage/
    ├── index.tsx           # Page component (presentational)
    └── (uses useGameCreation from src/hooks/)
```

### Custom Hooks

```
src/hooks/
├── useGameCreation.ts      # Game creation logic
├── useHostAccess.ts        # Host verification logic
└── useToast.ts             # Toast notifications
```

### Domain Components (Reusable)

```
src/components/domain/
├── game/
│   └── EpisodeForm/        # Episode input form
└── host/
    └── HostLink/           # Conditional host management link
```

---

## State Management

### Session State (Cookie-based)

**Storage**: Browser cookies

**Cookie Format**: `game_host_{sessionId}={hostId}`

**Lifetime**: 24 hours

**Access**:
- Server Components: `cookies()` from `next/headers`
- Client Components: `document.cookie` (via `/src/lib/cookies.ts`)
- API Routes: `request.cookies.get()`

**Persistence**: Automatic across navigation, redirects, and page refreshes

---

### Navigation State (URL-based)

**Storage**: Browser URL + history API

**Query Parameters**:
- `sessionId`: Optional, shows created session on JoinPage

**Example**: `/join?sessionId=ABC1234567`

**Persistence**: Until user navigates away or refreshes

---

## Development Workflow

### Running Locally

```bash
# Start development server
npm run dev

# Application runs at http://localhost:3000

# Available routes:
# - http://localhost:3000/           → Redirects to /join
# - http://localhost:3000/join       → JoinPage
# - http://localhost:3000/create     → CreatePage
```

### Testing the Flow

**Step 1: Navigate to Create**
```bash
# Open browser
open http://localhost:3000/create
```

**Step 2: Create Game**
1. Fill in episode content (at least 1)
2. Click "Create Game"
3. Watch for redirect to /join

**Step 3: Verify Session**
1. Check URL has `?sessionId=...`
2. Open DevTools → Application → Cookies
3. Verify `game_host_{sessionId}` cookie exists

**Step 4: Test Host Controls**
1. JoinPage should show host-specific UI
2. Non-hosts visiting same URL should NOT see host controls

---

## Testing Strategy

### Unit Tests (Keep)

```bash
# Test hooks
npm test tests/unit/hooks/useGameCreation.test.ts
npm test tests/unit/hooks/useHostAccess.test.ts

# Test utilities
npm test tests/lib/cookies.test.ts
npm test tests/lib/sessionId.test.ts
```

### Integration Tests (Keep)

```bash
# Test API endpoints
npm test tests/integration/api/sessions-v2.test.ts
npm test tests/integration/api/host-access.test.ts
```

### E2E Tests (Update)

```bash
# Test navigation flow
npm test tests/e2e/game-flow.spec.ts
```

**Changes Required**:
- Remove steps for `/game` and `/results` navigation
- Add assertions for `/join` redirect after creation
- Verify cookie persistence

---

## Common Tasks

### Adding a New Page

**Don't!** This feature simplifies to 2 pages only. Adding pages would reintroduce complexity.

If you must add a page:
1. Justify why JoinPage or CreatePage can't handle it
2. Update this specification
3. Add navigation flow diagram
4. Add tests for new navigation

---

### Debugging Session Issues

**Problem**: Session ID not showing on JoinPage

**Check**:
1. API response: `console.log()` in `useGameCreation`
2. URL after redirect: Should have `?sessionId=...`
3. Cookie: DevTools → Application → Cookies → `game_host_*`

**Problem**: Host controls not showing

**Check**:
1. Cookie exists: `game_host_{sessionId}`
2. API call succeeds: Check `/api/sessions/[id]/host-access` response
3. `isHost` state: `console.log()` in `useHostAccess`

---

### Handling 404 Errors

**Old URLs**: `/game/ABC`, `/results/ABC`, `/host/ABC`, `/manage/ABC`

**Behavior**: Show custom 404 page

**Implementation**: `/src/app/not-found.tsx`

**Customization**: Edit not-found.tsx to change 404 message or styling

---

## File Structure

### Key Files

```text
src/
├── app/
│   ├── page.tsx                      # Root → Redirects to /join
│   ├── join/page.tsx                 # JoinPage route
│   ├── (host)/create/page.tsx        # CreatePage route
│   ├── not-found.tsx                 # 404 handler
│   └── api/
│       ├── sessions-v2/route.ts      # Game creation API
│       └── sessions/[id]/
│           └── host-access/route.ts  # Host verification API
├── components/
│   ├── pages/
│   │   ├── JoinPage/
│   │   └── CreatePage/
│   ├── domain/
│   │   ├── game/EpisodeForm/
│   │   └── host/HostLink/
│   └── ui/
│       └── Toast/
├── hooks/
│   ├── useGameCreation.ts
│   ├── useHostAccess.ts
│   └── useToast.ts
└── lib/
    ├── cookies.ts
    ├── sessionId.ts
    └── api-response.ts
```

---

## Quick Reference Cards

### For Developers

**Navigation Flow**: `JoinPage → CreatePage → JoinPage`

**State**: Cookies + URL params

**APIs**: 2 endpoints (create + host-check)

**Tests**: Keep all backend tests, update e2e tests

---

### For QA/Testers

**Test Scenario**: Create game and return to join

**Steps**:
1. Go to `/create`
2. Add episode content
3. Submit form
4. ✅ Redirects to `/join?sessionId=...`
5. ✅ Session ID visible on page
6. ✅ Host controls visible

**404 Test**: Navigate to removed routes

**Steps**:
1. Go to `/game/ABC123`
2. ✅ Shows 404 page
3. ✅ Link to /join works

---

## Next Steps

After reading this guide:

1. **Review**: Read [spec.md](./spec.md) for requirements
2. **Plan**: Read [plan.md](./plan.md) for implementation strategy
3. **Research**: Read [research.md](./research.md) for technical decisions
4. **Implement**: Follow [tasks.md](./tasks.md) (generated by `/speckit.tasks`)

---

## Support

**Questions about navigation flow?** → Check [plan.md](./plan.md)

**Questions about data/APIs?** → Check [data-model.md](./data-model.md) and [contracts/api.yaml](./contracts/api.yaml)

**Questions about implementation?** → Check [research.md](./research.md)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-10
**Related**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [research.md](./research.md)
