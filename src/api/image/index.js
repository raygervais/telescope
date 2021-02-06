const app = require('./src/app.js');
const { download } = require('./src/photos');

const server = app.listen(process.env.PORT || 4444, () => {
  // Once the server is running, start downloading any missing photos
  download();
});

module.exports = server;
