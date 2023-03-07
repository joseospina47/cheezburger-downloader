import axios from 'axios';
import fs from 'fs';
import { parentPort } from 'worker_threads';
import path from 'path';
import { pipeline } from 'stream/promises';

const downloadImage = async (imageUrl, output) => {
  const response = await axios.get(imageUrl, { responseType: 'stream' });
  const contentType = response.headers['content-type'];
  const fileExt = contentType.split('/')[1];
  const fileName = path.basename(imageUrl, path.extname(imageUrl));

  const dest = fs.createWriteStream(`${output}/${fileName}.${fileExt}`);
  await pipeline(response.data, dest);
};

const validateDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

parentPort.on('message', async ({ imageUrl, output }) => {
  try {
    validateDirectory(output);
    await downloadImage(imageUrl, output);
    parentPort.postMessage('success');
  } catch (error) {
    console.error(`\nError saving image: ${imageUrl} - ${error.message}.\n`);
    parentPort.postMessage('error');
  }
});
