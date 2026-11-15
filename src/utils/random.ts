export const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomFloat = (min: number, max: number, precision = 1): number => {
  const factor = 10 ** precision;

  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

export const getRandomItem = <T>(items: readonly T[]): T => {
  if (items.length === 0) {
    throw new Error('Невозможно выбрать случайный элемент из пустого массива');
  }

  return items[getRandomNumber(0, items.length - 1)];
};

export const getRandomBoolean = (): boolean => Math.random() < 0.5;

export const getRandomDate = (from: Date, to: Date): Date =>
  new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
