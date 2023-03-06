#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import downloadImages from './images.js';
import { OPTIONS } from './constants.js';

const promptUser = async () => {
  const answers = await inquirer.prompt(Object.values(OPTIONS));
  return Object.entries(answers).map(([key, value]) => `--${key}=${value}`);
};

const parseArgs = (args) => {
  console.log(yargs(hideBin(args)).options(OPTIONS).strict().argv);

  const { amount, threads, output } = yargs(hideBin(args))
    .options(OPTIONS)
    .strict().argv;

  return { amount, threads, output };
};

const startDownload = async (imageAmount, workerAmount, output) => {
  const start = Date.now();

  const spinner = ora(
    `Downloading ${imageAmount} image${imageAmount > 1 ? 's' : ''}`
  ).start();
  await downloadImages(imageAmount, workerAmount, output);

  const totalTime = (Date.now() - start) / 1000;
  spinner.succeed(`Download complete in ${totalTime} seconds`);
};

const init = async () => {
  try {
    const args = await promptUser();
    const { amount, threads, output } = parseArgs([...process.argv, ...args]);

    await startDownload(amount, threads, output);
  } catch (error) {
    console.error(`\n\nError downloading images: ${error.message}`);
    process.exit(1);
  }
};

init();
