import type { OfferDocument, OfferEntity } from '../models/offer.model.js';

export type CreateOfferData = Omit<OfferEntity, 'createdAt' | 'updatedAt'>;

export interface OfferService {
  findById(id: string): Promise<OfferDocument | null>;
  create(offer: CreateOfferData): Promise<OfferDocument>;
}
