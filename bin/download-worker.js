import download from 'download';
import { parentPort } from 'worker_threads';

const downloadWorker = async (imageUrl, output) => {
  try {
    const result = await download(imageUrl, output);
    parentPort.postMessage(result);
  } catch (error) {
    console.error(`\n\nError saving the image: ${imageUrl} - ${error.message}`);
  }
};

parentPort.on('message', async (msg) => {
  const { imageUrl, output } = msg;
  await downloadWorker(imageUrl, output);
});
