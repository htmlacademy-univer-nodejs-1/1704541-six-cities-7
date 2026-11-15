import { CITY_COORDINATES } from '../constants.js';
import type { MockServerData, Offer } from '../types/index.js';
import { getRandomBoolean, getRandomDate, getRandomFloat, getRandomItem, getRandomNumber } from './random.js';

const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_COMMENTS_COUNT = 50;
const MAX_COORDINATES_OFFSET = 0.005;

export class OfferGenerator {
  constructor(private readonly mockData: MockServerData) {
    if (mockData.offers.length === 0) {
      throw new Error('Список заготовок предложений пуст');
    }

    if (mockData.users.length === 0) {
      throw new Error('Список заготовок пользователей пуст');
    }
  }

  public generate(): Offer {
    const baseOffer = getRandomItem(this.mockData.offers);
    const author = getRandomItem(this.mockData.users);
    const cityCoordinates = CITY_COORDINATES[baseOffer.city];
    const now = new Date();

    return {
      ...baseOffer,
      publicationDate: getRandomDate(new Date(now.getTime() - ONE_YEAR_IN_MS), now),
      isFavorite: getRandomBoolean(),
      rating: getRandomFloat(1, 5, 1),
      author: { ...author },
      commentsCount: getRandomNumber(0, MAX_COMMENTS_COUNT),
      coordinates: {
        latitude: Number(
          (cityCoordinates.latitude + getRandomFloat(-MAX_COORDINATES_OFFSET, MAX_COORDINATES_OFFSET, 6))
            .toFixed(6),
        ),
        longitude: Number(
          (cityCoordinates.longitude + getRandomFloat(-MAX_COORDINATES_OFFSET, MAX_COORDINATES_OFFSET, 6))
            .toFixed(6),
        ),
      },
    };
  }
}
