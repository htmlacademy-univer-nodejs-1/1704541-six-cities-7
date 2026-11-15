import { inject, injectable } from 'inversify';
import type { Model } from 'mongoose';
import { OFFER_MODEL } from '../tokens.js';
import type { OfferEntity, OfferDocument } from '../models/offer.model.js';
import type { CreateOfferData, OfferService } from './offer-service.interface.js';

@injectable()
export class MongoOfferService implements OfferService {
  constructor(@inject(OFFER_MODEL) private readonly offerModel: Model<OfferEntity>) {}

  public findById(id: string): Promise<OfferDocument | null> {
    return this.offerModel.findById(id).exec();
  }

  public create(offer: CreateOfferData): Promise<OfferDocument> {
    return this.offerModel.create(offer);
  }
}
