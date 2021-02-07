const { getPhotos } = require('./photos');

const start = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Telescope Background Images</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="/?t=png&w=200"/>
  <style>
    main {
      display: flex
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <h1>Telescope Background Gallery</h1>
  <main>
`;

const end = `
  </main>
</body>
</html>
`;

module.exports.render = () =>
  start +
  getPhotos()
    .map((filename) => `<img src="/${filename}?w=300&h=300" />`)
    .join(' ') +
  end;
