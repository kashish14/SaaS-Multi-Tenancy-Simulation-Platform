import { ErrorHandler, inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';

/**
 * GlobalErrorHandler — Catches unhandled errors and logs them.
 * Prevents app crashes from propagating silently.
 */
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logging = inject(LoggingService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.logging.error('Unhandled error', 'GlobalErrorHandler', { message, stack });
    console.error('GlobalErrorHandler:', error);
  }
}
