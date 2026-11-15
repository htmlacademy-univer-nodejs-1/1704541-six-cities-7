import { inject, injectable } from 'inversify';
import type { Model } from 'mongoose';
import type { CreateUserDto } from '../dto/index.js';
import { OFFER_MODEL, USER_MODEL } from '../tokens.js';
import type { OfferEntity, OfferDocument } from '../models/offer.model.js';
import type { UserEntity, UserDocument } from '../models/user.model.js';
import type { UserService } from './user-service.interface.js';

@injectable()
export class MongoUserService implements UserService {
  constructor(
    @inject(USER_MODEL) private readonly userModel: Model<UserEntity>,
    @inject(OFFER_MODEL) private readonly offerModel: Model<OfferEntity>,
  ) {}

  public findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public create(dto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(dto);
  }

  public async addFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    const offerExists = await this.offerModel.exists({ _id: offerId });

    if (!offerExists) {
      return null;
    }

    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: offerId } },
      { new: true },
    ).exec();
  }

  public removeFavorite(userId: string, offerId: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: offerId } },
      { new: true },
    ).exec();
  }

  public async findFavorites(userId: string): Promise<OfferDocument[] | null> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      return null;
    }

    return this.offerModel.find({ _id: { $in: user.favorites } })
      .sort({ publicationDate: -1 })
      .populate('author')
      .exec();
  }
}
