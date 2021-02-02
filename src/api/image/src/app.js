const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const service = require('./service');

const app = express();
app.use(helmet());
app.use(cors());

// TODO: figure out how to do logging for each service...
// app.set('logger', logger);
// app.use(logger);

// Include our router with all endpoints
app.use('/', service);

// TODO: what to do with default error handler...
// app.use(errorHandler);

module.exports = app;
