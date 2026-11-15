import type { Offer } from './offer.type.js';
import type { User } from './user.type.js';

export type MockOffer = Omit<
  Offer,
  'publicationDate' | 'isFavorite' | 'rating' | 'author' | 'commentsCount' | 'coordinates'
>;

export type MockUser = User;

export interface MockServerData {
  offers: MockOffer[];
  users: MockUser[];
}
