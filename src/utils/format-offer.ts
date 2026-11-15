import chalk from 'chalk';
import type { Offer } from '../types/index.js';

const formatBoolean = (value: boolean): string => value ? chalk.green('да') : chalk.gray('нет');

export const formatOffer = (offer: Offer, index: number): string => {
  const amenities = offer.amenities.map((amenity) => chalk.cyan(amenity)).join(', ');

  return [
    chalk.bold.green(`${index}. ${offer.title}`),
    `   ${chalk.gray('Город:')} ${chalk.yellow(offer.city)}  ` +
      `${chalk.gray('Тип жилья:')} ${chalk.yellow(offer.type)}  ` +
      `${chalk.gray('Комнат:')} ${chalk.yellow(offer.bedrooms)}  ` +
      `${chalk.gray('Гостей:')} ${chalk.yellow(offer.guests)}`,
    `   ${chalk.gray('Цена:')} ${chalk.yellow(offer.price.toLocaleString('ru-RU'))} ₽/ночь  ` +
      `${chalk.gray('Рейтинг:')} ${chalk.yellow(offer.rating)}  ` +
      `${chalk.gray('Премиум:')} ${formatBoolean(offer.isPremium)}  ` +
      `${chalk.gray('Избранное:')} ${formatBoolean(offer.isFavorite)}`,
    `   ${chalk.gray('Автор:')} ${chalk.magenta(offer.author.name)} ` +
      `${chalk.gray(`<${offer.author.email}>`)} ${chalk.gray(`(${offer.author.type})`)}`,
    `   ${chalk.gray('Координаты:')} ${chalk.yellow(`${offer.coordinates.latitude}, ${offer.coordinates.longitude}`)}`,
    `   ${chalk.gray('Удобства:')} ${amenities}`,
    `   ${chalk.gray('Фотографии:')} ${chalk.yellow(`${offer.photos.length} шт.`)}  ` +
      `${chalk.gray('Превью:')} ${chalk.blue(offer.previewImage)}`,
    `   ${chalk.gray('Дата публикации:')} ${chalk.yellow(offer.publicationDate.toLocaleDateString('ru-RU'))}`,
  ].join('\n');
};
