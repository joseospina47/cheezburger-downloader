// Inquirer changes the value to NaN if it fails
const options = {
  amount: {
    message: 'How many images do you want to download?',
    name: 'amount',
    type: 'number',
    demandOption: true,
    validate: (input) => {
      if (!Number.isNaN(input) && input > 0) {
        return true;
      }
      return 'Amount must be a number greater than 0.';
    },
    filter: (input) => (Number.isNaN(input) || input < 1 ? undefined : input),
  },
  threads: {
    message: 'How many threads do you want to use?',
    name: 'threads',
    type: 'number',
    demandOption: true,
    validate: (input) => {
      if (!Number.isNaN(input) && input >= 1 && input <= 5) {
        return true;
      }
      return 'Threads must be a number between 1 and 5.';
    },
    filter: (input) =>
      Number.isNaN(input) || input < 1 || input > 5 ? undefined : input,
  },
  output: {
    message: 'What is the output folder?',
    name: 'output',
    type: 'string',
    demandOption: true,
    validate: (input) => !!input.trim(),
  },
};

export default options;
