import {
  AMENITIES,
  ARRAY_SEPARATOR,
  CITIES,
  OFFER_FIELDS_COUNT,
  OFFER_TYPES,
  TSV_SEPARATOR,
  USER_TYPES,
} from '../constants.js';
import type { Amenity, City, Offer, OfferType, UserType } from '../types/index.js';

const parseNumber = (value: string, fieldName: string): number => {
  if (value.trim() === '' || !Number.isFinite(Number(value))) {
    throw new Error(`Поле «${fieldName}» должно быть числом, получено: «${value}»`);
  }

  return Number(value);
};

const parseBoolean = (value: string, fieldName: string): boolean => {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`Поле «${fieldName}» должно быть true или false, получено: «${value}»`);
  }

  return value === 'true';
};

const parseDate = (value: string, fieldName: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Поле «${fieldName}» должно содержать корректную дату, получено: «${value}»`);
  }

  return date;
};

const parseEnum = <T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string,
): T => {
  if (!(allowedValues as readonly string[]).includes(value)) {
    throw new Error(
      `Поле «${fieldName}» содержит недопустимое значение «${value}». ` +
      `Допустимые значения: ${allowedValues.join(', ')}`,
    );
  }

  return value as T;
};

const parseList = <T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string,
): T[] => {
  const items = value.split(ARRAY_SEPARATOR).filter((item) => item.trim() !== '');

  if (items.length === 0) {
    throw new Error(`Поле «${fieldName}» должно содержать хотя бы одно значение`);
  }

  return items.map((item) => parseEnum(item, allowedValues, fieldName));
};

const parsePhotos = (value: string): string[] => {
  const photos = value.split(ARRAY_SEPARATOR).filter((photo) => photo.trim() !== '');

  if (photos.length === 0) {
    throw new Error('Список фотографий не может быть пустым');
  }

  return photos;
};

export const parseOffer = (line: string): Offer => {
  const values = line.replace(/\r$/, '').split(TSV_SEPARATOR);

  if (values.length !== OFFER_FIELDS_COUNT) {
    throw new Error(
      `Ожидалось полей: ${OFFER_FIELDS_COUNT}, получено: ${values.length}`,
    );
  }

  const [
    title,
    description,
    publicationDate,
    city,
    previewImage,
    photos,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    guests,
    price,
    amenities,
    authorName,
    authorEmail,
    authorAvatarPath,
    authorPassword,
    authorType,
    latitude,
    longitude,
  ] = values;

  return {
    title,
    description,
    publicationDate: parseDate(publicationDate, 'publicationDate'),
    city: parseEnum<City>(city, CITIES, 'city'),
    previewImage,
    photos: parsePhotos(photos),
    isPremium: parseBoolean(isPremium, 'isPremium'),
    isFavorite: parseBoolean(isFavorite, 'isFavorite'),
    rating: parseNumber(rating, 'rating'),
    type: parseEnum<OfferType>(type, OFFER_TYPES, 'type'),
    bedrooms: parseNumber(bedrooms, 'bedrooms'),
    guests: parseNumber(guests, 'guests'),
    price: parseNumber(price, 'price'),
    amenities: parseList<Amenity>(amenities, AMENITIES, 'amenities'),
    author: {
      name: authorName,
      email: authorEmail,
      avatarPath: authorAvatarPath || undefined,
      password: authorPassword,
      type: parseEnum<UserType>(authorType, USER_TYPES, 'author.type'),
    },
    commentsCount: 0,
    coordinates: {
      latitude: parseNumber(latitude, 'coordinates.latitude'),
      longitude: parseNumber(longitude, 'coordinates.longitude'),
    },
  };
};
