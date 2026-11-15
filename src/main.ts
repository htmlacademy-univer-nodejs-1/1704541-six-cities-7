import 'reflect-metadata';
import { Application } from './app/application.js';
import { LoggerService } from './common/logger/logger.service.js';
import { container } from './container.js';

try {
  const application = container.get(Application);
  await application.init();
} catch (error) {
  const loggerService = container.get(LoggerService);
  loggerService.error('Не удалось инициализировать приложение', { err: error });
  process.exitCode = 1;
}
