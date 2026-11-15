import type { Amenity, City, Coordinates, OfferType } from '../../../types/index.js';

export interface CreateOfferDto {
  title: string;
  description: string;
  publicationDate?: Date;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  type: OfferType;
  bedrooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  coordinates: Coordinates;
}
