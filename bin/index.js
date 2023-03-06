#!/usr/bin/env node

import inquirer from 'inquirer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import displayProgress from './progress.js';
import downloadImages from './images.js';
import { OPTIONS } from './constants.js';

const promptUser = async () => {
  const answers = await inquirer.prompt(Object.values(OPTIONS));
  return Object.entries(answers).map(([key, value]) => `--${key}=${value}`);
};

const parseArgs = (args) => {
  const { amount, threads, output } = yargs(hideBin(args))
    .options(OPTIONS)
    .strict().argv;

  return { amount, threads, output };
};

const init = async () => {
  try {
    const args = await promptUser();
    const { amount, threads, output } = parseArgs([...process.argv, ...args]);
    const { onProgress, onFinish } = displayProgress(amount);
    await downloadImages(amount, threads, output, onProgress);
    onFinish();
  } catch (error) {
    console.error(`\n\nError downloading images: ${error.message}.`);
    process.exit(1);
  }
};

init();
