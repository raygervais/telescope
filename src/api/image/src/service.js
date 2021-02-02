const path = require('path');
const fs = require('fs');
const express = require('express');
const got = require('got');
const { celebrate, Joi, errors, Segments } = require('celebrate');

const { optimize, setType } = require('./image');

const router = express.Router();

const defaultImagePath = path.join(__dirname, '..', 'default.jpg');

const defaultImageStream = () => fs.createReadStream(defaultImagePath);

const urlImageStream = (url) => got.stream(url);

/**
 * Support the following query params, all optional:
 *
 *  - u: the image URL to download and resize. Must be absolute http/https
 *  - w: the width to resize the image to. Must be 200-4592. Defaults to 800.
 *  - t: the image type to render, one of: jpeg/jpeg, png, webp, avif. Defaults to jpeg.
 */
const schema = {
  [Segments.QUERY]: Joi.object().keys({
    t: Joi.string().valid('jpeg', 'jpg', 'webp', 'png', 'avif'),
    w: Joi.number().integer().min(200).max(4592),
    u: Joi.string().uri({
      scheme: ['http', 'https'],
    }),
  }),
};

const optimizeImage = (req, res) => {
  const { t, w, u } = req.query;

  // We use 800 for the width if none is given
  const width = w ? parseInt(w, 10) : 800;

  // Set the header and normalize the image type we'll stream
  const imageType = setType(t, res);

  // Use the provided URL or fall-back to our default image
  const stream = u ? urlImageStream(u) : defaultImageStream();

  // Deal with URL not being resolvable
  stream.on('error', (err) => {
    console.error(err);
    // 400 or 500?  The client is asking for a URL we can't get...
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
