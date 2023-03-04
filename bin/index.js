#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import inquirer from 'inquirer';

import downloadImages from './api.js';

const options = {
  amount: {
    message: 'How many images do you want to download?',
    name: 'amount',
    type: 'number',
    demandOption: true,
    default: 1,
    validate: (input) => input > 0,
  },
  threads: {
    message: 'How many threads do you want to use? (Default 1)',
    name: 'threads',
    type: 'number',
    demandOption: true,
    default: 1,
    validate: (input) => input > 0,
  },
  output: {
    message: 'What is the output folder?',
    name: 'output',
    type: 'string',
    demandOption: true,
    validate: (input) => !!input,
  },
};

const promptUser = async () => {
  const answers = await inquirer.prompt(Object.values(options));
  const args = Object.entries(answers).map(
    ([key, value]) => `--${key}=${value}`
  );
  return args;
};

const main = async () => {
  const args = await promptUser();
  const { amount, output } = yargs(hideBin([...process.argv, ...args])).options(
    options
  ).argv;
  await downloadImages(amount, output);
};

main();
