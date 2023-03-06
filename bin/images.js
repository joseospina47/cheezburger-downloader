import { StaticPool } from 'node-worker-threads-pool';
import path from 'path';

import { CHEEZBURGER_URL } from './constants.js';

const fetchImages = async (imagesAmount) => {
  const formData = new FormData();
  formData.append('pageSize', imagesAmount);
  formData.append('q', 'cats'); // Search criteria

  const response = await fetch(CHEEZBURGER_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve images from ${CHEEZBURGER_URL} (status ${response.status})`
    );
  }

  const { Results: images } = await response.json();
  return images;
};

const downloadImages = async (imageAmount, workerAmount, output) => {
  const images = await fetchImages(imageAmount);
  const currentDir = path.dirname(new URL(import.meta.url).pathname);

  const workerPool = new StaticPool({
    size: workerAmount,
    task: `${currentDir}/download-worker.js`,
  });

  const promises = images.map(async (image) => {
    const imageUrl = image.ThumbnailUrl.replace('thumb400', 'full');
    await workerPool.exec({ imageUrl, output });
  });

  await Promise.all(promises);
  workerPool.destroy();
};

export default downloadImages;
