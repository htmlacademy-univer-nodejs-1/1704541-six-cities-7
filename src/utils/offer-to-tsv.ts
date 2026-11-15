import { ARRAY_SEPARATOR, TSV_SEPARATOR } from '../constants.js';
import type { Offer } from '../types/index.js';

const escapeField = (value: string): string => value.replace(/[\t\r\n]+/g, ' ');

export const offerToTsv = (offer: Offer): string => [
  escapeField(offer.title),
  escapeField(offer.description),
  offer.publicationDate.toISOString(),
  offer.city,
  escapeField(offer.previewImage),
  escapeField(offer.photos.join(ARRAY_SEPARATOR)),
  String(offer.isPremium),
  String(offer.isFavorite),
  String(offer.rating),
  offer.type,
  String(offer.bedrooms),
  String(offer.guests),
  String(offer.price),
  escapeField(offer.amenities.join(ARRAY_SEPARATOR)),
  escapeField(offer.author.name),
  escapeField(offer.author.email),
  escapeField(offer.author.avatarPath ?? ''),
  escapeField(offer.author.password),
  offer.author.type,
  String(offer.coordinates.latitude),
  String(offer.coordinates.longitude),
].join(TSV_SEPARATOR);
