# Feature Specification: Game Closure Management

**Feature Branch**: `007-game-closure`
**Created**: 2025-11-25
**Status**: Draft
**Input**: User description: "司会者はゲームを締切に変更できる。締切に変更すると、以降そのゲームには参加できなくなる。締切に変更すると、全参加者にダッシュボードで最終結果が表示される。TOP画面では締め切られたゲームも表示できるようにする。"

## Clarifications

### Session 2025-11-25

- Q: Where should the "締切にする" (Close Game) button be located? → A: On the game detail page (visible only to moderator)
- Q: Should the "回答する" (Answer) button on closed games be disabled or hidden on the TOP page? → A: Disable the button with visual styling (greyed out, not clickable)
- Q: How should participants who haven't answered be handled in the final rankings when a game is closed? → A: Include with 0 points at bottom of rankings
- Q: Is the status filter functionality (to filter games by status on TOP page) part of this feature's scope? → A: In scope - implement filter in this feature
- Q: When a game is closed while a participant is actively on the answer page, how should the system notify them? → A: No special handling - rely on backend validation

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Moderator Closes Game (Priority: P1)

As a game moderator, I want to close an active game so that no new participants can join and final results are locked in.

**Why this priority**: This is the core functionality that enables moderators to control the game lifecycle and transition from active participation phase to results viewing phase. Without this, games remain in limbo with no clear end state.

**Independent Test**: Can be fully tested by creating a game in "出題中" status, navigating to game detail page as moderator, clicking "締切にする" button, and verifying status changes to "締切" and delivers immediate feedback that game is now closed.

**Acceptance Scenarios**:

1. **Given** a game with status "出題中" and I am the game moderator, **When** I click "締切にする" button, **Then** game status changes to "締切" and I see confirmation message
2. **Given** a game with status "締切", **When** I view the game, **Then** I see "締切" status indicator and no option to close again
3. **Given** a game with status "準備中", **When** I view game management, **Then** I cannot see "締切にする" button (only active games can be closed)

---

### User Story 2 - Prevent Joining Closed Games (Priority: P2)

As a participant, I should not be able to join a closed game so that the final results remain stable and valid.

**Why this priority**: This ensures data integrity for final results. Once a game is closed, the participant list and answer submissions must be frozen to provide meaningful rankings.

**Independent Test**: Can be fully tested by closing a game, attempting to access the answer page as a new participant, and verifying that access is denied with clear message explaining game is closed.

**Acceptance Scenarios**:

1. **Given** a game with status "締切", **When** I click "回答する" button from TOP page, **Then** I see error message "このゲームは締め切られています" and cannot submit answers
2. **Given** a game with status "締切" and I have not yet participated, **When** I try to access answer page directly via URL, **Then** I am redirected to game detail with error message
3. **Given** a game with status "締切" and I have already submitted answers before closure, **When** I try to access answer page, **Then** I see read-only view of my submitted answers with message "ゲームは締め切られました"

---

### User Story 3 - View Final Results on Dashboard (Priority: P1)

As any user, I want to see final results on the dashboard when a game is closed so that I can understand the complete game outcome.

**Why this priority**: This completes the game experience by providing closure (literally) and allowing all participants to see how they performed. Without this, closing a game provides no value to users.

**Independent Test**: Can be fully tested by closing a game with existing answers, navigating to dashboard, and verifying that response status shows "完了" for all participants and final rankings are displayed.

**Acceptance Scenarios**:

1. **Given** a game with status "締切" and all participants have submitted answers, **When** I view the dashboard, **Then** I see "ゲーム終了" indicator and final rankings with scores
2. **Given** a game with status "締切" and some participants have not submitted answers, **When** I view the dashboard, **Then** I see "未回答" for non-respondents with 0 points and they are ranked at the bottom
3. **Given** a game with status "締切", **When** I view dashboard, **Then** response status polling stops (no further updates needed)

---

### User Story 4 - Display Closed Games on TOP Page (Priority: P3)

As a user viewing TOP page, I want to see both active and closed games so that I can access game results even after a game has ended.

**Why this priority**: This improves discoverability of completed games and allows users to review past game results. Lower priority because users who participated already have direct access via game detail pages.

**Independent Test**: Can be fully tested by closing a game, navigating to TOP page, and verifying that the game appears with "締切" status badge and "ダッシュボード" button is accessible.

**Acceptance Scenarios**:

1. **Given** games with mixed statuses on TOP page, **When** I view the page, **Then** I see games with status "出題中" and "締切" both displayed, ordered by creation date
2. **Given** a closed game on TOP page, **When** I view the game card, **Then** I see "締切" status badge and "ダッシュボード" button is enabled but "回答する" button is disabled (greyed out)
3. **Given** many games on TOP page, **When** I select a status filter option ("出題中", "締切", or "すべて"), **Then** the game list updates to show only games matching the selected status

---

### Edge Cases

- What happens when moderator tries to close a game with no participants? (Should succeed with warning that no results exist)
- What happens when moderator tries to close a game where not all participants have answered? (Should succeed, including non-respondents in rankings with 0 points at bottom)
- What happens when participant is actively viewing answer page when moderator closes the game? (Backend validation will reject submission attempt with error message)
- Can a closed game be reopened? (Not in this feature - one-way transition only)
- What happens when moderator tries to close a game with status "準備中"? (Should show error - only "出題中" games can be closed)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow game moderator (creator) to change game status from "出題中" to "締切" via button on game detail page
- **FR-002**: System MUST prevent any user from joining or submitting answers to games with status "締切"
- **FR-003**: System MUST display "締切" status badge on game cards and detail pages for closed games
- **FR-004**: System MUST show final results on dashboard for games with status "締切"
- **FR-005**: System MUST stop polling for response status updates on dashboard when game status is "締切"
- **FR-006**: TOP page MUST display games with status "締切" alongside active games (出題中)
- **FR-007**: System MUST disable "回答する" button with visual styling (greyed out) for closed games on TOP page and game detail pages
- **FR-008**: System MUST persist game status "締切" in database with timestamp of closure
- **FR-009**: System MUST provide confirmation UI before closing a game to prevent accidental closure
- **FR-010**: Answer submission endpoints MUST validate game status and reject submissions for closed games
- **FR-011**: TOP page MUST provide status filter to show "出題中" only, "締切" only, or all games

### Key Entities

- **Game**: Extended with closure tracking
  - Status: Now includes "締切" as valid terminal state
  - closedAt: Optional timestamp indicating when game was closed

- **GameStatus**: Value object representing game lifecycle
  - Valid transitions: "準備中" → "出題中" → "締切"
  - "締切" is terminal state (no further transitions)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Moderators can close a game in under 5 seconds with 2 clicks maximum (button + confirmation)
- **SC-002**: 100% of attempts to submit answers to closed games are rejected with clear error message
- **SC-003**: Dashboard polling stops immediately when game status changes to "締切" (verified via browser DevTools)
- **SC-004**: Closed games appear on TOP page within 1 second of closure (no page refresh needed if using real-time updates)
- **SC-005**: Final results display correctly for 100% of closed games with participants
