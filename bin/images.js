import download from 'download';

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

const downloadImages = async (imageAmount, output) => {
  const images = await fetchImages(imageAmount);

  const promises = images.map(async (image) => {
    const imageUrl = image.ThumbnailUrl.replace('thumb400', 'full');
    await download(imageUrl, output);
  });

  await Promise.all(promises);
};

export default downloadImages;
