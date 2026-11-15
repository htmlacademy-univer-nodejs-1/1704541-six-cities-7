import { inject, injectable } from 'inversify';
import { Types, type Model } from 'mongoose';
import type { CreateCommentDto } from '../dto/index.js';
import { COMMENT_MODEL, OFFER_MODEL } from '../tokens.js';
import type { CommentEntity, CommentDocument } from '../models/comment.model.js';
import type { OfferEntity } from '../models/offer.model.js';
import type { CommentService } from './comment-service.interface.js';

const DEFAULT_COMMENTS_LIMIT = 50;

@injectable()
export class MongoCommentService implements CommentService {
  constructor(
    @inject(COMMENT_MODEL) private readonly commentModel: Model<CommentEntity>,
    @inject(OFFER_MODEL) private readonly offerModel: Model<OfferEntity>,
  ) {}

  public findByOfferId(offerId: string, limit = DEFAULT_COMMENTS_LIMIT): Promise<CommentDocument[]> {
    return this.commentModel.find({ offerId })
      .sort({ publicationDate: -1 })
      .limit(limit)
      .populate('author')
      .exec();
  }

  public async create(
    offerId: string,
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<CommentDocument | null> {
    const offerExists = await this.offerModel.exists({ _id: offerId });

    if (!offerExists) {
      return null;
    }

    const comment = await this.commentModel.create({
      ...dto,
      publicationDate: new Date(),
      author: new Types.ObjectId(authorId),
      offerId: new Types.ObjectId(offerId),
    });

    await this.recalculateOfferStats(offerId);
    await comment.populate('author');

    return comment;
  }

  public async deleteByOfferId(offerId: string): Promise<void> {
    await this.commentModel.deleteMany({ offerId }).exec();
  }

  private async recalculateOfferStats(offerId: string): Promise<void> {
    const stats = await this.commentModel.aggregate<{
      commentsCount: number;
      averageRating: number;
    }>([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      {
        $group: {
          _id: '$offerId',
          commentsCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    const totals = stats[0];
    const commentsCount = totals?.commentsCount ?? 0;
    const rating = totals ? Math.round(totals.averageRating * 10) / 10 : 0;

    await this.offerModel.findByIdAndUpdate(offerId, {
      commentsCount,
      rating,
    }).exec();
  }
}
