#!/usr/bin/env node

import chalk from 'chalk';
import { printHelp } from './commands/help.command.js';
import { importData } from './commands/import.command.js';
import { printVersion } from './commands/version.command.js';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case '--version':
    await printVersion();
    break;
  case '--help':
    printHelp();
    break;
  case '--import':
    await importData(args[0]);
    break;
  case undefined:
    printHelp();
    break;
  default:
    console.error(chalk.red(`Неизвестная команда: ${command}`));
    printHelp();
    process.exitCode = 1;
}
