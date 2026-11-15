#!/usr/bin/env node

import 'reflect-metadata';
import chalk from 'chalk';
import { ImportCommand } from './commands/import.command.js';
import { generateData } from './commands/generate.command.js';
import { printHelp } from './commands/help.command.js';
import { printVersion } from './commands/version.command.js';
import { container } from './container.js';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case '--version':
    await printVersion();
    break;
  case '--help':
    printHelp();
    break;
  case '--import': {
    const importCommand = container.get(ImportCommand);
    await importCommand.execute(args[0], args[1]);
    break;
  }
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
