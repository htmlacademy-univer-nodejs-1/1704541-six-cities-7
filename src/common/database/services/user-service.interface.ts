import type { CreateUserDto } from '../dto/index.js';
import type { OfferDocument } from '../models/offer.model.js';
import type { UserDocument } from '../models/user.model.js';

export interface UserService {
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(dto: CreateUserDto): Promise<UserDocument>;
  addFavorite(userId: string, offerId: string): Promise<UserDocument | null>;
  removeFavorite(userId: string, offerId: string): Promise<UserDocument | null>;
  findFavorites(userId: string): Promise<OfferDocument[] | null>;
}
