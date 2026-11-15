import type { City } from '../../../types/index.js';
import type { CreateOfferDto, UpdateOfferDto } from '../dto/index.js';
import type { OfferDocument } from '../models/offer.model.js';

export interface OfferService {
  find(limit?: number): Promise<OfferDocument[]>;
  findById(id: string): Promise<OfferDocument | null>;
  create(dto: CreateOfferDto, authorId: string): Promise<OfferDocument>;
  update(id: string, dto: UpdateOfferDto, authorId: string): Promise<OfferDocument | null>;
  delete(id: string, authorId: string): Promise<boolean>;
  findPremiumByCity(city: City, limit?: number): Promise<OfferDocument[]>;
}
