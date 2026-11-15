import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import chalk from 'chalk';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../common/database/database.service.js';
import type { OfferService } from '../common/database/services/offer-service.interface.js';
import type { UserService } from '../common/database/services/user-service.interface.js';
import { OFFER_SERVICE, USER_SERVICE } from '../common/database/tokens.js';
import { LoggerService } from '../common/logger/logger.service.js';
import { parseOffer } from '../utils/parse-offer.js';

const printError = (message: string): void => {
  console.error(`${chalk.bgRed.white(' ОШИБКА ')} ${chalk.red(message)}`);
};

@injectable()
export class ImportCommand {
  constructor(
    @inject(DatabaseService) private readonly databaseService: DatabaseService,
    @inject(USER_SERVICE) private readonly userService: UserService,
    @inject(OFFER_SERVICE) private readonly offerService: OfferService,
    @inject(LoggerService) private readonly loggerService: LoggerService,
  ) {}

  public async execute(filePath?: string, dbUri?: string): Promise<void> {
    if (!filePath || !dbUri) {
      printError('Недостаточно аргументов. Используйте: --import <filepath> <db-uri>');
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

    let lineNumber = 0;
    let importedCount = 0;
    let skippedLinesCount = 0;
    let isConnected = false;

    console.log(chalk.bold.cyan(`Импорт данных из файла «${filePath}»`));
    console.log();

    try {
      await this.databaseService.connect(dbUri);
      isConnected = true;

      const input = createReadStream(filePath, { encoding: 'utf-8' });
      const lines = createInterface({ input, crlfDelay: Infinity });

      for await (const line of lines) {
        lineNumber += 1;

        if (line.trim() === '') {
          continue;
        }

        try {
          await this.saveOffer(line);
          importedCount += 1;
        } catch (error) {
          skippedLinesCount += 1;
          this.loggerService.warn('Строка пропущена из-за ошибки', { lineNumber, err: error });
        }
      }
    } catch (error) {
      this.loggerService.error('Не удалось выполнить импорт данных', { err: error });
      process.exitCode = 1;
      return;
    } finally {
      if (isConnected) {
        await this.databaseService.disconnect();
      }
    }

    if (importedCount === 0) {
      printError('Не удалось импортировать ни одного предложения.');
      process.exitCode = 1;
      return;
    }

    console.log();
    console.log(chalk.bold.green(`Импортировано предложений: ${importedCount}`));

    if (skippedLinesCount > 0) {
      console.log(chalk.yellow(`Пропущено строк с ошибками: ${skippedLinesCount}`));
      process.exitCode = 1;
    }
  }

  private async saveOffer(line: string): Promise<void> {
    const offer = parseOffer(line);
    let author = await this.userService.findByEmail(offer.author.email);

    if (!author) {
      author = await this.userService.create({
        name: offer.author.name,
        email: offer.author.email,
        avatarPath: offer.author.avatarPath,
        password: offer.author.password,
        type: offer.author.type,
      });
    }

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      type: offer.type,
      bedrooms: offer.bedrooms,
      guests: offer.guests,
      price: offer.price,
      amenities: offer.amenities,
      coordinates: offer.coordinates,
    }, author._id.toString());
  }
}
