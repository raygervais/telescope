const app = require('./src/app.js');

const server = app.listen(process.env.PORT || 4444);

module.exports = server;
