# Feature Specification: Simplify Screen Flow

**Feature Branch**: `003-simplify-screen-flow`
**Created**: 2025-11-10
**Status**: Draft
**Input**: User description: "画面の構成と動線が期待と異なっているので修正したい。まずは全ての画面を一度削除してください。その上で、ゲーム作成の動線だけ追加します。ゲームの作成の動線は以下の通りです。JoinPage -> GameCreatePage -> JoinPage"

## User Scenarios & Testing

### User Story 1 - Simplified Game Creation Flow (Priority: P1)

A host wants to create a game session with a simple, focused workflow. They start from the Join page, navigate to game creation, complete the setup, and return to the Join page with their session ready.

**Why this priority**: This is the core workflow that enables the primary user action (creating games). Without this, no games can be created, making it essential for MVP.

**Independent Test**: Can be fully tested by navigating from Join page → Create button → Game creation form → Submit → Redirect back to Join page, and delivers a complete game creation experience.

**Acceptance Scenarios**:

1. **Given** a user is on the Join page, **When** they click the create game button, **Then** they are navigated to the Game Create page
2. **Given** a user is on the Game Create page, **When** they complete the game setup form and submit, **Then** they are redirected back to the Join page with their new session
3. **Given** a user has just created a game, **When** they arrive at the Join page, **Then** they see confirmation of their created session with the session ID

---

### Edge Cases

- What happens when user navigates to non-existent pages that were removed?
- How does the system handle partial form submission on the Game Create page?
- What happens if a user tries to navigate back from Game Create page without submitting?
- How does the system handle multiple game creation attempts in quick succession?

## Requirements

### Functional Requirements

- **FR-001**: System MUST remove all existing page routes except JoinPage and GameCreatePage
- **FR-002**: System MUST provide navigation from JoinPage to GameCreatePage via a create game action
- **FR-003**: System MUST redirect users back to JoinPage after successful game creation
- **FR-004**: System MUST display the newly created session information on JoinPage after creation
- **FR-005**: System MUST handle navigation errors gracefully when users attempt to access removed pages
- **FR-006**: System MUST preserve game creation functionality during the screen simplification
- **FR-007**: System MUST maintain session state across the JoinPage → GameCreatePage → JoinPage flow

### Key Entities

- **Game Session**: Represents a created game with session ID and configuration, created through the GameCreatePage workflow
- **Navigation State**: Tracks user's position in the simplified flow (JoinPage or GameCreatePage)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can navigate from JoinPage to GameCreatePage in one click
- **SC-002**: Users are automatically redirected to JoinPage within 1 second of successful game creation
- **SC-003**: 100% of removed page routes return appropriate error handling or redirect to JoinPage
- **SC-004**: Game creation workflow completion rate remains at or above current baseline
- **SC-005**: User confusion incidents related to navigation decrease by 80%

## Scope

### In Scope

- Removal of all page routes except JoinPage and GameCreatePage
- Implementation of JoinPage → GameCreatePage → JoinPage navigation flow
- Preservation of game creation functionality
- Error handling for removed routes
- Session state management across the simplified flow

### Out of Scope

- Adding new game management features beyond what currently exists
- Redesigning the UI/UX of JoinPage or GameCreatePage
- Implementing additional pages or navigation flows
- Modifying game logic or session management beyond navigation requirements

## Assumptions

- The current JoinPage and GameCreatePage components are functional and meet requirements
- Game creation backend APIs and services remain unchanged
- Session ID generation and management logic is working correctly
- Users are familiar with the current game creation process
- The simplified flow will reduce cognitive load and improve user experience

## Dependencies

- Existing JoinPage component must be preserved
- Existing GameCreatePage (or equivalent) component must be preserved
- Game session creation API endpoints must remain functional
- Session state management system must support the navigation flow

## Constraints

- Must not break existing game creation functionality
- Must maintain data integrity during the transition
- Must provide clear error messages for removed routes
- Should minimize code changes to existing working components
