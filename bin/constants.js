export const OPTIONS = {
  amount: {
    message: 'How many images do you want to download?',
    name: 'amount',
    type: 'number',
    demandOption: true,
    default: 1,
    validate: (input) => input > 0,
  },
  threads: {
    message: 'How many threads do you want to use?',
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

export const CHEEZBURGER_URL = 'https://search.cheezburger.com/api/search';
