// download-worker.js

import axios from 'axios';
import fs from 'fs';
import { parentPort } from 'worker_threads';
import path from 'path';
import { pipeline } from 'stream/promises';

const downloadImage = async (imagesUrl, output) => {
  const results = imagesUrl.map(async (imageUrl) => {
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      timeout: 1800000,
    });
    const contentType = response.headers['content-type'];
    const fileExt = contentType.split('/')[1];
    const fileName = path.basename(imageUrl, path.extname(imageUrl));
    const dest = fs.createWriteStream(`${output}/${fileName}.${fileExt}`);
    await pipeline(response.data, dest);

    response.data.destroy();
    dest.end();
  });
  await Promise.all(results);
};

const validateDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

parentPort.on('message', async ({ imagesUrl, output }) => {
  try {
    validateDirectory(output);
    await downloadImage(imagesUrl, output);
    parentPort.postMessage('success');
  } catch (error) {
    console.error(`\nError saving images: ${error.message}.\n`);
    parentPort.postMessage('error');
  }
});
