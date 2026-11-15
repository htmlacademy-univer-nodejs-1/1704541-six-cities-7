import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import axios from 'axios';
import chalk from 'chalk';
import type { MockOffer, MockServerData, MockUser } from '../types/index.js';
import { OfferGenerator } from '../utils/offer-generator.js';
import { offerToTsv } from '../utils/offer-to-tsv.js';

const printError = (message: string): void => {
  console.error(`${chalk.bgRed.white(' ОШИБКА ')} ${chalk.red(message)}`);
};

const parseCount = (value: string): number => {
  const count = Number(value);

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`Количество предложений должно быть целым положительным числом, получено: «${value}»`);
  }

  return count;
};

const fetchMockData = async (url: string): Promise<MockServerData> => {
  const baseUrl = url.endsWith('/') ? url : `${url}/`;

  const [offersResponse, usersResponse] = await Promise.all([
    axios.get<MockOffer[]>(new URL('offers', baseUrl).toString()),
    axios.get<MockUser[]>(new URL('users', baseUrl).toString()),
  ]);

  return {
    offers: offersResponse.data,
    users: usersResponse.data,
  };
};

function* createOfferLines(generator: OfferGenerator, count: number): Generator<string> {
  for (let index = 0; index < count; index += 1) {
    yield `${offerToTsv(generator.generate())}\n`;
  }
}

export const generateData = async (
  countValue?: string,
  filePath?: string,
  url?: string,
): Promise<void> => {
  if (!countValue || !filePath || !url) {
    printError('Недостаточно аргументов. Используйте: --generate <n> <filepath> <url>');
    process.exitCode = 1;
    return;
  }

  let count: number;

  try {
    count = parseCount(countValue);
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  console.log(chalk.bold.cyan(`Получение данных с JSON-сервера «${url}»`));

  let mockData: MockServerData;

  try {
    mockData = await fetchMockData(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    printError(`Не удалось получить данные с JSON-сервера: ${message}`);
    process.exitCode = 1;
    return;
  }

  let generator: OfferGenerator;

  try {
    generator = new OfferGenerator(mockData);
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  try {
    await mkdir(dirname(filePath), { recursive: true });
    await pipeline(
      Readable.from(createOfferLines(generator, count)),
      createWriteStream(filePath, { encoding: 'utf-8' }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    printError(`Не удалось записать данные в файл: ${message}`);
    process.exitCode = 1;
    return;
  }

  console.log(chalk.bold.green(`Сгенерировано предложений: ${count}`));
  console.log(`${chalk.gray('Файл:')} ${chalk.blue(filePath)}`);
};
