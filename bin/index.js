#! /usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import inquirer from 'inquirer';

const options = {
  amount: {
    message: 'How many images do you want to download?',
    name: 'amount',
    type: 'number',
    demandOption: true,
    default: 1,
  },
  threads: {
    message: 'How many threads do you want to use? (Default 1)',
    name: 'threads',
    type: 'number',
    demandOption: true,
    default: 1,
  },
  output: {
    message: 'What is the output folder?',
    name: 'output',
    type: 'string',
    demandOption: true,
    validate: (input) => !!input,
  },
};

(async () => {
  const answers = await inquirer.prompt(Object.values(options), (reply) =>
    console.log(reply.confirmed)
  );

  Object.entries(answers).forEach(([key, value]) => {
    process.argv.push(`--${key}`, value);
  });

  const parameters = yargs(hideBin(process.argv)).options(options).argv;

  console.log(parameters);
})();
