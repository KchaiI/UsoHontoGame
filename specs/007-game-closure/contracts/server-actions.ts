/**
 * Server Action Contracts: Game Closure Management
 * Feature: 007-game-closure
 *
 * TypeScript type definitions for server actions.
 * These types define the contracts between client components and server actions.
 */

// =============================================================================
// Close Game Action (User Story 1)
// =============================================================================

/**
 * Input for closing a game
 * Used by: CloseGameButton component
 */
export interface CloseGameInput {
  /** Game ID to close */
  gameId: string;
}

/**
 * Result of closing a game
 * Success: game object with updated status
 * Failure: error message
 */
export type CloseGameResult =
  | {
      success: true;
      game: {
        id: string;
        status: '締切';
        closedAt: string; // ISO timestamp
      };
    }
  | {
      success: false;
      error: string;
      code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'INVALID_STATUS' | 'UNKNOWN';
    };

/**
 * Server Action: closeGame
 * Location: src/app/actions/game.ts
 *
 * @param gameId - Game ID to close
 * @returns CloseGameResult
 *
 * Preconditions:
 * - User must be authenticated (session exists)
 * - User must be game creator (sessionId === game.creatorId)
 * - Game must be in "出題中" status
 *
 * Postconditions:
 * - Game status changed to "締切"
 * - Game updatedAt timestamp updated (serves as closedAt)
 * - New answer submissions rejected
 */
export type CloseGameAction = (gameId: string) => Promise<CloseGameResult>;

// =============================================================================
// Get Games with Status Filter Action (User Story 4)
// =============================================================================

/**
 * Status filter options
 */
export type GameStatusFilter = '出題中' | '締切' | 'すべて';

/**
 * Input for fetching games with status filter
 * Used by: TOP page, ActiveGamesList
 */
export interface GetGamesInput {
  /** Status filter */
  filter?: GameStatusFilter;
  /** Pagination cursor */
  cursor?: string;
  /** Page size (default: 20) */
  limit?: number;
}

/**
 * Game item in list response
 */
export interface GameListItem {
  /** Game ID */
  id: string;
  /** Game title */
  title: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** Current player count */
  playerCount: number;
  /** Maximum players (null = unlimited) */
  playerLimit: number | null;
  /** Human-readable relative time */
  formattedCreatedAt: string;
  /** Creator session ID */
  creatorId: string;
  /** Game status */
  status: '出題中' | '締切';
}

/**
 * Result of fetching games
 */
export interface GetGamesResult {
  /** List of games */
  games: GameListItem[];
  /** Whether more games are available */
  hasMore: boolean;
  /** Cursor for next page */
  nextCursor: string | null;
  /** Total count of matching games */
  total: number;
}

/**
 * Server Action: getGamesWithFilter
 * Location: src/app/actions/game.ts
 *
 * @param input - Filter and pagination options
 * @returns GetGamesResult
 *
 * Behavior by filter:
 * - "出題中": Only active games (current behavior)
 * - "締切": Only closed games
 * - "すべて": Both active and closed games
 */
export type GetGamesWithFilterAction = (input: GetGamesInput) => Promise<GetGamesResult>;

// =============================================================================
// Validation Contracts (User Story 2)
// =============================================================================

/**
 * Error response when attempting to answer a closed game
 * Used by: AnswerPage, SubmitAnswers use case
 */
export interface ClosedGameError {
  /** Error type identifier */
  code: 'GAME_CLOSED';
  /** User-friendly error message */
  message: string; // "このゲームは締め切られています"
  /** Game information */
  game: {
    id: string;
    title: string;
    status: '締切';
  };
}

/**
 * Check if error is a closed game error
 */
export function isClosedGameError(error: unknown): error is ClosedGameError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as ClosedGameError).code === 'GAME_CLOSED'
  );
}

// =============================================================================
// Dashboard Response Status (User Story 3)
// =============================================================================

/**
 * Extended response status for closed games
 * Used by: ResponseStatusPage, Dashboard
 */
export interface ResponseStatusWithGameStatus {
  /** Total participants */
  totalParticipants: number;
  /** Participants who have answered */
  answeredCount: number;
  /** Participants who have not answered */
  unansweredCount: number;
  /** Response rate (0-100) */
  responseRate: number;
  /** Individual participant status list */
  participants: Array<{
    nickname: string;
    hasAnswered: boolean;
    answeredAt?: string;
  }>;
  /** Game information including status */
  game: {
    id: string;
    title: string;
    status: '出題中' | '締切';
    /** Closure timestamp (from updatedAt when status is 締切) */
    closedAt?: string;
  };
  /** Polling behavior indicator */
  shouldContinuePolling: boolean; // false when status is 締切
}

// =============================================================================
// Component Props Contracts
// =============================================================================

/**
 * Props for CloseGameButton component
 * Location: src/components/domain/game/CloseGameButton.tsx
 */
export interface CloseGameButtonProps {
  /** Game ID to close */
  gameId: string;
  /** Current game status */
  gameStatus: '準備中' | '出題中' | '締切';
  /** Callback after successful closure */
  onClosed?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for GameStatusFilter component
 * Location: src/components/domain/game/GameStatusFilter.tsx
 */
export interface GameStatusFilterProps {
  /** Currently selected filter */
  value: GameStatusFilter;
  /** Callback when filter changes */
  onChange: (filter: GameStatusFilter) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for ActiveGameCard component (extended)
 * Location: src/components/domain/game/ActiveGameCard.tsx
 */
export interface ActiveGameCardProps {
  /** Game data */
  game: GameListItem;
  /** Current user's session ID */
  currentSessionId?: string;
}
