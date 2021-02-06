const sharp = require('sharp');

// Supported image types
const JPEG = 'jpeg';
const WEBP = 'webp';
const PNG = 'png';

// TODO: logging

// https://sharp.pixelplumbing.com/api-resize
const resize = (width) => sharp({ failOnError: false }).resize({ width });

const transformers = {
  // https://sharp.pixelplumbing.com/api-output#jpeg
  [JPEG]: (width) => resize(width).jpeg(),
  // https://sharp.pixelplumbing.com/api-output#avif
  [PNG]: (width) => resize(width).png(),
  // https://sharp.pixelplumbing.com/api-output#webp
  [WEBP]: (width) => resize(width).webp(),
};

/**
 * Optimizes (and maybe resizes) the image stream, streaming back on res.
 */
function optimize({ imgStream, width = 800, imageType = JPEG, res }) {
  const transformer = transformers[imageType](width);

  // TODO: build more error handling on this...
  const transformErrorHandler = (err) => {
    console.error(err);
    res.status(500).end();
  };

  // TODO: better logging/errors
  return imgStream.pipe(transformer).on('error', transformErrorHandler);
}

/**
 * Picks the appropriate image type, sets the content type, and returns
 * the image type to use in optimize().
 */
function setType(type = JPEG, res) {
  switch (type) {
    case 'webp':
      res.type('image/webp');
      return WEBP;
    case 'png':
      res.type('image/png');
      return PNG;
    case 'jpeg':
    case 'jpg':
    default:
      res.type('image/jpeg');
      return JPEG;
  }
}

module.exports.setType = setType;
module.exports.optimize = optimize;
