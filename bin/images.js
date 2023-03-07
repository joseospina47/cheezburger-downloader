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

// Creates the pool and put each worker to download images.
const downloadImages = async (
  imageAmount,
  workerAmount,
  output,
  trackPogress
) => {
  try {
    const images = await getImagesList(imageAmount);
    const currentDir = path.dirname(new URL(import.meta.url).pathname);

    const workerPool = new StaticPool({
      size: workerAmount,
      task: `${currentDir}/download-worker.js`,
    });

    const promises = images.map(async (image) => {
      const imageUrl = image.ThumbnailUrl.replace('thumb400', 'full');
      await workerPool.exec({ imageUrl, output });

      trackPogress();
    });

    await Promise.all(promises);
    await workerPool.destroy();
  } catch (error) {
    console.error(`\nError downloading images: ${error.message}.`);
  }
};

export default downloadImages;
