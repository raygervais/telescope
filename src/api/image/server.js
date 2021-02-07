const { createServer } = require('http');
const { createTerminus } = require('@godaddy/terminus');
const app = require('./src/app.js');
const { download } = require('./src/lib/photos');

const server = createServer(app);

// Graceful shutdown and /healthcheck
createTerminus(server, {
  healthChecks: {
    '/healthcheck': () => Promise.resolve(),
  },
  signal: 'SIGINT',
  logger: console.log,
});

server.listen(process.env.PORT || 4444, () => {
  // Once the server is running, start downloading any missing photos
  download();
});

module.exports = server;
