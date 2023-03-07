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
  const { amount, threads, output } = yargs(hideBin(args))
    .options(options)
    .strict().argv;

  return { amount, threads, output };
};

const displayProgress = () => {
  const start = Date.now();
  const spinner = ora(`Downloading images...\n`).start();

  const onFinish = () => {
    const totalTime = (Date.now() - start) / 1000;
    spinner.succeed(`Download complete in ${totalTime} seconds.`);
  };

  return onFinish;
};

const init = async () => {
  try {
    const args = await promptUser();
    const { amount, threads, output } = parseArgs([...process.argv, ...args]);
    const onFinish = displayProgress(amount);
    await downloadImages(amount, threads, output);
    onFinish();
  } catch (error) {
    console.error(`\nError processing images: ${error.message}.`);
    process.exit(1);
  }
};

init();
