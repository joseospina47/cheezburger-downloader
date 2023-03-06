import axios from 'axios';
import path from 'path';
import { StaticPool } from 'node-worker-threads-pool';

import { CHEEZBURGER_URL } from './constants.js';

const getImagesList = async (imagesAmount) => {
  const formData = new FormData();
  formData.append('pageSize', imagesAmount);
  formData.append('q', 'cats'); // Search criteria

  try {
    const response = await axios.post(CHEEZBURGER_URL, formData);
    return response.data.Results;
  } catch (error) {
    throw new Error(
      `Failed getting image list from ${CHEEZBURGER_URL} (error ${error.message}).`
    );
  }
};

// Creates the pool and put each worker to download images.
const downloadImages = async (
  imageAmount,
  workerAmount,
  output,
  onProgress
) => {
  try {
    const images = await getImagesList(imageAmount);
    const currentDir = path.dirname(new URL(import.meta.url).pathname);

    // Necessary for the CLI progress bar.
    const progressIncrement = 1 / images.length;
    let progress = 0;

    const workerPool = new StaticPool({
      size: workerAmount,
      task: `${currentDir}/download-worker.js`,
    });

    const promises = images.map(async (image, index) => {
      const imageUrl = image.ThumbnailUrl.replace('thumb400', 'full');
      await workerPool.exec({ imageUrl, output });

      progress += progressIncrement;
      onProgress(progress, imageAmount);
    });

    await Promise.all(promises);

    workerPool.destroy();
  } catch (error) {
    console.error(`\n\nError processing images: ${error.message}.`);
  }
};

export default downloadImages;
