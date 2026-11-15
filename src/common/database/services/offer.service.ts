import { inject, injectable } from 'inversify';
import { Types, type Model } from 'mongoose';
import type { City } from '../../../types/index.js';
import type { CreateOfferDto, UpdateOfferDto } from '../dto/index.js';
import { COMMENT_SERVICE, OFFER_MODEL } from '../tokens.js';
import type { OfferEntity, OfferDocument } from '../models/offer.model.js';
import type { CommentService } from './comment-service.interface.js';
import type { OfferService } from './offer-service.interface.js';

const DEFAULT_OFFERS_LIMIT = 60;
const PREMIUM_OFFERS_LIMIT = 3;

@injectable()
export class MongoOfferService implements OfferService {
  constructor(
    @inject(OFFER_MODEL) private readonly offerModel: Model<OfferEntity>,
    @inject(COMMENT_SERVICE) private readonly commentService: CommentService,
  ) {}

  public find(limit = DEFAULT_OFFERS_LIMIT): Promise<OfferDocument[]> {
    return this.offerModel.find()
      .sort({ publicationDate: -1 })
      .limit(limit)
      .populate('author')
      .exec();
  }

  public findById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findById(id)
      .populate('author')
      .exec();
  }

  public create(dto: CreateOfferDto, authorId: string): Promise<OfferDocument> {
    return this.offerModel.create({
      ...dto,
      publicationDate: dto.publicationDate ?? new Date(),
      author: new Types.ObjectId(authorId),
      isFavorite: false,
      commentsCount: 0,
      rating: 0,
    });
  }

  public update(
    id: string,
    dto: UpdateOfferDto,
    authorId: string,
  ): Promise<OfferDocument | null> {
    return this.offerModel.findOneAndUpdate(
      { _id: id, author: new Types.ObjectId(authorId) },
      { $set: dto },
      { new: true, runValidators: true },
    )
      .populate('author')
      .exec();
  }

  public async delete(id: string, authorId: string): Promise<boolean> {
    const deletedOffer = await this.offerModel.findOneAndDelete({
      _id: id,
      author: new Types.ObjectId(authorId),
    }).exec();

    if (!deletedOffer) {
      return false;
    }

    await this.commentService.deleteByOfferId(id);

    return true;
  }

  public findPremiumByCity(
    city: City,
    limit = PREMIUM_OFFERS_LIMIT,
  ): Promise<OfferDocument[]> {
    return this.offerModel.find({ city, isPremium: true })
      .sort({ publicationDate: -1 })
      .limit(limit)
      .populate('author')
      .exec();
  }
}
