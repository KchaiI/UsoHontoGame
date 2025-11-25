// CloseGame Use Case
// Feature: 007-game-closure
// Transitions game from 出題中 to 締切 with authorization

import { NotFoundError } from '@/server/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/server/domain/errors/UnauthorizedError';
import type { IGameRepository } from '@/server/domain/repositories/IGameRepository';
import { GameId } from '@/server/domain/value-objects/GameId';

export interface CloseGameInput {
  gameId: string;
  sessionId: string;
}

export interface CloseGameOutput {
  success: true;
  game: {
    id: string;
    status: '締切';
    closedAt: string;
  };
}

/**
 * CloseGame Use Case
 * Transitions a game from 出題中 to 締切 status
 * Only the game creator (moderator) can close the game
 *
 * @throws NotFoundError if game does not exist
 * @throws UnauthorizedError if user is not the game creator
 * @throws InvalidStatusTransitionError if game is not in 出題中 status
 */
export class CloseGame {
  constructor(private gameRepository: IGameRepository) {}

  async execute(input: CloseGameInput): Promise<CloseGameOutput> {
    const { gameId, sessionId } = input;

    // Validate sessionId is provided
    if (!sessionId || sessionId.trim() === '') {
      throw new UnauthorizedError('Session ID is required to close a game');
    }

    // Find game
    const game = await this.gameRepository.findById(new GameId(gameId));
    if (!game) {
      throw new NotFoundError(`Game ${gameId} not found`);
    }

    // Authorization: Only game creator can close
    if (game.creatorId !== sessionId) {
      throw new UnauthorizedError('Only the game creator can close the game');
    }

    // Transition status (will throw InvalidStatusTransitionError if not in 出題中)
    game.close();

    // Persist
    await this.gameRepository.update(game);

    return {
      success: true,
      game: {
        id: gameId,
        status: '締切',
        closedAt: game.updatedAt.toISOString(),
      },
    };
  }
}
