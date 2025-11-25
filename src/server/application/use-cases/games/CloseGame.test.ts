// Unit Tests: CloseGame Use Case
// Feature: 007-game-closure
// Tests for transitioning games to closed status with authorization

import { beforeEach, describe, expect, it } from 'vitest';
import { CloseGame } from '@/server/application/use-cases/games/CloseGame';
import { Game } from '@/server/domain/entities/Game';
import { InvalidStatusTransitionError } from '@/server/domain/errors/InvalidStatusTransitionError';
import { NotFoundError } from '@/server/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/server/domain/errors/UnauthorizedError';
import type { IGameRepository } from '@/server/domain/repositories/IGameRepository';
import { GameId } from '@/server/domain/value-objects/GameId';
import { GameStatus } from '@/server/domain/value-objects/GameStatus';
import { createMockGameRepository } from '../../../../../tests/utils/mockRepositories';

describe('CloseGame Use Case', () => {
  let repository: IGameRepository;
  let useCase: CloseGame;

  beforeEach(() => {
    repository = createMockGameRepository();
    useCase = new CloseGame(repository);
  });

  describe('Success Cases', () => {
    it('should transition game from 出題中 to 締切 when authorized', async () => {
      // Given: Game in 出題中 status created by moderator-123
      const gameId = '550e8400-e29b-41d4-a716-446655440001';
      const creatorId = 'moderator-123';
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        5,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When: Creator closes the game
      const result = await useCase.execute({ gameId, sessionId: creatorId });

      // Then: Game is closed successfully
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.game.id).toBe(gameId);
        expect(result.game.status).toBe('締切');
        expect(result.game.closedAt).toBeDefined();
      }

      const updatedGame = await repository.findById(new GameId(gameId));
      expect(updatedGame?.status.toString()).toBe('締切');
    });

    it('should close game with no players', async () => {
      // Given: Game in 出題中 with 0 players
      const gameId = '550e8400-e29b-41d4-a716-446655440002';
      const creatorId = 'moderator-456';
      const game = new Game(
        new GameId(gameId),
        'Empty Game',
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When
      const result = await useCase.execute({ gameId, sessionId: creatorId });

      // Then
      expect(result.success).toBe(true);
    });

    it('should close game with maximum players', async () => {
      // Given: Game in 出題中 with full players
      const gameId = '550e8400-e29b-41d4-a716-446655440003';
      const creatorId = 'moderator-789';
      const game = new Game(
        new GameId(gameId),
        'Full Game',
        new GameStatus('出題中'),
        10,
        10,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When
      const result = await useCase.execute({ gameId, sessionId: creatorId });

      // Then
      expect(result.success).toBe(true);
    });

    it("should update the game's updatedAt timestamp", async () => {
      // Given: Game in 出題中
      const gameId = '550e8400-e29b-41d4-a716-446655440004';
      const creatorId = 'moderator-time';
      const beforeTime = new Date();
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        0,
        beforeTime,
        beforeTime,
        creatorId
      );
      await repository.create(game);

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      // When
      await useCase.execute({ gameId, sessionId: creatorId });

      // Then
      const updatedGame = await repository.findById(new GameId(gameId));
      expect(updatedGame?.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    });
  });

  describe('Authorization Errors', () => {
    it('should reject closing when user is not the game creator', async () => {
      // Given: Game created by moderator-A
      const gameId = '550e8400-e29b-41d4-a716-446655440010';
      const creatorId = 'moderator-A';
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When/Then: moderator-B tries to close
      await expect(useCase.execute({ gameId, sessionId: 'moderator-B' })).rejects.toThrow(
        UnauthorizedError
      );
      await expect(useCase.execute({ gameId, sessionId: 'moderator-B' })).rejects.toThrow(
        'Only the game creator can close the game'
      );
    });

    it('should reject closing when sessionId is missing', async () => {
      // Given: Game in 出題中
      const gameId = '550e8400-e29b-41d4-a716-446655440011';
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        'moderator-123'
      );
      await repository.create(game);

      // When/Then: No sessionId provided
      await expect(useCase.execute({ gameId, sessionId: '' })).rejects.toThrow(UnauthorizedError);
    });

    it('should reject closing when sessionId is different from creatorId', async () => {
      // Given: Game with specific creator
      const gameId = '550e8400-e29b-41d4-a716-446655440012';
      const creatorId = 'original-creator-999';
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        5,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When/Then: Different session tries to close
      const unauthorizedSessionId = 'random-user-123';
      await expect(useCase.execute({ gameId, sessionId: unauthorizedSessionId })).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe('Validation Errors', () => {
    it('should reject closing when game does not exist', async () => {
      // Given: Non-existent but valid UUID
      const gameId = '550e8400-e29b-41d4-a716-446655440999';

      // When/Then
      await expect(useCase.execute({ gameId, sessionId: 'any-session' })).rejects.toThrow(
        NotFoundError
      );
      await expect(useCase.execute({ gameId, sessionId: 'any-session' })).rejects.toThrow(
        'not found'
      );
    });

    it('should reject closing when game is in 準備中 status', async () => {
      // Given: Game in 準備中 status
      const gameId = '550e8400-e29b-41d4-a716-446655440005';
      const creatorId = 'moderator-prep';
      const game = new Game(
        new GameId(gameId),
        'Preparation Game',
        new GameStatus('準備中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When/Then
      await expect(useCase.execute({ gameId, sessionId: creatorId })).rejects.toThrow(
        InvalidStatusTransitionError
      );
      await expect(useCase.execute({ gameId, sessionId: creatorId })).rejects.toThrow('出題中');
    });

    it('should reject closing when game is already in 締切 status', async () => {
      // Given: Game already in 締切 status
      const gameId = '550e8400-e29b-41d4-a716-446655440006';
      const creatorId = 'moderator-closed';
      const game = new Game(
        new GameId(gameId),
        'Closed Game',
        new GameStatus('締切'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When/Then
      await expect(useCase.execute({ gameId, sessionId: creatorId })).rejects.toThrow(
        InvalidStatusTransitionError
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle game with very long name', async () => {
      // Given: Game with long name
      const gameId = '550e8400-e29b-41d4-a716-446655440007';
      const creatorId = 'moderator-long';
      const longName = 'A'.repeat(100);
      const game = new Game(
        new GameId(gameId),
        longName,
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When
      const result = await useCase.execute({ gameId, sessionId: creatorId });

      // Then
      expect(result.success).toBe(true);
    });

    it('should handle game with special characters in name', async () => {
      // Given: Game with special characters
      const gameId = '550e8400-e29b-41d4-a716-446655440008';
      const creatorId = 'moderator-special';
      const game = new Game(
        new GameId(gameId),
        'ゲーム名：特殊文字！@#$%^&*()',
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When
      const result = await useCase.execute({ gameId, sessionId: creatorId });

      // Then
      expect(result.success).toBe(true);
    });

    it('should handle concurrent close operations gracefully', async () => {
      // Given: Game in 出題中
      const gameId = '550e8400-e29b-41d4-a716-446655440009';
      const creatorId = 'moderator-concurrent';
      const game = new Game(
        new GameId(gameId),
        'Test Game',
        new GameStatus('出題中'),
        10,
        0,
        new Date(),
        new Date(),
        creatorId
      );
      await repository.create(game);

      // When: First close succeeds
      const result1 = await useCase.execute({ gameId, sessionId: creatorId });
      expect(result1.success).toBe(true);

      // Then: Second close fails (already closed)
      await expect(useCase.execute({ gameId, sessionId: creatorId })).rejects.toThrow(
        InvalidStatusTransitionError
      );
    });
  });
});
