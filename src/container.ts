import { Container } from 'inversify';
import type { Model } from 'mongoose';
import { Application } from './app/application.js';
import { ImportCommand } from './commands/import.command.js';
import { ConfigService } from './common/config/config.service.js';
import { DatabaseService } from './common/database/database.service.js';
import type { OfferEntity } from './common/database/models/offer.model.js';
import { OfferModel } from './common/database/models/offer.model.js';
import type { UserEntity } from './common/database/models/user.model.js';
import { UserModel } from './common/database/models/user.model.js';
import type { OfferService } from './common/database/services/offer-service.interface.js';
import { MongoOfferService } from './common/database/services/offer.service.js';
import type { UserService } from './common/database/services/user-service.interface.js';
import { MongoUserService } from './common/database/services/user.service.js';
import {
  OFFER_MODEL,
  OFFER_SERVICE,
  USER_MODEL,
  USER_SERVICE,
} from './common/database/tokens.js';
import { LoggerService } from './common/logger/logger.service.js';

const container = new Container();

container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(LoggerService).toSelf().inSingletonScope();
container.bind(DatabaseService).toSelf().inSingletonScope();
container.bind(Application).toSelf().inSingletonScope();
container.bind(ImportCommand).toSelf();

container.bind<Model<UserEntity>>(USER_MODEL).toConstantValue(UserModel);
container.bind<Model<OfferEntity>>(OFFER_MODEL).toConstantValue(OfferModel);
container.bind<UserService>(USER_SERVICE).to(MongoUserService).inSingletonScope();
container.bind<OfferService>(OFFER_SERVICE).to(MongoOfferService).inSingletonScope();

export { container };
