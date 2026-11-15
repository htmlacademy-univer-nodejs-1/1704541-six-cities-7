import { Container } from 'inversify';
import { Application } from './app/application.js';
import { ConfigService } from './common/config/config.service.js';
import { LoggerService } from './common/logger/logger.service.js';

const container = new Container();

container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(LoggerService).toSelf().inSingletonScope();
container.bind(Application).toSelf().inSingletonScope();

export { container };
