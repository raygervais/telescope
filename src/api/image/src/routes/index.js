const express = require('express');
const image = require('./image');
const gallery = require('./gallery');

const router = new express.Router();

router.use('/gallery', gallery);
router.use('/', image);

module.exports = router;
