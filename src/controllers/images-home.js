const path = require('path');

const imagesHome = (req, res) => res.sendFile(path.join(`${__dirname}/../views/image-upload.html`));

module.exports = {
  getHome: imagesHome,
};
