#!/usr/bin/env node

import inquirer from 'inquirer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import displayProgress from './progress.js';
import downloadImages from './images.js';
import options from './options.js';

const promptUser = async () => {
  const answers = await inquirer.prompt(Object.values(options));
  return Object.entries(answers).map(([key, value]) => `--${key}=${value}`);
};

const parseArgs = (args) => {
  const { amount, threads, output } = yargs(hideBin(args))
    .options(options)
    .strict().argv;

  return { amount, threads, output };
};

const init = async () => {
  try {
    const args = await promptUser();
    const { amount, threads, output } = parseArgs([...process.argv, ...args]);
    const { trackPogress, terminateProgress } = displayProgress(amount);
    await downloadImages(amount, threads, output, trackPogress);
    terminateProgress();
  } catch (error) {
    console.error(`\nError processing images: ${error.message}.`);
    process.exit(1);
  }
};

init();
