import { readFile } from 'node:fs/promises';
import chalk from 'chalk';

interface PackageInfo {
  version: string;
}

export const printVersion = async (): Promise<void> => {
  const packagePath = new URL('../../package.json', import.meta.url);
  const packageContent = await readFile(packagePath, { encoding: 'utf-8' });
  const { version } = JSON.parse(packageContent) as PackageInfo;

  console.log(chalk.green(version));
};
