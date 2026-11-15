import 'dotenv/config';
import convict from 'convict';
import validator from 'convict-format-with-validator';
import { injectable } from 'inversify';

convict.addFormats(validator);

export interface AppConfig {
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  salt: string;
}

const requiredStringFormat = (fieldName: string) => (value: unknown): void => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Значение ${fieldName} должно быть непустой строкой`);
  }
};

const configSchema = convict<AppConfig>({
  port: {
    doc: 'Порт, на котором приложение ожидает подключений',
    format: 'port',
    default: null,
    env: 'PORT',
  },
  dbHost: {
    doc: 'IP-адрес сервера базы данных',
    format: 'ipaddress',
    default: null,
    env: 'DB_HOST',
  },
  dbPort: {
    doc: 'Порт сервера базы данных',
    format: 'port',
    default: null,
    env: 'DB_PORT',
  },
  dbName: {
    doc: 'Имя базы данных',
    format: requiredStringFormat('DB_NAME'),
    default: null,
    env: 'DB_NAME',
  },
  salt: {
    doc: 'Соль для хеширования паролей',
    format: requiredStringFormat('SALT'),
    default: null,
    env: 'SALT',
  },
});

@injectable()
export class ConfigService {
  private readonly config: convict.Config<AppConfig>;

  constructor() {
    this.config = configSchema;
    this.config.validate({ allowed: 'strict' });
  }

  public get port(): number {
    return this.config.get('port');
  }

  public get dbHost(): string {
    return this.config.get('dbHost');
  }

  public get dbPort(): number {
    return this.config.get('dbPort');
  }

  public get dbName(): string {
    return this.config.get('dbName');
  }

  public get dbUri(): string {
    return `mongodb://${this.dbHost}:${this.dbPort}/${this.dbName}`;
  }

  public get salt(): string {
    return this.config.get('salt');
  }
}
