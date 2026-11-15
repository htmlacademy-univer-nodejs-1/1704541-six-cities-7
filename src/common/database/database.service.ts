import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { LoggerService } from '../logger/logger.service.js';

@injectable()
export class DatabaseService {
  constructor(@inject(LoggerService) private readonly loggerService: LoggerService) {}

  public async connect(uri: string): Promise<void> {
    this.loggerService.info('Попытка подключения к базе данных');

    await mongoose.connect(uri);

    this.loggerService.info('Соединение с базой данных установлено', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    });
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.loggerService.info('Соединение с базой данных закрыто');
  }
}
