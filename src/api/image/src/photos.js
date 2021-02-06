const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// We put all downloaded photos in the photos/ dir
const photosDir = path.join(__dirname, '..', 'photos');

// By default we only have 1 photo available until we've downloaded the rest
let photos = ['default.jpg'];

// Download the Unsplash photos in the background, and update our list when done
function download() {
  console.log('Started downloadin Unsplash photos...');
  const filename = path.join(__dirname, '..', '/bin/unsplash-download.js');
  execFile(filename, (error, stdout, stderr) => {
    if (error) {
      console.warn('Unable to download Unsplash photos', stderr);
    } else {
      fs.readdir(photosDir, (err, photoFilenames) => {
        if (err) {
          console.warn('Unable to read downloaded photos', err);
          return;
        }
        photos = photoFilenames.filter((filename) => filename.endsWith('.jpg'));
        console.log('Finished downloading Unsplash photos.');
      });
    }
  });
}

// Get a random image filename from the photos/ directory.  Prior to download()
// being called, this will just be the default.jpg image.  Afterward it will
// be any of the Unsplash photos defined in unsplash-photos.json.
function getRandomPhotoFilename() {
  const photoFilename = photos[Math.floor(Math.random() * photos.length)];
  return path.join(photosDir, photoFilename);
}

exports.download = download;
exports.getRandomPhotoFilename = getRandomPhotoFilename;
exports.photosDir = photosDir;
