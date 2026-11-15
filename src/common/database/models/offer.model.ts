import { Schema, Types, model, type HydratedDocument } from 'mongoose';
import { AMENITIES, CITIES, OFFER_TYPES } from '../../../constants.js';
import type { Coordinates, Offer } from '../../../types/index.js';

export interface OfferEntity extends Omit<Offer, 'author'> {
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const coordinatesSchema = new Schema<Coordinates>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    _id: false,
  },
);

const offerSchema = new Schema<OfferEntity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    city: { type: String, enum: [...CITIES], required: true },
    previewImage: { type: String, required: true },
    photos: { type: [String], required: true },
    isPremium: { type: Boolean, required: true },
    isFavorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    type: { type: String, enum: [...OFFER_TYPES], required: true },
    bedrooms: { type: Number, required: true },
    guests: { type: Number, required: true },
    price: { type: Number, required: true },
    amenities: { type: [String], enum: [...AMENITIES], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentsCount: { type: Number, default: 0 },
    coordinates: { type: coordinatesSchema, required: true },
  },
  {
    timestamps: true,
    collection: 'offers',
  },
);

export type OfferDocument = HydratedDocument<OfferEntity>;

export const OfferModel = model<OfferEntity>('Offer', offerSchema);
