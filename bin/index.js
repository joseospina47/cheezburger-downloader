#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import downloadImages from './images.js';
import options from './options.js';

const promptUser = async () => {
  const answers = await inquirer.prompt(Object.values(options));
  return Object.entries(answers).map(([key, value]) => `--${key}=${value}`);
};

const parseArgs = (args) => {
  const { amount, output } = yargs(hideBin(args))
    .options(options)
    .strict().argv;

  return { amount, output };
};

const main = async () => {
  try {
    const args = await promptUser();
    const { amount, output } = parseArgs([...process.argv, ...args]);
    await downloadImages(amount, output);
  } catch (error) {
    console.error(`Error downloading images: ${error.message}`);
    process.exit(1);
  }
};

main();
