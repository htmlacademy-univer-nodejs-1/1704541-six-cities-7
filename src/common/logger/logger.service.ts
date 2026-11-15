import { injectable } from 'inversify';
import pino from 'pino';
import type { Logger } from 'pino';

@injectable()
export class LoggerService {
  private readonly logger: Logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: undefined,
  });

  public info(message: string, context: Record<string, unknown> = {}): void {
    this.logger.info(context, message);
  }

  public warn(message: string, context: Record<string, unknown> = {}): void {
    this.logger.warn(context, message);
  }

  public error(message: string, context: Record<string, unknown> = {}): void {
    this.logger.error(context, message);
  }

  public debug(message: string, context: Record<string, unknown> = {}): void {
    this.logger.debug(context, message);
  }
}
