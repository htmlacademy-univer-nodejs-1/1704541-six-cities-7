import { inject, injectable } from 'inversify';
import { ConfigService } from '../common/config/config.service.js';
import { DatabaseService } from '../common/database/database.service.js';
import { LoggerService } from '../common/logger/logger.service.js';

@injectable()
export class Application {
  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(DatabaseService) private readonly databaseService: DatabaseService,
    @inject(LoggerService) private readonly loggerService: LoggerService,
  ) {}

  public async init(): Promise<void> {
    this.loggerService.info('Приложение инициализировано', { port: this.configService.port });
    await this.databaseService.connect(this.configService.dbUri);
  }
}
