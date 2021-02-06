const fs = require('fs');
const express = require('express');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const { optimize, setType } = require('./image');
const { getRandomPhotoFilename } = require('./photos');

const router = express.Router();

const getRandomImageFileStream = () => fs.createReadStream(getRandomPhotoFilename());

/**
 * Support the following query params, all optional:
 *
 *  - w: the width to resize the image to. Must be 200-4592. Defaults to 800.
 *  - t: the image type to render, one of: jpeg/jpeg, png, webp, avif. Defaults to jpeg.
 */
const schema = {
  [Segments.QUERY]: Joi.object().keys({
    t: Joi.string().valid('jpeg', 'jpg', 'webp', 'png'),
    w: Joi.number().integer().min(200).max(2000),
  }),
};

const optimizeImage = (req, res) => {
  const { t, w } = req.query;

  // We use 800 for the width if none is given
  const width = w ? parseInt(w, 10) : 800;

  // Set the header and normalize the image type we'll stream
  const imageType = setType(t, res);

  // Get a file stream of a background image to use
  const stream = getRandomImageFileStream();

  // Deal with URL not being resolvable
  stream.on('error', (err) => {
    console.error(err);
    res.status(500).end();
  });

  // Optimize this image and stream back to the client
  optimize({
    imgStream: stream,
    width,
    imageType,
    res,
  }).pipe(res);
};

router.use('/', celebrate(schema), optimizeImage);
router.use(errors());

module.exports = router;
