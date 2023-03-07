import ora from 'ora';

const displayProgress = () => {
  const start = Date.now();
  const spinner = ora(`Downloading images...\n`).start();

  const onFinish = () => {
    const totalTime = (Date.now() - start) / 1000;
    spinner.succeed(`Download complete in ${totalTime} seconds.`);
  };

  return onFinish;
};

export default displayProgress;
