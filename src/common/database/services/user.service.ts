import { inject, injectable } from 'inversify';
import type { Model } from 'mongoose';
import type { User } from '../../../types/index.js';
import { USER_MODEL } from '../tokens.js';
import type { UserEntity, UserDocument } from '../models/user.model.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class MongoUserService implements UserService {
  constructor(@inject(USER_MODEL) private readonly userModel: Model<UserEntity>) {}

  public findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public create(user: User): Promise<UserDocument> {
    return this.userModel.create(user);
  }
}
