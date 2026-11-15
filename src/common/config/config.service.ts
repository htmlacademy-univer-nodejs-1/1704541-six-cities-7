import 'dotenv/config';
import convict from 'convict';
import validator from 'convict-format-with-validator';
import { injectable } from 'inversify';

convict.addFormats(validator);

export interface AppConfig {
  port: number;
  dbHost: string;
  salt: string;
}

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
  salt: {
    doc: 'Соль для хеширования паролей',
    format: (value: unknown) => {
      if (typeof value !== 'string' || value.length === 0) {
        throw new Error('Значение SALT должно быть непустой строкой');
      }
    },
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

  public get salt(): string {
    return this.config.get('salt');
  }
}
