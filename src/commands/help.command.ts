import chalk from 'chalk';

export const printHelp = (): void => {
  const commands = [
    ['--version', 'выводит номер версии'],
    ['--help', 'печатает этот текст'],
    ['--import <path> <db-uri>', 'импортирует данные из TSV в MongoDB'],
    ['--generate <n> <path> <url>', 'генерирует произвольное количество тестовых данных'],
  ];

  console.log(chalk.bold.cyan('Программа для подготовки данных для REST API сервера.'));
  console.log();
  console.log(chalk.gray('Пример:'));
  console.log(`  ${chalk.yellow('cli.js')} ${chalk.green('--<command>')} ${chalk.blue('[--arguments]')}`);
  console.log();
  console.log(chalk.bold('Команды:'));

  commands.forEach(([command, description]) => {
    console.log(`  ${chalk.green(command.padEnd(31))} ${chalk.gray(`# ${description}`)}`);
  });
};
