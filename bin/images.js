import axios from 'axios';
import path from 'path';
import { StaticPool } from 'node-worker-threads-pool';

export const cheezburgerUrl = 'https://search.cheezburger.com/api/search';

const getImagesList = async (imagesAmount) => {
  const formData = new FormData();
  formData.append('pageSize', imagesAmount);
  formData.append('q', 'cats'); // Search criteria

  try {
    const response = await axios.post(cheezburgerUrl, formData);
    return response.data.Results;
  } catch (error) {
    throw new Error(
      `Failed getting image list from ${cheezburgerUrl} (error ${error.message}).`
    );
  }
};

const getChunk = (workerAmount, index, images) => {
  const chunkSize = Math.ceil(images.length / workerAmount);
  const startIndex = index * chunkSize;
  const endIndex = (index + 1) * chunkSize;
  const imageChunk = images.slice(startIndex, endIndex);
  const sanitizedChunk = imageChunk.map((image) =>
    image.ThumbnailUrl.replace('thumb400', 'full')
  );

  return sanitizedChunk;
};

// Creates the pool and put each worker to download images.
const downloadImages = async (imageAmount, workerAmount, output) => {
  try {
    const images = await getImagesList(imageAmount);
    const currentDir = path.dirname(new URL(import.meta.url).pathname);

    const workerPool = new StaticPool({
      size: workerAmount,
      task: `${currentDir}/download-worker.js`,
    });

    const workerPromises = [];
    for (let i = 0; i < workerAmount; i++) {
      const imagesUrl = getChunk(workerAmount, i, images);
      workerPromises.push(workerPool.exec({ imagesUrl, output }));
    }

    await Promise.all(workerPromises);
    workerPool.destroy();
  } catch (error) {
    console.error(`\nError downloading images: ${error.message}.`);
  }
};

export default downloadImages;
