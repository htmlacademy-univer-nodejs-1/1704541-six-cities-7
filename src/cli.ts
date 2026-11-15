#!/usr/bin/env node

import chalk from 'chalk';
import { generateData } from './commands/generate.command.js';
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
  case '--generate':
    await generateData(args[0], args[1], args[2]);
    break;
  case undefined:
    printHelp();
    break;
  default:
    console.error(chalk.red(`Неизвестная команда: ${command}`));
    printHelp();
    process.exitCode = 1;
}
