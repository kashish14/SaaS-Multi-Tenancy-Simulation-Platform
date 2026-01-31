import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: unknown;
}

/**
 * LoggingService — Centralized logging for observability.
 * In production, would integrate with backend/APM.
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly entries: LogEntry[] = [];
  private readonly maxEntries = 500;

  log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data,
    };
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    const fn = console[level] ?? console.log;
    fn(`[${level.toUpperCase()}]`, message, context ?? '', data ?? '');
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    this.log('error', message, context, data);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }
}
