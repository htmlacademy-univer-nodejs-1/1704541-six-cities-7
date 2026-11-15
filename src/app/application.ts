import { inject, injectable } from 'inversify';
import { ConfigService } from '../common/config/config.service.js';
import { LoggerService } from '../common/logger/logger.service.js';

@injectable()
export class Application {
  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(LoggerService) private readonly loggerService: LoggerService,
  ) {}

  public init(): void {
    this.loggerService.info('Приложение инициализировано', { port: this.configService.port });
  }
}
