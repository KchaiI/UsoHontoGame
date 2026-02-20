// Service Dependency Injection Container
// Provides Application Service instances with singleton pattern
// Unifies service lifecycle management across the application

import type { AnswerApplicationService } from '@/server/application/services/AnswerApplicationService';
import type { GameApplicationService } from '@/server/application/services/GameApplicationService';
import type { PresenterApplicationService } from '@/server/application/services/PresenterApplicationService';
import type { ResultsApplicationService } from '@/server/application/services/ResultsApplicationService';
import type { SessionApplicationService } from '@/server/application/services/SessionApplicationService';
import type { DashboardApplicationService } from '@/server/application/services/DashboardApplicationService';

/**
 * Service Dependency Injection Container
 * Manages Application Service instances as singletons
 * Provides centralized service instantiation and lifecycle management
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a dependency injection container pattern
export class ServiceContainer {
  private static instances = new Map<string, unknown>();

  /**
   * Gets GameApplicationService instance (singleton)
   */
  static getGameService(): GameApplicationService {
    if (!this.instances.has('game')) {
      // Lazy import to avoid circular dependencies
      const { GameApplicationService: Service } = require('@/server/application/services/GameApplicationService');
      this.instances.set('game', new Service());
    }
    return this.instances.get('game') as GameApplicationService;
  }

  /**
   * Gets AnswerApplicationService instance (singleton)
   */
  static getAnswerService(): AnswerApplicationService {
    if (!this.instances.has('answer')) {
      const { AnswerApplicationService: Service } = require('@/server/application/services/AnswerApplicationService');
      this.instances.set('answer', new Service());
    }
    return this.instances.get('answer') as AnswerApplicationService;
  }

  /**
   * Gets PresenterApplicationService instance (singleton)
   */
  static getPresenterService(): PresenterApplicationService {
    if (!this.instances.has('presenter')) {
      const { PresenterApplicationService: Service } = require('@/server/application/services/PresenterApplicationService');
      this.instances.set('presenter', new Service());
    }
    return this.instances.get('presenter') as PresenterApplicationService;
  }

  /**
   * Gets ResultsApplicationService instance (singleton)
   */
  static getResultsService(): ResultsApplicationService {
    if (!this.instances.has('results')) {
      const { ResultsApplicationService: Service } = require('@/server/application/services/ResultsApplicationService');
      this.instances.set('results', new Service());
    }
    return this.instances.get('results') as ResultsApplicationService;
  }

  /**
   * Gets SessionApplicationService instance (singleton)
   */
  static getSessionService(): SessionApplicationService {
    if (!this.instances.has('session')) {
      const { SessionApplicationService: Service } = require('@/server/application/services/SessionApplicationService');
      this.instances.set('session', new Service());
    }
    return this.instances.get('session') as SessionApplicationService;
  }

  /**
   * Gets DashboardApplicationService instance (singleton)
   */
  static getDashboardService(): DashboardApplicationService {
    if (!this.instances.has('dashboard')) {
      const { DashboardApplicationService: Service } = require('@/server/application/services/DashboardApplicationService');
      this.instances.set('dashboard', new Service());
    }
    return this.instances.get('dashboard') as DashboardApplicationService;
  }

  /**
   * Reset all singleton instances (for testing)
   * @internal
   */
  static resetForTesting(): void {
    this.instances.clear();
  }

  /**
   * Set custom service instance (for testing)
   * @internal
   */
  static setService<T>(key: string, service: T): void {
    this.instances.set(key, service);
  }
}
