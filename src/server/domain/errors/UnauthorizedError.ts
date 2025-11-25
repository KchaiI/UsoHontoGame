// UnauthorizedError
// Feature: 007-game-closure
// Error thrown when a user is not authorized to perform an action

/**
 * Error thrown when a user attempts an action they are not authorized to perform
 * Used for authorization checks (e.g., only game creator can close game)
 */
export class UnauthorizedError extends Error {
  /**
   * Creates a new UnauthorizedError
   * @param message Error message describing the authorization failure
   */
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
