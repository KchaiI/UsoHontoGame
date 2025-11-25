# Quickstart: Game Closure Management

**Feature**: 007-game-closure
**Date**: 2025-11-25

## Test Scenarios

### User Story 1: Moderator Closes Game

#### Scenario 1.1: Successfully close an active game
```gherkin
Given a game with status "出題中"
And I am the game moderator (creator)
And I am on the game detail page
When I click "締切にする" button
And I confirm the closure in the dialog
Then the game status changes to "締切"
And I see "ゲームを締め切りました" confirmation message
And the "締切にする" button is no longer visible
```

#### Scenario 1.2: Button not shown for non-active games
```gherkin
Given a game with status "準備中"
And I am the game moderator
When I view the game detail page
Then the "締切にする" button is not visible
```

#### Scenario 1.3: Button not shown for non-moderators
```gherkin
Given a game with status "出題中"
And I am not the game moderator
When I view the game detail page
Then the "締切にする" button is not visible
```

### User Story 2: Prevent Joining Closed Games

#### Scenario 2.1: Cannot answer on closed game from TOP page
```gherkin
Given a game with status "締切" appears on TOP page
When I click "回答する" button on the game card
Then I see error message "このゲームは締め切られています"
And I cannot access the answer form
```

#### Scenario 2.2: Direct URL access blocked for closed game
```gherkin
Given a game with status "締切"
And I have not participated in this game
When I navigate directly to /games/{gameId}/answer
Then I am redirected to the game detail page
And I see error message "このゲームは締め切られています"
```

#### Scenario 2.3: Read-only view for existing participants
```gherkin
Given a game with status "締切"
And I have already submitted answers before closure
When I navigate to /games/{gameId}/answer
Then I see my submitted answers in read-only mode
And I see message "ゲームは締め切られました"
And I cannot modify my answers
```

### User Story 3: View Final Results on Dashboard

#### Scenario 3.1: All participants answered
```gherkin
Given a game with status "締切"
And all 5 participants have submitted answers
When I view the dashboard (/games/{gameId}/dashboard)
Then I see "ゲーム終了" indicator at the top
And I see final rankings with scores for all 5 participants
And the polling stops (no network requests every 5 seconds)
```

#### Scenario 3.2: Some participants did not answer
```gherkin
Given a game with status "締切"
And 3 of 5 participants have submitted answers
When I view the dashboard
Then I see final rankings
And participants who answered have their scores displayed
And non-respondents show "未回答" with 0 points
And non-respondents are ranked at the bottom
```

#### Scenario 3.3: Dashboard polling stops on closure
```gherkin
Given I am viewing the dashboard for an active game
And the game is being closed by the moderator
When the next poll request returns status "締切"
Then polling stops immediately
And I see "ゲーム終了" indicator
And final results are displayed
```

### User Story 4: Display Closed Games on TOP Page

#### Scenario 4.1: Both active and closed games visible
```gherkin
Given there are 2 games with status "出題中"
And there are 2 games with status "締切"
When I view the TOP page with filter "すべて"
Then I see all 4 games
And games are ordered by creation date (newest first)
```

#### Scenario 4.2: Closed game card shows correct buttons
```gherkin
Given a closed game appears on TOP page
When I view the game card
Then I see "締切" status badge
And "ダッシュボード" button is enabled
And "回答する" button is disabled (greyed out)
```

#### Scenario 4.3: Filter by status
```gherkin
Given games with mixed statuses on TOP page
When I select "出題中" filter
Then I see only active games
When I select "締切" filter
Then I see only closed games
When I select "すべて" filter
Then I see all games
```

## Manual Testing Steps

### Setup
1. Start development server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Ensure you have a session (nickname set)

### Test Close Game Flow
1. Create a new game via moderator interface
2. Transition game to "出題中" status
3. Navigate to game detail page
4. Verify "締切にする" button is visible
5. Click "締切にする" and confirm
6. Verify game shows "締切" status
7. Verify button is no longer visible

### Test Answer Blocking
1. With a closed game, view TOP page
2. Click disabled "回答する" button (should not navigate)
3. Try direct URL access to `/games/{id}/answer`
4. Verify redirect with error message

### Test Dashboard Final Results
1. With a closed game with participants
2. Navigate to dashboard
3. Verify "ゲーム終了" indicator
4. Open DevTools Network tab
5. Verify no polling requests after initial load
6. Verify rankings display with scores

### Test Status Filter
1. Ensure mix of active and closed games exist
2. Navigate to TOP page
3. Test each filter option: "出題中", "締切", "すべて"
4. Verify correct games displayed for each filter

## Automated Test Commands

```bash
# Run all tests
npm test

# Run specific test files (when implemented)
npm test -- --grep "CloseGame"
npm test -- --grep "GameStatusFilter"

# Run E2E tests
npm run test:e2e -- game-closure.spec.ts
```

## API Verification

### Close Game
```bash
# Via server action (not direct API call)
# Use browser DevTools to observe server action payload:
# POST /_next/forms
# Form data: gameId={gameId}, _action=closeGame
```

### Get Games with Filter
```bash
# Server action with filter parameter
# Expected response includes:
{
  "games": [
    {
      "id": "...",
      "title": "...",
      "status": "締切",
      "createdAt": "...",
      "playerCount": 5,
      "playerLimit": 10,
      "creatorId": "...",
      "formattedCreatedAt": "2時間前"
    }
  ],
  "hasMore": false,
  "nextCursor": null,
  "total": 1
}
```

## Database Verification

```bash
# Open Prisma Studio
npx prisma studio

# Check Game table:
# - Verify status field shows "締切"
# - Verify updatedAt changed on closure
# - Status index is being used for queries
```
