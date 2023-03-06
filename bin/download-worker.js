import download from 'download';
import { parentPort } from 'worker_threads';

const downloadWorker = async (imageUrl, output) => {
  try {
    const result = await download(imageUrl, output);
    parentPort.postMessage(result);
  } catch (error) {
    throw new Error(`\n\nFailed to download image: ${error.message}`);
  }
};

parentPort.on('message', async (msg) => {
  const { imageUrl, output } = msg;
  await downloadWorker(imageUrl, output);
});
