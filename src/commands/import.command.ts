import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import chalk from 'chalk';
import type { Offer } from '../types/index.js';
import { formatOffer } from '../utils/format-offer.js';
import { parseOffer } from '../utils/parse-offer.js';

const printError = (message: string): void => {
  console.error(`${chalk.bgRed.white(' ОШИБКА ')} ${chalk.red(message)}`);
};

export const importData = async (filePath?: string): Promise<void> => {
  if (!filePath) {
    printError('Не указан путь к файлу. Используйте: --import <path>');
    process.exitCode = 1;
    return;
  }

  try {
    await stat(filePath);
  } catch {
    printError(`Файл не найден: ${filePath}`);
    process.exitCode = 1;
    return;
  }

  const offers: Offer[] = [];
  let lineNumber = 0;
  let skippedLinesCount = 0;

  console.log(chalk.bold.cyan(`Импорт данных из файла «${filePath}»`));
  console.log();

  try {
    const input = createReadStream(filePath, { encoding: 'utf-8' });
    const lines = createInterface({ input, crlfDelay: Infinity });

    for await (const line of lines) {
      lineNumber += 1;

      if (line.trim() === '') {
        continue;
      }

      try {
        offers.push(parseOffer(line));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        skippedLinesCount += 1;
        console.error(chalk.yellow(`Строка ${lineNumber} пропущена: ${message}`));
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    printError(`Не удалось прочитать файл: ${message}`);
    process.exitCode = 1;
    return;
  }

  if (offers.length === 0) {
    printError('Не удалось импортировать ни одного предложения.');
    process.exitCode = 1;
    return;
  }

  offers.forEach((offer, index) => console.log(formatOffer(offer, index + 1)));
  console.log();

  console.log(chalk.bold.green(`Импортировано предложений: ${offers.length}`));

  if (skippedLinesCount > 0) {
    console.log(chalk.yellow(`Пропущено строк с ошибками: ${skippedLinesCount}`));
    process.exitCode = 1;
  }
};
