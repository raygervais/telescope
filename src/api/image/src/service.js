const fs = require('fs');
const express = require('express');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const { optimize } = require('./image');
const { getRandomPhotoFilename, getPhotoFilename } = require('./photos');
const gallery = require('./gallery');

const router = express.Router();

const getRandomImageFileStream = () => fs.createReadStream(getRandomPhotoFilename());
const getImageFileStream = (image) => fs.createReadStream(getPhotoFilename(image));

/**
 * Support the following optional query params:
 *
 *  - w: the width to resize the image to. Must be 200-2000. Defaults to 800.
 *  - h: the height to resize the image to. Must be 200-3000. Defaults to height of image at width=800
 *  - t: the image type to render, one of: jpeg, jpg, png, webp. Defaults to jpeg.
 *
 * We also support passing an image name as a param in the URL:
 *
 * - image: should look like look '_ok8uVzL2gI.jpg'. Don't allow filenames like '../../dangerous/path/traversal'.
 */
const schema = {
  [Segments.QUERY]: Joi.object().keys({
    t: Joi.string().valid('jpeg', 'jpg', 'webp', 'png'),
    w: Joi.number().integer().min(200).max(2000),
    h: Joi.number().integer().min(200).max(3000),
  }),
  [Segments.PARAMS]: Joi.object({
    image: Joi.string().pattern(/^[-_a-zA-Z0-9]+\.jpg$/),
  }),
};

const optimizeImage = (stream, req, res) => {
  const { t, w, h } = req.query;
  const options = {
    imgStream: stream,
    // We may have a width and height, or one or the other, or neither.
    width: w ? parseInt(w, 10) : null,
    height: h ? parseInt(h, 10) : null,
    imageType: t,
    res,
  };

  // Use width=800 by default if no sizing info is specified
  if (!(options.width || options.height)) {
    options.width = 800;
  }

  // Optimize this image and stream back to the client
  optimize(options)
    .on('error', (err) => {
      console.error(err);
      res.status(500).end();
    })
    .pipe(res);
};

// If an image name is specified, use that
router.use('/:image', celebrate(schema), function (req, res) {
  const { image } = req.params;
  if (!image) {
    res.status(404).end('Not Found');
    return;
  }

  const stream = getImageFileStream(image);
  // Deal with file stream not exiting
  stream.on('error', (err) => {
    console.error(err);
    res.status(404).end();
  });

  optimizeImage(stream, req, res);
});

// Otherwise use a random image
router.use('/', celebrate(schema), function (req, res) {
  // If the client wants HTML, send a gallery of all image thumbnails instead
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.send(gallery.render());
    return;
  }

  const stream = getRandomImageFileStream();
  // Deal with URL not being resolvable
  stream.on('error', (err) => {
    console.error(err);
    res.status(500).end();
  });

  optimizeImage(stream, req, res);
});

router.use(errors());

module.exports = router;
