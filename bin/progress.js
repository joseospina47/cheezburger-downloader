import emoji from 'node-emoji';
import ProgressBar from 'progress';

const displayProgress = (amount) => {
  const computer = emoji.get('computer');
  const download = emoji.get('arrow_heading_down');
  const checkMark = emoji.get('white_check_mark');
  const start = Date.now();

  console.log(`\n${computer}  Setting everything up...\n`);
  const progressBar = new ProgressBar(
    `${download}  Downloading [:bar] :percent`,
    { total: amount, width: 40, clear: true }
  );

  const trackPogress = () => {
    progressBar.tick();
  };

  const terminateProgress = () => {
    progressBar.terminate();
    console.log(
      `${checkMark}  Downloaded image(s) in ${(Date.now() - start) / 1000} seconds.`
    );
  };

  return {
    trackPogress,
    terminateProgress,
  };
};

export default displayProgress;
