import axios from 'axios';
import path from 'path';
import { StaticPool } from 'node-worker-threads-pool';

export const cheezburgerUrl = 'https://search.cheezburger.com/api/search';

const getFormData = (index, chunkSize, imagesAmount) => {
  const page = index + 1;
  const start = index * chunkSize;
  const end = Math.min(page * chunkSize, imagesAmount);

  const formData = new FormData();
  formData.append('pageSize', end - start);
  formData.append('q', 'cats');
  formData.append('page', page);

  return formData;
};

const getImagesList = async (imagesAmount) => {
  const chunkSize = imagesAmount > 5000 ? 5000 : imagesAmount;
  const numChunks = Math.ceil(imagesAmount / chunkSize);
  const imageList = [];

  try {
    const responses = await Promise.all(
      Array.from({ length: numChunks }, (element, index) => {
        const formData = getFormData(index, chunkSize, imagesAmount);
        return axios.post(cheezburgerUrl, formData, {
          timeout: 1800000,
        });
      })
    );

    imageList.push(...responses.flatMap((response) => response.data.Results));
  } catch (error) {
    throw new Error(
      `Failed getting image list from ${cheezburgerUrl} (error ${error.message}).`
    );
  }

  return imageList;
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
